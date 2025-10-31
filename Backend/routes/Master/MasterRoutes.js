const express = require('express')
const { MasterLogin, createTenant, verifyTenant, setPassword } = require('../../controllers/Master/Masteradmin')
const { createPlane, updatePlane, deletePlane } = require('../../controllers/Master/planecontroller')
const authMiddleware = require('../../middleware/authmiddleware')
const router = express.Router()

router.post('/',MasterLogin)

//subscription plane routes
router.post('/plane',authMiddleware,createPlane)
router.put('/plane/:id',authMiddleware,updatePlane)
router.delete('/plane/:id',authMiddleware,deletePlane)


//tenant crud
router.post('/tenant',authMiddleware,createTenant)
router.get('/tenant/verify/',verifyTenant)
router.post('/tenant/set-password',setPassword)

module.exports = router


