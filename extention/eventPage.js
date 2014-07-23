/**
 * Created by shali on 21/07/14.
 */

var notificationUrls = [];

function invalidateTab(tab) {
    var notification = notificationUrls.indexOf(tab.url) != -1;
    chrome.browserAction.setBadgeText({tabId: tab.id, text: notification ? 'ON' : ''});
}
chrome.tabs.onCreated.addListener(invalidateTab);
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    invalidateTab(tab)
});


chrome.browserAction.onClicked.addListener(function (tab) {
    if (tab.url.indexOf("yad2.co.il") != -1) {
        toggleArrayItem(notificationUrls, tab.url);
        invalidateTab(tab);
    }
});

function toggleArrayItem(a, v) {
    var i = a.indexOf(v);
    if (i === -1)
        a.push(v);
    else
        a.splice(i, 1);
}

//
//chrome.runtime.onMessage.addListener(
//    function (request, sender, sendResponse) {
//        if (request.msg == "initBrowserAction") {
//        }
//    });
//
