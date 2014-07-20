/**
 * Created by shali on 20/07/14.
 */

function getAdId($item) {
    var id = $item.attr('id');
    id = id.substr(id.lastIndexOf('_') + 1);
    return id;
}

function getShouldFilter(adId) {
    return localStorage.getItem(adId + '.filter');
}

function setShouldFilter(adId, val) {
    localStorage.setItem(adId + '.filter', val)
}

function onRemoveClicked(ev) {
    ev.preventDefault();
    $target = $(ev.target);
    var id = $target.data("id");
    setShouldFilter(id, true);
    invalidateFiltered();
}

function invalidateFiltered() {
    var count = 0;

    $("tr[id^='tr_Ad_1_1']").each(function (i, item) {
        var $item = $(item);
        var id = getAdId($item);
        if (getShouldFilter(id)) {
            $item.hide();
            count++
        }
        else {
            $item.show();
        }
    });

    var text = '';
    if (count > 0) {
        text = 'מתוכם סוננו ' + count;
    }

    $('.filteredCount').text(text);
}


function init() {
    $("tr[id^='tr_Ad_1_1']").each(function (i, item) {
        var $item = $(item);
        var id = getAdId($item);

        var removeLink = $('<a href="#"></a>');
        removeLink.text('הסר');
        removeLink.addClass('removeLink');
        removeLink.data('id', id);
        removeLink.click(onRemoveClicked);

        $item.find("td:nth-child(2)").append(removeLink);
    });


    var filterCountMessage = $('<i></i>');
    filterCountMessage.addClass('filteredCount');
    filterCountMessage.css('font-size', 'small').css('color', 'blue');
    $('.show_results_from h2').append(filterCountMessage)

    invalidateFiltered();
}

init();