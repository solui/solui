import { _ } from '@solui/utils'

let loadPromiseResolver

const loadPromise = new Promise(resolve => {
  loadPromiseResolver = resolve
})

if (typeof window !== 'undefined') {
  const s = document.createElement('script')
  s.src = 'https://unpkg.com/3box@1.17.1/dist/3box.js'
  window.document.body.appendChild(s)

  // wait until it's loaded
  const timer = setInterval(() => {
    if (_.get(window, 'Box.getProfile')) {
      clearInterval(timer)
      loadPromiseResolver()
    }
  }, 2000)
}

export const ThreeBox = {
  loaded: () => loadPromise,
  getProfile: async addr => {
    const p = await window.Box.getProfile(addr)
    if (p && p.memberSince && p.proof_did) {
      p.verifiedAccounts = await window.Box.getVerifiedAccounts(p)
    }
    return p
  }
}