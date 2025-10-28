const createTenantDb = require("../../utills/createTenantDb");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userregister = async (req, res) => {
    try {
        const { companyName } = req.user;
        const { name, email, password, roleName } = req.body;

        const { User, Role } = await createTenantDb(companyName);

        const existing = await User.findOne({ where: { email } });
        if (existing) return res.json({ message: 'email already exists' });

        const role = await Role.findOne({ where: { name: roleName } });
        if (!role) return res.json({ message: 'invalid role' });

        const hash = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hash, roleId: role.id })
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
        
        const { email, password,companyName } = req.body;

        const { User, Role } = await createTenantDb(companyName);

        const user = await User.findOne({ where: { email } });
        console.log(user);
        if (!user) return res.json({ message: 'invalid creditional' })
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.json({ message: 'invalid password' });

        const role = await Role.findByPk(user.roleId)
        
        const token = jwt.sign({ id: user.id, email: user.email, companyName, roleId: role.id, roleName: role.name, }, process.env.TOKEN_SECRET, { expiresIn: "2h" });

        res.status(201).json({message:'user login succesfully',token})

    }
    catch (error) {
        res.status(500).json({ message: 'login failed', error: error.message })
    }
}

module.exports = {
    userregister,
    userlogin
}