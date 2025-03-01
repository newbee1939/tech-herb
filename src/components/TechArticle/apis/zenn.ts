import { geminiSleepSecond } from '../../../constants/geminiSleepSecond';
import { answerFromGenerativeAi } from '../../../libs/googleGenerativeAI';
import { sleep } from '../../../utils/sleep';
import { articleLimit } from '../constants/articleLimit';
import { type TechArticle } from '../types/techArticle';

type ZennArticle = {
  id: number;
  post_type: string;
  title: string;
  slug: string;
  comments_count: number;
  liked_count: number;
  body_letters_count: number;
  article_type: number;
  emoji: string;
  is_suspending_private: boolean;
  published_at: string;
  body_updated_at: string;
  source_repo_updated_at: Date | null;
  pinned: boolean;
  path: string;
  user: Record<string, unknown>[];
  publication: Date | null;
};

export const getZennMedium = async () => {
  let slicedZennArticles: TechArticle[] = [];
  try {
    const trendZennArticles = (
      await (await fetch('https://zenn.dev/api/articles/')).json()
    ).articles;
    const slicedZennArticlesPromises = trendZennArticles
      .slice(0, articleLimit)
      .map(async (article: ZennArticle) => {
        const bodyHtml = (
          await (
            await fetch(`https://zenn.dev/api/articles/${article.slug}`)
          ).json()
        ).article.body_html;
        const prompt = `次のHTMLで書かれた技術記事を日本語で分かりやすく80文字程度で簡潔に要約してください！文体は「ですます調」でお願いします！！: ${bodyHtml}`;
        const summarizedBody = await answerFromGenerativeAi(prompt);

        // NOTE: Rate Limit対策
        await sleep(geminiSleepSecond);

        return {
          title: article.title,
          link: `https://zenn.dev${article.path}`,
          summarizedBody,
        };
      });
    slicedZennArticles = await Promise.all(slicedZennArticlesPromises);
  } catch (e) {
    console.error(e);
    slicedZennArticles = [];
  }
  return {
    name: 'Zenn',
    title: 'Zennのトレンド記事',
    link: 'https://zenn.dev/',
    items: slicedZennArticles,
  };
};
