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

// 起動時に登録済みコマンド一覧を出力してデバッグしやすくする
function logRegisteredCommands() {
  try {
    if (chrome.commands && chrome.commands.getAll) {
      chrome.commands.getAll((commands) => {
        console.log(`${PREFIX} registered commands:`, commands);
        const names = commands.map(c => c.name);
        console.log(`${PREFIX} registered command names:`, names);
      });
    } else {
      console.log(`${PREFIX} chrome.commands.getAll is not available`);
    }
  } catch (e) {
    console.error(`${PREFIX} failed to get commands:`, e);
  }
}

// サービスワーカー起動時にコマンド一覧をログ
logRegisteredCommands();

chrome.runtime.onInstalled && chrome.runtime.onInstalled.addListener && chrome.runtime.onInstalled.addListener(() => {
  console.log(`${PREFIX} onInstalled`);
  logRegisteredCommands();
});

chrome.runtime.onStartup && chrome.runtime.onStartup.addListener && chrome.runtime.onStartup.addListener(() => {
  console.log(`${PREFIX} onStartup`);
  logRegisteredCommands();
});
