/**
 * Created by shali on 20/07/14.
 */
const PROP_VISITED = "visited";
const PROP_FIRST_SEEN = "firstSeen";
const NEW_AD_SEC = 60;
const ADS_SELECTOR = "tr[id^='tr_Ad']";
const INNER_INTEGRATION_SELECTOR = "td:nth-child(2)";


function getAdId($item) {
    var id = $item.attr('id');
    return id;
}

function getProperty(adId, propName) {
    return localStorage.getItem(adId + '.' + propName);
}

function wasTouchedSince(adId, propName, secondsAgo) {
    var str = getProperty(adId, propName);
    if (str) {
        var num = parseInt(str);
        var delta = (new Date()).getTime() - num;
        return delta < secondsAgo * 1000
    }
    return false;
}


function setProperty(adId, propName, val) {
    localStorage.setItem(adId + '.' + propName, val)
}

function touchProperty(adId, propName) {
    setProperty(adId, propName, (new Date()).getTime());
}

function invalidateColors() {
    var count = 0;
    var hasAds = false;

    $(ADS_SELECTOR).each(function (i, ad) {
        var $ad = $(ad);
        var id = getAdId($ad);
        hasAds = true;
        if (getProperty(id, PROP_VISITED)) {
            $ad.find(INNER_INTEGRATION_SELECTOR).addClass('visitedItem');
        }
        else if (wasTouchedSince(id, PROP_FIRST_SEEN, NEW_AD_SEC)) {
            $ad.find(INNER_INTEGRATION_SELECTOR).addClass('newItem');
            count++
        }
    });

    if (hasAds) {
        document.title = '(' + count + ')';
        //chrome.runtime.sendMessage({msg: "setBadge", number: count});
    }
}


function onAdClick() {
    var $ad = $(this);
    var id = getAdId($ad);

    touchProperty(id, PROP_VISITED);
    $ad.find(INNER_INTEGRATION_SELECTOR).addClass("visitedItem")
}
function init() {
    var $ads = $(ADS_SELECTOR);
    $ads.click(onAdClick);

    var hasAds = false;
    $ads.each(function (i, ad) {
        hasAds = true;
        var $ad = $(ad);
        var id = getAdId($ad);
        if (!getProperty(id, PROP_FIRST_SEEN)) {
            touchProperty(id, PROP_FIRST_SEEN);
        }
    });

    if (hasAds) {
        invalidateColors();
    }
}

//chrome.runtime.onMessage.addListener(
//    function (request, sender, sendResponse) {
//        if (request.msg == "clearFiltered") {
//            clearFiltered()
//        }
//    });

init();