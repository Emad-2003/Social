document.getElementById("profileForm").addEventListener("submit", function(event) {
  event.preventDefault();

  var name = document.getElementById("name").value;
  var profilePic = document.getElementById("profilePic").files[0];

  var reader = new FileReader();
  reader.onloadend = function() {
    if (name){
      document.getElementById("nameInput").innerHTML = name;
      nameInput= name;
    }
    if (profilePic){  
      document.getElementById("pfp").style.backgroundImage = "url('" + 
      reader.result + "')";
      document.getElementById('icon').style.display='none'
    }
      document.getElementById("frontPage").style.display = "none";
      document.getElementById("backPage").style.display = "block";
      document.getElementById("heading").style.display = "none";
  };
  if (profilePic) {
      reader.readAsDataURL(profilePic);
  }
});

const socket = io()
const clientsTotal = document.getElementById('client-total')

const messageContainer = document.getElementById('message-container')
var  nameInput = document.getElementById('name-input')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')

const messageTone = new Audio('/message-tone.mp3')

messageForm.addEventListener('submit', (e) => {
  e.preventDefault()
  sendMessage()
})

//when socket is on , displays total clients 
socket.on('clients-total', (data) => {
  clientsTotal.innerText = `Total Users: ${data}`
})

function sendMessage() {
  if (messageInput.value === '') return
  // console.log(messageInput.value)
  const data = {
    name: nameInput,
    message: messageInput.value,
    dateTime: new Date(),
  }
  socket.emit('message', data)
  addMessageToUI(true, data)
  messageInput.value = ''
}

socket.on('chat-message', (data) => {
  messageTone.play()
  addMessageToUI(false, data)
})

function addMessageToUI(isOwnMessage, data) {
  clearFeedback()
  const element = `
      <li class="${isOwnMessage ? 'message-right' : 'message-left'}">
        <p class="message">
          ${data.message}
          <span><b>${data.name}</b> ● ${moment(data.dateTime).fromNow()}</span>
        </p>
      </li>
        `
  messageContainer.innerHTML += element
  scrollToBottom()
}

function scrollToBottom() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight)
}

messageInput.addEventListener('focus', (e) => {
  socket.emit('feedback', {
    feedback: `✍️ ${nameInput.value} is typing a message`,
  })
})

messageInput.addEventListener('keypress', (e) => {
  socket.emit('feedback', {
    feedback: `✍️ ${nameInput.value} is typing a message`,
  })
})
messageInput.addEventListener('blur', (e) => {
  socket.emit('feedback', {
    feedback: '',
  })
})

socket.on('feedback', (data) => {
  clearFeedback()
  const element = `
        <li class="message-feedback">
          <p class="feedback" id="feedback">${data.feedback}</p>
        </li>
  `
  messageContainer.innerHTML += element
})

function clearFeedback() {
  document.querySelectorAll('li.message-feedback').forEach((element) => {
    element.parentNode.removeChild(element)
  })
}
