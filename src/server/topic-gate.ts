const PROFILE_SIGNALS = [
  /\b(about|background|bio|profile|resume|cv|portfolio)\b/i,
  /\b(projects?|work|experience|skills?|education|degree|role|company|contact)\b/i,
  /\b(you|your|he|his|she|her|they|their)\b/i,
  /(\u5c65\u6b77|\u7b80\u5386|\u7c21\u6b77|\u80cc\u666f|\u4ecb\u7d39|\u8d44\u6599|\u8cc7\u6599|\u4f5c\u54c1|\u9805\u76ee|\u9879\u76ee|\u5c08\u6848|\u4e13\u6848|\u7d93\u9a57|\u7ecf\u9a8c|\u6280\u80fd|\u6280\u8853|\u6280\u672f|\u6559\u80b2|\u5b78\u6b77|\u5b66\u5386|\u516c\u53f8|\u8077\u4f4d|\u804c\u4f4d|\u806f\u7d61|\u8054\u7cfb|\u4ed6|\u5979|\u4f60|\u9019\u500b\u4eba|\u8fd9\u4e2a\u4eba)/,
]

const CLEARLY_OFF_TOPIC_SIGNALS = [
  /(\u80a1\u50f9|\u80a1\u4ef7|\u80a1\u7968|\u5929\u6c23|\u5929\u6c14|\u65b0\u805e|\u65b0\u95fb|\u532f\u7387|\u6c47\u7387|\u5f69\u7968|\u661f\u5ea7|\u98df\u8b5c|\u98df\u8c31)/,
  /(\u6392\u5e8f\u7b97\u6cd5|\u6392\u5e8f\u6f14\u7b97\u6cd5|\u5beb\u4ee3\u78bc|\u5199\u4ee3\u7801|\u5beb\u7a0b\u5f0f|\u5199\u7a0b\u5e8f|\u751f\u6210\u4ee3\u7801|\u7522\u751f\u7a0b\u5f0f\u78bc|\u5237\u984c|\u5237\u9898)/,
  /\b(stock|weather|news|exchange rate|lottery|horoscope|recipe)\b/i,
  /\b(write|generate|implement|debug|fix|explain)\b.*\b(code|algorithm|function|script|sql|regex)\b/i,
]

function hasAnySignal(text: string, signals: RegExp[]): boolean {
  return signals.some((signal) => signal.test(text))
}

export function isClearlyOffTopicProfileQuestion(question: string): boolean {
  const normalized = question.trim()
  if (!normalized) return false

  const appearsProfileRelated = hasAnySignal(normalized, PROFILE_SIGNALS)
  if (appearsProfileRelated) return false

  return hasAnySignal(normalized, CLEARLY_OFF_TOPIC_SIGNALS)
}

export function getProfileOnlyReply(name: string): string {
  return `I can only answer questions about ${name}'s profile.`
}
