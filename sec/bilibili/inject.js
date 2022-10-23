chrome.extension.sendMessage({}, function(o) {
    var videoData = {
        videoSettings: {
            speed: 1.0,
            speedStep: 0.5,
            displayOption: 'FadeInFadeOut',
            saveSpeed: false
        }
    }
    var interval;
    chrome.storage.sync.get(videoData.videoSettings, function(saved) {
        videoData.videoSettings.speed = Number(saved.speed);
        videoData.videoSettings.speedStep = Number(saved.speedStep);
        videoData.videoSettings.displayOption = saved.displayOption;
        videoData.videoSettings.saveSpeed = Boolean(saved.saveSpeed);
        interval = setInterval(insertVideoSpeed, 10);
    });

    function insertVideoSpeed() {
        $(document).ready(function() {
            clearInterval(interval);
            if (document.getElementById("PlayBackRatePanel")) {
                var youtubeVideo = document.getElementsByTagName('video');
                youtubeVideo.forEach = Array.prototype.forEach;
                youtubeVideo.forEach(function(value) {
                    if (!value.classList.contains('vc-cancelled')) {
                        value.playbackRate = 1;
                    }
                });
                document.getElementById("PlayBackRatePanel").remove();

            } else {
                videoData.videoManager = function(videoR) {
                    this.video = videoR;
                    if (!videoData.videoSettings.saveSpeed) {
                        videoData.videoSettings.speed = 1.0;
                    }
                    this.initializeControls();
                    videoR.addEventListener('play', function(value) {
                        videoR.playbackRate = videoData.videoSettings.speed;
                    });
                    videoR.addEventListener('ratechange', function(value) {
                        if (videoR.readyState === 0) {
                            return;
                        }
                        var currentSpeed = this.getCurrentSpeed();
                        this.speedIndicator.textContent = currentSpeed;
                        videoData.videoSettings.speed = currentSpeed;
                        chrome.storage.sync.set({
                            'speed': currentSpeed
                        });
                    }.bind(this));
                    videoR.playbackRate = videoData.videoSettings.speed;
                };
    
                videoData.videoManager.prototype.getCurrentSpeed = function() {
                    return parseFloat(this.video.playbackRate).toFixed(2);
                };
    
                videoData.videoManager.prototype.remove = function() {
                    this.parentElement.removeChild(this);
                };
    
                videoData.videoManager.prototype.initializeControls = function() {
                    var fragment = document.createDocumentFragment();
    
                    var playBackRatePanel = document.createElement('div');
                    playBackRatePanel.setAttribute("id", "PlayBackRatePanel");
                    playBackRatePanel.className = "PlayBackRatePanel";
    
                    var playBackRate = document.createElement('button');
                    playBackRate.setAttribute("id", "PlayBackRate");
                    playBackRate.className = "btn";
                    //增加input
                    var playBackRate_input = document.createElement('input');
                    playBackRate_input.setAttribute("id", "In_value");
                    playBackRate_input.className = "inpt";
                    //增加确定按钮
                    var sureButton = document.createElement('button');
                    sureButton.className = "btn btn-universal";
                    sureButton.textContent = '完成';
                    
                    var speedDownButton = document.createElement('button');
                    speedDownButton.setAttribute("id", "SpeedDown");
                    speedDownButton.className = "btn btn-left";
                    speedDownButton.textContent = '<<';
    
                    var speedUpButton = document.createElement('button');
                    speedUpButton.setAttribute("id", "SpeedUp");
                    speedUpButton.className = "btn btn-right";
                    speedUpButton.textContent = '>>';
                
                    var closeButton = document.createElement('button');
                    closeButton.className = "btn btn-universal";
                    closeButton.textContent = '✖';
    
                    if (videoData.videoSettings.displayOption == 'None') {
                        playBackRatePanel.style.display = "none";
                    } else if (videoData.videoSettings.displayOption == 'Always') {
                        playBackRatePanel.style.display = "inline";
                    } else if (videoData.videoSettings.displayOption == 'Simple') {
                        playBackRatePanel.style.display = "inline";
                        speedUpButton.style.display = "none";
                        speedDownButton.style.display = "none";
                        closeButton.style.display = "none";
                        playBackRate.style.border = "none";
                        playBackRate.style.background = "transparent";
                    } else if (videoData.videoSettings.displayOption == 'FadeInFadeOut') {
                        playBackRatePanel.style.display = "none";
                    } else {
                        playBackRatePanel.style.display = "inline";
                    }

                    //增加input输入框
                    playBackRatePanel.appendChild(playBackRate_input);
                    //增加完成按钮
                    playBackRatePanel.appendChild(sureButton);
                    //playBackRatePanel.appendChild(closeButton);
                    //playBackRatePanel.appendChild(speedUpButton);
                    //playBackRatePanel.appendChild(playBackRate);

                    //playBackRatePanel.appendChild(speedDownButton);
                    fragment.appendChild(playBackRatePanel);
    
                    this.video.parentElement.parentElement.insertBefore(fragment, this.video.parentElement);
                    this.video.parentElement.parentElement.addEventListener("mouseover", mouseOver);
                    this.video.parentElement.parentElement.addEventListener("mouseout", mouseOut);
    
                    var videoSpeed = parseFloat(videoData.videoSettings.speed).toFixed(2);
                    playBackRate.textContent = videoSpeed;
                    this.speedIndicator = playBackRate;
    
                    playBackRatePanel.addEventListener('click', function(value) {
                        if (value.target === speedDownButton) {
                            handleClick('slower');
                        } else if (value.target === speedUpButton) {
                            handleClick('faster');
                        } else if (value.target === playBackRate) {
                            handleClick('reset');
                        } else if (value.target === closeButton) {
                            handleClick('close');
                        } else if (value.target === sureButton) {
                            handleClick('sure');
                        }
                        value.preventDefault();
                        value.stopPropagation();
                    }, true);
                    playBackRatePanel.addEventListener('dblclick', function(value) {
                        value.preventDefault();
                        value.stopPropagation();
                    }, true);
                };
                
                function mouseOver() {
                    var playBackRatePanel = document.getElementById('PlayBackRatePanel');
                    if (playBackRatePanel) {
                        if (videoData.videoSettings.displayOption == 'FadeInFadeOut') {
                            playBackRatePanel.style.display = "inline";
                        }
                    }
                };
    
                function mouseOut() {
                    var playBackRatePanel = document.getElementById('PlayBackRatePanel');
                    if (playBackRatePanel) {
                        if (videoData.videoSettings.displayOption == 'FadeInFadeOut' && playBackRatePanel.className != "PlayBackRatePanelFullScreen") {
                            playBackRatePanel.style.display = "none";
                        }
                    }
                };
    
                function updatePlaybackRate(controller, rate) {
                    controller.playbackRate = rate;
                };
    
                function handleClick(type) {
                    var youtubeVideo = document.getElementsByTagName('video');
                    youtubeVideo.forEach = Array.prototype.forEach;
                    youtubeVideo.forEach(function(value) {
                        if (!value.classList.contains('vc-cancelled')) {
                            if (type === 'faster') {
                                var finalSpeed = Math.min(value.playbackRate + videoData.videoSettings.speedStep, 16);
                                updatePlaybackRate(value, finalSpeed);
                            } else if (type === 'slower') {
                                var finalSpeed = Math.max(value.playbackRate -  videoData.videoSettings.speedStep, 0);
                                updatePlaybackRate(value, finalSpeed);
                            } else if (type === 'reset') {
                                var finalSpeed = Math.max(1, 0);
                                updatePlaybackRate(value, finalSpeed);
                            } else if (type === 'sure') {//增加 获取输入倍速值 2022年10月16日
                                var finalSpeed = document.getElementById('In_value').value;
                                updatePlaybackRate(value, finalSpeed);
                            } else if (type === 'close') {
                                var youtubeVideo = document.getElementsByTagName('video');
                                youtubeVideo.forEach = Array.prototype.forEach;
                                youtubeVideo.forEach(function(value) {
                                    if (!value.classList.contains('vc-cancelled')) {
                                        value.playbackRate = 1;
                                    }
                                });
                                document.getElementById("PlayBackRatePanel").remove();
                                return;
                            }
                        }
                    });
                    var playBackRatePanel = document.getElementById('PlayBackRatePanel');
                    if (playBackRatePanel) {
                        var playBackRatePanelDisplay = playBackRatePanel.style.display;
                        if (playBackRatePanelDisplay === "none") {
                            playBackRatePanel.style.display = "inline";
                            setTimeout(function() {
                                playBackRatePanel.style.display = playBackRatePanelDisplay;
                            }, 300);
                        }
                    }
                };
    
                document.addEventListener('DOMNodeInserted', function(target) {
                    var node = target.target || null;
                    if (node && node.nodeName === 'VIDEO') {
                        new videoData.videoManager(node);
                    }
                });
    
                document.addEventListener("webkitfullscreenchange", function() {
                    var playBackRatePanel = document.getElementById('PlayBackRatePanel');
                    if (playBackRatePanel) {
                        if (document.webkitIsFullScreen == true) {
                            playBackRatePanel.className = "PlayBackRatePanelFullScreen";
                        } else {
                            playBackRatePanel.className = "PlayBackRatePanel";
                        }
                    }
                }, false);
                var videoTag = document.getElementsByTagName('video');
                videoTag.forEach = Array.prototype.forEach;
                videoTag.forEach(function(playBackRatePanel) {
                    var VM = new videoData.videoManager(playBackRatePanel);
                });
            }
        });
    }
});