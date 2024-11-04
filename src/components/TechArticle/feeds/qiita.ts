import { articleLimit } from "./constants/articleLimit";
import { type TechArticle } from '../types/techArticle';

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
        slicedQiitaArticles = latestQiitaArticles.slice(0, articleLimit).map((article: QiitaArticle) => {
            return {
                title: article.title,
                link: article.link,
            }
        });
    } catch(e) {
        slicedQiitaArticles = [];
    }
    return {
        name: "Qiita",
        link: "https://qiita.com/",
        items: slicedQiitaArticles,
    }
}
