import { createServerFn } from '@tanstack/react-start'
import { getProfileName, getAllContentAsString } from '../lib/content'
import { parseResumeFromMd } from '../lib/resume-parser'

export const fetchResumeData = createServerFn({ method: 'GET' }).handler(async () => {
  return parseResumeFromMd()
})

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
