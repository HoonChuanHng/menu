let deferredPrompt = null

const installBtn = document.getElementById("installBtn")
const darkToggle = document.getElementById("darkToggle")

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault()
  deferredPrompt = e
  installBtn.style.display = "block"
})

installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) return

  deferredPrompt.prompt()
  const choice = await deferredPrompt.userChoice

  if (choice.outcome === "accepted") {
    installBtn.style.display = "none"
  }

  deferredPrompt = null
})

window.addEventListener("appinstalled", () => {
  console.log("PWA Installed")
})

if (localStorage.getItem("darkMode") === "on") {
  document.body.classList.add("dark")
  darkToggle.checked = true
}

darkToggle.addEventListener("change", (e) => {
  if (e.target.checked) {
    document.body.classList.add("dark")
    localStorage.setItem("darkMode", "on")
  } else {
    document.body.classList.remove("dark")
    localStorage.setItem("darkMode", "off")
  }
})