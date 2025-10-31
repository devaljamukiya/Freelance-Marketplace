const Plane = require("../../models/Master/Plane");


const createPlane = async (req, res) => {
    try {
        const { name, price, durationInDay, features,userLimit } = req.body;

        const existingPlane = await Plane.findOne({ where: { name } })
        if (existingPlane) return res.json({ message: 'plane already existing' })
        const plane = await Plane.create({
            name, price, durationInDay, features, userLimit
        })
        res.status(201).json({message:'plane create succesfully'})
    }
    catch (error) {
        res.status(500).json({ message: 'plane creating error', error: error.message })
    }
}

const updatePlane = async(req,res)=>{
    try{
        const {price, durationInday, features} = req.body

        const update = await Plane.update({
            price, durationInday, features
        },{
            where:{
                id:req.params.id
            }
        })
        res.status(201).json({message:'plane update succesfully'})

    }
    catch(error){
        res.status(500).json({message:'plane updating error',error:error.message})
    }
}

const deletePlane = async(req,res)=>{
    try{
        const {id} = req.params
        const deleteplane = await Plane.destroy({where:{id:id}})
        if(!deletePlane) return res.json({message:'plane not found '})
        
        res.status(201).json({message:'plane delete succesfully',deleteplane})
    }
    catch(error){
        res.status(500).json({message:'error',error:error.message})
    }
}

const getAllPlanes = async (req, res) => {
  try {
    const planes = await Plane.findAll({
      order: [["id", "ASC"]],
    });

    if (!planes || planes.length === 0)
      return res.status(404).json({ message: "No planes found" });

    res.status(200).json({ message: "Planes fetched successfully", planes });
  } catch (error) {
    res.status(500).json({ message: "Error fetching planes", error: error.message });
  }
};

module.exports = {
    createPlane,
    updatePlane,
    deletePlane,
    getAllPlanes
}