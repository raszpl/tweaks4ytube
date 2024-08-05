/*------------------------------------------------------------------------------
4.7.0 SHORTCUTS

WARNING: Browser Debugger Breakpoint downstream from keydown() event will eat corresponding keyup()
 thus breaking our tracking of ImprovedTube.input.pressed.keys (stuck key) until said Breakpoint
 is disabled and key pressed again OR switching tabs/windows to trigger 'improvedtube-blur'.
 Make sure to have that in mind when debugging.
------------------------------------------------------------------------------*/
ImprovedTube.shortcutsInit = function () {
	if (location.pathname === "/live_chat") return; // no shortcuts in chat iframe
	// those two are _references_ to source Objects, not copies
	const listening = ImprovedTube.input.listening,
		listeners = ImprovedTube.input.listeners;

	// reset 'listening' shortcuts
	for (const key in listening) delete listening[key];
	// extract shortcuts from User Settings and initialize 'listening'
	for (const [name, keys] of Object.entries(this.storage).filter(v => v[0].startsWith('shortcut_'))) {
		if (!keys) continue;
		// camelCase(name)
		const camelName = name.replace(/_(.)/g, (m, l) => l.toUpperCase());
		let potentialShortcut = {};
		for (const button of ['alt', 'ctrl', 'shift', 'wheel', 'keys', 'toggle']) {
			switch (button) {
				case 'alt':
				case 'ctrl':
				case 'shift':
				case 'toggle':
					potentialShortcut[button] = keys[button] || false;
					break

				case 'wheel':
					potentialShortcut[button] = keys[button] || 0;
					break

				case 'keys':
					// set of unique scancodes
					potentialShortcut[button] = keys[button] ? new Set(Object.keys(keys[button]).map(s=>Number(s))) : new Set();
					break
			}
		}
		if (potentialShortcut['keys'].size || potentialShortcut['wheel']) listening[camelName] = potentialShortcut;
	}
	// initialize 'listeners' only if there are actual shortcuts active
	if (Object.keys(listening).length) {
		for (const [name, handler] of Object.entries(this.shortcutsListeners)) {
			// only one listener per handle
			if (!listeners[name]) {
				listeners[name] = true;
				window.addEventListener(name, handler, {passive: false, capture: true});
			}
		}
	} else {
		// no shortcuts means we dont need 'listeners', uninstall all
		for (const [name, handler] of Object.entries(this.shortcutsListeners)) {
			if (listeners[name]) {
				delete listeners[name];
				window.removeEventListener(name, handler, {passive: false, capture: true});
			}
		}
	}
};

ImprovedTube.shortcutsHandler = function () {
	check: for (const [key, shortcut] of Object.entries(ImprovedTube.input.listening)) {
		if (ImprovedTube.input.pressed.keys.size != shortcut.keys.size
			|| ImprovedTube.input.pressed.wheel != shortcut.wheel
			|| ImprovedTube.input.pressed.alt != shortcut.alt
			|| ImprovedTube.input.pressed.ctrl != shortcut.ctrl
			|| ImprovedTube.input.pressed.shift != shortcut.shift) continue;

		for (const pressedKey of ImprovedTube.input.pressed.keys.values()) {
			if (!shortcut.keys.has(pressedKey)) continue check;
		}

		// cancel keydown/wheel event before we call target handler
		// this way crashing handler wont keep 'cancelled' keys stuck
		event.preventDefault();
		event.stopPropagation();
		// build 'cancelled' list so we also cancel keyup events
		for (const pressedKey of ImprovedTube.input.pressed.keys.values()) {
			ImprovedTube.input.cancelled.add(pressedKey);
		}

		if (key.startsWith('shortcutQuality')) {
			ImprovedTube['shortcutQuality'](key);
		} else if (typeof ImprovedTube[key] === 'function') {
			ImprovedTube[key]();
		}
	}
};

ImprovedTube.shortcutsListeners = {
	keydown: function (event) {
		ImprovedTube.user_interacted = true;
		// no shortcuts over 'ignoreElements'
		if ((document.activeElement && ImprovedTube.input.ignoreElements.includes(document.activeElement.tagName)) || event.target.isContentEditable) return;

		if (!ImprovedTube.input.modifierKeys.includes(event.code)) {
			ImprovedTube.input.pressed.keys.add(event.keyCode);
		}
		ImprovedTube.input.pressed.wheel = 0;
		ImprovedTube.input.pressed.alt = event.altKey;
		ImprovedTube.input.pressed.ctrl = event.ctrlKey;
		ImprovedTube.input.pressed.shift = event.shiftKey;

		ImprovedTube.shortcutsHandler();
	},
	keyup: function (event) {
		ImprovedTube.input.pressed.keys.delete(event.keyCode);
		ImprovedTube.input.pressed.wheel = 0;
		ImprovedTube.input.pressed.alt = event.altKey;
		ImprovedTube.input.pressed.ctrl = event.ctrlKey;
		ImprovedTube.input.pressed.shift = event.shiftKey;

		// cancel keyup events corresponding to keys that triggered one of our shortcuts
		if (ImprovedTube.input.cancelled.has(event.keyCode)) {
			event.preventDefault();
			event.stopPropagation();
			ImprovedTube.input.cancelled.delete(event.keyCode);
		}
	},
	wheel: function (event) {
		// shortcuts with wheel allowed ONLY inside player
		if (!ImprovedTube.elements.player?.contains(event.target)) return;

		ImprovedTube.input.pressed.wheel = event.deltaY > 0 ? 1 : -1;
		ImprovedTube.input.pressed.alt = event.altKey;
		ImprovedTube.input.pressed.ctrl = event.ctrlKey;
		ImprovedTube.input.pressed.shift = event.shiftKey;

		ImprovedTube.shortcutsHandler();
	},
	'blur-shortcuts-reset': function () {
		ImprovedTube.input.pressed.keys.clear();
		ImprovedTube.input.pressed.wheel = 0
		ImprovedTube.input.pressed.alt = false;
		ImprovedTube.input.pressed.ctrl = false;
		ImprovedTube.input.pressed.shift = false;
	}
};
/*--- SHORTCUT AMBIENT LIGHTING ----------------------------------------------*/
ImprovedTube.shortcutToggleAmbientLighting = function () {
	document.documentElement.toggleAttribute('it-ambient-lighting');
};
/*--- SHORTCUT QUALITY -------------------------------------------------------*/
ImprovedTube.shortcutQuality = function (key) {
	const label = ['auto', 'tiny', 'small', 'medium', 'large', 'hd720', 'hd1080', 'hd1440', 'hd2160', 'hd2880', 'highres'],
		resolution = ['auto', '144p', '240p', '360p', '480p', '720p', '1080p', '1440p', '2160p', '2880p', '4320p'];

	ImprovedTube.playerQuality(label[resolution.indexOf(key.replace('shortcutQuality', ''))]);
};
/*--- SHORTCUT PICTURE IN PICTURE (PIP) --------------------------------------*/
ImprovedTube.shortcutPictureInPicture = this.enterPip;
/*--- SHORTCUT TOGGLE CONTROLS -----------------------------------------------*/
ImprovedTube.shortcutToggleControls = function () {
	const player = this.elements.player;
	let option = this.storage.player_hide_controls;

	if (player && player.hideControls && player.showControls) {
		if (option === 'when_paused') {
			if (this.elements.video.paused) {
				option = 'off';
			} else {
				option = 'always';
			}
		} else if (option === 'always') {
			option = 'off';
		} else {
			option = 'always';
		}

		this.storage.player_hide_controls = option;
		ImprovedTube.playerControls()
	}
};
/*--- SHORTCUT PLAY / PAUSE --------------------------------------------------*/
ImprovedTube.shortcutPlayPause = function () {
	const video = this.elements.video;
	if (video) {
		if (video.paused) {
			video.play();
		} else {
			video.pause();
		}
	}
};
/*--- SHORTCUT STOP ----------------------------------------------------------*/
ImprovedTube.shortcutStop = function () {
	this.elements.player?.stopVideo();
};
/*--- SHORTCUT TOGGLE AUTOPLAY -----------------------------------------------*/
ImprovedTube.shortcutToggleAutoplay = function () {
	this.storage.player_autoplay_disable = !this.storage.player_autoplay_disable;
};
/*--- SHORTCUT NEXT VIDEO ----------------------------------------------------*/
ImprovedTube.shortcutNextVideo = function () {
	this.elements.player?.nextVideo();
};
/*--- SHORTCUT PREVIOUS VIDEO ------------------------------------------------*/
ImprovedTube.shortcutPrevVideo = function () {
	this.elements.player?.previousVideo();
};
/*--- SHORTCUT SEEK BACKWARD -------------------------------------------------*/
ImprovedTube.shortcutSeekBackward = function () {
	this.elements.player?.seekBy(-10);
};
/*--- SHORTCUT SEEK FORWARD --------------------------------------------------*/
ImprovedTube.shortcutSeekForward = function () {
	this.elements.player?.seekBy(10);
};
/*--- SHORTCUT SEEK NEXT CHAPTER ---------------------------------------------*/
// FIXME
ImprovedTube.shortcutSeekNextChapter = function (previous) {
	const player = this.elements.player,
		progress_bar = player.querySelector('.ytp-progress-bar'),
		duration = player?.getDuration(),
		chapters = player.querySelector('.ytp-chapters-container')?.children,
		direction = previous ? 'Previous' : 'Next';

	if (!player || !progress_bar || !chapters || !progress_bar) {
		console.error('shortcutSeek' + direction + 'Chapter: No valid Player element or cant locate chapters');
		return;
	}

	const current_width = player.getCurrentTime() / (duration / 100) * (progress_bar.offsetWidth / 100);
	let left = 0;

	if (previous) {
		for (let i = chapters.length - 1; i > 0; i--) {
			if (current_width > chapters[i].offsetLeft) {
				if (i > 0) {
					left = chapters[i - 1].offsetLeft;
					left = left / (progress_bar.offsetWidth / 100) * (duration / 100);
				}
				break;
			}
		}
	} else {
		for (let i = 1; i < chapters.length; i++) {
			left = chapters[i].offsetLeft;

			if (current_width < left) {
				left = left / (progress_bar.offsetWidth / 100) * (duration / 100);
				break;
			}
		}
	}
	document.querySelector('video').currentTime = left;
//	player.seekTo(left);
};
/*
ImprovedTube.shortcutSeekNextChapter = function () {
			for (var i = 0, l = chapters.length; i < l; i++) {
				var left = chapters[i].offsetLeft;

				if (current_width < left) {
					player.seekTo(left / (progress_bar.offsetWidth / 100) * (duration / 100));

					return false;
				}
			}
ImprovedTube.shortcutSeekPreviousChapter = function () {
			for (var i = chapters.length - 1; i > 0; i--) {
				if (current_width > chapters[i].offsetLeft) {
					var left = 0;

					if (i > 0) {
						left = chapters[i - 1].offsetLeft;
					}

					player.seekTo(left / (progress_bar.offsetWidth / 100) * (duration / 100));

					return false;
				}
			}
*/
/*--- SHORTCUT SEEK PREVIOUS CHAPTER -----------------------------------------*/
ImprovedTube.shortcutSeekPreviousChapter = function () {
	ImprovedTube.shortcutSeekNextChapter(true);
};
/*--- SHORTCUT INCREASE VOLUME -----------------------------------------------*/
ImprovedTube.shortcutIncreaseVolume = function (decrease) {
	const player = this.elements.player,
		value = Number(this.storage.shortcuts_volume_step) || 5,
		direction = decrease ? 'Decrease' : 'Increase';

	if (!player || !player.setVolume || !player.getVolume) {
		console.error('shortcut' + direction + 'Volume: No valid Player element');
		return;
	}

	// universal, goes both ways if you know what I mean
	if (decrease) {
		player.setVolume(player.getVolume() - value);
	} else {
		player.setVolume(player.getVolume() + value);
	}

	localStorage['yt-player-volume'] = JSON.stringify({
		data: JSON.stringify({
			volume: player.getVolume(),
			muted: player.isMuted(),
			expiration: Date.now(),
			creation: Date.now()
		})
	});

	sessionStorage['yt-player-volume'] = localStorage['yt-player-volume'];

	this.showStatus(player.getVolume());
};
/*--- SHORTCUT DECREASE VOLUME -----------------------------------------------*/
ImprovedTube.shortcutDecreaseVolume = function () {
	ImprovedTube.shortcutIncreaseVolume(true);
};
/*--- SHORTCUT SCREENSHOT ----------------------------------------------------*/
ImprovedTube.shortcutScreenshot = ImprovedTube.screenshot;
/*--- SHORTCUT INCREASE PLAYBACK SPEED ---------------------------------------*/
ImprovedTube.shortcutIncreasePlaybackSpeed = function (decrease) {
	const value = Number(this.storage.shortcuts_playback_speed_step) || .05,
		speed = this.playbackSpeed(),
		direction = decrease ? 'Decrease' : 'Increase';
	let newSpeed;

	if (!speed) {
		console.error('shortcut' + direction + 'PlaybackSpeed: Cant establish playbackRate/getPlaybackRate');
		return;
	}

	// universal, goes both ways if you know what I mean
	if (decrease) {
		// 0.1x speed is the minimum
		newSpeed = (speed - value < 0.1) ? 0.1 : (speed - value);
	} else {
		// 10x speed is the limit
		newSpeed = (speed + value > 10) ? 10 : (speed + value);
	}

	newSpeed = this.playbackSpeed(newSpeed);
	if (!newSpeed) {
		console.error('shortcut' + direction + 'PlaybackSpeed: Cant read back playbackRate/getPlaybackRate');
		return;
	}
	ImprovedTube.showStatus(newSpeed);
};
/*--- SHORTCUT DECREASE PLAYBACK SPEED ---------------------------------------*/
ImprovedTube.shortcutDecreasePlaybackSpeed = function () {
	ImprovedTube.shortcutIncreasePlaybackSpeed(true);
};
/*--- SHORTCUT RESET PLAYBACK SPEED ------------------------------------------*/
ImprovedTube.shortcutResetPlaybackSpeed = function () {
	ImprovedTube.showStatus(this.playbackSpeed(1));
};
/*--- SHORTCUT GO TO SEARCH BOX ----------------------------------------------*/
ImprovedTube.shortcutGoToSearchBox = function () {
	document.querySelector('input#search')?.focus();
};
/*--- SHORTCUT ACTIVATE FULLSCREEN -------------------------------------------*/
ImprovedTube.shortcutActivateFullscreen = function () {
	this.elements.player?.toggleFullscreen();
};
/*--- SHORTCUT ACTIVATE CAPTIONS ---------------------------------------------*/
ImprovedTube.shortcutActivateCaptions = function () {
	const player = this.elements.player;

	if (player && player.toggleSubtitlesOn) {
		player.toggleSubtitlesOn();
	}
};
/*--- SHORTCUT CHAPTERS ------------------------------------------------------*/
ImprovedTube.shortcutChapters = function () {
	const available = document.querySelector('[target-id*=chapters][visibility*=HIDDEN]') || document.querySelector('[target-id*=chapters]').clientHeight;
	if (available) {
		const modernChapters = document.querySelector('[modern-chapters] #navigation-button button[aria-label]');
		modernChapters ? modernChapters.click() : document.querySelector('[target-id*=chapters]')?.removeAttribute('visibility');
	} else {
		const visibilityButton = document.querySelector('[target-id*=chapters][visibility*=EXPANDED] #visibility-button button[aria-label]');
		visibilityButton ? visibilityButton.click() : document.querySelector('*[target-id*=chapters] #visibility-button button')?.click();
	}
	if (!modernChapters && visibilityButton) {
		console.error('shortcutChapters: Cant fint proper Enble button, falling back to unreliable bruteforce method');
	}
};
/*--- SHORTCUT TRANSCRIPT ----------------------------------------------------*/
ImprovedTube.shortcutTranscript = function () {
	const available = document.querySelector('[target-id*=transcript][visibility*=HIDDEN]') || document.querySelector('[target-id*=transcript]').clientHeight;
	if (available) {
		const descriptionTranscript = document.querySelector('ytd-video-description-transcript-section-renderer button[aria-label]');
		descriptionTranscript ? descriptionTranscript.click() : document.querySelector('[target-id*=transcript]')?.removeAttribute('visibility');
	} else {
		const transcriptButton = document.querySelector('ytd-video-description-transcript-section-renderer button[aria-label]');
		transcriptButton ? transcriptButton.click() : document.querySelector('[target-id*=transcript] #visibility-button button')?.click();
	}
	if (!descriptionTranscript && transcriptButton) {
		console.error('shortcutTranscript: Cant fint proper Enble button, falling back to unreliable bruteforce method');
	}
};
/*--- SHORTCUT LIKE ----------------------------------------------------------*/
ImprovedTube.shortcutLike = function () {
	document.querySelector('like-button-view-model button')?.click();
};
/*--- SHORTCUT DISLIKE -------------------------------------------------------*/
ImprovedTube.shortcutDislike = function () {
	document.querySelector('dislike-button-view-model button')?.click();
};
/*------Report------*/
ImprovedTube.shortcutReport = function () {
	try {
		document.querySelectorAll("tp-yt-iron-dropdown").forEach(el => el.style.opacity = 0);
		document.querySelector('svg path[d^="M7.5,12c0,0.83-0.67,1.5-1.5"]').closest("button").click(); document.querySelectorAll("tp-yt-iron-dropdown").forEach(el => el.style.opacity = 0)
	} catch {
		console.log("'...' failed"); setTimeout(function () {
			try {
				document.querySelector('svg path[d^="M7.5,12c0,0.83-0.67,1.5-1.5"]').closest("button").click(); document.querySelectorAll("tp-yt-iron-dropdown").forEach(el => el.style.opacity = 0)
			} catch {
				console.log("'...' failed2")
			}
		}, 100)
	}

	setTimeout(function () {
		try {
			document.querySelectorAll("tp-yt-iron-dropdown").forEach(el => el.style.opacity = 0); document.querySelector('tp-yt-iron-dropdown svg path[d^="M13.18,4l0.24,1.2L13.58,6h0.82H19v7h-5.18l-0"]').closest("tp-yt-paper-item").click();
		} catch {
			console.log("report failed"); setTimeout(function ()	{
				try {
					document.querySelector('tp-yt-iron-dropdown svg path[d^="M13.18,4l0.24,1.2L13.58,6h0.82H19v7h-5.18l-0"]').closest("tp-yt-paper-item").click();
				} catch {
					console.log("report failed2"); document.querySelector('svg path[d^="M7.5,12c0,0.83-0.67,1.5-1.5"]').closest("button").click();
				}
			}, 800);
		}
	}, 200);

	setTimeout(function () {
		try {
			document.querySelectorAll("tp-yt-iron-dropdown").forEach(el => el.style.opacity = 1)
		} catch {
			console.log("dropdown visible failed");
			setTimeout(function () {
				try {
					document.querySelectorAll("tp-yt-iron-dropdown").forEach(el => el.style.opacity = 1)
				} catch {
					console.log("dropdown visible failed2");
				}
			}, 1700)
		}
	}, 700)
}
/*--- SHORTCUT SUBSCRIBE -----------------------------------------------------*/
ImprovedTube.shortcutSubscribe = function () {
	this.elements.subscribe_button?.click();
};
/*--- SHORTCUT DARK THEME ----------------------------------------------------*/
ImprovedTube.shortcutDarkTheme = function () {
	if (document.documentElement.hasAttribute('dark')) {
		// message will propagate all the way to setTheme() so we dont need to do anything more here
		ImprovedTube.messageSend({action: 'set', key: 'theme', value: 'light'});
	} else {
		ImprovedTube.messageSend({action: 'set', key: 'theme', value: 'dark'});
	}
};
/*--- SHORTCUT CUSTOM MINI PLAYER --------------------------------------------*/
ImprovedTube.shortcutCustomMiniPlayer = function () {
	this.storage.mini_player = !this.storage.mini_player;

	this.miniPlayer();
};
/*--- SHORTCUT TOGGLE LOOP ---------------------------------------------------*/
ImprovedTube.shortcutToggleLoop = function () {
	const video = this.elements.video,
		player = this.elements.player;
	function matchLoopState (opacity) {
		document.querySelector('#it-repeat-button')?.children[0]?.style.setProperty("opacity", opacity);
		document.querySelector('#it-below-player-loop')?.children[0]?.style.setProperty("opacity", opacity);
	};

	if (!(video && player)) return;
	if (video.hasAttribute('loop')) {
		video.removeAttribute('loop');
		matchLoopState('.5');
	} else if (!/ad-showing/.test(player.className)) {
		video.setAttribute('loop', '');
		matchLoopState('1');
	}
};
/*--- SHORTCUT STATS FOR NERDS -----------------------------------------------*/
ImprovedTube.shortcutStatsForNerds = function () {
	const player = this.elements.player;

	if (!player || !player.isVideoInfoVisible || !player.hideVideoInfo || !player.showVideoInfo) {
		console.error('shortcutStatsForNerds: Need valid Player element');
		return;
	}

	if (player.isVideoInfoVisible()) {
		player.hideVideoInfo();
	} else {
		player.showVideoInfo();
	}
};
/*--- SHORTCUT TOGGLE CARDS --------------------------------------------------*/
ImprovedTube.shortcutToggleCards = function () {
	function toggleVideoOverlays () {
		document.documentElement.toggleAttribute('it-player-hide-cards');
		document.documentElement.toggleAttribute('it-player-hide-endcards');
		document.documentElement.toggleAttribute('it-hide-video-title-fullScreen');
	}

	toggleVideoOverlays();
	window.removeEventListener('hashchange', toggleVideoOverlays);
	window.addEventListener('hashchange', toggleVideoOverlays);
};
/*--- SHORTCUT POPUP PLAYER --------------------------------------------------*/
ImprovedTube.shortcutPopupPlayer = function () {
	const player = this.elements.player;

	if (player && document.documentElement.dataset.pageType === 'video') {
		player.pauseVideo();

		window.open('//www.youtube.com/embed/' + location.href.match(ImprovedTube.regex.video_id)?.[1] + '?start=' + parseInt(player.getCurrentTime()) + '&autoplay=' + (ImprovedTube.storage.player_autoplay_disable ? '0' : '1'), '_blank', 'directories=no,toolbar=no,location=no,menubar=no,status=no,titlebar=no,scrollbars=no,resizable=no,width=' + player.offsetWidth + ',height=' + player.offsetHeight);
	}
};
/*--- SHORTCUT ROTATE VIDEO --------------------------------------------------*/
ImprovedTube.shortcutRotateVideo = function () {
	const player = this.elements.player,
		video = this.elements.video;
	let rotate = Number(document.body.dataset.itRotate) || 0,
		transform = '';

	if (!player || !video) {
		console.error('shortcutRotateVideo: need player and video elements');
		return;
	}

	rotate += 90;

	if (rotate === 360) {
		rotate = 0;
		video.style.removeProperty("transform");
		delete document.body.dataset.itRotate;
		return;
	}

	document.body.dataset.itRotate = rotate;

	transform += 'rotate(' + rotate + 'deg)';

	if (rotate == 90 || rotate == 270) {
		const is_vertical_video = video.videoHeight > video.videoWidth;

		transform += ' scale(' + (is_vertical_video ? player.clientWidth : player.clientHeight) / (is_vertical_video ? player.clientHeight : player.clientWidth) + ')';
	}
	video.style.setProperty("transform", transform);
};
