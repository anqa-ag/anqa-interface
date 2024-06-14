export interface IPontem {
  connect: () => Promise<void>
  disconnect: () => Promise<void>
}

function detectProvider(timeout = 3000) {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (typeof window.pontem === "undefined") {
      const timer = setTimeout(reject, timeout)
      window.addEventListener(
        "#pontemWalletInjected",
        (e) => {
          clearTimeout(timer)
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          resolve(e.detail)
        },
        { once: true },
      )
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      resolve(window.pontem)
    }
  })
}

detectProvider()
  .then((provider) => console.log("Pontem Wallet Detected", provider))
  .catch(() => console.log("Pontem Wallet not found"))
