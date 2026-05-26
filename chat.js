/* ================================
   1. 기본 DOM 요소 가져오기
================================ */

const chatTitle = document.getElementById("chatTitle");
const serverName = document.getElementById("serverName");
const nicknameText = document.getElementById("nicknameText");
const currentUserItem = document.getElementById("currentUserItem");
const roomName = document.getElementById("roomName");

const statusCenter = document.getElementById("statusCenter");
const statusRight = document.getElementById("statusRight");

const messageList = document.getElementById("messageList");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");

const channelButtons = document.querySelectorAll(".channel-item");

/* 이미지 첨부 관련 요소 */
const attachButton = document.getElementById("attachButton");
const imageInput = document.getElementById("imageInput");


/* ================================
   2. 기본 설정값
================================ */

const CHAT_CONFIG = {
    fallbackNickname: "Guest",
    fallbackServer: "Global Server"
};


/* ================================
   3. 서버명 표시용 매핑
================================ */

const serverLabelMap = {
    global: "Global Server",
    asia: "Asia Server",
    europe: "Europe Server",
    america: "America Server"
};


/* ================================
   4. 로그인 화면에서 저장한 값 가져오기
================================ */

const savedNickname = sessionStorage.getItem("livechat_nickname") || CHAT_CONFIG.fallbackNickname;
const savedServerValue = sessionStorage.getItem("livechat_server") || "global";
const savedServerLabel = serverLabelMap[savedServerValue] || CHAT_CONFIG.fallbackServer;

let currentRoom = "Lobby";


/* ================================
   5. 현재 시간 표시
================================ */

function getCurrentTimeText() {
    const now = new Date();
    const hour = String(now.getHours()).padStart(2, "0");
    const minute = String(now.getMinutes()).padStart(2, "0");

    return `${hour}:${minute}`;
}


/* ================================
   6. 일반 텍스트 메시지 추가
================================ */

function addMessage(name, text, type = "normal") {
    const message = document.createElement("div");
    message.className = type === "system" ? "message system-message" : "message";

    const timeSpan = document.createElement("span");
    timeSpan.className = "message-time";
    timeSpan.textContent = getCurrentTimeText();

    const nameSpan = document.createElement("span");
    nameSpan.className = "message-name";
    nameSpan.textContent = name;

    const textSpan = document.createElement("span");
    textSpan.className = "message-text";
    textSpan.textContent = text;

    message.appendChild(timeSpan);
    message.appendChild(nameSpan);
    message.appendChild(textSpan);

    messageList.appendChild(message);
    messageList.scrollTop = messageList.scrollHeight;
}


/* ================================
   7. 이미지 메시지 추가
   현재는 서버 업로드 없이 화면에만 표시
================================ */

function addImageMessage(name, imageSrc) {
    const message = document.createElement("div");
    message.className = "message image-message";

    const messageHeader = document.createElement("div");
    messageHeader.className = "message-header";

    const timeSpan = document.createElement("span");
    timeSpan.className = "message-time";
    timeSpan.textContent = getCurrentTimeText();

    const nameSpan = document.createElement("span");
    nameSpan.className = "message-name";
    nameSpan.textContent = name;

    messageHeader.appendChild(timeSpan);
    messageHeader.appendChild(nameSpan);

    const imageBox = document.createElement("div");
    imageBox.className = "message-image-box";

    const image = document.createElement("img");
    image.className = "message-image";
    image.src = imageSrc;
    image.alt = "attached image";

    imageBox.appendChild(image);

    message.appendChild(messageHeader);
    message.appendChild(imageBox);

    messageList.appendChild(message);
    messageList.scrollTop = messageList.scrollHeight;
}


/* ================================
   8. 채널 / 방 변경
================================ */

function setRoom(room) {
    currentRoom = room;

    roomName.textContent = room;
    statusCenter.textContent = `Room: ${room}`;

    channelButtons.forEach(function (button) {
        if (button.dataset.room === room) {
            button.classList.add("is-active");
        } else {
            button.classList.remove("is-active");
        }
    });

    addMessage("System", `You joined #${room}.`, "system");
}


/* ================================
   9. 채팅창 초기 정보 표시
================================ */

function initializeChatInfo() {
    chatTitle.textContent = `LIVE CHAT - ${savedServerLabel}`;
    serverName.textContent = savedServerLabel;
    nicknameText.textContent = savedNickname;
    currentUserItem.textContent = savedNickname;

    statusRight.textContent = "Users Online: 6";

    addMessage("System", `${savedNickname} connected to ${savedServerLabel}.`, "system");
}


/* ================================
   10. 텍스트 메시지 전송
================================ */

if (chatForm) {
    chatForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const text = chatInput.value.trim();

        if (!text) {
            return;
        }

        addMessage(savedNickname, text);
        chatInput.value = "";
        chatInput.focus();
    });
}


/* ================================
   11. IMG 버튼 클릭 시 파일 선택창 열기
================================ */

if (attachButton && imageInput) {
    attachButton.addEventListener("click", function () {
        imageInput.click();
    });
}


/* ================================
   12. 이미지 선택 시 채팅창 안에 표시
================================ */

if (imageInput) {
    imageInput.addEventListener("change", function (event) {
        const file = event.target.files[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            addMessage("System", "Only image files can be attached.", "system");
            imageInput.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onload = function (loadEvent) {
            const imageSrc = loadEvent.target.result;
            addImageMessage(savedNickname, imageSrc);
        };

        reader.readAsDataURL(file);

        imageInput.value = "";
    });
}


/* ================================
   13. 채널 버튼 클릭 이벤트
================================ */

channelButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const selectedRoom = button.dataset.room;

        if (!selectedRoom || selectedRoom === currentRoom) {
            return;
        }

        setRoom(selectedRoom);
    });
});


/* ================================
   14. 채팅창 실행
================================ */

initializeChatInfo();