window.onload = () => {
    browser.storage.local.get("query").then((result) => {
        document.getElementById("query").textContent = result.query;
    });

    browser.storage.onChanged.addListener((changes, areaName) => {
        if (changes.query && changes.query.newValue !== undefined) {
            document.getElementById("query").textContent = changes.query.newValue || "";
        }
    });

    document.getElementById("reset").addEventListener("click", (e) => {
        browser.storage.local.set({ "query": null }).then(() => {
            document.getElementById("query").textContent = "";
            return browser.tabs.executeScript({ code: "window.location.reload();" });
        }).catch((e) => {
            console.warn(e);
        }).then(() => {
            console.log("Reset!");
        });
    });
};