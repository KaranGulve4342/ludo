"use client"

import React from "react"
import { getSocket } from "../lib/socket.js"
import { cn } from "../lib/utils.js"

export function Header() {
  const [connected, setConnected] = React.useState(false)

  React.useEffect(() => {
    const s = getSocket()
    const onConnect = () => setConnected(true)
    const onDisconnect = () => setConnected(false)
    s.on("connect", onConnect)
    s.on("disconnect", onDisconnect)
    return () => {
      s.off("connect", onConnect)
      s.off("disconnect", onDisconnect)
    }
  }, [])

  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
      <div className="container flex h-14 items-center justify-between">
        <div className="font-semibold tracking-tight">Qreate Ludo</div>
        <div
          className={cn(
            "text-xs px-2 py-1 rounded",
            connected ? "bg-green-600 text-white" : "bg-muted text-muted-foreground",
          )}
          aria-live="polite"
        >
          {connected ? "Connected" : "Disconnected"}
        </div>
      </div>
    </header>
  )
}
