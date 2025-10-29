
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
        res.status(201).json({ message: 'role create succesfully', role })
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
        const { Role } = await createTenantDb(companyName)
        console.log(Role);

        const { id } = req.params;
        const { name } = req.body;

        const role = await Role.findByPk(id)

        if (!role) return res.json({ message: 'role not found' })

        await role.update({ name })
        res.status(201).json({ message: 'role update succesfully' })
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
        res.status(201).json({ message: 'role delete succesfully' })

    }
    catch (error) {
        res.status(500).json({ message: 'error deleting', error: error.message })
    }
}


//feature 

const createFeature = async (req, res) => {
    try {
        const { companyName } = req.user;
        const { Feature } = await createTenantDb(companyName);

        const { name, description } = req.body;
        if (!name) return res.json({ message: 'Feature name is required' });

        const existing = await Feature.findOne({ where: { name } });
        if (existing) return res.json({ message: 'Feature already exists' });

        const feature = await Feature.create({ name, description });
        res.status(201).json({ message: 'Feature created successfully', feature });
    } catch (error) {
        res.status(500).json({ message: 'Error creating feature', error: error.message });
    }
};

const getFeatures = async (req, res) => {
    try {
        const { companyName } = req.user;
        const { Feature } = await createTenantDb(companyName);
        const features = await Feature.findAll();
        res.status(200).json({ features });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching features', error: error.message });
    }
};


// rolePermission

const assignPermission = async (req, res) => {
    try {
        const { companyName } = req.user;
        const { Role, Feature, RolePermission } = await createTenantDb(companyName);

        const { roleId, featureId, canView, canInsert, canUpdate, canDelete } = req.body;

        if (!roleId || !featureId) return res.json({ message: 'roleId and featureId are required' });

        const role = await Role.findByPk(roleId);
        if (!role) return res.json({ message: 'Role not found' });

        const feature = await Feature.findByPk(featureId);
        if (!feature) return res.json({ message: 'Feature not found' });

        const existing = await RolePermission.findOne({ where: { roleId, featureId } });

        if (existing) {
            await existing.update({ canView, canInsert, canUpdate, canDelete });
            return res.status(200).json({ message: 'Permission updated successfully', permission: existing });
        }

        const permission = await RolePermission.create({
            roleId,
            featureId,
            canView,
            canInsert,
            canUpdate,
            canDelete
        });

        res.status(201).json({ message: 'Permission assigned successfully', permission });
    } catch (error) {
        res.status(500).json({ message: 'Error assigning permission', error: error.message });
    }
};

const getRolePermissions = async (req, res) => {
    try {
        const { companyName } = req.user;
        const { Role, Feature, RolePermission } = await createTenantDb(companyName);

        const permissions = await RolePermission.findAll({
            include: [
                { model: Role, attributes: ['id', 'name'] },
                { model: Feature, attributes: ['id', 'name', 'description'] }
            ]
        });

        res.status(200).json({ permissions });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching permissions', error: error.message });
    }
};

const getRolePermissionsByRole = async (req, res) => {
    try {
        const { companyName } = req.user;
        const { RolePermission, Feature } = await createTenantDb(companyName);

        // const { roleId } = req.params;
        const permissions = await RolePermission.findAll({
            where: { roleId:req.params },
            include: [{ model: Feature, attributes: ['id', 'name', 'description'] }]
        });

        res.status(200).json({ permissions });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching role permissions', error: error.message });
    }
};

const deletePermission = async (req, res) => {
    try {
        const { companyName } = req.user;
        const { RolePermission } = await createTenantDb(companyName);

        const { id } = req.params;

        const permission = await RolePermission.findByPk(id);
        if (!permission) return res.status(404).json({ message: 'Permission not found' });

        await permission.destroy();
        res.status(200).json({ message: 'Permission deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting permission', error: error.message });
    }
};



module.exports = {
    createRole,
    getRoles,
    updateRole,
    deleteRole,
    createFeature,
    getFeatures,
    assignPermission,
    getRolePermissions,
    getRolePermissionsByRole,
    deletePermission
}