const session = JSON.parse(localStorage.getItem("session"))
if (!session) window.location.replace("login")
if (Date.now() > session.expiry) {
  localStorage.removeItem("session")
  window.location.replace("login")
}
if (session.role !== "admin") window.location.replace("login")

let foodData = []
let foodSortType = "default"
let chartType = "barH"
window.foodChartInstance = null
window.lastAdminData = null

function renderFood() {
  let food = [...foodData]
  if (foodSortType === "default") {
    food.sort((a, b) => a._id.localeCompare(b._id))
  }
  if (foodSortType === "az") {
    food.sort((a, b) => a.name.localeCompare(b.name))
  }

  if (foodSortType === "za") {
    food.sort((a, b) => b.name.localeCompare(a.name))
  }

  if (foodSortType === "priceLow") {
    food.sort((a, b) => a.price - b.price)
  }

  if (foodSortType === "priceHigh") {
    food.sort((a, b) => b.price - a.price)
  }

  if (foodSortType === "category") {
    food.sort((a, b) => a.category.localeCompare(b.category))
  }

  let foodHtml = ""

  food.forEach(f => {
    foodHtml += `
      <div class="card">
        <img src="${f.img}" width="80">
        <h3>${f.name} (${f.category})</h3>
        <p>RM ${Number(f.price).toFixed(2)}</p>
        <button onclick='editFood(${JSON.stringify(f)})'>Edit</button>
        <button onclick="deleteFood('${f._id}')">Delete</button>
      </div>
    `
  })

  document.getElementById("foodList").innerHTML = foodHtml
}

async function load() {
  const res = await fetch("/api/admin")
  const data = await res.json()
  window.lastAdminData = data

  document.getElementById("revenue").innerText =
    "Total Revenue: RM " + data.revenue.toFixed(2)

  let o = ""
  data.orders.forEach(order => {
    o += `
      <div class="admin-order">
        <h3>Table ${order.tableId} | Order #${order.orderNumber}</h3>
        ${order.time ? `<p>Ordered at: ${order.time}</p>` : ""}
        ${order.readyAt ? `<p>Ready at: ${order.readyAt}</p>` : ""}
        ${order.doneAt ? `<p>Done at: ${order.doneAt}</p>` : ""}
        <p>Status: <span class="status status-${order.status}">${order.status}</span></p>
        <p>Remarks: ${order.remarks || "-"}</p>
        <ul>
          ${order.items.map(i =>
            `<li>${i.name} x ${i.qty || 1}</li>`
          ).join("")}
        </ul>
        <button class="danger" onclick="delOrder('${order.orderNumber}')">Delete</button>
      </div>
    `
  })
  document.getElementById("orders").innerHTML = o

  foodData = await fetch("/api/menu").then(r => r.json())
  renderFood()
  renderChart(data)
}

function applyFoodSort() {
  foodSortType = document.getElementById("sortFood").value
  renderFood()
}

/* SAFE PRICE */
async function editFood(food) {
  const name = prompt("Food name:", food.name)
  const priceInput = prompt("Price:", food.price)
  const category = prompt("Category:", food.category)
  const img = prompt("Image URL:", food.img)

  const price = parseFloat(priceInput)
  if (!name || isNaN(price) || price <= 0 || !category || !img) {
    alert("Invalid input")
    return
  }

  await fetch("/api/food/" + food._id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      price,
      category,
      img
    })
  })

  load()
}

async function deleteFood(id) {
  await fetch("/api/food/" + id, { method: "DELETE" })
  load()
}

function renderChart(data) {
  let labels = Object.keys(data.foodCount)
  let values = Object.values(data.foodCount)

  const ctx = document.getElementById("foodChart").getContext("2d")

  const textColor = document.body.classList.contains("dark")
  ? "white"
  : "black"
  if (window.foodChartInstance) window.foodChartInstance.destroy()

  if (chartType === "line") {
    const dailySales = {}

    data.orders.forEach(order => {
      const date = new Date(order.time).toLocaleDateString("en-MY")

      let total = 0

      order.items.forEach(item => {
        total += Number(item.price || 0) * Number(item.qty || 1)
      })

      dailySales[date] = (dailySales[date] || 0) + total
    })

    labels = Object.keys(dailySales)
    values = Object.values(dailySales)
  }

  let isHorizontal = chartType === "barH"

  if (chartType === "barH") {
    let sorted = labels
      .map((l, i) => ({ l, v: values[i] }))
      .sort((a, b) => b.v - a.v)

    labels = sorted.map(x => x.l)
    values = sorted.map(x => x.v)
  }

  window.foodChartInstance = new Chart(ctx, {
    type: chartType === "line"
      ? "line"
      : chartType === "pie"
      ? "pie"
      : "bar",

    data: {
      labels,
      datasets: [{
        label: chartType === "line"
          ? "Daily Revenue (RM)"
          : "Food Sold",
        data: values
      }]
    },
    
    options: {
      indexAxis: chartType === "barH" ? "y" : "x",
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: textColor,
            font: {
              size: 12
            }
          }
        },
      tooltip: {
        titleColor: textColor,
        bodyColor: textColor,
        backgroundColor: document.body.classList.contains("dark") ? "#222" : "#fff",
        borderColor: document.body.classList.contains("dark") ? "#444" : "#ccc",
        borderWidth: 1
      }
      },
      scales: {
        x: {
          ticks: {
            color: textColor
          },
          grid: {
            color: document.body.classList.contains("dark") ? "#333" : "#eee"
          }
        },
        y: {
          ticks: {
            color: textColor
          },
          grid: {
            color: document.body.classList.contains("dark") ? "#333" : "#eee"
          }
        }
      }
    }
  })  
}

function changeChart(type) {
  chartType = type
  if (window.lastAdminData) renderChart(window.lastAdminData)
}

function logout() {
  if (confirm("Do you sure to logout?")) {
    localStorage.removeItem("session")
    window.location.replace("login")
  }
}

function showSection(id) {
  document.querySelectorAll(".section").forEach(s => {
    s.style.display = "none"
  })

  document.getElementById(id).style.display = "block"

  if (id === "usersSection") {
    loadUsers()
  }
}

async function createUser() {
  const username = document.getElementById("newUsername").value
  const password = document.getElementById("newPassword").value
  const role = document.getElementById("newRole").value

  if (!username || !password) return alert("Missing fields")

  await fetch("/api/admin/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, role })
  })

  document.getElementById("newUsername").value = ""
  document.getElementById("newPassword").value = ""

  loadUsers()
}

/* default view */
showSection("dashboard")

async function delOrder(id) {
  await fetch("/api/order/" + id, { method: "DELETE" })
  load()
}

async function addFood() {
  const fileInput = document.getElementById("imgFile")
  const price = Number(document.getElementById("price").value)

  if (!fileInput.files.length) return alert("Select image")
  if (isNaN(price) || price <= 0) return alert("Invalid price")

  const formData = new FormData()
  formData.append("image", fileInput.files[0])

  const uploadRes = await fetch("/api/upload", {
    method: "POST",
    body: formData
  })

  const uploadData = await uploadRes.json()

  const res = await fetch("/api/food", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: document.getElementById("name").value,
      price,
      img: uploadData.url,
      category: document.getElementById("category").value
    })
  })

  if (res.ok) {
    alert("Food added!")

    document.getElementById("name").value = ""
    document.getElementById("price").value = ""
    document.getElementById("category").value = ""
    fileInput.value = ""

    load()
  }
}

async function loadUsers() {
  const res = await fetch("/api/admin/users")
  const users = await res.json()

  document.getElementById("users").innerHTML = users.map(u => `
    <div class="user-card">
      <p>User ID: ${u.username}</p>
      <p>Role: ${u.role}</p>
      <button class="del-btn" onclick="deleteUser('${u._id}')">Delete</button>
    </div>
  `).join("")
}

async function deleteUser(id) {
  if (!confirm("Delete this user permanently?")) return

  await fetch("/api/admin/users/" + id, {
    method: "DELETE"
  })

  loadUsers()
}

/* DARK MODE */
const toggle = document.getElementById("darkToggle")

if (localStorage.getItem("dark") === "true") {
  document.body.classList.add("dark")
  toggle.checked = true
}

toggle.addEventListener("change", () => {
  document.body.classList.toggle("dark")
  localStorage.setItem("dark", document.body.classList.contains("dark"))

  if (window.lastAdminData) {
    renderChart(window.lastAdminData)
  }
})

load()
setInterval(load, 3000)
