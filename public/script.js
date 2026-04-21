let menuData = []
let cart = []

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
      <div style="
        display:flex;
        align-items:center;
        gap:12px;
        padding:12px;
        margin:10px 0;
        background:#fafafa;
        border-radius:10px;
      ">
        <img 
          src="https://source.unsplash.com/80x80/?food,${item.name}" 
          style="
            width:70px;
            height:70px;
            border-radius:10px;
            object-fit:cover;
          "
        >

        <div style="flex:1;">
          <b>${item.name}</b>
          <br>
          <small>RM${item.price}</small>
        </div>

        <button onclick="addToCart(${item.id})">
          Add
        </button>
      </div>
    `
  })

  document.getElementById("menu").innerHTML = html
}

function addToCart(id) {
  let item = menuData.find(i => i.id === id)
  if (!item) return

  cart.push(item)
  renderCart()
}

function renderCart() {
  let html = ""
  let total = 0

  cart.forEach(item => {
    html += `<p>${item.name} - RM${item.price}</p>`
    total += item.price
  })

  html += `<h3>Total: RM${total}</h3>`

  document.getElementById("cart").innerHTML = html
}

function placeOrder() {
  fetch("/api/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ items: cart })
  })
  .then(res => res.json())
  .then(() => {
    alert("Order placed!")
    cart = []
    renderCart()
  })
}

/* 🌙 DARK MODE (SAFE VERSION) */
window.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("darkToggle")

  if (toggle) {
    toggle.addEventListener("click", () => {
      document.body.classList.toggle("dark")
    })
  }
})