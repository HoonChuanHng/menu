const express = require("express")

const app = express()

app.use(express.static("public"))
app.use(express.json())

const menu = [
  { id: 1, name: "Nasi Lemak", category: "Food", price: 6 },
  { id: 2, name: "Mee Goreng", category: "Food", price: 5 },
  { id: 3, name: "Teh Tarik", category: "Drink", price: 2 },
  { id: 4, name: "Coffee", category: "Drink", price: 3 },
  { id: 5, name: "Ice Cream", category: "Dessert", price: 4 }
]

let orders = []
let orderCounter = 100

app.get("/api/menu", (req, res) => {
  res.json(menu)
})

app.post("/api/order", (req, res) => {
  const items = req.body.items

  const newOrder = {
    id: orderCounter++,
    items,
    time: new Date()
  }

  orders.push(newOrder)

  res.json({ orderId: newOrder.id })
})

app.get("/api/orders", (req, res) => {
  res.json(orders)
})

app.get("/api/stats/summary", (req, res) => {
  let totalOrders = orders.length
  let totalRevenue = 0

  orders.forEach(o => {
    o.items.forEach(i => {
      totalRevenue += i.price * i.qty
    })
  })

  res.json({ totalOrders, totalRevenue })
})

app.get("/api/stats/popular", (req, res) => {
  let map = {}

  orders.forEach(order => {
    order.items.forEach(item => {
      if (!map[item.name]) map[item.name] = 0
      map[item.name] += item.qty
    })
  })

  res.json(map)
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("Server running")
})