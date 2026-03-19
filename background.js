const PREFIX = '[youtube-global-control]';

// YouTubeタブを検索して操作を実行する関数
async function executeActionOnYouTube(action) {
  try {
    console.log(`${PREFIX} executeActionOnYouTube called with action:`, action);
    const tabs = await chrome.tabs.query({ url: "*://www.youtube.com/*" });
    console.log(`${PREFIX} found ${tabs.length} YouTube tab(s)`);

    if (tabs.length === 0) {
      console.log(`${PREFIX} YouTubeタブが見つかりませんでした`);
      return;
    }

    // アクティブなYouTubeタブを優先
    let targetTab = tabs.find(tab => tab.active) || tabs[0];
    console.log(`${PREFIX} targetTab selected id=${targetTab.id} url=${targetTab.url}`);

    // タブをアクティブにする
    await chrome.tabs.update(targetTab.id, { active: true });
    console.log(`${PREFIX} activated tab ${targetTab.id}`);

    // アクションをタブに送信
    chrome.tabs.sendMessage(targetTab.id, { action: action });
    console.log(`${PREFIX} sent message to tab ${targetTab.id}:`, action);
  } catch (error) {
    console.error(`${PREFIX} エラーが発生しました:`, error);
  }
}

// コマンドリスナー
chrome.commands.onCommand.addListener((command) => {
  console.log(`${PREFIX} command received:`, command);
  executeActionOnYouTube(command);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 全画面表示機能に関連するコードを削除
});
