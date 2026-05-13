let menu = []
let cart = {}

const socket = io()

socket.on("new-order", () => {
  console.log("Order sent to kitchen")
})

function loadMenu() {
  fetch("/api/menu")
    .then(r => r.json())
    .then(d => {
      menu = d
      renderMenu()
    })
}

function renderMenu() {
  let html = ""

  menu.forEach(section => {
    html += `<h2 style="margin-top:20px;">${section.category}</h2>`
    html += `<div style="display:flex; flex-wrap:wrap; gap:15px; margin-bottom:20px;">`

    section.items.forEach(m => {
      html += `
        <div style="
          border:1px solid #ccc;
          padding:10px;
          width:160px;
          border-radius:10px;
          text-align:center;
        ">
          <img src="${m.img}" width="100" style="display:block; margin:auto;">
          <b>${m.name}</b><br>
          RM${m.price}<br>
          <button onclick="add(${m.id})">+</button>
        </div>
      `
    })

    html += `</div>`
  })

  document.getElementById("menu").innerHTML = html
}

function add(id) {
  let item = menu.find(i => i.id === id)

  if (!cart[id]) cart[id] = { item, qty: 1 }
  else cart[id].qty++

  renderCart()
}

function change(id, d) {
  if (!cart[id]) return

  cart[id].qty += d
  if (cart[id].qty <= 0) delete cart[id]

  renderCart()
}

function renderCart() {
  let html = ""
  let total = 0

  Object.values(cart).forEach(c => {
    total += c.item.price * c.qty

    html += `
      <div>
        ${c.item.name}
        <button onclick="change(${c.item.id}, -1)">-</button>
        ${c.qty}
        <button onclick="change(${c.item.id}, 1)">+</button>
      </div>
    `
  })

  html += `<h3>Total RM${total}</h3>`
  document.getElementById("cart").innerHTML = html
}

function placeOrder() {
  const items = Object.values(cart).map(c => ({
    id: c.item.id,
    name: c.item.name,
    price: c.item.price,
    qty: c.qty
  }))

  fetch("/api/order", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ items })
  })
  .then(r => r.json())
  .then(d => {
    alert("Order #" + d.orderId)
    cart = {}
    renderCart()
  })
}

document.getElementById("darkToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark")
})