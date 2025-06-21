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
		component: 'span'
	}
};
/*--- SECTION ------------------------------------------------*/
extension.skeleton.main.layers.section.themes.on.click.theme = {
	component: 'section',
	variant: 'transparent-card',
	value: 'light',

	default: function () {
		return {
			component: 'radio',
			variant: satus.storage.get('theme') == 'dark' ? 'dark-theme' : 'default-theme',
			text: satus.storage.get('theme') == 'dark' ? 'youtubesDark' : 'youtubesLight',
			storage: 'theme',
			value: satus.storage.get('theme') == 'dark' ? 'dark' : 'light',
			...(!satus.storage.get('theme') && { checked: true })
		}
	},
	opposite: function () {
		return {
			component: 'radio',
			variant: satus.storage.get('theme') == 'dark' ? 'default-theme' : 'dark-theme',
			text: satus.storage.get('theme') == 'dark' ? 'youtubesLight' : 'youtubesDark',
			storage: 'theme',
			value: satus.storage.get('theme') == 'dark' ? 'light' : 'dark',
			...(satus.storage.get('theme') == 'dark' && { checked: true })
		}
	},
	custom: {
		component: 'radio',
		variant: 'custom-theme',
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
		variant: 'black-theme',
		storage: 'theme',
		value: 'black'
	},
	plain: {
		component: 'radio',
		variant: 'plain-theme',
		storage: 'theme',
		value: 'plain'
	},
	sunset: {
		component: 'radio',
		variant: 'sunset-theme',
		storage: 'theme',
		value: 'sunset'
	},
	night: {
		component: 'radio',
		variant: 'night-theme',
		storage: 'theme',
		value: 'night'
	},
	dawn: {
		component: 'radio',
		variant: 'dawn-theme',
		storage: 'theme',
		value: 'dawn'
	},
	desert: {
		component: 'radio',
		variant: 'desert-theme',
		storage: 'theme',
		value: 'desert'
	}
};
