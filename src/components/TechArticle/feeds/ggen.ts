import { articleLimit } from "../constants/articleLimit";
import { type TechArticle } from '../types/techArticle';

type GgenArticle = {
	title: string,
	pubDate: Date,
	link: string,
	guid: string,
	author: string,
	thumbnail: string,
	description: string,
	content: string,
	enclosure: {
        link: string,
        type: string,
    },
	categories: string[],
};

export const getGgenMedium = async () => {
    let slicedGgenArticles: TechArticle[] = [];
    try {
        const latestGgenArticles = (await(await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://blog.g-gen.co.jp/feed&api_key=${import.meta.env.RSS_2_JSON_API_KEY}`)).json()).items;
        slicedGgenArticles = latestGgenArticles.slice(0, articleLimit).map((article: GgenArticle) => {
            return {
                title: article.title,
                link: article.link,
            }
        });
    } catch(e) {
        console.error(e);
        slicedGgenArticles  = [];
    }
    return {
        name: "Ggenの新着記事",
        link: "https://blog.g-gen.co.jp/",
        items: slicedGgenArticles,
    };
}
