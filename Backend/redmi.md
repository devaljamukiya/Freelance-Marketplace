const createTenantDb = require("../../utills/createTenantDb");


// 🧱 CLIENT: Create Project
const createProject = async (req, res) => {
    try {
        const { companyName, roleName, id } = req.user;
        const { Project, ClientProfile } = await createTenantDb(companyName);

        if (roleName.toLowerCase() !== "client") {
            return res.status(403).json({ message: "Only clients can create projects." });
        }

        // Find the client's profile
        const clientProfile = await ClientProfile.findOne({ where: { userId: id } });
        if (!clientProfile) return res.status(404).json({ message: "Client profile not found." });

        const { title, description, type, budget } = req.body;

        const project = await Project.create({
            title,
            description,
            type,
            budget,
            clientId: clientProfile.id,
        });

        res.status(201).json({ message: "Project created successfully.", project });
    } catch (error) {
        res.status(500).json({ message: "Error creating project.", error: error.message });
    }
};



// 📖 FREELANCER: View All Projects
const getAllProjects = async (req, res) => {
    try {
        const { companyName, roleName } = req.user;
        const { Project, ClientProfile } = await createTenantDb(companyName);

        // Freelancers can view all open projects
        if (roleName.toLowerCase() === "freelancer") {
            const projects = await Project.findAll({
                where: { status: "open" },
                include: [{ model: ClientProfile, attributes: ["company", "description"] }],
            });
            return res.status(200).json({ projects });
        }

        // Clients can view only their own projects
        if (roleName.toLowerCase() === "client") {
            const { id } = req.user;
            const { ClientProfile } = await createTenantDb(companyName);
            const clientProfile = await ClientProfile.findOne({ where: { userId: id } });

            if (!clientProfile) return res.status(404).json({ message: "Client profile not found." });

            const projects = await Project.findAll({ where: { clientId: clientProfile.id } });
            return res.status(200).json({ projects });
        }

        res.status(403).json({ message: "Unauthorized to view projects." });
    } catch (error) {
        res.status(500).json({ message: "Error fetching projects.", error: error.message });
    }
};



// 🔍 FREELANCER: View One Project by ID
const getProjectById = async (req, res) => {
    try {
        const { companyName } = req.user;
        const { id } = req.params;
        const { Project, ClientProfile } = await createTenantDb(companyName);

        const project = await Project.findByPk(id, {
            include: [{ model: ClientProfile, attributes: ["company", "description"] }],
        });

        if (!project) return res.status(404).json({ message: "Project not found." });

        res.status(200).json({ project });
    } catch (error) {
        res.status(500).json({ message: "Error fetching project.", error: error.message });
    }
};



// 📝 FREELANCER: Apply to Project (create Application)
const applyToProject = async (req, res) => {
    try {
        const { companyName, roleName, id } = req.user;
        const { projectId, proposal } = req.body;

        if (roleName.toLowerCase() !== "freelancer") {
            return res.status(403).json({ message: "Only freelancers can apply to projects." });
        }

        const { Application, FreelancerProfile, Project } = await createTenantDb(companyName);

        const freelancerProfile = await FreelancerProfile.findOne({ where: { userId: id } });
        if (!freelancerProfile) return res.status(404).json({ message: "Freelancer profile not found." });

        const project = await Project.findByPk(projectId);
        if (!project) return res.status(404).json({ message: "Project not found." });
        if (project.status !== "open") return res.status(400).json({ message: "Project is not open for applications." });

        // Check if already applied
        const existing = await Application.findOne({
            where: { projectId, freelancerId: freelancerProfile.id },
        });
        if (existing) return res.status(400).json({ message: "You have already applied to this project." });

        const application = await Application.create({
            projectId,
            freelancerId: freelancerProfile.id,
            proposal,
            status: "pending",
        });

        res.status(201).json({ message: "Application submitted successfully.", application });
    } catch (error) {
        res.status(500).json({ message: "Error applying to project.", error: error.message });
    }
};



// ✏️ CLIENT: Update Project
const updateProject = async (req, res) => {
    try {
        const { companyName, roleName, id } = req.user;
        const { Project, ClientProfile } = await createTenantDb(companyName);
        const { projectId } = req.params;

        if (roleName.toLowerCase() !== "client") {
            return res.status(403).json({ message: "Only clients can update projects." });
        }

        const clientProfile = await ClientProfile.findOne({ where: { userId: id } });
        const project = await Project.findOne({ where: { id: projectId, clientId: clientProfile.id } });

        if (!project) return res.status(404).json({ message: "Project not found or not owned by you." });

        await project.update(req.body);
        res.status(200).json({ message: "Project updated successfully.", project });
    } catch (error) {
        res.status(500).json({ message: "Error updating project.", error: error.message });
    }
};



// ❌ CLIENT: Delete Project
const deleteProject = async (req, res) => {
    try {
        const { companyName, roleName, id } = req.user;
        const { projectId } = req.params;
        const { Project, ClientProfile } = await createTenantDb(companyName);

        if (roleName.toLowerCase() !== "client") {
            return res.status(403).json({ message: "Only clients can delete projects." });
        }

        const clientProfile = await ClientProfile.findOne({ where: { userId: id } });
        const project = await Project.findOne({ where: { id: projectId, clientId: clientProfile.id } });

        if (!project) return res.status(404).json({ message: "Project not found or not owned by you." });

        await project.destroy();
        res.status(200).json({ message: "Project deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error deleting project.", error: error.message });
    }
};



// 🤝 CLIENT: Accept Application → Create Contract
const acceptApplication = async (req, res) => {
    try {
        const { companyName, roleName, id } = req.user;
        const { applicationId } = req.params;

        if (roleName.toLowerCase() !== "client") {
            return res.status(403).json({ message: "Only clients can accept applications." });
        }

        const { Application, Project, FreelancerProfile, ClientProfile, Contract } = await createTenantDb(companyName);

        const application = await Application.findByPk(applicationId);
        if (!application) return res.status(404).json({ message: "Application not found." });

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

        res.status(201).json({
            message: "Application accepted and contract created.",
            contract,
        });
    } catch (error) {
        res.status(500).json({ message: "Error accepting application.", error: error.message });
    }
};



module.exports = {
    createProject,
    getAllProjects,
    getProjectById,
    applyToProject,
    updateProject,
    deleteProject,
    acceptApplication
};
