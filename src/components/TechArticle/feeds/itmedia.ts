import { articleLimit } from "../constants/articleLimit";
import { type TechArticle } from '../types/techArticle';

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
        slicedItMediaArticles = latestItMediaArticles.filter((article: ItMediaArticle) => {
            const now = new Date();
            // 前日の朝5時を計算
            const yesterdayMorning5AM = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 5, 0, 0);

            const articleDate = new Date(article.pubDate);

            // NOTE: 前日の朝5時以降の情報を取得する
            // そうすればmainマージ時に更新しても表示される内容は一定（前日の朝5時以降に投稿された記事）になる
            return articleDate >= yesterdayMorning5AM;
        }).slice(0, articleLimit).map((article: ItMediaArticle) => {
            return {
                title: article.title,
                link: article.link,
            }
        });
    } catch(e) {
        console.error(e);
        slicedItMediaArticles = [];
    }
    return {
        name: "ITmediaの新着記事",
        link: "https://www.itmedia.co.jp/",
        items: slicedItMediaArticles,
    }
}
