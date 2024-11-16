import { articleLimit } from "./constants/articleLimit";
import { type TechArticle } from '../types/techArticle';

type HatenaArticle = {
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

export const getHatenaMedium = async () => {
    let slicedHatenaArticles: TechArticle[] = [];
    try {
        const latestHatenaArticles = (await(await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://b.hatena.ne.jp/hotentry/it.rss&api_key=${import.meta.env.RSS_2_JSON_API_KEY}`)).json()).items;
        slicedHatenaArticles = latestHatenaArticles.slice(0, articleLimit).map((article: HatenaArticle) => {
            return {
                title: article.title,
                link: article.link,
            }
        });
    } catch(e) {
        console.error(e);
        slicedHatenaArticles = [];
    }
    return {
        name: "はてなブックマーク(テクノロジー)のトレンド記事",
        link: "https://b.hatena.ne.jp/hotentry/it",
        items: slicedHatenaArticles,
    }
}
