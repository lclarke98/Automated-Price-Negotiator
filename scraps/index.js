const chatData = [
    {"user_id": "0", "message": "£120", "created_at": "22:24"},
    {"user_id": "123", "message": "£115", "created_at": "22:24"},
    {"user_id": "0", "message": "£118", "created_at": "22:24"},
    {"user_id": "123", "message": "£116", "created_at": "22:24"},
    {"user_id": "0", "message": "£120", "created_at": "22:24"},
    {"user_id": "123", "message": "£115", "created_at": "22:24"},
    {"user_id": "0", "message": "£118", "created_at": "22:24"},
    {"user_id": "123", "message": "£116", "created_at": "22:24"},
]

window.addEventListener("load", displayMessages)

// clases
// bot-chat
// user-chat


function displayMessages(){
    const chatWindow = document.getElementById("chat")
    for (let i = 0; i < chatData.length; i++){
        const messageBox = document.createElement("div")
        const message = document.createElement("div")
        const dtStamp = document.createElement("div")
        message.classList.add("message")
        dtStamp.classList.add("dtStamp")
        if(chatData[i].user_id == "0"){
            messageBox.classList.add("bot-chat")
            dtStamp.classList.add("dtStamp-float-right")
        }else{
            messageBox.classList.add("user-chat")
            message.classList.add("message-float-left")
        }
        message.textContent = chatData[i].message
        dtStamp.textContent = chatData[i].created_at
        messageBox.appendChild(message)
        messageBox.appendChild(dtStamp)
        chatWindow.appendChild(messageBox)
    }
}

function displayMessages1(msg, user, timestamp){
    const chatWindow = document.getElementById("chat")
    for (let i = 0; i < chatData.length; i++){
        const messageBox = document.createElement("div")
        const message = document.createElement("div")
        const dtStamp = document.createElement("div")
        message.classList.add("message")
        dtStamp.classList.add("dtStamp")
        if(user == "BOT"){
            messageBox.classList.add("bot-chat")
            dtStamp.classList.add("dtStamp-float-right")
        }else{
            messageBox.classList.add("user-chat")
            message.classList.add("message-float-left")
        }
        message.textContent = msg
        dtStamp.textContent = timestamp
        messageBox.appendChild(message)
        messageBox.appendChild(dtStamp)
        chatWindow.appendChild(messageBox)
    }
}