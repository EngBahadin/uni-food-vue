/**
 * Add minutes to a time string
 * @param timeStr - Time string in format "HH:MM AM/PM"
 * @param minutesToAdd - Number of minutes to add
 * @returns Time string with minutes added
 */
export function addMinutesToTime(timeStr: string, minutesToAdd: number): string {
  // Parse the time string
  const [time, modifier] = timeStr.split(' ')
  if (!time) {
    throw new Error('Invalid time string')
  }
  const [hoursStr, minutesStr] = time.split(':')
  if (!hoursStr || !minutesStr) {
    throw new Error('Invalid time format')
  }
  let hours = Number(hoursStr)
  let minutes = Number(minutesStr)

  // Convert to 24-hour format if necessary
  if (modifier === 'PM' && hours !== 12) {
    hours += 12
  } else if (modifier === 'AM' && hours === 12) {
    hours = 0
  }

  // Add the minutes
  const totalMinutes = hours * 60 + minutes + minutesToAdd
  const newHours = Math.floor(totalMinutes / 60) % 24
  const newMinutes = totalMinutes % 60

  // Convert back to 12-hour format
  let displayHours = newHours
  let displayModifier = 'AM'

  if (newHours === 0) {
    displayHours = 12
  } else if (newHours === 12) {
    displayModifier = 'PM'
  } else if (newHours > 12) {
    displayHours = newHours - 12
    displayModifier = 'PM'
  }

  return `${displayHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')} ${displayModifier}`
}


