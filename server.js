require("dotenv").config()

const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const multer = require("multer")
const path = require("path")
const http = require("http")
const { WebSocketServer } = require("ws")
const app = express()
const server = http.createServer(app)
const wss = new WebSocketServer({ server })

wss.on("connection", (ws) => {
  ws.send(JSON.stringify({ type: "connected" }))
})

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err))

function broadcast(data) {
  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(data))
    }
  })
}

app.use(express.static("public"))
app.use("/uploads", express.static("public/external/uploads"))
app.use(express.json())

app.get("/kitchen", (req, res) => {
  res.sendFile(__dirname + "/public/kitchen.html")
})

app.get("/admin", (req, res) => {
  res.sendFile(__dirname + "/public/admin.html")
})

app.get("/waiter", (req, res) => {
  res.sendFile(__dirname + "/public/waiter.html")
})

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/public/login.html")
})

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/external/uploads")
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
  readyAt: Date,
  doneAt: Date,
  totalPrice: Number,
  paid: { type: Boolean, default: false }
})

const Order = mongoose.model("Order", orderSchema)

const counterSchema = new mongoose.Schema({
  name: String,
  value: Number
})

const Counter = mongoose.model("Counter", counterSchema)

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: { type: String, default: "user" },
  createdAt: { type: Date, default: Date.now }
})

const User = mongoose.model("User", userSchema)

app.delete("/api/admin/users/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id)
  res.json({ success: true })
})

async function getNextOrderId() {
  const result = await Counter.findOneAndUpdate(
    { name: "order" },
    { $inc: { value: 1 } },
    { returnDocument: "after", upsert: true }
  )
  return result.value
}

const foodSchema = new mongoose.Schema({
  name: String,
  price: Number,
  img: String,
  category: String,
  soldOut: { type: Boolean, default: false }
})

const Food = mongoose.model("Food", foodSchema)

app.post("/api/login", async (req, res) => {
  const { username, password, role } = req.body
  const user = await User.findOne({ username, role })
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" })
  }
  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    return res.status(401).json({ error: "Invalid credentials" })
  }
  res.json({
    role: user.role,
    username: user.username
  })
})

const callSchema = new mongoose.Schema({
  tableId: String,
  time: Date,
  seen: { type: Boolean, default: false }
})

const CallWaiter = mongoose.model("CallWaiter", callSchema)

app.post("/api/call-waiter", async (req, res) => {
  const { tableId } = req.body

  await CallWaiter.create({
    tableId,
    time: new Date()
  })

   broadcast({
    type: "CALL_WAITER",
    tableId,
    id: call._id
  })
  res.json({ success: true })
})

app.get("/api/call-waiter", async (req, res) => {
  const calls = await CallWaiter.find({ seen: false })
  res.json({ calls })
})

app.post("/api/call-waiter/seen", async (req, res) => {
  const { id } = req.body

  await CallWaiter.findByIdAndUpdate(id, { seen: true })

  res.json({ success: true })
})

app.get("/api/menu", async (req, res) => {
  const foods = await Food.find()
  res.json(foods)
})

app.get("/api/admin/users", async (req, res) => {
  const users = await User.find()
  res.json(users)
})

app.post("/api/admin/users", async (req, res) => {
  const { username, password, role } = req.body

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await User.create({
    username,
    password: hashedPassword,
    role
  })

  res.json(user)
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
  time: o.time
    ? new Date(o.time).toLocaleString("en-MY", { timeZone: "Asia/Kuala_Lumpur" })
    : null,

  readyAt: o.readyAt
    ? new Date(o.readyAt).toLocaleString("en-MY", { timeZone: "Asia/Kuala_Lumpur" })
    : null,

  doneAt: o.doneAt
    ? new Date(o.doneAt).toLocaleString("en-MY", { timeZone: "Asia/Kuala_Lumpur" })
    : null
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

  broadcast({
    type: "FOOD_UPDATE",
    action: "CREATE",
    food
  })

  res.json(food)
})

app.delete("/api/food/:id", async (req, res) => {
  await Food.findByIdAndDelete(req.params.id)
  
  res.json({ success: true })
})

app.get("/api/order/:tableId", async (req, res) => {
  const orders = await Order.find({ tableId: req.params.tableId })
  res.json(orders)
})

app.get("/api/waiter/orders", async (req, res) => {
  const orders = await Order.find({
    status: { $in: ["READY", "SERVING"] },
    paid: false
  })

  const formatted = orders.map(o => ({
    ...o._doc,
    time: new Date(o.time).toLocaleString("en-MY", {
      timeZone: "Asia/Kuala_Lumpur"
    }),
    readyAt: o.readyAt
      ? new Date(o.readyAt).toLocaleString("en-MY", {
          timeZone: "Asia/Kuala_Lumpur"
        })
      : null
  }))
  res.json({ activeOrders: formatted })
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
  const orders = await Order.find({
    status: { $in: ["PREPARING", "NEW"] }
  })

  const formatted = orders.map(o => ({
    ...o._doc,
    time: new Date(o.time).toLocaleString("en-MY", {
      timeZone: "Asia/Kuala_Lumpur"
    }),
    readyAt: o.readyAt
    ? new Date(o.readyAt).toLocaleString("en-MY", {
        timeZone: "Asia/Kuala_Lumpur"
      })
    : null
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
  broadcast({
    type: "FOOD_UPDATE",
    foodId: req.params.id,
    soldOut: food.soldOut
  })
  res.json(food)
})

/* ================= ORDERS (UNCHANGED) ================= */
app.get("/api/waiter/billing", async (req, res) => {
  const orders = await Order.find({
    status: "DONE",
    paid: false
  })

  res.json({ activeOrders: orders })
})

app.get("/api/order/:tableId/track", async (req, res) => {
  const orders = await Order.find({
    tableId: req.params.tableId,
    paid: false
  })

  res.json(orders)
})

app.post("/api/order", async (req, res) => {
  const { tableId, items, remarks } = req.body
  let totalPrice = 0
  items.forEach(i => {
    totalPrice += (Number(i.price) || 0) * (Number(i.qty) || 1)
  })
  
  const numericId = await getNextOrderId()

  const order = await Order.create({
    tableId,
    items,
    remarks,
    status: "NEW",
    time: new Date(),
    orderNumber: numericId,
    totalPrice
  })
  broadcast({
    type: "NEW_ORDER",
    tableId,
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
  const update = {
    status: req.body.status
  }

  if (req.body.status === "READY") {
    update.readyAt = new Date()
  }

  if (req.body.status === "DONE") {
    update.doneAt = new Date()
  }

  await Order.findOneAndUpdate(
    { orderNumber: req.body.orderNumber },
    { $set: update }
  )
  
  broadcast({
    type: "ORDER_STATUS",
    orderNumber: req.body.orderNumber,
    status: req.body.status
  })
  
  res.json({ success: true })
})

app.delete("/api/order/:orderNumber", async (req, res) => {
  await Order.findOneAndDelete({ orderNumber: req.params.orderNumber })
  res.json({ success: true })
})

app.post("/api/checkout/:tableId", async (req, res) => {
  await Order.updateMany(
    { tableId: req.params.tableId,
      status: "DONE" 
     },
    { $set: { paid: true } }
  )
  broadcast({
    type: "CHECKOUT_UPDATE",
    tableId: req.params.tableId
  })
  res.json({ success: true })
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => console.log("Server running on port " + PORT))