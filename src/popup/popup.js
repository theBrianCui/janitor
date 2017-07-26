browser.storage.local.get("query").then((result) => {
    document.getElementById("query").textContent = result.query;
});

browser.storage.onChanged.addListener((changes, areaName) => {
    if (changedItems.query && changedItems.query.newValue) {
        document.getElementById("query").textContent = changedItems.query.newValue;
    }
});

document.addEventListener("click", (e) => {
    console.log("Hello from popup!");
});