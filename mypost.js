const STORAGE_KEY = "livechat_lead_post";
const INTRO_STORAGE_KEY = "livechat_my_intro";
const INTRO_PHOTO_STORAGE_KEY = "livechat_my_intro_photos";
const PUBLIC_NOTE_STORAGE_KEY = "livechat_public_note";

const todayText = document.getElementById("todayText");
const ownerText = document.getElementById("ownerText");
const mypostTitle = document.getElementById("mypostTitle");

const backMainButton = document.getElementById("backMainButton");
const newPostTopButton = document.getElementById("newPostTopButton");
const newPostButton = document.getElementById("newPostButton");

const introTitle = document.getElementById("introTitle");
const introDescription = document.getElementById("introDescription");
const introInput = document.getElementById("introInput");
const editIntroButton = document.getElementById("editIntroButton");
const saveIntroButton = document.getElementById("saveIntroButton");

const introPhotoInput = document.getElementById("introPhotoInput");
const introPhotoButton = document.getElementById("introPhotoButton");
const introPhotoImage = document.getElementById("introPhotoImage");
const introPhotoEmptyText = document.getElementById("introPhotoEmptyText");
const introPhotoCount = document.getElementById("introPhotoCount");
const introPhotoPrevButton = document.getElementById("introPhotoPrevButton");
const introPhotoNextButton = document.getElementById("introPhotoNextButton");

const introPhotoActionRow = document.getElementById("introPhotoActionRow");
const introPhotoDeleteButton = document.getElementById("introPhotoDeleteButton");

const publicNoteModeButton = document.getElementById("publicNoteModeButton");
const publicNoteInput = document.getElementById("publicNoteInput");
const publicNoteCount = document.getElementById("publicNoteCount");
const publicNoteDisplay = document.getElementById("publicNoteDisplay");

const postGrid = document.getElementById("postGrid");

const fullPostModal = document.getElementById("fullPostModal");
const fullPostBackdrop = document.getElementById("fullPostBackdrop");
const fullPostCloseButton = document.getElementById("fullPostCloseButton");

const fullPostDate = document.getElementById("fullPostDate");
const fullPostWriter = document.getElementById("fullPostWriter");
const fullPostVisibility = document.getElementById("fullPostVisibility");

const fullPostTitle = document.getElementById("fullPostTitle");
const fullPostDescription = document.getElementById("fullPostDescription");
const fullPostBody = document.getElementById("fullPostBody");
const fullPostNote = document.getElementById("fullPostNote");

const featureEmptyText = document.getElementById("featureEmptyText");
const featureImage = document.getElementById("featureImage");
const featurePhotoCount = document.getElementById("featurePhotoCount");
const featurePrevButton = document.getElementById("featurePrevButton");
const featureNextButton = document.getElementById("featureNextButton");

const secondaryEmptyText = document.getElementById("secondaryEmptyText");
const secondaryImage = document.getElementById("secondaryImage");
const secondaryPhotoCount = document.getElementById("secondaryPhotoCount");
const secondaryPrevButton = document.getElementById("secondaryPrevButton");
const secondaryNextButton = document.getElementById("secondaryNextButton");

const deleteConfirmModal = document.getElementById("deleteConfirmModal");
const deleteConfirmBackdrop = document.getElementById("deleteConfirmBackdrop");
const deleteYesButton = document.getElementById("deleteYesButton");
const deleteNoButton = document.getElementById("deleteNoButton");

const INTRO_PHOTO_LIMIT = 3;
const IMAGE_MAX_WIDTH = 960;
const IMAGE_MAX_HEIGHT = 960;
const IMAGE_QUALITY = 0.68;

let introPhotos = [];
let introPhotoIndex = 0;

let introEditing = false;

let publicNoteEditing = false;

let featurePhotos = [];
let secondaryPhotos = [];
let featureIndex = 0;
let secondaryIndex = 0;

const savedNickname = sessionStorage.getItem("livechat_nickname") || "Guest";

function initializeMyPostPage() {
    todayText.textContent = getTodayText();
    ownerText.textContent = `Owner: ${savedNickname}`;
    mypostTitle.textContent = `${savedNickname}의 POSTS`;

    introTitle.textContent = savedNickname;
    fitIntroTitleToOneLine();

    loadIntroduction();
    loadIntroPhotos();
    loadPublicNote();
    renderMyPosts();

    window.addEventListener("resize", fitIntroTitleToOneLine);
}

function fitIntroTitleToOneLine() {
    if (!introTitle) {
        return;
    }

    const maxFontSize = 48;
    const minFontSize = 18;

    introTitle.style.fontSize = `${maxFontSize}px`;

    while (
        introTitle.scrollWidth > introTitle.clientWidth &&
        parseFloat(introTitle.style.fontSize) > minFontSize
    ) {
        const currentSize = parseFloat(introTitle.style.fontSize);
        introTitle.style.fontSize = `${currentSize - 1}px`;
    }
}

function getTodayText() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const date = String(now.getDate()).padStart(2, "0");

    return `${year}.${month}.${date}`;
}

function getSavedPost() {
    const savedText = localStorage.getItem(STORAGE_KEY);

    if (!savedText) {
        return null;
    }

    try {
        return JSON.parse(savedText);
    } catch (error) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
    }
}

function getVisibilityLabel(visibility) {
    const labelMap = {
        private: "PRIVATE",
        friends: "FRIENDS",
        public: "PUBLIC"
    };

    return labelMap[visibility] || "PRIVATE";
}

function getVisibilityText(visibility) {
    const labelMap = {
        private: "Private",
        friends: "Friends",
        public: "Public"
    };

    return labelMap[visibility] || "Private";
}

function loadIntroduction() {
    const savedIntro = localStorage.getItem(INTRO_STORAGE_KEY);

    if (!savedIntro) {
        introDescription.textContent = "여기를 눌러 post를 꾸미고 나를 소개해주세요.";
        introInput.value = "";
        return;
    }

    introDescription.textContent = savedIntro;
    introInput.value = savedIntro;
}

function openIntroEditor() {
    introEditing = true;

    introInput.hidden = false;
    saveIntroButton.hidden = false;
    editIntroButton.hidden = true;

    if (introPhotoActionRow) {
        introPhotoActionRow.hidden = false;
    }

    updateIntroPhotoControls();

    introInput.value = introDescription.textContent.trim();
    introInput.focus();
}

function saveIntroduction() {
    const introText = introInput.value.trim();

    if (!introText) {
        localStorage.removeItem(INTRO_STORAGE_KEY);
        introDescription.textContent = "여기를 눌러 post를 꾸미고 나를 소개해주세요.";
    } else {
        localStorage.setItem(INTRO_STORAGE_KEY, introText);
        introDescription.textContent = introText;
    }

    introEditing = false;

    introInput.hidden = true;
    saveIntroButton.hidden = true;
    editIntroButton.hidden = false;

    if (introPhotoActionRow) {
        introPhotoActionRow.hidden = true;
    }

    updateIntroPhotoControls();
}

function resizeImageFile(file, maxWidth, maxHeight, quality) {
    return new Promise(function (resolve, reject) {
        const reader = new FileReader();

        reader.onload = function (event) {
            const image = new Image();

            image.onload = function () {
                let targetWidth = image.width;
                let targetHeight = image.height;

                const widthRatio = maxWidth / targetWidth;
                const heightRatio = maxHeight / targetHeight;
                const resizeRatio = Math.min(widthRatio, heightRatio, 1);

                targetWidth = Math.round(targetWidth * resizeRatio);
                targetHeight = Math.round(targetHeight * resizeRatio);

                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");

                if (!context) {
                    reject(new Error("이미지 압축을 처리할 수 없습니다."));
                    return;
                }

                canvas.width = targetWidth;
                canvas.height = targetHeight;

                context.drawImage(image, 0, 0, targetWidth, targetHeight);

                const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
                resolve(compressedDataUrl);
            };

            image.onerror = function () {
                reject(new Error("이미지를 불러오지 못했습니다."));
            };

            image.src = event.target.result;
        };

        reader.onerror = function () {
            reject(new Error("파일을 읽지 못했습니다."));
        };

        reader.readAsDataURL(file);
    });
}

function readImageFiles(files, maxCount, currentPhotos, callback) {
    const imageFiles = Array.from(files).filter(function (file) {
        return file.type.startsWith("image/");
    });

    const availableCount = maxCount - currentPhotos.length;
    const selectedFiles = imageFiles.slice(0, availableCount);

    if (selectedFiles.length === 0) {
        return;
    }

    Promise.all(
        selectedFiles.map(function (file) {
            return resizeImageFile(
                file,
                IMAGE_MAX_WIDTH,
                IMAGE_MAX_HEIGHT,
                IMAGE_QUALITY
            );
        })
    )
        .then(function (compressedImages) {
            callback(compressedImages);
        })
        .catch(function () {
            alert("사진을 처리하지 못했습니다. 다른 사진으로 다시 시도해주세요.");
        });
}

function loadIntroPhotos() {
    const savedPhotosText = localStorage.getItem(INTRO_PHOTO_STORAGE_KEY);

    if (!savedPhotosText) {
        introPhotos = [];
        introPhotoIndex = 0;
        updateIntroPhotoViewer();
        return;
    }

    try {
        const parsedPhotos = JSON.parse(savedPhotosText);
        introPhotos = Array.isArray(parsedPhotos) ? parsedPhotos.slice(0, INTRO_PHOTO_LIMIT) : [];
    } catch (error) {
        introPhotos = [];
        localStorage.removeItem(INTRO_PHOTO_STORAGE_KEY);
    }

    introPhotoIndex = 0;
    updateIntroPhotoViewer();
}

function saveIntroPhotos() {
    try {
        localStorage.setItem(INTRO_PHOTO_STORAGE_KEY, JSON.stringify(introPhotos));
    } catch (error) {
        alert("사진 용량이 커서 저장하지 못했습니다. 사진 수를 줄이거나 다른 사진으로 다시 시도해주세요.");
    }
}

function updateIntroPhotoViewer() {
    introPhotoCount.textContent = `${introPhotos.length} / ${INTRO_PHOTO_LIMIT}`;

    if (introPhotos.length === 0) {
        introPhotoImage.hidden = true;
        introPhotoImage.removeAttribute("src");
        introPhotoEmptyText.hidden = false;

        introPhotoPrevButton.classList.remove("is-visible");
        introPhotoNextButton.classList.remove("is-visible");

        updateIntroPhotoControls();
        return;
    }

    introPhotoImage.src = introPhotos[introPhotoIndex];
    introPhotoImage.hidden = false;
    introPhotoEmptyText.hidden = true;

    const shouldShowArrows = introPhotos.length >= 2;

    introPhotoPrevButton.classList.toggle("is-visible", shouldShowArrows);
    introPhotoNextButton.classList.toggle("is-visible", shouldShowArrows);

    updateIntroPhotoControls();
}

function updateIntroPhotoControls() {
    if (introPhotoActionRow) {
        introPhotoActionRow.hidden = !introEditing;
    }

    if (introPhotoDeleteButton) {
        introPhotoDeleteButton.hidden = !introEditing || introPhotos.length === 0;
    }
}

function deleteCurrentIntroPhoto() {
    if (introPhotos.length === 0) {
        return;
    }

    introPhotos.splice(introPhotoIndex, 1);

    if (introPhotoIndex >= introPhotos.length) {
        introPhotoIndex = Math.max(introPhotos.length - 1, 0);
    }

    saveIntroPhotos();
    updateIntroPhotoViewer();
}

function moveIntroPhoto(direction) {
    if (introPhotos.length < 2) {
        return;
    }

    introPhotoIndex = (introPhotoIndex + direction + introPhotos.length) % introPhotos.length;
    updateIntroPhotoViewer();
}

function loadPublicNote() {
    const savedNote = localStorage.getItem(PUBLIC_NOTE_STORAGE_KEY) || "";

    publicNoteInput.value = savedNote;
    updatePublicNoteCount();

    if (savedNote.trim()) {
        publicNoteDisplay.textContent = savedNote;
    } else {
        publicNoteDisplay.textContent = "아직 공개 노트가 없습니다.";
    }

    publicNoteInput.hidden = true;
    publicNoteDisplay.hidden = false;
    publicNoteModeButton.textContent = "Writing Notes";
    publicNoteEditing = false;
}

function updatePublicNoteCount() {
    publicNoteCount.textContent = `${publicNoteInput.value.length} / 700`;
}

function togglePublicNoteMode() {
    if (!publicNoteEditing) {
        publicNoteEditing = true;

        publicNoteDisplay.hidden = true;
        publicNoteInput.hidden = false;
        publicNoteModeButton.textContent = "Save Note";

        publicNoteInput.focus();
        return;
    }

    const noteText = publicNoteInput.value.trim();

    localStorage.setItem(PUBLIC_NOTE_STORAGE_KEY, noteText);

    if (noteText) {
        publicNoteDisplay.textContent = noteText;
    } else {
        publicNoteDisplay.textContent = "아직 공개 노트가 없습니다.";
    }

    updatePublicNoteCount();

    publicNoteEditing = false;
    publicNoteInput.hidden = true;
    publicNoteDisplay.hidden = false;
    publicNoteModeButton.textContent = "Writing Notes";
}

function renderEmptyState() {
    postGrid.innerHTML = "";

    const emptyCard = document.createElement("article");
    emptyCard.className = "post-mini-card is-empty";

    const title = document.createElement("h3");
    title.textContent = "No saved stories yet";

    const description = document.createElement("p");
    description.textContent = "작성한 게시물이 생기면 이곳에 표시됩니다.";

    const status = document.createElement("span");
    status.textContent = "Archive · Ready";

    emptyCard.appendChild(title);
    emptyCard.appendChild(description);
    emptyCard.appendChild(status);

    postGrid.appendChild(emptyCard);
}

function renderMyPosts() {
    const savedPost = getSavedPost();

    if (!savedPost) {
        renderEmptyState();
        return;
    }

    const visibilityLabel = getVisibilityLabel(savedPost.visibility);

    postGrid.innerHTML = "";

    const miniCard = document.createElement("article");
    miniCard.className = "post-mini-card";

    const title = document.createElement("h3");
    title.textContent = savedPost.title || "제목 없음";

    const description = document.createElement("p");
    description.textContent = savedPost.description || "부가설명이 없습니다.";

    const status = document.createElement("span");
    status.textContent = visibilityLabel;

    const actions = document.createElement("div");
    actions.className = "mini-card-actions";

    const readButton = document.createElement("button");
    readButton.className = "burgundy-button";
    readButton.type = "button";
    readButton.textContent = "Read Post";
    readButton.addEventListener("click", openFullPost);

    const deleteButton = document.createElement("button");
    deleteButton.className = "danger-button";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", openDeleteConfirm);

    actions.appendChild(readButton);
    actions.appendChild(deleteButton);

    miniCard.appendChild(title);
    miniCard.appendChild(description);
    miniCard.appendChild(status);
    miniCard.appendChild(actions);

    postGrid.appendChild(miniCard);
}

function updatePhotoViewer(type) {
    const isFeature = type === "feature";

    const photos = isFeature ? featurePhotos : secondaryPhotos;
    const index = isFeature ? featureIndex : secondaryIndex;

    const image = isFeature ? featureImage : secondaryImage;
    const emptyText = isFeature ? featureEmptyText : secondaryEmptyText;
    const count = isFeature ? featurePhotoCount : secondaryPhotoCount;
    const prevButton = isFeature ? featurePrevButton : secondaryPrevButton;
    const nextButton = isFeature ? featureNextButton : secondaryNextButton;

    const photoLength = Array.isArray(photos) ? photos.length : 0;

    count.textContent = `${photoLength === 0 ? 0 : index + 1} / ${photoLength}`;

    if (photoLength === 0) {
        image.hidden = true;
        image.removeAttribute("src");
        emptyText.hidden = false;

        prevButton.classList.remove("is-visible");
        nextButton.classList.remove("is-visible");
        return;
    }

    image.src = photos[index];
    image.hidden = false;
    emptyText.hidden = true;

    const shouldShowArrows = photoLength >= 2;

    prevButton.classList.toggle("is-visible", shouldShowArrows);
    nextButton.classList.toggle("is-visible", shouldShowArrows);
}

function movePhoto(type, direction) {
    const isFeature = type === "feature";
    const photos = isFeature ? featurePhotos : secondaryPhotos;

    if (!Array.isArray(photos) || photos.length < 2) {
        return;
    }

    if (isFeature) {
        featureIndex = (featureIndex + direction + photos.length) % photos.length;
        updatePhotoViewer("feature");
    } else {
        secondaryIndex = (secondaryIndex + direction + photos.length) % photos.length;
        updatePhotoViewer("secondary");
    }
}

function openFullPost() {
    const savedPost = getSavedPost();

    if (!savedPost) {
        alert("아직 작성된 게시물이 없습니다.");
        return;
    }

    const visibilityText = getVisibilityText(savedPost.visibility);

    fullPostDate.textContent = savedPost.savedAt || getTodayText();
    fullPostWriter.textContent = `Written by: ${savedPost.author || savedNickname}`;
    fullPostVisibility.textContent = `Visibility: ${visibilityText}`;

    fullPostTitle.textContent = savedPost.title || "제목 없음";
    fullPostDescription.textContent = savedPost.description || "작성된 부가설명이 없습니다.";
    fullPostBody.textContent = savedPost.body || "작성된 본문이 없습니다.";
    fullPostNote.textContent = savedPost.note || "작성된 노트가 없습니다.";

    featurePhotos = Array.isArray(savedPost.featurePhotos) ? savedPost.featurePhotos : [];
    secondaryPhotos = Array.isArray(savedPost.secondaryPhotos) ? savedPost.secondaryPhotos : [];

    featureIndex = 0;
    secondaryIndex = 0;

    updatePhotoViewer("feature");
    updatePhotoViewer("secondary");

    fullPostModal.hidden = false;
    document.body.style.overflow = "hidden";
}

function closeFullPost() {
    fullPostModal.hidden = true;
    document.body.style.overflow = "";
}

function openDeleteConfirm() {
    const savedPost = getSavedPost();

    if (!savedPost) {
        alert("삭제할 게시물이 없습니다.");
        return;
    }

    deleteConfirmModal.hidden = false;
    document.body.style.overflow = "hidden";
}

function closeDeleteConfirm() {
    deleteConfirmModal.hidden = true;
    document.body.style.overflow = "";
}

function deletePost() {
    localStorage.removeItem(STORAGE_KEY);
    closeDeleteConfirm();
    closeFullPost();
    renderMyPosts();
}

function moveToMainPage() {
    window.location.href = "main.html";
}

function moveToWritePage() {
    window.location.href = "write.html";
}

backMainButton.addEventListener("click", moveToMainPage);
newPostTopButton.addEventListener("click", moveToWritePage);
newPostButton.addEventListener("click", moveToWritePage);

introDescription.addEventListener("click", openIntroEditor);
editIntroButton.addEventListener("click", openIntroEditor);
saveIntroButton.addEventListener("click", saveIntroduction);

introPhotoButton.addEventListener("click", function () {
    introPhotoInput.click();
});

introPhotoDeleteButton.addEventListener("click", deleteCurrentIntroPhoto);

introPhotoInput.addEventListener("change", function (event) {
    readImageFiles(
        event.target.files,
        INTRO_PHOTO_LIMIT,
        introPhotos,
        function (loadedImages) {
            introPhotos = introPhotos.concat(loadedImages).slice(0, INTRO_PHOTO_LIMIT);
            introPhotoIndex = introPhotos.length - loadedImages.length;

            if (introPhotoIndex < 0) {
                introPhotoIndex = 0;
            }

            saveIntroPhotos();
            updateIntroPhotoViewer();
            introPhotoInput.value = "";
        }
    );
});

introPhotoPrevButton.addEventListener("click", function () {
    moveIntroPhoto(-1);
});

introPhotoNextButton.addEventListener("click", function () {
    moveIntroPhoto(1);
});

publicNoteInput.addEventListener("input", updatePublicNoteCount);
publicNoteModeButton.addEventListener("click", togglePublicNoteMode);

fullPostCloseButton.addEventListener("click", closeFullPost);
fullPostBackdrop.addEventListener("click", closeFullPost);

featurePrevButton.addEventListener("click", function () {
    movePhoto("feature", -1);
});

featureNextButton.addEventListener("click", function () {
    movePhoto("feature", 1);
});

secondaryPrevButton.addEventListener("click", function () {
    movePhoto("secondary", -1);
});

secondaryNextButton.addEventListener("click", function () {
    movePhoto("secondary", 1);
});

deleteConfirmBackdrop.addEventListener("click", closeDeleteConfirm);
deleteNoButton.addEventListener("click", closeDeleteConfirm);
deleteYesButton.addEventListener("click", deletePost);

document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") {
        return;
    }

    if (!deleteConfirmModal.hidden) {
        closeDeleteConfirm();
        return;
    }

    if (!fullPostModal.hidden) {
        closeFullPost();
    }
});

initializeMyPostPage();