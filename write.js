const writeDate = document.getElementById("writeDate");
const writeServer = document.getElementById("writeServer");

const headlineInput = document.getElementById("headlineInput");
const descriptionInput = document.getElementById("descriptionInput");
const bodyInput = document.getElementById("bodyInput");
const noteInput = document.getElementById("noteInput");

const headlineCount = document.getElementById("headlineCount");
const descriptionCount = document.getElementById("descriptionCount");
const wordCount = document.getElementById("wordCount");
const noteCount = document.getElementById("noteCount");

const lastSavedText = document.getElementById("lastSavedText");
const statusVisibilityText = document.getElementById("statusVisibilityText");

const postStoryButton = document.getElementById("postStoryButton");
const saveDraftButton = document.getElementById("saveDraftButton");
const backMainButton = document.getElementById("backMainButton");
const clearFormButton = document.getElementById("clearFormButton");

const visibilityToggleButton = document.getElementById("visibilityToggleButton");
const visibilityOptions = document.getElementById("visibilityOptions");
const visibilityButtonText = document.getElementById("visibilityButtonText");
const visibilityOptionButtons = document.querySelectorAll("[data-visibility]");

const featurePhotoInput = document.getElementById("featurePhotoInput");
const featureClickButton = document.getElementById("featureClickButton");
const featurePhotoPlaceholder = document.getElementById("featurePhotoPlaceholder");
const featurePhotoPreview = document.getElementById("featurePhotoPreview");
const featurePhotoCount = document.getElementById("featurePhotoCount");
const featurePrevButton = document.getElementById("featurePrevButton");
const featureNextButton = document.getElementById("featureNextButton");

const secondaryPhotoInput = document.getElementById("secondaryPhotoInput");
const secondaryClickButton = document.getElementById("secondaryClickButton");
const secondaryPhotoPlaceholder = document.getElementById("secondaryPhotoPlaceholder");
const secondaryPhotoPreview = document.getElementById("secondaryPhotoPreview");
const secondaryPhotoCount = document.getElementById("secondaryPhotoCount");
const secondaryPrevButton = document.getElementById("secondaryPrevButton");
const secondaryNextButton = document.getElementById("secondaryNextButton");

const WRITE_CONFIG = {
    mainPage: "main.html",
    draftStorageKey: "livechat_private_draft",
    leadPostStorageKey: "livechat_lead_post",
    featurePhotoLimit: 15,
    secondaryPhotoLimit: 5,

    imageMaxWidth: 960,
    imageMaxHeight: 960,
    imageQuality: 0.68
};

const serverLabelMap = {
    global: "Global Server",
    asia: "Asia Server",
    europe: "Europe Server",
    america: "America Server"
};

const visibilityLabelMap = {
    private: "Private",
    friends: "Friends",
    public: "Public"
};

let currentVisibility = "private";
let featurePhotos = [];
let secondaryPhotos = [];
let featurePhotoIndex = 0;
let secondaryPhotoIndex = 0;

const savedNickname = sessionStorage.getItem("livechat_nickname") || "Guest";
const savedServerValue = sessionStorage.getItem("livechat_server") || "global";
const savedServerLabel = serverLabelMap[savedServerValue] || "Global Server";

function initializeWritePage() {
    writeDate.textContent = getTodayText();
    writeServer.textContent = savedServerLabel;

    resetEditorForNewPost();
    updateCounts();
    updateVisibilityUI();
    updatePhotoViewer("feature");
    updatePhotoViewer("secondary");
}

function resetEditorForNewPost() {
    headlineInput.value = "";
    descriptionInput.value = "";
    bodyInput.value = "";
    noteInput.value = "";

    currentVisibility = "private";
    featurePhotos = [];
    secondaryPhotos = [];
    featurePhotoIndex = 0;
    secondaryPhotoIndex = 0;

    lastSavedText.textContent = "Not saved";
}

function getTodayText() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const date = String(now.getDate()).padStart(2, "0");

    return `${year}.${month}.${date}`;
}

function getCurrentTimeText() {
    const now = new Date();

    const hour = String(now.getHours()).padStart(2, "0");
    const minute = String(now.getMinutes()).padStart(2, "0");

    return `${hour}:${minute}`;
}

function getWordLength(text) {
    const trimmedText = text.trim();

    if (!trimmedText) {
        return 0;
    }

    return trimmedText.split(/\s+/).length;
}

function updateCounts() {
    headlineCount.textContent = `${headlineInput.value.length} / 120`;
    descriptionCount.textContent = `${descriptionInput.value.length} / 200`;
    noteCount.textContent = `${noteInput.value.length} / 500`;
    wordCount.textContent = `${getWordLength(bodyInput.value)} WORDS`;
}

function updateVisibilityUI() {
    const label = visibilityLabelMap[currentVisibility] || visibilityLabelMap.private;

    visibilityButtonText.textContent = label;
    statusVisibilityText.textContent = label;

    visibilityOptionButtons.forEach(function (button) {
        if (button.dataset.visibility === currentVisibility) {
            button.classList.add("is-selected");
        } else {
            button.classList.remove("is-selected");
        }
    });
}

function toggleVisibilityOptions() {
    visibilityOptions.hidden = !visibilityOptions.hidden;
}

function selectVisibility(value) {
    if (!visibilityLabelMap[value]) {
        return;
    }

    currentVisibility = value;
    updateVisibilityUI();
    visibilityOptions.hidden = true;
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
                WRITE_CONFIG.imageMaxWidth,
                WRITE_CONFIG.imageMaxHeight,
                WRITE_CONFIG.imageQuality
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

function updatePhotoViewer(type) {
    const isFeature = type === "feature";

    const photos = isFeature ? featurePhotos : secondaryPhotos;
    const currentIndex = isFeature ? featurePhotoIndex : secondaryPhotoIndex;

    const placeholder = isFeature ? featurePhotoPlaceholder : secondaryPhotoPlaceholder;
    const preview = isFeature ? featurePhotoPreview : secondaryPhotoPreview;
    const countText = isFeature ? featurePhotoCount : secondaryPhotoCount;
    const prevButton = isFeature ? featurePrevButton : secondaryPrevButton;
    const nextButton = isFeature ? featureNextButton : secondaryNextButton;
    const limit = isFeature ? WRITE_CONFIG.featurePhotoLimit : WRITE_CONFIG.secondaryPhotoLimit;

    countText.textContent = `${photos.length} / ${limit}`;

    if (photos.length === 0) {
        placeholder.hidden = false;
        preview.hidden = true;
        preview.removeAttribute("src");
    } else {
        placeholder.hidden = true;
        preview.hidden = false;
        preview.src = photos[currentIndex];
    }

    const shouldShowArrows = photos.length >= 2;

    prevButton.classList.toggle("is-visible", shouldShowArrows);
    nextButton.classList.toggle("is-visible", shouldShowArrows);
}

function movePhoto(type, direction) {
    const isFeature = type === "feature";
    const photos = isFeature ? featurePhotos : secondaryPhotos;

    if (photos.length < 2) {
        return;
    }

    if (isFeature) {
        featurePhotoIndex = (featurePhotoIndex + direction + photos.length) % photos.length;
        updatePhotoViewer("feature");
    } else {
        secondaryPhotoIndex = (secondaryPhotoIndex + direction + photos.length) % photos.length;
        updatePhotoViewer("secondary");
    }
}

function getPostData() {
    return {
        title: headlineInput.value.trim(),
        description: descriptionInput.value.trim(),
        body: bodyInput.value.trim(),
        note: noteInput.value,
        visibility: currentVisibility,
        featurePhotos: featurePhotos,
        secondaryPhotos: secondaryPhotos,
        mainImage: featurePhotos[0] || "",
        author: savedNickname,
        savedAt: getCurrentTimeText()
    };
}

function saveDraft() {
    const draftData = getPostData();

    try {
        localStorage.setItem(WRITE_CONFIG.draftStorageKey, JSON.stringify(draftData));
        lastSavedText.textContent = draftData.savedAt;
    } catch (error) {
        alert("사진이 많거나 용량이 커서 저장하지 못했습니다. 사진 수를 줄이거나 더 작은 사진으로 다시 시도해주세요.");
    }
}

function postStory() {
    const postData = getPostData();

    if (!postData.title || !postData.description) {
        alert("메인 제목과 부가설명을 입력해주세요.");
        return;
    }

    try {
        localStorage.setItem(WRITE_CONFIG.leadPostStorageKey, JSON.stringify(postData));
        localStorage.removeItem(WRITE_CONFIG.draftStorageKey);
        window.location.href = WRITE_CONFIG.mainPage;
    } catch (error) {
        alert("사진이 많거나 용량이 커서 게시물을 저장하지 못했습니다. 사진 수를 줄이거나 더 작은 사진으로 다시 시도해주세요.");
    }
}

function clearForm() {
    resetEditorForNewPost();
    updateCounts();
    updateVisibilityUI();
    updatePhotoViewer("feature");
    updatePhotoViewer("secondary");

    featurePhotoInput.value = "";
    secondaryPhotoInput.value = "";
}

function moveToMainPage() {
    window.location.href = WRITE_CONFIG.mainPage;
}

headlineInput.addEventListener("input", updateCounts);
descriptionInput.addEventListener("input", updateCounts);
bodyInput.addEventListener("input", updateCounts);
noteInput.addEventListener("input", updateCounts);

postStoryButton.addEventListener("click", postStory);
saveDraftButton.addEventListener("click", saveDraft);
clearFormButton.addEventListener("click", clearForm);
backMainButton.addEventListener("click", moveToMainPage);

visibilityToggleButton.addEventListener("click", toggleVisibilityOptions);

visibilityOptionButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        selectVisibility(button.dataset.visibility);
    });
});

document.addEventListener("click", function (event) {
    const isInsideVisibilityControl = event.target.closest(".visibility-control");

    if (!isInsideVisibilityControl) {
        visibilityOptions.hidden = true;
    }
});

featureClickButton.addEventListener("click", function () {
    featurePhotoInput.click();
});

secondaryClickButton.addEventListener("click", function () {
    secondaryPhotoInput.click();
});

featurePhotoInput.addEventListener("change", function (event) {
    readImageFiles(
        event.target.files,
        WRITE_CONFIG.featurePhotoLimit,
        featurePhotos,
        function (loadedImages) {
            featurePhotos = featurePhotos.concat(loadedImages);
            featurePhotoIndex = featurePhotos.length - loadedImages.length;
            updatePhotoViewer("feature");
            featurePhotoInput.value = "";
        }
    );
});

secondaryPhotoInput.addEventListener("change", function (event) {
    readImageFiles(
        event.target.files,
        WRITE_CONFIG.secondaryPhotoLimit,
        secondaryPhotos,
        function (loadedImages) {
            secondaryPhotos = secondaryPhotos.concat(loadedImages);
            secondaryPhotoIndex = secondaryPhotos.length - loadedImages.length;
            updatePhotoViewer("secondary");
            secondaryPhotoInput.value = "";
        }
    );
});

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

initializeWritePage();