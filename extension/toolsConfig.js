let ToolsetVars = {};
chrome.storage.sync.get(['hiveToken','hiveUserId'],function (data) {
    ToolsetVars = {
        token : data.hiveToken,
        userId: data.hiveUserId,
        mixPanel: "7fc407b9cc147e033f8626a62dae4bbf",
        published: "populateWithData",
        server: "https://hivelighter.com",
        version: chrome.runtime.getManifest().version
    };
});
