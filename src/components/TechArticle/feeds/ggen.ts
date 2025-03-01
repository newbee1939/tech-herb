import { geminiSleepSecond } from '../../../constants/geminiSleepSecond';
import { answerFromGenerativeAi } from '../../../libs/googleGenerativeAI';
import { sleep } from '../../../utils/sleep';
import { articleLimit } from '../constants/articleLimit';
import { type TechArticle } from '../types/techArticle';

const DAYS_BEFORE_TODAY = 1;

type GgenArticle = {
  title: string;
  pubDate: Date;
  link: string;
  guid: string;
  author: string;
  thumbnail: string;
  description: string;
  content: string;
  enclosure: {
    link: string;
    type: string;
  };
  categories: string[];
};

export const getGgenMedium = async () => {
  let slicedGgenArticles: TechArticle[] = [];
  try {
    const latestGgenArticles = (
      await (
        await fetch(
          `https://api.rss2json.com/v1/api.json?rss_url=https://blog.g-gen.co.jp/feed&api_key=${import.meta.env.RSS_2_JSON_API_KEY}`,
        )
      ).json()
    ).items;
    const slicedGgenArticlesPromises = latestGgenArticles
      .filter((article: GgenArticle) => {
        const now = new Date();
        // 前日の朝5時を計算
        const yesterdayMorning5AM = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - DAYS_BEFORE_TODAY,
          5,
          0,
          0,
        );

        const articleDate = new Date(article.pubDate);

        // NOTE: 前日の朝5時以降の情報を取得する
        // そうすればmainマージ時に更新しても表示される内容は一定（前日の朝5時以降に投稿された記事）になる
        return articleDate >= yesterdayMorning5AM;
      })
      .slice(0, articleLimit)
      .map(async (article: GgenArticle) => {
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
    slicedGgenArticles = await Promise.all(slicedGgenArticlesPromises);
  } catch (e) {
    console.error(e);
    slicedGgenArticles = [];
  }
  return {
    name: 'Ggen',
    title: 'Ggenの新着記事',
    link: 'https://blog.g-gen.co.jp/',
    items: slicedGgenArticles,
  };
};
