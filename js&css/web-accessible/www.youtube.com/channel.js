/*------------------------------------------------------------------------------
4.6.0 CHANNEL
------------------------------------------------------------------------------*/
/*--- DEFAULT CHANNEL TAB ----------------------------------------------------*/
ImprovedTube.channelDefaultTab = function (a = document.querySelectorAll('A.ytd-video-owner-renderer, .ytd-channel-name>A')) {
	const option = this.storage.channel_default_tab;

	if (option) {
		if (a instanceof Node
			&& (a.classList.contains('ytd-video-owner-renderer') ||	a.parentNode?.classList.contains('ytd-channel-name'))
			&& !a.href.endsWith(option)
			&& this.regex.channel_home_page.test(a.href)) {

			if (document.documentElement.dataset.pageType === 'video' && a.parentNode.classList.contains('ytd-channel-name')) {
				this.elements.yt_channel_name = a.parentNode.textContent;
				this.elements.yt_channel_link = a.href;
				this.howLongAgoTheVideoWasUploaded();
				this.channelVideosCount();
			}

			a.href = a.href.match(this.regex.channel)[0] + option;
			a.onclick = function (event) {event.stopPropagation()};
		} else if (a instanceof NodeList) { a.forEach(a => {a.href = a.href.match(this.regex.channel)[0] + option}) }
	} else if (a instanceof NodeList) { a.forEach(a => {a.href = a.href.match(this.regex.channel)[0]}) }
};
/*--- PLAY ALL BUTTON --------------------------------------------------------*/
ImprovedTube.channelPlayAllButton = function () {
	if (ImprovedTube.regex.channel.test(location.pathname)) {
		if (this.storage.channel_play_all_button) {
			const container = document.querySelector('ytd-channel-sub-menu-renderer #primary-items')
					|| document.querySelector('ytd-two-column-browse-results-renderer #chips-content'),
				playlistUrl = document.querySelector('ytd-app')?.__data?.data?.response?.metadata?.channelMetadataRenderer?.externalId?.substring(2);

			if (!container) return; // we only add button on /videos page
			if (!playlistUrl) {
				console.error('channelPlayAllButton: Cant fint Channel playlist');
				return;
			}
			const button = this.createIconButton({
				type: 'playAll',
				className: 'it-play-all-button',
				text: 'Play all',
				href: '/playlist?list=UU' + playlistUrl
			});
			container.appendChild(button);
		} else {
			document.querySelector('.it-play-all-button')?.remove();
		}
	}
};
