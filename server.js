const express = require("express")
const http = require("http")
const { Server } = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static("public"))
app.use(express.json())

const menu = [
  { id: 1, name: "Egg fried Rice", price: 6, img: "/image/egg-fried-rice.png"},
  { id: 2, name: "Mee Goreng", price: 5 },
  { id: 3, name: "Teh Tarik", price: 2 },
  { id: 4, name: "Coffee", price: 3 }
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