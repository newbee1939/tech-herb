import { articleLimit } from "../constants/articleLimit";
import { answerFromGenerativeAi } from '../../../libs/googleGenerativeAI';
import { type TechArticle } from '../types/techArticle';
import { sleep } from '../../../utils/sleep';
import { geminiSleepSecond } from '../../../constants/geminiSleepSecond';

const DAYS_BEFORE_TODAY = 1;

type ItMediaArticle = {
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

export const getItMediaMedium = async () => {
    let slicedItMediaArticles: TechArticle[] = [];
    try {
        const latestItMediaArticles = (await(await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://rss.itmedia.co.jp/rss/2.0/topstory.xml&api_key=${import.meta.env.RSS_2_JSON_API_KEY}`)).json()).items;
        const slicedItMediaArticlesPromises = latestItMediaArticles.filter((article: ItMediaArticle) => {
            const now = new Date();
            // 前日の朝5時を計算
            const yesterdayMorning5AM = new Date(now.getFullYear(), now.getMonth(), now.getDate() - DAYS_BEFORE_TODAY, 5, 0, 0);

            const articleDate = new Date(article.pubDate);

            // NOTE: 前日の朝5時以降の情報を取得する
            // そうすればmainマージ時に更新しても表示される内容は一定（前日の朝5時以降に投稿された記事）になる
            return articleDate >= yesterdayMorning5AM;
        }).slice(0, articleLimit).map(async(article: ItMediaArticle) => {
            const response = await fetch(article.link);
            const bodyHtml = await response.text();

            const prompt = `次のHTMLで書かれた技術記事を日本語で分かりやすく80文字程度で簡潔に要約してください！文体は「ですます調」でお願いします！！: ${bodyHtml}`;
            const summarizedBody = await answerFromGenerativeAi(prompt);

            // NOTE: Rate Limit対策
            await sleep(geminiSleepSecond);

            return {
                title: article.title,
                link: article.link,
                summarizedBody,
            }
        });
        slicedItMediaArticles = await Promise.all(slicedItMediaArticlesPromises)
    } catch(e) {
        console.error(e);
        slicedItMediaArticles = [];
    }
    return {
        name: "ITmedia",
        title: "ITmediaの新着記事",
        link: "https://www.itmedia.co.jp/",
        items: slicedItMediaArticles,
    }
}
