/*--------------------------------------------------------------
>>> CORE:
----------------------------------------------------------------
# Global variable
# Messages
	# Create element
	# Listener
	# Send
--------------------------------------------------------------*/

/*--------------------------------------------------------------
# GLOBAL VARIABLE
--------------------------------------------------------------*/

var ImprovedTube = {
	messages: {
		queue: []
	},
	storage: {},
	elements: {
		buttons: {},
		masthead: {},
		app_drawer: {},
		playlist: {},
		livechat: {},
		related: {},
		comments: {},
		collapse_of_subscription_sections: [],
		mark_watched_videos: [],
		blocklist_buttons: [],
		observerList: []
	},
	regex: {
		channel: /\/(@|c\/@?|channel\/|user\/)(?<name>[^/]+)/,
		channel_home_page: /\/@|((channel|user|c)\/)[^/]+(\/featured)?\/?$/,
		channel_home_page_postfix: /\/(featured)?\/?$/,
		thumbnail_quality: /(default\.jpg|mqdefault\.jpg|hqdefault\.jpg|hq720\.jpg|sddefault\.jpg|maxresdefault\.jpg)+/,
		video_id: /(?:[?&]v=|embed\/|shorts\/)([^&?]{11})/,
		video_time: /[?&](?:t|start)=([^&]+)/,
		playlist_id: /[?&]list=([^&]+)/,
		channel_link: /https:\/\/www.youtube.com\/@|((channel|user|c)\/)/
	},
	button_icons: {
		blocklist: {
			svg: [['viewBox', '0 0 24 24']],
			path: [['d', 'M12 2a10 10 0 100 20 10 10 0 000-20zm0 18A8 8 0 015.69 7.1L16.9 18.31A7.9 7.9 0 0112 20zm6.31-3.1L7.1 5.69A8 8 0 0118.31 16.9z']]
		},
		playAll: {
			svg: [['viewBox', '0 0 24 24']],
			path: [['d', 'M6,4l12,8L6,20V4z']]
		},
		playlistPopup: {
			svg: [['viewBox', '0 0 24 24']],
			svgStyle: [['width', '24px'], ['height', '24px'], ['pointerEvents', 'none'], ['fill', 'currentColor']],
			path: [['d', 'M19 7h-8v6h8V7zm2-4H3C2 3 1 4 1 5v14c0 1 1 2 2 2h18c1 0 2-1 2-2V5c0-1-1-2-2-2zm0 16H3V5h18v14z']],
			style: [['opacity', .8]]
		},
		playerPopup: {
			svg: [['viewBox', '0 0 24 24']],
			path: [['d', 'M19 7h-8v6h8V7zm2-4H3C2 3 1 4 1 5v14c0 1 1 2 2 2h18c1 0 2-1 2-2V5c0-1-1-2-2-2zm0 16H3V5h18v14z']],
			//path: ImprovedTube.button_icons.playlistPopup.path,
			style: [['opacity', .8]]
		},
		playlistReverse: {
			svg: [['viewBox', '0 0 24 24']],
			path: [['d', 'M9 3L5 6.99h3V14h2V6.99h3L9 3zm7 14.01V10h-2v7.01h-3L15 21l4-3.99h-3z']],
			style: [['opacity', .8]]
		},
		playerCinemaMode: {
			svg: [['viewBox', '0 0 24 24']],
			path: [['d', 'm 2.1852 2.2 h 3.7188 h 5.2974 h 5.184 h 3.5478 c 0.6012 0 1.1484 0.2737 1.5444 0.7113 c 0.396 0.4396 0.6408 1.047 0.6408 1.7143 v 1.4246 v 11.4386 v 1.4166 c 0 0.6673 -0.2466 1.2747 -0.6408 1.7143 c -0.396 0.4396 -0.9432 0.7113 -1.5444 0.7113 h -3.456 c -0.0288 0.006 -0.0594 0.008 -0.0918 0.008 c -0.0306 0 -0.0612 -0.002 -0.0918 -0.008 h -5.0004 c -0.0288 0.006 -0.0594 0.008 -0.0918 0.008 c -0.0306 0 -0.0612 -0.002 -0.0918 -0.008 h -5.1138 c -0.0288 0.006 -0.0594 0.008 -0.0918 0.008 c -0.0306 0 -0.0612 -0.002 -0.0918 -0.008 h -3.627 c -0.6012 0 -1.1484 -0.2737 -1.5444 -0.7113 s -0.6408 -1.047 -0.6408 -1.7143 v -1.4166 v -11.4386 v -1.4246 c 0 -0.6673 0.2466 -1.2747 0.6408 -1.7143 c 0.396 -0.4376 0.9432 -0.7113 1.5444 -0.7113 l 0 0 z m 7.749 6.2418 l 3.6954 2.8611 c 0.0576 0.04 0.1098 0.0959 0.1512 0.1618 c 0.1656 0.2657 0.1044 0.6274 -0.1332 0.8112 l -3.681 2.8252 c -0.09 0.0819 -0.207 0.1319 -0.333 0.1319 c -0.2916 0 -0.5274 -0.2617 -0.5274 -0.5854 v -5.7283 h 0.0018 c 0 -0.1159 0.0306 -0.2318 0.0936 -0.3337 c 0.1674 -0.2637 0.495 -0.3277 0.7326 -0.1439 l 0 0 z m 6.9768 9.6324 v 2.0879 h 3.0204 c 0.3114 0 0.594 -0.1419 0.7992 -0.3696 c 0.2052 -0.2278 0.333 -0.5415 0.333 -0.8871 v -0.8312 h -4.1526 l 0 0 z m -1.053 2.0879 v -2.0879 h -4.1292 v 2.0879 h 4.1292 l 0 0 z m -5.1822 0 v -2.0879 h -4.2444 v 2.0879 h 4.2444 l 0 0 z m -5.2992 0 v -2.0879 h -4.3236 v 0.8312 c 0 0.3457 0.1278 0.6593 0.333 0.8871 c 0.2052 0.2278 0.4878 0.3696 0.7992 0.3696 h 3.1914 l 0 0 z m -4.3236 -3.2567 h 4.851 h 5.2974 h 5.184 h 4.68 v -10.2697 h -4.68 h -5.184 h -5.2974 h -4.851 v 10.2697 l 0 0 z m 14.805 -11.4386 v -2.0979 h -4.1292 v 2.0959 h 4.1292 l 0 0.002 z m 1.053 -2.0979 v 2.0959 h 4.1526 v -0.8392 c 0 -0.3457 -0.1278 -0.6593 -0.333 -0.8871 c -0.2052 -0.2278 -0.4878 -0.3696 -0.7992 -0.3696 h -3.0204 l 0 0 z m -6.2352 2.0979 v -2.0979 h -4.2444 v 2.0959 h 4.2444 l 0 0.002 z m -5.2992 0 v -2.0979 h -3.1914 c -0.3114 0 -0.594 0.1419 -0.7992 0.3696 c -0.2052 0.2278 -0.333 0.5415 -0.333 0.8871 v 0.8392 h 4.3236 l 0 0.002 z']],
			style: [['opacity', .64]]
		}
	},
	video_src: false,
	initialVideoUpdateDone: false,
	latestVideoDuration: 0,
	video_url: '',
	focus: false,
	played_before_blur: false,
	played_time: 0,
	user_interacted: false,
	input: {
		listening: {},
		listeners: {},
		pressed: {
			keys: new Set(),
			wheel: 0,
			alt: false,
			ctrl: false,
			shift: false
		},
		cancelled: new Set(),
		ignoreElements: ['EMBED', 'INPUT', 'OBJECT', 'TEXTAREA', 'IFRAME'],
		modifierKeys: ['AltLeft', 'AltRight', 'ControlLeft', 'ControlRight', 'ShiftLeft', 'ShiftRight'],
	},
	mini_player__mode: false,
	mini_player__move: false,
	mini_player__cursor: '',
	mini_player__x: 0,
	mini_player__y: 0,
	mini_player__max_x: 0,
	mini_player__max_y: 0,
	mini_player__original_width: 0,
	mini_player__original_height: 0,
	mini_player__width: 200,
	mini_player__height: 160,
	miniPlayer_mouseDown_x: 0,
	miniPlayer_mouseDown_y: 0,
	mini_player__player_offset_x: 0,
	mini_player__player_offset_y: 0,
	miniPlayer_resize_offset: 16,
	playlistReversed: false,
	status_timer: false,
	defaultApiKey: 'AIzaSyCXRRCFwKAXOiF1JkUBmibzxJF1cPuKNwA',
	DOM_filter: ['SCRIPT','iron-iconset-svg','svg','SPAN','#text','#comment','yt-icon-shape','DOM-IF','DOM-REPEAT']
};

/*--------------------------------------------------------------
CODEC || 30FPS
----------------------------------------------------------------
	Do not move, needs to be on top of first injected content
	file to patch HTMLMediaElement before YT player uses it.
--------------------------------------------------------------*/
if (localStorage['it-codec'] || localStorage['it-player30fps']) {
	function overwrite (self, callback, mime) {
		if (localStorage['it-codec']) {
			var re = new RegExp(localStorage['it-codec']);
			// /webm|vp8|vp9|av01/
			if (re.test(mime)) return '';
		}
		if (localStorage['it-player30fps']) {
			var match = /framerate=(\d+)/.exec(mime);
			if (match && match[1] > 30) return '';
		}
		return callback.call(self, mime);
	};

	if (window.MediaSource) {
		var isTypeSupported = window.MediaSource.isTypeSupported;
		window.MediaSource.isTypeSupported = function (mime) {
			return overwrite(this, isTypeSupported, mime);
		}
	}
	var canPlayType = HTMLMediaElement.prototype.canPlayType;
	HTMLMediaElement.prototype.canPlayType = function (mime) {
		return overwrite(this, canPlayType, mime);
	}
};
/*--------------------------------------------------------------
# MESSAGES
----------------------------------------------------------------
	Designed for messaging between contexts of extension and
	website.
--------------------------------------------------------------*/
document.addEventListener('it-message-from-extension', function (message) {
	message = message.detail;

	if (message.action === 'storage-loaded') {
		ImprovedTube.storage = message.storage;

		ImprovedTube.init();
		ImprovedTube.blocklistInit();
		ImprovedTube.playerLimits();

	// REACTION OR VISUAL FEEDBACK WHEN THE USER CHANGES A SETTING (already automated for our CSS features):
	} else if (message.action === 'storage-changed') {
		let camelized_key = message.camelizedKey;

		ImprovedTube.storage[message.key] = message.value;

		switch(camelized_key) {
			case 'blocklist':
			case 'blocklistActivate':
				camelized_key = 'blocklistInit';
				break

			case 'playerPlaybackSpeed':
			case 'playerForcedPlaybackSpeed':
				if (ImprovedTube.storage.player_forced_playback_speed === true) {
					ImprovedTube.elements.player.setPlaybackRate(Number(ImprovedTube.storage.player_playback_speed));
					ImprovedTube.elements.player.querySelector('video').playbackRate = Number(ImprovedTube.storage.player_playback_speed);
				} else if (ImprovedTube.storage.player_forced_playback_speed !== true) {
					ImprovedTube.elements.player.setPlaybackRate(1);
					ImprovedTube.elements.player.querySelector('video').playbackRate = 1;
				}
				break

			case 'theme':
			case 'themePrimaryColor':
			case 'themeTextColor':
				ImprovedTube.myColors();
				ImprovedTube.setTheme();
				break

			case 'description':
				if (ImprovedTube.storage.description === "expanded" || ImprovedTube.storage.description === "classic_expanded") {
					try{document.querySelector("#more").click() || document.querySelector("#expand").click();} catch{}
				} else if (ImprovedTube.storage.description === "normal" || ImprovedTube.storage.description === "classic") {
					try{document.querySelector("#less").click() || document.querySelector("#collapse").click();} catch{}
				}
				break

			case 'transcript':
				if (ImprovedTube.storage.transcript === true) {
					document.querySelector('*[target-id*=transcript]')?.removeAttribute('visibility');
				} else if (ImprovedTube.storage.transcript === false) {
					document.querySelector('*[target-id*=transcript] #visibility-button button')?.click();
				}
				break

			case 'chapters':
				if (ImprovedTube.storage.chapters === true) {
					document.querySelector('*[target-id*=chapters]')?.removeAttribute('visibility');
				} else if (ImprovedTube.storage.chapters === false) {
					document.querySelector('*[target-id*=chapters] #visibility-button button')?.click();
				}
				break

			case 'commentsSidebarSimple':
				if (ImprovedTube.storage.comments_sidebar_simple === false) {
					document.querySelector("#below").appendChild(document.querySelector("#comments"));
					document.querySelector("#secondary").appendChild(document.querySelector("#related"));
				} else {
					ImprovedTube.commentsSidebarSimple();
				}
				break

			case 'forcedTheaterMode':
				if (ImprovedTube.storage.forced_theater_mode === false && ImprovedTube.elements.ytd_watch && ImprovedTube.elements.player) {
					const button = ImprovedTube.elements.player.querySelector("button.ytp-size-button");
					if (button && ImprovedTube.elements.ytd_watch.theater === true) {
						ImprovedTube.elements.ytd_watch.theater = false;
						setTimeout(function () { button.click();}, 100);
					}
				}
				break

			case 'playerScreenshotButton':
				if (ImprovedTube.storage.player_screenshot_button === false) {
					if (ImprovedTube.elements.buttons['it-screenshot-button']) {
						ImprovedTube.elements.buttons['it-screenshot-button']?.remove();
						ImprovedTube.elements.buttons['it-screenshot-styles']?.remove();
					}
				}
				break

			case 'playerRepeatButton':
				if (ImprovedTube.storage.player_repeat_button === false) {
					if (ImprovedTube.elements.buttons['it-repeat-button']) {
						ImprovedTube.elements.buttons['it-repeat-button']?.remove();
						ImprovedTube.elements.buttons['it-repeat-styles']?.remove();
					}
				}
				break

			case 'playerPopupButton':
				if (ImprovedTube.storage.player_popup_button === false) {
					ImprovedTube.elements.buttons['it-popup-player-button']?.remove();
				}
				break

			case 'playerRotateButton':
				if (ImprovedTube.storage.player_rotate_button === false) {
					ImprovedTube.elements.buttons['it-rotate-button']?.remove();
					ImprovedTube.elements.buttons['it-rotate-styles']?.remove();
				}
				break

			case 'playerFitToWinButton':
				if (ImprovedTube.storage.player_fit_to_win_button === false) {
					ImprovedTube.elements.buttons['it-fit-to-win-player-button']?.remove();
					document.querySelector("html")?.setAttribute("it-player-size", ImprovedTube.storage.player_size ?? "do_not_change");
				}
				break

			case 'playerHamburgerButton':
				if (ImprovedTube.storage.player_hamburger_button == false) {
					document.querySelector('.custom-hamburger-menu')?.remove();
					let rightControls = document.querySelector('.html5-video-player')?.querySelector('.ytp-right-controls');
					if (rightControls) {
						rightControls.style.setProperty('padding-right', ''); // Restoring the original padding:
						rightControls.style.setProperty('display', 'flex');
					}
				}
				break

			case 'belowPlayerPip':
				if (ImprovedTube.storage.below_player_pip === false) {
					document.querySelector('.improvedtube-player-button[data-tooltip="PiP"]')?.remove();
				} else if (ImprovedTube.storage.below_player_pip === true) {
					document.querySelectorAll('.improvedtube-player-button').forEach(e => e.remove());
					ImprovedTube.improvedtubeYoutubeButtonsUnderPlayer();
				}
				break

			case 'belowPlayerScreenshot':
				if (ImprovedTube.storage.below_player_screenshot === false) {
					document.querySelector('.improvedtube-player-button[data-tooltip="Screenshot"]')?.remove();
				} else if (ImprovedTube.storage.below_player_screenshot === true) {
					document.querySelectorAll('.improvedtube-player-button').forEach(e => e.remove());
					ImprovedTube.improvedtubeYoutubeButtonsUnderPlayer();
				}
				break

			case 'belowPlayerLoop':
				if (ImprovedTube.storage.below_player_loop === false) {
					document.querySelector('.improvedtube-player-button[data-tooltip="Loop"]')?.remove();
				} else if (ImprovedTube.storage.below_player_loop === true) {
					document.querySelectorAll('.improvedtube-player-button').forEach(e => e.remove());
					ImprovedTube.improvedtubeYoutubeButtonsUnderPlayer();
				}
				break

			case 'dayOfWeek':
				if (ImprovedTube.storage.day_of_week === false) {
					document.querySelector(".ytd-day-of-week")?.remove();
				} else if (ImprovedTube.storage.day_of_week === true) {
					ImprovedTube.dayOfWeek();
				}
				break

			case 'playerRemainingDuration':
				if (ImprovedTube.storage.player_remaining_duration === false) {
					document.querySelector(".ytp-time-remaining-duration")?.remove();
				} else if (ImprovedTube.storage.player_remaining_duration === true) {
					ImprovedTube.playerRemainingDuration();
				}
				break

			case 'subtitlesFontFamily':
			case 'subtitlesFontColor':
			case 'subtitlesFontSize':
			case 'subtitlesBackgroundColor':
			case 'subtitlesWindowColor':
			case 'subtitlesWindowOpacity':
			case 'subtitlesCharacterEdgeStyle':
			case 'subtitlesFontOpacity':
			case 'subtitlesBackgroundOpacity':
				ImprovedTube.subtitlesUserSettings();
				break

			case 'playerHideControls':
				ImprovedTube.playerControls();
				break

			case 'block_vp9':
			case 'block_h264':
			case 'block_av1':
			case 'player_30fps_limit':					
				ImprovedTube.playerLimits();
				break
		}

		// dont trigger shortcuts on config change, reinitialize handler instead
		if (message.key.startsWith('shortcut_')) camelized_key = 'shortcutsInit';
		
		if (ImprovedTube[camelized_key]) {
			try{ImprovedTube[camelized_key]()}catch{};
		}
	} else if (message.action === 'focus' && ImprovedTube.elements.player) {
		ImprovedTube.focus = true;
		ImprovedTube.pageOnFocus();
	} else if (message.action === 'blur' && ImprovedTube.elements.player) {
		ImprovedTube.focus = false;
		ImprovedTube.pageOnFocus();
		document.dispatchEvent(new CustomEvent('improvedtube-blur'));
	} else if (message.pause === true) {
		if (ImprovedTube.elements.player) {
			ImprovedTube.played_before_blur = ImprovedTube.elements.player.getPlayerState() === 1;
			ImprovedTube.elements.player.pauseVideo();
		}
	} else if (message.setVolume) {
		ImprovedTube.elements.player?.setVolume(message.setVolume);
	} else if (message.setPlaybackSpeed) {
		ImprovedTube.playbackSpeed(message.setPlaybackSpeed);
	} else if (message.deleteCookies === true) {
		ImprovedTube.deleteYoutubeCookies();
	} else if (message.responseOptionsUrl) {
		const iframe = document.querySelector('.it-button__iframe');

		if (iframe) {
			iframe.src = message.responseOptionsUrl;
		}
	}
});

/*--------------------------------------------------------------
# SEND
--------------------------------------------------------------*/

ImprovedTube.messages.send = function (message) {
	document.dispatchEvent(new CustomEvent('it-message-from-youtube', {'detail': message}));
};
