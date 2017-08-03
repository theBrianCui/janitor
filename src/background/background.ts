import Storage from '../lib/StorageProxy';

var colors = ["Green", "Blue", "Purple", "Orange"];

for (let i = 1; i <= 4; ++i) {
    browser.contextMenus.create({
        id: "delete-" + i,
        title: "Delete " + colors[i - 1] + " (Depth: " + i + ")",
        contexts: ["all"]
    });
}

/* Send a message to the content script with the depth.
   The received message is a CSS selector for the element. */
browser.contextMenus.onClicked.addListener((info: any, tab: any) => {
    browser.tabs.query({ active: true, currentWindow: true })
        .then((tabs: Array<any>) => {
            return browser.tabs.sendMessage(tabs[0].id, 
            {
                depth: parseInt(info.menuItemId.split("-")[1])
            });
        }).catch(console.error);
});