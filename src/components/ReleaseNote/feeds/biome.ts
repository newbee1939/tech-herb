import { type ReleaseNote } from '../types/releaseNote';

type BiomeReleaseNote = {
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

export const getBiomeReleaseNote = async () => {
  let mappedBiomeReleaseNotes: ReleaseNote[] = [];
  try {
    const biomeReleaseNotes = (
      await (
        await fetch(
          `https://api.rss2json.com/v1/api.json?rss_url=https://biomejs.dev/feed.xml&api_key=${import.meta.env.RSS_2_JSON_API_KEY}`,
        )
      ).json()
    ).items;
    mappedBiomeReleaseNotes =
      biomeReleaseNotes === undefined
        ? []
        : biomeReleaseNotes
            .filter((releaseNote: BiomeReleaseNote) => {
              // TODO: グローバルなutilsに切り出す(Vitestでテストも書く)
              // より分かりやすい実装にしたい
              const today = new Date();
              const baseDate = new Date(today.setDate(today.getDate() - 100));
              return new Date(releaseNote.pubDate) > baseDate;
            })
            .map((releaseNote: BiomeReleaseNote) => {
              return {
                releaseDate: releaseNote.pubDate,
                // TODO: ここって配列である必要ある？
                releaseNoteItems: [
                  {
                    title: releaseNote.title,
                    link: releaseNote.link,
                    description: releaseNote.description,
                  },
                ],
              };
            });
  } catch (e) {
    console.error(e);
    mappedBiomeReleaseNotes = [];
  }
  return {
    name: 'Biome',
    link: 'https://biomejs.dev/blog/',
    releaseNotes: mappedBiomeReleaseNotes,
  };
};
