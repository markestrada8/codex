import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: "Hello from the server!"
  })
})

app.post('/', async (req, res) => {
  console.log(req)
  try {
    const prompt = req.body.prompt
    const response = await openai.createCompletion(
      {
        model: "text-davinci-003",
        prompt: `${prompt}`,
        max_tokens: 3000,
        temperature: 0,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        // stop: "\n"
      }
    )
    console.log(response.data.choices[0])
    res.status(200).send({
      bot: response.data.choices[0].text
    })
  } catch (error) {
    console.log('POST error: ' + error)
    res.status(500).send({ error })
  }
})

app.listen(5000, () => console.log('listening on port 5000'))