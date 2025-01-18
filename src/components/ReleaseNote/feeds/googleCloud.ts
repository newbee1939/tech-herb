import { type ReleaseNote } from '../types/releaseNote';
import { answerFromGenerativeAi } from '../../../libs/googleGenerativeAI';
import { sleep } from '../../../utils/sleep';
import { geminiSleepSecond } from '../../../constants/geminiSleepSecond';

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
        const mappedGoogleCloudReleaseNotesPromises = googleCloudReleaseNotes.filter((releaseNote: GoogleCloudReleaseNote) => {
            // TODO: グローバルなutilsに切り出す(Vitestでテストも書く)
            // より分かりやすい実装にしたい
            const today = new Date();
            const baseDate = new Date(today.setDate(today.getDate() - 2));
            return new Date(releaseNote.pubDate) > baseDate;
        }).map(async (releaseNote: GoogleCloudReleaseNote) => {
            const prompt = `次のGoogle Cloudのリリースノートの内容の特に重要な部分を日本語で分かりやすく80文字程度で簡潔に要約してください！文体は「ですます調」でお願いします！！: ${releaseNote.description}`
            const description = await answerFromGenerativeAi(prompt);

            // NOTE: Rate Limit対策
            await sleep(geminiSleepSecond);

            const { pubDate: releaseDate, title, link } = releaseNote;

            return {
                releaseDate,
                releaseNoteItems: [{
                    title,
                    link,
                    description,
                }],
            }
        });
        mappedGoogleCloudReleaseNotes = await Promise.all(mappedGoogleCloudReleaseNotesPromises);
    } catch(e) {
        console.error(e);
        mappedGoogleCloudReleaseNotes  = [];
    }

    return {
        name: "Google Cloud",
        link: "https://cloud.google.com/release-notes",
        releaseNotes: mappedGoogleCloudReleaseNotes,
    };
}
