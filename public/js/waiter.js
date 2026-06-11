const session = JSON.parse(localStorage.getItem("session"))
if (!session) window.location.replace("login")
if (Date.now() > session.expiry) {
  localStorage.removeItem("session")
  window.location.replace("login")
}
if (session.role !== "waiter") window.location.replace("login")

let billingOrders = []
let audioUnlocked = false
let lastCallId = null
let bellRungForBatch = false
let seenOrders = JSON.parse(localStorage.getItem("waiterSeenOrders") || "[]")
let hiddenNotifs = JSON.parse(localStorage.getItem("waiterHiddenNotifs") || "[]")
let latestOrders = []

const notifySound = new Audio("/external/sound/sound-notification.mp3")
const callSound = new Audio("/external/sound/waiter-calls.mp3")

function flashBell() {
  const bell = document.getElementById("bell")
  bell.classList.add("active")
  setTimeout(() => bell.classList.remove("active"), 2000)
}

document.addEventListener("click", () => {
  audioUnlocked = true
}, { once: true })

async function load() {
  const res = await fetch("/api/waiter/billing")
  const data = await res.json()
  billingOrders = data.activeOrders || []
  if (!billingOrders || billingOrders.length === 0) {
    document.getElementById("tables").innerHTML = "<p>No tables</p>"
    return
  }

  const tableMap = {}

  billingOrders.forEach(o => {
    if (!tableMap[o.tableId]) {
      tableMap[o.tableId] = {
        total: 0
      }
    }

    (o.items || []).forEach(i => {
      const qty = i.qty || 1
      const price = Number(i.price || 0)
      tableMap[o.tableId].total += qty * price
    })
  })

  let t = ""

  Object.keys(tableMap).forEach(k => {
    t += `
      <div class="card">
        <h3>Table ${k}</h3>
        <p>Total: RM ${tableMap[k].total.toFixed(2)}</p>
        <div class="card-buttons">
          <button class="danger" onclick="checkoutTable('${k}')">Checkout</button>
          <button onclick="downloadReceipt('${k}')">Receipt</button>
        </div>
      </div>
    `
  })

  document.getElementById("tables").innerHTML =
    t || "<p>No tables</p>"
}

async function checkoutTable(tableId) {
  if (!confirm("Do you sure to checkout this table?")) return
  document.querySelectorAll(".card").forEach(c => {
    if (c.innerText.includes(tableId)) {
      c.style.opacity = "0.4"
    }
  })

  await fetch("/api/checkout/" + tableId, { method: "POST" })

  loadOrders()
  load()
}

function showSection(id) {
  document.querySelectorAll(".section").forEach(s => {
    s.style.display = "none"
  })

  document.getElementById(id).style.display = "block"
}

function downloadReceipt(tableId) {
  const orders = billingOrders.filter(o =>
    String(o.tableId) === String(tableId)
  )
  const orderNumbers = orders.map(o => "#" + o.orderNumber).join(", ")
  if (!orders.length) {
    alert("No order found")
    return
  }

  const restaurant = "Quick Plate Cafe"
  const now = new Date().toLocaleString()

  let itemsHtml = ""
  let total = 0

  orders.forEach(o => {
    (o.items || []).forEach(i => {
      const qty = i.qty || 1
      const price = Number(i.price || 0)
      const subtotal = qty * price

      total += subtotal

      itemsHtml += `
        <tr>
          <td>${i.name}</td>
          <td>${qty}</td>
          <td>${price.toFixed(2)}</td>
          <td>${subtotal.toFixed(2)}</td>
        </tr>
      `
    })
  })

  const win = window.open("", "_blank")

  win.document.write(`
    <html>
    <head>
      <title>Receipt</title>
      <style>
        body { font-family: Arial; padding: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        td, th { border: 1px solid #000; padding: 8px; text-align: left; }
      </style>
    </head>
    <body>

      <h2>${restaurant}</h2>
      <p><b>Table ID:</b> ${tableId}</p>
      <p><b>Order Number:</b> ${orderNumbers}</p>
      <p><b>Date:</b> ${now}</p>

      <table>
        <tr>
          <th>Item</th>
          <th>Qty</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
        ${itemsHtml}
      </table>

      <h3>Total: RM ${total.toFixed(2)}</h3>

      <script>
        window.print()
      </script>

    </body>
    </html>
  `)

  win.document.close()
}

async function loadOrders() {
  const res = await fetch("/api/waiter/orders")
  const data = await res.json()

  const orders = data.activeOrders || []
  latestOrders = orders

  const bellDot = document.getElementById("bellDot")

  const newOrders = orders.filter(o =>
    !seenOrders.includes(String(o.orderNumber))
  )

  if (newOrders.length > 0) {
    bellDot.style.display = "block"
    if (!bellRungForBatch) {
      notifySound.currentTime = 0
      notifySound.play()      
      flashBell()
      bellRungForBatch = true
    }
  } else {
    bellDot.style.display = "none"
    bellRungForBatch = false
  }


  let html = ""

  orders.forEach(o => {
    html += `
      <div class="order">
        <h3>Table ${o.tableId} | Order #${o.orderNumber}</h3>
        ${o.readyAt ? `<p>Ready at: ${o.readyAt}</p>` : ""}
        <p>Status: <span class="status status-${o.status}">${o.status}</span></p>
        <p>Food Items:</p>
        <ul>
          ${(o.items || []).map(i =>
            `<li>${i.name} x ${i.qty || 1}</li>`
          ).join("")}
        </ul>
        <button onclick="update(${o.orderNumber}, 'SERVING')">Serving</button>
        <button onclick="update(${o.orderNumber}, 'DONE')">Done</button>
      </div>
    `
  })

  document.getElementById("orders").innerHTML =
    html || "<p>No orders</p>"
}

async function deleteOrder(orderNumber) {
  await fetch("/api/order/" + orderNumber, { method: "DELETE" })
  loadOrders()
}

async function update(orderNumber, status) {
  await fetch("/api/status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      orderNumber,
      status
    })
  })

  loadOrders()
}

async function checkout(tableId) {
  await fetch("/api/checkout/" + tableId, { method: "POST" })
  loadOrders()
}

const panel = document.createElement("div")
panel.id = "bellPanel"
panel.style.position = "absolute"
panel.style.top = "60px"
panel.style.right = "20px"
panel.style.width = "220px"
panel.style.background = "white"
panel.style.border = "1px solid #ddd"
panel.style.borderRadius = "8px"
panel.style.padding = "10px"
panel.style.display = "none"
panel.style.zIndex = "9999"

document.body.appendChild(panel)

function renderBellPanel() {
  fetch("/api/waiter/orders")
    .then(r => r.json())
    .then(data => {
      const orders = (data.activeOrders || [])
        .filter(o => !hiddenNotifs.includes(o.orderNumber))

      panel.innerHTML = orders.length
        ? orders.map(o => `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
              <div>
                Order <b>#${o.orderNumber}</b><br>
                <small>${o.time || ""}</small>
              </div>
              <button onclick="removeNotif(${o.orderNumber})"
                style="border:none;background:none;cursor:pointer;">
                🗑️
              </button>
            </div>
          `).join("")
        : "<p>No orders.</p>"
    })
}

document.getElementById("bell").onclick = function (e) {
  e.stopPropagation()

  document.getElementById("bellDot").style.display = "none"

  seenOrders = latestOrders.map(o => String(o.orderNumber))
  localStorage.setItem("waiterSeenOrders", JSON.stringify(seenOrders))

  panel.style.display = panel.style.display === "block" ? "none" : "block"

  if (panel.style.display === "block") {
    renderBellPanel()
  }
}

function removeNotif(orderNumber) {
  hiddenNotifs.push(orderNumber)
  localStorage.setItem("waiterHiddenNotifs", JSON.stringify(hiddenNotifs))
  renderBellPanel()
}

document.addEventListener("click", function (e) {
  if (!panel.contains(e.target) && e.target.id !== "bell") {
    panel.style.display = "none"
  }
})

async function loadCalls() {
  const res = await fetch("/api/call-waiter")
  const data = await res.json()

  const calls = data.calls || []
  if (!calls.length) return

  const latest = calls[calls.length - 1]
  if (!latest || !latest._id) return

  if (lastCallId === latest._id) return

  lastCallId = latest._id

  flashBell()

  callSound.currentTime = 0
  callSound.play().catch(console.log)

  alert("Table " + latest.tableId + " is calling waiter!")

  setTimeout(async () => {
    await fetch("/api/call-waiter/seen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: latest._id })
    })
  }, 1000)
}

function playCallSound() {
  callSound.currentTime = 0
  callSound.play().catch(err => console.log("Audio error:", err))
}

function logout() {
  if (confirm("Do you sure to logout?")) {
    localStorage.removeItem("session")
    window.location.replace("login")
  }
}

const toggle = document.getElementById("darkToggle")

if (localStorage.getItem("dark") === "true") {
  document.body.classList.add("dark")
  toggle.checked = true
}

toggle.addEventListener("change", () => {
  document.body.classList.toggle("dark")
  localStorage.setItem("dark", document.body.classList.contains("dark"))
})

showSection("ordersSection")

loadOrders()
load()


setTimeout(() => {
  setInterval(() => {
    load()
    loadOrders()
    loadCalls()
  }, 3000)
}, 1000)
