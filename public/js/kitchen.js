const socket = new WebSocket("ws://localhost:3000")

socket.onmessage = (event) => {
  const data = JSON.parse(event.data)

  switch (data.type) {
    case "NEW_ORDER":
    case "ORDER_STATUS":
    case "FOOD_UPDATE":
      loadOrders()
      loadMenu()
      break


    case "ORDER_DELETE":
    case "CHECKOUT_UPDATE":
      loadOrders()
      break
  }
}

const session = JSON.parse(localStorage.getItem("session"))
if (!session) window.location.replace("login")
if (Date.now() > session.expiry) {
  localStorage.removeItem("session")
  window.location.replace("login")
}
if (session.role !== "kitchen") window.location.replace("login")

let bellRungForBatch = false
let audioUnlocked = false
let latestOrders = []
let seenOrders = JSON.parse(localStorage.getItem("seenOrders") || "[]")
let notifiedOrders = JSON.parse(localStorage.getItem("notifiedOrders") || "[]")
let hiddenNotifs = JSON.parse(localStorage.getItem("hiddenNotifs") || "[]")
let lastOrderCount = 0
let menuData = []
let menuSortType = "default"

const notifySound = new Audio("external/sound/sound-notification.mp3")

document.addEventListener("click", () => {
  audioUnlocked = true
}, { once: true })

const unlockOverlay = document.createElement("div")
unlockOverlay.id = "audioUnlockOverlay"
unlockOverlay.innerText = "🔔 Click here to enable sound alerts"
unlockOverlay.style.position = "fixed"
unlockOverlay.style.top = "0"
unlockOverlay.style.left = "0"
unlockOverlay.style.width = "100%"
unlockOverlay.style.padding = "12px"
unlockOverlay.style.background = "#333"
unlockOverlay.style.color = "#fff"
unlockOverlay.style.textAlign = "center"
unlockOverlay.style.cursor = "pointer"
unlockOverlay.style.zIndex = "99999"
unlockOverlay.style.fontWeight = "bold"
document.body.appendChild(unlockOverlay)

document.body.style.paddingTop = unlockOverlay.offsetHeight + "px"

unlockOverlay.addEventListener("click", () => {
  audioUnlocked = true
  notifySound.play().then(() => { notifySound.pause(); notifySound.currentTime = 0 }).catch(() => {})
  unlockOverlay.remove()
  document.body.style.paddingTop = ""
}, { once: true })

function renderMenu() {
  let foods = [...menuData]

  if (menuSortType === "az") {
    foods.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
  }

  if (menuSortType === "za") {
    foods.sort((a, b) => b.name.toLowerCase().localeCompare(a.name.toLowerCase()))
  }

  if (menuSortType === "priceLow") {
    foods.sort((a, b) => (a.price || 0) - (b.price || 0))
  }

  if (menuSortType === "priceHigh") {
    foods.sort((a, b) => (b.price || 0) - (a.price || 0))
  }

  if (menuSortType === "available") {
    foods.sort((a, b) => (a.soldOut === b.soldOut) ? 0 : a.soldOut ? 1 : -1)
  }
  if (menuSortType === "category") {
    foods.sort((a, b) =>
      (a.category || "").toLowerCase().localeCompare((b.category || "").toLowerCase())
    )
  }
  let html = ""

  foods.forEach(f => {
    html += `
      <div class="food-card ${f.soldOut ? "sold" : ""}">
        <img src="${f.img}" alt="${f.name}">
        <h3>${f.name} (${f.category})</h3>
        <p>RM ${Number(f.price).toFixed(2)}</p>
        ${f.soldOut ? "<div class='sold-badge'>UNAVAILABLE</div>" : ""}
        <button class="${f.soldOut ? "btn-green" : "btn-red"}"
          onclick="toggleSold('${f._id}')">
          ${f.soldOut ? "Restocked" : "Out of Sales"}
        </button>
      </div>
    `
  })

  document.getElementById("menu").innerHTML = html
}

async function loadMenu() {
  const res = await fetch("/api/menu")
  menuData = await res.json()
  renderMenu()
}

function flashBell() {
  const bell = document.getElementById("bell")

  bell.classList.add("active")

  setTimeout(() => {
    bell.classList.remove("active")
  }, 2000)
}

async function toggleSold(id) {
  await fetch("/api/food/" + id + "/soldout", {
    method: "PUT"
  })

  loadMenu()
}

async function loadOrders() {
  try {
    const res = await fetch("/api/kitchen")
    const data = await res.json()

    const orders = data.activeOrders || []
    latestOrders = orders

    const bellDot = document.getElementById("bellDot")

    const currentIds = orders.map(o => String(o.orderNumber))

    const unreadOrders = orders.filter(o =>
      !seenOrders.includes(String(o.orderNumber))
    )

    bellDot.style.display = unreadOrders.length > 0 ? "block" : "none"

    const newOrders = orders.filter(o =>
      !notifiedOrders.includes(String(o.orderNumber))
    )

    if (newOrders.length > 0) { 
      notifySound.currentTime = 0
      notifySound.play()
      flashBell()

    newOrders.forEach(o => {
        notifiedOrders.push(String(o.orderNumber))
      })

      localStorage.setItem("notifiedOrders", JSON.stringify(notifiedOrders))
    }

    let html = ""

    orders.forEach(o => {
      const items = Array.isArray(o.items) ? o.items : []

      html += `
        <div class="order">
          <h3>Table ${o.tableId} | Order #${o.orderNumber}</h3>
          <p>Ordered at: ${o.time}</p>
          <p>Status: <span class="status status-${o.status}">${o.status}</span></p>
          <p>Remarks: ${o.remarks || "-"}</p>
          <p>Food Items:</p>
          <ul>
            ${items.map(i => `<li>${i.name} x ${i.qty || 1}</li>`).join("")}
          </ul>

          <button onclick="update(${o.orderNumber}, 'PREPARING')">Preparing</button>
          <button onclick="update(${o.orderNumber}, 'READY')">Ready</button>
        </div>
      `
    })

    document.getElementById("orders").innerHTML =
      html || "<p>No active orders</p>"

  } catch (err) {
    console.log("Kitchen load error:", err)
    document.getElementById("orders").innerHTML =
      "<p>Failed to load orders</p>"
  }
}


function applyMenuSort() {
  menuSortType = document.getElementById("sortMenu").value
  renderMenu()
}

function showTab(tab) {
  document.getElementById("orders-section").style.display = "none"
  document.getElementById("menu-section").style.display = "none"

  if (tab === "orders") {
    document.getElementById("orders-section").style.display = "block"
  }

  if (tab === "menu") {
    document.getElementById("menu-section").style.display = "block"
  }
}

async function update(orderNumber, status) {
  await fetch("/api/status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderNumber, status })
  })

  loadOrders()
}

function logout() {
  if (confirm("Do you sure to logout?")) {
    localStorage.removeItem("session")
    window.location.replace("login")
  }
}

const bell = document.getElementById("bell")

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
  fetch("/api/kitchen")
    .then(r => r.json())
    .then(data => {
      const orders = (data.activeOrders || [])
        .filter(o => !hiddenNotifs.includes(o.orderNumber))
      panel.innerHTML = orders.length
        ? orders.map(o => `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
              <div>
                Order <b>#${o.orderNumber}</b><br>
                <small>${o.time}</small>
              </div>

              <button onclick="removeNotif(${o.orderNumber})"
                style="border:none;background:none;cursor:pointer;">
                🗑️
              </button>
            </div>
          `).join("")
        : "<p>No new orders</p>"
    })
}

document.getElementById("bell").onclick = function (e) {
  e.stopPropagation()

  const bellDot = document.getElementById("bellDot")
  bellDot.style.display = "none"

  seenOrders = latestOrders.map(o => String(o.orderNumber))
  localStorage.setItem("seenOrders", JSON.stringify(seenOrders))

  panel.style.display = panel.style.display === "block" ? "none" : "block"

  if (panel.style.display === "block") {
    renderBellPanel()
  }
}

function removeNotif(orderNumber) {
  hiddenNotifs.push(orderNumber)
  localStorage.setItem("hiddenNotifs", JSON.stringify(hiddenNotifs))

  renderBellPanel()
  
}

document.addEventListener("click", function (e) {
  if (!panel.contains(e.target) && e.target.id !== "bell") {
    panel.style.display = "none"
  }
})

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

/* dark mode */
const toggle = document.getElementById("darkToggle")

if (localStorage.getItem("dark") === "true") {
  document.body.classList.add("dark")
  toggle.checked = true
}

toggle.addEventListener("change", () => {
  document.body.classList.toggle("dark")
  localStorage.setItem("dark", document.body.classList.contains("dark"))
})

loadOrders()
loadMenu()
showTab("orders")

