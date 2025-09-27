"use client"

import React from "react"
import { getSocket } from "../lib/socket.js"
import { Card, CardContent } from "./ui/card.jsx"

export function Scoreboard() {
  const [scores, setScores] = React.useState({})

  React.useEffect(() => {
    const s = getSocket()
    const onScores = (payload) => setScores(payload || {})
    s.on("game:scores", onScores)
    return () => s.off("game:scores", onScores)
  }, [])

  const rows = React.useMemo(
    () =>
      Object.entries(scores)
        .map(([playerId, total]) => ({ playerId, total }))
        .sort((a, b) => b.total - a.total),
    [scores],
  )

  return (
    <Card className="bg-secondary">
      <CardContent className="p-4">
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="font-semibold opacity-70">Rank</div>
          <div className="font-semibold opacity-70">Player</div>
          <div className="font-semibold opacity-70 text-right">Score</div>
          {rows.length === 0 ? (
            <div className="col-span-3 text-muted-foreground">Waiting for scores...</div>
          ) : (
            rows.map((row, idx) => (
              <React.Fragment key={row.playerId}>
                <div>{idx + 1}</div>
                <div className="truncate">{row.playerId}</div>
                <div className="text-right">{row.total}</div>
              </React.Fragment>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
