import { appendFileSync, mkdirSync } from "node:fs"
import { homedir } from "node:os"
import { dirname, join } from "node:path"

const LOG_FILE = join(homedir(), ".local", "share", "opencode", "log", "micode-v2.log")
const warned = new Set()

function stringify(value) {
  if (typeof value === "string") return value
  if (value instanceof Error) return `${value.name}: ${value.message}`
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

export function log(message, ...rest) {
  const line = ["[micode-v2]", message, ...rest.map(stringify)].join(" ")
  try {
    console.log(line)
  } catch {}
  try {
    mkdirSync(dirname(LOG_FILE), { recursive: true })
    appendFileSync(LOG_FILE, `${new Date().toISOString()} ${line}\n`)
  } catch {}
}

/** Log a capability gap once per process so the log stays readable. */
export function warnOnce(key, message) {
  if (warned.has(key)) return
  warned.add(key)
  log(`WARN ${message}`)
}