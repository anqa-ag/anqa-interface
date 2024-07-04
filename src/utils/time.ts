export function getDisplayPeriod(periodInMilliseconds: number): string {
  const numberOfMinutes = periodInMilliseconds / 1000 / 60
  const days = Math.floor(numberOfMinutes / 24 / 60)
  if (days > 0)
    return `${days}d ago`
  const hours = Math.floor(numberOfMinutes / 60)
  if (hours > 0)
    return `${hours}h ago`
  return `${numberOfMinutes}m ago`
}
