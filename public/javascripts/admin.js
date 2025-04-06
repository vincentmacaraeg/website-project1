const mainTabs = document.querySelectorAll('[data-nav-tabs]');
const mainWindows = document.querySelectorAll('[data-nav-windows]');

mainTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    mainWindows.forEach((window, i) => {
      if (tab.dataset.navTabs === window.dataset.navWindows) {
        mainTabs[i].classList.add('selected');
        window.classList.add('show');
      }
      else{
        mainTabs[i].classList.remove('selected');
        window.classList.remove('show');
      }
    });
  });
});

const anncForm = document.querySelector('#announcementForm');
const anncUpdateId = anncForm.querySelector('[type=hidden]');
const anncMainImg = anncForm.querySelector('#ancMainImg');
const anncLabel = anncForm.querySelector('label[for="ancMainImg"]');
const mainImg = anncLabel.querySelector('.imagePreview');
const anncP = anncLabel.querySelector('p');
const anncTitle = anncForm.querySelector('#ancTitle');
const anncDesc = anncForm.querySelector('#ancDescription');
const anncGalImg = anncForm.querySelector('#ancGalleryImg');
const galImg = anncForm.querySelector('.galleryImages');
const anncError = anncForm.querySelector('.errorMsg');
let formType;

anncGalImg.addEventListener('change', (e) => {
  const files = e.target.files;
  const addGalleryImg = galImg.querySelector('.addImg');
  
  for(const file of files){
    if(file && file.type.startsWith('image/')){
      const li = document.createElement('li');
      const img = document.createElement('img');
      const btn = document.createElement('button');
      
      btn.type = 'button';
      btn.innerHTML = `<img src="../images/svg/xmark.svg" loading="lazy" alt="xmark">`
      img.classList.add('galImg');
      img.src = URL.createObjectURL(file);
      img.dataset.imgName = file.name;
      li.appendChild(btn);
      li.appendChild(img);
      addGalleryImg.before(li);

      btn.addEventListener('click', () => {
        galImg.removeChild(li);
      });
    }
  }
});
function clearAnncForm(){
  galImg.innerHTML =
    `<li class="addImg">
      <label for="ancGalleryImg">
        <div>+</div>
      </label>
    </li>`;

  anncForm.reset();
  mainImg.src = '';
  mainImg.style.display = 'none';
  anncLabel.classList.remove('hasImg');
  anncP.style.display = 'block';
}
anncForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const mImg = mainImg.dataset.imgName;
  const galleryImgs = galImg.querySelectorAll('.galImg');

  if(!mImg){
    anncError.innerText = '*No cover photo selected.';
    anncError.style.opacity = '1';
    return;
  }
  if(galleryImgs.length > 20){
    anncError.innerText = '*Maximum gallery images is 20.';
    anncError.style.opacity = '1';
    return;
  }
  anncError.style.opacity = '0';
  
  const data = {
    title: anncTitle.value,
    description: anncDesc.value,
    mainImg: `../images/announcements/${mImg}`,
    galleryImgs: [],
  };

  for(const img of galleryImgs){
    data.galleryImgs.push(`../images/announcements/${img.dataset.imgName}`);
  }
  
  if(formType === 'Add'){
    fetch('/admin/anncAdd', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(res => {
      if(res.success){
        clearAnncForm();
        closeModal();
        getData('annc')
        .then(data => {
          if(data.success){
            loadAnnouncements(data);
          }
        })
        .catch(error => {
          console.error("Error loading data:", error);
        });
      }
    });
  }
  if(formType === 'Edit'){
    data.id = anncUpdateId.value;

    fetch('/admin/anncUpdate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(res => {
      if(res.success){
        clearAnncForm();
        closeModal();
        getData('annc')
        .then(data => {
          if(data.success){
            loadAnnouncements(data);
          }
        })
        .catch(error => {
          console.error("Error loading data:", error);
        });
      }
    });
  }
});

const conlForm = document.querySelector('#councilForm');
const conlUpdateId = conlForm.querySelector('[type=hidden]');
const conlMemberImg = conlForm.querySelector('#memberImg');
const memberLabel = conlForm.querySelector('label[for="memberImg"]');
const memberImg = memberLabel.querySelector('.imagePreview');
const conlP = memberLabel.querySelector('p');
const conlFName = conlForm.querySelector('#firstName');
const conlMInitial = conlForm.querySelector('#middleInitial');
const conlLName = conlForm.querySelector('#lastName');
const conlPosition = conlForm.querySelector('#position');
const conlError = conlForm.querySelector('.errorMsg');

function imageChange(inputElement, imageElement, labelElement, paragraphElement, path){
  inputElement.addEventListener('change', (e) => {
    const file = e.target.files[0];

    if(file && file.type.startsWith('image/')){
      imageElement.src = `${path}${file.name}`;
      imageElement.style.display = 'block';
      imageElement.dataset.imgName = file.name;
      labelElement.classList.add('hasImg');
      paragraphElement.style.display = 'none';
    }
    else{
      imageElement.src = '';
      imageElement.style.display = 'none';
      imageElement.dataset.imgName = '';
      labelElement.classList.remove('hasImg');
      paragraphElement.style.display = 'block';
    }
  });
}
imageChange(anncMainImg, mainImg, anncLabel, anncP, '../images/announcements/');
imageChange(conlMemberImg, memberImg, memberLabel, conlP, '../images/council members/');

function clearConlForm(){
  conlForm.reset();
  memberImg.src = '';
  memberImg.style.display = 'none';
  memberLabel.classList.remove('hasImg');
  conlP.style.display = 'block';
}
conlForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const image = memberImg.dataset.imgName;

  if(!image){
    conlError.innerText = '*No cover photo selected.';
    conlError.style.opacity = '1';
    return;
  }
  conlError.style.opacity = '0';

  const data = {
    image: `../images/council members/${image}`,
    firstName: conlFName.value,
    mInitial: conlMInitial.value,
    lastName: conlLName.value,
    position: conlPosition.value,
  };

  if(formType === 'Add'){
    fetch('/admin/councilAdd', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(res => {
      if(res.success){
        clearAnncForm();
        closeModal();
        getData('council')
        .then(data => {
          if(data.success){
            loadCouncil(data);
          }
        })
        .catch(error => {
          console.error("Error loading data:", error);
        });
      }
    });
  }
  if(formType === 'Edit'){
    data.id = conlUpdateId.value;

    fetch('/admin/councilUpdate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(res => {
      if(res.success){
        clearAnncForm();
        closeModal();
        getData('council')
        .then(data => {
          if(data.success){
            loadCouncil(data);
          }
        })
        .catch(error => {
          console.error("Error loading data:", error);
        });
      }
    });
  }
});

const modalList = document.querySelector('.course-modal');
const modals = modalList.querySelectorAll('article');
const anncList = document.querySelector('.anncPreview');
const councilList = document.querySelector('.councilPreview');

function loadAnnouncements(data){
  const { announcements, galImages } = data;
  anncList.innerHTML = '';

  for(const annc of announcements){
    const { AnnouncementID, Title, Description, Image, DatePosted } = annc;
    const li = document.createElement('li');
    const h2 = document.createElement('h2');
    const span = document.createElement('span');
    const p = document.createElement('p');
    const ancMain = document.createElement('div');
    const ancGallery = document.createElement('div');
    const txt = document.createElement('div');
    const icon = document.createElement('div');
    const mainImgTag = document.createElement('img');
    const edit = document.createElementNS('http://www.w3.org/2000/svg', "svg");
    const del = document.createElementNS('http://www.w3.org/2000/svg', "svg");
    const setDate = new Date(DatePosted);
    const formattedDate =
      `${setDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })} ${setDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      })}`;
    
    txt.classList.add('txt');
    ancMain.classList.add('ancMain');
    mainImgTag.classList.add('mainImg');
    ancGallery.classList.add('ancGallery');
    icon.classList.add('icon');
    edit.classList.add('edit');
    del.classList.add('delete');

    li.appendChild(ancMain);
    li.appendChild(ancGallery);
    li.appendChild(icon);
    ancMain.appendChild(mainImgTag);
    ancMain.appendChild(txt);
    txt.appendChild(h2);
    txt.appendChild(span);
    txt.appendChild(p);
    icon.appendChild(edit);
    icon.appendChild(del);
    anncList.appendChild(li);

    Object.assign(mainImgTag, {
      src: Image,
      loading: 'lazy',
      alt: 'main image',
    })
    mainImgTag.dataset.mainImg = "";
    
    h2.innerText = Title;
    span.innerText = formattedDate;
    p.innerText = Description;
    
    for(const img of galImages){
      if(img.AnnouncementID === AnnouncementID && img.ImagePath !== null){
        const galImgTag = document.createElement('img');

        Object.assign(galImgTag, {
          src: img.ImagePath,
          loading: 'lazy',
          alt: 'gallery image',
        })
        galImgTag.dataset.mainImg = "";

        ancGallery.appendChild(galImgTag);
      }
    }
    
    new imageViewer(ancMain);
    new imageViewer(ancGallery);

    edit.setAttributeNS(null, 'viewBox', '0 0 512 512');
    edit.setAttributeNS(null, 'onclick', 'openModal("anncModal", "Edit")');
    edit.innerHTML = '<path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/>';
    del.setAttributeNS(null, 'viewBox', '0 0 448 512');
    del.innerHTML = '<path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/>';

    edit.addEventListener('click', () => {
      const addGalleryImg = galImg.querySelector('.addImg');
      const mainImgName = mainImgTag.src.split("/");

      anncUpdateId.value = AnnouncementID;
      anncTitle.value = h2.innerText;
      anncDesc.value = p.innerText;
      mainImg.src = mainImgTag.src;
      mainImg.style.display = 'block';
      mainImg.dataset.imgName = mainImgName[mainImgName.length - 1];
      anncLabel.classList.add('hasImg');
      anncP.style.display = 'none';

      for(const imgInLi of ancGallery.children){
        const galLi = document.createElement('li');
        const img = document.createElement('img');
        const galBtn = document.createElement('button');
        
        galBtn.type = 'button';
        galBtn.innerHTML = `<img src="../images/svg/xmark.svg" loading="lazy" alt="xmark">`
        img.classList.add('galImg');
        img.src = imgInLi.src;

        const galImgName = img.src.split("/");
        img.dataset.imgName = galImgName[galImgName.length - 1];

        galLi.appendChild(galBtn);
        galLi.appendChild(img);
        addGalleryImg.before(galLi);

        galBtn.addEventListener('click', () => {
          galImg.removeChild(galLi);
        });
      }
    });
    del.addEventListener('click', () =>{
      modalPN().confirm({
        title: 'Delete Announcement',
        text: 'Are you want to delete this announcement?',
        icon: 'warning',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      },
      function(res){
        if(res.isConfirmed){
          fetch('/admin/anncDelete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: AnnouncementID }),
          })
          .then(response => response.json())
          .then(res2 => {
            if(res2.success){
              anncList.removeChild(li);
            }
          });
        }
      });
    });
  }
}
function loadCouncil(data){
  const { councilMembers } = data;
  councilList.innerHTML = '';

  for(const member of councilMembers){
    const { CouncilID, FirstName, MiddleInitial, LastName, Position, Image } = member;
    const li = document.createElement('li');
    const memImg = document.createElement('img');
    const txt = document.createElement('div');
    const p = document.createElement('p');
    const span = document.createElement('span');
    const icon = document.createElement('div');
    const edit = document.createElementNS('http://www.w3.org/2000/svg', "svg");
    const del = document.createElementNS('http://www.w3.org/2000/svg', "svg");

    txt.classList.add('txt');
    icon.classList.add('icon');
  
    li.appendChild(memImg);
    li.appendChild(txt);
    li.appendChild(icon);
    txt.appendChild(p);
    txt.appendChild(span);
    icon.appendChild(edit);
    icon.appendChild(del);
    councilList.appendChild(li);
  
    p.innerText = `${FirstName} ${MiddleInitial ? (MiddleInitial.toUpperCase() + '.') : ''} ${LastName}`;
    span.innerText = Position;
  
    Object.assign(memImg, {
      src: Image,
      loading: 'lazy',
      alt: LastName,
    });

    edit.setAttributeNS(null, 'viewBox', '0 0 512 512');
    edit.setAttributeNS(null, 'onclick', 'openModal("conlModal", "Edit")');
    edit.innerHTML = '<path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/>';
    del.setAttributeNS(null, 'viewBox', '0 0 448 512');
    del.innerHTML = '<path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/>';

    edit.addEventListener('click', () => {
      const memImgName = memImg.src.split("/");

      conlUpdateId.value = CouncilID;
      conlFName.value = FirstName;
      conlMInitial.value = MiddleInitial;
      conlLName.value = LastName;
      conlPosition.value = Position;
      memberImg.src = memImg.src;
      memberImg.style.display = 'block';
      memberImg.dataset.imgName = memImgName[memImgName.length - 1];
      memberLabel.classList.add('hasImg');
      conlP.style.display = 'none';
    });
    del.addEventListener('click', () =>{
      modalPN().confirm({
        title: 'Delete Member',
        text: 'Are you want to delete this council member?',
        icon: 'warning',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      },
      function(res){
        if(res.isConfirmed){
          fetch('/admin/councilDelete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: CouncilID }),
          })
          .then(response => response.json())
          .then(res2 => {
            if(res2.success){
              councilList.removeChild(li);
            }
          });
        }
      });
    });
  }
}
async function getData(name){
  try{
    const response = await fetch(`/admin/${name}Get`);
    const data = await response.json();
    return data;
  }
  catch(error){
    console.error('Error fetching data:', error);
  }
}
window.onload = () => {
  getData('annc')
  .then(data => {
    if(data.success){
      loadAnnouncements(data);
    }
  })
  .catch(error => {
    console.error("Error loading data:", error);
  });
  
  getData('council')
  .then(data => {
    if(data.success){
      loadCouncil(data);
    }
  })
  .catch(error => {
    console.error("Error loading data:", error);
  });
};

function openModal(className, type){
  const modalH1 = modalList.querySelector(`.${className} > h1`);

  modalList.classList.add('show');
  formType = type;
  if(className === 'anncModal'){
    modalH1.innerText = `${type} Announcement`;
  }
  if(className === 'conlModal'){
    modalH1.innerText = `${type} Council Member`;
  }
  
  for(const tag of modals){
    if(tag.classList.contains(className)){
      tag.classList.add('show');
      tag.scrollTop = 0; 
    }
  }
}
function closeModal(){
  modalList.classList.remove('show');
  
  for(i = 0; i < modals.length; i++){
    modals[i].classList.remove('show');
  }

  clearAnncForm();
  clearConlForm();
}

// Toggle visibility of flagged comments
document.getElementById('toggle-flagged-comments').addEventListener('click', function () {
  const container = document.getElementById('flagged-comments-container');
  if (container.style.display === 'none') {
    container.style.display = 'block';
    this.textContent = 'Hide Flagged Comments';
    loadFlaggedComments(); // Load flagged comments when the section is shown
  } else {
    container.style.display = 'none';
    this.textContent = 'Show Flagged Comments';
  }
});

// Fetch and display flagged comments
function loadFlaggedComments() {
  fetch('/admin/flaggedComments')
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        const flaggedCommentsList = document.querySelector('.flaggedCommentsList');
        flaggedCommentsList.innerHTML = ''; // Clear existing comments

        data.flaggedComments.forEach(comment => {
          const li = document.createElement('li');
          li.innerHTML = `
            <p>${comment.Text}</p>
            <button onclick="approveComment(${comment.CommentID})">Approve</button>
            <button onclick="deleteComment(${comment.CommentID})">Delete</button>
          `;
          flaggedCommentsList.appendChild(li);
        });
      }
    })
    .catch(error => console.error('Error loading flagged comments:', error));
}

// Approve a flagged comment
function approveComment(commentId) {
  fetch('/admin/approveComment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ commentId }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        loadFlaggedComments(); // Reload flagged comments after approval
      }
    })
    .catch(error => console.error('Error approving comment:', error));
}

// Delete a flagged comment
function deleteComment(commentId) {
  fetch('/admin/deleteComment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ commentId }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        loadFlaggedComments(); // Reload flagged comments after deletion
      }
    })
    .catch(error => console.error('Error deleting comment:', error));
}