export interface EnhancedResume {
  name: string
  title: string
  headline: string
  bio: string
  contact: {
    email: string
    location: string
    social: { github: string; linkedin: string; website: string }
  }
  sections: Array<{
    type: string
    title: string
    items: Array<{
      title: string
      subtitle: string
      date: string
      description: string
      highlights: string[]
      tags: string[]
      links: Array<{ label: string; url: string }>
    }>
  }>
}
