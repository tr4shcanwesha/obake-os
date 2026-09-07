/* ============================================================
   START MENU AND MEMORY RESET
   Uses core OS globals from /script.js.
   ============================================================ */
const startMenu = document.getElementById('startmenu');

startMenu.innerHTML = `
  <div class="sm-strip">
    <span>OKABE-OS 95</span>
  </div>

  <div class="sm-items">

    <div class="sm-item"
         onclick="closeStartMenu(); openWordle();">
      <img src="${ICON_URLS['exe']}">
      Programs &raquo; WORDLE.EXE
    </div>

    <div class="sm-item"
         onclick="closeStartMenu(); resetDesktopLayout();">
      <img src="${ICON_URLS['drive']}">
      Reset Desktop Layout
    </div>

    <div class="sm-item"
         onclick="closeStartMenu(); document.getElementById('myfiles')?.click ? null : (function(){})(); window.__openMyFiles && window.__openMyFiles();">
      <img src="${ICON_URLS['folder']}">
      Documents
    </div>

    <div class="sm-item"
         onclick="closeStartMenu(); showMessageBox('Settings','Control Panel is currently held together with duct tape and hope.','folder')">
      <img src="${ICON_URLS['folder']}">
      Settings
    </div>

    <div class="sm-divider"></div>

    <div class="sm-item"
         onclick="closeStartMenu(); showMessageBox('Find','Nothing found. It is probably in the fridge.','online')">
      <img src="${ICON_URLS['online']}">
      Find
    </div>

    <div class="sm-item"
         onclick="closeStartMenu(); showMessageBox('Help','You are on your own, same as always.','mail')">
      <img src="${ICON_URLS['mail']}">
      Help
    </div>

    <div class="sm-divider"></div>

    <div class="sm-item"
         onclick="closeStartMenu(); shutDown();">
      <img src="${ICON_URLS['drive']}">
      Shut Down...
    </div>

    <div class="sm-item"
         onclick="closeStartMenu(); resetComputer();">
      <img src="${ICON_URLS['drive']}">
      Reset Computer...
    </div>

  </div>
`;

function toggleStartMenu(e){
  startMenu.classList.toggle('open');
  e.stopPropagation();
}

function closeStartMenu(){
  startMenu.classList.remove('open');
}

document.addEventListener('click', (e)=>{
  if(
    !startMenu.contains(e.target) &&
    !document.getElementById('startbtn').contains(e.target)
  ){
    closeStartMenu();
  }
});

window.__openMyFiles = ()=>{
  docListWindow(
    'myfiles',
    "R. Okabe's Files",
    'folder_open',
    DOCS.lab.concat(DOCS.personal),
    (DOCS.lab.length + DOCS.personal.length) + ' object(s)',
    true
  );
};

function shutDown(){
  const overlay = document.createElement('div');
  overlay.className = 'msgbox-overlay';

  const box = document.createElement('div');
  box.className = 'msgbox';
  box.style.left = '50%';
  box.style.top = '38%';
  box.style.transform = 'translate(-50%,-50%)';
  box.innerHTML = `
    <div class="titlebar">
      <div class="ttext">Shut Down</div>
      <div class="tbtn mb-close">×</div>
    </div>
    <div class="msgbox-body">
      <img src="${ICON_URLS.computer}" width="32" height="32">
      <div class="txt">Are you sure you want to turn off this computer?</div>
    </div>
    <div class="msgbox-buttons reset-buttons">
      <button class="btn95 mb-yes">Yes</button>
      <button class="btn95 mb-no">No</button>
    </div>
  `;

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  const close = ()=>overlay.remove();
  const message = box.querySelector('.txt');

  box.querySelector('.mb-close').onclick = close;
  box.querySelector('.mb-no').onclick = close;
  box.querySelector('.mb-yes').onclick = ()=>{
    message.classList.add('shutdown-status');
    message.textContent = 'Turning off.';
    box.querySelector('.msgbox-buttons').remove();
    box.querySelector('.mb-close').remove();

    setTimeout(()=>{
      message.textContent = 'Turning off..';
    }, 750);

    setTimeout(()=>{
      message.textContent = 'Turning off...';
    }, 1500);

    setTimeout(()=>{
      SessionStorage.clear();
      window.close();
      setTimeout(()=>{
        window.location.replace('about:blank');
      }, 100);
    }, 2250);
  };
}

function resetDesktopLayout(){
  localStorage.removeItem(DESKTOP_ICON_STORAGE_KEY);
  arrangeDesktopIcons();
  closeStartMenu();
}

function resetComputer(){
  showResetConfirmation(
    'Reset Computer',
    'Are you sure you want to reset this computer?',
    'showResetConfirmationAgain'
  );
}

function showResetConfirmation(title, text, nextAction){
  const overlay = document.createElement('div');
  overlay.className = 'msgbox-overlay';

  const box = document.createElement('div');
  box.className = 'msgbox';
  box.style.left = '50%';
  box.style.top = '38%';
  box.style.transform = 'translate(-50%,-50%)';
  box.innerHTML = `
    <div class="titlebar">
      <div class="ttext">${title}</div>
      <div class="tbtn mb-close">×</div>
    </div>
    <div class="msgbox-body">
      <img src="${ICON_URLS.exe}" width="32" height="32">
      <div class="txt">${text}</div>
    </div>
    <div class="msgbox-buttons reset-buttons">
      <button class="btn95 mb-yes">Yes</button>
      <button class="btn95 mb-no">No</button>
    </div>
  `;

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  const close = ()=>overlay.remove();
  box.querySelector('.mb-close').onclick = close;
  box.querySelector('.mb-no').onclick = close;
  box.querySelector('.mb-yes').onclick = ()=>{
    close();
    window[nextAction]();
  };
}

function showResetConfirmationAgain(){
  showResetConfirmation(
    'Memory Reset',
    "You're erasing my memory about you, are you really sure?",
    'eraseComputerMemory'
  );
}

function eraseComputerMemory(){
  const overlay = document.createElement('div');
  overlay.className = 'msgbox-overlay';

  const box = document.createElement('div');
  box.className = 'msgbox';
  box.style.left = '50%';
  box.style.top = '38%';
  box.style.transform = 'translate(-50%,-50%)';
  box.innerHTML = `
    <div class="titlebar">
      <div class="ttext">Memory Reset</div>
    </div>
    <div class="msgbox-body">
      <img src="${ICON_URLS.exe}" width="32" height="32">
      <div class="txt">I really hoped you'd let me remember you :(</div>
    </div>
  `;

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  setTimeout(()=>{
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  }, 2000);
}
