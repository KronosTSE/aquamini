import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;
const PORT = process.env.PORT || 3000;

// Проверка сервера
app.get('/health', (req, res) => res.send({ ok: true }));

// --- обработка заказов ---
app.post('/order', async (req, res) => {
  const { name, address, bottles } = req.body;
  if (!name || !address || !bottles) return res.status(400).send({ error: 'missing fields' });

  const text = `🧾 Новый заказ:
👤 ${name}
📍 ${address}
💧 Бутылей: ${bottles}`;

  try {
    if (BOT_TOKEN && ADMIN_CHAT_ID) {
      await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        chat_id: ADMIN_CHAT_ID,
        text
      });
    }
    res.send({ ok: true });
  } catch (err) {
    console.error(err?.response?.data || err.message);
    res.status(500).send({ error: 'failed to send' });
  }
});

// --- webhook для обработки сообщений от пользователей ---
app.post('/webhook', async (req, res) => {
  const message = req.body.message;
  if (!message) return res.sendStatus(200);

  const chat_id = message.chat.id;
  const text = message.text;

  // Если пользователь пишет /start — отправляем приветственное сообщение с кнопкой
  if (text === '/start') {
    const keyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Сделать заказ', web_app: { url: 'https://aquamini-front.vercel.app' } }
          ]
        ]
      }
    };

    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id,
      text: 'Привет! Добро пожаловать в Aquamarin. Сделайте заказ воды прямо из бота:',
      ...keyboard
    });
  }

  res.sendStatus(200);
});

app.listen(PORT, () => console.log('Server listening on', PORT));
