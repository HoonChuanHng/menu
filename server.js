const express = require("express")
const http = require("http")
const { Server } = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static("public"))
app.use(express.json())

const menu = [
  { id: 1, name: "Egg Fried Rice", price: 6, img: "/image/egg-fried-rice" },
  { id: 2, name: "Vegetable Fried Rice", price: 6, img: "/image/vegetable-fried-rice" },
  { id: 3, name: "Mushroom Pasta", price: 7, img: "/image/mushroom-pasta" },
  { id: 4, name: "Carbonara Pasta", price: 8, img: "/image/carbonara-pasta" },
  { id: 5, name: "Tomato Pasta", price: 7, img: "/image/tomato-pasta" },
  { id: 6, name: "Grilled Cheese Sandwich", price: 5, img: "/image/grilled-cheese-sandwich" },
  { id: 7, name: "Egg Sandwich", price: 4, img: "/image/egg-sandwich" },
  { id: 8, name: "French Fries", price: 4, img: "/image/french-fries" },
  { id: 9, name: "Vegetable Nuggets", price: 5, img: "/image/vegetable-nuggets" },
  { id: 10, name: "Garden Salad", price: 5, img: "/image/garden-salad" },
  { id: 11, name: "Iced Tea", price: 3, img: "/image/iced-tea" },
  { id: 12, name: "Hot Tea", price: 2, img: "/image/hot-tea" },
  { id: 13, name: "Iced Coffee", price: 4, img: "/image/iced-coffee" },
  { id: 14, name: "Hot Coffee", price: 3, img: "/image/hot-coffee" },
  { id: 15, name: "Chocolate Milk", price: 4, img: "/image/chocolate-milk" }
]
let orders = []
let orderId = 100

app.get("/api/menu", (req, res) => {
  res.json(menu)
})

app.post("/api/order", (req, res) => {
  const items = req.body.items

  const order = {
    id: orderId++,
    items,
    status: "NEW",
    time: new Date()
  }

  orders.push(order)

  io.emit("new-order", order)

  res.json({ orderId: order.id })
})

app.get("/api/orders", (req, res) => {
  res.json(orders)
})

app.post("/api/status", (req, res) => {
  const { id, status } = req.body

  const order = orders.find(o => o.id === id)
  if (order) order.status = status

  io.emit("update-order", order)

  res.json({ success: true })
})

app.get("/api/stats", (req, res) => {
  let revenue = 0
  let map = {}

  orders.forEach(o => {
    o.items.forEach(i => {
      revenue += i.price * i.qty
      map[i.name] = (map[i.name] || 0) + i.qty
    })
  })

  res.json({
    totalOrders: orders.length,
    revenue,
    popular: map
  })
})

io.on("connection", (socket) => {
  console.log("User connected")
})

server.listen(3000, () => {
  console.log("POS running on http://localhost:3000")
})