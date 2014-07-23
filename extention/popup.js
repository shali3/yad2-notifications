/**
 * Created by shali on 21/07/14.
 */

function clearFiltered() {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {msg: "clearFiltered"});
    });
}

$(function () {
    $('.clearBtn').click(clearFiltered);
});