var colors = ["Green", "Blue", "Purple", "Orange"];

for (let i = 1; i <= 4; ++i) {
    browser.contextMenus.create({
        id: "delete-" + i,
        title: "Delete " + colors[i - 1] + " (Depth: " + i + ")",
        contexts: ["all"]
    });
}

browser.contextMenus.onClicked.addListener((info, tab) => {
    browser.tabs.query({ active: true, currentWindow: true })
        .then((tabs) => {
            browser.tabs.sendMessage(tabs[0].id, 
            {
                depth: parseInt(info.menuItemId.split("-")[1])
            });
        });
});