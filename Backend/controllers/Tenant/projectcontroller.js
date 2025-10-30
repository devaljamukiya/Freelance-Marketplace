const createTenantDb = require("../../utills/createTenantDb");


//only client can create project
const createProject = async (req, res) => {
    try {
        const { companyName, roleName, id } = req.user;
        const { Project, ClientProfile } = await createTenantDb(companyName);

        if (roleName.toLowerCase() !== "client") {
            return res.status(403).json({ message: "Only clients can create projects." });
        }

        const clientProfile = await ClientProfile.findOne({ where: { userId: id } });
        if (!clientProfile) return res.json({ message: 'clientprofile are not found' });

        const { title, description, type, budget } = req.body

        const project = await Project.create({
            title, description, type, budget, clientId: clientProfile.id
        })
        res.status(201).json({ message: 'project create succesfully', project })
    }
    catch (error) {
        res.status(500).json({ message: 'project creating error', error: error.message })
    }
}


//freelancer get all project
const getAllProject = async (req, res) => {
    try {
        const { companyName, roleName } = req.user;
        console.log(companyName, roleName);

        const { Project, ClientProfile } = await createTenantDb(companyName);

        // Freelancers can view all open projects
        if (roleName.toLowerCase() === "freelancer") {
            const projects = await Project.findAll({
                where: { status: "open" },
                include: [{ model: ClientProfile, attributes: ["company", "description"] }],
            });

            return res.status(200).json({ projects });
        }

        //client can view also own project
        if (roleName.toLowerCase() === "client") {
            const { id } = req.user;
            const { ClientProfile } = await createTenantDb(companyName);
            const clientProfile = await ClientProfile.findOne({ where: { userId: id } });

            if (!clientProfile) return res.status(404).json({ message: "Client profile not found." });

            const projects = await Project.findAll({ where: { clientId: clientProfile.id } });
            return res.status(200).json({ projects });
        }

        res.status(403).json({ message: "Unauthorized to view projects." });

    }
    catch (error) {
        res.status(500).json({ message: 'project getting error', error: error.message })
    }
}

const getProjectById = async (req, res) => {
    try {
        const { companyName } = req.user;

        const { id } = req.params;


        const { Project, ClientProfile } = await createTenantDb(companyName);
        console.log(Project);

        const project = await Project.findByPk(id, {
            include: [{ model: ClientProfile, attributes: ["company", "description"] }],
        });
        if (!project) return res.json({ message: 'project not found' })
        res.status(201).json({ message: 'project get succesfully', project })
    }
    catch (error) {
        res.status(500).json({ message: 'project getting error', error: error.message })
    }
}

//only client can update project
const updateProject = async (req, res) => {
    try {
        const { companyName, roleName, id } = req.user;
        // console.log(companyName, roleName, id);
        const { Project, ClientProfile } = await createTenantDb(companyName);
        const { projectId } = req.params;

        if (roleName.toLowerCase() !== "client") return res.json({ message: 'only client can update project' })

        const clientprofile = await ClientProfile.findOne({ where: { userId: id } });
        const project = await Project.findOne({ where: { id: projectId, clientId: clientprofile.id } });

        if (!project) return res.json({ message: 'Project not found or not owned by you.' });

        await project.update(req.body);
        res.status(201).json({ message: 'project update succesfully', project })
    }
    catch (error) {
        res.status(500).json({ message: 'project updating error', error: error.message });
    }
}


//client can delete project
const deleteProject = async (req, res) => {
    try {
        const { companyName, roleName, id } = req.user;
        console.log(companyName, roleName, id);

        const { projectId } = req.params;
        const { Project, ClientProfile } = await createTenantDb(companyName);

        if (roleName.toLowerCase() !== "client" && roleName.toLowerCase() !== "admin") {
            return res.json({ message: 'only client and admin can delete project' })
        }

        // else if (roleName.toLowerCase() !== "Admin") {
        //     return res.json({ message: 'only client and Admin can delete project' })
        // }
        let project;

        if (roleName.toLowerCase() === "admin") {
            project = await Project.findByPk(projectId);
        } else {
            const clientProfile = await ClientProfile.findOne({ where: { userId: id } });
            if (!clientProfile) return res.status(404).json({ message: 'Client profile not found' });

            project = await Project.findOne({
                where: {
                    id: projectId,
                    clientId: clientProfile.id
                }
            });
        }
        if (!project) return res.json({ message: 'Project not found or not owned by you.' });

        await project.destroy();
        res.status(201).json({ message: 'project delete succesfully' })

    }
    catch (error) {
        res.status(500).json({ message: 'project deleting error', error: error.message })
    }
}

const applyProject = async (req, res) => {
    try {
        const { companyName, roleName, id } = req.user;
        const { projectId, proposal } = req.body;

        if (roleName.toLowerCase() !== "freelancer") return res.json({ message: 'only freelancer can apply ' })

        const { Application, FreelancerProfile, Project } = await createTenantDb(companyName);
        const freelancerProfile = await FreelancerProfile.findOne({ where: { userId: id } });

        if (!freelancerProfile) return res.json({ message: 'freelancer profile not found' });

        const project = await Project.findByPk(projectId);
        if (!project) return res.json({ message: 'Project Not found' });
        if (project.status !== "open") return res.json({ message: 'project not open ' });

        //check alerady applied
        const exsting = await Application.findOne({
            where: { projectId, freelancerId: freelancerProfile.id },
        })
        if (exsting) return res.json({ message: 'you have alerady applied' })

        const application = await Application.create({
            projectId,
            freelancerId: freelancerProfile.id,
            proposal,
            status: "pending",
        })
        res.status(201).json({ message: 'application submit succesfully', application })
    }
    catch (error) {
        res.status(500).json({ message: 'project appplyting error', error: error.message })
    }
}

//client accept application and create contract
const acceptApplication = async (req, res) => {
    try {
        const { companyName, roleName, id } = req.user;
        const { applicationId } = req.params;

        if (roleName.toLowerCase() !== "client") {
            return res.json({ message: 'only client can accepting application ' })
        }

        const { Application, Project, FreelancerProfile, ClientProfile, Contract } = await createTenantDb(companyName);

        const application = await Application.findByPk(applicationId)
        if (!application) return res.json({ message: 'application not found' })

        const clientProfile = await ClientProfile.findOne({ where: { userId: id } });
        const project = await Project.findByPk(application.projectId);

        if (!project || project.clientId !== clientProfile.id)
            return res.status(403).json({ message: "You don’t own this project." });

        // Update statuses
        await application.update({ status: "accepted" });
        await project.update({ status: "in-progress" });

        // Create contract
        const contract = await Contract.create({
            projectId: project.id,
            freelancerId: application.freelancerId,
            clientId: clientProfile.id,
            type: project.type,
            status: "active",
        });
        res.status(201).json({ message: 'application accept and contract create succesfully', contract })

    }
    catch (error) {
        res.status(500).json({ message: 'application accepting error', error: error.message })
    }
}
module.exports = {
    createProject,
    getAllProject,
    getProjectById,
    updateProject,
    deleteProject,
    applyProject,
    acceptApplication
}