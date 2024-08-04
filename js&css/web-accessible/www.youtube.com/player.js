/*--- AUTOPLAY DISABLE -------------------------------------------------------*/
// HIXME
ImprovedTube.autoplayDisable = function (videoElement) {
	if (this.storage.player_autoplay_disable
		|| this.storage.playlist_autoplay === false
		|| this.storage.channel_trailer_autoplay === false) {
		const player = this.elements.player || videoElement.closest('.html5-video-player') || videoElement.closest('#movie_player');

		if (this.video_url !== location.href) this.user_interacted = false;

		// if (there is a player) and (no user clicks) and (no ads playing)
		// and ( ( it is not in a playlist and auto play is off )
		//    or ( playlist auto play is off and in a playlist )
		//    or ( we are in a channel and the channel trailer autoplay is off ) )

		// user didnt click
		if (player && !this.user_interacted
			// no ads playing
			&& !player.classList.contains('ad-showing')
			// video page
			&& ((location.href.includes('/watch?') // #1703
				// player_autoplay_disable & not playlist
				&& (this.storage.player_autoplay_disable && !location.href.includes('list='))
				// !playlist_autoplay & playlist
				|| (this.storage.playlist_autoplay === false && location.href.includes('list=')))
				// channel homepage & !channel_trailer_autoplay
				|| (this.storage.channel_trailer_autoplay === false && this.regex.channel.test(location.href)))) {

			//setTimeout(function () { player.pauseVideo(); });
		} else {
			document.dispatchEvent(new CustomEvent('it-message-from-web-accessible', {'detail': {action: 'play'}}));
		}
	} else {
		document.dispatchEvent(new CustomEvent('it-message-from-web-accessible', {'detail': {action: 'play'}}));
	}
};
/*--- FORCED PLAY VIDEO FROM THE BEGINNING -----------------------------------*/
// FIXME
ImprovedTube.forcedPlayVideoFromTheBeginning = function (video) {
	const player = this.elements.player;
	//video = this.elements.video,
	//paused = video?.paused;

	if (player && video && this.storage.forced_play_video_from_the_beginning && location.pathname == '/watch') {
		//console.log('trying to player.seekTo(0)');
		//video.currentTime = 0;
		//player.seekTo(0);
		//video.currentTime = 0;
		// restore previous paused state
		//if (paused) { player.pauseVideo(); }
	}
};
/*--- PLAYER AUTOPAUSE WHEN SWITCHING TABS -----------------------------------*/
ImprovedTube.playerAutopauseWhenSwitchingTabs = function () {
	const player = this.elements.player;

	if (this.storage.player_autopause_when_switching_tabs && player) {
		if (this.focus && this.played_before_blur && this.elements.video.paused) {
			player.playVideo();
		} else {
			this.played_before_blur = !this.elements.video.paused;
			if (!this.elements.video.paused) {
				player.pauseVideo();
			}
		}
	}
};
/*--- PICTURE IN PICTURE (PIP) -----------------------------------------------*/
ImprovedTube.enterPip = function (disable) {
	const video = this.elements.video;

	if (!disable
		&& video
		&& document.pictureInPictureEnabled
		&& typeof video.requestPictureInPicture == 'function') {

		video.requestPictureInPicture().then(() => {
			if (video.paused) {
				// manually send Play message to "Auto-pause while I'm not in the tab", paused PiP wont do it automatically.
				document.dispatchEvent(new CustomEvent('it-message-from-web-accessible', {'detail': {action: 'play'}}));
			}
			return true;
		}).catch((err) => console.error('playerAutoPip: Failed to enter Picture-in-Picture mode', err));
	} else if (document.pictureInPictureElement && typeof document.exitPictureInPicture == 'function') {
		document.exitPictureInPicture();
		return false;
	}
};
/*--- PLAYER AUTO PIP WHEN SWITCHING TABS ------------------------------------*/
ImprovedTube.playerAutoPip = function () {
	const video = this.elements.video;

	if (this.storage.player_autoPip && this.storage.player_autoPip_outside && this.focus) {
		this.enterPip(true);
	} else if (this.storage.player_autoPip && !this.focus && !video?.paused) {
		this.enterPip();
	}
};
/*--- PLAYBACK SPEED ---------------------------------------------------------*/
ImprovedTube.playbackSpeed = function (newSpeed) {
	const video = this.elements.video,
		player = this.elements.player,
		speed = video?.playbackRate ? Number(video.playbackRate.toFixed(2)) : (player?.getPlaybackRate ? Number(player.getPlaybackRate().toFixed(2)) : null);

	if (!speed) {
		console.error('PlaybackSpeed: Cant establish playbackRate/getPlaybackRate');
		return false;
	}

	// called with no option or demanded speed already set, only provide readback
	if (!newSpeed || speed == newSpeed) return speed;

	if (video?.playbackRate) {
		video.playbackRate = newSpeed;
		newSpeed = video.playbackRate;
	} else if (player?.setPlaybackRate && player.getPlaybackRate) {
		player.setPlaybackRate(newSpeed);
		newSpeed = player.getPlaybackRate();
	} else newSpeed = false;

	return newSpeed;
};
/*--- FORCED PLAYBACK SPEED --------------------------------------------------*/
// FIXME
ImprovedTube.playerPlaybackSpeed = function () {
	if (this.storage.player_forced_playback_speed) {
		const player = this.elements.player,
			//video = player.querySelector('video'),
			speed = this.storage.player_playback_speed;

		if (!Number(speed)) return;
		player.setPlaybackRate(Number(speed));
		/*
		let option = this.storage.player_playback_speed;
		if (this.isset(option) === false) {
			option = 1;
		} else if ( option !== 1 && video.playbackRate !== option && (video.playbackRate > 1 || video.playbackRate < 1) ) {
			console.log("skipping permanent speed, since speed was manually set differently for this video to:" + video.playbackRate); return;
		}
		if ( !player.getVideoData().isLive || player.getVideoData().isLive === false) {
			player.setPlaybackRate(Number(option));	video.playbackRate = Number(option); // #1729 q2	// hi! @raszpl
			if ( (this.storage.player_force_speed_on_music !== true || this.storage.player_dont_speed_education === true)
		 	&& option !== 1) {
				ImprovedTube.speedException = function () {
					if (this.storage.player_dont_speed_education === true && DATA.genre === 'Education') {
						player.setPlaybackRate(Number(1));	video.playbackRate = Number(1); return;
					}
					if (this.storage.player_force_speed_on_music === true) { //player.setPlaybackRate(Number(option));	video.playbackRate = Number(option);
	 return;
					}
					if (DATA.keywords && !keywords) {
						keywords = DATA.keywords.join(', ') || '';
					}
					if (keywords === 'video, sharing, camera phone, video phone, free, upload') {
						keywords = '';
					}
					var musicIdentifiers = /(official|music|lyrics?)[ -]video|(cover|studio|radio|album|alternate)[- ]version|soundtrack|unplugged|\bmedley\b|\blo-fi\b|\blofi\b|a(lla)? cappella|feat\.|(piano|guitar|jazz|ukulele|violin|reggae)[- ](version|cover)|karaok|backing[- ]track|instrumental|(sing|play)[- ]?along|卡拉OK|卡拉OK|الكاريوكي|караоке|カラオケ|노래방|bootleg|mashup|Radio edit|Guest (vocals|musician)|(title|opening|closing|bonus|hidden)[ -]track|live acoustic|interlude|featuring|recorded (at|live)/i;
					var musicIdentifiersTitleOnly = /lyrics|theme song|\bremix|\bAMV ?[^a-z0-9]|[^a-z0-9] ?AMV\b|\bfull song\b|\bsong:|\bsong[\!$]|^song\b|( - .*\bSong\b|\bSong\b.* - )|cover ?[^a-z0-9]|[^a-z0-9] ?cover|\bconcert\b/i;
					var musicIdentifiersTitle = new RegExp(musicIdentifiersTitleOnly.source + '|' + musicIdentifiers.source, "i");
					var musicRegexMatch = musicIdentifiersTitle.test(DATA.title);
					if (!musicRegexMatch) {
						var musicIdentifiersTagsOnly = /, (lyrics|remix|song|music|AMV|theme song|full song),|\(Musical Genre\)|, jazz|, reggae/i;
						var musicIdentifiersTags = new RegExp(musicIdentifiersTagsOnly.source + '|' + musicIdentifiers.source, "i");
				  keywordsAmount = 1 + ((keywords || '').match(/,/) || []).length;
						if ( ((keywords || '').match(musicIdentifiersTags) || []).length / keywordsAmount > 0.08) {
							musicRegexMatch = true
						}
					}
					notMusicRegexMatch = /\bdo[ck]u|interv[iyj]|back[- ]?stage|インタビュー|entrevista|面试|面試|회견|wawancara|مقابلة|интервью|entretien|기록한 것|记录|記錄|ドキュメンタリ|وثائقي|документальный/i.test(DATA.title + " " + keywords);
					// (Tags/keywords shouldnt lie & very few songs titles might have these words)
					if (DATA.duration) {
						function parseDuration (duration) {
							const [_, h = 0, m = 0, s = 0] = duration.match(/PT(?:(\d+)?H)?(?:(\d+)?M)?(\d+)?S?/).map(part => parseInt(part) || 0);
							return h * 3600 + m * 60 + s;
						}
						DATA.lengthSeconds = parseDuration(DATA.duration);
					}
					function testSongDuration (s, ytMusic) {
						if (135 <= s && s <= 260) {
							return 'veryCommon';
						}
						if (105 <= s && s <= 420) {
							return 'common';
						}
						if (420 <= s && s <= 720) {
							return 'long';
						}
						if (45 <= s && s <= 105) {
							return 'short';
						}
						if (ytMusic && ytMusic > 1 && (85 <= s / ytMusic && (s / ytMusic <= 375 || ytMusic == 10))) {
							return 'multiple';
						}
						//does Youtube ever show more than 10 songs below the description?
					}
					var songDurationType = testSongDuration(DATA.lengthSeconds);
					console.log("genre: " + DATA.genre + "//title: " + DATA.title + "//keywords: " + keywords + "//music word match: " + musicRegexMatch + "// not music word match:" + notMusicRegexMatch + "//duration: " + DATA.lengthSeconds + "//song duration type: " + songDurationType);
					// check if the video is PROBABLY MUSIC:
					if ( 		( DATA.genre === 'Music' && (!notMusicRegexMatch || songDurationType === 'veryCommon'))
			|| ( musicRegexMatch && !notMusicRegexMatch && (typeof songDurationType !== 'undefined'
						|| (/album|Álbum|专辑|專輯|एलबम|البوم|アルバム|альбом|앨범|mixtape|concert|playlist|\b(live|cd|vinyl|lp|ep|compilation|collection|symphony|suite|medley)\b/i.test(DATA.title + " " + keywords)
							&& 1000 <= DATA.lengthSeconds )) ) // && 1150 <= DATA.lengthSeconds <= 5000
			||	( DATA.genre === 'Music' && musicRegexMatch && (typeof songDurationType !== 'undefined'
						|| (/album|Álbum|专辑|專輯|एलबम|البوم|アルバム|альбом|앨범|mixtape|concert|playlist|\b(live|cd|vinyl|lp|ep|compilation|collection|symphony|suite|medley)\b/i.test(DATA.title + " " + keywords)
							&& 1000 <= DATA.lengthSeconds )) ) // && DATA.lengthSeconds <= 5000
			|| (amountOfSongs && testSongDuration(DATA.lengthSeconds, amountOfSongs ) !== 'undefined')
		 //	||  location.href.indexOf('music.') !== -1  // (=currently we are only running on www.youtube.com anyways)
					)	{
						player.setPlaybackRate(1); video.playbackRate = 1; console.log ("...,thus must be music?");
					} else { 	// Now this video might rarely be music
					// - however we can make extra-sure after waiting for the video descripion to load... (#1539)
						var tries = 0; 	var intervalMs = 210; if (location.href.indexOf('/watch?') !== -1) {
							var maxTries = 10;
						} else {
							var maxTries = 0;
						}
						// ...except when it is an embedded player?
						var waitForDescription = setInterval(() => {
							if (++tries >= maxTries) {
								subtitle = document.querySelector('#title + #subtitle:last-of-type')
								if ( subtitle && 1 <= Number((subtitle?.innerHTML?.match(/^\d+/) || [])[0])	// indicates buyable/registered music (amount of songs)
						 && typeof testSongDuration(DATA.lengthSeconds, Number((subtitle?.innerHTML?.match(/^\d+/) || [])[0]) ) !== 'undefined' ) // resonable duration
								{
									player.setPlaybackRate(1); video.playbackRate = 1; console.log("...but YouTube shows music below the description!"); clearInterval(waitForDescription);
								}
								intervalMs *= 1.11;
							}
						}, intervalMs);
						window.addEventListener('load', () => {
							setTimeout(() => {
								clearInterval(waitForDescription);
							}, 1234);
						});
					}
				}
				//DATA  (TO-DO: make the Data available to more/all features? #1452  #1763  (Then can replace ImprovedTube.elements.category === 'music', VideoID is also used elsewhere)
				DATA = {};
				defaultKeywords = "video,sharing,camera,phone,video phone,free,upload";
				DATA.keywords = false; keywords = false; amountOfSongs = false;
				DATA.videoID = ImprovedTube.videoId() || false;
				ImprovedTube.fetchDOMData = function () {
					// if (history.length > 1 &&  history.state.endpoint.watchEndpoint) {
					try {
						DATA = JSON.parse(document.querySelector('#microformat script')?.textContent) ?? false; DATA.title = DATA.name;
					} catch {
						DATA.genre = false; DATA.keywords = false; DATA.lengthSeconds = false;
						try {
							DATA.title = document.getElementsByTagName('meta')?.title?.content || false;
							DATA.genre = document.querySelector('meta[itemprop=genre]')?.content || false;
							DATA.duration = document.querySelector('meta[itemprop=duration]')?.content || false;
			 } catch {}
					} if ( DATA.title === ImprovedTube.videoTitle() ) {
						keywords = document.getElementsByTagName('meta')?.keywords?.content || false; if (!keywords) {
							keyword=''
						} ImprovedTube.speedException();
					} else {
						keywords = ''; (async function () {
							try {
								const response = await fetch(`https://www.youtube.com/watch?v=${DATA.videoID}`);

								const htmlContent = await response.text();
								const metaRegex = /<meta[^>]+name=["'](keywords|genre|duration)["'][^>]+content=["']([^"']+)["'][^>]*>/gi;
								let match; while ((match = metaRegex.exec(htmlContent)) !== null) {
									const [, property, value] = match;
									if (property === 'keywords') {
										keywords = value;
									} else {
										DATA[property] = value;
									}
								}
								amountOfSongs = (htmlContent.slice(-80000).match(/},"subtitle":{"simpleText":"(\d*)\s/) || [])[1] || false;
								if (keywords) {
									ImprovedTube.speedException();
								}
							} catch (error) {
								console.error('Error: fetching from https://Youtube.com/watch?v=${DATA.videoID}', error); keywords = '';
							}
						})();
					}
				};
				if ( (history && history.length === 1) || !history?.state?.endpoint?.watchEndpoint) {
					ImprovedTube.fetchDOMData();
				} else {
				//Invidious instances. Should be updated automatically!...
					const invidiousInstances = ['invidious.fdn.fr', 'inv.tux.pizza', 'invidious.flokinet.to', 'invidious.protokolla.fi', 'invidious.private.coffee', 'yt.artemislena.eu', 'invidious.perennialte.ch', 'invidious.materialio.us', 'iv.datura.network'];
					function getRandomInvidiousInstance () {
						return invidiousInstances[Math.floor(Math.random() * invidiousInstances.length)];
					}

					(async function () {
	 let retries = 4;	let invidiousFetched = false;
						async function fetchInvidiousData () {
							try {
								const response = await fetch(`https://${getRandomInvidiousInstance()}/api/v1/videos/${DATA.videoID}?fields=genre,title,lengthSeconds,keywords`);
			 DATA = await response.json();
			 if (DATA.genre && DATA.title && DATA.keywords && DATA.lengthSeconds) {
									if (DATA.keywords.toString() === defaultKeywords ) {
										DATA.keywords = ''
									}
				 ImprovedTube.speedException(); invidiousFetched = true;
								}
							} catch (error) {
								console.error('Error: Invidious API: ', error);
							}
						}
						while (retries > 0 && !invidiousFetched) {
							await fetchInvidiousData();
							if (!invidiousFetched) {
								await new Promise(resolve => setTimeout(resolve, retries === 4 ? 1500 : 876)); retries--;
							}
						}
						if (!invidiousFetched) {
							if (document.readyState === 'loading') {
								document.addEventListener('DOMContentLoaded', ImprovedTube.fetchDOMData())
							} else {
								ImprovedTube.fetchDOMData();
							}
						}
					})();
				}
			}
		}*/
	}
};
/*--- PLAYER SUBTITLES -------------------------------------------------------*/
ImprovedTube.playerSubtitles = function () {
	const player = this.elements.player;

	if (player && player.isSubtitlesOn && player.toggleSubtitles && player.toggleSubtitlesOn) {
		switch (this.storage.player_subtitles) {
			case true:
			case 'enabled':
				player.toggleSubtitlesOn();
				break

			case 'disabled':
				if (player.isSubtitlesOn()) player.toggleSubtitles();
				break
		}
	}
};
/*--- SUBTITLES LANGUAGE -----------------------------------------------------*/
ImprovedTube.subtitlesLanguage = function () {
	const option = this.storage.subtitles_language,
		player = this.elements.player;
	let subtitlesState;

	if (option && player && player.getOption && player.setOption && player.isSubtitlesOn && player.toggleSubtitles) {
		const matchedTrack = player.getOption('captions', 'tracklist', {includeAsr: true})?.find(track => track.languageCode.includes(option) && (!track.vss_id.includes("a.") || this.storage.auto_generate));

		if (matchedTrack) {
			subtitlesState = player.isSubtitlesOn();
			player.setOption('captions', 'track', matchedTrack);
			// setOption forces Subtitles ON, restore state from before calling it.
			if (!subtitlesState) player.toggleSubtitles();
		}
	}
};
/*------------------------------------------------------------------------------
SUBTITLES FONT FAMILY
SUBTITLES FONT COLOR
SUBTITLES FONT SIZE
SUBTITLES BACKGROUND COLOR
SUBTITLES BACKGROUND OPACITY
SUBTITLES WINDOW COLOR
SUBTITLES WINDOW OPACITY
SUBTITLES CHARACTER EDGE STYLE
SUBTITLES FONT OPACITY
default = {
	"fontFamily": 4,
	"color": "#fff",
	"fontSizeIncrement": 0,
	"background": "#080808",
	"backgroundOpacity": 0.75,
	"windowColor": "#080808",
	"windowOpacity": 0,
	"charEdgeStyle": 0,
	"textOpacity": 1,
},
--- SUBTITLES USER SETTINGS --------------------------------------------------*/
ImprovedTube.subtitlesUserSettings = function () {
	const ourSettings = {
			fontFamily: this.storage.subtitles_font_family,
			color: this.storage.subtitles_font_color,
			fontSizeIncrement: this.storage.subtitles_font_size,
			background: this.storage.subtitles_background_color,
			backgroundOpacity: this.storage.subtitles_background_opacity,
			windowColor: this.storage.subtitles_window_color,
			windowOpacity: this.storage.subtitles_window_opacity,
			charEdgeStyle: this.storage.subtitles_character_edge_style,
			textOpacity: this.storage.subtitles_font_opacity
		},
		userSettings = Object.keys(ourSettings).filter(e => ourSettings[e]),
		player = this.elements.player;

	if (userSettings.length && player && player.getSubtitlesUserSettings && player.updateSubtitlesUserSettings) {
		let ytSettings = player.getSubtitlesUserSettings(),
			setting;

		if (!ytSettings) return; //null SubtitlesUserSettings seem to mean subtitles not available

		for (const value of userSettings) {
			setting = null;
			switch (value) {
				case 'fontFamily':
				case 'fontSizeIncrement':
				case 'charEdgeStyle':
					setting = Number(ourSettings[value]);
					break;

				case 'color':
				case 'background':
				case 'windowColor':
					setting = ourSettings[value];
					break;

				case 'backgroundOpacity':
				case 'windowOpacity':
				case 'textOpacity':
					setting = Number(ourSettings[value]) / 100;
					break;
			}

			if (Object.keys(ytSettings).includes(value)) {
				ytSettings[value] = setting;
			} else {
				console.error('subtitlesUserSettings failed at: ', value, setting);
			}
		}
		player.updateSubtitlesUserSettings(ytSettings);
	}
};
/*--- SUBTITLES DISABLE FOR LYRICS -------------------------------------------*/
ImprovedTube.subtitlesDisableLyrics = function () {
	if (this.storage.subtitles_disable_lyrics) {
		const player = this.elements.player;

		if (player && player.isSubtitlesOn && player.isSubtitlesOn() && player.toggleSubtitles) {
			// Music detection only uses 3 identifiers for Lyrics: lyrics, sing-along, karaoke.
			// Easier to simply use those here. Can replace with music detection later.
			const terms = ["sing along", "sing-along", "karaoke", "lyric", "卡拉OK", "卡拉OK", "الكاريوكي", "караоке", "カラオケ", "노래방"];
			if (terms.some(term => this.videoTitle().toLowerCase().includes(term))) {
				player.toggleSubtitles();
			}
		}
	}
};
/*--- UP NEXT AUTOPLAY -------------------------------------------------------*/
ImprovedTube.upNextAutoplay = function (event) {
	const option = this.storage.up_next_autoplay,
		button = document.querySelector('.ytp-autonav-toggle-button');

	if (!button) return;
	if ((option && button.getAttribute('aria-checked') === 'false')
		|| (!option && button.getAttribute('aria-checked') === 'true')) {

		button.click();
		// we only end up here when Video just Finished and up_next_autoplay
		// had to make an adjustment. Only way to make that adjustment take effect is to revind a smidge and play() again.
		if (event) {
			if (event.target.duration === event.target.currentTime) {
				event.target.currentTime -=0.1;
				event.target.play();
			}
		}
	}
};
/*--- PLAYER ADS -------------------------------------------------------------*/
ImprovedTube.playerAds = function (node) {
	if (!node) return;

	function observe (mutationList) {
		function skip (parent) {
			const button = parent.querySelector('.ytp-ad-skip-button-modern.ytp-button,[class*="ytp-ad-skip-button"].ytp-button') || parent,
				video = this.elements.video;
			function skipAd () {
				if (video) video.currentTime = video.duration;
				if (button) button.click();
			}

			if (this.storage.ads === 'block_all') {
				skipAd();
			} else if (this.storage.ads === 'subscribed_channels') {
				if (!parent.querySelector('#meta paper-button[subscribed]')) {
					skipAd();
				}
			} else if (this.storage.ads === 'block_music') {
				if (ImprovedTube.elements.category === 'music') {
					skipAd();
				}
			} else if (this.storage.ads === 'small_creators') {
				const userDefiniedLimit = this.storage.smallCreatorsCount * parseInt(this.storage.smallCreatorsUnit),
					subscribersNumber = ImprovedTube.extractSubscriberCount();
				if (subscribersNumber > userDefiniedLimit) {
					skipAd();
				}
			}
		};

		for (let i = 0, l = mutationList.length; i < l; i++) {
			const mutation = mutationList[i];

			if (mutation.type === 'childList') {
				for (var j = 0, k = mutation.addedNodes.length; j < k; j++) {
					const node = mutation.addedNodes[j];

					if (node instanceof Element
						&& node.querySelector('ytp-ad-player-overlay, .ytp-ad-text, .ytp-ad-overlay-close-container, ytd-button-renderer#dismiss-button, *[id^="ad-text"], *[id^="skip-button"], .ytp-ad-skip-button.ytp-button, .ytp-ad-skip-button-modern.ytp-button')) skip(node);
				}
			} else if (mutation.target instanceof HTMLElement
				&& mutation.type === 'attributes'
				&& mutation.attributeName === 'id'
				&& mutation.target.querySelector('*[id^="ad-text"], *[id^="skip-button"], .ytp-ad-skip-button-modern.ytp-button')) skip(mutation.target);
		}
	};

	if (this.storage.ads) {
		if (!ImprovedTube.playerAds.node) {
			// call once to change whats there now
			observe();
			// monitor description
			ImprovedTube.playerAds.node = node;
			ImprovedTube.playerAds.observer = new MutationObserver(observe);
			ImprovedTube.playerAds.observer.observe(node, {
				childList: true,
				subtree: true
			});
		}
	} else {
		if (ImprovedTube.playerAds.node) {
			ImprovedTube.playerAds.observer.disconnect();
			delete ImprovedTube.playerAds.node;
		}
	}
};
/*--- PLAYER AUTO FULLSCREEN -------------------------------------------------*/
ImprovedTube.playerAutofullscreen = function () {
	if (this.storage.player_autofullscreen
		&& document.documentElement.dataset.pageType === 'video'
		&& !document.fullscreenElement) {

		this.elements.player.toggleFullscreen();
	}
};
/*--- PLAYER QUALITY ---------------------------------------------------------*/
ImprovedTube.playerQuality = function (quality = this.storage.player_quality) {
	const player = this.elements.player;
	if (quality
		&& player && player.getAvailableQualityLevels
		&& (!player.dataset.defaultQuality || player.dataset.defaultQuality != quality)) {

		const available_quality_levels = player.getAvailableQualityLevels();
		function closest (num, arr) {
			let curr = arr[0];
			let diff = Math.abs(num - curr);
			for (let val = 1; val < arr.length; val++) {
				let newdiff = Math.abs(num - arr[val]);
				if (newdiff < diff) {
					diff = newdiff;
					curr = arr[val];
				}
			}
			return curr;
		};

		if (!available_quality_levels.includes(quality)) {
			const label = ['tiny', 'small', 'medium', 'large', 'hd720', 'hd1080', 'hd1440', 'hd2160', 'hd2880', 'highres'],
				resolution = ['144', '240', '360', '480', '720', '1080', '1440', '2160', '2880', '4320'],
				availableresolutions = available_quality_levels.map(q => resolution[label.indexOf(q)]);
			quality = label[resolution.indexOf(closest(resolution[label.indexOf(quality)], availableresolutions))];
		}
		player.setPlaybackQualityRange(quality);
		player.setPlaybackQuality(quality);
		player.dataset.defaultQuality = quality;
	}
};
/*--- PLAYER QUALITY WITHOUT FOCUS -------------------------------------------*/
ImprovedTube.playerQualityWithoutFocus = function () {
	const player = this.elements.player,
		qualityWithoutFocus = this.storage.player_quality_without_focus;
	if (qualityWithoutFocus && qualityWithoutFocus !== 'auto' && player && player.getPlaybackQuality) {
		if (this.focus) {
			if (ImprovedTube.qualityBeforeBlur) {
				ImprovedTube.playerQuality(ImprovedTube.qualityBeforeBlur);
				ImprovedTube.qualityBeforeBlur = undefined;
			}
		} else {
			if (!ImprovedTube.elements.video.paused) {
				if (!ImprovedTube.qualityBeforeBlur) {
					ImprovedTube.qualityBeforeBlur = player.getPlaybackQuality();
				}
				ImprovedTube.playerQuality(qualityWithoutFocus);
			}
		}
	}
};
/*------------------------------------------------------------------------------
BATTERY FEATURES; PLAYER QUALITY BASED ON POWER STATUS
------------------------------------------------------------------------------*/
ImprovedTube.batteryFeatures = async function () {
	if (ImprovedTube.storage.qualityWhenRunningOnBattery
		  || ImprovedTube.storage.pauseWhileIUnplugTheCharger
		  || ImprovedTube.storage.whenBatteryIslowDecreaseQuality) {
		  const updateQuality = async (battery, charging) => {
			  if (battery) {
				if (!battery.charging) {
					if (ImprovedTube.storage.pauseWhileIUnplugTheCharger && charging) {
						ImprovedTube.elements.player.pauseVideo();
						ImprovedTube.paused = true;
					}
					if (ImprovedTube.storage.qualityWhenRunningOnBattery) {
						ImprovedTube.playerQuality(ImprovedTube.storage.qualityWhenRunningOnBattery);
					}
					if (ImprovedTube.storage.whenBatteryIslowDecreaseQuality) {
						let quality;
						if (battery.level > 0.11 || battery.dischargingTime > 900) {
							quality = "large";
						} else if (battery.level > 0.08 || battery.dischargingTime > 600) {
							quality = "medium";
						} else if (battery.level > 0.04 || battery.dischargingTime > 360) {
							quality = "small";
						} else {
							quality = "tiny";
						}
						ImprovedTube.playerQuality(quality);
					}
				} else if (charging && ImprovedTube.paused && ImprovedTube.storage.pauseWhileIUnplugTheCharger) {
					ImprovedTube.elements.player.playVideo();
					delete ImprovedTube.paused;
				}
			}
		};
		const battery = await navigator.getBattery();
		battery.addEventListener("levelchange", () => updateQuality(battery));
		battery.addEventListener("chargingchange", () => updateQuality(battery, true));
		await updateQuality(battery);
	}
};
/*--- PLAYER FORCED VOLUME -----------------------------------------------------*/
ImprovedTube.playerForcedVolume = function () {
	const player = this.elements.player;

	if (player && this.storage.player_forced_volume) {
		let volume = this.storage.player_volume;

		if (!this.isset(volume)) {
			volume = 100;
		} else {
			volume = Number(volume);
		}

		if (!this.audioContextGain && volume <= 100) {
			if (this.audioContext) this.audioContext.close();

			player.setVolume(volume);
		} else if (typeof AudioContext ==='function') {
			if (!this.audioContext) {
				this.audioContext = new AudioContext();

				this.audioContextSource = this.audioContext.createMediaElementSource(document.querySelector('video'));
				this.audioContextGain = this.audioContext.createGain();

				this.audioContextGain.gain.value = 1;
				this.audioContextSource.connect(this.audioContextGain);
				this.audioContextGain.connect(this.audioContext.destination)
			}
			if (player.getVolume() !== 100) player.setVolume(100);

			this.audioContextGain.gain.value = volume / 100;
		}
	}
};
/*--- PLAYER LOUDNESS NORMALIZATION ------------------------------------------*/
ImprovedTube.playerLoudnessNormalization = function () {
	const video = this.elements.video;

	function onvolumechange () {
		if (document.querySelector('.ytp-volume-panel') && ImprovedTube.storage.player_loudness_normalization === false) {
			let volume = Number(document.querySelector('.ytp-volume-panel').getAttribute('aria-valuenow'));
			this.volume = volume / 100;
		}
	};

	if (video) {
		video.removeEventListener('volumechange', onvolumechange);
		video.addEventListener('volumechange', onvolumechange);
	}

	if (this.storage.player_loudness_normalization === false) {
		try {
			let local_storage = localStorage['yt-player-volume'];

			if (this.isset(Number(this.storage.player_volume)) && this.storage.player_forced_volume === true) {
				return;
			} else if (local_storage) {
				local_storage = JSON.parse(JSON.parse(local_storage).data);

				local_storage = Number(local_storage.volume);

				video.volume = local_storage / 100;
			} else {
				video.volume = 100;
			}
		} catch (err) {}
	}
};
/*--- SCREENSHOT -------------------------------------------------------------*/
ImprovedTube.screenshot = function () {
	const video = ImprovedTube.elements.video,
		cvs = document.createElement('canvas'),
		ctx = cvs.getContext('2d');
	let subText = '';

	function renderSubtitle (ctx, captionElements) {
		if (!ctx || !captionElements) return;
		captionElements.forEach(function (captionElement, index) {
			const captionText = captionElement.textContent.trim(),
				captionStyles = window.getComputedStyle(captionElement);

			ctx.fillStyle = captionStyles.color;
			ctx.font = captionStyles.font;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'bottom';
			const txtWidth = ctx.measureText(captionText).width,
				txtHeight = parseFloat(captionStyles.fontSize),
				xOfset = (ctx.canvas.width - txtWidth) / 2,
				padding = 5, // Adjust the padding as needed
				yofset = ctx.canvas.height - (captionElements.length - index) * (txtHeight + 2 * padding);

			ctx.fillStyle = captionStyles.backgroundColor;
			ctx.fillRect(xOfset - padding, yofset - txtHeight - padding, txtWidth + 2 * padding, txtHeight + 2 * padding);
			ctx.fillStyle = captionStyles.color;
			ctx.fillText(captionText, xOfset + txtWidth / 2, yofset);
		});
	};

	cvs.width = video.videoWidth;
	cvs.height = video.videoHeight;

	ctx.drawImage(video, 0, 0, cvs.width, cvs.height);

	if (ImprovedTube.storage.embed_subtitle != false) {
		let captionElements = document.querySelectorAll('.captions-text .ytp-caption-segment');
		captionElements.forEach(function (caption) { subText += caption.textContent.trim() + ' '; });

		renderSubtitle(ctx, captionElements);
	}

	cvs.toBlob(function (blob) {
		if (ImprovedTube.storage.player_screenshot_save_as == 'clipboard') {
			window.focus();
			navigator.clipboard.write([
				new ClipboardItem({
					'image/png': blob
				})
			])
				.then(function () { console.log("ImprovedTube: Screeeeeeenshot tada!"); })
				.catch(function (error) {
					console.log('ImprovedTube screenshot: ', error);
					alert('ImprovedTube Screenshot to Clipboard error. Details in Debug Console.');
				});
		} else {
			let a = document.createElement('a');
			a.href = URL.createObjectURL(blob);
			a.download = (ImprovedTube.videoId() || location.href.match) + ' ' + new Date(ImprovedTube.elements.player.getCurrentTime() * 1000).toISOString().substr(11, 8).replace(/:/g, '-') + ' ' + ImprovedTube.videoTitle() + (subText ? ' - ' + subText.trim() : '') + '.png';
			a.click();
			console.log("ImprovedTube: Screeeeeeenshot tada!");
		}
	});
};
/*--- PLAYER SCREENSHOT BUTTON ------------------------------------------------*/
ImprovedTube.playerScreenshotButton = function () {
	if (this.storage.player_screenshot_button) {
		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
			path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

		svg.setAttributeNS(null, 'viewBox', '0 0 24 24');
		path.setAttributeNS(null, 'd', 'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z');

		svg.appendChild(path);

		this.createPlayerButton({
			id: 'it-screenshot-button',
			child: svg,
			opacity: 0.64,
			onclick: this.screenshot,
			title: 'Screenshot'
		});
	}
};
/*--- PLAYER REPEAT -----------------------------------------------------------*/
ImprovedTube.playerRepeat = function () {
	if (!this.storage.player_repeat_button) return;

	const player = this.elements.player,
		video = this.elements.video;

	if (!player || !video) return;

	if (!/ad-showing/.test(player.className)) {
		video.setAttribute('loop', '');
	}
};
/*--- PLAYER REPEAT BUTTON ---------------------------------------------------*/
ImprovedTube.playerRepeatButton = function () {
	if (this.storage.player_repeat_button) {
		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
			path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		svg.setAttributeNS(null, 'viewBox', '0 0 24 24');
		path.setAttributeNS(null, 'd', 'M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2V9h-1l-2 1v1h1.5v4H13z');
		svg.appendChild(path);
		let transparentOrOn = 0.5;
		if (this.storage.player_always_repeat === true ) transparentOrOn = 1;
		this.createPlayerButton({
			id: 'it-repeat-button',
			child: svg,
			opacity: transparentOrOn,
			onclick: function () {
				const video = ImprovedTube.elements.video;
				function matchLoopState (opacity) {
					const thisButton = document.querySelector('#it-repeat-button');
					thisButton.style.opacity = opacity;
					if (ImprovedTube.storage.below_player_loop !== false) {
						const otherButton = document.querySelector('#it-below-player-loop');
						otherButton.children[0].style.opacity = opacity;
					}
				}
				if (video.hasAttribute('loop')) {
					video.removeAttribute('loop');
					matchLoopState('.5');
				} else if (!/ad-showing/.test(ImprovedTube.elements.player.className)) {
					video.setAttribute('loop', '');
					matchLoopState('1');
				}
			},
			title: 'Repeat',
		});
	}
};
/*--- PLAYER ROTATE BUTTON ---------------------------------------------------*/
ImprovedTube.playerRotateButton = function () {
	if (this.storage.player_rotate_button) {
		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
			path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

		svg.setAttributeNS(null, 'viewBox', '0 0 24 24');
		path.setAttributeNS(null, 'd', 'M15.55 5.55L11 1v3.07a8 8 0 0 0 0 15.86v-2.02a6 6 0 0 1 0-11.82V10l4.55-4.45zM19.93 11a7.9 7.9 0 0 0-1.62-3.89l-1.42 1.42c.54.75.88 1.6 1.02 2.47h2.02zM13 17.9v2.02a7.92 7.92 0 0 0 3.9-1.61l-1.44-1.44c-.75.54-1.59.89-2.46 1.03zm3.89-2.42l1.42 1.41A7.9 7.9 0 0 0 19.93 13h-2.02a5.9 5.9 0 0 1-1.02 2.48z');

		svg.appendChild(path);

		this.createPlayerButton({
			id: 'it-rotate-button',
			child: svg,
			opacity: 0.85,
			onclick: function () {
				const player = ImprovedTube.elements.player,
					video = ImprovedTube.elements.video;
				let rotate = Number(document.body.dataset.itRotate) || 0,
					transform = '';

				rotate += 90;

				if (rotate === 360) {
					rotate = 0;
				}

				document.body.dataset.itRotate = rotate;

				transform += 'rotate(' + rotate + 'deg)';

				if (rotate == 90 || rotate == 270) {
					const is_vertical_video = video.videoHeight > video.videoWidth;

					transform += ' scale(' + (is_vertical_video ? player.clientWidth : player.clientHeight) / (is_vertical_video ? player.clientHeight : player.clientWidth) + ')';
				}

				if (!ImprovedTube.elements.buttons['it-rotate-styles']) {
					const style = document.createElement('style');

					ImprovedTube.elements.buttons['it-rotate-styles'] = style;

					document.body.appendChild(style);
				}

				ImprovedTube.elements.buttons['it-rotate-styles'].textContent = 'video{transform:' + transform + '}';
			},
			title: 'Rotate'
		});
	}
};
/*--- PLAYER FIT-TO-WIN BUTTON -----------------------------------------------*/
ImprovedTube.playerFitToWinButton = function () {
	if (this.storage.player_fit_to_win_button === true && (/watch\?/.test(location.href))) {
		let tempContainer = document.createElement("div");
		tempContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" id="ftw-icon">
		<path d="M21 3 9 15"/><path d="M12 3H3v18h18v-9"/><path d="M16 3h5v5"/><path d="M14 15H9v-5"/></svg>`;
		const svg = tempContainer.firstChild;
		this.createPlayerButton({
			id: 'it-fit-to-win-player-button',
			child: svg,
			opacity: 0.85,
			position: "right",
			onclick: function () {
				let previousSize = ImprovedTube.storage.player_size === "fit_to_window" ? "do_not_change" : (ImprovedTube.storage.player_size ?? "do_not_change");
				let isFTW = document.querySelector("html").getAttribute("it-player-size") === "fit_to_window"
				if (isFTW) {
					document.querySelector("html").setAttribute("it-player-size", previousSize);
				} else {
					document.querySelector("html").setAttribute("it-player-size", "fit_to_window");
				}
				window.dispatchEvent(new Event("resize"));
			},
			title: 'Fit To Window'
		});
	}
};
/*--- PLAYER CINEMA MODE BUTTON ----------------------------------------------*/
ImprovedTube.playerCinemaModeButton = function () {
	if (location.pathname != '/watch') return;
	if (!this.storage.player_cinema_mode_button) return;
	const player = this.elements.player,
		controls = this.elements.player_left_controls;

	if (!player || !controls) {
		console.error('playerCinemaModeButton: need player with valid controls element');
		return;
	}

	let button = player.querySelector('#it-cinema-mode-button');
	if (button) return; // skip button creation if one already exists

	button = this.createIconButton({
		type: 'playerCinemaMode',
		id: 'it-cinema-mode-button',
		className: 'ytp-button it-player-button',
		tooltip: 'Cinema Mode',
		onclick: function () {
			if (this.style.opacity === '1') {
				this.style.opacity = .64;
				delete ImprovedTube.storage.player_auto_cinema_mode;
				ImprovedTube.playerAutoCinemaMode();
			} else {
				this.style.opacity = 1;
				ImprovedTube.storage.player_auto_cinema_mode = true;
				ImprovedTube.playerAutoCinemaMode();
			}
		}
	});
	controls.insertBefore(button, controls.childNodes[3]);
	if (this.storage.player_auto_cinema_mode) button?.style.setProperty('opacity', 1);
};

ImprovedTube.playerAutoCinemaMode = function (disable) {
	if (location.pathname != '/watch') return;
	const player = this.elements.player,
		video = this.elements.video;

	if (!player || !video) return; // need player and video

	let overlay = document.getElementById('overlay_cinema');

	if (this.storage.player_auto_cinema_mode && !disable) {
		player.style.zIndex = 'calc(var(--ytd-z-index-toggle-button-tooltip) + 2)';

		if (!overlay) {
			overlay = document.createElement('div');
			overlay.id = 'overlay_cinema';
			overlay.style.position = 'fixed';
			overlay.style.top = '0';
			overlay.style.left = '0';
			overlay.style.width = '100%';
			overlay.style.height = '100%';
			overlay.style.backgroundColor = 'rgba(0, 0, 0, 1)';
			overlay.style.zIndex = 'calc(var(--ytd-z-index-toggle-button-tooltip) + 1)';
			overlay.style.display = 'none';
			document.body.appendChild(overlay);
		}
		setTimeout(function () {
			if (video.paused || !ImprovedTube.storage.player_auto_cinema_mode) return;
			overlay.style.display = 'block';
		}, 200);

	} else if (overlay && (!this.storage.player_auto_cinema_mode || disable)) {
		setTimeout(function () {
			if (!video.paused && ImprovedTube.storage.player_auto_cinema_mode) return;
			player.style.removeProperty('z-index');
			overlay?.style.setProperty('display', 'none');
		}, 200);
	}
};
/*--- PLAYER HAMBURGER MENU --------------------------------------------------*/
ImprovedTube.playerHamburgerButton = function () {
	if (this.storage.player_hamburger_button) {
		const player = this.elements.player;

		if (!player) return;

		const controlsContainer = player.querySelector('.ytp-right-controls');

		if (!controlsContainer) return;

		let hamburgerMenu = document.querySelector('.custom-hamburger-menu');
		if (!hamburgerMenu) {
			hamburgerMenu = document.createElement('div');
			hamburgerMenu.className = 'custom-hamburger-menu';
			hamburgerMenu.style.position = 'absolute';
			hamburgerMenu.style.right = '0';
			hamburgerMenu.style.marginTop = '8px';
			hamburgerMenu.style.cursor = 'pointer';

			const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			svg.setAttributeNS(null, 'viewBox', '0 0 24 24');
			svg.setAttribute('style', 'width: 32px; height: 32px;');

			const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			path.setAttributeNS(null, 'd', 'M3 18h18v-2H3v2zM3 13h18v-2H3v2zM3 6v2h18V6H3z');
			path.setAttributeNS(null, 'fill', 'white');

			svg.appendChild(path);
			hamburgerMenu.appendChild(svg);

			controlsContainer.style.paddingRight = '40px';
			controlsContainer.parentNode.appendChild(hamburgerMenu);

			let controlsVisible = true;
			controlsContainer.style.display = controlsVisible ? 'none' : 'flex';
			controlsVisible = false;

			hamburgerMenu.addEventListener('click', function () {
				controlsContainer.style.display = controlsVisible ? 'none' : 'flex';
				controlsVisible = !controlsVisible;

				// Change the opacity of hamburgerMenu based on controls visibility
				hamburgerMenu.style.opacity = controlsVisible ? '0.85' : '0.65';
			});
		}
	}
};
/*--- PLAYER POPUP BUTTON ----------------------------------------------------*/
ImprovedTube.playerPopupButton = function () {
	if (location.pathname === '/embed') return;
	if (this.storage.player_popup_button) {
		const player = this.elements.player,
			video = this.elements.video,
			controls = this.elements.player_left_controls;

		if (!player || !video || !controls) {
			console.error('playerPopupButton: need player with valid controls and video element');
			return;
		}

		let button = player.querySelector("#it-popup-player-button");
		if (button) return; // skip button creation if one already exists

		button = this.createIconButton({
			type: 'playerPopup',
			id: 'it-popup-player-button',
			className: 'ytp-button it-player-button',
			tooltip: 'Popup',
			onclick: function () {
				const videoID = location.href.match(ImprovedTube.regex.video_id)?.[1],
					playlistID = location.href.match(ImprovedTube.regex.playlist_id)?.[1],
					url = location.protocol + '//www.youtube.com/embed/' + videoID
						+ '?autoplay=' + (video.paused ? '0' : '1')
						+ (video.currentTime > 5 ? '&start=' + parseInt(video.currentTime) : '')
						+ (playlistID ? '&list=' + playlistID : '');

				if (!videoID) return; // no clicking for you! run away

				player.pauseVideo();
				ImprovedTube.messageSend({
					action: 'popup',
					url: url,
					width: parseInt(player.offsetWidth * 0.75),
					height: parseInt(player.offsetHeight * 0.75)
				});
			}
		});
		controls.insertBefore(button, controls.childNodes[3]);
	} else {
		document.querySelector("#it-popup-player-button")?.remove();
	}
};
/*--- Force SDR --------------------------------------------------------------*/
ImprovedTube.playerSDR = function () {
	if (this.storage.player_SDR) {
		Object.defineProperty(window.screen, 'pixelDepth', {
			enumerable: true,
			configurable: true,
			value: 24
		});
	}
};
/*--- PLAYER HIDE CONTROLS ---------------------------------------------------*/
ImprovedTube.playerHideControls = function () {
	const player = this.elements.player,
		hide = this.storage.player_hide_controls;

	if (player && player.hideControls && player.showControls) {

		if (hide === 'when_paused' && this.elements.video.paused) {
			player.hideControls();

			player.onmouseenter = player.showControls;
			player.onmouseleave = player.hideControls;
			player.onmousemove = (function () {
				let thread,
					onmousestop = function () {
						if (document.querySelector(".ytp-progress-bar:hover")) {
							thread = setTimeout(onmousestop, 1000);
						} else {
							player.hideControls();
						}
					};

				return function () {
					player.showControls();
					clearTimeout(thread);
					thread = setTimeout(onmousestop, 1000);
				};
			})();
			return;
		} else if (hide === 'always') {
			player.hideControls();
		} else {
			player.showControls();
		}
		player.onmouseenter = null;
		player.onmouseleave = null;
		player.onmousemove = null;
	}
};
/*--- CUSTOM MINI-PLAYER -----------------------------------------------------*/
ImprovedTube.mini_player__setSize = function (width, height, keep_ar, keep_area) {
	if (keep_ar) {
		const aspect_ratio = ImprovedTube.elements.video.style.width.replace('px', '') / ImprovedTube.elements.video.style.height.replace('px', '');
		if (keep_area) {
			height = Math.sqrt((width * height) / aspect_ratio);
			width = height * aspect_ratio;
		} else {
			height = width / aspect_ratio;
		}
	}

	ImprovedTube.elements.player.style.width = width + 'px';
	ImprovedTube.elements.player.style.height = height + 'px';
};

ImprovedTube.miniPlayer_scroll = function () {
	if (window.scrollY >= 256 && ImprovedTube.mini_player__mode === false && ImprovedTube.elements.player.classList.contains('ytp-player-minimized') === false) {
		ImprovedTube.mini_player__mode = true;

		ImprovedTube.mini_player__original_width = ImprovedTube.elements.player.offsetWidth;
		ImprovedTube.mini_player__original_height = ImprovedTube.elements.player.offsetHeight;

		ImprovedTube.elements.player.classList.add('it-mini-player');

		ImprovedTube.mini_player__x = Math.max(0, Math.min(ImprovedTube.mini_player__x, document.body.offsetWidth - ImprovedTube.mini_player__width));
		ImprovedTube.mini_player__y = Math.max(0, Math.min(ImprovedTube.mini_player__y, window.innerHeight - ImprovedTube.mini_player__height));

		ImprovedTube.mini_player__cursor = '';
		document.documentElement.removeAttribute('it-mini-player-cursor');

		ImprovedTube.elements.player.style.transform = 'translate(' + ImprovedTube.mini_player__x + 'px, ' + ImprovedTube.mini_player__y + 'px)';

		ImprovedTube.mini_player__setSize(ImprovedTube.mini_player__width, ImprovedTube.mini_player__height, true, true);

		window.addEventListener('mousedown', ImprovedTube.miniPlayer_mouseDown);
		window.addEventListener('mousemove', ImprovedTube.miniPlayer_cursorUpdate);

		window.dispatchEvent(new Event('resize'));
	} else if (window.scrollY < 256 && ImprovedTube.mini_player__mode === true || ImprovedTube.elements.player.classList.contains('ytp-player-minimized') === true) {
		ImprovedTube.mini_player__mode = false;
		ImprovedTube.elements.player.classList.remove('it-mini-player');
		ImprovedTube.mini_player__move = false;
		ImprovedTube.elements.player.style.transform = 'translate(' + 0 + 'px, ' + 0 + 'px)';
		ImprovedTube.elements.player.style.width = '';
		ImprovedTube.elements.player.style.height = '';

		ImprovedTube.mini_player__cursor = '';
		document.documentElement.removeAttribute('it-mini-player-cursor');

		window.removeEventListener('mousedown', ImprovedTube.miniPlayer_mouseDown);
		window.removeEventListener('mousemove', ImprovedTube.miniPlayer_cursorUpdate);

		window.dispatchEvent(new Event('resize'));
	}
};

ImprovedTube.miniPlayer_mouseDown = function (event) {
	if (event.button !== 0) {
		return false;
	}

	if (ImprovedTube.miniPlayer_resize() === true) {
		return false;
	}

	let is_player = false,
		path = event.composedPath();

	for (let i = 0, l = path.length; i < l; i++) {
		if ((path[i].classList && path[i].classList.contains('it-mini-player')) === true) {
			is_player = true;
		}
	}

	if (is_player === false) {
		return false;
	}

	event.preventDefault();

	const bcr = ImprovedTube.elements.player.getBoundingClientRect();

	ImprovedTube.miniPlayer_mouseDown_x = event.clientX;
	ImprovedTube.miniPlayer_mouseDown_y = event.clientY;
	ImprovedTube.mini_player__width = bcr.width;
	ImprovedTube.mini_player__height = bcr.height;

	ImprovedTube.mini_player__player_offset_x = event.clientX - bcr.x;
	ImprovedTube.mini_player__player_offset_y = event.clientY - bcr.y;

	ImprovedTube.mini_player__max_x = document.body.offsetWidth - ImprovedTube.mini_player__width;
	ImprovedTube.mini_player__max_y = window.innerHeight - ImprovedTube.mini_player__height;

	window.addEventListener('mouseup', ImprovedTube.miniPlayer_mouseUp);
	window.addEventListener('mousemove', ImprovedTube.miniPlayer_mouseMove);
};

ImprovedTube.miniPlayer_mouseUp = function () {
	const strg = JSON.parse(localStorage.getItem('improvedtube-mini-player')) || {};

	strg.x = ImprovedTube.mini_player__x;
	strg.y = ImprovedTube.mini_player__y;

	localStorage.setItem('improvedtube-mini-player', JSON.stringify(strg));

	window.removeEventListener('mouseup', ImprovedTube.miniPlayer_mouseUp);
	window.removeEventListener('mousemove', ImprovedTube.miniPlayer_mouseMove);

	ImprovedTube.mini_player__move = false;

	setTimeout(function () {
		window.removeEventListener('click', ImprovedTube.miniPlayer_click, true);
	});
};

ImprovedTube.miniPlayer_click = function (event) {
	event.stopPropagation();
	event.preventDefault();
};

ImprovedTube.miniPlayer_mouseMove = function (event) {
	if (
		event.clientX < ImprovedTube.miniPlayer_mouseDown_x - 5 ||
		event.clientY < ImprovedTube.miniPlayer_mouseDown_y - 5 ||
		event.clientX > ImprovedTube.miniPlayer_mouseDown_x + 5 ||
		event.clientY > ImprovedTube.miniPlayer_mouseDown_y + 5
	) {
		let x = event.clientX - ImprovedTube.mini_player__player_offset_x,
			y = event.clientY - ImprovedTube.mini_player__player_offset_y;

		if (ImprovedTube.mini_player__move === false) {
			ImprovedTube.mini_player__move = true;

			window.addEventListener('click', ImprovedTube.miniPlayer_click, true);
		}

		if (x < 0) {
			x = 0;
		}

		if (y < 0) {
			y = 0;
		}

		if (x > ImprovedTube.mini_player__max_x) {
			x = ImprovedTube.mini_player__max_x;
		}

		if (y > ImprovedTube.mini_player__max_y) {
			y = ImprovedTube.mini_player__max_y;
		}

		ImprovedTube.mini_player__x = x;
		ImprovedTube.mini_player__y = y;

		ImprovedTube.elements.player.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
	}
};

ImprovedTube.miniPlayer_cursorUpdate = function (event) {
	let x = event.clientX,
		y = event.clientY,
		c = ImprovedTube.mini_player__cursor;

	if (
		x >= ImprovedTube.mini_player__x + ImprovedTube.mini_player__width - ImprovedTube.miniPlayer_resize_offset &&
		x <= ImprovedTube.mini_player__x + ImprovedTube.mini_player__width &&
		y >= ImprovedTube.mini_player__y &&
		y <= ImprovedTube.mini_player__y + ImprovedTube.miniPlayer_resize_offset
	) {
		c = 'ne-resize';
	} else if (
		x >= ImprovedTube.mini_player__x + ImprovedTube.mini_player__width - ImprovedTube.miniPlayer_resize_offset &&
		x <= ImprovedTube.mini_player__x + ImprovedTube.mini_player__width &&
		y >= ImprovedTube.mini_player__y + ImprovedTube.mini_player__height - ImprovedTube.miniPlayer_resize_offset &&
		y <= ImprovedTube.mini_player__y + ImprovedTube.mini_player__height
	) {
		c = 'se-resize';
	} else if (
		x >= ImprovedTube.mini_player__x &&
		x <= ImprovedTube.mini_player__x + ImprovedTube.miniPlayer_resize_offset &&
		y >= ImprovedTube.mini_player__y + ImprovedTube.mini_player__height - ImprovedTube.miniPlayer_resize_offset &&
		y <= ImprovedTube.mini_player__y + ImprovedTube.mini_player__height
	) {
		c = 'sw-resize';
	} else if (
		x >= ImprovedTube.mini_player__x &&
		x <= ImprovedTube.mini_player__x + ImprovedTube.miniPlayer_resize_offset &&
		y >= ImprovedTube.mini_player__y &&
		y <= ImprovedTube.mini_player__y + ImprovedTube.miniPlayer_resize_offset
	) {
		c = 'nw-resize';
	} else if (
		x >= ImprovedTube.mini_player__x &&
		x <= ImprovedTube.mini_player__x + ImprovedTube.mini_player__width &&
		y >= ImprovedTube.mini_player__y &&
		y <= ImprovedTube.mini_player__y + ImprovedTube.miniPlayer_resize_offset
	) {
		c = 'n-resize';
	} else if (
		x >= ImprovedTube.mini_player__x + ImprovedTube.mini_player__width - ImprovedTube.miniPlayer_resize_offset &&
		x <= ImprovedTube.mini_player__x + ImprovedTube.mini_player__width &&
		y >= ImprovedTube.mini_player__y &&
		y <= ImprovedTube.mini_player__y + ImprovedTube.mini_player__height
	) {
		c = 'e-resize';
	} else if (
		x >= ImprovedTube.mini_player__x &&
		x <= ImprovedTube.mini_player__x + ImprovedTube.mini_player__width &&
		y >= ImprovedTube.mini_player__y + ImprovedTube.mini_player__height - ImprovedTube.miniPlayer_resize_offset &&
		y <= ImprovedTube.mini_player__y + ImprovedTube.mini_player__height
	) {
		c = 's-resize';
	} else if (
		x >= ImprovedTube.mini_player__x &&
		x <= ImprovedTube.mini_player__x + ImprovedTube.miniPlayer_resize_offset &&
		y >= ImprovedTube.mini_player__y &&
		y <= ImprovedTube.mini_player__y + ImprovedTube.mini_player__height
	) {
		c = 'w-resize';
	} else {
		c = '';
	}

	if (ImprovedTube.mini_player__cursor !== c) {
		ImprovedTube.mini_player__cursor = c;

		document.documentElement.setAttribute('it-mini-player-cursor', ImprovedTube.mini_player__cursor);
	}
};

ImprovedTube.miniPlayer_resize = function () {
	if (ImprovedTube.mini_player__cursor !== '') {
		window.removeEventListener('mousemove', ImprovedTube.miniPlayer_cursorUpdate);
		window.addEventListener('mouseup', ImprovedTube.miniPlayer_resizeMouseUp);
		window.addEventListener('mousemove', ImprovedTube.miniPlayer_resizeMouseMove);

		return true;
	}
};

ImprovedTube.miniPlayer_resizeMouseMove = function (event) {
	if (ImprovedTube.mini_player__cursor === 'n-resize') {
		ImprovedTube.elements.player.style.transform = 'translate(' + ImprovedTube.mini_player__x + 'px, ' + event.clientY + 'px)';
		ImprovedTube.mini_player__setSize(ImprovedTube.mini_player__width, ImprovedTube.mini_player__y + ImprovedTube.mini_player__height - event.clientY);
	} else if (ImprovedTube.mini_player__cursor === 'e-resize') {
		ImprovedTube.mini_player__setSize(event.clientX - ImprovedTube.mini_player__x, ImprovedTube.mini_player__height);
	} else if (ImprovedTube.mini_player__cursor === 's-resize') {
		ImprovedTube.mini_player__setSize(ImprovedTube.mini_player__width, event.clientY - ImprovedTube.mini_player__y);
	} else if (ImprovedTube.mini_player__cursor === 'w-resize') {
		ImprovedTube.elements.player.style.transform = 'translate(' + event.clientX + 'px, ' + ImprovedTube.mini_player__y + 'px)';
		ImprovedTube.mini_player__setSize(ImprovedTube.mini_player__x + ImprovedTube.mini_player__width - event.clientX, ImprovedTube.mini_player__height);
	} else if (ImprovedTube.mini_player__cursor === 'ne-resize') {
		ImprovedTube.elements.player.style.transform = 'translate(' + ImprovedTube.mini_player__x + 'px, ' + event.clientY + 'px)';
		ImprovedTube.mini_player__setSize(event.clientX - ImprovedTube.mini_player__x, ImprovedTube.mini_player__y + ImprovedTube.mini_player__height - event.clientY, true);
	} else if (ImprovedTube.mini_player__cursor === 'se-resize') {
		ImprovedTube.mini_player__setSize(event.clientX - ImprovedTube.mini_player__x, event.clientY - ImprovedTube.mini_player__y, true);
	} else if (ImprovedTube.mini_player__cursor === 'sw-resize') {
		ImprovedTube.elements.player.style.transform = 'translate(' + event.clientX + 'px, ' + ImprovedTube.mini_player__y + 'px)';
		ImprovedTube.mini_player__setSize(ImprovedTube.mini_player__x + ImprovedTube.mini_player__width - event.clientX, event.clientY - ImprovedTube.mini_player__y, true);
	} else if (ImprovedTube.mini_player__cursor === 'nw-resize') {
		ImprovedTube.elements.player.style.transform = 'translate(' + event.clientX + 'px, ' + event.clientY + 'px)';
		ImprovedTube.mini_player__setSize(ImprovedTube.mini_player__x + ImprovedTube.mini_player__width - event.clientX, ImprovedTube.mini_player__y + ImprovedTube.mini_player__height - event.clientY, true);
	}
};

ImprovedTube.miniPlayer_resizeMouseUp = function () {
	const bcr = ImprovedTube.elements.player.getBoundingClientRect();

	ImprovedTube.mini_player__x = bcr.left;
	ImprovedTube.mini_player__y = bcr.top;
	ImprovedTube.mini_player__width = bcr.width;
	ImprovedTube.mini_player__height = bcr.height;

	window.dispatchEvent(new Event('resize'));

	const strg = JSON.parse(localStorage.getItem('improvedtube-mini-player')) || {};

	strg.width = ImprovedTube.mini_player__width;
	strg.height = ImprovedTube.mini_player__height;

	localStorage.setItem('improvedtube-mini-player', JSON.stringify(strg));

	window.addEventListener('mousemove', ImprovedTube.miniPlayer_cursorUpdate);
	window.removeEventListener('mouseup', ImprovedTube.miniPlayer_resizeMouseUp);
	window.removeEventListener('mousemove', ImprovedTube.miniPlayer_resizeMouseMove);
};

ImprovedTube.miniPlayer = function () {
	if (this.storage.mini_player) {
		let data = localStorage.getItem('improvedtube-mini-player');

		try {
			if (this.isset(data)) {
				data = JSON.parse(data);
			} else {
				data = {};
			}
		} catch (error) {
			data = {};
		}

		data.x = data.x || 300;
		data.y = data.y || 35;
		data.width = data.width || 300;
		data.height = data.height || 225;

		this.mini_player__x = data.x;
		this.mini_player__y = data.y;
		this.mini_player__width = data.width;
		this.mini_player__height = data.height;

		window.removeEventListener('scroll', this.miniPlayer_scroll);
		window.addEventListener('scroll', this.miniPlayer_scroll);
	} else {
		this.mini_player__mode = false;
		this.elements.player.classList.remove('it-mini-player');
		this.mini_player__move = false;

		this.elements.player.style.width = '';
		this.elements.player.style.height = '';
		this.elements.player.style.transform = 'translate(' + 0 + 'px, ' + 0 + 'px)';

		this.elements.player.classList.remove('it-mini-player');

		this.mini_player__cursor = '';
		document.documentElement.removeAttribute('it-mini-player-cursor');

		window.dispatchEvent(new Event('resize'));

		window.removeEventListener('mousedown', this.miniPlayer_mouseDown);
		window.removeEventListener('mousemove', this.miniPlayer_mouseMove);
		window.removeEventListener('mouseup', this.miniPlayer_mouseUp);
		window.removeEventListener('click', this.miniPlayer_click);
		window.removeEventListener('scroll', this.miniPlayer_scroll);
		window.removeEventListener('mousemove', this.miniPlayer_cursorUpdate);
	}
};
/*--- CUSTOM PAUSE FUNCTIONS -------------------------------------------------*/
ImprovedTube.pauseWhileTypingOnYoutube = function () {
	if (ImprovedTube.storage.pause_while_typing_on_youtube) {
		let timeoutId;

		document.addEventListener('keydown', function (e) {
			// If player is NOT in the viewport, return
			if (!isPlayerInViewport()) return;

			const player = ImprovedTube.elements.player;

			if (player) {
				if ((/^[a-z0-9]$/i.test(e.key) || e.key === "Backspace")
					&& !(e.ctrlKey && (e.key === "c" || e.key === "x" || e.key === "a"))
					&& (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA" || document.activeElement.tagName === "DIV" )) {

					if (!player.paused) {
						player.pauseVideo();
					}

					if (timeoutId) clearTimeout(timeoutId);

					timeoutId = setTimeout(function () {
						player.playVideo();
					}, 2000); // 2000 milliseconds = 2 seconds
				}
			}
		});

		function isPlayerInViewport () {
			const player = ImprovedTube.elements.player;
			if (player) {
				const rect = player.getBoundingClientRect(),
					windowHeight = (window.innerHeight || document.documentElement.clientHeight),
					windowWidth = (window.innerWidth || document.documentElement.clientWidth);

				// Check if the player is in the viewport
				return (
					rect.top != 0 &&
				rect.left != 0 &&
				rect.bottom <= windowHeight &&
				rect.right <= windowWidth
				);
			}
			return false;
		}
	}
};
/*--- PLAYER CODEC & FPS LIMITS ----------------------------------------------*/
ImprovedTube.playerLimits = function () {
	if (ImprovedTube.storage.block_vp9 || ImprovedTube.storage.block_av1 || ImprovedTube.storage.block_h264) {
		let atlas = {block_vp9:'vp9|vp09', block_h264:'avc1', block_av1:'av01'}
		localStorage['it-codec'] = Object.keys(atlas).reduce(function (all, key) {
			return ImprovedTube.storage[key] ? ((all?all+'|':'') + atlas[key]) : all
		}, '');
	} else {
		localStorage.removeItem('it-codec');
	}

	if (ImprovedTube.storage.player_30fps_limit) {
		localStorage['it-player30fps'] = true;
	} else {
		localStorage.removeItem('it-player30fps');
	}
};
