// load toolset once loadReady event is called

// ToolsetVars -> toolsConfig.js

window.user_options = {}

var ToolSetManager = function() {};

ToolSetManager.prototype = {
    run: () => {
        // JSON stringify
        var str = JSON.stringify(ToolsetVars)

        // convert to base64
        var b64 = btoa(str)
 
        // load toolsets
        loadToolset(b64)
    }
}

var toolSetManager = new ToolSetManager()

// on load event, start toolSet loader
document.addEventListener('loadReady', (event) => {
    toolSetManager.run()
})