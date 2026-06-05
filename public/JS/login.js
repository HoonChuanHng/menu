function login() {
  const role = document.getElementById("role").value
  const username = document.getElementById("username").value
  const password = document.getElementById("password").value

if (
  role === "admin" &&
  (
    (username === "a1" && password === "123") ||
    (username === "a2" && password === "789")
  )
) {
  const session = {
    role: "admin",
    expiry: Date.now() + 8 * 60 * 60 * 1000
  }

  localStorage.setItem("session", JSON.stringify(session))
  window.location.href = "admin.html"
  return
}

if (
  role === "kitchen" &&
  (
    (username === "k1" && password === "123") ||
    (username === "k2" && password === "789")
  )
) {
  const session = {
    role: "kitchen",
    expiry: Date.now() + 8 * 60 * 60 * 1000
  }

  localStorage.setItem("session", JSON.stringify(session))
  window.location.href = "kitchen.html"
  return
}

if (
  role === "waiter" &&
  (
    (username === "w1" && password === "123") ||
    (username === "w2" && password === "789")
  )
) {
  const session = {
    role: "waiter",
    expiry: Date.now() + 8 * 60 * 60 * 1000
  }

  localStorage.setItem("session", JSON.stringify(session))
  window.location.href = "waiter.html"
  return
}

  document.getElementById("msg").innerText = 
  "Incorrect username or password.\nPlease try again."
}

document.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    login()
  }
})

function goCustomer() {
  window.location.href = "index.html"
}