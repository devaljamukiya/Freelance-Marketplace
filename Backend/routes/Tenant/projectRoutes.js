const express = require('express')
const authMiddleware = require('../../middleware/authmiddleware')
const { createProject, getAllProject, getProjectById } = require('../../controllers/Tenant/projectcontroller')

const router = express.Router()

router.post('/',authMiddleware,createProject)
router.get('/',authMiddleware,getAllProject)
router.get('/:id',authMiddleware,getProjectById)


module.exports = router
