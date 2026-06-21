import { createServerFn } from '@tanstack/react-start'
import { getProfileName, getAllContentAsString } from '../lib/content'

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
