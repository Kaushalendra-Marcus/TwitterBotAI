import { TwitterApi } from 'twitter-api-v2'

interface TwitterCredentials {
  apiKey:      string
  apiSecret:   string
  accessToken: string
  accessSecret: string
}

export async function postToX(content: string, creds: TwitterCredentials): Promise<string> {
  const client = new TwitterApi({
    appKey:            creds.apiKey,
    appSecret:         creds.apiSecret,
    accessToken:       creds.accessToken,
    accessSecret:      creds.accessSecret,
  })

  const rwClient = client.readWrite
  const tweet    = await rwClient.v2.tweet(content)
  return tweet.data.id
}