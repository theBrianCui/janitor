const Storage = require("../StorageProxy.js");
var DOMAIN = "";

function assignDisplayQuery(query) {
    document.getElementById("query").textContent = query || "";
}

function getPageDomain() {
    if (DOMAIN) return Promise.resolve(DOMAIN);

    return browser.tabs.executeScript({ code: "window.location.host"}).then((result) => {
        console.log("Popup got domain: " + result);
        return (DOMAIN = result);
    });
}

window.onload = () => {
    console.log("Popup loaded!");

    getPageDomain().then(Storage.getQueriesForDomain)
        .then((result) => { 
            console.log("Popup displaying: " + result);
            assignDisplayQuery(JSON.stringify(result)); 
        });

    document.addEventListener("click", (e) => {
        getPageDomain().then(Storage.getQueriesForDomain)
            .then((result) => { 
                console.log("Popup displaying: " + result);
                assignDisplayQuery(JSON.stringify(result)); 
            });
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