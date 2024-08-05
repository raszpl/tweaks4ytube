/*--------------------------------------------------------------
>>> BACKGROUND
----------------------------------------------------------------
# Locale
# Context menu
# Tab focus/blur
# Message listener
# Uninstall URL
--------------------------------------------------------------*/
chrome.runtime.onInstalled.addListener(function (installed) {
	if (installed.reason == 'install') {
		if (navigator.userAgent.indexOf("Firefox") != -1) {
			chrome.storage.local.set({below_player_pip: false})
		}
		if (navigator.userAgent.indexOf('Safari') !== -1
		   && (!/Windows|Chrom/.test(navigator.userAgent)
			   || /Macintosh|iPhone/.test(navigator.userAgent))) {
			chrome.storage.local.set({below_player_pip: false})
			// still needed? (are screenshots broken in Safari?):
			chrome.storage.local.set({below_player_screenshot: false})
		}
	}
});
/*--- LOCALE -------------------------------------------------*/
function getLocale (language, callback) {
	language = language.replace('-', '_');
	fetch('_locales/' + language.substring(0, 2) + '/messages.json').then(function (response) {
		if (response.ok) {
			response.json().then(callback);
		} else {
			fetch('_locales/' + language.substring(0, 2) + '/messages.json').then(function (response) {
				if (response.ok) {
					response.json().then(callback);
				} else {
					getLocale('en', callback);
				}
			}).catch(function () { getLocale('en', callback); });
			getLocale('en', callback);
		}
	}).catch(function () {
		getLocale('en', callback);
	});
};
/*--- CONTEXT MENU -------------------------------------------*/
function updateContextMenu (language) {
	if (!language || language === 'default') language = chrome.i18n.getUILanguage();
	getLocale(language, function (response) {
		const items = [
			'GitHub'
		];
		chrome.contextMenus.removeAll();

		for (const [index, item] of items.entries()) {
			const text = response?.[item]?.message || item;

			chrome.contextMenus.create({
				id: String(index),
				title: text,
				contexts: ['action'] //manifest3
				// contexts: ['browser_action'] //manifest2
			});
		}
		chrome.contextMenus.onClicked.addListener(function (info) {
			const links = [
				'https://github.com/raszpl/tweaks4ytube'
			];
			chrome.tabs.create({ url: links[info.menuItemId] }); //manifest3
			// window.open(links[info.menuItemId]); //manifest2
		});
	});
};

chrome.runtime.onInstalled.addListener(function () {
	chrome.storage.local.get(function (items) {
		updateContextMenu(items.language);
	});
});

chrome.storage.onChanged.addListener(function (changes) {
	if (changes?.language) updateContextMenu(changes.language.newValue);
	if (changes?.improvedTubeSidebar) chrome.sidePanel.setPanelBehavior({openPanelOnActionClick: changes.language.newValue});
});
/*--- TAB Helper, prune stale connected tabs -----------------*/
let tabConnected = {},
	tab = {},
	tabPrev = {},
	windowId;

function tabPrune (callback) {
	chrome.tabs.query({ url: 'https://www.youtube.com/*' }).then(function (tabs) {
		let tabIds = [];
		for (let tab of tabs) {
			if (!tab.discarded && tabConnected[tab.id]) {
				tabIds.push(tab.id);
			}
		}
		for (let id in tabConnected) {
			if (!tabIds.includes(Number(id))) {
				delete tabConnected[id];
			}
		}
		callback();
	}, function () { console.log("Error querying Tabs") });
};
/*--------------------------------------------------------------
# TAB FOCUS/BLUR
 commented out console.log left intentionally, to help understand
 https://issues.chromium.org/issues/41116352
--------------------------------------------------------------*/
chrome.tabs.onActivated.addListener(function (activeInfo) {
	tabPrev = tab;
	tab = activeInfo;
	//console.log('activeInfo', windowId, tabPrev, tab);
	tabPrune(function () {
		if (windowId == tabPrev.windowId) {
			if (tabConnected[tabPrev.tabId]) {
				chrome.tabs.sendMessage(tabPrev.tabId, {action: 'blur'});
				//console.log('tabIdPrev', tabPrev.tabId);
			}
			if (tabConnected[tab.tabId]) {
				chrome.tabs.sendMessage(tab.tabId, {action: 'focus'});
				//console.log('tabId', tab.tabId);
			}
		}
	});
});
chrome.windows.onFocusChanged.addListener(function (wId) {
	windowId = wId;
	//console.log('onFocusChanged', windowId, tabPrev, tab);
	tabPrune(function () {
		if (windowId != tab.windowId && tab.tabId && !tab.blur && tabConnected[tab.tabId]) {
			tab.blur = true;
			chrome.tabs.sendMessage(tab.tabId, {action: 'blur'});
			//console.log('blur', tab.tabId, windowId);
		} else if (windowId == tab.windowId && tab.tabId && tab.blur && tabConnected[tab.tabId]) {
			tab.blur = false;
			chrome.tabs.sendMessage(tab.tabId, {action: 'focus'});
			//console.log('focus', tab.tabId, windowId);
		}
	});
});
/*--- MESSAGE LISTENER ---------------------------------------*/
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	console.log(message?.action);
	//console.log(sender);

	switch (message?.action) {
		case 'play':
			tabPrune(function () {
				for (let id in tabConnected) {
					id = Number(id);
					if (id != sender.tab.id) {
						chrome.tabs.sendMessage(id, {action: "another-video-started-playing"});
					}
				}
			});
			break

		case 'options-page-connected':
			sendResponse({
				isTab: !!sender.tab
			});
			break

		case 'tab-connected':
			tabConnected[sender.tab.id] = true;
			sendResponse({
				tabId: sender.tab.id
			});
			break

		case 'popup':
			chrome.windows.create({
				type: 'popup',
				width: message.width,
				height: message.height,
				left: 0,
				top: 20,
				url: message.url
			});
			break
	}
});
