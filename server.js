const express = require("express")
const mongoose = require("mongoose")

const app = express()

mongoose.connect("mongodb+srv://admin:12345678asd@cluster0.i0rmibh.mongodb.net/quickplate")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err))

app.use(express.static("public"))
app.use(express.json())

const orderSchema = new mongoose.Schema({
  tableId: String,
  items: Array,
  status: String,
  time: Date
})

const Order = mongoose.model("Order", orderSchema)

const menu = [
  {
    category: "Rice",
    items: [
      { id: 1, name: "Egg Fried Rice", price: 9, img: "/image/egg-fried-rice.png" },
      { id: 2, name: "Vegetable Fried Rice", price: 8, img: "/image/vegetable-fried-rice.png" }
    ]
  },
  {
    category: "Pasta",
    items: [
      { id: 3, name: "Mushroom Pasta", price: 7, img: "/image/mushroom-pasta.png" },
      { id: 4, name: "Carbonara Pasta", price: 8, img: "/image/carbonara-pasta.png" },
      { id: 5, name: "Tomato Pasta", price: 9, img: "/image/tomato-pasta.png" }
    ]
  },
  {
    category: "Snacks",
    items: [
      { id: 6, name: "Grilled Cheese Sandwich", price: 5, img: "/image/grilled-cheese-sandwich.png" },
      { id: 7, name: "Egg Sandwich", price: 4, img: "/image/egg-sandwich.png" }
    ]
  },
  {
    category: "Drinks",
    items: [
      { id: 11, name: "Iced Tea", price: 3, img: "/image/iced-tea.png" },
      { id: 12, name: "Iced Coffee", price: 2, img: "/image/iced-coffee.png" },
      { id: 13, name: "Hot Tea", price: 3, img: "/image/hot-tea.png" },
      { id: 14, name: "Hot Coffee", price: 2, img: "/image/hot-coffee.png" },
      { id: 15, name: "Chocolate Milk", price: 5, img: "/image/chocolate-milk.png" }
    ]
  }
]

app.get("/api/menu", (req, res) => {
  res.json(menu)
})

app.post("/api/order", async (req, res) => {
  const { tableId, items } = req.body

  const order = await Order.create({
    tableId,
    items,
    status: "NEW",
    time: new Date()
  })

  res.json({ orderId: order._id })
})

app.get("/api/orders", async (req, res) => {
  const orders = await Order.find()
  res.json(orders)
})

app.post("/api/status", async (req, res) => {
  const { id, status } = req.body

  await Order.findByIdAndUpdate(id, { status })

  res.json({ success: true })
})

app.get("/api/admin", async (req, res) => {
  const orders = await Order.find()

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

      foodCount[i.name] = (foodCount[i.name] || 0) + qty
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

app.delete("/api/order/:id", async (req, res) => {
  await Order.findByIdAndDelete(req.params.id)
  res.json({ success: true })
})

app.get("/api/dashboard", async (req, res) => {
  const orders = await Order.find()

  res.json({
    activeOrders: orders.filter(o => o.status !== "DONE"),
    allOrders: orders
  })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("Server running on port " + PORT)
})

