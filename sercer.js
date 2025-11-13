```js
import express from 'express'
import axios from 'axios'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

const BOT_TOKEN = process.env.BOT_TOKEN
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID
const PORT = process.env.PORT || 3000

app.get('/health', (req, res) => res.send({ ok: true }))

app.post('/order', async (req, res) => {
  const { name, address, bottles } = req.body
  if (!name || !address || !bottles) return res.status(400).send({ error: 'missing fields' })

  const text = `🧾 Новый заказ:
👤 ${name}
📍 ${address}
💧 Бутылей: ${bottles}`

  try {
    if (BOT_TOKEN && ADMIN_CHAT_ID) {
      await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        chat_id: ADMIN_CHAT_ID,
        text
      })
    }
    // respond success even if bot not configured
    res.send({ ok: true })
  } catch (err) {
    console.error(err?.response?.data || err.message)
    res.status(500).send({ error: 'failed to send' })
  }
})

app.listen(PORT, () => console.log('Server listening on', PORT))
```

---
