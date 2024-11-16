import { type ReleaseNote } from '../types/releaseNote';

type GoogleCloudReleaseNote = {
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

export const getGoogleCloudReleaseNote = async () => {
    let mappedGoogleCloudReleaseNotes: ReleaseNote[] = [];
    try {
        const googleCloudReleaseNotes = (await(await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://cloud.google.com/feeds/gcp-release-notes.xml&api_key=${import.meta.env.RSS_2_JSON_API_KEY}`)).json()).items;
        mappedGoogleCloudReleaseNotes = googleCloudReleaseNotes.filter((releaseNote: GoogleCloudReleaseNote) => {
            // TODO: グローバルなutilsに切り出す(Vitestでテストも書く)
            // より分かりやすい実装にしたい
            const today = new Date();
            const baseDate = new Date(today.setDate(today.getDate() - 3));
            return new Date(releaseNote.pubDate) > baseDate;
        }).map((releaseNote: GoogleCloudReleaseNote) => {
            return {
                title: releaseNote.title,
                link: releaseNote.link,
                description: releaseNote.description,
            }
        });
    } catch(e) {
        console.error(e);
        mappedGoogleCloudReleaseNotes  = [];
    }

    return {
        name: "Google Cloud",
        link: "https://cloud.google.com/release-notes",
        items: mappedGoogleCloudReleaseNotes,
    };
}
