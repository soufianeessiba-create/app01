import React, { useEffect, useState } from 'react'

export default function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    function beforeInstall(e) {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', beforeInstall)
    window.addEventListener('appinstalled', () => setInstalled(true))

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js').catch(console.error)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstall)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const choice = await deferredPrompt.userChoice
    if (choice.outcome === 'accepted') setInstalled(true)
    setDeferredPrompt(null)
  }

  return (
    <div className="container">
      <header>
        <img src="/src/assets/logo.svg" alt="logo" className="logo" />
        <h1>app01 — PWA Demo</h1>
      </header>
      <main>
        <p>Bienvenue — ceci est une Progressive Web App (PWA) simple, installable.</p>
        {deferredPrompt && !installed && (
          <button onClick={handleInstall}>Installer l'application</button>
        )}
        {installed && <p>L'application est installée&nbsp;!</p>}
      </main>
      <footer>
        <p>Construite avec React + Vite</p>
      </footer>
    </div>
  )
}
