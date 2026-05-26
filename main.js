const dashboardTitle = document.getElementById("dashboardTitle");
const dashboardNickname = document.getElementById("dashboardNickname");
const dashboardServer = document.getElementById("dashboardServer");
const todayText = document.getElementById("todayText");

const leadTitle = document.getElementById("leadTitle");
const leadDescription = document.getElementById("leadDescription");
const leadMeta = document.getElementById("leadMeta");
const leadImagePlaceholder = document.querySelector(".lead-image-box .image-placeholder");

const openChatButton = document.getElementById("openChatButton");
const sideChatButton = document.getElementById("sideChatButton");
const openWriteButton = document.getElementById("openWriteButton");

const readFullPostButton = document.getElementById("readFullPostButton");
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

const fullFeatureEmptyText = document.getElementById("fullFeatureEmptyText");
const fullFeatureImage = document.getElementById("fullFeatureImage");
const fullFeaturePhotoCount = document.getElementById("fullFeaturePhotoCount");
const fullFeaturePrevButton = document.getElementById("fullFeaturePrevButton");
const fullFeatureNextButton = document.getElementById("fullFeatureNextButton");

const fullSecondaryEmptyText = document.getElementById("fullSecondaryEmptyText");
const fullSecondaryImage = document.getElementById("fullSecondaryImage");
const fullSecondaryPhotoCount = document.getElementById("fullSecondaryPhotoCount");
const fullSecondaryPrevButton = document.getElementById("fullSecondaryPrevButton");
const fullSecondaryNextButton = document.getElementById("fullSecondaryNextButton");

const moreButtons = document.querySelectorAll(".more-button");
const morePostPanel = document.getElementById("morePostPanel");
const morePanelTitle = document.getElementById("morePanelTitle");
const morePostList = document.getElementById("morePostList");
const moreCloseButton = document.getElementById("moreCloseButton");

const MAIN_CONFIG = {
    fallbackNickname: "Guest",
    fallbackServer: "Global Server",
    chatPage: "chat.html",
    writePage: "write.html",
    draftStorageKey: "livechat_private_draft",
    leadPostStorageKey: "livechat_lead_post"
};

const serverLabelMap = {
    global: "Global Server",
    asia: "Asia Server",
    europe: "Europe Server",
    america: "America Server"
};

const visibilityTextMap = {
    private: "Private",
    friends: "Friends",
    public: "Public"
};

const morePostData = {
    friend: {
        title: "More Friend Posts",
        posts: [
            {
                title: "비 오는 날의 짧은 여행 기록",
                description: "친구가 남긴 조용한 하루 기록입니다.",
                meta: "Sora · 2h ago"
            },
            {
                title: "새로 찾은 작은 책방",
                description: "골목 안쪽에 있는 오래된 책방을 다녀왔습니다.",
                meta: "Book Friend · 4h ago"
            },
            {
                title: "주말 산책에서 찍은 사진",
                description: "별다른 일은 없었지만 오래 기억될 장면이었습니다.",
                meta: "Mina · 6h ago"
            }
        ]
    },
    local: {
        title: "More Local Posts",
        posts: [
            {
                title: "한강 근처 산책로가 조용했습니다",
                description: "평일 오후라 사람이 많지 않았고 걷기 좋았습니다.",
                meta: "Local Editor · 1h ago"
            },
            {
                title: "동네 카페에 새 메뉴가 나왔습니다",
                description: "작은 변화지만 자주 가는 사람들에게는 반가운 소식입니다.",
                meta: "Cafe Note · 3h ago"
            },
            {
                title: "시장 골목에 사람이 늘었습니다",
                description: "퇴근 시간 이후 작은 가게들이 다시 붐비기 시작했습니다.",
                meta: "Joon · 5h ago"
            }
        ]
    },
    chat: {
        title: "More Chat Posts",
        posts: [
            {
                title: "오늘 밤 채팅방 주제 안내",
                description: "가벼운 일상 이야기와 추천 글을 함께 나누는 시간입니다.",
                meta: "System · 30m ago"
            },
            {
                title: "새 멤버가 들어왔습니다",
                description: "처음 온 사용자를 위한 안내 메시지가 등록되었습니다.",
                meta: "Moderator · 2h ago"
            },
            {
                title: "채팅방 이용 규칙이 정리되었습니다",
                description: "편안한 대화를 위해 기본 규칙을 확인해주세요.",
                meta: "System · 4h ago"
            }
        ]
    }
};

let fullFeaturePhotos = [];
let fullSecondaryPhotos = [];
let fullFeatureIndex = 0;
let fullSecondaryIndex = 0;

const savedNickname = sessionStorage.getItem("livechat_nickname") || MAIN_CONFIG.fallbackNickname;
const savedServerValue = sessionStorage.getItem("livechat_server") || "global";
const savedServerLabel = serverLabelMap[savedServerValue] || MAIN_CONFIG.fallbackServer;

function initializeMainPage() {
    dashboardTitle.textContent = "LIVE CHAT GAZETTE";
    dashboardNickname.textContent = savedNickname;
    dashboardServer.textContent = savedServerLabel;
    todayText.textContent = getTodayText();

    loadLeadPost();
}

function getTodayText() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const date = String(now.getDate()).padStart(2, "0");

    return `${year}.${month}.${date}`;
}

function getSavedLeadPost() {
    const savedPostText = localStorage.getItem(MAIN_CONFIG.leadPostStorageKey);

    if (!savedPostText) {
        return null;
    }

    try {
        return JSON.parse(savedPostText);
    } catch (error) {
        localStorage.removeItem(MAIN_CONFIG.leadPostStorageKey);
        return null;
    }
}

function moveToChatPage() {
    window.location.href = MAIN_CONFIG.chatPage;
}

function moveToWritePage() {
    localStorage.removeItem(MAIN_CONFIG.draftStorageKey);
    window.location.href = MAIN_CONFIG.writePage;
}

function resetLeadImagePlaceholder() {
    if (!leadImagePlaceholder) {
        return;
    }

    leadImagePlaceholder.innerHTML = "IMAGE AREA";
}

function loadLeadPost() {
    const savedPost = getSavedLeadPost();

    if (!savedPost) {
        if (deleteLeadPostButton) {
            deleteLeadPostButton.hidden = true;
        }

        return;
    }

    if (leadTitle) {
        leadTitle.textContent = savedPost.title || "아직 대표 게시물이 없습니다";
    }

    if (leadDescription) {
        leadDescription.textContent = savedPost.description || "";
    }

    if (leadMeta) {
        const visibilityText = visibilityTextMap[savedPost.visibility] || savedPost.visibility || "Private";
        leadMeta.textContent = `${savedPost.author || savedNickname} · ${savedPost.savedAt || "Just now"} · ${visibilityText}`;
    }

    if (leadImagePlaceholder) {
        leadImagePlaceholder.innerHTML = "";

        if (savedPost.mainImage) {
            const image = document.createElement("img");
            image.className = "lead-main-image";
            image.src = savedPost.mainImage;
            image.alt = "";

            leadImagePlaceholder.appendChild(image);
        } else {
            resetLeadImagePlaceholder();
        }
    }

    if (deleteLeadPostButton) {
        deleteLeadPostButton.hidden = false;
    }
}

function updateFullPhotoViewer(type) {
    const isFeature = type === "feature";

    const photos = isFeature ? fullFeaturePhotos : fullSecondaryPhotos;
    const index = isFeature ? fullFeatureIndex : fullSecondaryIndex;

    const image = isFeature ? fullFeatureImage : fullSecondaryImage;
    const emptyText = isFeature ? fullFeatureEmptyText : fullSecondaryEmptyText;
    const count = isFeature ? fullFeaturePhotoCount : fullSecondaryPhotoCount;
    const prevButton = isFeature ? fullFeaturePrevButton : fullSecondaryPrevButton;
    const nextButton = isFeature ? fullFeatureNextButton : fullSecondaryNextButton;

    count.textContent = `${photos.length === 0 ? 0 : index + 1} / ${photos.length}`;

    if (!Array.isArray(photos) || photos.length === 0) {
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

    const shouldShowArrows = photos.length >= 2;

    prevButton.classList.toggle("is-visible", shouldShowArrows);
    nextButton.classList.toggle("is-visible", shouldShowArrows);
}

function moveFullPhoto(type, direction) {
    const isFeature = type === "feature";
    const photos = isFeature ? fullFeaturePhotos : fullSecondaryPhotos;

    if (!Array.isArray(photos) || photos.length < 2) {
        return;
    }

    if (isFeature) {
        fullFeatureIndex = (fullFeatureIndex + direction + photos.length) % photos.length;
        updateFullPhotoViewer("feature");
    } else {
        fullSecondaryIndex = (fullSecondaryIndex + direction + photos.length) % photos.length;
        updateFullPhotoViewer("secondary");
    }
}

function openFullPost() {
    const savedPost = getSavedLeadPost();

    if (!savedPost) {
        alert("아직 작성된 대표 게시물이 없습니다.");
        return;
    }

    const visibilityText = visibilityTextMap[savedPost.visibility] || savedPost.visibility || "Private";

    fullPostDate.textContent = savedPost.savedAt || getTodayText();
    fullPostWriter.textContent = `Written by: ${savedPost.author || savedNickname}`;
    fullPostVisibility.textContent = `Visibility: ${visibilityText}`;

    fullPostTitle.textContent = savedPost.title || "제목 없음";
    fullPostDescription.textContent = savedPost.description || "작성된 부가설명이 없습니다.";
    fullPostBody.textContent = savedPost.body || "작성된 본문이 없습니다.";
    fullPostNote.textContent = savedPost.note || "작성된 노트가 없습니다.";

    fullFeaturePhotos = Array.isArray(savedPost.featurePhotos) ? savedPost.featurePhotos : [];
    fullSecondaryPhotos = Array.isArray(savedPost.secondaryPhotos) ? savedPost.secondaryPhotos : [];

    fullFeatureIndex = 0;
    fullSecondaryIndex = 0;

    updateFullPhotoViewer("feature");
    updateFullPhotoViewer("secondary");

    fullPostModal.hidden = false;
    document.body.style.overflow = "hidden";
}

function closeFullPost() {
    fullPostModal.hidden = true;
    document.body.style.overflow = "";
}

function createMorePostCard(post) {
    const article = document.createElement("article");
    article.className = "more-post-card";

    const title = document.createElement("h4");
    title.textContent = post.title;

    const description = document.createElement("p");
    description.textContent = post.description;

    const meta = document.createElement("div");
    meta.className = "article-meta";
    meta.textContent = post.meta;

    article.appendChild(title);
    article.appendChild(description);
    article.appendChild(meta);

    return article;
}

function openMorePosts(category) {
    const selectedData = morePostData[category];

    if (!selectedData) {
        return;
    }

    morePanelTitle.textContent = selectedData.title;
    morePostList.innerHTML = "";

    selectedData.posts.forEach(function (post) {
        const postCard = createMorePostCard(post);
        morePostList.appendChild(postCard);
    });

    morePostPanel.hidden = false;
    morePostPanel.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function closeMorePosts() {
    morePostPanel.hidden = true;
    morePostList.innerHTML = "";
}

if (openChatButton) {
    openChatButton.addEventListener("click", moveToChatPage);
}

if (sideChatButton) {
    sideChatButton.addEventListener("click", moveToChatPage);
}

if (openWriteButton) {
    openWriteButton.addEventListener("click", moveToWritePage);
}

if (readFullPostButton) {
    readFullPostButton.addEventListener("click", openFullPost);
}

if (fullPostCloseButton) {
    fullPostCloseButton.addEventListener("click", closeFullPost);
}

if (fullPostBackdrop) {
    fullPostBackdrop.addEventListener("click", closeFullPost);
}

if (fullFeaturePrevButton) {
    fullFeaturePrevButton.addEventListener("click", function () {
        moveFullPhoto("feature", -1);
    });
}

if (fullFeatureNextButton) {
    fullFeatureNextButton.addEventListener("click", function () {
        moveFullPhoto("feature", 1);
    });
}

if (fullSecondaryPrevButton) {
    fullSecondaryPrevButton.addEventListener("click", function () {
        moveFullPhoto("secondary", -1);
    });
}

if (fullSecondaryNextButton) {
    fullSecondaryNextButton.addEventListener("click", function () {
        moveFullPhoto("secondary", 1);
    });
}

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && fullPostModal && !fullPostModal.hidden) {
        closeFullPost();
    }
});

moreButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const category = button.dataset.category;
        openMorePosts(category);
    });
});

if (moreCloseButton) {
    moreCloseButton.addEventListener("click", closeMorePosts);
}

initializeMainPage();

(function () {
    const STORAGE_KEY = "livechat_lead_post";

    const openMyPostsButton = document.getElementById("openMyPostsButton");
    const myPostsModal = document.getElementById("myPostsModal");
    const myPostsBackdrop = document.getElementById("myPostsBackdrop");
    const myPostsCloseButton = document.getElementById("myPostsCloseButton");

    const myPostsDate = document.getElementById("myPostsDate");
    const myPostsOwner = document.getElementById("myPostsOwner");

    const myFeaturedTitle = document.getElementById("myFeaturedTitle");
    const myFeaturedDescription = document.getElementById("myFeaturedDescription");
    const myFeaturedMeta = document.getElementById("myFeaturedMeta");
    const myFeaturedImageBox = document.getElementById("myFeaturedImageBox");

    const myPostsGrid = document.getElementById("myPostsGrid");
    const myPostsReadButton = document.getElementById("myPostsReadButton");
    const myPostsDeleteButton = document.getElementById("myPostsDeleteButton");
    const myPostsNewPostButton = document.getElementById("myPostsNewPostButton");

    const deleteLeadPostButton = document.getElementById("deleteLeadPostButton");

    const deleteConfirmModal = document.getElementById("deleteConfirmModal");
    const deleteConfirmBackdrop = document.getElementById("deleteConfirmBackdrop");
    const deleteConfirmYesButton = document.getElementById("deleteConfirmYesButton");
    const deleteConfirmNoButton = document.getElementById("deleteConfirmNoButton");

    let pendingDeleteAction = null;

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

    function getTodayTextForMyPosts() {
        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const date = String(now.getDate()).padStart(2, "0");

        return `${year}.${month}.${date}`;
    }

    function getVisibilityLabel(visibility) {
        const labelMap = {
            private: "PRIVATE",
            friends: "FRIENDS",
            public: "PUBLIC"
        };

        return labelMap[visibility] || "PRIVATE";
    }

    function resetMainLeadPostView() {
        const leadTitle = document.getElementById("leadTitle");
        const leadDescription = document.getElementById("leadDescription");
        const leadMeta = document.getElementById("leadMeta");
        const leadImagePlaceholder = document.querySelector(".lead-image-box .image-placeholder");

        if (leadTitle) {
            leadTitle.textContent = "아직 대표 게시물이 없습니다";
        }

        if (leadDescription) {
            leadDescription.textContent = "개인 데스크에서 작성한 글이 나중에 이 영역에 신문 메인기사처럼 표시됩니다.";
        }

        if (leadMeta) {
            leadMeta.textContent = "System · Ready";
        }

        if (leadImagePlaceholder) {
            leadImagePlaceholder.innerHTML = "IMAGE AREA";
        }
    }

    function openDeleteConfirm(onConfirm) {
        pendingDeleteAction = onConfirm;

        if (deleteConfirmModal) {
            deleteConfirmModal.hidden = false;
        }
    }

    function closeDeleteConfirm() {
        pendingDeleteAction = null;

        if (deleteConfirmModal) {
            deleteConfirmModal.hidden = true;
        }
    }

    function deleteLeadPost() {
    localStorage.removeItem(STORAGE_KEY);

    resetMainLeadPostView();

    if (deleteLeadPostButton) {
        deleteLeadPostButton.hidden = true;
    }

    const fullPostModal = document.getElementById("fullPostModal");

    if (fullPostModal) {
        fullPostModal.hidden = true;
    }

    closeDeleteConfirm();
    }

    function renderEmptyMyPosts() {
        if (myFeaturedTitle) {
            myFeaturedTitle.textContent = "아직 작성한 게시물이 없습니다";
        }

        if (myFeaturedDescription) {
            myFeaturedDescription.textContent = "Post Story를 눌러 대표 게시물을 만들면 이곳에 표시됩니다.";
        }

        if (myFeaturedMeta) {
            myFeaturedMeta.textContent = "System · Empty";
        }

        if (myFeaturedImageBox) {
            myFeaturedImageBox.innerHTML = "IMAGE AREA";
        }

        if (myPostsGrid) {
            myPostsGrid.innerHTML = "";

            const emptyCard = document.createElement("article");
            emptyCard.className = "my-post-mini-card is-empty";

            const title = document.createElement("h4");
            title.textContent = "No saved stories yet";

            const desc = document.createElement("p");
            desc.textContent = "작성한 게시물이 생기면 이곳에 표시됩니다.";

            const status = document.createElement("span");
            status.textContent = "Archive · Ready";

            emptyCard.appendChild(title);
            emptyCard.appendChild(desc);
            emptyCard.appendChild(status);

            myPostsGrid.appendChild(emptyCard);
        }
    }

    function renderMyPosts() {
        const savedPost = getSavedPost();

        if (myPostsDate) {
            myPostsDate.textContent = getTodayTextForMyPosts();
        }

        if (myPostsOwner) {
            myPostsOwner.textContent = `Owner: ${savedPost?.author || "Guest"}`;
        }

        if (!savedPost) {
            renderEmptyMyPosts();
            return;
        }

        const visibilityText = getVisibilityLabel(savedPost.visibility);

        if (myFeaturedTitle) {
            myFeaturedTitle.textContent = savedPost.title || "제목 없음";
        }

        if (myFeaturedDescription) {
            myFeaturedDescription.textContent = savedPost.description || "부가설명이 없습니다.";
        }

        if (myFeaturedMeta) {
            myFeaturedMeta.textContent = `${savedPost.savedAt || "Just now"} · ${visibilityText}`;
        }

        if (myFeaturedImageBox) {
            myFeaturedImageBox.innerHTML = "";

            if (savedPost.mainImage) {
                const image = document.createElement("img");
                image.src = savedPost.mainImage;
                image.alt = "";

                myFeaturedImageBox.appendChild(image);
            } else {
                myFeaturedImageBox.textContent = "IMAGE AREA";
            }
        }

        if (myPostsGrid) {
            myPostsGrid.innerHTML = "";

            const miniCard = document.createElement("article");
            miniCard.className = "my-post-mini-card";

            const title = document.createElement("h4");
            title.textContent = savedPost.title || "제목 없음";

            const description = document.createElement("p");
            description.textContent = savedPost.description || "부가설명이 없습니다.";

            const status = document.createElement("span");
            status.textContent = visibilityText;

            miniCard.appendChild(title);
            miniCard.appendChild(description);
            miniCard.appendChild(status);

            myPostsGrid.appendChild(miniCard);
        }
    }

    function openMyPosts() {
        renderMyPosts();

        if (myPostsModal) {
            myPostsModal.hidden = false;
            document.body.style.overflow = "hidden";
        }
    }

    function closeMyPosts() {
        if (myPostsModal) {
            myPostsModal.hidden = true;
            document.body.style.overflow = "";
        }
    }

    function moveToWritePageFromMyPosts() {
        window.location.href = "write.html";
    }

    function openFullPostFromMyPosts() {
        const readFullPostButton = document.getElementById("readFullPostButton");

        closeMyPosts();

        if (readFullPostButton) {
            readFullPostButton.click();
        }
    }

    if (openMyPostsButton) {
        openMyPostsButton.addEventListener("click", openMyPosts);
    }

    if (myPostsCloseButton) {
        myPostsCloseButton.addEventListener("click", closeMyPosts);
    }

    if (myPostsBackdrop) {
        myPostsBackdrop.addEventListener("click", closeMyPosts);
    }

    if (myPostsNewPostButton) {
        myPostsNewPostButton.addEventListener("click", moveToWritePageFromMyPosts);
    }

    if (myPostsReadButton) {
        myPostsReadButton.addEventListener("click", openFullPostFromMyPosts);
    }

    if (myPostsDeleteButton) {
        myPostsDeleteButton.addEventListener("click", function () {
            openDeleteConfirm(deleteLeadPost);
        });
    }

    if (deleteLeadPostButton) {
        deleteLeadPostButton.addEventListener("click", function () {
            openDeleteConfirm(deleteLeadPost);
        });
    }

    if (deleteConfirmYesButton) {
        deleteConfirmYesButton.addEventListener("click", function () {
            if (typeof pendingDeleteAction === "function") {
                pendingDeleteAction();
            }
        });
    }

    if (deleteConfirmNoButton) {
        deleteConfirmNoButton.addEventListener("click", closeDeleteConfirm);
    }

    if (deleteConfirmBackdrop) {
        deleteConfirmBackdrop.addEventListener("click", closeDeleteConfirm);
    }

    document.addEventListener("keydown", function (event) {
        if (event.key !== "Escape") {
            return;
        }

        if (deleteConfirmModal && !deleteConfirmModal.hidden) {
            closeDeleteConfirm();
            return;
        }

        if (myPostsModal && !myPostsModal.hidden) {
            closeMyPosts();
        }
    });
})();