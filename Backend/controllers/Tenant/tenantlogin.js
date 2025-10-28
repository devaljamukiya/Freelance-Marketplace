const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Tenant = require('../../models/Master/Tenant');
const role = require('../../models/Tenant/role');

const tenantLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const tenant = await Tenant.findOne({ where: { email } });
        if (!tenant) return res.json({ message: 'tenant not found' })
        if(!tenant.isVerified) return res.json({message:'tenant is not verified'});

        const match = await bcrypt.compare(password,tenant.password)
        if(!match) return res.json({message:'invalid password'})
        
        const token = jwt.sign({id:tenant.id,companyName:tenant.companyName,role:'tenantAdmin'},process.env.TOKEN_SECRET,{expiresIn:'1h'})

        res.status(201).json({message:'login succesful',token,tenant: {
        id: tenant.id,
        name: tenant.name,
        companyName: tenant.companyName,
        email: tenant.email,
      },})


    }
    catch(error){
        res.status(500).json({message:'tenant login error',error:error.message})
    }
}

module.exports = {
    tenantLogin
}