import { answerFromGenerativeAi } from '../../../libs/googleGenerativeAI';
import { sleep } from '../../../utils/sleep';
import { geminiSleepSecond } from '../../../constants/geminiSleepSecond';

type GitHubReleaseNote = {
  url: string;
  assets_url: string;
  upload_url: string;
  html_url: string;
  id: number;
  author: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    user_view_type: string;
    site_admin: boolean;
  };
  node_id: string;
  tag_name: string;
  target_commitish: string;
  name: string;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string;
  assets: unknown[]; // NOTE: 詳細が不明なため`unknown`としている。型が判明した場合は更新する
  tarball_url: string;
  zipball_url: string;
  body: string;
};

const GITHUB_API_BASE = "https://api.github.com";
const GITHUB_TOKEN = import.meta.env.GITHUB_TOKEN;

const libraries = [
  { name: "Astro", link: "https://github.com/withastro/astro/releases", owner: "withastro", repo: "astro" },
  { name: "TypeScript", link: "https://github.com/withastro/astro/releases", owner: "microsoft", repo: "typescript" },
];

/**
 * 特定のライブラリのリリースノート情報を取得
 */
async function getReleaseNotes(owner: string, repo: string) {
  const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/releases`;

  try {
    const releaseNotes = (await(await fetch(url, {
      headers: {
        "Authorization": `Bearer ${GITHUB_TOKEN}`,
      },
    })).json());
    const mappedReleaseNotesPromises = releaseNotes.filter((releaseNote: GitHubReleaseNote) => {
      // TODO: グローバルなutilsに切り出す(Vitestでテストも書く)
      const today = new Date();
      // TODO: 対象のライブラリごとに切り替えたい
      const baseDate = new Date(today.setDate(today.getDate() - 3));
      return new Date(releaseNote.published_at) > baseDate;
    }).map(async (releaseNote: GitHubReleaseNote) => {
      const prompt = `次のリリースノートの内容の特に重要な部分を日本語で分かりやすく80文字程度で簡潔に要約してください！文体は「ですます調」でお願いします！！: ${releaseNote.body}`
      const description = await answerFromGenerativeAi(prompt);

      // NOTE: Rate Limit対策
      await sleep(geminiSleepSecond);

      const { published_at: releaseDate, name: title, html_url: link } = releaseNote;

      return {
        releaseDate,
        releaseNoteItems: [{
          title,
          link,
          description,
        }],
      }
    });
    const mappedReleaseNotes = await Promise.all(mappedReleaseNotesPromises);
    return mappedReleaseNotes;
  } catch (error) {
    console.error(`Failed to fetch releases for ${owner}/${repo}:`, error);
    return [];
  }
}

/**
 * 複数のライブラリのリリースノート情報を返す
 */
export async function getGitHubReleaseNotesList() {
  const gitHubReleaseNotesPromises =  libraries.map(async (library) => {
    const { owner, repo, name, link } = library;
    const releaseNotes = await getReleaseNotes(owner, repo);
    return {
      name,
      link,
      releaseNotes,
    };
  });
  const gitHubReleaseNotesList = await Promise.all(gitHubReleaseNotesPromises);
  return gitHubReleaseNotesList;
}
