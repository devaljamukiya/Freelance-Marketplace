const express = require('express')
const { tenantLogin } = require('../../controllers/Tenant/tenantlogin')
const router = express.Router()

router.get('/',tenantLogin)

module.exports = router 