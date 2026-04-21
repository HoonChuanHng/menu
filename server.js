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

app.get("/api/menu", (req, res) => {
  res.json(menu)
})

app.post("/api/order", (req, res) => {
  const order = req.body
  orders.push(order)
  res.json({ message: "Order received", order })
})

app.get("/api/orders", (req, res) => {
  res.json(orders)
})

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000")
})