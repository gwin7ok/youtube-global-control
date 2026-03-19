# YouTube Global Control

YouTubeの動画をグローバルショートカットキーで操作するChrome拡張機能です。

## 使用可能な機能

この拡張機能では、以下のショートカットキーコマンドが定義されています：

### デフォルトで割り当て済み
- **toggle_play_pause**: YouTubeの動画を再生/一時停止
  - デフォルトキー: `Alt+Shift+P`
- **toggle_mute**: ミュート切り替え
  - デフォルトキー: `Alt+Shift+M`
- **seek_forward**: 5秒進める
  - デフォルトキー: `Alt+Shift+End`
- **seek_backward**: 5秒戻す
  - デフォルトキー: `Alt+Shift+Home`

### 追加で設定可能なコマンド
- **volume_up**: 音量を上げる
- **volume_down**: 音量を下げる
- **goto_start**: 動画の最初に移動
- **goto_end**: 動画の最後に移動
- **speed_up**: 再生速度を上げる
- **speed_down**: 再生速度を下げる
- **speed_normal**: 通常の再生速度に戻す
- **toggle_captions**: 字幕表示切り替え
- **next_video**: 次の動画へ
- **previous_video**: 前の動画へ
- **toggle_bookmark**: 現在位置をブックマーク
- **next_bookmark**: 次のブックマークへ
- **next_chapter**: 次のチャプターへ
- **previous_chapter**: 前のチャプターへ

これらのコマンドは、Chrome拡張機能のショートカット設定ページ（chrome://extensions/shortcuts）から自由にキーボードショートカットを割り当てることができます。

注意: デフォルトショートカットとグローバル登録
注意: デフォルトショートカット
- 本拡張では、以下の4つのみデフォルトでショートカットを割り当てています（必要に応じて `chrome://extensions/shortcuts` で変更してください）。

 

## トラブルシューティング（`toggle_play_pause` が自動登録されない場合）
- 拡張を読み込んだ直後に `toggle_play_pause` の割当が空になっている事例が報告されています。拡張はマニフェスト上でデフォルトを提供しますが、Chrome側の状態によっては反映されない場合があります。
- 対処手順:
  1. `chrome://extensions` で本拡張の「Service worker」を開き、コンソールで以下を実行して登録状態を確認してください:

  ```js
  chrome.commands.getAll(commands => console.log('registered commands:', commands));
  fetch(chrome.runtime.getURL('manifest.json')).then(r=>r.json()).then(m=>console.log('manifest commands:', m.commands));
  ```

  2. 出力で `manifest` に `suggested_key` があり `registered commands` 側の `shortcut` が空の場合、コンソールログにヒントが出ます（拡張は起動時に不足を検出してログを出すようになっています）。
  3. 最も確実なのは `chrome://extensions/shortcuts` を開いて手動で `toggle_play_pause` を割り当てることです。

注: プログラム側からショートカットを自動で書き換える API は提供されていないため、最終的にはユーザーの手動割当が必要になる場合があります。
- **重要**: Chromeの仕様上、拡張機能がショートカットを「グローバル（システム全体）」として自動で固定することはできません。`manifest.json` にデフォルトを設定できますが、グローバルにするかどうかはユーザー側で `chrome://extensions/shortcuts` のプルダウンから `Global` を選択する必要があります。

手順: デフォルトをグローバルにする方法
1. Chromeで `chrome://extensions/shortcuts` を開く
2. 本拡張の各コマンド項目を見つける
3. 右側のプルダウンを `Global` に変更する

※ 既に他のアプリやOSショートカットと衝突する場合、Chromeは自動で競合を解決しないため、手動で別キーを割り当ててください。


## インストール方法
1. このリポジトリをクローンまたはダウンロードします
    *右上のCode→Download Zip→ダウンロードしたファイルを解凍
2. Chromeで `chrome://extensions` を開きます
3. デベロッパーモードを有効にします
4. 「パッケージ化されていない拡張機能を読み込む」をクリックします
5. 1.で解凍したフォルダを選択します
