# Tech Herb🌿

テックオール？(Tech All)
My Tech All
Tech Owl
TechOwl
→Allとフクロウをかけてる
→フクロウは360度を見渡せる

## リンク

https://tech-herb.pages.dev/

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
  - 技術イベント・カンファレンス情報
    - イマココ🚀
    - connpass API
  - memoのCollectInformation
    - 全て含める
- 作成したい機能
  - リンク入力したら要約してくれるページ
  - HTMLを要約してPodcastの自動更新
    - Podcastでその日のハイライトを聴けるように
  - 独自ドメインを取得する
  - アドセンスで収益化
  - 429エラー対策
    - APIキーを増やす？？
      - Geminiのキー発行: https://aistudio.google.com/app/apikey?hl=ja
    - sleepの時間を延ばす
- 実装面
  - もっと容易に購読内容の変更が出来るようにしたい
    - RSS取得処理など共通化？
    - RSSってレスポンス形式がある程度標準化されている？
    - だいたい同じレスポンス構造な気はする
    - 管理しやすい設計
      - 記事調べたり
      - どうすれば自分自身が保守しやすいか？
      - 正解はない
  - デザインをより綺麗にしたい
  - テストを実装する。Viteで
  - importは絶対パスで指定。また、importは自動補完できるように
  - devcontainerで動くように
  - BiomeのLinterやFormatterが動くように
  - ローカルでDocker環境を構築する
  - build時間を表示したい
    - 最終更新がいつかを把握するため
    - Actionsのワークフロー内で更新時間を環境変数とかに埋め込む？
    - アプリ内でその環境変数を参照する？
    - それかファイルに時間を吐き出す？？
    - 色々方法はありそう
- 確認
  - RSSフォーマット決まっている？
  - 管理人のピックアップ記事(意見と共に)
  - 管理人ブログ
  - 管理人プロフィール

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
  - [Astro](https://github.com/newbee1939/memo/blob/main/TechMemo/Framework/Astro.md):v4.10.0
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
    - キャッシュ等のパフォーマンス最適化
    - WAF等のセキュリティ設定
- CI/CD
  - GitHub Actions
  - Action
    - [wrangler-action](https://github.com/cloudflare/wrangler-action?tab=readme-ov-file#deploy-your-pages-site-production--preview)
      - Cloudflareへのデプロイで利用
- テスト
  - Vitest
- エディタ
  - VSCode
- アクセス解析ツール
  - Cloudflare Web Analytics
- パッケージ更新管理
  - Dependabot
    - 自動更新したい
- その他
  - Husky
  - [generative-ai-js](https://github.com/google-gemini/generative-ai-js)
  - [paapi](https://webservices.amazon.com/paapi5/documentation/quick-start/using-sdk.html#nodejs)
  - Vertex AI
  - GitHub Copilot
  - devcontainer
    - 環境を作る

## システムアーキテクチャ

```
GitHub Actions(CD) -> Cloudflare Pages
```

## 疑問点

- Cloudflare Pagesでdeployが開始されない場合がある
  - https://dash.cloudflare.com/43e7f1409d1c6c820ee4aab9a7b29eeb/pages/view/tech-herb/5217fa8c-5d8e-483f-a916-9189c1a12def
  - というより、一回のpushで2回デプロイが走ってる？

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
- [REST-APIを利用したSSG](https://zenn.dev/thirosue/books/6fa991650c5767/viewer/1c002e)
- [GitHub ActionsでビルドしてCloudflare Pagesにデプロイする](https://zenn.dev/nwtgck/articles/1fdee0e84e5808)
- [個人開発マネタイズ大全](https://zenn.dev/nabettu/articles/013f114c7a1b44)
- [Error: The model is overloaded](https://discuss.ai.google.dev/t/error-the-model-is-overloaded/48410)

## 学び・気付き

- Gemini APIは無料で簡単に使える
- wrangler-actionは簡単にpreview環境も作成されてとても便利
- paapiは制約が多い
  - 最大100件のみしか取得できない
  - 10ページ目までしか取得できない
  - 発売日を指定して取得できない
  - BrowseNodeIdをうまく使うことで対象を絞ることができる
- mainでschedule triggerが動いた時に、build・deployが動かない
  - Cloudflare Pagesでは変更がないとbuildが動かないっぽい？
  -  以下の資料にあるように、Cloudflare Pagesでは空コミットでもデプロイは走る
    - https://developers.cloudflare.com/pages/configuration/build-watch-paths/#build-watch-paths:~:text=A%20push%20event%20contains%200%20file%20changes%2C%20in%20case%20a%20user%20pushes%20a%20empty%20push%20event%20to%20trigger%20a%20build

## StudyLater

- コード設計
- Promise
- RSSリーダーの一般的な作り方
- 設計の全ての本
  - 全てのエッセンスを試す場所に

## 設計の本(Tech Herbに取り入れ)

- 良いコード/悪いコードで学ぶ設計入門
  - 進行中

## 設計の記事(Tech Herbに取り入れ)
