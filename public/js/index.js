const socket = new WebSocket("ws://localhost:3000")

socket.onmessage = (event) => {
  const data = JSON.parse(event.data)

  switch (data.type) {

    case "FOOD_UPDATE":
    case "ORDER_STATUS":
    case "FOOD_SOLDOUT":
      loadMenu()
      break

    case "ORDER_DELETE":
    case "CHECKOUT_UPDATE":
      removeTrackedOrders(data)
      break
  }
}

const urlParams = new URLSearchParams(window.location.search)
const tableId = urlParams.get("table") || "0"

document.title = "Table " + tableId + " - Quick Plate"

let menu = []
let groupedMenu = {}
let cart = JSON.parse(localStorage.getItem("cart_" + tableId)) || {}
let searchQuery = ""

async function loadMenu() {
  const res = await fetch("/api/menu")
  menu = await res.json()

  groupMenuByCategory()
  renderCategories()
  renderMenu()
  applyFilter()
}

loadMenu()
renderCart()

function groupMenuByCategory() {
  groupedMenu = {}

  menu.forEach(item => {
    if (!groupedMenu[item.category]) {
      groupedMenu[item.category] = []
    }
    groupedMenu[item.category].push(item)
  })
}

function renderCategories() {
  let html = ""

  Object.keys(groupedMenu).forEach(cat => {
    html += `
      <button class="category-btn" onclick="scrollToCategory('${cat}')">
        ${cat}
      </button>
    `
  })

  document.getElementById("categoryBar").innerHTML = html
}

function renderMenu() {
  let html = ""

  Object.keys(groupedMenu).forEach(cat => {
    html += `
      <section class="category-section" id="${cat}">
        <h2 class="category-title">${cat}</h2>
        <div class="food-grid">
    `

    groupedMenu[cat].forEach(item => {
      html += `
        <div class="food-card ${item.soldOut ? "sold" : ""}">
          <img src="${item.img}">
          <div class="food-info">
            <h3 class="food-name">${item.name}</h3>
            <div class="food-price">RM${Number(item.price).toFixed(2)}</div>
            <button class="add-btn" onclick="addToCart('${item._id}')"
              ${item.soldOut ? "disabled" : ""}>
              ${item.soldOut ? "SOLD OUT" : "Add to Cart"}
            </button>
          </div>

          ${item.soldOut ? "<div class='sold-overlay'>SOLD OUT</div>" : ""}
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

  menu.forEach(item => {
    if ((item._id || item.id) == id) {
      foundItem = item
    }
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
          <div class="food-price">RM${Number(c.item.price).toFixed(2)}</div>
          <div class="qty-controls">
            <button onclick="changeQty('${c.item._id}', -1)">-</button>
            <span>${c.qty}</span>
            <button onclick="changeQty('${c.item._id}', 1)">+</button>
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

async function trackOrder() {
  const modal = document.getElementById("trackModal")
  const content = document.getElementById("trackContent")

  modal.style.display = "flex"

  const res = await fetch("/api/order/" + tableId + "/track")
  const orders = await res.json()

  if (!orders.length) {
    content.innerHTML = "<p>No order found.</p>"
    return
  }

  let html = ""

  orders.forEach(o => {
    html += `<div style="margin-bottom:10px;">`
    html += `<b>Order #${o.orderNumber}</b><br>`
    html += `Items:<br>`

    o.items.forEach(i => {
      html += `- ${i.name} x ${i.qty || 1}<br>`
    })

    html += `<b>Status:</b> ${o.status}`
    html += `</div><hr>`
  })

  content.innerHTML = html
}

function closeTrack() {
  document.getElementById("trackModal").style.display = "none"
}

document.addEventListener("click", function(e) {
  const modal = document.getElementById("trackModal")
  const box = document.querySelector(".track-box")

  if (modal && e.target === modal) {
    modal.style.display = "none"
  }
})


function placeOrder() {
  const items = Object.values(cart).map(c => ({
    id: c.item._id || c.item.id,
    name: c.item.name,
    price: c.item.price,
    qty: c.qty
  }))

  const remarks = document.getElementById("orderRemarks").value

  if (!items.length) return alert("Please select a food/drinks.")

  fetch("/api/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tableId,
      items,
      remarks
    })
  })
  .then(async r => {
    const data = await r.json()
    if (!r.ok) throw data
    return data
  })
  .then(data => {
    alert(`Order #${data.orderId} placed successfully!`)

    cart = {}
    localStorage.removeItem("cart_" + tableId)
    document.getElementById("orderRemarks").value = ""
    renderCart()
    toggleCart()
  })
  .catch(err => {
    console.log("ORDER ERROR:", err)
    alert("Order failed")
  })
}

function applyFilter() {
  const cards = document.getElementsByClassName("food-card")

  for (let i = 0; i < cards.length; i++) {
    const name = cards[i]
      .getElementsByClassName("food-name")[0]
      .innerText
      .toLowerCase()

    cards[i].style.display = name.includes(searchQuery) ? "" : "none"
  }
}

function filterMenu() {
  searchQuery = document.getElementById("searchInput").value.toLowerCase()

  applyFilter()
}
  
async function callWaiter() {
  await fetch("/api/call-waiter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tableId })
  })

  const btn = document.getElementById("notifyBtn")
  btn.classList.add("active")
  setTimeout(() => btn.classList.remove("active"), 1000)
}

const modal = document.getElementById("imgModal")
const modalImg = document.getElementById("imgModalContent")

document.addEventListener("click", (e) => {
  if (e.target.tagName === "IMG" && e.target.closest(".food-card")) {
    modal.style.display = "flex"
    modalImg.src = e.target.src
  }

  if (e.target === modal) {
    modal.style.display = "none"
  }
})

function removeTrackedOrders(data) {
  const orderElements = document.querySelectorAll(".order-item")

  orderElements.forEach(el => {
    const orderNumber = el.dataset.orderNumber

    if (
      data.orderNumber &&
      orderNumber == data.orderNumber
    ) {
      el.remove()
    }

    if (
      data.tableId &&
      el.dataset.tableId == data.tableId
    ) {
      el.remove()
    }
  })
}