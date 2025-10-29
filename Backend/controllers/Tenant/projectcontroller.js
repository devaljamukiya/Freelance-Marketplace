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
   

        const { Project, ClientProfile } =await createTenantDb(companyName);
console.log(Project);

        const project = await Project.findByPk(id, {
            include: [{ model: ClientProfile, attributes: ["company", "description"] }],
        });
        if(!project) return res.json({message:'project not found'})
        res.status(201).json({message:'project get succesfully',project})
    }
    catch (error) {
        res.status(500).json({ message: 'project getting error', error: error.message })
    }
}

module.exports = {
    createProject,
    getAllProject,
    getProjectById
}