const express = require('express')
const app = express()
const server = require('http').Server(app)
// require('https').S
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

const hostname = '127.0.0.1'
const port = 80

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  const roomParam = req.params.room

  if(roomParam == 'lobby'){
    res.render('lobby')
  }
  else{

    res.render('room', { roomId: roomParam })
  }
})



io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId)
    })
  })
})

server.listen(port,hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`)
})