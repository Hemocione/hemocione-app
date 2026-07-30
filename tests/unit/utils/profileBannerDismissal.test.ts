import { describe, expect, it } from 'vitest'
import {
  DISMISSAL_WINDOW_DAYS,
  shouldShowBanner,
} from '~/utils/profileBannerDismissal'

const now = new Date('2026-07-30T12:00:00Z').getTime()
const daysAgo = (days: number) => now - days * 24 * 60 * 60 * 1000

describe('shouldShowBanner', () => {
  it('shows when fields are missing and it was never dismissed', () => {
    expect(
      shouldShowBanner({ missingFields: ['document'], dismissedAt: null, now })
    ).toBe(true)
  })

  it('hides when nothing is missing', () => {
    expect(shouldShowBanner({ missingFields: [], dismissedAt: null, now })).toBe(
      false
    )
  })

  it('hides right after a dismissal', () => {
    expect(
      shouldShowBanner({
        missingFields: ['document'],
        dismissedAt: daysAgo(1),
        now,
      })
    ).toBe(false)
  })

  it('shows again after the dismissal window', () => {
    expect(
      shouldShowBanner({
        missingFields: ['document'],
        dismissedAt: daysAgo(DISMISSAL_WINDOW_DAYS + 1),
        now,
      })
    ).toBe(true)
  })

  it('keeps hiding exactly at the window edge', () => {
    expect(
      shouldShowBanner({
        missingFields: ['document'],
        dismissedAt: daysAgo(DISMISSAL_WINDOW_DAYS),
        now,
      })
    ).toBe(false)
  })

  it('ignores a corrupted timestamp and shows the banner', () => {
    expect(
      shouldShowBanner({ missingFields: ['gender'], dismissedAt: NaN, now })
    ).toBe(true)
  })

  it('nothing missing wins over a corrupted timestamp', () => {
    expect(
      shouldShowBanner({ missingFields: [], dismissedAt: NaN, now })
    ).toBe(false)
  })

  it('uses a 7-day window', () => {
    expect(DISMISSAL_WINDOW_DAYS).toBe(7)
  })
})
