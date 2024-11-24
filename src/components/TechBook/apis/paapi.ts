import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const ProductAdvertisingAPIv1 = require('paapi5-nodejs-sdk');

// APIのクライアントを設定
const defaultClient = ProductAdvertisingAPIv1.ApiClient.instance;

// 認証情報を設定
defaultClient.accessKey = import.meta.env.PA_API_ACCESS_KEY;
defaultClient.secretKey = import.meta.env.PA_API_SECRET_KEY;
defaultClient.host = 'webservices.amazon.co.jp';
defaultClient.region = 'us-west-2';  // 必要に応じてリージョンを変更

// APIインスタンスの作成
const api = new ProductAdvertisingAPIv1.DefaultApi();

/**
 * 検索リクエストを作成
 */
export const searchTechBookItems = () => {
  const searchItemsRequest = new ProductAdvertisingAPIv1.SearchItemsRequest();

  searchItemsRequest['PartnerTag'] = import.meta.env.PA_API_PARTNER_TAG;  // パートナータグを設定
  searchItemsRequest['PartnerType'] = 'Associates';    // パートナータイプを設定
  searchItemsRequest['SearchIndex'] = 'Books';         // 検索インデックスを設定
  searchItemsRequest['BrowseNodeId'] = '466298';       // ブラウズノードIDを設定
  searchItemsRequest['ItemCount'] = 10;                // 返すアイテムの数を設定
  searchItemsRequest['SortBy'] = 'NewestArrivals';     // ソート方法を設定
  searchItemsRequest['Resources'] = [
    'BrowseNodeInfo.BrowseNodes',
    'BrowseNodeInfo.BrowseNodes.Ancestor',
    'BrowseNodeInfo.BrowseNodes.SalesRank',
    'BrowseNodeInfo.WebsiteSalesRank',
    'CustomerReviews.Count',
    'CustomerReviews.StarRating',
    'Images.Primary.Small',
    'Images.Primary.Medium',
    'Images.Primary.Large',
    'Images.Primary.HighRes',
    'ItemInfo.Title',
    'ItemInfo.ByLineInfo',
    'ItemInfo.ContentInfo',
    'ItemInfo.ContentRating',
    'Offers.Listings.Price'
  ];

  // APIリクエストを送信
  api.searchItems(searchItemsRequest, function (error, data, response) {
    if (error) {
      console.log('API呼び出しエラー:', error);
      return;
    }

    // レスポンスデータの処理
    const searchItemsResponse = ProductAdvertisingAPIv1.SearchItemsResponse.constructFromObject(data);
    console.log('検索結果:', JSON.stringify(searchItemsResponse, null, 2));

    if (searchItemsResponse['SearchResult'] && searchItemsResponse['SearchResult']['Items']) {
      const item = searchItemsResponse['SearchResult']['Items'][0];  // 1つ目のアイテムを表示
      if (item) {
        if (item['ASIN']) {
          console.log('ASIN: ' + item['ASIN']);
        }
        if (item['DetailPageURL']) {
          console.log('詳細ページURL: ' + item['DetailPageURL']);
        }
        if (item['ItemInfo'] && item['ItemInfo']['Title'] && item['ItemInfo']['Title']['DisplayValue']) {
          console.log('タイトル: ' + item['ItemInfo']['Title']['DisplayValue']);
        }
        if (item['Offers'] && item['Offers']['Listings'] && item['Offers']['Listings'][0]['Price'] && item['Offers']['Listings'][0]['Price']['DisplayAmount']) {
          console.log('価格: ' + item['Offers']['Listings'][0]['Price']['DisplayAmount']);
        }
      }
    }
  });
}
