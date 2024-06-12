const express = require('express')
const app = express()
const path = require('path')
const hbs = require('hbs');
const PORT = 4444;
const mongoose = require('mongoose')
const axios = require('axios')
const { createServer } = require('http');
const { Server } = require('socket.io');
const httpServer = createServer(app);
const io = new Server(httpServer)

const Users = require('./models/user');
const Message = require('./models/message');
const { timeStamp } = require('console');

app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static(path.join(__dirname, 'Public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/',(req,res)=>{
    res.render('index');
})

app.post('/user_data',async (req,res)=>{
    let {username,password} = req.body;
    let user = await Users.findOne({username});
    console.log(user);  
    if(user == null){
        await Users.create({username,password});
    }
    else{
        await Users.findOneAndUpdate({username},{password});
    }
    req.username = username;
    res.redirect(`/chat/${username}`);
})

app.get('/chat/:username',async (req,res)=>{
    let {username} = req.params;
    res.render('chat',{
        username
    });
})

app.post('/fetch_messages',async (req,res)=>{
    let {person1} =  req.body;
    let {person2} = req.body;
    console.log(req.body);
    let data = await Message.find({
        $or: [
            { $and: [{ sender: person1}, { receiver: person2 }] },
            { $and: [{ sender: person2 }, { receiver: person1 }] }
        ]
    })
    .sort({ timeStamp: -1 })
    .limit(10)
    .exec();
    console.log(data);
    res.send(data);
})

app.post('/add_message',async(req,res)=>{
    let {sender,receiver,message} = req.body;
    await Message.create({sender,receiver,message});
    res.send('done');
})

let usermap = {};

io.on("connection",(socket)=>{
    socket.on('newuser',async ({username})=>{
        console.log(username,"hello");
        usermap[socket.id] = username;
        let userlist = await Users.find({});
        userlist = userlist.map(val => val.username );
        io.emit('newUserAdded',{
            socketid:socket.id,
            userlist
        });
    })
})

mongoose.connect('mongodb+srv://adityagauraa:n7V0HZbvtMzexF8n@cluster0.jthrayr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(async () => {
        httpServer.listen(PORT);
    })
    .catch(err => console.log(err));

