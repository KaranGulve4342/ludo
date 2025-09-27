"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import useSWR from "swr"
import { io } from "socket.io-client"
import { apiGet, apiPost } from "./api"

const socketUrl = import.meta.env.VITE_API_URL || "http://localhost:5000"

export default function App() {
  const [gameId, setGameId] = useState("demo")
  const [connected, setConnected] = useState(false)
  const socketRef = useRef(null)

  const { data, mutate, isLoading, error } = useSWR(
    gameId ? `/api/games/${encodeURIComponent(gameId)}/scores` : null,
    apiGet,
    { refreshInterval: 0, revalidateOnFocus: false },
  )

  const scores = useMemo(() => {
    const rows = Object.entries(data?.scores || {}).map(([playerId, score]) => ({
      playerId,
      score,
    }))
    rows.sort((a, b) => b.score - a.score)
    return rows
  }, [data])

  useEffect(() => {
    if (!gameId) return

    const socket = io(socketUrl, {
      transports: ["websocket"],
      withCredentials: true,
    })
    socketRef.current = socket

    socket.on("connect", () => setConnected(true))
    socket.on("disconnect", () => setConnected(false))

    socket.emit("game:join", { gameId })

    socket.on("score:update", (payload) => {
      if (payload?.gameId !== gameId) return
      mutate(
        (prev) => {
          const next = prev ? { ...prev } : { gameId, scores: {} }
          next.scores = { ...(prev?.scores || {}) }
          if (payload.playerId && typeof payload.score === "number") {
            next.scores[payload.playerId] = payload.score
          }
          return next
        },
        { revalidate: false },
      )
    })

    return () => {
      socket.emit("game:leave", { gameId })
      socket.disconnect()
    }
  }, [gameId, mutate])

  async function addPoints(playerId, delta) {
    await apiPost(`/api/games/${encodeURIComponent(gameId)}/score`, {
      playerId,
      delta,
    })
  }

  async function createPlayer() {
    const name = prompt("Enter new player name")
    if (!name) return
    const playerId = name.trim().toLowerCase().replace(/\s+/g, "-")
    mutate(
      (prev) => {
        const next = prev ? { ...prev } : { gameId, scores: {} }
        next.scores = { ...(prev?.scores || {}) }
        if (!(playerId in next.scores)) next.scores[playerId] = 0
        return next
      },
      { revalidate: false },
    )
  }

  return (
    <div className="container">
      <header className="row" style={{ justifyContent: "space-between", marginBottom: 12 }}>
        <h1 style={{ margin: 0 }}>Ludo Scoreboard</h1>
        <div className="row">
          <span style={{ color: connected ? "#37d67a" : "#ff7f50" }}>{connected ? "Live" : "Offline"}</span>
        </div>
      </header>

      <section className="card" style={{ marginBottom: 16 }}>
        <div className="row" style={{ gap: 8, alignItems: "stretch" }}>
          <input
            className="input"
            placeholder="Game ID"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            aria-label="Game ID"
            style={{ maxWidth: 240 }}
          />
          <button className="button" onClick={createPlayer}>
            Add Player
          </button>
        </div>
      </section>

      <section className="card">
        <h2 style={{ marginTop: 0 }}>Scores</h2>
        {isLoading && <p>Loading scores…</p>}
        {error && <p style={{ color: "#ff7f50" }}>Failed to load scores.</p>}
        {!isLoading && !error && (
          <>
            <table className="table" role="table" aria-label="Scoreboard">
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Score</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((row) => (
                  <tr key={row.playerId}>
                    <td>{row.playerId}</td>
                    <td>{row.score}</td>
                    <td>
                      <div className="row">
                        <button className="button" onClick={() => addPoints(row.playerId, +1)}>
                          +1
                        </button>
                        <button className="button" onClick={() => addPoints(row.playerId, +5)}>
                          +5
                        </button>
                        <button className="button" onClick={() => addPoints(row.playerId, -1)}>
                          -1
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {scores.length === 0 && (
                  <tr>
                    <td colSpan="3" style={{ color: "#98a3b3" }}>
                      No players yet. Click “Add Player”.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </section>
    </div>
  )
}
