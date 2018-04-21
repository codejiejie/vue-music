export function json(data) {
  return JSON.parse(data.slice(data.indexOf('(') + 1, -1))
}