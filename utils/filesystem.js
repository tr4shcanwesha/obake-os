/* ============================================================
   CONTENT: FILE SYSTEM FOR RINTARO OKABE
   ============================================================ */
/* ============================================================
  BRIEFCASE / DOCUMENT FILES
  ============================================================ */
const DOCS = {
  lab: [
    {
      name: 'lab_notes.txt',
      body:
`ENTRY #217 — OKABE LABORATORY, SUB-BASEMENT

The barometric sensor spiked at 3:14 AM again. Three
nights in a row now, always 3:14. Working theory #1: a
genuine fluctuation in ambient causality. Working theory
#2: the mini-fridge compressor is dying.

Ran the numbers. It's probably the fridge. It is
never NOT the fridge. And yet I wrote "causality" first,
which tells you everything about how this lab is run.

Cat (see: Fourier) sat on the keyboard for eleven
minutes and contributed absolutely nothing to the data,
which is still a better hit rate than my last three
grant proposals.

— R.O.`
    },

    {
      name: 'experiment_log_042.txt',
      body:
`EXPERIMENT 042: "Can a Toaster Remember?"

Hypothesis: Repeated exposure to identical toast
settings creates a measurable preference in the
nichrome coil.

Method: Toasted 40 slices of bread at setting 4.
Then switched to setting 2 and monitored coil
"reluctance."

Result: Inconclusive. Toast was, however, excellent.

Conclusion: I have accidentally made breakfast into
a controlled study for the ninth time this month. The
Board will not fund this. I will not be telling the
Board about this.`
    },

    {
      name: 'grant_proposal_REJECTED.doc',
      body:
`RE: Application for Continued Funding — Okabe Laboratory

Summary of prior year's findings: three patents,
one minor electrical fire, and a working prototype
of a device that reliably predicts nothing.

Committee response (attached separately) used the
phrase "concerning" four times. This is, if anything,
an improvement over last year's "alarming," used six
times.

Request: More funding. Less supervision. A new
mini-fridge.`
    },
  ],

  personal: [
    {
      name: 'diary_do_not_read.txt',
      body:
`If you are reading this and you are not me, please
stop. If you are reading this and you ARE me, then I
have once again forgotten my own filing system, and
frankly that is the more concerning outcome.

K called again today. Didn't pick up. We only ever
talk about the old project, and I am tired of being
asked questions I answered years ago, in a lab that
doesn't exist anymore, about a version of me who
believed all of this would work out cleanly.

Fed the cat. Fourier remains unimpressed by
everything, which I respect enormously.`
    },

    {
      name: 'resignation_letter_draft_v9.doc',
      body:
`To the Board of Directors,

After lengthy and careful consideration, I am writing
to inform you that I —

[NOTE TO SELF: this is draft nine. I keep stopping at
the same sentence. It is not the severance. It is not
even the work. I think I am just bad at endings.]

— NOT SENT —`
    },

    {
      name: 'shopping_list.txt',
      body:
`- solder (the good kind, not the good-for-you kind)
- coffee, black, structural
- cat food (Fourier prefers the tuna; Fourier is
  wrong about most things but not about this)
- 9V batteries, many
- one (1) new fridge, quietly, before it becomes
  a load-bearing part of the experiment log`
    },

  ]
};

/* ============================================================
  FILES
  ============================================================ */
const imageFileTypes = ['image/png', 'image/jpeg'];

const IMAGE_FILES = [
  {
    name: 'IMG_19980821_031427.jpeg (LOCKED)',
    type: 'image',
    mimeType: 'image/jpeg',
    src: 'images/IMG_19980821_031427.jpeg'
  },
  {
    name: 'IMG_20030714_223859.png',
    type: 'image',
    mimeType: 'image/png',
    src: 'images/IMG_20030714_223859.png'
  },
  {
    name: 'IMG_20051102_223907.png',
    type: 'image',
    mimeType: 'image/png',
    src: 'images/IMG_20051102_223907.png'
  },
  {
    name: 'IMG_20080221_223927.png',
    type: 'image',
    mimeType: 'image/png',
    src: 'images/IMG_20080221_223927.png'
  },
  {
    name: 'IMG_20010609_224212.png',
    type: 'image',
    mimeType: 'image/png',
    src: 'images/IMG_20010609_224212.png'
  }
];

const EVIDENCE_UNLOCK_KEY = 'okabe.evidence.unlocked';
const IMG_PASSWORD = 'SPLIT314';

if(localStorage.getItem(EVIDENCE_UNLOCK_KEY) === 'true'){
  IMAGE_FILES[0].name = 'IMG_19980821_031427.jpeg (UNLOCKED)';
}

function isImageFile(file){
  return file.type === 'image' || imageFileTypes.includes(file.mimeType);
}

function fileIcon(file){
  return isImageFile(file) ? ICON_URLS['cat'] : ICON_URLS['doc'];
}

function isEvidenceFile(file){
  return file.src === 'images/IMG_19980821_031427.jpeg';
}

const FILE_VIEW_STORAGE_KEY = 'okabe.file-view';
const FILE_VIEWS = ['large', 'medium', 'small', 'tiles'];

function setFileView(winId, view){
  const win = openWindows[winId]?.el;
  const list = document.getElementById(winId + '-list');
  if(!win || !list || !FILE_VIEWS.includes(view)) return;

  list.className = `file-list file-view-${view}`;
  localStorage.setItem(FILE_VIEW_STORAGE_KEY, view);
  win.querySelector('.file-view-menu')?.remove();
}

function openFileViewMenu(winId, menuItem){
  const win = openWindows[winId]?.el;
  if(!win) return;

  const existingMenu = win.querySelector('.file-view-menu');
  if(existingMenu){
    existingMenu.remove();
    document.removeEventListener('click', win.__fileViewMenuOutsideHandler, true);
    return;
  }

  const menu = document.createElement('div');
  menu.className = 'file-view-menu raised';
  menu.innerHTML = `
    <button type="button" data-view="large">Large icons</button>
    <button type="button" data-view="medium">Medium icons</button>
    <button type="button" data-view="small">Small icons</button>
    <button type="button" data-view="tiles">Tiles</button>
  `;

  const menubar = menuItem.closest('.menubar');
  menu.style.left = `${menuItem.offsetLeft}px`;
  menu.style.top = `${menubar.offsetTop + menubar.offsetHeight + 1}px`;
  menu.addEventListener('click', (event)=>{
    const option = event.target.closest('[data-view]');
    if(option) setFileView(winId, option.dataset.view);
  });
  win.appendChild(menu);

  const outsideHandler = (event)=>{
    if(menu.contains(event.target) || event.target === menuItem) return;
    menu.remove();
    document.removeEventListener('click', outsideHandler, true);
  };
  win.__fileViewMenuOutsideHandler = outsideHandler;

  // defer so this same click (opening the menu) doesn't immediately close it
  setTimeout(()=>{
    document.addEventListener('click', outsideHandler, true);
  }, 0);
}

function docListWindow(winId, title, iconKey, docs, statusText){
  const savedView = localStorage.getItem(FILE_VIEW_STORAGE_KEY);
  const view = FILE_VIEWS.includes(savedView) ? savedView : 'small';
  const rows = docs.map((d,i)=>
    `<div class="file-row" onclick="openFile('${winId}',${i})">
      <img class="fico" src="${fileIcon(d)}" alt="">
      <span>${d.name}</span>
    </div>`
  ).join('');

  const win = openWindow(winId, {
    title,
    icon: iconKey,
    width: winId === 'myfiles' ? 460 : 340,
    height: winId === 'myfiles' ? 340 : 280,
    menu: ['File','Edit','View','Help'],
    status: statusText || (docs.length + ' object(s)'),
    bodyHTML: `<div id="${winId}-list" class="file-list file-view-${view}">${rows}</div>`
  });

  const viewMenuItem = [...win.querySelectorAll('.menubar span')]
    .find(item => item.textContent === 'View');
  if(viewMenuItem){
    viewMenuItem.addEventListener('click', (event)=>{
      event.stopPropagation();
      openFileViewMenu(winId, viewMenuItem);
    });
  }

  window['__docs_' + winId] = docs;
}

function openFile(winId, idx){
  const file = window['__docs_' + winId][idx];
  if(isEvidenceFile(file) && localStorage.getItem(EVIDENCE_UNLOCK_KEY) !== 'true'){
    requestEvidencePassword(winId, file);
  } else if(isImageFile(file)) openImage(winId, file);
  else openTextFile(file);
}

function requestEvidencePassword(winId, file){
  const overlay = document.createElement('div');
  overlay.className = 'msgbox-overlay';

  const box = document.createElement('div');
  box.className = 'msgbox';
  box.style.left = '50%';
  box.style.top = '38%';
  box.style.transform = 'translate(-50%,-50%)';
  box.innerHTML = `
    <div class="titlebar">
      <div class="ttext">Password Required</div>
      <div class="tbtn mb-close">×</div>
    </div>

    <form class="msgbox-body">
      <img src="${ICON_URLS['cat']}" width="32" height="32" alt="">
      <div class="txt">
        <div>Enter the password to open:</div>
        <div class="password-field">
          <input class="evidence-password" type="password" maxlength="10" autocomplete="off" autofocus>
          <button class="password-toggle" type="button" aria-label="Show password" title="Show password">&#128065;</button>
        </div>
      </div>
    </form>

    <div class="evidence-error"></div>

    <div class="msgbox-buttons">
      <button class="btn95 mb-ok" type="submit">Open</button>
      <button class="btn95 mb-cancel" type="button">Cancel</button>
    </div>
  `;

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  const close = ()=>overlay.remove();
  const form = box.querySelector('form');
  const password = box.querySelector('.evidence-password');
  const error = box.querySelector('.evidence-error');
  const passwordToggle = box.querySelector('.password-toggle');

  box.querySelector('.mb-close').onclick = close;
  box.querySelector('.mb-cancel').onclick = close;
  box.querySelector('.mb-ok').onclick = ()=>form.requestSubmit();
  passwordToggle.onclick = ()=>{
    const showing = password.type === 'text';
    password.type = showing ? 'password' : 'text';
    passwordToggle.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
    passwordToggle.title = showing ? 'Show password' : 'Hide password';
  };
  form.onsubmit = (event)=>{
    event.preventDefault();

    if(password.value !== IMG_PASSWORD){
      error.textContent = 'Incorrect password.';
      password.select();
      return;
    }

    localStorage.setItem(EVIDENCE_UNLOCK_KEY, 'true');
    file.name = 'IMG_19980821_031427.jpeg (UNLOCKED)';
    close();
    openImage(winId, file);
  };

  password.focus();
}

function openDoc(winId, idx){
  const doc = window['__docs_' + winId][idx];

  const listEl = document.getElementById(winId + '-list');

  if(listEl){
    listEl.style.display = 'none';
  }

  const w = openWindows[winId].el;

  let viewer = w.querySelector('.doc-view');

  if(!viewer){
    viewer = document.createElement('div');
    viewer.className = 'doc-view';
    w.querySelector('.win-body').appendChild(viewer);
  }

  viewer.style.display = 'block';

  viewer.innerHTML = `
    <button class="btn95 backbtn" onclick="closeDoc('${winId}')">
      &laquo; Back
    </button>

    <h3>${doc.name}</h3>
    <pre>${doc.body}</pre>
  `;
}