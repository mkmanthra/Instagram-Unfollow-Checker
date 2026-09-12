let followers = [];
let following = [];

const status = document.getElementById("status");

function updateCounts() {
    document.getElementById("followersCount").textContent = followers.length;
    document.getElementById("followingCount").textContent = following.length;
}

function loadData() {
    chrome.storage.local.get(["followers", "following"], data => {
        followers = data.followers || [];
        following = data.following || [];
        updateCounts();
    });
}

async function scan(type) {
    const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    if (!tabs.length || !tabs[0].url || !tabs[0].url.includes("instagram.com")) {
        status.textContent = "Open Instagram first.";
        return;
    }

    status.textContent = type === "followers"
        ? "Scanning all Followers..."
        : "Scanning all Following...";

    chrome.tabs.sendMessage(
        tabs[0].id,
        {
            action: "scanList",
            type
        },
        response => {
            if (chrome.runtime.lastError) {
                status.textContent = "Refresh Instagram and try again.";
                return;
            }

            if (!response) {
                status.textContent = "No response from Instagram.";
                return;
            }

            if (response.error) {
                status.textContent = response.error;
                return;
            }

            const users = response.users || [];

            if (type === "followers") {
                followers = users;

                chrome.storage.local.set({ followers }, () => {
                    updateCounts();
                    status.textContent = `Followers saved: ${followers.length}`;
                });
            } else {
                following = users;

                chrome.storage.local.set({ following }, () => {
                    updateCounts();
                    status.textContent = `Following saved: ${following.length}`;
                });
            }
        }
    );
}

document.getElementById("scanFollowers").onclick = () => {
    scan("followers");
};

document.getElementById("scanFollowing").onclick = () => {
    scan("following");
};

document.getElementById("compare").onclick = () => {
    if (!followers.length || !following.length) {
        status.textContent = "Scan both lists first.";
        return;
    }

    const followerSet = new Set(followers);

    const result = following.filter(user => !followerSet.has(user));

    const box = document.getElementById("users");

    if (!result.length) {
        box.innerHTML = '<div class="empty">Everyone follows you back.</div>';
    } else {
        box.innerHTML = result
            .map(user => `<div class="user">@${user}</div>`)
            .join("");
    }

    status.textContent = `${result.length} account(s) don't follow you back.`;
};

document.getElementById("clear").onclick = () => {
    chrome.storage.local.remove(["followers", "following"], () => {
        followers = [];
        following = [];

        updateCounts();

        document.getElementById("users").innerHTML =
            '<div class="empty">No results yet.</div>';

        status.textContent = "Saved data cleared.";
    });
};

loadData();