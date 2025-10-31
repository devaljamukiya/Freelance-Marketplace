const createTenantDb = require("../../utills/createTenantDb")

const updateFreelancerProfile = async(req,res)=>{
    try{
        const {companyName, id} = req.user;
        const {FreelancerProfile} = await createTenantDb(companyName);
        // console.log(FreelancerProfile);
        
        const {skills,experience,hourlyRate,portfolioLink} = req.body;
        const profile = await FreelancerProfile.findOne({where:{userId: id}})
        if(!profile) return res.json({message:'profile are not found'});

        await profile.update({skills,experience,hourlyRate,portfolioLink})

        res.status(201).json({message:'update succesfully'})

    }
    catch(error){
        res.status(500).json({message:'error updating',error:error.message})
    }
}


const freelancerProfile = async(req,res)=>{
    try{
        const {companyName} = req.user;
        const {FreelancerProfile} = await createTenantDb(companyName);

        const profile = await FreelancerProfile.findOne({where:{userId:req.user.id}})

        res.status(201).json({message:'get succes',profile})
    }
    catch(error){
        res.status(500).json({message:'profile fetching error',error:error.message})
    }
}
module.exports = {
    updateFreelancerProfile,
    freelancerProfile
}



