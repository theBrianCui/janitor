declare var browser: any;
import Storage from '../lib/StorageProxy';
//import Promise from 'bluebird';
var DOMAIN = "";

function assignDisplayQuery(queries: Array<string>) {
    let queryList = document.getElementById("queryList");
    for (let i = 0; i < queries.length; ++i) {
        let div = document.createElement("div");
        div.textContent = queries[i];
        queryList.appendChild(div);
    }
}

function getPageDomain() {
    if (DOMAIN) return Promise.resolve(DOMAIN);

    return browser.tabs.executeScript({ code: "window.location.host"}).then((result: string) => {
        return (DOMAIN = result);
    });
}

window.onload = () => {
    console.log("Popup loaded!");

    getPageDomain().then(Storage.getQueriesForDomain)
        .then((queries: Array<string>) => {
            assignDisplayQuery(queries); 
        });

    // browser.storage.onChanged.addListener((changes, areaName) => {
    //     if (changes[getPageDomain()] && changes[getPageDomain()].newValue !== undefined) {
    //         assignDisplayQuery(changes[getPageDomain()].newValue);
    //     }
    // });

    document.getElementById("reset").addEventListener("click", (e) => {
        getPageDomain().then((domain: string) => {
            return Storage.setQueriesForDomain(domain, []);
        }).then((newQueries: Array<string>) => {
            if (newQueries.length > 0)
                throw new Error("Failed to reset queries!");

            return browser.tabs.executeScript({ code: "window.location.reload();" });
        }).catch((e: Error) => {
            console.warn(e);
        }).then(() => {
            console.log("Reset!");
        });
    });
};