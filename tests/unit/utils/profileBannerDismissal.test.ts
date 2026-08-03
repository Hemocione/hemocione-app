import { describe, expect, it } from 'vitest'
import {
  DISMISSAL_WINDOW_DAYS,
  getDismissalKey,
  nextDismissalExpiry,
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

  it('ignores a non-finite timestamp', () => {
    // Number("Infinity") is not NaN, and now - Infinity is negative, which would
    // otherwise hide the banner forever.
    expect(
      shouldShowBanner({
        missingFields: ['document'],
        dismissedAt: Infinity,
        now,
      })
    ).toBe(true)
    expect(
      shouldShowBanner({
        missingFields: ['document'],
        dismissedAt: -Infinity,
        now,
      })
    ).toBe(true)
  })

  it('ignores a timestamp in the future', () => {
    expect(
      shouldShowBanner({
        missingFields: ['document'],
        dismissedAt: now + 60_000,
        now,
      })
    ).toBe(true)
  })

  it('accepts a dismissal made right now', () => {
    expect(
      shouldShowBanner({ missingFields: ['document'], dismissedAt: now, now })
    ).toBe(false)
  })
})

describe('getDismissalKey', () => {
  it('scopes the key to the donor, so one account does not hide another', () => {
    expect(getDismissalKey('user-a')).not.toBe(getDismissalKey('user-b'))
    expect(getDismissalKey('user-a')).toContain('user-a')
  })

  it('falls back to a shared key when there is no user', () => {
    expect(getDismissalKey(null)).toBe(getDismissalKey(undefined))
    expect(getDismissalKey(null)).not.toContain('null')
  })
})

describe('nextDismissalExpiry', () => {
  it('returns how long until the window expires', () => {
    const dismissedAt = daysAgo(2)
    expect(nextDismissalExpiry({ dismissedAt, now })).toBe(
      (DISMISSAL_WINDOW_DAYS - 2) * 24 * 60 * 60 * 1000
    )
  })

  it('returns null when there is nothing to wait for', () => {
    expect(nextDismissalExpiry({ dismissedAt: null, now })).toBeNull()
    expect(
      nextDismissalExpiry({ dismissedAt: daysAgo(30), now })
    ).toBeNull()
    expect(nextDismissalExpiry({ dismissedAt: Infinity, now })).toBeNull()
  })
})
