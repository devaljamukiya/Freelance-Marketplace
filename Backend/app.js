require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { dbconnection } = require('./config/db')
const app = express()
const PORT = process.env.PORT || 3000



app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

require('./models/Master/MasterAdmin')
require('./models/Master/Plane')
require('./models/Master/Tenant')
const masterroutes = require('./routes/Master/MasterRoutes')
app.use('/master',masterroutes)

const tenantLogin = require('./routes/Tenant/tenantLogin')
app.use('/tenant',tenantLogin)

const roleRoutes = require('./routes/Tenant/roleRoutes')
app.use('/role',roleRoutes)

const authroutes = require('./routes/Tenant/authRoutes')
app.use('/auth',authroutes)

const freelancer = require('./routes/Tenant/freelancerRoutes')
app.use('/freelancer',freelancer)

const client = require('./routes/Tenant/clientRoutes')
app.use('/client',client)

const projectRoutes = require('./routes/Tenant/projectRoutes')
app.use('/project',projectRoutes)

//database
dbconnection()

app.listen(PORT, async()=>{
     console.log(`Server running on http://localhost:${PORT}`)
})
