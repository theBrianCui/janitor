/*
The popup (DOM) is re-loaded every single time the user closes and re-opens
it by clicking the button. There is no expectation to "live update" the
popup while the user navigates in their browser.
*/
import Storage from '../lib/StorageProxy';

interface IState {
    activeDomain: string,
    activeQueries: Array<string>,
    customQueries: Array<string>
}

var LocalState: IState = {
    activeDomain: "",
    activeQueries: [],
    customQueries: []
}

namespace Init {
    function loadPageDomain() {
        if (!LocalState.activeDomain) return Promise.resolve(LocalState.activeDomain);

        return browser.tabs.executeScript({ code: "window.location.host"}).then((result: string) => {
            return (LocalState.activeDomain = result);
        });
    }

    function loadActiveQueries() {
        return Storage.getQueriesForDomain(LocalState.activeDomain).then((queries: Array<string>) => {
            LocalState.activeQueries = queries;
            LocalState.customQueries = queries;
        });
    }

    export function Initialize() {
        return loadPageDomain()
            .then(loadActiveQueries);
    }
}

namespace Display {
    export function refresh() {
        let queryList = document.getElementById("queryList");

        for (let i = 0; i < LocalState.activeQueries.length; ++i) {
            let div = document.createElement("div");
            div.textContent = LocalState.activeQueries[i];
            queryList.appendChild(div);
        }
    }
}

window.onload = () => {
    Init.Initialize().then(() => {
        Display.refresh();

        document.getElementById("reset").addEventListener("click", (e) => {
            Storage.setQueriesForDomain(LocalState.activeDomain, []).then(
            (newQueries: Array<string>) => {
                if (newQueries.length > 0)
                    throw new Error("Failed to reset queries!");

                return browser.tabs.executeScript({ code: "window.location.reload();" });
            }).catch((e: Error) => {
                console.warn(e);
            }).then(Init.Initialize);
        });
    });

    // browser.storage.onChanged.addListener((changes, areaName) => {
    //     if (changes[getPageDomain()] && changes[getPageDomain()].newValue !== undefined) {
    //         assignDisplayQuery(changes[getPageDomain()].newValue);
    //     }
    // });
};