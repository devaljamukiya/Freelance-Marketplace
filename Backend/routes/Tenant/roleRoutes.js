const express = require('express')
const authMiddleware = require('../../middleware/authmiddleware')
const { createRole, getRoles, updateRole, deleteRole } = require('../../controllers/Tenant/rolecontroller')
const router = express.Router()

router.post('/',authMiddleware,createRole)
router.get('/',authMiddleware,getRoles)
router.put('/:id',authMiddleware,updateRole)
router.delete('/:id',authMiddleware,deleteRole)

module.exports = router