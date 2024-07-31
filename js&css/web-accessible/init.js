/*--------------------------------------------------------------
>>> INITIALIZATION
--------------------------------------------------------------*/
if (document.body?.children) {
	ImprovedTube.mutated.clear();
	for (let i = 0; i < document.body.children.length; i++) {
		ImprovedTube.childHandler(document.body.children[i]);
	}
	ImprovedTube.perf.elements_start += ImprovedTube.mutated.size;
	ImprovedTube.mutated.forEach(ImprovedTube.ytElementsHandler);
};

ImprovedTube.observer = new MutationObserver(function (mutationList) {
	performance.mark('A');
	ImprovedTube.mutated.clear();

	for (let i = 0, l = mutationList.length; i < l; i++) {
		if (mutationList[i].type === 'childList') {
			for (let j = 0, k = mutationList[i].addedNodes.length; j < k; j++) {
				ImprovedTube.childHandler(mutationList[i].addedNodes[j]);
			}
		}
	}

	ImprovedTube.perf.elements_injected += ImprovedTube.mutated.size;
	ImprovedTube.mutated.forEach(ImprovedTube.ytElementsHandler);

	performance.mark('B');
	performance.measure('set', 'A', 'B');
	//performance.getEntriesByName("set").reduce((partialSum, a) => partialSum + a.duration, 0)
}).observe(document.documentElement, {
	childList: true,
	subtree: true
});

ImprovedTube.init = function () {
	ImprovedTube.setTheme();
	ImprovedTube.playerLimits();
	ImprovedTube.pageType();
	ImprovedTube.playerOnPlay();
	ImprovedTube.playerSDR();
	ImprovedTube.shortcutsInit();
	ImprovedTube.onkeydown();
	ImprovedTube.onmousedown();
	ImprovedTube.blocklistInit();
	ImprovedTube.youtubeLanguage();
	window.addEventListener('yt-page-data-updated', function () {
		ImprovedTube.pageType();
		if (location.search.match(ImprovedTube.regex.playlist_id)) {
			ImprovedTube.playlistRepeat();
			ImprovedTube.playlistShuffle();
			ImprovedTube.playlistReverse();
			ImprovedTube.playlistPopup();
		}
	});
	if (ImprovedTube.storage.undo_the_new_sidebar) ImprovedTube.undoTheNewSidebar();
	if (ImprovedTube.storage.description === "sidebar") ImprovedTube.descriptionSidebar();

	if (ImprovedTube.elements.player && ImprovedTube.elements.player.setPlaybackRate) {
		ImprovedTube.videoPageUpdate();
		ImprovedTube.initPlayer();
	}

	if (window.matchMedia) {
		document.documentElement.dataset.systemColorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	}
};

document.addEventListener('yt-navigate-finish', function () {
	ImprovedTube.pageType();

	if (ImprovedTube.storage.undo_the_new_sidebar) ImprovedTube.undoTheNewSidebar();
	ImprovedTube.commentsSidebar();

	if (ImprovedTube.elements.player && ImprovedTube.elements.player.setPlaybackRate) {
		ImprovedTube.videoPageUpdate();
		ImprovedTube.initPlayer();
	}

	if (document.documentElement.dataset.pageType === 'home' &&	 ImprovedTube.storage.youtube_home_page === 'search' ) {
		document.querySelector('body').style.setProperty('visibility', 'visible', 'important');
		ImprovedTube.shortcutGoToSearchBox();
		document.querySelector('#search').click();
	} else if (document.documentElement.dataset.pageType === 'channel') {
		ImprovedTube.channelPlayAllButton();
	}
});

window.addEventListener('load', function () {
	ImprovedTube.youtubeIcon();
	if (document.documentElement.dataset.pageType === 'home' && ImprovedTube.storage.youtube_home_page === 'search' ) {
		document.querySelector('body').style.setProperty('visibility', 'visible', 'important');
		ImprovedTube.shortcutGoToSearchBox();
		document.querySelector('#search').click();
	}
});
