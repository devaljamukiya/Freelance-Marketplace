const express = require('express')
const authMiddleware = require('../../middleware/authmiddleware')
const { updateClientProfile, clientProfile } = require('../../controllers/Tenant/clientcontroller')

const router = express.Router()

router.put('/',authMiddleware,updateClientProfile)
router.get('/',authMiddleware,clientProfile)

module.exports = router