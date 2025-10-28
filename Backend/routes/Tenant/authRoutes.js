const express = require('express')
const authMiddleware = require('../../middleware/authmiddleware')
const { userregister, userlogin } = require('../../controllers/Tenant/authcontroller')
const router = express.Router()

router.post('/',authMiddleware,userregister),
router.get('/',userlogin)

module.exports = router