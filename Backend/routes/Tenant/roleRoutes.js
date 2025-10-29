const express = require('express')
const authMiddleware = require('../../middleware/authmiddleware')
const { createRole, getRoles, updateRole, deleteRole, createFeature, assignPermission, getFeatures, getRolePermissions, deletePermission, getRolePermissionsByRole } = require('../../controllers/Tenant/rolecontroller')
const router = express.Router()

router.post('/',authMiddleware,createRole)
router.get('/',authMiddleware,getRoles)
router.put('/:id',authMiddleware,updateRole)
router.delete('/:id',authMiddleware,deleteRole)


//feature
router.post('/feature',authMiddleware,createFeature)
router.get('/feature',authMiddleware,getFeatures)

//rolePermission
router.post('/permission',authMiddleware,assignPermission)
//get rolepermission
router.get('/permission',authMiddleware,getRolePermissions)
//get rolepermission by role
router.get('/permission/:id',authMiddleware,getRolePermissionsByRole)

//delete permission
router.delete('/permission/:id',authMiddleware,deletePermission)

module.exports = router