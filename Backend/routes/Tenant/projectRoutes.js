const express = require('express')
const authMiddleware = require('../../middleware/authmiddleware')
const { createProject, getAllProject, getProjectById, applyProject, updateProject, deleteProject, acceptApplication } = require('../../controllers/Tenant/projectcontroller')

const router = express.Router()

router.post('/',authMiddleware,createProject)
router.get('/',authMiddleware,getAllProject)
router.get('/:id',authMiddleware,getProjectById)
//client can own update project
router.put('/update-project/:projectId',authMiddleware,updateProject)
//delete project
router.delete('/delete-project/:projectId',authMiddleware,deleteProject)


//freelancer can apply project
router.post('/apply-project',authMiddleware,applyProject)

//client can accept application and create contract
router.post('/accept-application/:applicationId',authMiddleware,acceptApplication)


module.exports = router
