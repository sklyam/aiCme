import { createServerFn } from '@tanstack/react-start'
import { getProfileName, getAllContentAsString, getProfile } from '../lib/content'

export const fetchProfileName = createServerFn({ method: 'GET' }).handler(
  async () => {
    return getProfileName()
  },
)

export const fetchAllContent = createServerFn({ method: 'GET' }).handler(
  async () => {
    return getAllContentAsString()
  },
)

export const fetchProfile = createServerFn({ method: 'GET' }).handler(async () => {
  return getProfile() ?? null
})
