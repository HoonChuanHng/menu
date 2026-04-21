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
      <p>
        ${item.name} - RM${item.price}
        <button onclick="addToCart(${item.id})">Add</button>
      </p>
    `
  })

  document.getElementById("menu").innerHTML = html
}

function addToCart(id) {
  let item = menuData.find(i => i.id === id)
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
  .then(data => {
    alert("Order placed!")
    cart = []
    renderCart()
  })
}