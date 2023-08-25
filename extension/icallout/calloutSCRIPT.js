function checkVisible(elm, threshold, mode) {
    threshold = threshold || 0;
    mode = mode || 'visible';

    var rect = elm.getBoundingClientRect();
    var viewHeight = Math.max(window.parent.document.documentElement.clientHeight, window.parent.innerHeight);
    var above = rect.bottom - threshold < 0;
    var below = rect.top - viewHeight + threshold >= 0;

    if (above || below) {
        broadcastCalloutEvent('putaway');
    } else {
        broadcastCalloutEvent('putback');
    }

    //return mode === 'above' ? above : (mode === 'below' ? below : !above && !below);
}

function scrollTo(to, duration) {
    if (duration < 0) return;
    var scrollTop = window.parent.document.body.scrollTop + window.parent.document.documentElement.scrollTop;
    var difference = to - scrollTop;
    var perTick = difference / duration * 10;

    setTimeout(function () {
        scrollTop = scrollTop + perTick;
        window.parent.document.body.scrollTop = scrollTop;
        window.parent.document.documentElement.scrollTop = scrollTop;
        if (scrollTop === to) return;
        scrollTo(to, duration - 10);
    }, 10);
}

function getRefUrl() {
    var iframe_url = document.location.href,
        referrer = iframe_url.substr(iframe_url.indexOf("?refurl=") + 8),
        refProtcl = referrer.split('://')[0],
        refDmn = referrer.split('/')[2],
        refOrigin = refProtcl + "://" + refDmn;

    return refOrigin;
}

function getUrlParam(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.parent.location.search);
    return match && decodeURIComponent(match[1].replace(/\\+/g, ' '));
}

function broadcastCalloutEvent(event, param) {
    var message,
        iframe_url = document.location.href,
        referrer = iframe_url.substr(iframe_url.indexOf("?refurl=") + 8),
        refProtcl = referrer.split('://')[0],
        refDmn = referrer.split('/')[2],
        refOrigin = refProtcl + "://" + refDmn;

    switch (event) {

        // Color picker
        case 'color-pick':

            // Handle color param
            switch (param) {
                case 'yellow':
                    message = 'color picker yellow';
                    break;

                case 'red':
                    message = 'color picker red';
                    break;

                case 'blue':
                    message = 'color picker blue';
                    break;

                case 'green':
                    message = 'color picker green';
                    break;

                case 'pink':
                    message = 'color picker pink';
                    break;

                default:
                    break;
            };

            break;

        // Comment share
        case 'comment':
            message = 'comment';
            break;

        case 'save':
            message = 'save';
            break;

        // Comment twitter
        case 'twitter':
            if (isPubPage) {

                var fullHighlight = window.parent.document.getElementById('ans_0').textContent;
                var arFirstSentence = fullHighlight.split(/(^.*?[a-z]{2,}[.!?])\s+\W*[A-Z]/);

                if (arFirstSentence[0] == "") {
                    firstSentence = arFirstSentence[1]
                } else {
                    firstSentence = arFirstSentence[0]
                }

                var firstSentenceLgt = firstSentence.length;

                if (firstSentenceLgt > 117) {
                    var shortStr = firstSentence.substring(0, 117);
                    var truncString = shortStr.slice(0, -3) + Array(3 + 1).join('.');

                    firstSentence = truncString;
                }

                window.open('http://twitter.com/share?url=' + encodeURIComponent(top.location.href) + '&text=' + encodeURIComponent(firstSentence), 'share_twitter', 'toolbar=no,width=680,height=500');

            }

            message = 'twitterToolbar';
            break;

        // Comment facebook
        case 'facebook':
            if (isPubPage) {
                var fullHighlight = window.parent.document.getElementById('ans_0').textContent;

                window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(top.location.href) + '&quote=' + encodeURIComponent(fullHighlight), 'share_facebook', 'toolbar=no,width=680,height=500');
            }

            message = 'facebookToolbar';
            break;

        // Comment email
        case 'email':
            message = 'emailToolbar';
            break;

        // Comment share
        case 'trash':
            message = 'trash';
            break;

        case 'clipboard':
            message = 'clipboard';
            break;

        // Close callout
        case 'close':
            message = 'close';
            break;

        case 'putaway':
            callout_left = window.parent.document.getElementById('calloutFrame').style.left;
            callout_right = window.parent.document.getElementById('calloutFrame').style.right;
            callout_top = window.parent.document.getElementById('calloutFrame').style.top;
            callout_top_val = parseInt(callout_top.replace("px", ""));

            window.parent.document.getElementById('calloutFrame').style.left = "auto";

            if (window.parent.innerWidth <= 320) {
                window.parent.document.getElementById('calloutFrame').style.right = "-145px";
            } else {

                if (typeof is_source_app !== "undefined") {
                    window.parent.document.getElementById('calloutFrame').style.right = "-240px";
                } else {
                    window.parent.document.getElementById('calloutFrame').style.right = "-240px";
                }

            }

            window.parent.document.getElementById('calloutFrame').style.position = "fixed";
            window.parent.document.getElementById('calloutFrame').style.top = "4%";
            document.getElementsByClassName('close-btn-child')[0].setAttribute("onclick", "broadcastCalloutEvent('putback'); return false;");
            document.getElementsByClassName('close-btn-child')[0].innerHTML = '<img src="img/arrow-left.svg" alt="Left" width="24" height="20" />';
            break;

        case 'putback':
            window.parent.document.getElementById('calloutFrame').style.left = callout_left;
            window.parent.document.getElementById('calloutFrame').style.right = callout_right;
            window.parent.document.getElementById('calloutFrame').style.position = "absolute";
            window.parent.document.getElementById('calloutFrame').style.top = callout_top;
            document.getElementsByClassName('close-btn-child')[0].setAttribute("onclick", "broadcastCalloutEvent('putaway'); return false;");
            document.getElementsByClassName('close-btn-child')[0].innerHTML = '<img src="img/exit_off.svg" alt="Email" width="23" ontouchstart="this.src=\'img/exit_on.svg\'" ontouchend="this.src=\'img/exit_off.svg\'"/>';
            //window.parent.scrollTo(0, callout_top_val - 31);
            scrollTo(callout_top_val - 31, 50);
            break;

        // Default.
        default:
            // Not corresponding, we do nothing.
            break;
    };

    if (message !== "") { window.parent.postMessage(message, "*"); };
};

function receiveMessage(event) {

    // if readerMode did not work, tell the user they can't continue
    if (event.data && event.data.ans_mode) {
        var mode = event.data.ans_mode;

        switch (mode) {
            case 'cancel':
                // Hide trash, show other icons
                // show trash, hide all other icons
                var colorPickers = document.getElementsByClassName('col-pick');

                for (i = 0; i < colorPickers.length; i++) {
                    colorPickers[i].style.display = 'block';
                }

                document.getElementsByClassName('com-bub')[0].style.display = "block";
                document.getElementsByClassName('tw-box')[0].style.display = "block";
                document.getElementsByClassName('fb-box')[0].style.display = "block";
                document.getElementsByClassName('email-box')[0].style.display = "block";
                document.getElementsByClassName('save-box')[0].style.display = "block";
                document.getElementsByClassName('tr-can')[0].style.display = "none";
                document.getElementsByClassName('callout-container')[0].setAttribute("class", "callout-container");
                break;

            case 'edit':
                // show trash, hide all other icons
                var colorPickers = document.getElementsByClassName('col-pick');

                for (i = 0; i < colorPickers.length; i++) {
                    colorPickers[i].style.display = 'none';
                }

                document.getElementsByClassName('com-bub')[0].style.display = "none";
                document.getElementsByClassName('tw-box')[0].style.display = "none";
                document.getElementsByClassName('fb-box')[0].style.display = "none";
                document.getElementsByClassName('email-box')[0].style.display = "none";
                document.getElementsByClassName('save-box')[0].style.display = "none";
                document.getElementsByClassName('tr-can')[0].style.display = "block";
                document.getElementsByClassName('callout-container')[0].setAttribute("class", "callout-container edit");
                break;
        }
    }
}

function getOffset(el) {
    el = el.getBoundingClientRect();
    return {
        left: el.left + window.parent.scrollX,
        top: el.top + window.parent.scrollY
    }
}

var isPubPage;
var callout_left;
var callout_right;
var callout_top;
var callout_top_val;

window.addEventListener("message", receiveMessage, false);

window.parent.document.addEventListener("pageLoadReady", function () {
    isPubPage = (window.parent.document.getElementsByClassName('lannit-published-page')[0] ? true : false);

    if (isPubPage) {
        document.getElementById('calloutBox').setAttribute("class", "post");

        // Check on wheter the post is being displayed from within our app
        if (typeof is_source_app !== "undefined") {
            // Displayed in app
            document.getElementById('calloutBox').setAttribute("class", "post");
            document.getElementsByClassName('sh-box')[0].setAttribute("class", "marker sh-box last");
        } else {
            // Dismiss callout
            setTimeout(function () {
                document.getElementsByClassName('close-btn-child')[0].click();
            }, 10)

            // Displayed off app, likely on a desktop/mobile browser
            document.getElementById('calloutBox').setAttribute("class", "post off-app");

            // Insert virality bar into web view
            var nonUser = getUrlParam('non-user') || '1';

            try {
                var src = window.parent.document.getElementsByTagName('meta')['share_src'].content;
            } catch (err) {
                var src = "saved";
            }


            var div = document.createElement('div');
            div.id = "vir-bar";
            /*div.innerHTML = 
                `<div class="vir-bar-cnt"><div class="img-cnt"><img src="" alt="" /></div><div class="text-cnt">Hivelighter is the best way to highlight, share and find great content -- faster. <a href="https://www.hivelighter.com?non-user=${nonUser}&src=${src}" target="_blank">Get hivelighter</a></div></div>`;*/
            div.innerHTML =
                `<div class="vir-bar-main-cnt" onclick="$('#vir-bar').toggleClass('minimize');"><button class="min-bar"><span></span><span></span></button><div class="vir-bar-cnt"><div class="img-cnt"><div class="logo"></div></div><div class="text-hidden-cnt"><p>Get hivelighter</p></div><div class="text-cnt"><p>Hivelighter is the best way to highlight, share and find great content -- faster.</p><a href="https://testflight.apple.com/join/JTzi4Okk" target="_blank" onclick="ga('send', 'pageview', '/getapp?non-user=1&src=${src}'); ga('send', { hitType: 'event', eventCategory: 'Acquisition', eventAction: 'Clicked Get Hivelighter', eventLabel: 'Full Article Post' })">Get the app</a></div></div></div>`;
            window.parent.document.body.appendChild(div);
            window.parent.document.getElementsByClassName('lannit-published-page')[0].setAttribute("style", "padding-bottom: 80px !important;")


        }
        // ...

        document.getElementsByClassName('email-box')[0].setAttribute("class", "marker email-box last");
        document.getElementsByClassName('close-btn-child')[0].setAttribute("onclick", "broadcastCalloutEvent('putaway'); return false;");

        var hgt_offset_X = getOffset(window.parent.document.getElementsByClassName('ans_hi')[0]).left;
        var hgt_offset_Y = getOffset(window.parent.document.getElementsByClassName('ans_hi')[0]).top - 50;
        var style_str = window.parent.document.getElementById('calloutFrame').getAttribute("style");

        style_str = style_str.replace(/.*(?=display)/i, "");
        window.parent.document.getElementById('calloutFrame').setAttribute("style", "top: " + hgt_offset_Y + "px !important; left: " + hgt_offset_X + "px !important; " + style_str);


        window.parent.document.getElementsByClassName('ans_hi')[0].onclick = function () {
            if (window.parent.document.getElementById('calloutFrame').style.position == "fixed") {
                broadcastCalloutEvent('putback');
            }
        };

    }

    window.parent.onresize = function () {
        if (window.parent.document.getElementById('calloutFrame').style.position !== "fixed") {
            if (window.parent.document.getElementsByClassName('ans_hi').length == 0) {
                return
            }
            var hgt_offset_X = getOffset(window.parent.document.getElementsByClassName('ans_hi')[0]).left;
            var hgt_offset_Y = getOffset(window.parent.document.getElementsByClassName('ans_hi')[0]).top - 50;
            var style_str = window.parent.document.getElementById('calloutFrame').getAttribute("style");

            style_str = style_str.replace(/.*(?=display)/i, "");
            window.parent.document.getElementById('calloutFrame').setAttribute("style", "top: " + hgt_offset_Y + "px !important; left: " + hgt_offset_X + "px !important; " + style_str);
        }
    }

    /* Callout touch events */
    if (document.getElementsByClassName('close-btn')[0]) {
        document.getElementsByClassName('close-btn')[0].onclick = () =>  
        { 
            broadcastCalloutEvent('close'); 
            return false; 
        } 
        document.getElementsByClassName('close-btn')[0].ontouchstart = function () {
            document.getElementsByClassName('close-btn')[0].classList.add('hover');
        };
        document.getElementsByClassName('close-btn')[0].ontouchend = function () {
            document.getElementsByClassName('close-btn')[0].classList.remove('hover');
        };
    }

    if (document.getElementsByClassName('clip-box')[0]) {
        document.getElementsByClassName('clip-box')[0].onclick = () =>  
        { 
            broadcastCalloutEvent('clipboard'); 
            return false; 
        } 
        document.getElementsByClassName('clip-box')[0].ontouchstart = function () { document.getElementsByClassName('clip-box')[0].classList.add('hover'); };

        document.getElementsByClassName('clip-box')[0].ontouchend = function () { document.getElementsByClassName('clip-box')[0].classList.remove('hover'); };
    }


    if (document.getElementsByClassName('tw-box')[0]) {
        document.getElementsByClassName('sh-box')[0].onclick = () =>  
        { 
            broadcastCalloutEvent('facebook'); 
            return false; 
        } 
        document.getElementsByClassName('sh-box')[0].ontouchstart = function () { document.getElementsByClassName('sh-box')[0].classList.add('hover'); };

        document.getElementsByClassName('sh-box')[0].ontouchend = function () { document.getElementsByClassName('sh-box')[0].classList.remove('hover'); };
    }


    if (document.getElementsByClassName('tw-box')[0]) {
        document.getElementsByClassName('tw-box')[0].onclick = () =>  
        { 
            broadcastCalloutEvent('twitter'); 
            return false; 
        } 
        document.getElementsByClassName('tw-box')[0].ontouchstart = function () { document.getElementsByClassName('tw-box')[0].classList.add('hover'); };

        document.getElementsByClassName('tw-box')[0].ontouchend = function () { document.getElementsByClassName('tw-box')[0].classList.remove('hover'); };
    }

    if (document.getElementsByClassName('fb-box')[0]) {
        document.getElementsByClassName('fb-box')[0].onclick = () =>  
        { 
            broadcastCalloutEvent('facebook'); 
            return false; 
        } 
        document.getElementsByClassName('fb-box')[0].ontouchstart = function () { document.getElementsByClassName('fb-box')[0].classList.add('hover'); };

        document.getElementsByClassName('fb-box')[0].ontouchend = function () { document.getElementsByClassName('fb-box')[0].classList.remove('hover'); };
    }

    if (document.getElementsByClassName('email-box')[0]) {
        document.getElementsByClassName('email-box')[0].onclick = () =>  
        { 
            broadcastCalloutEvent('email'); 
            return false; 
        } 
        document.getElementsByClassName('email-box')[0].ontouchstart = function () { document.getElementsByClassName('email-box')[0].classList.add('hover'); };

        document.getElementsByClassName('email-box')[0].ontouchend = function () { document.getElementsByClassName('email-box')[0].classList.remove('hover'); };
    }

    if (document.getElementsByClassName('save-box')[0]) {

        document.getElementsByClassName('save-box')[0].onclick = () =>  
        { 
            broadcastCalloutEvent('save'); 
            return false; 
        } 

        document.getElementsByClassName('save-box')[0].ontouchstart = function () { document.getElementsByClassName('save-box')[0].classList.add('hover'); };

        document.getElementsByClassName('save-box')[0].ontouchend = function () { document.getElementsByClassName('save-box')[0].classList.remove('hover'); };
    }


});


