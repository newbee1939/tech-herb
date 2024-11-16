import { articleLimit } from "./constants/articleLimit";
import { type TechArticle } from '../types/techArticle';

type ZennArticle = {
	id: number,
	post_type: string,
	title: string,
	slug: string,
	comments_count: number,
	liked_count: number,
	body_letters_count: number,
	article_type: number,
	emoji: string,
	is_suspending_private: boolean,
	published_at: string,
	body_updated_at: string,
	source_repo_updated_at: Date | null,
	pinned: boolean,
	path: string,
	user: {}[],
	publication: Date | null,
};

export const getZennMedium = async () => {
    let slicedZennArticles: TechArticle[] = [];
    try {
        const trendZennArticles = (await(await fetch('https://zenn.dev/api/articles/')).json()).articles;
        slicedZennArticles = trendZennArticles.slice(0, articleLimit).map((article: ZennArticle) => {
            return {
                title: article.title,
                link: `https://zenn.dev${article.path}`,
            }
        });
    } catch(e) {
        console.error(e);
        slicedZennArticles = [];
    }
    return {
        name: "Zennのトレンド記事",
        link: "https://www.publickey1.jp/",
        items: slicedZennArticles,
    }
}
