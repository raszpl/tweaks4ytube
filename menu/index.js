/*--- INDEX: -------------------------------------------------*/
satus.storage.import(function (items) {
	satus.locale.import(items.it_language, function () {
		if (['?action=import-settings', '?action=export-settings'].includes(location.search)) return;

		// initialize skeleton by pre-filling it with default structures (parentObject, .text)
		satus.parentify(extension.skeleton, [
			'attr',
			'baseProvider',
			'layersProvider',
			'rendered',
			'storage',
			'parentObject',
			'parentSkeleton',
			'childrenContainer',
			'value'
		]);

		satus.render(extension.skeleton);

		extension.attributes();
		satus.events.on('storage-set', extension.attributes);

		// show debug performance stats ?
		if (items.it_debug_stats) {
			chrome.tabs.query({
				currentWindow: true,
				active: true,
				url: 'https://www.youtube.com/*'
			}).then(t => {
				if (t.length) {
					chrome.tabs.sendMessage(t[0].id, {
						action: 'performance-request'
					});
				}
			});
		}
	}, '_locales/');
});

extension.attributes = function (key) {
	const attributes = [
		'theme',
		'it_layout',
		'it_version',
		'it_layer_animation_scale',
		'it_general',
		'it_player',
		'it_appearance',
		'it_subscriptions',
		'it_channel',
		'it_shortcuts',
		'it_playlist',
		'it_themes',
		'it_blocklist',
		'it_analyzer'
	];
	function attrib (attribute) {
		const value = satus.storage.get(attribute);

		if (satus.isset(value)) {
			extension.skeleton.rendered.setAttribute(attribute, value);
		} else {
			extension.skeleton.rendered.removeAttribute(attribute);
		}
	};

	if (!key) {
		// init
		for (const attribute of attributes) {
			attrib(attribute);
		}
	} else if (attributes.includes(key)) {
		// changed one of attributes we watch for, inject it into .satus-base element
		attrib(key);
	}
};

chrome.runtime.sendMessage({
	action: 'options-page-connected'
}, function (response) {
	if (!response) {
		console.error('Cant connect to backgrount.js Service Worker');
		return;
	}
	if (response.isTab) {
		document.body.setAttribute('tab', '');

		if (!location.search.startsWith('?action=')) return;

		const element = document.createElement('button');
		element.id = 'action';

		if (location.search == '?action=import-settings') {
			element.onclick = extension.skeleton.header.sectionEnd.menu.on.click.settings.on.click.secondSection.backupAndReset.on.click.section.importSettings.on.click.ok;
			element.appendChild(document.createTextNode(satus.locale.get('importSettings')));
		} else if (location.search == '?action=export-settings') {
			element.onclick = extension.skeleton.header.sectionEnd.menu.on.click.settings.on.click.secondSection.backupAndReset.on.click.section.exportSettings.on.click.ok;
			element.appendChild(document.createTextNode(satus.locale.get('exportSettings')));
		}

		document.body.appendChild(element);
	}
});

chrome.runtime.onMessage.addListener(function (message) {
	if (message.action === 'performance-reply') {
		const element = document.createElement('pre');
		element.style = 'position:fixed; top: 466px;';
		element.appendChild(document.createTextNode('Elements start ' + message.perf.elements_start));
		element.appendChild(document.createTextNode('\nElements injected ' + message.perf.elements_injected));
		element.appendChild(document.createTextNode('\nElements handled ' + (message.perf.elements_handled_name + message.perf.elements_handled_id + message.perf.elements_handled_class)));
		element.appendChild(document.createTextNode('\n name ' + message.perf.elements_handled_name));
		element.appendChild(document.createTextNode('\n id ' + message.perf.elements_handled_id));
		element.appendChild(document.createTextNode('\n class ' + message.perf.elements_handled_class));
		element.appendChild(document.createTextNode('\nTime ' + message.perf.time + ' ms'));
		document.body.appendChild(element);
	}
});
