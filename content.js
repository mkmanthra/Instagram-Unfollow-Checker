const blockedPaths = new Set([
    "accounts",
    "about",
    "explore",
    "direct",
    "reels",
    "stories",
    "notifications",
    "settings",
    "privacy",
    "legal",
    "directory",
    "challenge"
]);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getUsername(link) {
    const href = link.getAttribute("href");

    if (!href) return null;

    const match = href.match(/^\/([^/?#]+)\/?$/);

    if (!match) return null;

    const username = match[1].toLowerCase();

    if (
        username.length < 1 ||
        username.length > 30 ||
        !/^[a-z0-9._]+$/.test(username) ||
        blockedPaths.has(username)
    ) {
        return null;
    }

    return username;
}

function collectUsers(container, users) {
    container.querySelectorAll("a[href]").forEach(link => {
        const username = getUsername(link);

        if (username) {
            users.add(username);
        }
    });
}

function getCandidates() {
    return [...document.querySelectorAll("div")].filter(element => {
        const rect = element.getBoundingClientRect();

        return (
            rect.width >= 350 &&
            rect.width <= 800 &&
            rect.height >= 200 &&
            rect.height <= 700 &&
            element.scrollHeight > element.clientHeight
        );
    });
}

function findContainer(type) {
    const candidates = getCandidates();

    const wanted = type === "followers"
        ? ["followers", "follower"]
        : ["following"];

    const matching = candidates.filter(element => {
        const text = element.innerText
            .slice(0, 500)
            .toLowerCase();

        return wanted.some(word => text.includes(word));
    });

    const list = matching.length ? matching : candidates;

    list.sort((a, b) => {
        const ar = a.getBoundingClientRect();
        const br = b.getBoundingClientRect();

        const aScore =
            Math.abs(ar.width - 560) +
            Math.abs(ar.height - 309);

        const bScore =
            Math.abs(br.width - 560) +
            Math.abs(br.height - 309);

        return aScore - bScore;
    });

    return list[0] || null;
}

async function scanList(type) {
    const container = findContainer(type);

    if (!container) {
        return {
            error: "Make sure if you Opened the Followers/Following window first."
        };
    }

    const users = new Set();

    let previousScroll = -1;
    let previousHeight = -1;
    let noProgress = 0;
    let bottomWaits = 0;

    container.scrollTop = 0;

    await sleep(1200);

    for (let i = 0; i < 300; i++) {
        collectUsers(container, users);

        const currentScroll = container.scrollTop;
        const currentHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;

        const atBottom =
            currentScroll + clientHeight >= currentHeight - 10;

        if (atBottom) {
            bottomWaits++;

            await sleep(1500);

            collectUsers(container, users);

            const newHeight = container.scrollHeight;

            if (newHeight > currentHeight) {
                bottomWaits = 0;
                noProgress = 0;
            } else if (currentScroll !== container.scrollTop) {
                bottomWaits = 0;
                noProgress = 0;
            }

            if (bottomWaits >= 6) {
                break;
            }
        } else {
            bottomWaits = 0;

            const step = Math.max(
                180,
                Math.floor(clientHeight * 0.55)
            );

            container.scrollTop = Math.min(
                currentScroll + step,
                container.scrollHeight
            );

            container.dispatchEvent(
                new Event("scroll", { bubbles: true })
            );

            await sleep(900);
        }

        const newScroll = container.scrollTop;
        const newHeight = container.scrollHeight;

        if (
            newScroll === previousScroll &&
            newHeight === previousHeight
        ) {
            noProgress++;
        } else {
            noProgress = 0;
        }

        previousScroll = newScroll;
        previousHeight = newHeight;

        if (noProgress >= 12 && bottomWaits >= 3) {
            break;
        }
    }

    collectUsers(container, users);

    return {
        users: [...users]
    };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "scanList") {
        scanList(message.type)
            .then(sendResponse)
            .catch(error => {
                sendResponse({
                    error: error.message || "Scanning failed."
                });
            });

        return true;
    }
});