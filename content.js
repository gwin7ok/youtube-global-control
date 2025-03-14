// ブックマークを保存するための変数
let bookmarks = [];
let currentBookmarkIndex = -1;

// 初期化時にストレージからブックマークをロード
chrome.storage.local.get(['videoBookmarks'], function(result) {
  const currentVideoId = getYouTubeVideoId();
  if (result.videoBookmarks && result.videoBookmarks[currentVideoId]) {
    bookmarks = result.videoBookmarks[currentVideoId];
  }
});

// YouTubeのビデオIDを取得
function getYouTubeVideoId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('v');
}

// YouTubeのネイティブな通知を表示する関数
function showYouTubeNotification(message) {
  // 動画要素を直接取得
  const video = document.querySelector('video');
  if (!video) {
    console.error('動画要素が見つかりません');
    return;
  }
  
  // 既存の通知を削除
  const existingNotification = document.querySelector('.ytgpc-player-notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // ビデオの位置とサイズを取得
  const videoRect = video.getBoundingClientRect();
  
  // 通知要素を作成
  const notification = document.createElement('div');
  notification.className = 'ytgpc-player-notification';
  
  // 絶対位置で表示するためのスタイル
  notification.style.position = 'fixed';
  notification.style.left = `${videoRect.left + videoRect.width / 2}px`;
  notification.style.top = `${videoRect.top + videoRect.height / 2}px`;
  notification.style.transform = 'translate(-50%, -50%)';
  notification.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  notification.style.color = 'white';
  notification.style.padding = '10px 15px';
  notification.style.borderRadius = '4px';
  notification.style.zIndex = '1000';
  notification.style.fontSize = '16px';
  notification.style.fontWeight = 'bold';
  notification.style.textAlign = 'center';
  notification.style.minWidth = '120px';
  notification.style.pointerEvents = 'none'; // クリックイベントを無視
  
  // シーク操作の場合、矢印アイコンを追加
  if (message.includes('秒進みました')) {
    notification.innerHTML = '&#9654; ' + message;
  } else if (message.includes('秒戻りました')) {
    notification.innerHTML = '&#9664; ' + message;
  } else {
    notification.textContent = message;
  }
  
  // body直下に追加
  document.body.appendChild(notification);
  
  // 1.0秒後に削除
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 1000);
  
  // 動画がリサイズされたり位置が変わったりした場合に対応するために
  // 定期的に通知の位置を更新
  const updateInterval = setInterval(() => {
    if (!document.body.contains(notification)) {
      clearInterval(updateInterval);
      return;
    }
    
    const updatedRect = video.getBoundingClientRect();
    notification.style.left = `${updatedRect.left + updatedRect.width / 2}px`;
    notification.style.top = `${updatedRect.top + updatedRect.height / 2}px`;
  }, 100);
}

// 次のチャプターへ移動
function goToNextChapter() {
  // 右矢印キーをシミュレート
  simulateKeyPress('ArrowRight', false, true, false, true);
  showYouTubeNotification('次のチャプターに移動');
}

// 前のチャプターへ移動
function goToPreviousChapter() {
  // 左矢印キーをシミュレート
  simulateKeyPress('ArrowLeft', false, true, false, true);
  showYouTubeNotification('前のチャプターに移動');
}

// ショートカットキーをシミュレートする関数
function simulateKeyPress(key, shiftKey = false, ctrlKey = false, altKey = false, isArrow = false) {
  const keyCode = isArrow ? 
    (key === 'ArrowRight' ? 39 : key === 'ArrowLeft' ? 37 : 0) : 
    key.toUpperCase().charCodeAt(0);
  
  const event = new KeyboardEvent('keydown', {
    key: key,
    code: isArrow ? key : `Key${key.toUpperCase()}`,
    keyCode: keyCode,
    shiftKey: shiftKey,
    ctrlKey: ctrlKey,
    altKey: altKey,
    bubbles: true,
    cancelable: true
  });
  
  document.dispatchEvent(event);
}

// ショートカットキーのリスナーを追加
document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.altKey && event.key === 'ArrowRight') {
    goToNextChapter();
  } else if (event.ctrlKey && event.altKey && event.key === 'ArrowLeft') {
    goToPreviousChapter();
  }
});

// アクションを実行する関数
function performAction(action) {
  const video = document.querySelector('video');
  
  if (!video) {
    console.error('動画要素が見つかりません');
    return;
  }
  
  switch (action) {
    case 'toggle_play_pause':
      if (video.paused) {
        video.play();
        showYouTubeNotification('再生');
      } else {
        video.pause();
        showYouTubeNotification('一時停止');
      }
      break;
      
    case 'volume_up':
      video.volume = Math.min(1, video.volume + 0.1);
      showYouTubeNotification(`音量: ${Math.round(video.volume * 100)}%`);
      break;
      
    case 'volume_down':
      video.volume = Math.max(0, video.volume - 0.1);
      showYouTubeNotification(`音量: ${Math.round(video.volume * 100)}%`);
      break;
      
    case 'toggle_mute':
      video.muted = !video.muted;
      showYouTubeNotification(video.muted ? 'ミュート オン' : 'ミュート オフ');
      break;
      
    case 'seek_forward':
      video.currentTime += 5;
      showYouTubeNotification('5秒進みました');
      break;
      
    case 'seek_backward':
      video.currentTime -= 5;
      showYouTubeNotification('5秒戻りました');
      break;
      
    case 'goto_start':
      video.currentTime = 0;
      showYouTubeNotification('動画の先頭に移動しました');
      break;
      
    case 'goto_end':
      video.currentTime = video.duration - 1;
      showYouTubeNotification('動画の最後に移動しました');
      break;
      
    case 'speed_up':
      video.playbackRate = Math.min(4, video.playbackRate + 0.25);
      showYouTubeNotification(`再生速度: ${video.playbackRate}x`);
      break;
      
    case 'speed_down':
      video.playbackRate = Math.max(0.25, video.playbackRate - 0.25);
      showYouTubeNotification(`再生速度: ${video.playbackRate}x`);
      break;
      
    case 'speed_normal':
      video.playbackRate = 1.0;
      showYouTubeNotification('再生速度: 1.0x (標準)');
      break;
      
    case 'toggle_fullscreen':
      // 全画面表示機能を削除
      break;
      
    case 'toggle_captions':
      toggleCaptions();
      break;
      
    case 'next_video':
      clickNextButton();
      break;
      
    case 'previous_video':
      clickPreviousButton();
      break;
      
    case 'toggle_bookmark':
      toggleBookmark(video.currentTime);
      break;
      
    case 'next_bookmark':
      navigateToNextBookmark(video);
      break;
      
    case 'next_chapter':
      goToNextChapter();
      break;
      
    case 'previous_chapter':
      goToPreviousChapter();
      break;
  }
}

// 字幕表示切り替え関数
function toggleCaptions() {
  const captionsButton = document.querySelector('.ytp-subtitles-button');
  if (captionsButton) {
    captionsButton.click();
    const isCaptionsOn = captionsButton.getAttribute('aria-pressed') === 'true';
    showYouTubeNotification(isCaptionsOn ? '字幕をオン' : '字幕をオフ');
  } else {
    showYouTubeNotification('字幕が利用できません');
  }
}

// 次の動画ボタンをクリック
function clickNextButton() {
  // ショートカットキーをシミュレート
  simulateKeyPress('N', true);
  showYouTubeNotification('次の動画に移動');
}

// 前の動画ボタンをクリック
function clickPreviousButton() {
  // ショートカットキーをシミュレート
  simulateKeyPress('P', true);
  showYouTubeNotification('前の動画に移動');
}

// ブックマーク機能
function toggleBookmark(currentTime) {
  const videoId = getYouTubeVideoId();
  if (!videoId) return;
  
  chrome.storage.local.get(['videoBookmarks'], function(result) {
    let videoBookmarks = result.videoBookmarks || {};
    let currentVideoBookmarks = videoBookmarks[videoId] || [];
    
    // 時間を秒単位で四捨五入
    currentTime = Math.round(currentTime);
    
    // 既存のブックマークかチェック
    const existingIndex = currentVideoBookmarks.findIndex(b => Math.abs(b - currentTime) < 1);
    
    if (existingIndex >= 0) {
      // 既存のブックマークを削除
      currentVideoBookmarks.splice(existingIndex, 1);
      showYouTubeNotification(`ブックマークを削除しました: ${formatTime(currentTime)}`);
    } else {
      // 新しいブックマークを追加
      currentVideoBookmarks.push(currentTime);
      // 時間順にソート
      currentVideoBookmarks.sort((a, b) => a - b);
      showYouTubeNotification(`ブックマークを追加しました: ${formatTime(currentTime)}`);
    }
    
    videoBookmarks[videoId] = currentVideoBookmarks;
    chrome.storage.local.set({videoBookmarks}, function() {
      bookmarks = currentVideoBookmarks;
    });
  });
}

// 次のブックマークに移動
function navigateToNextBookmark(video) {
  if (bookmarks.length === 0) {
    showYouTubeNotification('ブックマークがありません');
    return;
  }
  
  const currentTime = video.currentTime;
  
  // 現在時間より後のブックマークを探す
  const nextBookmark = bookmarks.find(b => b > currentTime + 1);
  
  if (nextBookmark) {
    video.currentTime = nextBookmark;
    showYouTubeNotification(`ブックマーク ${formatTime(nextBookmark)} に移動しました`);
  } else {
    // 最初のブックマークに循環して戻る
    video.currentTime = bookmarks[0];
    showYouTubeNotification(`最初のブックマーク ${formatTime(bookmarks[0])} に戻りました`);
  }
}

// 秒数を mm:ss 形式にフォーマット
function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

// ウィンドウメッセージのリスナー（YouTube内での操作用）
window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  if (event.data.action) {
    performAction(event.data.action);
  }
});

// バックグラウンドスクリプトからのメッセージリスナー（グローバルショートカット用）
chrome.runtime.onMessage.addListener((message) => {
  if (message.action) {
    performAction(message.action);
  }
});
