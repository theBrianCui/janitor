function assignDisplayQuery(query) {
    document.getElementById("query").textContent = query || "";
}

window.onload = () => {
    browser.storage.sync.get("query").then((result) => { assignDisplayQuery(result.query); });

    browser.storage.onChanged.addListener((changes, areaName) => {
        if (changes.query && changes.query.newValue !== undefined) {
            assignDisplayQuery(changes.query.newValue);
        }
    });

    document.getElementById("reset").addEventListener("click", (e) => {
        browser.storage.sync.set({ "query": null }).then(() => {
            return browser.tabs.executeScript({ code: "window.location.reload();" });
        }).catch((e) => {
            console.warn(e);
        }).then(() => {
            console.log("Reset!");
        });
    });
};