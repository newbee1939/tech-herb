# Tech Herb🌿

## setup

1. asdf で Node.js をインストール

```shell
# Node.jsのプラグインを追加
asdf plugin add nodejs
# Node.jsのバージョンを確認
asdf list all nodejs
# 特定のバージョンのNode.jsをインストール
asdf install nodejs 20.18.0
# 現在のディレクトリで使用するNode.jsのバージョンを指定
asdf local nodejs 20.18.0

# 既に.tool-versionsが存在する場合は以下のコマンドを実行する
asdf install
```

2. astro のインストール

```shell
npm create astro@4.10.0 .
```

3. Biome

```shell
npm install --save-dev --save-exact @biomejs/biome
```

## イメージ図

https://www.figma.com/design/RLUoqJ7zmrM9HuDYnSlh6Z/Tech-Herb?node-id=0-1&node-type=canvas&t=5EaYmCT2W2UTurp4-0

## キャッチコピー

- 「技術の全て」

## コンセプト

- あくまで「自分が見たい技術情報」を一元化して表示することに集中
- Publickey のように自分の好きな情報を好きなように発信するイメージ
- 自分の専門を書いておけば、偏っていても問題ない

## 解決したい課題

- 技術情報を把握する、トレンドをキャッチアップし続けるのが難しい..
- 情報が散らばっている..
- 毎日見ようと思ったら大変..

## サイトの特徴

- `インプット効率の最大化`
  - このサイトを見たら全てが分かる(技術情報の一元化)
  - なるべくタブ遷移とかリンク遷移はせずに一覧で表示
    - 上から下に見ていけば、ある程度その日の技術トレンドを把握できる状態
  - 記事の内容を把握するまでの速度を最大化(要約など使って？)

## 表示内容

- 表示したい技術情報
  - 技術記事(様々なサイト)
    - 新着記事
      - Technology Radar など新着がないものは普段は非表示
      - たまに投稿されたらトップに分かりやすく表示
      - 差分更新
        - 必要なものだけ表示する
    - 人気記事
    - タイトルクリックしたらメディア一覧へ
  - 技術動画
  - 技術音声
  - GitHub のリリース情報
  - GitHub の人気リポジトリ情報
  - 人気エンジニア関連ツイート
    - 自分がまとめたリストを表示させる
  - 技術イベント・カンファレンス情報
  - 自分の投稿
    - Zenn の feed など？
  - 新刊情報
    - https://www.amazon.co.jp/gp/bestsellers/english-books/2635017051

## 使用技術

- デザイン
  - Figma
- パッケージ管理
  - asdf
- ランタイム
  - Node.js:v20.18.0
- パッケージマネージャ
  - npm:v10.8.2
- フレームワーク
  - Astro:v4.10.0
    - 今回の要件として、静的サイトジェネレータ(SSG)で十分
      - ゼロ JS
        - JavaScript のオーバーヘッドと複雑さを低減
        - クライアント JavaScript の実行によるインタラクティブな UI はほとんど不要なので
      - サーバーファースト
      - 定期的(一日一回)ビルドし直してコンテンツを生成する
        - 参考: [定期的に自動ビルドする](https://zenn.dev/catnose99/articles/cb72a73368a547756862#%E5%AE%9A%E6%9C%9F%E7%9A%84%E3%81%AB%E8%87%AA%E5%8B%95%E3%83%93%E3%83%AB%E3%83%89%E3%81%99%E3%82%8B)
    - 高速・高パフォーマンス
    - 自由な UI
      - React、Preact、Svelte、Vue、Solid、Lit、HTMX、ウェブコンポーネントなどをサポートしているので、特定のライブラリにロックされない
      - アイランドアーキテクチャにより、コンポーネントごとに柔軟にライブラリを選定可能
    - Cloudflare Workers との連携にも対応している
      - 参考: https://developers.cloudflare.com/workers/frameworks/framework-guides/astro/
      - より高速な動作が可能に
- Linter/Formatter
  - Biome
- インフラ
  - Cloudflare Pages
    - 無料なのに、リクエスト数、帯域幅が無制限
    - デプロイがシンプル
      1. GitHub リポジトリと連携する
      2. 利用するフレームワークや環境変数をセットする
      3. デプロイを待つ
- CI/CD
  - GitHub Actions
- エディタ
  - VSCode
- アクセス解析ツール
  - Cloudflare Web Analytics
- パッケージ更新管理
  - Dependabot

## システムアーキテクチャ

## コード設計・アーキテクチャ

## 参考記事

- [個人開発における開発プロセスを公開してみる](https://qiita.com/himatani/items/3b8301da2e889e962e5e)
- [【個人開発・ポートフォリオに】無料で簡単にいい感じのデザインにできるサービスまとめ](https://qiita.com/aiandrox/items/4196c8f5b564d29fdce7)
- [[Astro×Hono×Fresh 対談] Next.js じゃない FW が見据えるフロントエンドの未来 #フロントエンドの未来](https://offers.jp/media/event-report/a_4875)
- [Web サービスを無料で手軽にモダンなインフラにデプロイしよう！](https://zenn.dev/lovegraph/articles/56f8d5f28ba1c3)
- [しずかなインターネットの技術構成](https://zenn.dev/catnose99/articles/f8a90a1616dfb3)
- [Next.js アプリを Vercel から Google Cloud に移行した話](https://zenn.dev/team_zenn/articles/5e9547a5c207e3)
- [チーム個々人のテックブログを RSS で集約するサイトを作った（Next.js）](https://zenn.dev/catnose99/articles/cb72a73368a547756862)
- [Zenn を支える技術とサービス構成](https://zenn.dev/catnose99/articles/zenn-dev-stack)
- [Astro Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)
- [Astro サイトを Cloudflare Pages にデプロイする](https://docs.astro.build/ja/guides/deploy/cloudflare/)
- [Cloudflare Pages で動作する Astro 製ブログのランタイムを bun に移行した話](https://qiita.com/Yu_yukk_Y/items/0678fb8e04a093493502)
- [Astro で Bun を使う](https://docs.astro.build/ja/recipes/bun/)
- [Build an app with Astro and Bun](https://bun.sh/guides/ecosystem/astro)
- [Partial support for Astro, Svelte and Vue files](https://biomejs.dev/blog/biome-v1-6/)
