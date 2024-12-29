import { type TechBook } from '../types/techBook';
import { sleep } from '../../../utils/sleep';

type BookItem = { Item: TechBook }

const getLastMonth = (date = new Date()) => {
  const lastMonthDate = new Date(date.getFullYear(), date.getMonth() - 1);
  const year = lastMonthDate.getFullYear();
  const month = lastMonthDate.getMonth() + 1; // NOTE:月は0から始まるので+1する
  return `${year}年${month}月`;
}

const getToday = (date = new Date()) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 今月 (0から始まるので+1)
  const day = date.getDate();

  return `${year}年${month}月${day}日`;
}

export const getTodayReleasedTechBooks = async (): Promise<TechBook[]> => {
  try {
    let techBooks = [];
    let count = 1;

    while (true) {
      const techBooksPerPageResponse = await fetch(`https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404?applicationId=${import.meta.env.RAKUTEN_APPLICATION_ID}&booksGenreId=001005&sort=%2DreleaseDate&elements=salesDate,title,itemUrl&page=${count}`);
      const techBooksPerPage = (await techBooksPerPageResponse.json()).Items;

      techBooks.push(...techBooksPerPage);

      const lastMonth = getLastMonth();
      const hasLastMonthPublishedBook = techBooksPerPage.some((book: BookItem) => book.Item.salesDate.includes(`${lastMonth}`));

      if (hasLastMonthPublishedBook) {
        break;
      }

      count++;

      // NOTE: 利用制限(1秒に1回)に対処
      // 参考: https://webservice.faq.rakuten.net/hc/ja/articles/900001974383-%E5%90%84API%E3%81%AE%E5%88%A9%E7%94%A8%E5%88%B6%E9%99%90%E3%82%92%E6%95%99%E3%81%88%E3%81%A6%E3%81%8F%E3%81%A0%E3%81%95%E3%81%84
      await sleep(10);
    }
    // 今日の発売の書籍に絞る
    const todayPublishedTechBooks = techBooks.filter((book: BookItem) => {
      const today = getToday();
      return book.Item.salesDate.includes(today);
    }).map((book: BookItem) => {
      const { title, itemUrl, salesDate} = book.Item;
      return {
        title,
        itemUrl,
        salesDate,
      }
    });

    return todayPublishedTechBooks;
  } catch (e) {
    console.error(e);

    return [];
  }
}
