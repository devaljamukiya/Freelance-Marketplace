const express = require('express')
const { MasterLogin, createTenant, verifyTenant, setPassword, getAllTenants } = require('../../controllers/Master/Masteradmin')
const { createPlane, updatePlane, deletePlane, getAllPlanes } = require('../../controllers/Master/planecontroller')
const authMiddleware = require('../../middleware/authmiddleware')
const router = express.Router()

router.post('/',MasterLogin)

//subscription plane routes
router.post('/plane',authMiddleware,createPlane)
router.get('/',authMiddleware,getAllPlanes)
router.put('/plane/:id',authMiddleware,updatePlane)
router.delete('/plane/:id',authMiddleware,deletePlane)



//tenant crud
router.post('/tenant',authMiddleware,createTenant)
router.get('/tenant/verify/',verifyTenant)
router.post('/tenant/set-password',setPassword)

//get all tenant
router.get('/tenant/',authMiddleware,getAllTenants)

module.exports = router


