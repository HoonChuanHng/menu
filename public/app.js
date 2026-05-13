let deferredPrompt = null

window.addEventListener("beforeinstallprompt", (e) => {

  e.preventDefault()

  deferredPrompt = e
})

window.addEventListener("appinstalled", () => {
  console.log("PWA Installed")
})

const darkToggle = document.getElementById("darkToggle")

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