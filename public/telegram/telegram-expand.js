window.Telegram.WebApp.expand()

if (window?.Telegram?.WebApp?.initDataUnsafe?.user) {
  const num = 9999
  function preventCollapse() {
    document.documentElement.style.marginTop = num + "px"
    document.documentElement.style.height = window.innerHeight + num + "px"
    document.documentElement.style.overflow = "hidden"
    window.scrollTo(0, num)
  }

  document.body.addEventListener("touchstart", function() {
    preventCollapse()
  })


  window.onload = function() {
    document.body.style.position = "fixed"
    document.body.style.bottom = 0
    document.body.style.width = "100%"
    document.body.style.height = "100vh"

    const root = document.querySelector("#root")
    root.style.overflowY = "scroll"
    root.style.height = "100%"
  }
}
