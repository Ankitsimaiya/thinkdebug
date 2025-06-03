import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDb from './src/config/database.js'
import userRoutes from './src/route/user.routes.js'
import http from 'http'
import { Server as SocketIO } from 'socket.io'

import auditRoutes from './src/route/auditlog.routes.js'
import orgRoutes from './src/route/org.routes.js'
import fileRoutes from './src/route/file.route.js'
import { setSocketIO } from './src/controller/file.controller.js'

const PORT = process.env.PORT || 3000

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

connectDb()

app.get('/', (req, res) => {
  return res.json({ message: 'welcome' })
})

app.use('/auth', userRoutes)
app.use('/audit', auditRoutes)
app.use('/orgs', orgRoutes)
app.use('/files', fileRoutes)

const server = http.createServer(app)
const io = new SocketIO(server, {
  cors: { origin: '*' }
})

setSocketIO(io)

io.on('connection', socket => {
  console.log('User connected:', socket.id)

  socket.on('joinRoom', room => {
    socket.join(room)
    console.log(`Socket ${socket.id} joined room: ${room}`)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

server.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`)
})
