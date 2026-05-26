/*지구본*/
const pixelEarth = document.getElementById("pixelEarth");
const retroLoadingOverlay = document.getElementById("retroLoadingOverlay");

const CONFIG = {
    grid: 32,
    radius: 13.8,


    nextPage: "earth.html"
};

if (pixelEarth) {
    const GRID = CONFIG.grid;
    const CENTER = (GRID - 1) / 2;
    const RADIUS = CONFIG.radius;

    pixelEarth.innerHTML = "";

    function distance(x, y) {
        const dx = x - CENTER;
        const dy = y - CENTER;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function inCircle(x, y, radius = RADIUS) {
        return distance(x, y) <= radius;
    }

    function isOutline(x, y) {
        const d = distance(x, y);
        return d > RADIUS - 1.2 && d <= RADIUS + 0.35;
    }

    function inEllipse(x, y, cx, cy, rx, ry) {
        const nx = (x - cx) / rx;
        const ny = (y - cy) / ry;
        return (nx * nx + ny * ny) <= 1;
    }

    function isLand(x, y) {
        const land1 =
            inEllipse(x, y, 9.5, 9.0, 4.8, 4.0) ||
            inEllipse(x, y, 11.5, 7.0, 3.5, 2.0) ||
            inEllipse(x, y, 7.5, 11.5, 2.5, 3.5);

        const land2 =
            inEllipse(x, y, 23.0, 13.5, 5.5, 7.0) ||
            inEllipse(x, y, 24.5, 9.5, 3.0, 3.5) ||
            inEllipse(x, y, 26.0, 18.0, 2.5, 3.0);

        const land3 =
            inEllipse(x, y, 10.5, 22.5, 4.5, 4.8) ||
            inEllipse(x, y, 12.5, 25.5, 2.2, 3.2);

        const land4 =
            inEllipse(x, y, 17.5, 5.2, 1.8, 1.1) ||
            inEllipse(x, y, 20.5, 6.2, 1.2, 0.9);

        return land1 || land2 || land3 || land4;
    }

    function isCloud(x, y) {
        return (
            inEllipse(x, y, 19.0, 13.5, 1.2, 1.2) ||
            inEllipse(x, y, 18.0, 14.5, 1.2, 1.2) ||
            inEllipse(x, y, 17.0, 15.5, 1.1, 1.1) ||
            inEllipse(x, y, 16.0, 16.5, 1.0, 1.0)
        );
    }

    function getOceanClass(x, y) {
        const dx = x - CENTER;
        const dy = y - CENTER;
        const d = distance(x, y);

        if (dx > 7 && dy > 6) return "ocean-deep";
        if (dx > 4 && dy > 3) return "ocean-dark";
        if (dx < -5 && dy < -2) return "ocean-light";
        if (dx < -6 && dy > 5) return "ocean-light";
        if (d < 6 && dx < 1) return "ocean-light";

        return "ocean";
    }

    function getLandClass(x, y) {
        if (
            (x > 21 && y > 18) ||
            (x < 12 && y > 20) ||
            (x < 10 && y < 11)
        ) {
            return "land-deep";
        }

        if (
            (x > 19 && y > 16 && x < 26) ||
            (x < 13 && y > 19) ||
            (x < 11 && y < 13)
        ) {
            return "land-dark";
        }

        if (
            (x > 22 && y < 11) ||
            (x < 9 && y < 9) ||
            (x > 24 && y > 22) ||
            (x > 16 && y < 7)
        ) {
            return "land-light";
        }

        return "land";
    }

    function getPixelType(x, y) {
        if (isOutline(x, y)) {
            return "black";
        }

        if (!inCircle(x, y)) {
            return "empty";
        }

        if (isCloud(x, y)) {
            return "cloud";
        }

        if (isLand(x, y)) {
            return getLandClass(x, y);
        }

        return getOceanClass(x, y);
    }

    function createEarth() {
        for (let y = 0; y < GRID; y++) {
            for (let x = 0; x < GRID; x++) {
                const pixel = document.createElement("div");
                const type = getPixelType(x, y);

                pixel.className = `pixel ${type}`;
                pixelEarth.appendChild(pixel);
            }
        }
    }

    createEarth();

    pixelEarth.addEventListener("click", function () {
    showRetroLoading(CONFIG.nextPage);
   });
}
//////////////////////////////////////////////////



/* 로딩 오류창 컨셉 */
function showRetroLoading(nextPage) {
    if (!retroLoadingOverlay) {
        window.location.href = nextPage;
        return;
    }

    retroLoadingOverlay.querySelectorAll(".retro-error-window").forEach(function (windowElement) {
    windowElement.remove();
});

retroLoadingOverlay.classList.add("is-active");

    const totalWindows = 5;
    const startX = 34;
    const startY = 11;
    const gapX = 150;
    const gapY = 51;

    for (let i = 0; i < totalWindows; i++) {
        const win = document.createElement("div");
        win.className = "retro-error-window";
        win.style.left = `${startX + gapX * i}px`;
        win.style.top = `${startY + gapY * i}px`;
        win.style.zIndex = String(20 + i);

        win.innerHTML = `
            <div class="retro-error-titlebar">
                <div class="retro-error-title">SYSTEM MESSAGE</div>
                <div class="retro-error-close">X</div>
            </div>
            <div class="retro-error-body">
                <div class="retro-error-main">Loading...</div>
                <div class="retro-error-sub">Going into the Earth!!.</div>
                <div class="retro-frog-wrap">
                    <img class="retro-frog-image" src="./frog.gif.gif" alt="pixel frog"> </div>
                <div class="retro-error-button-wrap">
                    <div class="retro-error-button">OK</div>
                </div>
            </div>
        `;

        retroLoadingOverlay.appendChild(win);

        setTimeout(function () {
            win.classList.add("is-show");
        }, i * 130);
    }

    setTimeout(function () {
        window.location.href = nextPage;
    }, 130 * totalWindows + 2000);
}


/* earth.html*/

const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");

const LOGIN_CONFIG = {
    nextPage: "main.html"
};

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const nickname = document.getElementById("nickname").value.trim();
        const password = document.getElementById("password").value.trim();
        const server = document.getElementById("server").value;

        if (!nickname) {
            loginError.textContent = "Please enter your nickname.";
            return;
        }

        if (!password) {
            loginError.textContent = "Please enter your password.";
            return;
        }

        if (!server) {
            loginError.textContent = "Please select a server.";
            return;
        }

        loginError.textContent = "";

        sessionStorage.setItem("livechat_nickname", nickname);
        sessionStorage.setItem("livechat_server", server);

        window.location.href = LOGIN_CONFIG.nextPage;
    });
}