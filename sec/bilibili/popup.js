document.getElementById('toggleBtn').onclick = handle_btn_click;


function handle_btn_click() {
    chrome.runtime.sendMessage({type: "toggle_ext"}, function(response) {
        var error = chrome.runtime.lastError;
    });
}