
const createTenantDb = require("../../utills/createTenantDb");


const createRole = async (req, res) => {
    try {
        const { companyName } = req.user;
        const { Role } = await createTenantDb(companyName);
        // console.log(Role);
        
        const { name } = req.body;
        if (!name) return res.json({ message: 'role name is required' });
        
        const existing = await Role.findOne({ where: { name } })
        if (existing) return res.json({ message: 'role alerady exists' })
            
            const role = await Role.create({ name })
        res.status(201).json({ message: 'role create succesfully',role })
    }
    catch (error) {
        res.status(500).json({ message: 'role creating error', error: error.message })
    }
}

const getRoles = async (req, res) => {
    try {
        const { companyName } = req.user
        const { Role } = await createTenantDb(companyName)
console.log(Role);

         const role = await Role.findAll()
        res.status(201).json(role)

    }
    catch (error) {
        res.status(500).json({ message: 'role fetching error', error: error.message })
    }
}

const updateRole = async (req, res) => {
    try {
        const { companyName } = req.user;
        const {Role} = await createTenantDb(companyName)
console.log(Role);

        const { id } = req.params;
        const { name } = req.body;

        const role = await Role.findByPk(id)
      
        if (!role) return res.json({ message: 'role not found' })

        await role.update({ name })
        res.status(201).json({ message: 'role update succesfully'})
    }
    catch (error) {
        res.status(500).json({ message: 'role updating error', error: error.message })
    }
}

const deleteRole = async (req, res) => {
    try {
        const { companyName } = req.user;
        const { Role } = await createTenantDb(companyName)

        const { id } = req.params

        const role = await Role.findByPk(id);
        if (!role) return res.status(404).json({ message: 'Role not found' });
        await role.destroy()
        res.status(201).json({message:'role delete succesfully'})

    }
    catch (error) {
        res.status(500).json({ message: 'error deleting', error: error.message })
    }
}
module.exports = {
    createRole,
    getRoles,
    updateRole,
    deleteRole
}