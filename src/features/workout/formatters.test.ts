import { describe, expect, it } from 'vitest'
import { formatBreakSeconds, formatSeconds } from './formatters'

describe('formatSeconds', () => {
  it('formats zero-padded minutes and seconds', () => {
    expect(formatSeconds(0)).toBe('00:00')
    expect(formatSeconds(5)).toBe('00:05')
    expect(formatSeconds(65)).toBe('01:05')
  })

  it('clamps negative values to zero', () => {
    expect(formatSeconds(-10)).toBe('00:00')
  })

  it('floors fractional seconds before formatting', () => {
    expect(formatSeconds(61.9)).toBe('01:01')
  })
})

describe('formatBreakSeconds', () => {
  it('formats break countdowns without a leading minute zero', () => {
    expect(formatBreakSeconds(32)).toBe('0:32')
    expect(formatBreakSeconds(90)).toBe('1:30')
  })

  it('clamps negative values to zero', () => {
    expect(formatBreakSeconds(-2)).toBe('0:00')
  })
})
