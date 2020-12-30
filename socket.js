const { addUser,
        removeUser,
        getUser,
        getUsersInRoom } = require('./lib/users.js');
const {
        generateMsg
      } = require('./lib/messages.js');

module.exports = (io) => {
  //io handling
  io.on('connection', (socket) => {
    console.log('a user connected');
    socket.emit('message',generateMsg("Welcome!","ChatBot"));

    //join for every Room
    socket.on('join',({username , room}, ack) => {
        const {error , user} = addUser({id : socket.id , username, room});
        // Error reporting
        if(error) {
          return ack(error);
        }
        socket.join(user.room);
        socket.broadcast.to(user.room).emit('message' , generateMsg(`${user.username} has joined.`,"ChatBot"));

        //Send Room data
        io.to(user.room).emit('roomData' , {
          room : user.room,
          users : getUsersInRoom(user.room)
        })
        ack();
    });

    socket.on('sendMessage',(msg,ack) => {
      console.log(msg);
      const user = getUser(socket.id);
      io.to(user.room).emit('message',generateMsg(msg,user.username));
      ack();
    });

    socket.on('disconnect', () => {
      const user = removeUser(socket.id);
      if(user) {
        //Send Room data
        io.to(user.room).emit('roomData' , {
          room : user.room,
          users : getUsersInRoom(user.room)
        })
        io.to(user.room).emit('message' ,generateMsg(`${user.username} has left!`));
      }
    });
  });
}
