/**
 * Created by shali on 21/07/14.
 */
var syncData = {notificationUrls: []};
var notificationIdToUrl = {};
const UPDATE_INTERVAL_MINUTES = 1;
const ALARM_NAME = "fetchAds";
const NOTIFICATION_BUTTONS = [
    {title: 'פתח', iconUrl: "open.png"},
    {title: 'הפסק לעקוב', iconUrl: "stop.png"}
];
const OPEN_AD_INDEX = 0;
const STOP_FOLLOWING_INDEX = 1;


function invalidateTab(tab) {
    if (isYad2Tab(tab)) {
        var notification = syncData.notificationUrls.indexOf(tab.url) != -1;
        chrome.browserAction.setBadgeText({tabId: tab.id, text: notification ? 'ON' : ''});
    }
}
function isYad2Tab(tab) {
    return tab && tab.url && tab.url.indexOf("yad2.co.il") != -1;
}
function onBrowserActionClicked(tab) {
    if (isYad2Tab(tab)) {
        toggleArrayItem(syncData.notificationUrls, tab.url);
        invalidateAlarm();
        invalidateTab(tab);
        chrome.storage.sync.set(syncData);
    }
}

function toggleArrayItem(a, v) {
    var i = a.indexOf(v);
    if (i === -1)
        a.push(v);
    else
        a.splice(i, 1);
}

function removeFromArray(a, v) {
    var i = a.indexOf(v);
    if (i !== -1) {
        a.splice(i, 1);
        return true;
    }

    return false;
}


function fetchAds(notificationUrl) {

    chrome.notifications.create(notificationUrl, {
        type: "image",
        iconUrl: "icon_128.png",
        imageUrl: "http://images.yad2.co.il/Pic/201407/17/1_1/o/o1_1_1_175862_20140717230757.jpg",
        title: "מודעה חדשה",
        message: "מכונית חדשה",
        buttons: NOTIFICATION_BUTTONS
    }, function () {
    });

}
function onAlarmTick(alarm) {
    if (alarm.name == ALARM_NAME) {
        if (syncData.notificationUrls.length > 0) {

            var notifications = syncData.notificationUrls;
            for (var i = 0; i < notifications.length; i++) {
                fetchAds(notifications[i]);
            }
        }
        else {
            chrome.alarms.clear(ALARM_NAME);
        }

    }
}

function invalidateAlarm() {
    if (syncData.notificationUrls.length > 0) {
        chrome.alarms.create(ALARM_NAME, {periodInMinutes: UPDATE_INTERVAL_MINUTES});
        onAlarmTick({name: ALARM_NAME});
    }
    else {
        chrome.alarms.clear(ALARM_NAME);
    }
}

function onNotificationClicked(notificationId, buttonIndex) {
    //var url = notificationIdToUrl[notificationId];
    var url = notificationId; // just for now
    if (buttonIndex == OPEN_AD_INDEX) {
        chrome.tabs.query({url: url}, function (tabs) {
            if (tabs.length > 0) {
                chrome.tabs.update(tabs[0].id, {active: true});
                chrome.windows.update(tabs[0].windowId, {focused: true});
            }
            else {
                chrome.tabs.create({url: url, active: true});
            }
        });
    }
    else if (buttonIndex == STOP_FOLLOWING_INDEX) {
        if (removeFromArray(syncData.notificationUrls, url)) {
            invalidateAlarm();
            invalidateTabs({url: url});
            chrome.storage.sync.set(syncData);
        }
    }
    chrome.notifications.clear(notificationId, function () {
    });
}

function invalidateTabs(query) {
    chrome.tabs.query(query || {}, function (tabs) {
        var len = tabs.length;
        for (var i = 0; i < len; i++) {
            invalidateTab(tabs[i]);
        }
    });
}
function init() {
    chrome.tabs.onCreated.addListener(invalidateTab);
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        invalidateTab(tab)
    });
    chrome.browserAction.onClicked.addListener(onBrowserActionClicked);
    chrome.alarms.onAlarm.addListener(onAlarmTick);
    chrome.notifications.onButtonClicked.addListener(onNotificationClicked);

    invalidateAlarm();
    invalidateTabs();
}

chrome.storage.sync.get(null, function (items) {
    if (items.notificationUrls) {
        syncData = items;
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
