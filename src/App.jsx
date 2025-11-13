```jsx
import React, { useState } from 'react'
import axios from 'axios'

export default function App() {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [bottles, setBottles] = useState(1)
  const [status, setStatus] = useState('')

  const backendBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

  const submit = async (e) => {
    e.preventDefault()
    setStatus('Отправка...')
    try {
      await axios.post(`${backendBase}/order`, { name, address, bottles })
      setStatus('Заказ отправлен ✅')
      setName('')
      setAddress('')
      setBottles(1)
    } catch (err) {
      console.error(err)
      setStatus('Ошибка отправки')
    }
  }

  return (
    <div className="container">
      <h1>🚚 Aquamarin — Заказ воды</h1>
      <form onSubmit={submit}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Ваше имя" required />
        <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Улица, дом, кв." required />
        <input type="number" min="1" value={bottles} onChange={e => setBottles(Number(e.target.value))} required />
        <button type="submit">Отправить заказ</button>
      </form>
      <div className="status">{status}</div>
      <p className="hint">Тестируй сначала локально или с помощью адреса бекенда, который будет после деплоя.</p>
    </div>
  )
}
```

---
