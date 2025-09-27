"use client"

import React from "react"
import { Button } from "./ui/button.jsx"
import { Input } from "./ui/input.jsx"
import { getSocket } from "../lib/socket.js"
import { logger } from "../lib/logger.js"

export function RoomControl() {
  const [roomId, setRoomId] = React.useState("lobby-1")
  const [name, setName] = React.useState("Observer")

  function joinRoom(e) {
    e.preventDefault()
    const s = getSocket()
    s.emit("game:join", { roomId, playerId: name || "observer", playerName: name || "Observer", pawns: [] })
    logger.info("Join requested", { roomId, name })
  }

  return (
    <form onSubmit={joinRoom} className="flex flex-col gap-3 md:flex-row">
      <Input
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="Enter room id"
        aria-label="Room ID"
      />
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        aria-label="Player name"
      />
      <Button type="submit" className="md:w-40">
        Join
      </Button>
    </form>
  )
}
