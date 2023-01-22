import bot from './assets/bot.svg'
import user from './assets/user.svg'
import circle from './assets/circle-scatter-haikei.svg'
import wave from './assets/wave-haikei.svg'
import blob from './assets/blob-scene-haikei.svg'

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

let loadInterval;

const loader = (element) => {
  element.textContent = ''
  loadInterval = setInterval(() => {
    element.textContent += '.'
    if (element.textContent === '....') {
      element.textContent = ''
    }
  }, 300)
}

const typeText = (element, text) => {
  let index = 0
  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index)
      index++
    } else {
      clearInterval(interval)
    }
  }, 20)
}

const generateId = () => {
  const timeStamp = Date.now()
  const randomNumber = Math.random()
  const hexString = randomNumber.toString()

  return `id=${timeStamp}-${hexString}`
}

const chatField = (isAi, value, id) => {
  return (
    `
    <div class="wrapper ${isAi && 'ai'}">
      <div class="chat">
        <div class="profile">
          <img src="${isAi ? circle : blob}" alt="${isAi ? "AI" : "User"}"/>
        </div>
        <div class="message" id=${id}>${value}</div>
      </div>
    </div>
    `
  )
}

const handleSubmit = async (event) => {
  event.preventDefault()
  const data = new FormData(form)

  // User chat
  chatContainer.innerHTML += chatField(false, data.get('prompt'))

  form.reset()

  // Bot chat
  const id = generateId()
  chatContainer.innerHTML += chatField(true, '', id)

  chatContainer.scrollTop = chatContainer.scrollHeight

  const messageDiv = document.getElementById(id)

  loader(messageDiv)

  const response = await fetch('https://codex-al8s.onrender.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt').trim()
    })
  })
  clearInterval(loadInterval)
  messageDiv.innerHTML = ''
  if (response.ok) {
    const data = await response.json()
    const parsedData = data.bot.trim()
    console.log(parsedData)

    typeText(messageDiv, parsedData)
  } else {
    const { error } = await response.json()

    messageDiv.innerHTML = "There was an error with your request"
    console.log(error)
  }
}

form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (event) => {
  if (event.keyCode === 13) {
    handleSubmit(event)
  }
})