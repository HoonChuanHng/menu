const express = require("express")
const mongoose = require("mongoose")

const app = express()
const multer = require("multer")
const path = require("path")

mongoose.connect("mongodb://admin:12345678asd@ac-t7nhegs-shard-00-00.i0rmibh.mongodb.net:27017,ac-t7nhegs-shard-00-01.i0rmibh.mongodb.net:27017,ac-t7nhegs-shard-00-02.i0rmibh.mongodb.net:27017/quickplate?ssl=true&replicaSet=atlas-bm6ri7-shard-0&authSource=admin&appName=Cluster0")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err))

app.use(express.static("public"))
app.use(express.json())

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads")
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage })
const orderSchema = new mongoose.Schema({
  orderNumber: Number,
  tableId: String,
  items: Array,
  status: String,
  remarks: String,
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

/* ================= FOOD SYSTEM ================= */

const foodSchema = new mongoose.Schema({
  name: String,
  price: Number,
  img: String,
  category: String,
  soldOut: { type: Boolean, default: false }
})

const Food = mongoose.model("Food", foodSchema)

/* GET MENU */
app.get("/api/menu", async (req, res) => {
  const foods = await Food.find()
  res.json(foods)
})

app.get("/api/admin", async (req, res) => {
  const orders = await Order.find()

  let tableTotals = {}
  let foodCount = {}
  let revenue = 0

  orders.forEach(o => {
    let tableTotal = 0

    o.items.forEach(i => {
      const qty = i.qty ? Number(i.qty) : 1
      const price = Number(i.price || 0)

      const total = price * qty

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

/* ADD FOOD (ADMIN) */
app.post("/api/food", async (req, res) => {
  const { name, price, img, category } = req.body

  if (price < 0) {
    return res.status(400).json({ error: "Invalid price" })
  }

  const food = await Food.create({
    name,
    price,
    img,
    category
  })

  res.json(food)
})

app.delete("/api/food/:id", async (req, res) => {
  await Food.findByIdAndDelete(req.params.id)
  res.json({ success: true })
})

app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" })
  }

  res.json({
    url: "/uploads/" + req.file.filename
  })
})

app.get("/api/kitchen", async (req, res) => {
  const orders = await Order.find()

  const formatted = orders.map(o => ({
    ...o._doc,
    time: new Date(o.time).toLocaleString("en-MY", {
      timeZone: "Asia/Kuala_Lumpur"
    })
  }))

  res.json({ activeOrders: formatted })
})

app.put("/api/food/:id", async (req, res) => {
  const { name, price, img, category } = req.body

  if (price !== undefined && price <= 0) {
    return res.status(400).json({ error: "Invalid price" })
  }

  const food = await Food.findByIdAndUpdate(
    req.params.id,
    {
      name,
      price,
      img,
      category
    },
    { new: true }
  )

  res.json(food)
})

/* TOGGLE SOLD OUT */
app.put("/api/food/:id/soldout", async (req, res) => {
  const food = await Food.findById(req.params.id)
  food.soldOut = !food.soldOut
  await food.save()
  res.json(food)
})

/* ================= ORDERS (UNCHANGED) ================= */

app.post("/api/order", async (req, res) => {
  const { tableId, items, remarks } = req.body

  const numericId = await getNextOrderId()

  const order = await Order.create({
    tableId,
    items,
    remarks,
    status: "NEW",
    time: new Date(),
    orderNumber: numericId
  })
  res.json({ orderId: numericId, tableId })
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
  await Order.findOneAndUpdate(
    { orderNumber: req.body.orderNumber },
    { status: req.body.status }
  )

  res.json({ success: true })
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

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log("Server running on port " + PORT))