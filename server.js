const express = require("express")
const app = express()

app.use(express.static("public"))
app.use(express.json())

let orders = []
let orderId = 0

const menu = [
  {
    category: "🍚 Rice",
    items: [
      { id: 1, name: "Egg Fried Rice", price: 6, img: "/image/egg-fried-rice.png" },
      { id: 2, name: "Vegetable Fried Rice", price: 6, img: "/image/vegetable-fried-rice.png" }
    ]
  },
  {
    category: "🍝 Pasta",
    items: [
      { id: 3, name: "Mushroom Pasta", price: 7, img: "/image/mushroom-pasta.png" },
      { id: 4, name: "Carbonara Pasta", price: 8, img: "/image/carbonara-pasta.png" },
      { id: 5, name: "Tomato Pasta", price: 7, img: "/image/tomato-pasta.png" }
    ]
  },
  {
    category: "🥪 Snacks",
    items: [
      { id: 6, name: "Grilled Cheese Sandwich", price: 5, img: "/image/grilled-cheese-sandwich.png" },
      { id: 7, name: "Egg Sandwich", price: 4, img: "/image/egg-sandwich.png" }
    ]
  },
  {
    category: "🥤 Drinks",
    items: [
      { id: 11, name: "Iced Tea", price: 3, img: "/image/iced-tea.png" },
      { id: 12, name: "Hot Tea", price: 2, img: "/image/hot-tea.png" }
    ]
  }
]

app.get("/api/menu", (req, res) => {
  res.json(menu)
})

app.post("/api/order", (req, res) => {
  const { tableId, items } = req.body

  const order = {
    id: orderId++,
    tableId,
    items,
    status: "NEW",
    time: new Date()
  }

  orders.push(order)

  res.json({ orderId: order.id })
})

app.get("/api/orders", (req, res) => {
  res.json(orders)
})

app.post("/api/status", (req, res) => {
  const { id, status } = req.body

  const order = orders.find(o => o.id === id)
  if (order) order.status = status

  res.json({ success: true })
})

app.get("/api/admin", (req, res) => {

  let tableTotals = {}
  let foodCount = {}
  let revenue = 0

  orders.forEach(o => {

    let tableTotal = 0

    o.items.forEach(i => {

      const qty = i.qty || 0
      const total = i.price * qty

      tableTotal += total
      revenue += total

      foodCount[i.name] =
        (foodCount[i.name] || 0) + qty

    })

    tableTotals[o.tableId] =
      (tableTotals[o.tableId] || 0) + tableTotal

  })

  res.json({
    orders,
    tableTotals,
    foodCount,
    revenue
  })

})

app.delete("/api/order/:id", (req, res) => {

  const id = parseInt(req.params.id)

  orders = orders.filter(o => o.id !== id)

  res.json({ success: true })

})

app.get("/api/dashboard", (req, res) => {
  res.json({
    activeOrders: orders.filter(o => o.status !== "DONE"),
    allOrders: orders
  })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("Server running on port " + PORT)
})