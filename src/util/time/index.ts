import { DateTime } from 'luxon'

export function formatDateTime(date: string): string {
  const dateTime = DateTime.fromISO(date, { zone: 'Asia/Taipei' })

  return dateTime.toFormat('yyyy-MM-dd HH:mm:ss')
}
