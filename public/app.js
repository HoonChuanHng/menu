let deferredPrompt

window.addEventListener("beforeinstallprompt", (e) => {
  console.log("INSTALL PROMPT FIRED")

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
      await deferredPrompt.userChoice

      deferredPrompt = null
      btn.style.display = "none"
    })
  }
})

window.addEventListener("appinstalled", () => {
  console.log("APP INSTALLED")

  const btn = document.getElementById("installBtn")
  if (btn) btn.style.display = "none"
})

document.getElementById("darkToggle").addEventListener("change", (e) => {
  document.body.classList.toggle("dark", e.target.checked)
})