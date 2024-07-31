/*--------------------------------------------------------------
>>> THEMES
--------------------------------------------------------------*/

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

/*--------------------------------------------------------------
# SECTION
--------------------------------------------------------------*/

extension.skeleton.main.layers.section.themes.on.click.section = {
	component: 'section',
	class: 'satus-section--transparent-card',

	default: function () {
		return {
			component: 'label',
			class: 'satus-label--' + (satus.storage.get('theme') == 'dark' ? 'dark-theme' : 'default-theme'),
			text: satus.storage.get('theme') == 'dark' ? 'youtubesDark' : 'youtubesLight',
			radio: {
				component: 'radio',
				storage: 'theme',
				value: satus.storage.get('theme') == 'dark' ? 'dark' : 'light',
				...(!satus.storage.get('theme') && { checked: true })
			}
		}
	},
	opposite: function () {
		return {
			component: 'label',
			class: 'satus-label--' + (satus.storage.get('theme') == 'dark' ? 'default-theme' : 'dark-theme'),
			text: satus.storage.get('theme') == 'dark' ? 'youtubesLight' : 'youtubesDark',
			radio: {
				component: 'radio',
				storage: 'theme',
				value: satus.storage.get('theme') == 'dark' ? 'light' : 'dark',
				...(satus.storage.get('theme') == 'dark' && { checked: true })
			}
		}
	},
	custom: {
		component: 'label',
		class: 'satus-label--custom-theme',
		text: 'custom',
		radio: {
			component: 'radio',
			storage: 'theme',
			value: 'custom',
			on: {
				click: {
					section: {
						component: 'section',
						variant: 'card',
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
		}
	},
	black: {
		component: 'label',
		class: 'satus-label--black-theme',
		text: 'black',
		radio: {
			component: 'radio',
			storage: 'theme',
			value: 'black'
		}
	},
	plain: {
		component: 'label',
		class: 'satus-label--plain-theme',
		text: 'plain',
		radio: {
			component: 'radio',
			storage: 'theme',
			value: 'plain'
		}
	},
	sunset: {
		component: 'label',
		class: 'satus-label--sunset-theme',
		text: 'sunset',
		radio: {
			component: 'radio',
			storage: 'theme',
			value: 'sunset'
		}
	},
	night: {
		component: 'label',
		class: 'satus-label--night-theme',
		text: 'night',
		radio: {
			component: 'radio',
			storage: 'theme',
			value: 'night'
		}
	},
	dawn: {
		component: 'label',
		class: 'satus-label--dawn-theme',
		text: 'dawn',
		radio: {
			component: 'radio',
			storage: 'theme',
			value: 'dawn'
		}
	},
	desert: {
		component: 'label',
		class: 'satus-label--desert-theme',
		text: 'desert',
		radio: {
			component: 'radio',
			storage: 'theme',
			value: 'desert'
		}
	}
};
