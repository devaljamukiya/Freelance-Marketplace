const createTenantDb = require("../../utills/createTenantDb");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const Tenant = require("../../models/Master/Tenant");
const Plane = require("../../models/Master/Plane");

const userregister = async (req, res) => {
    try {
        const { companyName } = req.user;
        // console.log(companyName);
        const { name, email, password, roleName } = req.body;

        // Get tenant record
        const tenant = await Tenant.findOne({ where: { companyName } });
        if (!tenant) return res.status(404).json({ message: "Tenant not found" });

        // Get the plan associated with this tenant
        const plane = await Plane.findOne({ where: { id: tenant.planId } });
        if (!plane) return res.status(404).json({ message: "Plan not found" });

        const { User, Role, FreelancerProfile, ClientProfile } = await createTenantDb(companyName);

        // Count existing users in tenant DB
        const userCount = await User.count();

        // Check user limit
        if (userCount >= plane.userLimit) {
            return res.status(403).json({
                message: `User limit reached! Your plan allows only ${plane.userLimit} users.`,
            });
        }

        //existing email
        const existing = await User.findOne({ where: { email } });
        if (existing) return res.json({ message: 'email already exists' });
        //role
        const role = await Role.findOne({ where: { name: roleName } });
        if (!role) return res.json({ message: 'invalid role' });

        const hash = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hash, roleId: role.id })
        //create role-base profile
        if (roleName.toLowerCase() === "freelancer") {
            await FreelancerProfile.create({ userId: user.id });
        } else if (roleName.toLowerCase() === "client") {
            await ClientProfile.create({ userId: user.id });
        }
        res.status(201).json({ message: 'user create succesfully', user })
    }
    catch (error) {
        res.status(500).json({ message: 'user creating error', error: error.message })
    }
}

const userlogin = async (req, res) => {
    try {
        // const { companyName } = req.query;
        // console.log(companyName);

        const { email, password, companyName } = req.body;

        const { User, Role,RolePermission } = await createTenantDb(companyName);

        const user = await User.findOne({ where: { email } });
        console.log(user);
        if (!user) return res.json({ message: 'invalid creditional' })
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.json({ message: 'invalid password' });

        const role = await Role.findByPk(user.roleId)

        const rolepermission = await RolePermission.findAll()
        console.log(rolepermission);
        
        const token = jwt.sign({ id: user.id, email: user.email, companyName, roleId: role.id, roleName: role.name, rolepermission}, process.env.TOKEN_SECRET, { expiresIn: "2h" });

        res.status(201).json({ message: 'user login succesfully', token,rolepermission })

    }
    catch (error) {
        res.status(500).json({ message: 'login failed', error: error.message })
    }
}

module.exports = {
    userregister,
    userlogin
}