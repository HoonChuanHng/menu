async function login() {
  const role = document.getElementById("role").value
  const username = document.getElementById("username").value
  const password = document.getElementById("password").value

  const res = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password, role })
  })

  if (!res.ok) {
    document.getElementById("msg").innerText = "Incorrect username or password"
    return
  }

  const data = await res.json()

  const session = {
    role: data.role,
    username: data.username,
    expiry: Date.now() + 8 * 60 * 60 * 1000
  }

  localStorage.setItem("session", JSON.stringify(session))

  window.location.href = data.role
}

document.getElementById("login-enter").addEventListener("submit", function (e) {
  e.preventDefault()
  login()
})

function goCustomer() {
  window.location.href = "index.html"
}