/*--------------------------------------------------------------
>>> GENERAL:
----------------------------------------------------------------
# YouTube home page
# Fold subscriptions' sections (collapsed accordion)
# Don't let a second video auto-start at once
# Add "Scroll to top"
# Confirmation before closing
# Default content country
# Add "Popup window" buttons
# Font
# Mark watched videos
# Track watched videos
# Thumbnails quality
--------------------------------------------------------------*/
/*--- YOUTUBE HOME PAGE --------------------------------------*/
extension.features.youtubeHomePage = function (anything) {
	if (anything instanceof Event) {
		const option = extension.storage.data.youtube_home_page;

		if (option && option !== 'search' && anything.target?.closest('A#logo')) {
			event.preventDefault();
			event.stopPropagation();

			window.open(option, '_self');

			return false;
		}
	} else if (anything === 'init') {
		extension.events.on('init', function (resolve) {
			if (location.pathname == '/') {
				chrome.storage.local.get('youtube_home_page', function (items) {
					const option = items.youtube_home_page;

					if (['/feed/trending', '/feed/subscriptions', '/feed/history', '/playlist?list=WL', '/playlist?list=LL', '/feed/library'].includes(option)) {
						location.replace(option);
					} else {
						resolve();
					}
				});
			} else {
				resolve();
			}
		}, {
			async: true,
			prepend: true
		});
	} else {
		const option = extension.storage.data.youtube_home_page;

		window.removeEventListener('click', this.youtubeHomePage);

		if (['/feed/trending', '/feed/subscriptions', '/feed/history', '/playlist?list=WL', '/playlist?list=LL', '/feed/library'].includes(option)) {
			window.addEventListener('click', this.youtubeHomePage, true);
		}
	}
};
/*--- COLLAPSE OF SUBSCRIPTION SECTIONS ----------------------*/
extension.features.collapseOfSubscriptionSections = function (event) {
	if (event instanceof Event) {
		let section,
			content;

		if (event.target) {
			let target = event.target;

			while (target.parentNode) {
				if (target.nodeName === 'YTD-ITEM-SECTION-RENDERER') {
					section = target;
				} else if (target.className && target.className.indexOf && target.className.indexOf('grid-subheader') !== -1) {
					content = target.nextElementSibling;
				}

				target = target.parentNode;
			}
		}

		if (section && content) {
			event.preventDefault();
			event.stopPropagation();

			if (section.className.indexOf('it-section-collapsed') === -1) {
				content.style.height = content.offsetHeight + 'px';
				content.style.transition = 'height 200ms';
			}

			setTimeout(function () {
				section.classList.toggle('it-section-collapsed');
			});

			return false;
		}
	} else {
		window.removeEventListener('click', this.collapseOfSubscriptionSections);

		if (extension.storage.data.collapse_of_subscription_sections && location.pathname == '/feed/subscriptions') {
			window.addEventListener('click', this.collapseOfSubscriptionSections, true);
		}
	}
};
/*--- ONLY ONE PLAYER INSTANCE PLAYING -----------------------*/
extension.features.onlyOnePlayerInstancePlaying = function () {
	if (extension.storage.data.only_one_player_instance_playing) {
		const videos = document.querySelectorAll('video');

		for (let i = 0, l = videos.length; i < l; i++) {
			videos[i].pause();
		}
	}
};
/*--- ADD "SCROLL TO TOP" ------------------------------------*/
// HIXME what is going on here???
extension.features.addScrollToTop = function (event) {
	if (event instanceof Event) {
		if (window.scrollY > window.innerHeight / 2) {
			document.documentElement.setAttribute('it-scroll-to-top', 'true');
		} else {
			document.documentElement.removeAttribute('it-scroll-to-top');
		}
	} else {
		if (extension.storage.data.add_scroll_to_top) {
			this.addScrollToTop.button = document.createElement('div');
			this.addScrollToTop.button.id = 'it-scroll-to-top';
			this.addScrollToTop.button.className = 'satus-div';
			const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			svg.setAttribute('viewBox', '0 0 24 24');
			const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			path.setAttribute('d', 'M13 19V7.8l4.9 5c.4.3 1 .3 1.4 0 .4-.5.4-1.1 0-1.5l-6.6-6.6a1 1 0 0 0-1.4 0l-6.6 6.6a1 1 0 1 0 1.4 1.4L11 7.8V19c0 .6.5 1 1 1s1-.5 1-1z');
			svg.appendChild(path);
			this.addScrollToTop.button.appendChild(svg);
			window.addEventListener('scroll', function () {
				document.body.appendChild(extension.features.addScrollToTop.button);
			});
			this.addScrollToTop.button.addEventListener('click', function () {
				window.scrollTo(0, 0);
				document.getElementById('it-scroll-to-top')?.remove();
			});
		}
		if (extension.storage.data.add_scroll_to_top) {
			window.addEventListener('scroll', extension.features.addScrollToTop);
		} else if (this.addScrollToTop.button) {
			window.removeEventListener('scroll', extension.features.addScrollToTop);
			this.addScrollToTop.button.remove();
		}
	}
};
/*--- CONFIRMATION BEFORE CLOSING ----------------------------*/
extension.features.confirmationBeforeClosing = function () {
	window.onbeforeunload = function () {
		if (extension.storage.data.confirmation_before_closing) {
			return 'You have attempted to leave this page. Are you sure?';
		}
	};
};
/*--- DEFAULT CONTENT COUNTRY --------------------------------*/
extension.features.defaultContentCountry = function (changed) {
	const value = extension.storage.data.default_content_country;

	if (value) {
		if (value !== 'default') {
			const date = new Date();

			date.setTime(date.getTime() + 3.154e+10);

			document.cookie = 's_gl=' + value + '; path=/; domain=.youtube.com; expires=' + date.toGMTString();
		} else {
			document.cookie = 's_gl=0; path=/; domain=.youtube.com; expires=Thu, 01 Jan 1970 00:00:01 GMT';
		}
	}

	if (changed) {
		location.reload();
	}
};
/*--- ADD "POPUP WINDOW" BUTTONS -----------------------------*/
// FIXME this looks bad
extension.features.popupWindowButtons = function (event) {
	if (event instanceof Event) {
		if (event.type === 'mouseover') {
			if (event.target) {
				let target = event.target,
					detected = false;
				while (detected === false && target.parentNode) {
					if ( target.className && typeof target.className === 'string' && ((
						target.id === 'thumbnail' && target.className.indexOf('ytd-thumbnail') !== -1 || target.className.indexOf('thumb-link') !== -1 )
						|| (target.className.indexOf('video-preview') !== -1 || target.className.indexOf('ytp-inline-preview-scrim') !== -1 || target.className.indexOf('ytp-inline-preview-ui') !== -1)
					)) {
						if (!target.itPopupWindowButton) {
							target.itPopupWindowButton = document.createElement('button');
							target.itPopupWindowButton.className = 'it-popup-window';

							const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
							svg.setAttribute('viewBox', '0 0 24 24');
							const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
							path.setAttribute('d', 'M19 7h-8v6h8V7zm2-4H3C2 3 1 4 1 5v14c0 1 1 2 2 2h18c1 0 2-1 2-2V5c0-1-1-2-2-2zm0 16H3V5h18v14z');
							svg.appendChild(path);
							target.itPopupWindowButton.appendChild(svg);
							target.appendChild(target.itPopupWindowButton);

							target.itPopupWindowButton.addEventListener('click', function (event) {
								event.preventDefault();
								event.stopPropagation();
								try {
									this.parentElement.itPopupWindowButton.dataset.id = this.parentElement.href.match(/(?:[?&]v=|embed\/|shorts\/)([^&?]{11})/)[1]
								} catch (error) {
									console.log(error)
								};

								let ytPlayer = document.querySelector("#movie_player"),
									width,
									height,
									vertical;

								if (ytPlayer) {
									width = ytPlayer.offsetWidth * 0.65;
									height = ytPlayer.offsetHeight * 0.65
								} else {
									width = window.innerWidth * 0.4;
									height = window.innerWidth * 0.4;
								}

								if (!ytPlayer) {
									const shorts = /short/.test(this.parentElement.href);
									if (width / height < 1) {
										vertical = true
									} else {
										vertical = false
									}
									if (!vertical && shorts) {
										width = height * 0.6
									}
									if (vertical && !shorts) {
										height = width * 0.6
									}
								}

								window.open('https://www.youtube.com/embed/' + this.dataset.id + '?autoplay=' + (extension.storage.data.player_autoplay_disable ? '0' : '1'), '_blank', `directories=no,toolbar=no,location=no,menubar=no,status=no,titlebar=no,scrollbars=no,resizable=no,width=${width / 3},height=${height / 3}`);
								chrome.runtime.sendMessage({
									action: 'fixPopup',
									width: width,
									height: height,
									title: this.parentElement.closest('*[id="video-title"]')?.textContent + " - Youtube"
								})
							});
						}
						detected = true;
					}
					target = target.parentNode;
				}
			}
		}
	} else {
		if (extension.storage.data.popup_window_buttons) {
			window.addEventListener('mouseover', this.popupWindowButtons, true);
		} else {
			window.removeEventListener('mouseover', this.popupWindowButtons, true);
		}
	}
};
/*--- FONT ---------------------------------------------------*/
extension.features.font = function (changed) {
	const option = extension.storage.data.font;

	if (option) {
		const link = this.font.link || document.createElement('link'),
			style = this.font.style || document.createElement('style');

		link.rel = 'stylesheet';
		link.href = '//fonts.googleapis.com/css2?family=' + option;

		style.textContent = '*{font-family:"' + option.replace(/\+/g, ' ') + '" !important}';

		document.head.appendChild(link);
		document.head.appendChild(style);

		this.font.link = link;
		this.font.style = style;
	} else if (changed) {
		const link = this.font.link,
			style = this.font.style;

		if (link) link.remove();
		if (style) style.remove();
	}
};
/*--- MARK WATCHED VIDEOS ------------------------------------*/
extension.functions.getUrlParameter = function (url, parameter) {
	const match = url.match(new RegExp('(\\?|\\&)' + parameter + '=[^&]+'));
	if (match) {return match[0].substr(3);}
};

extension.features.markWatchedVideos = function (anything) {
	if (anything instanceof Event) {
		const event = anything;

		if (event.type === 'mouseover') {
			if (event.target) {
				let target = event.target,
					detected = false;

				while (!detected && target.parentNode) {
					if (
						target.className && target.className.indexOf &&
						(
							target.id === 'thumbnail' && target.className.indexOf('ytd-thumbnail') !== -1 ||
							target.className.indexOf('thumb-link') !== -1
						)
					) {
						if (!target.itMarkWatchedVideosButton) {
							target.itMarkWatchedVideosButton = document.createElement('button');
							target.itMarkWatchedVideosButton.className = 'it-mark-watched-videos';
							target.itMarkWatchedVideosButton.dataset.id = extension.functions.getUrlParameter(target.href, 'v');
							const id = target.itMarkWatchedVideosButton.dataset.id,
								svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
								pathData = 'M12 15.15q1.525 0 2.588-1.063 1.062-1.062 1.062-2.587 0-1.525-1.062-2.588Q13.525 7.85 12 7.85q-1.525 0-2.587 1.062Q8.35 9.975 8.35 11.5q0 1.525 1.063 2.587Q10.475 15.15 12 15.15Zm0-.95q-1.125 0-1.912-.788Q9.3 12.625 9.3 11.5t.788-1.913Q10.875 8.8 12 8.8t1.913.787q.787.788.787 1.913t-.787 1.912q-.788.788-1.913.788Zm0 3.8q-3.1 0-5.688-1.613Q3.725 14.775 2.325 12q-.05-.1-.075-.225-.025-.125-.025-.275 0-.15.025-.275.025-.125.075-.225 1.4-2.775 3.987-4.388Q8.9 5 12 5q3.1 0 5.688 1.612Q20.275 8.225 21.675 11q.05.1.075.225.025.125.025.275 0 .15-.025.275-.025.125-.075.225-1.4 2.775-3.987 4.387Q15.1 18 12 18Z',
								path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
							svg.setAttribute('viewBox', '0 0 24 24');
							path.setAttribute('d', pathData + 'm0-6.5Zm0 5.5q2.825 0 5.188-1.488Q19.55 14.025 20.8 11.5q-1.25-2.525-3.612-4.013Q14.825 6 12 6 9.175 6 6.812 7.487 4.45 8.975 3.2 11.5q1.25 2.525 3.612 4.012Q9.175 17 12 17Z');
							svg.appendChild(path);
							const svg2 = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
								extraPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
							svg2.setAttribute('viewBox', '0 0 24 24');
							extraPath.setAttribute('d', pathData);
							svg2.appendChild(extraPath);
							target.itMarkWatchedVideosButton.appendChild(svg);
							target.itMarkWatchedVideosButton.appendChild(svg2);

							if (extension.storage.data.watched?.[id]) target.itMarkWatchedVideosButton.setAttribute('watched', '');
							target.appendChild(target.itMarkWatchedVideosButton);
							target.itMarkWatchedVideosButton.addEventListener('click', function (event) {
								const id = this.dataset.id,
									value = this.toggleAttribute('watched');

								event.preventDefault();
								event.stopPropagation();

								if (!extension.storage.data.watched) extension.storage.data.watched = {};

								if (value) {
									extension.storage.data.watched[id] = {title: ''};
								} else {
									delete extension.storage.data.watched[id];
								}

								chrome.storage.local.set({
									watched: extension.storage.data.watched
								});
							});

						} else {
							const button = target.itMarkWatchedVideosButton;

							if (extension.storage.data.watched?.[button.dataset.id]) {
								button.setAttribute('watched', '');
							} else {
								button.removeAttribute('watched');
							}
						}

						detected = true;
					}

					target = target.parentNode;
				}
			}
		}
	} else if (anything === true) {
		const buttons = document.querySelectorAll('.it-mark-watched-videos');

		for (let i = 0, l = buttons.length; i < l; i++) {
			buttons[i].remove();
		}
	} else {
		window.removeEventListener('mouseover', this.markWatchedVideos, true);

		if (extension.storage.data.mark_watched_videos) {
			window.addEventListener('mouseover', this.markWatchedVideos, true);
		}
	}
};
/*--- TRACK WATCHED VIDEOS -----------------------------------*/
extension.features.trackWatchedVideos = function () {
	if (extension.storage.data.track_watched_videos && document.documentElement.getAttribute('it-pathname').indexOf('/watch') === 0) {
		const id = extension.functions.getUrlParameter(location.href, 'v');

		if (!extension.storage.data.watched) extension.storage.data.watched = {};

		extension.storage.data.watched[id] = {
			title: document.title
		};

		chrome.storage.local.set({
			watched: extension.storage.data.watched
		});
	}
};
/*--- THUMBNAILS QUALITY -------------------------------------*/
extension.features.thumbnailsQuality = function (anything) {
	const option = extension.storage.data.thumbnails_quality;

	function handler (thumbnail) {
		if (!thumbnail.dataset.defaultSrc && extension.features.thumbnailsQuality.regex.test(thumbnail.src)) {
			thumbnail.dataset.defaultSrc = thumbnail.src;

			thumbnail.onload = function () {
				if (this.naturalHeight <= 90) {
					this.src = this.dataset.defaultSrc;
				}
			};

			thumbnail.onerror = function () {
				this.src = thumbnail.dataset.defaultSrc;
			};

			thumbnail.src = thumbnail.src.replace(extension.features.thumbnailsQuality.regex, extension.storage.data.thumbnails_quality + '.jpg');
		}
	};

	if (['default', 'mqdefault', 'hqdefault', 'sddefault', 'maxresdefault'].includes(option)) {
		const thumbnails = document.querySelectorAll('img');

		this.thumbnailsQuality.regex = /(default\.jpg|mqdefault\.jpg|hqdefault\.jpg|hq720\.jpg|sddefault\.jpg|maxresdefault\.jpg)+/;

		for (let i = 0, l = thumbnails.length; i < l; i++) handler(thumbnails[i]);

		if (!this.thumbnailsQuality.observer) {
			this.thumbnailsQuality.observer = new MutationObserver(function (mutationList) {
				for (let i = 0, l = mutationList.length; i < l; i++) {
					const mutation = mutationList[i];

					if (mutation.type === 'attributes') {
						handler(mutation.target);
					}
				}
			});

			this.thumbnailsQuality.observer.observe(document.documentElement, {
				attributeFilter: ['src'],
				attributes: true,
				childList: true,
				subtree: true
			});
		}
	} else if (anything === true) {
		const thumbnails = document.querySelectorAll('img[data-default-src]');

		for (let i = 0, l = thumbnails.length; i < l; i++) {
			const thumbnail = thumbnails[i];

			thumbnail.src = thumbnail.dataset.defaultSrc;

			thumbnail.removeAttribute('data-default-src');
		}

		if (this.thumbnailsQuality.observer) {
			this.thumbnailsQuality.observer.disconnect();
		}
	}
};
/*--- DISABLE VIDEO PLAYBACK ON HOVER ------------------------*/
extension.features.disableThumbnailPlayback = function () {
	function handler (event) {
		if (event.composedPath().some(elem => (elem.matches != null && elem.matches('#content.ytd-rich-item-renderer, #contents.ytd-item-section-renderer'))
		)) {
			event.stopImmediatePropagation();
		}
	};

	if (extension.storage.data.disable_thumbnail_playback) {
		window.addEventListener('mouseenter', handler, true);
	} else {
		window.removeEventListener('mouseenter', handler, true);
	}
};
/*--- OPEN VIDEOS IN A NEW TAB -------------------------------*/
extension.features.openNewTab = function () {
	if (extension.storage.data.open_new_tab) {
		window.onload = function () {
			const searchButton = document.querySelector("button#search-icon-legacy");
			const inputField = document.querySelector("input#search");

			searchButton.addEventListener("mousedown", () => {
				performSearchNewTab(inputField.value);
			});
			inputField.addEventListener("keydown", function (event) {
				if (event.key === "Enter") {
					performSearchNewTab(inputField.value);
				}
			});

			let searchedAlready = false;
			inputField.addEventListener("focus", function () {
				searchedAlready = false;
				const observer = new MutationObserver(applySuggestionListeners);
				const container = document.querySelector("div[style*='position: fixed'] ul[role='listbox']");
				if (container) observer.observe(container, { attributes: true, childList: true, subtree: true });
			});

			inputField.addEventListener("input", () => {searchedAlready = false});

			function applySuggestionListeners () {
				const suggestionContainers = document.querySelectorAll("div[class^='sbqs'], div[class^='sbpqs']");
				suggestionContainers.forEach((suggestionsContainer) => {
					suggestionsContainer.addEventListener("mousedown", (event) => {
						const suggestionListItem = event.target.closest("li[role='presentation']");
						if (suggestionListItem && !searchedAlready) {
							const query = suggestionListItem.querySelector("b").textContent
							performSearchNewTab(inputField.value + query);
							searchedAlready = true;
						}
					});
				});
			}

			function performSearchNewTab (query) {
				inputField.value = "";
				inputField.focus();
				const newTabURL = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
				window.open(newTabURL, '_blank');
			}
		}
	}
};
