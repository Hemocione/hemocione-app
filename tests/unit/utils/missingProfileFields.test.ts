import { describe, expect, it } from 'vitest'
import { getMissingProfileFields } from '~/utils/missingProfileFields'

const completeUser = {
  document: '11144477735',
  gender: 'F',
  addresses: [{ id: 1, postalCode: '22222-000' }],
}

describe('getMissingProfileFields', () => {
  it('returns nothing for a complete profile', () => {
    expect(getMissingProfileFields(completeUser as any)).toEqual([])
  })

  it('flags a missing CPF', () => {
    expect(
      getMissingProfileFields({ ...completeUser, document: '' } as any)
    ).toEqual(['document'])
  })

  it('flags a null gender', () => {
    expect(
      getMissingProfileFields({ ...completeUser, gender: null } as any)
    ).toEqual(['gender'])
  })

  it('flags an empty address list', () => {
    expect(
      getMissingProfileFields({ ...completeUser, addresses: [] } as any)
    ).toEqual(['address'])
  })

  it('flags a missing address list', () => {
    expect(
      getMissingProfileFields({ ...completeUser, addresses: undefined } as any)
    ).toEqual(['address'])
  })

  it('flags every pending field at once, in a stable order', () => {
    expect(
      getMissingProfileFields({
        document: '',
        gender: null,
        addresses: [],
      } as any)
    ).toEqual(['document', 'gender', 'address'])
  })

  it('returns nothing when there is no user', () => {
    expect(getMissingProfileFields(null)).toEqual([])
    expect(getMissingProfileFields(undefined)).toEqual([])
  })
})
