import { GoogleGenAI } from '@google/genai'

export async function generateTweet(topic: string, context: string, hashtags: string[], apiKey: string): Promise<string> {
  const client = new GoogleGenAI({ apiKey })

  const hashtagStr = hashtags.length > 0 ? hashtags.join(' ') : ''
  const prompt = `You are a professional Twitter content creator. Generate a single, engaging tweet about: "${topic}"

Additional context/article summary:
${context || topic}

Requirements:
- Maximum 280 characters total including hashtags
- Make it engaging, insightful, and shareable
- Use emojis naturally (1-2 max)
- Sound human and authentic, NOT robotic
- Do NOT include quotation marks around the tweet
- End with: ${hashtagStr}
- Return ONLY the tweet text, nothing else`

  const response = await client.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
  })

  const text = response.text?.trim() || ''
  // Ensure it fits Twitter limit
  if (text.length > 280) return text.slice(0, 277) + '...'
  return text
}
