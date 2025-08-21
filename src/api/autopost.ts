import { postbyAI } from "../lib/geminiai.js";
import { searchTrendingTopic } from "../lib/search.js";
import { fetchParagraphs } from "../lib/getpara.js";
import { searchTopics, directTopics } from '../constants/alltopics.js'
import { POSTtoTwitter } from "../lib/posttox.js";
import type { Request, Response } from "express";
async function createPost() {
    try {
        const isRandom = Math.random() > 0.5;
        let tweetAI: string | null = null
        if (isRandom) {
            if (!searchTopics.length) throw new Error("No search direct topics found");
            const topic = searchTopics[Math.floor(Math.random() * searchTopics.length)];
            console.log("TOPIC IS FROM SEARCH 🔍🔍: ", topic);
            if (!topic) throw new Error("No direct topics found");
            const search = await searchTrendingTopic(topic);


            if (!search?.length) throw new Error("No search results found");

            const data = search[Math.floor(Math.random() * search.length)];
            if (!data?.link) throw new Error("No link found in search result");
            console.log("Getting the trendig topic from SEARCH TREDING TOPIC APIS ::: ", data.link);
            const para = await fetchParagraphs(data.link, 6);
            const query = para.join(" ");
            const queryPass = `Create an engaging Twitter/X post under 270 characters about:
                        ${query}
                        Guidelines:
                        - Start with an attention-grabbing hook
                        - Keep it concise (max 270 chars)
                        - Include 1-2 relevant hashtags
                        - Add emojis where appropriate only one emojis if required then max two emojis
                        - Maintain a conversational tone
                        - Remeber don't add any website link
                        - Try to simple language
                        `
            tweetAI = (await postbyAI(queryPass)) ?? null;
            console.log("Tweet is :", tweetAI);
        }
        else {
            if (!directTopics.length) throw new Error("No search direct topics found");
            const topic = directTopics[Math.floor(Math.random() * directTopics.length)];
            console.log("TOPIC IS FROM DIRECT: ", topic);
            if (!topic) throw new Error("No search topics found");
            const queryPass = `Create an engaging Twitter/X post under 270 characters about:
                        ${topic}
                        Guidelines:
                        - Start with an attention-grabbing hook
                        - Keep it concise (max 270 chars)
                        - Include 1-2 relevant hashtags
                        - Add emojis where appropriate only one emojis if required then max two emojis
                        - Maintain a conversational tone
                        - Remeber don't add any website link
                        - Try to simple language
                        `
            tweetAI = (await postbyAI(queryPass)) ?? null;
            console.log("Tweet is :", tweetAI);
        }
        if (!tweetAI) {
            tweetAI = "System Error 404: POST banane ka mood nahi hai by AI. When your Agentic AI don't work but you have second option 😎😎"
        }
        await POSTtoTwitter(tweetAI)
        console.log("Final tweet after tweet is : ", tweetAI);

        return { success: true, tweet: tweetAI }
    } catch (err) {
        const error = err as Error
        console.error("Error while creating post:", error);
        return { success: false, error: error.message };
    }
}

export async function schedular(req: Request, res: Response) {
    const result = await createPost();
    if (result.success) {
        return res.status(200).json(result);
    } else {
        return res.status(400).json(result);
    }
}