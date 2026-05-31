const urlParams = new URLSearchParams(window.location.search)
const tableId = urlParams.get("table") || "0"

document.title = "Table " + tableId + " - Quick Plate"

let menu = []
let cart = JSON.parse(localStorage.getItem("cart_" + tableId)) || {}

fetch("/api/menu")
  .then(res => res.json())
  .then(data => {
    menu = data
    renderCategories()
    renderMenu()
    renderCart()
  })

function renderCategories() {
  let html = ""

  menu.forEach(section => {
    html += `
      <button class="category-btn" onclick="scrollToCategory('${section.category}')">
        ${section.category}
      </button>
    `
  })

  document.getElementById("categoryBar").innerHTML = html
}

function renderMenu() {
  let html = ""

  menu.forEach(section => {
    html += `
      <section class="category-section" id="${section.category}">
        <h2 class="category-title">${section.category}</h2>
        <div class="food-grid">
    `

    section.items.forEach(item => {
      html += `
        <div class="food-card">
          <img src="${item.img}">
          <div class="food-info">
            <h3 class="food-name">${item.name}</h3>
            <div class="food-price">RM${item.price}</div>
            <button class="add-btn" onclick="addToCart(${item.id})">
              Add to Cart
            </button>
          </div>
        </div>
      `
    })

    html += `</div></section>`
  })

  document.getElementById("menu").innerHTML = html
}

function scrollToCategory(category) {
  document.getElementById(category).scrollIntoView({ behavior: "smooth" })
}

function addToCart(id) {
  let foundItem = null

  menu.forEach(section => {
    section.items.forEach(item => {
      if (item.id === id) foundItem = item
    })
  })

  if (!foundItem) return

  if (!cart[id]) {
    cart[id] = { item: foundItem, qty: 1 }
  } else {
    cart[id].qty++
  }

  saveCart()
  renderCart()
}

function changeQty(id, amount) {
  if (!cart[id]) return

  cart[id].qty += amount

  if (cart[id].qty <= 0) delete cart[id]

  saveCart()
  renderCart()
}

function saveCart() {
  localStorage.setItem("cart_" + tableId, JSON.stringify(cart))
}

function renderCart() {
  let html = ""
  let total = 0
  let totalItems = 0

  Object.values(cart).forEach(c => {
    total += c.item.price * c.qty
    totalItems += c.qty

    html += `
      <div class="cart-item">
        <img src="${c.item.img}">
        <div class="cart-item-info">
          <div class="cart-item-name">${c.item.name}</div>
          <div class="cart-item-price">RM${c.item.price}</div>
          <div class="qty-controls">
            <button class="qty-btn" onclick="changeQty(${c.item.id}, -1)">-</button>
            <span>${c.qty}</span>
            <button class="qty-btn" onclick="changeQty(${c.item.id}, 1)">+</button>
          </div>
        </div>
      </div>
    `
  })

  if (!html) html = "<p>Cart is empty.</p>"

  document.getElementById("cartItems").innerHTML = html
  document.getElementById("cartTotal").innerText = `Total: RM${total.toFixed(2)}`
  document.getElementById("cartButton").innerText = `View Cart (${totalItems})`
}

function toggleCart() {
  document.getElementById("cartModal").classList.toggle("show")
}

function placeOrder() {
  const items = Object.values(cart).map(c => ({
    id: c.item.id,
    name: c.item.name,
    price: c.item.price,
    qty: c.qty
  }))

  if (!items.length) return alert("Please select a food/drinks.")

  fetch("/api/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tableId,
      items
    })
  })
  .then(async r => {
    const data = await r.json()
    if (!r.ok) throw data
    return data
  })
  .then(data => {
    alert(`Order #${data.orderId}: Table ${data.tableId} placed orders successfully!`)
    cart = {}
    localStorage.removeItem("cart_" + tableId)
    renderCart()
    toggleCart()
  })
  .catch(err => {
    console.log("ORDER ERROR:", err)
    alert("Order failed")
  })
}
