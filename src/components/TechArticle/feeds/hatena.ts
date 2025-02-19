import { geminiSleepSecond } from '../../../constants/geminiSleepSecond';
import { answerFromGenerativeAi } from '../../../libs/googleGenerativeAI';
import { sleep } from '../../../utils/sleep';
import { articleLimit } from '../constants/articleLimit';
import { type TechArticle } from '../types/techArticle';

type HatenaArticle = {
  title: string;
  pubDate: Date;
  link: string;
  guid: string;
  author: string;
  thumbnail: string;
  description: string;
  content: string;
  enclosure: Record<string, unknown>;
  categories: string[];
};

export const getHatenaMedium = async () => {
  let slicedHatenaArticles: TechArticle[] = [];
  try {
    const latestHatenaArticles = (
      await (
        await fetch(
          `https://api.rss2json.com/v1/api.json?rss_url=https://b.hatena.ne.jp/hotentry/it.rss&api_key=${import.meta.env.RSS_2_JSON_API_KEY}`,
        )
      ).json()
    ).items;
    const slicedHatenaArticlesPromises = latestHatenaArticles
      .slice(0, articleLimit)
      .map(async (article: HatenaArticle) => {
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
        };
      });
    slicedHatenaArticles = await Promise.all(slicedHatenaArticlesPromises);
  } catch (e) {
    console.error(e);
    slicedHatenaArticles = [];
  }
  return {
    name: 'はてなブックマーク',
    title: 'はてなブックマーク(テクノロジー)のトレンド記事',
    link: 'https://b.hatena.ne.jp/hotentry/it',
    items: slicedHatenaArticles,
  };
};
