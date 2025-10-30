require('dotenv').config()
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const { dbconnection } = require('./config/db')
const app = express()
const server = http.createServer(app)
const io = new Server(server, {
     cors: {
          origin: "http://localhost:5173",
          methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
          credentials: true,
     }
})
const PORT = process.env.PORT || 3000




app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req,res,next)=>{
     req.io =io;
     next()
})


require('./models/Master/MasterAdmin')
require('./models/Master/Plane')
require('./models/Master/Tenant')
const masterroutes = require('./routes/Master/MasterRoutes')
app.use('/master', masterroutes)

const tenantLogin = require('./routes/Tenant/tenantLogin')
app.use('/tenant', tenantLogin)

const roleRoutes = require('./routes/Tenant/roleRoutes')
app.use('/role', roleRoutes)

const authroutes = require('./routes/Tenant/authRoutes')
app.use('/auth', authroutes)

const freelancer = require('./routes/Tenant/freelancerRoutes')
app.use('/freelancer', freelancer)

const client = require('./routes/Tenant/clientRoutes')
app.use('/client', client)

const projectRoutes = require('./routes/Tenant/projectRoutes')
app.use('/project', projectRoutes)

const messageRoutes = require('./routes/Tenant/messageRoutes')
app.use('/message',messageRoutes)
//database
dbconnection()

io.on("connection",(socket)=>{
     console.log('new user connected',socket.id);

     //join personal room
     socket.on("join_room",(user_id)=>{
          socket.join(user_id.toString());
          console.log(`User ${user_id} join room `); 
     })

//      //static data send
// socket.on("send_message",(data)=>{
//           io.emit("receive_message", data);
//      });
     socket.on("send_message",(data)=>{
          io.to(data.receiverId.toString()).emit("receive_message", data);
     });

     socket.on("disconnect",()=>{
          console.log('user disconnect',socket.id);   
     });
});

server.listen(PORT, async () => {
     console.log(`Server running on http://localhost:${PORT}`)
})
