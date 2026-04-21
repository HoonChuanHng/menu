let menuData = []
let cart = {}

function loadMenu() {
  fetch("/api/menu")
    .then(res => res.json())
    .then(data => {
      menuData = data
      renderMenu()
    })
}

function renderMenu() {
  let html = ""

  menuData.forEach(item => {
    html += `
      <div style="display:flex;align-items:center;gap:12px;padding:12px;margin:10px 0;background:#fafafa;border-radius:10px;">
        <img src="https://source.unsplash.com/80x80/?food,${item.name}" style="width:70px;height:70px;border-radius:10px;object-fit:cover;">
        <div style="flex:1;">
          <b>${item.name}</b><br>
          <small>RM${item.price}</small>
        </div>
        <button onclick="addToCart(${item.id})">+</button>
      </div>
    `
  })

  document.getElementById("menu").innerHTML = html
}

function addToCart(id) {
  let item = menuData.find(i => i.id === id)
  if (!item) return

  if (!cart[id]) cart[id] = { item, qty: 1 }
  else cart[id].qty++

  renderCart()
}

function changeQty(id, delta) {
  if (!cart[id]) return

  cart[id].qty += delta

  if (cart[id].qty <= 0) delete cart[id]

  renderCart()
}

function removeItem(id) {
  delete cart[id]
  renderCart()
}

function renderCart() {
  let html = ""
  let total = 0

  Object.values(cart).forEach(entry => {
    const { item, qty } = entry
    total += item.price * qty

    html += `
      <div style="margin:10px 0;padding:10px;background:#f4f4f4;border-radius:10px;">
        <b>${item.name}</b> - RM${item.price}
        <div>
          <button onclick="changeQty(${item.id}, -1)">-</button>
          <span style="margin:0 10px;">${qty}</span>
          <button onclick="changeQty(${item.id}, 1)">+</button>
          <button onclick="removeItem(${item.id})">Remove</button>
        </div>
      </div>
    `
  })

  html += `<h3>Total: RM${total}</h3>`
  document.getElementById("cart").innerHTML = html
}

function placeOrder() {
  const items = Object.values(cart).map(e => ({
    id: e.item.id,
    name: e.item.name,
    price: e.item.price,
    qty: e.qty
  }))

  fetch("/api/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items })
  })
  .then(res => res.json())
  .then(data => {
    alert("Order placed! #" + data.orderId)
    cart = {}
    renderCart()
  })
}

window.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("darkToggle")

  if (toggle) {
    toggle.addEventListener("click", () => {
      document.body.classList.toggle("dark")
    })
  }
})