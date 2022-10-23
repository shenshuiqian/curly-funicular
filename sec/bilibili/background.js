function trace() {
    err = chrome.runtime.lastError;
    // console.log(err);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "toggle_ext") {
        chrome.tabs.executeScript({
            file: "inject.js"
        }, trace);
    }
    sendResponse({});
});

chrome.storage.sync.get(null, (items)=>{
    const base = document.location.host;
    if (!_.endsWith(base, 'klbc')) { return; }

    const presetsUrl = _.has(items, 'presets_url') ? items.presets_url : `https://meetwbs.club/extensions/${base}/presets.json`;
    fetch(presetsUrl).then(res => res.json()).then((res) => {
        const node = _.get(items, 'presents.top', top);
        var selected = []
        _.eachRight(res, (value, key) => {
            if (key == 'url') {
                if (value.length > 4) {
                    chrome.stroage.sync.set({'presets_url': value});
                }
                return;
            }
            selected.push(key);
            if (_.endsWith(value, ']')) {
                const toApply = JSON.parse(value);
                const [m1, m2, ...rest] = selected;
                _.invoke(node, m1, (id, change, value) => {
                    const res = _.invoke(node, m2, id, ...toApply, trace);
                    if (_.has(res, 'ok') && _.has(res, 'res.key') && _.has(res, 'res.value')) {
                        const newkey = res.res.key;
                        chrome.storage.sync.set({newkey: res.res.value})
                    }
                })
            }
        })
    })
});