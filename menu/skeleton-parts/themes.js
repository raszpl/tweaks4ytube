/*--- THEMES -------------------------------------------------*/
extension.skeleton.main.layers.section.themes = {
	component: 'button',
	variant: 'themes',
	category: true,
	on: {
		click: {}
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

			path: {
				component: 'path',
				attr: {
					'd': 'M12 2.69l5.66 5.66a8 8 0 11-11.31 0z'
				}
			}
		}
	},
	label: {
		component: 'span',
		text: 'themes'
	}
};
/*--- SECTION ------------------------------------------------*/
extension.skeleton.main.layers.section.themes.on.click.section = {
	component: 'section',
	class: 'satus-section--transparent-card',
	value: satus.storage.get('theme') == 'dark' ? 'dark' : 'light',

	default: function () {
		return {
			component: 'radio',
			class: 'satus-label--' + (satus.storage.get('theme') == 'dark' ? 'dark-theme' : 'default-theme'),
			text: satus.storage.get('theme') == 'dark' ? 'youtubesDark' : 'youtubesLight',
			storage: 'theme',
			value: satus.storage.get('theme') == 'dark' ? 'dark' : 'light',
			...(!satus.storage.get('theme') && { checked: true })
		}
	},
	opposite: function () {
		return {
			component: 'radio',
			class: 'satus-label--' + (satus.storage.get('theme') == 'dark' ? 'default-theme' : 'dark-theme'),
			text: satus.storage.get('theme') == 'dark' ? 'youtubesLight' : 'youtubesDark',
			storage: 'theme',
			value: satus.storage.get('theme') == 'dark' ? 'light' : 'dark',
			...(satus.storage.get('theme') == 'dark' && { checked: true })
		}
	},
	custom: {
		component: 'radio',
		class: 'satus-label--custom-theme',
		text: 'custom',
		storage: 'theme',
		value: 'custom',
		on: {
			click: {
				custom_colors: {
					component: 'section',
					variant: 'card',
					title: 'custom_colors',

					theme_primary_color: {
						component: 'color-picker',
						text: 'primaryColor',
						value: [200, 200, 200]
					},
					theme_text_color: {
						component: 'color-picker',
						text: 'textColor',
						value: [25, 25, 25]
					}
				}
			}
		}
	},
	black: {
		component: 'radio',
		class: 'satus-label--black-theme',
		text: 'black',
		storage: 'theme',
		value: 'black'
	},
	plain: {
		component: 'radio',
		class: 'satus-label--plain-theme',
		text: 'plain',
		storage: 'theme',
		value: 'plain'
	},
	sunset: {
		component: 'radio',
		class: 'satus-label--sunset-theme',
		text: 'sunset',
		storage: 'theme',
		value: 'sunset'
	},
	night: {
		component: 'radio',
		class: 'satus-label--night-theme',
		text: 'night',
		storage: 'theme',
		value: 'night'
	},
	dawn: {
		component: 'radio',
		class: 'satus-label--dawn-theme',
		text: 'dawn',
		storage: 'theme',
		value: 'dawn'
	},
	desert: {
		component: 'radio',
		class: 'satus-label--desert-theme',
		text: 'desert',
		storage: 'theme',
		value: 'desert'
	}
};
