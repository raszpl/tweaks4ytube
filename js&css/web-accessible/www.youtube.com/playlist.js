/*------------------------------------------------------------------------------
4.5.0 PLAYLIST
------------------------------------------------------------------------------*/
/*---- UP NEXT AUTOPLAY ------------------------------------------------------*/
ImprovedTube.playlistUpNextAutoplay = function () {
	const playlistData = this.elements.ytd_watch?.playlistData;

	if (this.getParam(location.href, 'list') && playlistData
		&& playlistData.currentIndex
		&& playlistData.totalVideos
		&& playlistData.localCurrentIndex) {

		console.log('this.elements.video?.ended', this.elements.video?.ended);

		if (!this.storage.playlist_up_next_autoplay) {
			playlistData.currentIndex = playlistData.totalVideos;
		} else {
			if (playlistData.currentIndex != playlistData.localCurrentIndex) {
				// this only happens when user switched playlist_up_next_autoplay from OFF to ON while on playlist page, restoring
				playlistData.currentIndex = playlistData.localCurrentIndex;
			}
		}
	}
};
/*--- REVERSE ----------------------------------------------------------------*/
ImprovedTube.playlistReverse = function (node) {
	if (this.storage.playlist_reverse) {
		// playlist_reverse button already applied or nowhere to attach it
		if (document.body.querySelector('#it-reverse-playlist-button') || !node) return;
		/*
rename extension/www.youtube.com/styles.css
#it-reverse-playlist {
#it-reverse-playlist svg {
#it-reverse-playlist.active svg {
		*/
		const button = ImprovedTube.createIconButton({
			type: 'playlistReverse',
			className: `style-scope yt-icon-button`,
			id: 'it-reverse-playlist-button',
			title: 'Reverse playlist',
			onclick: function () {
				this.classList.toggle('active');
				ImprovedTube.playlistReversed = !ImprovedTube.playlistReversed;

				const results = ImprovedTube.elements.ytd_watch.data.contents.twoColumnWatchNextResults,
					playlist = results.playlist.playlist,
					autoplay = results.autoplay.autoplay;

				playlist.contents.reverse();

				playlist.currentIndex = playlist.totalVideos - playlist.currentIndex - 1;
				playlist.localCurrentIndex = playlist.contents.length - playlist.localCurrentIndex - 1;

				for (let i = 0, l = autoplay.sets.length; i < l; i++) {
					const item = autoplay.sets[i];

					item.autoplayVideo = item.previousButtonVideo;
					item.previousButtonVideo = item.nextButtonVideo;
					item.nextButtonVideo = item.autoplayVideo;
				}

				ImprovedTube.elements.ytd_watch.updatePageData_(JSON.parse(JSON.stringify(ImprovedTube.elements.ytd_watch.data)));

				setTimeout(function () {
					const playlist_manager = document.querySelector('yt-playlist-manager');

					ImprovedTube.elements.ytd_player.updatePlayerComponents(null, autoplay, null, playlist);
					playlist_manager.autoplayData = autoplay;
					playlist_manager.setPlaylistData(playlist);
					ImprovedTube.elements.ytd_player.updatePlayerPlaylist_(playlist);
				}, 100);
			},
		});
		node.appendChild(button);

		if (this.playlistReversed === true) {
			button.click();
		}
	} else {
		document.querySelector('#it-reverse-playlist-button')?.remove();
	}
};
/*--- REPEAT -----------------------------------------------------------------*/
ImprovedTube.playlistRepeat = function () {
	if ( ImprovedTube.storage.playlist_repeat === true ) {
	    setTimeout(function () {
			const option = ImprovedTube.storage.playlist_repeat,
				button = document.querySelector("#button.ytd-playlist-loop-button-renderer") || document.querySelector("ytd-playlist-loop-button-renderer button") || document.querySelector("ytd-playlist-loop-button-renderer");
			if (button && (option === true && button.querySelector("path").attributes.d.textContent.split(" ")[0].startsWith('M21')
			) && button.querySelector("#tooltip")?.textContent !== 'Loop video'
	  && button.firstElementChild?.firstElementChild?.attributes[2]?.textContent !== 'Loop video'
	  && button.querySelector("#tooltip")?.textContent !== 'Turn off loop'
	  && button.firstElementChild?.firstElementChild?.attributes[2]?.textContent !== 'Turn off loop'
			) button.click();
		}, 10000);
	}
};
/*--- SHUFFLE ----------------------------------------------------------------*/
/*
FIXME
button.querySelector("path").attributes.d.textContent.startsWith('M20') off
button.querySelector("path").attributes.d.textContent.startsWith('M21') loop
button.querySelector("path").attributes.d.textContent.startsWith('M13') loop with 1 in the middle, what does that even mean? :D
 https://github.com/code-charity/youtube/issues/1768#issuecomment-1720423923

also fix ImprovedTube.shortcutToggleLoop
*/
ImprovedTube.playlistShuffle = function () {
	if (ImprovedTube.storage.playlist_shuffle) {
		//const button = document.querySelector('#playlist-actions #playlist-action-menu ytd-toggle-button-renderer');
		/*
		this.blocklistChannelObserver = new MutationObserver(function(mutationList) {
			if (!button.isConnected) {
				node.parentNode.parentNode.appendChild(button);
			}
		});
		this.blocklistChannelObserver.observe(node.parentNode.parentNode, {childList: true, subtree: true});

		if (typeof ImprovedTube.blocklistChannelObserver === 'object') {
			ImprovedTube.blocklistChannelObserver.disconnect();
		}
		*/
		/*
		setTimeout(function () {
			let button = ImprovedTube.elements.playlist.shuffle_button,
				option = ImprovedTube.storage.playlist_shuffle;
			// FIXME this looks stupid
			//button = document.querySelector('#playlist-actions #playlist-action-menu ytd-toggle-button-renderer');
			if (button && (option === true && button.querySelector("path").attributes.d.textContent.split(" ")[0].startsWith('M18.1'))) button.click();
		}, 10000);

		*/
	}
};
/*--- POPUP ------------------------------------------------------------------*/
/**
 * ## Adds a playlist popup button to each playlist panel found or update the links of existing popup buttons
 * - buttons will be added on the playlist page (next to the share button), in the playlist panel (after the loop and shuffle buttons), and/or the mini playlist section of the mini player (after the loop and shuffle buttons)
 * - uses {@linkcode ImprovedTube.playlistPopupCreateButton} to create each button
 * - saves each button in {@linkcode ImprovedTube.elements.buttons} as `it-popup-playlist-button-playlist`, `it-popup-playlist-button-mini`, and `it-popup-playlist-button-panel`
 * - called from {@linkcode ImprovedTube.ytElementsHandler} and {@linkcode ImprovedTube.hrefObserver} when DOM changes (somewhat related to playlist renderers)
 */
ImprovedTube.playlistPopup = function () {
/**
 * ## playlistPopupCreateButton creates a playlist popup button (with ID `it-popup-playlist-button`)
 * - checks {@linkcode ImprovedTube.storage.playlist_autoplay} if to autoplay the popuped playlist/video
 * - checks {@linkcode ImprovedTube.elements.player} to get video ID and current time, if available, otherwise starts first video of playlist
 * - popup has video players width/height or window (inner) width/height when video player is not available
 * - the button has the playlist ID as `list` in its dataset and reads from it to open the popup
 * @param {string | null} playlistID - the playlist ID or `null`
 * @param {boolean} [altButtonStyle] - [optional] changes styling of the playlist popup button - `true` for minplayer and playlist panel and `false` for the playlist page - default `false`
 * @param {boolean} [checkVideo] - [optional] if `true` checks the {@linkcode ImprovedTube.elements.player} to get the video ID, time, and size, if available, otherwise starts first video of playlist - default `false` (starts first video of playlist)
 * @returns {HTMLButtonElement | null} the playlist popup button to insert into the DOM or `null` if the {@linkcode playlistID} is `null`
 */
	function playlistPopupCreateButton (playlistID, className, altButtonStyle) {
		"use strict";
		return ImprovedTube.createIconButton({
			type: 'playlistPopup',
			className: `yt-spec-button-shape-next yt-spec-button-shape-next--${(altButtonStyle ?? false) ? 'text' : 'tonal'} yt-spec-button-shape-next--overlay yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-button style-scope ytd-playlist-header-renderer ${className}`,
			id: 'it-popup-playlist-button',
			title: 'Popup playlist',
			dataset: [['list', playlistID]],
			onclick: function () {
				const videoID = location.href.match(ImprovedTube.regex.video_id)?.[1],
					playlistID = location.href.match(ImprovedTube.regex.playlist_id)?.[1],
					url = location.protocol + '//www.youtube.com/embed/' + videoID
						+ '?autoplay=' + (video.paused ? '0' : '1')
						+ (video.currentTime > 5 ? '&start=' + parseInt(video.currentTime) : '')
						+ (playlistID ? '&list=' + playlistID : '');

				if (!playlistID) return; // no clicking for you! run away

				player.pauseVideo();
				ImprovedTube.messageSend({
					action: 'popup',
					url: url,
					width: parseInt(player.offsetWidth * 0.75),
					height: parseInt(player.offsetHeight * 0.75)
				});
			}
			/*onclick: checkVideo ? function () {
				const videoURL = ImprovedTube.elements.player?.getVideoUrl();
				let width = ImprovedTube.elements.player.offsetWidth * 0.7;
				let height = ImprovedTube.elements.player.offsetHeight * 0.7;

				"use strict";
				if (videoURL != null && ImprovedTube.regex.video_id.test(videoURL)) {
					ImprovedTube.elements.player.pauseVideo();
					const listID = this.dataset.list,
						videoID = videoURL.match(ImprovedTube.regex.video_id)[1],
						popup = window.open(`https://www.youtube.com/embed/${videoID}?autoplay=${ImprovedTube.storage.playlist_autoplay ? '1' : '0'}&start=${videoURL.match(ImprovedTube.regex.video_time)?.[1] ?? '0'}&list=${listID}`, '_blank', `directories=no,toolbar=no,location=no,menubar=no,status=no,titlebar=no,scrollbars=no,resizable=no,width=${width / 3},height=${height / 3}`);
					//! If the video is not in the playlist or not within the first 200 entries, then it automatically selects the first video in the list.
					//! But this is okay since this button is mainly for the playlist, not the video (see the video popup button in player.js).
					popup.addEventListener('load', function () {
						"use strict";
						//~ check if the video ID in the link of the video title matches the original video ID in the URL and if not reload as a videoseries/playlist (without the videoID and start-time).
						const videoLink = this.document.querySelector('div#player div.ytp-title-text>a[href]');
						if (videoLink && videoLink.href.match(ImprovedTube.regex.video_id)?.[1] !== videoID) this.location.href = `https://www.youtube.com/embed/videoseries?autoplay=${ImprovedTube.storage.playlist_autoplay ? '1' : '0'}&list=${listID}`;
					}, {passive: true, once: true});
				} else window.open(`https://www.youtube.com/embed/videoseries?autoplay=${ImprovedTube.storage.playlist_autoplay ? '1' : '0'}&list=${this.dataset.list}`, '_blank', `directories=no,toolbar=no,location=no,menubar=no,status=no,titlebar=no,scrollbars=no,resizable=no,width=${width / 3},height=${height / 3}`);
				//~ change focused tab to URL-less popup
				ImprovedTube.messageSend({
					action: 'fixPopup',
					width: width,
					height: height,
					title: document.title
				});
			} : function () {
				let width = ImprovedTube.elements.player.offsetWidth * 0.7;
				let height = ImprovedTube.elements.player.offsetHeight * 0.7;
				if (!ImprovedTube.elements.player) {
					shorts = /short/.test(this.parentElement.href);
					if (width / height < 1) { vertical = true } else { vertical = false }
					if (!vertical && shorts) width = height * 0.6;
					if (vertical && !shorts) height = width * 0.6;
				}
				"use strict";
				window.open(`https://www.youtube.com/embed/videoseries?autoplay=${ImprovedTube.storage.playlist_autoplay ? '1' : '0'}&list=${this.dataset.list}`, '_blank', `directories=no,toolbar=no,location=no,menubar=no,status=no,titlebar=no,scrollbars=no,resizable=no,width=${width / 3},height=${height / 3}`);
				//~ change focused tab to URL-less popup
				ImprovedTube.messageSend({
					action: 'fixPopup',
					width: width,
					height: height,
					title: document.title
				});
			},*/
		});
	};

	if (this.storage.playlist_popup) {
		if (document.body.querySelector('#it-popup-playlist-button')) return; // playlist_popup button already applied, nothing more to do here

		const playlistID = location.href.match(this.regex.playlist_id)?.[1]
		if (!playlistID) return; // No playlistID, nothing to do here

		const playlistIDMini = this.elements.player?.getPlaylistId?.(),
			// playlistShareButton is on /playlist?list=
			playlistShareButton = document.body.querySelector('ytd-app>div#content>ytd-page-manager>ytd-browse>ytd-playlist-header-renderer ytd-button-renderer.ytd-playlist-header-renderer:has(button[title])'),
			miniItemButton = document.body.querySelector('ytd-app>ytd-miniplayer ytd-playlist-panel-renderer div#top-level-buttons-computed'),
			// panelItemButton is on /watch?v=xxxx&list=
			panelItemButton = document.body.querySelector('ytd-app>div#content>ytd-page-manager>ytd-watch-flexy ytd-playlist-panel-renderer div#top-level-buttons-computed');

		if (playlistShareButton && playlistID) {
			playlistShareButton.insertAdjacentElement('afterend', playlistPopupCreateButton(playlistID, 'it-popup-playlist-button-playlist'));
		}
		if (miniItemButton && playlistIDMini) {
			miniItemButton.appendChild(playlistPopupCreateButton(playlistIDMini, 'it-popup-playlist-button-playlist', true));
		}
		if (panelItemButton && playlistID) {
			panelItemButton.appendChild(playlistPopupCreateButton(playlistID, 'it-popup-playlist-button-panel', true));
		}
	} else {
		document.querySelector('#it-popup-playlist-button')?.remove();
	}
};
