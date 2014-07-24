/**
 * Created by shali on 21/07/14.
 */
var data = {notificationUrls: []};

function invalidateTab(tab) {
    if (isYad2Tab(tab)) {
        var notification = data.notificationUrls.indexOf(tab.url) != -1;
        chrome.browserAction.setBadgeText({tabId: tab.id, text: notification ? 'ON' : ''});
    }
}
function isYad2Tab(tab) {
    return tab && tab.url && tab.url.indexOf("yad2.co.il") != -1;
}
function onBrowserActionClicked(tab) {
    if (isYad2Tab(tab)) {
        toggleArrayItem(data.notificationUrls, tab.url);
        invalidateTab(tab);
        chrome.storage.sync.set(data);
    }
}

function toggleArrayItem(a, v) {
    var i = a.indexOf(v);
    if (i === -1)
        a.push(v);
    else
        a.splice(i, 1);
}

function init() {
    chrome.tabs.onCreated.addListener(invalidateTab);
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        invalidateTab(tab)
    });
    chrome.browserAction.onClicked.addListener(onBrowserActionClicked);
    chrome.tabs.query({}, function (tabs) {
        var len = tabs.length;
        for (var i = 0; i < len; i++) {
            invalidateTab(tabs[i]);
        }
    });
}

chrome.storage.sync.get(null, function (items) {
    if (items.notificationUrls) {
        data = items;
    }
    init();
});

//
//chrome.runtime.onMessage.addListener(
//    function (request, sender, sendResponse) {
//        if (request.msg == "initBrowserAction") {
//        }
//    });
//
