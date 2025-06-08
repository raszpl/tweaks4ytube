/*--- SUBSCRIPTIONS ------------------------------------------*/
extension.skeleton.main.layers.section.subscriptions = {
	component: 'button',
	variant: 'subscriptions',
	category: true,
	on: {
		click: {
			section_1: {
				component: 'section',
				variant: 'card',

				subscription_thumbs: {
					component: 'select',
					text: 'thumb_per_row',
					options: [{
						text: '3',
						value: 3
					}, {
						text: '4',
						value: 4
					}, {
						text: '5',
						value: 5
					}, {
						text: '6',
						value: 6
					}],
					tags: 'icons,columns'
				},
				remove_subscriptions_shorts: {
					component: 'switch',
					text: 'remove_subscriptions_shorts'
				},
				thumb_title_max: {
					component: 'switch',
					text: 'thumb_title_max'
				}
			}
		}
	},
	icon: {
		component: 'span',

		svg: {
			component: 'svg',
			attr: {
				'viewBox': '0 0 24 24',
				'fill': 'none',
				'stroke': 'currentColor',
				'stroke-linecap': 'round',
				'stroke-width': '1.75'
			},

			path: {
				component: 'path',
				attr: {
					'd': 'M5.5 3A1.5 1.5 0 004 4.5h16A1.5 1.5 0 0018.5 3h-13ZM2 7.5A1.5 1.5 0 013.5 6h17A1.5 1.5 0 0122 7.5v11a1.5 1.5 0 01-1.5 1.5h-17A1.5 1.5 0 012 18.5v-11Zm8 2.87a.5.5 0 01.752-.431L16 13l-5.248 3.061A.5.5 0 0110 15.63v-5.26Z'
				}
			}
		}
	},
	label: {
		component: 'span',
		text: 'subscriptions'
	}
};
