var MIXPANEL_CUSTOM_LIB_URL="mixpanel-2-latest.min.js";
(function(c,a){if(!a.__SV){var b=window;try{var d,m,j,k=b.location,f=k.hash;d=function(a,b){return(m=a.match(RegExp(b+"=([^&]*)")))?m[1]:null};f&&d(f,"state")&&(j=JSON.parse(decodeURIComponent(d(f,"state"))),"mpeditor"===j.action&&(b.sessionStorage.setItem("_mpcehash",f),history.replaceState(j.desiredHash||"",c.title,k.pathname+k.search)))}catch(n){}var l,h;window.mixpanel=a;a._i=[];a.init=function(b,d,g){function c(b,i){var a=i.split(".");2==a.length&&(b=b[a[0]],i=a[1]);b[i]=function(){b.push([i].concat(Array.prototype.slice.call(arguments,
    0)))}}var e=a;"undefined"!==typeof g?e=a[g]=[]:g="mixpanel";e.people=e.people||[];e.toString=function(b){var a="mixpanel";"mixpanel"!==g&&(a+="."+g);b||(a+=" (stub)");return a};e.people.toString=function(){return e.toString(1)+".people (stub)"};l="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");
    for(h=0;h<l.length;h++)c(e,l[h]);var f="set set_once union unset remove delete".split(" ");e.get_group=function(){function a(c){b[c]=function(){call2_args=arguments;call2=[c].concat(Array.prototype.slice.call(call2_args,0));e.push([d,call2])}}for(var b={},d=["get_group"].concat(Array.prototype.slice.call(arguments,0)),c=0;c<f.length;c++)a(f[c]);return b};a._i.push([b,d,g])};a.__SV=1.2;b=c.createElement("script");b.type="text/javascript";b.async=!0;b.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?
    MIXPANEL_CUSTOM_LIB_URL:"file:"==="https:"&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";d=c.getElementsByTagName("script")[0];d.parentNode.insertBefore(b,d)}})(document,window.mixpanel||[]);

mixpanel.init(ToolsetVars.mixPanel, {
    api_host: "https://hivelighter.com",
    loaded: function (mixpanel) {
        chrome.storage.sync.get(['mixPanelID'],function (data) {
            if (data.mixPanelID) {
                // initialize this extension with user's server-side distinctID
                mixpanel.identify(data.mixPanelID)
            }
        })
    }
});

// ...
var loggs = []

window.addEventListener('load',(event) => {
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
        if (tabs[0].url.startsWith("http")) {
            chrome.tabs.executeScript(null, {
                file: 'contentscript.js',
            }, () => {
                loadPopup()
            });
        } else {
            // we need to show the appropriate pop-up content if we're on a chrome:// url
            chrome.storage.sync.get(['hiveToken', 'hiveUserId'], function (value) {
                let token = value.hiveToken;
                let userId = value.hiveUserId;
                if (token != null && userId != null) {
                    document.getElementById("credential-content").innerHTML = "You are logged in! Hivelight Now";
                } else {
                    document.getElementById("credential-content").style.display = "block";
                }
            })
        }
    });
});

function loadPopup() {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        window.chromeSrcURL = tabs[0].url
        chrome.storage.sync.get(['hiveToken', 'hiveUserId'], function (value) {
            let token = value.hiveToken;
            let userId = value.hiveUserId;
            if (token != null && userId != null) {
                console.log("token", token);
                console.log("userId", userId);
                chrome.tabs.sendMessage(tabs[0].id, {command: "requestReaderModeData"}, (response) => {
                    console.log(response);
                    if (response != null && response != "") {
                        try {
                            var data = JSON.parse(response);
                            receiveMessageChromeExtension({data: data});
                        } catch (e) {
                            console.log(e.message)
                        }
                    } else {
                        document.getElementById("credential-content").innerHTML = "You are logged in! Hivelight Now";
                    }
                });
            } else {
                document.getElementById("credential-content").style.display = "block";
            }
        });
        ;
    });
}

window.addEventListener("message", receiveMessage, false);
function receiveMessage(event){

    if (event.data == "save") {
        // register the save in mixpanel
        mixpanel.track("Saved Hivelight", {"Product" : "Chrome Extension"})

        var container = document.getElementById('popup');
        // construct a pop message
        $(`
            <div id="myModal" class="modal">
                    <!-- Modal content -->
                <div class="modal-content">
                    <span class="close" id="close-modal">&times;</span>
                    <p>You just saved to hivelighter App!</p>
                    <a href="https://hivelighter.app.link/XD49cWYNs0" target="_blank">Click here to install the App and see it!</a>
                </div>
            </div>
        `).insertAfter(container);

        document.getElementById('close-modal').addEventListener('click',function () {
            document.getElementById('myModal').style.display = 'none';
        })
    }
}






