window.onload = () => {
    browser.storage.local.get("query").then((result) => {
        document.getElementById("query").textContent = result.query;
    });

    browser.storage.onChanged.addListener((changes, areaName) => {
        if (changes.query && changes.query.newValue) {
            document.getElementById("query").textContent = changes.query.newValue;
        }
    });

    document.addEventListener("click", (e) => {
        console.log("Hello from popup!");
    });

    console.log(document.getElementById("reset"));

    document.getElementById("reset").addEventListener("click", (e) => {
        browser.storage.local.set({ "query": null });
        browser.tabs.executeScript({ code: "window.location.reload();" });
        console.log("Reset!");
    });
};