//# sourceURL=functions.js
/*--------------------------------------------------------------
>>> FUNCTIONS
--------------------------------------------------------------*/
ImprovedTube.childHandler = function (node) {
	/*
	if (!ImprovedTube.nodes) {
		ImprovedTube.nodes = {};
		ImprovedTube.ids = {};
		ImprovedTube.classes = {};
	}
	if (!ImprovedTube.nodes[node.nodeName]) ImprovedTube.nodes[node.nodeName] = 0;
	if (!ImprovedTube.ids[node.id]) ImprovedTube.ids[node.id] = 0;
	if (!ImprovedTube.classes[node.className]) ImprovedTube.classes[node.className] = 0;
	++ImprovedTube.nodes[node.nodeName];
	++ImprovedTube.ids[node.id]
	++ImprovedTube.classes[node.className]
	/*/
	if (ImprovedTube.DOM_filter.has(node.nodeName)) return;
	ImprovedTube.mutated.add(node);

	for (let i = 0, l = node.children.length; i < l; i++) ImprovedTube.childHandler(node.children[i]);
};

ImprovedTube.ytElementsHandler = function (node) {
	++ImprovedTube.perf.elements_handled_name;
	++ImprovedTube.perf.elements_handled_id;
	//++ImprovedTube.perf.elements_handled_class;

	switch (node.nodeName) {
		case 'A':
			if (node.href) {
				ImprovedTube.channelDefaultTab(node);
			}
			if (ImprovedTube.storage.blocklist_activate
				&& ((node.href && node.classList.contains('ytd-thumbnail')) || node.classList.contains('ytd-video-preview'))
				&& !node.querySelector("button.it-add-to-blocklist")) {

				ImprovedTube.blocklistNode(node);
			}
			break

		// FIXME
		case 'YTD-TOGGLE-BUTTON-RENDERER':
			if (node.querySelector('div#tooltip')?.innerText.includes('Shuffle playlist')) {
				//button.click()
				ImprovedTube.playlistShuffle(node);
			}
			break

		// FIXME
		case 'YTD-PLAYLIST-LOOP-BUTTON-RENDERER':
			if (node.querySelector('div#tooltip')?.innerText.includes('Loop playlist')) {
				//button aria-label="Loop playlist"
				//aria-label="Loop video"
				//aria-label="Turn off loop"
				ImprovedTube.playlistReverse(node);
			}
			/*
			//can be precise   previously  node.parentComponent  & node.parentComponent.parentComponent
			if (node.closest("YTD-MENU-RENDERER") && node.closest("YTD-PLAYLIST-PANEL-RENDERER")) {
				var index = Array.prototype.indexOf.call(node.parentNode.children, node);
				if (index === 0) {
					if (this.storage.playlist_reverse === true) {
						//can be precise:
						try{this.elements.playlist.actions = node.parentNode.parentNode.parentNode.parentNode;}
						catch{try{this.elements.playlist.actions = node.parentNode.parentNode.parentNode;}
							  catch{try{this.elements.playlist.actions = node.parentNode.parentNode;}
									catch{try{this.elements.playlist.actions = node.parentNode;}
										  catch{try{this.elements.playlist.actions = node;}catch{}}
										 }
								   }
							 }
					}
					this.playlistReverse();
				} else if (index === 1) {
					this.elements.playlist.shuffle_button = node;

					this.playlistShuffle();

					if (this.storage.playlist_reverse === true) {
						//can be precise:
						try{this.elements.playlist.actions = node.parentNode.parentNode.parentNode.parentNode;}
						catch{try{this.elements.playlist.actions = node.parentNode.parentNode.parentNode;}
							  catch{try{this.elements.playlist.actions = node.parentNode.parentNode;}
									catch{try{this.elements.playlist.actions = node.parentNode;}
										  catch{try{this.elements.playlist.actions = node;}catch{}}
										 }
								   }
							 }
					}
					this.playlistReverse();
				}
			}
			this.playlistPopup();
		*/
			break

		case 'YTD-GUIDE-SECTION-RENDERER':
			if (ImprovedTube.elements.sidebar_section) break;
			ImprovedTube.elements.sidebar_section = node;

			ImprovedTube.youtubeIcon();
			break

		case 'YTD-VIDEO-PRIMARY-INFO-RENDERER':
			ImprovedTube.elements.video_title = node.querySelector('.title.ytd-video-primary-info-renderer');

			ImprovedTube.youtubeIcon();
			ImprovedTube.buttonsUnderPlayer();
			break

		// FIXME
		case 'YTD-MENU-RENDERER':
			if (!node.classList.contains('ytd-playlist-panel-renderer')) return;
			/* FALLTHROUGH */
		case 'YTD-PLAYLIST-HEADER-RENDERER':
			ImprovedTube.playlistPopup();
			break

		case 'YTD-BUTTON-RENDERER':
			if (!node.classList.contains('ytd-c4-tabbed-header-renderer')) break;
			/* FALLTHROUGH */
		case 'YTD-SUBSCRIBE-BUTTON-RENDERER':
		case 'YT-SUBSCRIBE-BUTTON-VIEW-MODEL':
			ImprovedTube.blocklistChannel(node);
			ImprovedTube.elements.subscribe_button = node;
			break

		case 'YTD-PLAYER':
			ImprovedTube.elements.ytd_player = node;
			break

		// FIXME
		case 'YTD-WATCH-FLEXY':
			ImprovedTube.elements.ytd_watch = node;
			if (ImprovedTube.isset(ImprovedTube.storage.player_size)
				&& ImprovedTube.storage.player_size !== 'do_not_change') {

				node.calculateCurrentPlayerSize_ = function () {
					if (!ImprovedTube.theater && ImprovedTube.elements.player) {
						if (ImprovedTube.updateStyles) {
							ImprovedTube.updateStyles({
								'--ytd-watch-flexy-width-ratio': 1,
								'--ytd-watch-flexy-height-ratio': 0.5625
							});

							ImprovedTube.updateStyles({
								'--ytd-watch-width-ratio': 1,
								'--ytd-watch-height-ratio': 0.5625
							});
						}

						return {width: ImprovedTube.elements.player.offsetWidth,
							height: Math.round(ImprovedTube.elements.player.offsetWidth / (16 / 9))
						};
					}

					return {width: NaN, // ??
						height: NaN
					};
				};

				node.calculateNormalPlayerSize_ = node.calculateCurrentPlayerSize_; // ??
			}
			break

		default:
			--ImprovedTube.perf.elements_handled_name;
			break
	}
	switch (node.id) {
		case 'description-inline-expander':
			ImprovedTube.description(node);
			break

		case 'description-inner':
			ImprovedTube.dayOfWeek(node);
			break

		case 'chat-messages':
			ImprovedTube.elements.livechat.button = document.querySelector('[aria-label="Close"]');
			ImprovedTube.livechat();
			break

		// FIXME
		case 'movie_player':
			if (ImprovedTube.elements.player) break;
			ImprovedTube.elements.player = node;
			ImprovedTube.elements.video = node.querySelector('video');
			ImprovedTube.elements.player_left_controls = node.querySelector('.ytp-left-controls');
			ImprovedTube.elements.player_right_controls = node.querySelector('.ytp-right-controls');
			ImprovedTube.elements.player_thumbnail = node.querySelector('.ytp-cued-thumbnail-overlay-image');
			ImprovedTube.elements.player_subtitles_button = node.querySelector('.ytp-subtitles-button');
			ImprovedTube.playerSize();
			if (typeof ImprovedTube.storage.ads !== 'undefined' && ImprovedTube.storage.ads !== "all_videos") {
				new MutationObserver(function (mutationList) {
					for (var i = 0, l = mutationList.length; i < l; i++) {
						var mutation = mutationList[i];

						if (mutation.type === 'childList') {
							for (var j = 0, k = mutation.addedNodes.length; j < k; j++) {
								var node = mutation.addedNodes[j];

								if (node instanceof Element
									&& node.querySelector('ytp-ad-player-overlay, .ytp-ad-text, .ytp-ad-overlay-close-container, ytd-button-renderer#dismiss-button, *[id^="ad-text"], *[id^="skip-button"], .ytp-ad-skip-button.ytp-button, .ytp-ad-skip-button-modern.ytp-button') !== null) {
									ImprovedTube.playerAds(node);
								}
							}
						}
						if (mutation.type === 'attributes' && mutation.attributeName === 'id' && mutation.target.querySelector('*[id^="ad-text"], *[id^="skip-button"], .ytp-ad-skip-button-modern.ytp-button',)) {
							ImprovedTube.playerAds(node);
						}
					}
				}).observe(node, {childList: true, // attributes: true,
								  subtree: true
								 });
			}

			new MutationObserver(function (mutationList) {
				for (var i = 0, l = mutationList.length; i < l; i++) {
					var mutation = mutationList[i];

					if (mutation.type === 'attributes') {
						if (mutation.attributeName === 'style') {
							ImprovedTube.playerHdThumbnail();
						}
					}
				}
			}).observe(ImprovedTube.elements.player_thumbnail, {
				attributes: true,
				attributeFilter: ['style'],
				childList: false,
				subtree: false
			});
			break

		// FIXME
		case 'panels':
			if (document.documentElement.dataset.pageType === 'video') {
				setTimeout(function () {
					ImprovedTube.transcript(node);
					ImprovedTube.chapters(node);
				}, 200);
			}
			break

		default:
			--ImprovedTube.perf.elements_handled_id;
			break
	}
/*	switch(node.className) {
		case '':
			break

		default:
			--ImprovedTube.perf.elements_handled_class;
			break
	}*/
};

ImprovedTube.pageType = function () {
	if (location.pathname === '/watch') {
		document.documentElement.dataset.pageType = 'video';
	} else if (location.pathname === '/') {
		document.documentElement.dataset.pageType = 'home';
	} else if (location.pathname === '/subscriptions') {
		document.documentElement.dataset.pageType = 'subscriptions';
	} else if (ImprovedTube.regex.channel.test(location.pathname)) {
		document.documentElement.dataset.pageType = 'channel';
	} else {
		document.documentElement.dataset.pageType = 'other';
	}
};

ImprovedTube.pageOnFocus = function () {
	ImprovedTube.playerAutopauseWhenSwitchingTabs();
	ImprovedTube.playerAutoPip();
	ImprovedTube.playerQualityWithoutFocus();
};

ImprovedTube.videoPageUpdate = function () {
	if (document.documentElement.dataset.pageType === 'video') {
		var video_id = this.getParam(new URL(location.href).search.substr(1), 'v');

		if (this.storage.track_watched_videos === true && video_id) {
			ImprovedTube.messageSend({action: 'watched',
				type: 'add',
				id: video_id,
				title: document.title
									   });
		}

		this.initialVideoUpdateDone = true;

		ImprovedTube.howLongAgoTheVideoWasUploaded();
		ImprovedTube.channelVideosCount();
		ImprovedTube.upNextAutoplay();
		ImprovedTube.playerAutofullscreen();
		ImprovedTube.playerSize();
		if (this.storage.player_always_repeat === true) ImprovedTube.playerRepeat();
		ImprovedTube.playerScreenshotButton();
		ImprovedTube.playerRepeatButton();
		ImprovedTube.playerRotateButton();
		ImprovedTube.playerPopupButton();
		ImprovedTube.playerFitToWinButton();
		ImprovedTube.playerCinemaModeButton();
		ImprovedTube.playerHamburgerButton();
		ImprovedTube.playerHideControls();
	}
};

ImprovedTube.playerOnPlay = function () {
	document.addEventListener('pause', function () {
		console.log('document.pause');
	}, true);

	HTMLMediaElement.prototype.pause = (function (original) {
		return function () {
			console.log('pause');
			return original.apply(this, arguments);
		}
	})(HTMLMediaElement.prototype.pause);

	HTMLMediaElement.prototype.play = (function (original) {
		return function () {
			if (!this.closest('#inline-preview-player')) {
				console.log('HTMLMediaElement.prototype.play');
				this.removeEventListener('loadedmetadata', ImprovedTube.playerOnLoadedMetadata);
				this.addEventListener('loadedmetadata', ImprovedTube.playerOnLoadedMetadata);

				this.removeEventListener('timeupdate', ImprovedTube.playerOnTimeUpdate);
				this.addEventListener('timeupdate', ImprovedTube.playerOnTimeUpdate);

				this.removeEventListener('pause', ImprovedTube.playerOnPause, true);
				this.addEventListener('pause', ImprovedTube.playerOnPause, true);
				this.onpause = (event) => {
					console.log('this.onpause', event);
				};
				this.removeEventListener('ended', ImprovedTube.playerOnEnded, true);
				this.addEventListener('ended', ImprovedTube.playerOnEnded, true);

				//ImprovedTube.forcedPlayVideoFromTheBeginning(this);
				ImprovedTube.autoplayDisable(this);
				ImprovedTube.playerLoudnessNormalization();
				ImprovedTube.playerAutoCinemaMode();
			}
			return original.apply(this, arguments);
		}
	})(HTMLMediaElement.prototype.play);
};

ImprovedTube.initPlayer = function () {
	if (ImprovedTube.elements.player && ImprovedTube.video_url !== location.href) {
		ImprovedTube.video_url = location.href;
		ImprovedTube.user_interacted = false;
		ImprovedTube.played_before_blur = false;

		delete ImprovedTube.elements.player.dataset.defaultQuality;

		//ImprovedTube.forcedPlayVideoFromTheBeginning();
		ImprovedTube.playerPlaybackSpeed();
		ImprovedTube.playerSubtitles();
		ImprovedTube.subtitlesLanguage();
		ImprovedTube.subtitlesUserSettings();
		ImprovedTube.subtitlesDisableLyrics();
		ImprovedTube.playerQuality();
		ImprovedTube.batteryFeatures();
		ImprovedTube.playerForcedVolume();
		if (this.storage.player_always_repeat === true) ImprovedTube.playerRepeat();
		ImprovedTube.playerScreenshotButton();
		ImprovedTube.playerRepeatButton();
		ImprovedTube.playerRotateButton();
		ImprovedTube.playerPopupButton();
		ImprovedTube.playerFitToWinButton();
		ImprovedTube.playerHamburgerButton();
		ImprovedTube.playerHideControls();
		setTimeout(function () {
			ImprovedTube.forcedTheaterMode();
		}, 150);
		if (location.href.indexOf('/embed/') === -1) {
			ImprovedTube.miniPlayer();
		}
	}
};

var timeUpdateInterval = null;
var noTimeUpdate = null;

ImprovedTube.playerOnTimeUpdate = function () {
	if (!timeUpdateInterval) {
		timeUpdateInterval = setInterval(function () {
			if (ImprovedTube.video_src !== this.src) {
				ImprovedTube.video_src = this.src;

				if (ImprovedTube.initialVideoUpdateDone !== true) {
					ImprovedTube.playerQuality();
				}
			} else if (ImprovedTube.latestVideoDuration !== this.duration) {
				ImprovedTube.latestVideoDuration = this.duration;

				ImprovedTube.playerQuality();
			}

			if (ImprovedTube.storage.always_show_progress_bar === true) ImprovedTube.showProgressBar();
			if (ImprovedTube.storage.player_remaining_duration === true) ImprovedTube.playerRemainingDuration();
			ImprovedTube.played_time += .5;
		}, 500);
	}
	clearInterval(noTimeUpdate);
	noTimeUpdate = setTimeout(function () {
			 clearInterval(timeUpdateInterval);
		timeUpdateInterval = null;
	}, 987);
};

ImprovedTube.playerOnLoadedMetadata = function () {
	setTimeout(function () {ImprovedTube.playerSize();}, 100);
};

ImprovedTube.playerOnPause = function () {
	ImprovedTube.playlistUpNextAutoplay();

	if (ImprovedTube.elements.yt_channel_name) {
		ImprovedTube.messageSend({
			action: 'analyzer',
			name: ImprovedTube.elements.yt_channel_name.__dataHost.tooltipText,
			time: ImprovedTube.played_time
		});
	}
	ImprovedTube.played_time = 0;
	ImprovedTube.playerHideControls();
	ImprovedTube.playerAutoCinemaMode(true);
};

ImprovedTube.playerOnEnded = function (event) {
	ImprovedTube.playlistUpNextAutoplay();
	ImprovedTube.upNextAutoplay(event);

	ImprovedTube.messageSend({
		action: 'analyzer',
		name: ImprovedTube.elements.yt_channel_name.__dataHost.tooltipText,
		time: ImprovedTube.played_time
	});

	ImprovedTube.played_time = 0;
};

ImprovedTube.onkeydown = function () {
	ImprovedTube.pauseWhileTypingOnYoutube()
	window.addEventListener('keydown', function () {
		ImprovedTube.user_interacted = true;
	}, true);
};

ImprovedTube.onmousedown = function () {
	window.addEventListener('mousedown', function () {
		ImprovedTube.user_interacted = true;
	}, true);
};

ImprovedTube.hasParam = function (name) {
	return new URLSearchParams(location.search).has(name);
};

ImprovedTube.hasParams = function (names) {
	const params = new URLSearchParams(location.search);
	for (const name of names) {
		if (params.has(name)) {
			return true;
		}
	}
	return false;
};

ImprovedTube.getParam = function (query, name) {
	var params = query.split('&'),
		param = false;

	for (var i = 0; i < params.length; i++) {
		params[i] = params[i].split('=');

		if (params[i][0] == name) {
			param = params[i][1];
		}
	}

	if (param) {
		return param;
	} else {
		return false;
	}
};

ImprovedTube.getParams = function (query) {
	var params = query.split('&'),
		result = {};

	for (var i = 0, l = params.length; i < l; i++) {
		params[i] = params[i].split('=');

		result[params[i][0]] = params[i][1];
	}

	return result;
};

ImprovedTube.getCookieValueByName = function (name) {
	var match = document.cookie.match(new RegExp('([; ]' + name + '|^' + name + ')([^\\s;]*)', 'g'));

	if (match) {
		var cookie = match[0];

		return cookie.replace(name + '=', '').replace(' ', '');
	} else return '';
};

ImprovedTube.getPrefCookieValueByName = function (name) {
	let prefs = this.getParams(this.getCookieValueByName('PREF'));
	return prefs[name];
};

// set PREF cookie name=value or delete name if value == null
ImprovedTube.setPrefCookieValueByName = function (name, value) {
	let originalPref = this.getCookieValueByName('PREF');
	let prefs = this.getParams(originalPref);
	let newPrefs = '';
	let ampersant = '';

	if (name == 'f6' && prefs[name] & 1) {
		// f6 holds other settings, possible values 80000 80001 400 401 1 none
		// make sure we remember 1 bit
		prefs[name] = value | 1;
	} else {
		prefs[name] = value;
	}

	for (let pref in prefs) {
		if (prefs[pref]) {
			newPrefs += ampersant + pref + '=' + prefs[pref];
			ampersant = '&';
		}
	}
	// only write cookie if its different from the old one
	if (originalPref != newPrefs) {
		this.setCookie('PREF', newPrefs);
	}
};

ImprovedTube.setCookie = function (name, value) {
	var date = new Date();

	date.setTime(date.getTime() + 3.154e+10);

	document.cookie = name + '=' + value + '; path=/; domain=.youtube.com; expires=' + date.toGMTString();
};

ImprovedTube.createIconButton = function (options) {
	const button = options.href ? document.createElement('a') : document.createElement('button'),
		svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
		path = document.createElementNS('http://www.w3.org/2000/svg', 'path'),
		type = this.button_icons[options.type];

	for (const attr of type.svg) svg.setAttribute(attr[0], attr[1]);
	if (type.svgStyle) for (const style of type.svgStyle) svg.style[style[0]] = style[1];
	for (const attr of type.path) path.setAttribute(attr[0], attr[1]);
	if (type.style) for (const style of type.style) button.style[style[0]] = style[1];

	svg.appendChild(path);
	button.appendChild(svg);

	if (options.dataset) for (const data of options.dataset) button.dataset[data[0]] = data[1];

	if (options.className) button.className = options.className;
	if (options.id) button.id = options.id;
	if (options.title) button.title = options.title;
	if (options.href) button.href = options.href;
	if (options.text) button.appendChild(document.createTextNode(options.text));
	if (options.onclick) {
		if (!options.propagate) {
			//we fully own all click events landing on this button
			button.addEventListener('click', function (event) {
				event.preventDefault();
				event.stopPropagation();
				options.onclick.apply(this, arguments);
			}, true);
		} else {
			button.addEventListener('click', options.onclick, true);
		}
	}
	return button;
};

ImprovedTube.createPlayerButton = function (options) {
	const controls = options.position == "right" ? this.elements.player_right_controls : this.elements.player_left_controls;

	if (!controls) return; // nowhere to attach

	const button = document.createElement('button');

	button.className = 'ytp-button it-player-button';

	button.dataset.title = options.title;

	button.addEventListener('mouseover', function () {
		const tooltip = document.createElement('div'),
			rect = this.getBoundingClientRect();

		tooltip.className = 'it-player-button--tooltip';

		tooltip.style.left = rect.left + rect.width / 2 + 'px';
		tooltip.style.top = rect.top - 8 + 'px';

		tooltip.textContent = this.dataset.title;

		function mouseleave () {
			tooltip.remove();

			this.removeEventListener('mouseleave', mouseleave);
		}

		this.addEventListener('mouseleave', mouseleave);

		document.body.appendChild(tooltip);
	});

	if (options.id) {
		this.elements.buttons[options.id]?.remove();

		button.id = options.id;

		this.elements.buttons[options.id] = button;
	}

	if (options.child) button.appendChild(options.child);

	button.style.opacity = options.opacity || .5;

	if (options.onclick) button.onclick = options.onclick;

	controls.insertBefore(button, controls.childNodes[3]);
};

ImprovedTube.empty = function (element) {
	for (var i = element.childNodes.length - 1; i > -1; i--) {
		element.childNodes[i].remove();
	}
};

ImprovedTube.isset = function (variable) {
	return !(typeof variable === 'undefined' || variable === null || variable === 'null');
};

ImprovedTube.showStatus = function (value) {
	if (!this.elements.status) {
		this.elements.status = document.createElement('div');

		this.elements.status.id = 'it-status';
	}

	if (typeof value === 'number') {
		value = value.toFixed(2);
	}

	this.elements.status.textContent = value;

	if (ImprovedTube.status_timer) {
		clearTimeout(ImprovedTube.status_timer);
	}

	ImprovedTube.status_timer = setTimeout(function () {
		ImprovedTube.elements.status.remove();
	}, 500);

	this.elements.player.appendChild(this.elements.status);
};

ImprovedTube.videoId = function (url = location.search) {
	return url.match(ImprovedTube.regex.video_id)?.[1];
};

ImprovedTube.videoTitle = function () {
	return document.title?.replace(/\s*-\s*YouTube$/, '') || movie_player.getVideoData().title || document.querySelector('#title > h1 > *')?.textContent
};

// Function to extract and store the number of subscribers
ImprovedTube.extractSubscriberCount = function () {
	const subscriberCountNode = document.getElementById('owner-sub-count');

	if (!subscriberCountNode) return 0;

	// Extract the subscriber count and store it for further use
	const subscriberCountText = subscriberCountNode.textContent.trim();
	let subscriberCount = parseFloat(subscriberCountText.replace(/[^0-9.]/g, ''));

	if (subscriberCountText.includes('K')) {
		subscriberCount *= 1000;
	} else if (subscriberCountText.includes('M')) {
		subscriberCount *= 1000000;
	}

	return subscriberCount;
};
