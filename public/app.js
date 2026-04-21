let deferredPrompt

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault()
  deferredPrompt = e

  const btn = document.getElementById("installBtn")
  if (btn) btn.style.display = "block"
})

window.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("installBtn")

  if (btn) {
    btn.addEventListener("click", async () => {
      if (!deferredPrompt) return

      deferredPrompt.prompt()
      const choice = await deferredPrompt.userChoice
      deferredPrompt = null

      btn.style.display = "none"
    })
  }
})

window.addEventListener("appinstalled", () => {
  const btn = document.getElementById("installBtn")
  if (btn) btn.style.display = "none"
})