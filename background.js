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

// マニフェストの suggested_key と実際に登録されているショートカットを比較して、不足があればログ出力する
async function verifyManifestShortcuts(attempts = 3) {
  try {
    if (!chrome.commands || !chrome.commands.getAll) return;

    const doCheck = async (remaining) => {
      const commands = await new Promise(resolve => chrome.commands.getAll(resolve));

      const resp = await fetch(chrome.runtime.getURL('manifest.json'));
      const manifest = await resp.json();
      const manifestCommands = manifest.commands || {};

      const missing = [];
      for (const [name, info] of Object.entries(manifestCommands)) {
        if (info && info.suggested_key && info.suggested_key.default) {
          const reg = commands.find(c => c.name === name);
          const registeredShortcut = reg ? (reg.shortcut || '') : '';
          if (!registeredShortcut) missing.push({ name, expected: info.suggested_key.default });
        }
      }

      if (missing.length > 0) {
        // 明確なエラーログを出す（toggle_play_pause 未登録時は特に目立たせる）
        missing.forEach(m => {
          if (m.name === 'toggle_play_pause') {
            console.error(`${PREFIX} FAILED to auto-register command '${m.name}' (expected ${m.expected}). This may require manual assignment at chrome://extensions/shortcuts or changing the suggested_key.`);
          } else {
            console.warn(`${PREFIX} manifest suggested_key not registered for '${m.name}': expected ${m.expected}`);
          }
        });

        // デバッグのために現在の registered commands と manifest を出力
        console.debug(`${PREFIX} current registered commands:`, commands);
        console.debug(`${PREFIX} manifest commands:`, manifestCommands);

        if (remaining > 0) {
          // Chrome の初期化タイミングにより反映が遅れる可能性があるため、数秒後に再試行
          setTimeout(() => doCheck(remaining - 1), 1000);
        } else {
          console.warn(`${PREFIX} verifyManifestShortcuts: no more retries left.`);
        }
      } else {
        console.log(`${PREFIX} manifest の suggested_key と登録済みショートカットは一致しています`);
      }
    };

    await doCheck(attempts);
  } catch (e) {
    console.error(`${PREFIX} verifyManifestShortcuts failed:`, e);
  }
}

// サービスワーカー起動時に検証を行う
verifyManifestShortcuts();

chrome.runtime.onInstalled && chrome.runtime.onInstalled.addListener && chrome.runtime.onInstalled.addListener(() => {
  console.log(`${PREFIX} onInstalled`);
  logRegisteredCommands();
});

chrome.runtime.onStartup && chrome.runtime.onStartup.addListener && chrome.runtime.onStartup.addListener(() => {
  console.log(`${PREFIX} onStartup`);
  logRegisteredCommands();
});
