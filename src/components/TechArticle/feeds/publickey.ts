import { articleLimit } from "./constants/articleLimit";

type PublicKeyArticle = {
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

export const getPublickeyMedium = async () => {
    let slicedPublickeyArticles: TechArticle[] = [];
    try {
        const latestPublickeyArticles = (await(await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://www.publickey1.jp/atom.xml&api_key=${import.meta.env.RSS_2_JSON_API_KEY}`)).json()).items;
        slicedPublickeyArticles = latestPublickeyArticles.slice(0, articleLimit).map((article: PublicKeyArticle) => {
            return {
                title: article.title,
                link: article.link,
            }
        });
    } catch(e) {
        console.error(e);
        slicedPublickeyArticles  = [];
    }
    console.log(slicedPublickeyArticles);
    return {
        name: "Publickey",
        link: "https://www.publickey1.jp/",
        items: slicedPublickeyArticles,
    };
}