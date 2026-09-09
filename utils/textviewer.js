/* ============================================================
   NOTEPAD (tabbed text viewer, singleton window)
   ============================================================ */

const TEXTVIEWER_WINID = 'textviewer';

const textViewerState = {
  tabs: [],        // { file, name, body }
  activeIndex: -1
};

function openTextFile(file){
  let idx = textViewerState.tabs.findIndex(t => t.file === file);

  if(idx === -1){
    textViewerState.tabs.push({ file, name: file.name, body: file.body });
    idx = textViewerState.tabs.length - 1;
  }
  textViewerState.activeIndex = idx;

  if(!openWindows[TEXTVIEWER_WINID]){
    openWindow(TEXTVIEWER_WINID, {
      title: 'Notepad',
      icon: 'doc',
      width: 480,
      height: 360,
      menu: [],
      status: '',
      bodyHTML: `
        <div class="tv-tabbar" id="tv-tabbar"></div>
        <div class="tv-content" id="tv-content"></div>
      `
    });
    attachTextViewerHandlers();
  } else {
    renderTextViewerBody();
    bringToFront(TEXTVIEWER_WINID);
  }
}

function attachTextViewerHandlers(){
  const win = openWindows[TEXTVIEWER_WINID];
  if(!win) return;

  const tabbar = win.el.querySelector('#tv-tabbar');
  if(!tabbar) return;

  tabbar.addEventListener('click', (event)=>{
    const closeBtn = event.target.closest('.tv-tab-close');
    const tabEl = event.target.closest('.tv-tab');
    if(!tabEl) return;

    const idx = Number(tabEl.dataset.idx);

    if(closeBtn){
      closeTextTab(idx);
    } else {
      textViewerState.activeIndex = idx;
      renderTextViewerBody();
    }
  });

  renderTextViewerBody();
}

function closeTextTab(idx){
  textViewerState.tabs.splice(idx, 1);

  if(textViewerState.tabs.length === 0){
    closeTextViewerWindow();
    return;
  }

  if(textViewerState.activeIndex >= textViewerState.tabs.length){
    textViewerState.activeIndex = textViewerState.tabs.length - 1;
  } else if(idx < textViewerState.activeIndex){
    textViewerState.activeIndex -= 1;
  }

  renderTextViewerBody();
}

function closeTextViewerWindow(){
  const win = openWindows[TEXTVIEWER_WINID];
  if(!win) return;

  if(typeof closeWindow === 'function'){
    closeWindow(TEXTVIEWER_WINID);
  } else {
    win.el.remove();
    delete openWindows[TEXTVIEWER_WINID];
  }

  textViewerState.tabs = [];
  textViewerState.activeIndex = -1;
}

function renderTextViewerBody(){
  const win = openWindows[TEXTVIEWER_WINID];
  if(!win) return;

  const tabbar = win.el.querySelector('#tv-tabbar');
  const content = win.el.querySelector('#tv-content');
  const activeTab = textViewerState.tabs[textViewerState.activeIndex];

  if(tabbar){
    tabbar.innerHTML = textViewerState.tabs.map((tab, i) => `
      <div class="tv-tab ${i === textViewerState.activeIndex ? 'active' : ''}" data-idx="${i}">
        <span class="tv-tab-label">${tab.name}</span>
        <span class="tv-tab-close" data-idx="${i}">&times;</span>
      </div>
    `).join('');
  }

  if(content){
    content.innerHTML = activeTab ? `<pre class="tv-pre">${activeTab.body}</pre>` : '';
  }

  const titleEl = win.el.querySelector('.titlebar .ttext');
  if(titleEl && activeTab){
    titleEl.textContent = `${activeTab.name} - Notepad`;
  }
}