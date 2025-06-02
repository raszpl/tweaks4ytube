/*--------------------------------------------------------------
>>> CORE:
----------------------------------------------------------------
# Global variable
# Camelize
# Events
	# On
	# Trigger
# Inject
# Messages
	# Create element
	# Listener
	# Send
# Storage
	# Listener
	# Load
--------------------------------------------------------------*/
/*--- GLOBAL VARIABLE ----------------------------------------*/
const extension = {
	domReady: false,
	events: {
		listeners: {}
	},
	features: {},
	functions: {},
	messages: {
		queue: []
	},
	ready: false,
	storage: {
		data: {}
	}
};

// list of settings we inject into HTML element as attributes, used by CSS.
const htmlAttributes = [
	"activated",
	"ads",
	"always_show_progress_bar",
	"bluelight",
	"channel_hide_featured_content",
	"collapse_of_subscription_sections",
	"columns",
	"comments",
	"comments_sidebar",
	"comments_sidebar_left",
	"comments_sidebar_simple",
	"compact_spacing",
	"description",
	"embeddedHidePauseOverlay",
	"embeddedHideShare",
	"embeddedHideYoutubeLogo",
	"header_hide_country_code",
	"header_hide_right_buttons",
	"header_improve_logo",
	"header_position",
	"header_transparent",
	"hide_animated_thumbnails",
	"hide_author_avatars",
	"hide_clip_button",
	"hide_comments_count",
	"hide_date",
	"hide_details",
	"hide_dislike_button",
	"hide_download_button",
	"hide_footer",
	"hide_gradient_bottom",
	"hide_more_button",
	"hide_playlist",
	"hide_report_button",
	"hide_save_button",
	"hide_scroll_for_details",
	"hide_share_button",
	"hide_shorts_remixing",
	"hide_sidebar",
	"hide_thanks_button",
	"hide_thumbnail_overlay",
	"hide_video_title_fullScreen",
	"hide_views_count",
	"hide_voice_search_button",
	"improvedtube_search",
	"likes",
	"livechat",
	"mini_player_cursor",
	"no_page_margin",
	"player_autoplay_button",
	"player_color",
	"player_crop_chapter_titles",
	"player_fit_to_win_button",
	"player_hide_annotations",
	"player_hide_cards",
	"player_hide_endscreen",
	"player_hide_skip_overlay",
	"player_miniplayer_button",
	"player_next_button",
	"player_play_button",
	"player_previous_button",
	"player_remote_button",
	"player_screen_button",
	"player_settings_button",
	"player_show_cards_on_mouse_hover",
	"player_size",
	"player_size",
	"player_subtitles_button",
	"player_transparent_background",
	"player_view_button",
	"player_volume_button",
	"red_dislike_button",
	"related_videos",
	"remove_black_bars",
	"remove_history_shorts",
	"remove_home_page_shorts",
	"remove_related_search_results",
	"remove_shorts_reel_search_results",
	"remove_subscriptions_shorts",
	"remove_trending_shorts",
	"schedule",
	"scroll_bar",
	"scroll_to_top",
	"search_focus",
	"sidebar_left",
	"squared_user_images",
	"subscribe",
	"theme",
	"thumbnails_hide",
	"thumbnails_right",
	"transcript",
	"youtube_home_page",
	"youtubeDetailButtons",
	"subscription_thumbs",
	"channel_thumbs"
];
/*--- CAMELIZE -----------------------------------------------*/
extension.camelize = function (string) {
	let result = '';

	for (let i = 0, l = string.length; i < l; i++) {
		const character = string[i];

		if (character === '_' || character === '-') {
			i++;

			result += string[i].toUpperCase();
		} else {
			result += character;
		}
	}

	return result;
};
/*--------------------------------------------------------------
# EVENTS
--------------------------------------------------------------*/
/*--- ON ------------------------------------------------------*/
extension.events.on = function (type, listener, options = {}) {
	const listeners = extension.events.listeners;

	if (!listeners[type]) listeners[type] = [];

	if (options.async) {
		listener = (function (original) {
			return async function () {
				return new Promise(original);
			};
		})(listener);
	}

	if (options.prepend) {
		listeners[type].unshift(listener);
	} else {
		listeners[type].push(listener);
	}
};
/*--- TRIGGER ------------------------------------------------*/
extension.events.trigger = async function (type, data) {
	const listeners = extension.events.listeners[type];

	if (listeners) {
		for (let i = 0, l = listeners.length; i < l; i++) {
			const listener = listeners[i];

			if (typeof listener === 'function') {
				if (listener instanceof(async function () {}).constructor) {
					await listener(data);
				} else {
					listener(data);
				}
			}
		}
	}
};
/*--- INJECT -------------------------------------------------*/
extension.inject = function (paths, callback) {
	if (paths.length > 0) {
		let element,
			path = chrome.runtime.getURL(paths[0]);

		if (path.indexOf('.css') !== -1) {
			element = document.createElement('link');

			element.rel = 'stylesheet';
			element.href = path;
		} else {
			element = document.createElement('script');

			element.src = path;
		}

		element.onload = function () {
			paths.shift();

			extension.inject(paths, callback);
		};

		document.documentElement.appendChild(element);
	} else if (callback) {
		callback();
	}
};
/*--------------------------------------------------------------
# MESSAGES
----------------------------------------------------------------
	Designed for messaging between contexts of extension and
	website.
--------------------------------------------------------------*/
/*--- SEND ---------------------------------------------------*/
extension.messages.send = function (message) {
	if (typeof cloneInto == 'function') message = cloneInto(message, window); // FF needs this
	document.dispatchEvent(new CustomEvent('it-message-from-extension', {'detail': message}));
};
/*--------------------------------------------------------------
# STORAGE
--------------------------------------------------------------*/
/*--- LISTENER -----------------------------------------------*/
extension.storage.listener = function () {
	chrome.storage.onChanged.addListener(function (changes) {
		for (const key in changes) {
			const value = changes[key].newValue,
				camelized_key = extension.camelize(key);

			extension.storage.data[key] = value;

			if (htmlAttributes.includes(key)) {
				if (!(typeof value === 'undefined' || value === null || value === 'null')) {
					document.documentElement.setAttribute('it-' + key, value);
				} else {
					document.documentElement.removeAttribute('it-' + key);
				}
			}

			if (typeof extension.features[camelized_key] === 'function') {
				extension.features[camelized_key](true);
			}

			extension.events.trigger('storage-changed', {
				key,
				value
			});

			extension.messages.send({
				action: 'storage-changed',
				camelizedKey: camelized_key,
				key,
				value
			});
		}
	});
};
/*--- LOAD ---------------------------------------------------*/
extension.storage.load = function (callback) {
	chrome.storage.local.get(function (items) {
		extension.storage.data = items;

		// initialize theme in case YT is in Dark cookie mode
		if (!extension.storage.data.theme && document.documentElement.hasAttribute('dark')) {
			extension.storage.data.theme = 'dark';
			chrome.storage.local.set({theme: 'dark'});
		}

		extension.events.trigger('storage-loaded');
		extension.messages.send({
			action: 'storage-loaded',
			storage: items
		});

		extension.ready = true;
		extension.events.trigger('init');

		for (const key in items) {
			if (htmlAttributes.includes(key) && !(typeof items[key] === 'undefined' || items[key] === null || items[key] === 'null')) {
				document.documentElement.setAttribute('it-' + key, items[key]);
			}
		}

		if (callback) callback(extension.storage.data);
	});
};
