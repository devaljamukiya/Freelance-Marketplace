const express = require('express')
const authMiddleware = require('../../middleware/authmiddleware')
const { sendMessage, getMessage } = require('../../controllers/Tenant/messagecontroller')

const router = express.Router()

router.post('/',authMiddleware,sendMessage);
router.post('/get',authMiddleware,getMessage)

module.exports = router