import { articleLimit } from "../constants/articleLimit";
import { type TechArticle } from '../types/techArticle';
import { answerFromGenerativeAi } from '../../../libs/googleGenerativeAI';
import { sleep } from '../../../utils/sleep';
import { geminiSleepSecond } from '../../../constants/geminiSleepSecond';

type QiitaArticle = {
	title: string,
	pubDate: Date,
	link: string,
	guid: string,
	author: string,
	thumbnail: string,
	description: string,
	content: string,
	enclosure: {},
	categories: string[],
};

export const getQiitaMedium = async () => {
    let slicedQiitaArticles: TechArticle[] = [];
    try {
        const latestQiitaArticles = (await(await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://qiita.com/popular-items/feed&api_key=${import.meta.env.RSS_2_JSON_API_KEY}`)).json()).items;
        const slicedQiitaArticlesPromises = latestQiitaArticles.slice(0, articleLimit).map(async (article: QiitaArticle) => {
            const prompt = `次のHTMLで書かれた技術記事を日本語で分かりやすく80文字程度で簡潔に要約してください！文体は「ですます調」でお願いします！！: ${article.content}`;
            const summarizedBody = await answerFromGenerativeAi(prompt);

            // NOTE: Rate Limit対策
            await sleep(geminiSleepSecond);

            return {
                title: article.title,
                link: article.link,
                summarizedBody,
            }
        });
        slicedQiitaArticles = await Promise.all(slicedQiitaArticlesPromises);
    } catch(e) {
        console.error(e);
        slicedQiitaArticles = [];
    }
    return {
        name: "Qiitaのトレンド記事",
        link: "https://qiita.com/",
        items: slicedQiitaArticles,
    }
}
