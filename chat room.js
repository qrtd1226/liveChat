const dashboardTitle = document.getElementById("dashboardTitle");
const dashboardNickname = document.getElementById("dashboardNickname");
const dashboardServer = document.getElementById("dashboardServer");
const welcomeText = document.getElementById("welcomeText");
const dashboardCards = document.querySelectorAll(".dashboard-card");

const DASHBOARD_CONFIG = {
    fallbackNickname: "Guest",
    fallbackServer: "Global Server"
};

const serverLabelMap = {
    global: "Global Server",
    asia: "Asia Server",
    europe: "Europe Server",
    america: "America Server"
};

const savedNickname = sessionStorage.getItem("livechat_nickname") || DASHBOARD_CONFIG.fallbackNickname;
const savedServerValue = sessionStorage.getItem("livechat_server") || "global";
const savedServerLabel = serverLabelMap[savedServerValue] || DASHBOARD_CONFIG.fallbackServer;

function initializeDashboard() {
    dashboardTitle.textContent = `LIVE CHAT DESKTOP - ${savedServerLabel}`;
    dashboardNickname.textContent = savedNickname;
    dashboardServer.textContent = savedServerLabel;
    welcomeText.textContent = `Hello, ${savedNickname}`;
}

dashboardCards.forEach(function (card) {
    card.addEventListener("click", function () {
        const url = card.dataset.url;

        if (!url) {
            return;
        }

        window.location.href = url;
    });
});

initializeDashboard();