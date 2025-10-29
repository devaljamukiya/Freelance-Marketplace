const express = require('express')
const authMiddleware = require('../../middleware/authmiddleware')
const { updateFreelancerProfile, freelancerProfile } = require('../../controllers/Tenant/freelancercontroller')
const router = express.Router()

router.put('/',authMiddleware,updateFreelancerProfile)
router.get('/',authMiddleware,freelancerProfile)

module.exports = router