import { DateTime } from 'luxon';
import { type TechBook } from '../types/techBook';

const getLastMonth = (date = new Date()) => {
  const lastMonthDate = new Date(date.getFullYear(), date.getMonth() - 1);
  const year = lastMonthDate.getFullYear();
  const month = lastMonthDate.getMonth() + 1; // NOTE:月は0から始まるので+1する
  return `${year}年${month}月`;
};

const getToday = (date = new Date()) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 今月 (0から始まるので+1)
  const day = date.getDate();

  return `${year}年${month}月${day}日`;
};

export const getTodayReleasedTechBooks = async (): Promise<TechBook[]> => {
  let techBooks = [];

  // TODO: try-catch入れる

  let count = 1;
  while (true) {
    const techBooksPerPageResponse = await fetch(`https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404?applicationId=${import.meta.env.RAKUTEN_APPLICATION_ID}&booksGenreId=001005&sort=%2DreleaseDate&elements=salesDate,title,itemUrl&page=${count}`);
    const techBooksPerPage = (await techBooksPerPageResponse.json()).Items;

    console.log("=====================================");
    console.log(count);
    console.log(techBooksPerPage);
    console.log("=====================================");
    techBooks.push(...techBooksPerPage);

    const lastMonth = getLastMonth();
    const hasLastMonthPublishedBook = techBooksPerPage.some(book => book.Item.salesDate.includes(`${lastMonth}`));

    if (hasLastMonthPublishedBook) {
      break;
    }

    count++;
  }

  // 今日の発売の書籍に絞る
  const todayPublishedTechBooks = techBooks.filter((book) => {
    const today = getToday();
    return book.Item.salesDate.includes(`${today}`);
  }).map((book) => {
    const { title, link} = book.Item;
    return {
      title,
      link
    }
  });

  return todayPublishedTechBooks;
}
