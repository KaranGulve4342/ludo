const levels = ["error", "warn", "info", "debug"]
const levelIndex =
  levels.indexOf(import.meta.env.VITE_LOG_LEVEL) >= 0 ? levels.indexOf(import.meta.env.VITE_LOG_LEVEL) : 2 // default info

function ts() {
  return new Date().toISOString()
}

function logAt(lvl, ...args) {
  const idx = levels.indexOf(lvl)
  if (idx <= levelIndex) {
    // eslint-disable-next-line no-console
    console[lvl === "debug" ? "log" : lvl](`[${ts()}] [${lvl.toUpperCase()}]`, ...args)
  }
}

export const logger = {
  error: (...a) => logAt("error", ...a),
  warn: (...a) => logAt("warn", ...a),
  info: (...a) => logAt("info", ...a),
  debug: (...a) => logAt("debug", ...a),
}
