import { TwitterApi } from 'twitter-api-v2'

export interface TwitterCreds {
  appKey: string
  appSecret: string
  accessToken: string
  accessSecret: string
}

export async function postTweet(creds: TwitterCreds, text: string) {
  const client = new TwitterApi(creds)
  const response = await client.readWrite.v2.tweet(text)
  return response
}
