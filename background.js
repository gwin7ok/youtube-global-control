// YouTubeタブを検索して操作を実行する関数
async function executeActionOnYouTube(action) {
  try {
    const tabs = await chrome.tabs.query({ url: "*://www.youtube.com/*" });
    
    if (tabs.length === 0) {
      console.log("YouTubeタブが見つかりませんでした");
      return;
    }
    
    // アクティブなYouTubeタブを優先
    let targetTab = tabs.find(tab => tab.active) || tabs[0];
    
    // タブをアクティブにする
    await chrome.tabs.update(targetTab.id, { active: true });
    
    // アクションをタブに送信
    chrome.tabs.sendMessage(targetTab.id, { action: action });
  } catch (error) {
    console.error("エラーが発生しました:", error);
  }
}

// コマンドリスナー
chrome.commands.onCommand.addListener((command) => {
  executeActionOnYouTube(command);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 全画面表示機能に関連するコードを削除
});
