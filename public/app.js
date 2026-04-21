let deferredPrompt

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js")
}

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault()
  deferredPrompt = e

  const btn = document.getElementById("installBtn")
  btn.style.display = "block"

  btn.addEventListener("click", async () => {
    deferredPrompt.prompt()
    await deferredPrompt.userChoice
    deferredPrompt = null
    btn.style.display = "none"
  })
})

window.addEventListener("appinstalled", () => {
  const btn = document.getElementById("installBtn")
  if (btn) btn.style.display = "none"
})