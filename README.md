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


## インストール方法
1. このリポジトリをクローンまたはダウンロードします
    *右上のCode→Download Zip→ダウンロードしたファイルを解凍
2. Chromeで `chrome://extensions` を開きます
3. デベロッパーモードを有効にします
4. 「パッケージ化されていない拡張機能を読み込む」をクリックします
5. 1.で解凍したフォルダを選択します
