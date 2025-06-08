/*--- CHANNEL ------------------------------------------------*/
extension.skeleton.main.layers.section.channel = {
	component: 'button',
	variant: 'channel',
	category: true,
	on: {
		click: {
			component: 'section',
			variant: 'card',

			channel_thumbs: {
				component: 'select',
				text: 'thumb_per_row',
				options: [{
					text: '4',
					value: 4
				}, {
					text: '5',
					value: 5
				}, {
					text: '6',
					value: 6
				}, {
					text: '7',
					value: 7
				}, {
					text: '8',
					value: 8
				}],
				tags: 'icons,columns'
			},
			channel_default_tab: {
				component: 'select',
				text: 'defaultChannelTab',
				options: [{
					text: 'home',
					value: '/'
				}, {
					text: 'videos',
					value: '/videos'
				}, {
					text: 'shorts',
					value: '/shorts'
				}, {
					text: 'playlists',
					value: '/playlists'
				}, {
					text: 'community',
					value: '/community'
				}, {
					text: 'channels',
					value: '/channels'
				}, {
					text: 'about',
					value: '/about'
				}]
			},
			channel_trailer_autoplay: {
				component: 'switch',
				text: 'trailerAutoplay',
				value: true
			},
			channel_play_all_button: {
				component: 'switch',
				text: 'playAllButton'
			},
			channel_hide_featured_content: {
				component: 'switch',
				text: 'hideFeaturedContent'
			},
			thumb_title_max: {
				component: 'switch',
				text: 'thumb_title_max'
			}
		}
	},

	icon: {
		component: 'span',

		svg: {
			component: 'svg',
			attr: {
				'viewBox': '0 0 24 24',
				'fill': 'transparent',
				'stroke': 'currentColor',
				'stroke-linecap': 'round',
				'stroke-width': '1.75'
			},

			rect: {
				component: 'rect',
				attr: {
					'width': '20',
					'height': '15',
					'x': '2',
					'y': '7',
					'rx': '2',
					'ry': '2'
				}
			},
			path: {
				component: 'path',
				attr: {
					'd': 'M17 2l-5 5-5-5'
				}
			}
		}
	},
	label: {
		component: 'span',
		text: 'channel'
	}
};
