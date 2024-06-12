let username1;
const socket = io();
let receiver;
let relement;
setTimeout(()=>{
    console.log(username1);
    console.log(socket.id);
    username1 = $('#username').text().split(" ").pop();
    socket.emit('newuser',{
        username:username1,
        socketid:socket.id
    });
}, 100);


socket.on('newUserAdded',({userlist})=>{
    console.log("new user caught");
    $("#users-container").html("");
    userlist.forEach((username)=>{
        if(username!=username1){
            $("#users-container").append(`
                <div class="users text-bg-success cursor-pointer p-2 fs-3 fw-semibold overflow-hidden text-truncate border-bottom border-2 border-white ">
                    ${username}
                </div>
            `)
        }
    })
    

    receiver = userlist[0];
    let a= $(".users:first-child").removeClass("text-bg-success");
    console.log(a);
    relement =$(".users:first-child")[0];
    load_messages(receiver);
     
 })



async function load_messages(person){
    
      console.log(username1);
    let obj = {
        person1:person,
        person2:username1
    }
    console.log(obj);
    let {data} = await axios.post('/fetch_messages',obj);
    let messages = data;
    console.log(messages);
    $(".chattings").html("");
    messages.forEach((val)=>{
        if(val.sender == username1){
            $(".chattings").append(`
                <div class=" p-2 fs-4 col col-8 offset-4 rounded-5 my-2 p-1 text-end text-bg-primary border">${val.sender}:${val.message}
                <br/>
                 <span class="fs-6 text-start">${val.timestamp}</span>  
                </div> 
                
            `)
        }
        else{
            $(".chattings").append(`
                <div class=" p-2 fs-4 col col-8 text-start rounded-5 my-2 p-1 text-bg-danger border">${val.sender}:${val.message}
                <br/>
                 <span class="fs-6 text-end">${val.timestamp}</span>  
                </div>    
            `)
        }
        
    })
}

$(".send")[0].addEventListener('click',async ()=>{
    let sender = username1;
    let message  = $('.msg-input').val();
    $('.msg-input').val("");
    console.log("msg",message);
    if(message.trim()!=""){
        await axios.post('/add_message',{
            sender,
            receiver,
            message
        })
        load_messages(receiver);
    }
    
})

$("#users-container")[0].addEventListener("click",(ev)=>{
    receiver = ev.target.innerText;
    $(relement).addClass('text-bg-success');
    relement = $(ev.target);
    $(relement).removeClass('text-bg-success');
    load_messages(receiver);
})

