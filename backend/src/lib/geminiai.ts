import Groq from "groq-sdk"

export async function generateTweet(topic: string, apiKey: string): Promise<string> {
  const groq = new Groq({ apiKey })
  
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: `Generate a single engaging tweet about: "${topic}". Max 280 chars. No quotes around it. Just the tweet text.` }],
    max_tokens: 100
  })

  const text = completion.choices[0]?.message?.content?.trim() ?? ""
  return text.length > 280 ? text.slice(0, 277) + "..." : text
}