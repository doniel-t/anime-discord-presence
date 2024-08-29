const LOCAL_URL = "http://localhost";
const LOCAL_PORT = 42069;
const SUPPORTED_WEBSITES = ["kickassanime"];


async function logToServer(message) {
    const res = await fetch(`${LOCAL_URL}:${LOCAL_PORT}/log`, {
        method: "POST",
        body: JSON.stringify({ message: message }),
        headers: {
            "Content-Type": "application/json",
        }
    });

    if (!res.ok) throw new Error(`Response not ok, status: ${res.status}`);
}


async function clearActivity() {
    const res = await fetch(`${LOCAL_URL}:${LOCAL_PORT}/clear`, {
        method: "GET",
    });

    if (!res.ok) throw new Error(`Response not ok when clearing activity, status: ${res.status}`);
}

function tabTriggersActivityChange(tabURL) {
    return SUPPORTED_WEBSITES.some((animeWebsiteURL) => {
        const cleanedTabURL = tabURL.split(".")[1];
        return animeWebsiteURL.includes(cleanedTabURL);
    });
}

(async () => {
    const tabUrls = new Map();

    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (changeInfo.url) {
            tabUrls.set(tabId, changeInfo.url);
        }
    });

    chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
        const tabUrl = tabUrls.get(tabId);
        if (tabUrl) {
            if (tabTriggersActivityChange(tabUrl)) {
                await logToServer(`Tab closed: ${tabUrl}`);
                await clearActivity();
            }
            tabUrls.delete(tabId);
        }
    });
})()