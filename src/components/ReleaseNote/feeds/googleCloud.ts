import { type ReleaseNote } from '../types/releaseNote';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
            // TODO: 切り出して汎用的に使えるようにする
            // The model is overloadedのエラーになるので、SDK使うの一旦やめる？
            const genAI = new GoogleGenerativeAI(import.meta.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
            const prompt = `次のGoogle Cloudのリリースノートの内容の特に重要な部分を日本語で分かりやすく80文字程度で簡潔に要約してください！文体は「ですます調」でお願いします！！: ${releaseNote.description}`
            const result = await model.generateContent(prompt);
            const response = result.response;
            const descriptionSummarizedByAi = response.text();

            return {
                releaseDate: releaseNote.pubDate,
                releaseNoteItems: [{
                    title: releaseNote.title,
                    link: releaseNote.link,
                    description: descriptionSummarizedByAi,
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
