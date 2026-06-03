const express = require("express")
const mongoose = require("mongoose")

const app = express()

mongoose.connect("mongodb://admin:12345678asd@ac-t7nhegs-shard-00-00.i0rmibh.mongodb.net:27017,ac-t7nhegs-shard-00-01.i0rmibh.mongodb.net:27017,ac-t7nhegs-shard-00-02.i0rmibh.mongodb.net:27017/quickplate?ssl=true&replicaSet=atlas-bm6ri7-shard-0&authSource=admin&appName=Cluster0")

  .then(() => console.log("MongoDB Connected"))

  .catch(err => console.log(err))

app.use(express.static("public"))
app.use(express.json())

const orderSchema = new mongoose.Schema({
  orderNumber: Number,
  tableId: String,
  items: Array,
  status: String,
  time: Date,
  paid: { type: Boolean, default: false }
})

const Order = mongoose.model("Order", orderSchema)

const counterSchema = new mongoose.Schema({
  name: String,
  value: Number
})

const Counter = mongoose.model("Counter", counterSchema)

async function getNextOrderId() {
  const result = await Counter.findOneAndUpdate(
    { name: "order" },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  )

  return result.value
}

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
  try {
    const { tableId, items } = req.body

    console.log("ORDER RECEIVED:", req.body)

    if (!tableId || !items) {
      return res.status(400).json({ error: "Missing data" })
    }

    
    const numericId = await getNextOrderId()

    const order = await Order.create({
      tableId,
      items,
      status: "NEW",
      time: new Date(),
      orderNumber: numericId
    })

    res.json({
      orderId: numericId,
      tableId
    })

  } catch (err) {
    console.log("ERROR:", err)
    res.status(500).json({ error: "Server error" })
  }
})

app.get("/api/orders", async (req, res) => {
  const orders = await Order.find()

  const formatted = orders.map(o => ({
    ...o._doc,
    time: new Date(o.time).toLocaleString("en-MY", {
      timeZone: "Asia/Kuala_Lumpur"
    })
  }))

  res.json(formatted)
})

app.post("/api/status", async (req, res) => {
  const orderNumber = Number(req.body.orderNumber)
  const status = req.body.status

  await Order.findOneAndUpdate(
    { orderNumber },
    { status }
  )

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

    if (!o.paid) {
      tableTotals[o.tableId] =
        (tableTotals[o.tableId] || 0) + tableTotal
    }
  })

  const formattedOrders = orders.map(o => ({
    ...o._doc,
    time: new Date(o.time).toLocaleString("en-MY", {
      timeZone: "Asia/Kuala_Lumpur"
    })
  }))

  res.json({
    orders: formattedOrders,
    tableTotals,
    foodCount,
    revenue
  })
})

app.delete("/api/order/:orderNumber", async (req, res) => {
  await Order.findOneAndDelete({ orderNumber: req.params.orderNumber })
  res.json({ success: true })
})

app.post("/api/checkout/:tableId", async (req, res) => {
  await Order.updateMany(
    { tableId: req.params.tableId },
    { $set: { paid: true } }
  )

  res.json({ success: true })
})

app.get("/api/dashboard", async (req, res) => {
  const orders = await Order.find().lean()

  const formatted = orders.map(o => ({
    ...o,
    time: new Date(o.time).toLocaleString("en-MY", {
      timeZone: "Asia/Kuala_Lumpur"
    })
  }))

  res.json({
    activeOrders: formatted,
    allOrders: formatted
  })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("Server running on port " + PORT)
})

