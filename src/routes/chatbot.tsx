import { createFileRoute } from '@tanstack/react-router'
import { Chatbot } from '../components/Chatbot'
import { fetchProfileName } from '../server/content-api'

export const Route = createFileRoute('/chatbot')({
  component: ChatbotPage,
  loader: () => fetchProfileName(),
})

function ChatbotPage() {
  const name = Route.useLoaderData()

  return <Chatbot name={name} />
}
