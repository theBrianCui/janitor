const Storage = require("../StorageProxy.js");
var DOMAIN = "";

function assignDisplayQuery(queries) {
    let queryList = document.getElementById("queryList");
    for (let i = 0; i < queries.length; ++i) {
        let div = document.createElement("div");
        div.textContent = queries[i];
        queryList.appendChild(div);
    }
}

function getPageDomain() {
    if (DOMAIN) return Promise.resolve(DOMAIN);

    return browser.tabs.executeScript({ code: "window.location.host"}).then((result) => {
        return (DOMAIN = result);
    });
}

window.onload = () => {
    console.log("Popup loaded!");

    getPageDomain().then(Storage.getQueriesForDomain)
        .then((queries) => {
            assignDisplayQuery(queries); 
        });

    // browser.storage.onChanged.addListener((changes, areaName) => {
    //     if (changes[getPageDomain()] && changes[getPageDomain()].newValue !== undefined) {
    //         assignDisplayQuery(changes[getPageDomain()].newValue);
    //     }
    // });

    document.getElementById("reset").addEventListener("click", (e) => {
        getPageDomain().then((domain) => {
            return Storage.setQueriesForDomain(domain, []);
        }).then((newQueries) => {
            if (newQueries.length > 0)
                throw new Error("Failed to reset queries!");

            return browser.tabs.executeScript({ code: "window.location.reload();" });
        }).catch((e) => {
            console.warn(e);
        }).then(() => {
            console.log("Reset!");
        });
    });
};