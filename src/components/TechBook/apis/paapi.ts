import { DateTime } from 'luxon';
import { type TechBook } from '../types/techBook';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const ProductAdvertisingAPIv1 = require('paapi5-nodejs-sdk');

// APIのクライアントを設定
const defaultClient = ProductAdvertisingAPIv1.ApiClient.instance;

// 認証情報を設定
defaultClient.accessKey = import.meta.env.PA_API_ACCESS_KEY;
defaultClient.secretKey = import.meta.env.PA_API_SECRET_KEY;
defaultClient.host = 'webservices.amazon.co.jp';
defaultClient.region = 'us-west-2';

// APIインスタンスの作成
const api = new ProductAdvertisingAPIv1.DefaultApi();

/**
 * 本日発売の技術書の一覧を返す
 */
export const getTodayReleasedTechBooks = async () => {
  // NOTE: 以下の「コンピュータ・IT」配下のカテゴリを指定
  // https://www.amazon.co.jp/gp/browse.html?rw_useCurrentProtocol=1&node=466298&ref_=ed_book_computer
  const browseNodeIds = [
    492346, // コンピュータ・IT関連の一般・入門書
    492350, // コンピュータサイエンス
    492330, // ハードウェア・周辺機器
    492336, // オペレーティングシステム
    492344, // ネットワーク
    492332, // インターネット・Web開発
    492352, // プログラミング
    492342, // アプリケーション
    502740, // データベース
    492334, // デザイン・グラフィックス
    502754, // モバイル
    515206, // Web開発
  ];

  const todayReleasedTechBooksPromises = browseNodeIds.map(async (browseNodeId) => {
    let pageNumber = 1;
    let todayReleasedTechBooksPerNodeId = [];
    try {
      while (true) {
        const todayReleasedTechBooksPerPage = await getTodayReleasedTechBooksPerPage(browseNodeId, pageNumber);

        // rate limit対策
        await delay(10000); // 10秒待機

        if (!todayReleasedTechBooksPerPage) {
          break;
        }

        todayReleasedTechBooksPerNodeId.push(...todayReleasedTechBooksPerPage);

        pageNumber++;
      }

      return todayReleasedTechBooksPerNodeId;
    } catch (e) {
      console.error(e);
      return [];
    }
  });

  const todayReleasedTechBooks = (await Promise.all(todayReleasedTechBooksPromises)).flat();

  return todayReleasedTechBooks;
}

/**
 * Amazonの新着技術書情報を各BrowseNodeIdの各ページ毎に取得
 *
 * https://www.amazon.co.jp/s?i=stripbooks&rh=n%3A466298%2Cp_n_publication_date%3A2285919051&s=date-desc-rank&dc&qid=1731836991&rnid=82836051&ref=sr_st_date-desc-rank&ds=v1%3A%2FLb5BeqyecGzmgQkHG8LLDAxGn5zlrKO5dSFm66q%2FUk
 */
export const getTodayReleasedTechBooksPerPage = (browseNodeId: number, pageNumber: number): Promise<TechBook[]> => {
  const searchItemsRequest = new ProductAdvertisingAPIv1.SearchItemsRequest();

  searchItemsRequest['PartnerTag'] = import.meta.env.PA_API_PARTNER_TAG;
  searchItemsRequest['PartnerType'] = 'Associates';
  searchItemsRequest['SearchIndex'] = 'Books';
  searchItemsRequest['BrowseNodeId'] = browseNodeId.toString();
  searchItemsRequest['BrowseNodeId'] = '492346';
  searchItemsRequest['ItemPage'] = pageNumber;
  searchItemsRequest['SortBy'] = 'NewestArrivals';
  // TODO: 必要な情報に絞る
  searchItemsRequest['Resources'] = [
    // 'BrowseNodeInfo.BrowseNodes',
    // 'BrowseNodeInfo.BrowseNodes.Ancestor',
    // 'BrowseNodeInfo.BrowseNodes.SalesRank',
    // 'BrowseNodeInfo.WebsiteSalesRank',
    // 'CustomerReviews.Count',
    // 'CustomerReviews.StarRating',
    'ItemInfo.Title',
    // 'ItemInfo.ByLineInfo',
    // 'ItemInfo.ContentInfo',
    // 'ItemInfo.ContentRating',
    // 'Offers.Listings.Price'
  ];

  return new Promise((resolve, reject) => {
    api.searchItems(searchItemsRequest, function (error, data, response) {
      if (error) {
        console.log('API呼び出しエラー:', error);
        reject(error);
      }

      const searchItemsResponse = ProductAdvertisingAPIv1.SearchItemsResponse.constructFromObject(data);

      if (!searchItemsResponse['SearchResult'] || !searchItemsResponse['SearchResult']['Items']) {
        resolve(false);
      }

      const firstItem = searchItemsResponse['SearchResult']['Items'][0];
      // NOTE: そのページの1つ目の本の発売日が過去の時点で、それ以降のページで今日発売の書籍が取れることはないので処理をストップさせる
      if (isYesterdayInJapan(firstItem['ItemInfo']['ContentInfo']['PublicationDate']['DisplayValue'])) {
        resolve(false);
      }

      // TODO: 広告(PR)は除外したい
      const todayReleasedTechBooks = searchItemsResponse['SearchResult']['Items'].filter((item) => {
        // NOTE: 本日発売の書籍に絞る
        return isTodayInJapan(item['ItemInfo']['ContentInfo']['PublicationDate']['DisplayValue']);
      }).map((item) => {
        console.log("================================");
        console.log(item);
        console.log("================================");
        return {
          title: item['ItemInfo']['Title'],
          link: item['DetailPageURL'],
        }
      })

      resolve(todayReleasedTechBooks);
    });
  });
}

const delay = (ms: number) => {
return new Promise(resolve => setTimeout(resolve, ms));
}

function isTodayInJapan(isoDateStr: string) {
  try {
    // ISO8601文字列を日本時間に変換
    const japanDate = DateTime.fromISO(isoDateStr, { zone: 'UTC' }).setZone('Asia/Tokyo');
    const nowInJapan = DateTime.now().setZone('Asia/Tokyo');

    // 年・月・日を比較
    return (
      japanDate.year === nowInJapan.year &&
      japanDate.month === nowInJapan.month &&
      japanDate.day === nowInJapan.day
    );
  } catch {
    return false; // 無効な日付の場合は false
  }
}

function isYesterdayInJapan(isoDateStr: string) {
  try {
    // ISO8601文字列を日本時間に変換
    const japanDate = DateTime.fromISO(isoDateStr, { zone: 'UTC' }).setZone('Asia/Tokyo');
    const nowInJapan = DateTime.now().setZone('Asia/Tokyo');

    // 昨日の日付を計算
    const yesterdayInJapan = nowInJapan.minus({ days: 1 });

    // 年・月・日を比較
    return (
      japanDate.year === yesterdayInJapan.year &&
      japanDate.month === yesterdayInJapan.month &&
      japanDate.day === yesterdayInJapan.day
    );
  } catch {
    return false; // 無効な日付の場合は false
  }
}
