const createTenantDb = require("../../utills/createTenantDb");

const updateClientProfile = async (req, res) => {
    try {
        const { companyName, id } = req.user;
        const { ClientProfile } = await createTenantDb(companyName);

        const { company, description } = req.body;
        const profile = await ClientProfile.findOne({ where: { userId: id } });
        if (!profile) return res.json({ message: 'profile not found' })

        await profile.update({ company, description });
        res.status(201).json({ message: 'update succesfully' })
    }
    catch (error) {
        res.status(500).json({ message: 'error updating', error: error.message })
    }
}

const clientProfile = async (req, res) => {
    try {
        const { companyName } = req.user;
        const { ClientProfile } = await createTenantDb(companyName);
        // console.log(ClientProfile);

        const profile = await ClientProfile.findOne({ where: { userId: req.user.id } });

        res.status(201).json({ message: 'get succes', profile })
    }
    catch (error) {
        res.status(500).json({ message: 'client profile fetching error', error: error.message })
    }
}

module.exports = {
    updateClientProfile,
    clientProfile
}