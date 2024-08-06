/*--------------------------------------------------------------
>>> INITIALIZATION
--------------------------------------------------------------*/
extension.features.youtubeHomePage('init');

document.documentElement.setAttribute('it-pathname', location.pathname);

window.addEventListener('yt-navigate-finish', function () {
	document.documentElement.setAttribute('it-pathname', location.pathname);

	extension.features.trackWatchedVideos();
	extension.features.thumbnailsQuality();
});

extension.storage.listener();
extension.storage.load();

function bodyReady () {
	if (extension.ready && extension.domReady) {
		extension.features.addScrollToTop();
		extension.features.font();
	}
}

extension.events.on('init', function () {
	extension.features.youtubeHomePage();
	extension.features.collapseOfSubscriptionSections();
	extension.features.confirmationBeforeClosing();
	extension.features.defaultContentCountry();
	extension.features.popupWindowButtons();
	extension.features.disableThumbnailPlayback();
	extension.features.markWatchedVideos();
	extension.features.openNewTab();
	bodyReady();
});

chrome.runtime.sendMessage({
	action: 'tab-connected'
}, function (response) {
	if (response) {
		extension.tabId = response.tabId;
	}
});

document.addEventListener('DOMContentLoaded', function () {
	extension.domReady = true;

	bodyReady();
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	switch (message.action) {
		case 'focus':
			extension.messages.send({
				action: 'focus'
			});
			break

		case 'blur':
			extension.messages.send({
				action: 'blur'
			});
			break

		case 'pause':
			extension.messages.send({
				action: 'pause'
			});
			break

		case 'set-volume':
			extension.messages.send({
				action: 'setVolume',
				value: message.value
			});
			break

		case 'set-playback-speed':
			extension.messages.send({
				action: 'setPlaybackSpeed',
				value: message.value
			});
			break

		case 'mixer':
			extension.messages.send({
				action: 'mixer'
			}, sendResponse, 'mixer');
			return true;

		case 'delete-youtube-cookies':
			extension.messages.send({
				action: 'deleteCookies'
			});
			break

		case 'another-video-started-playing':
			extension.features.onlyOnePlayerInstancePlaying();
			break

		case 'performance-request':
			extension.messages.send({
				action: 'performance'
			});
			break
	}
});

document.addEventListener('it-message-from-web-accessible', function (message) {
	message = message.detail;
	switch (message.action) {
		case 'performance':
			chrome.runtime.sendMessage({action: 'performance-reply', perf: message.perf});
			break

		case 'requestOptionsUrl':
			extension.messages.send({
				action: 'responseOptionsUrl',
				url: chrome.runtime.getURL('menu/index.html')
			});
			break

		case 'popup':
			chrome.runtime.sendMessage(message);
			break

		case 'analyzer':
			if (extension.storage.data.analyzer_activation) {
				const data = message.name,
					date = new Date().toDateString(),
					hours = new Date().getHours() + ':00';

				if (!extension.storage.data.analyzer) {
					extension.storage.data.analyzer = {};
				}

				if (!extension.storage.data.analyzer[date]) {
					extension.storage.data.analyzer[date] = {};
				}

				if (!extension.storage.data.analyzer[date][hours]) {
					extension.storage.data.analyzer[date][hours] = {};
				}

				if (!extension.storage.data.analyzer[date][hours][data]) {
					extension.storage.data.analyzer[date][hours][data] = 0;
				}

				extension.storage.data.analyzer[date][hours][data]++;

				chrome.storage.local.set({
					analyzer: extension.storage.data.analyzer
				});
			}
			break

		case 'blocklist':
			if (!extension.storage.data.blocklist
				|| typeof extension.storage.data.blocklist !== 'object') extension.storage.data.blocklist = {videos: {}, channels: {}};

			switch (message.type) {
				case 'channel':
					if (!extension.storage.data.blocklist.channels
						|| typeof extension.storage.data.blocklist.channels !== 'object') extension.storage.data.blocklist.channels = {};

					if (message.add) {
						extension.storage.data.blocklist.channels[message.id] = {
							title: message.title,
							preview: message.preview,
							when: message.when
						}
					} else {
						delete extension.storage.data.blocklist.channels[message.id];
					}
					break

				case 'video':
					if (!extension.storage.data.blocklist.videos
						|| typeof extension.storage.data.blocklist.videos !== 'object') extension.storage.data.blocklist.videos = {};

					if (message.add) {
						extension.storage.data.blocklist.videos[message.id] = {
							title: message.title,
							when: message.when
						}
					} else {
						delete extension.storage.data.blocklist.videos[message.id];
					}
					break
			}

			chrome.storage.local.set({
				blocklist: extension.storage.data.blocklist
			});
			break

		case 'watched':
			if (!extension.storage.data.watched
				|| typeof extension.storage.data.watched !== 'object') extension.storage.data.watched = {};

			if (message.type === 'add') {
				extension.storage.data.watched[message.id] = {
					title: message.title
				};
			}

			if (message.type === 'remove') delete extension.storage.data.watched[message.id];

			chrome.storage.local.set({
				watched: extension.storage.data.watched
			});
			break

		case 'set':
			if (message.value) {
				chrome.storage.local.set({[message.key]: message.value});
			} else {
				chrome.storage.local.remove([message.key]);
			}
			break

		case 'play':
			chrome.runtime.sendMessage({action: 'play'});
			break
	}
});
