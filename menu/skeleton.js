/*--- SKELETON -------------------------------------------------
# Base
# Header
# Main
--------------------------------------------------------------*/

/*--- BASE ---------------------------------------------------*/
let extension = {
	skeleton: {
		component: 'base'
	}
};
/*--- HEADER -------------------------------------------------*/
extension.skeleton.header = {
	component: 'header',

	sectionStart: {
		component: 'section',
		class: 'satus-section--align-start',

		back: {
			component: 'button',
			class: 'satus-section--icon',
			attr: {
				'hidden': 'true'
			},
			on: {
				click: 'main.layers.back'
			},

			svg: {
				component: 'svg',
				attr: {
					'viewBox': '0 0 24 24',
					'stroke-width': '1.5',
					'stroke': 'currentColor',
					'fill': 'none'
				},

				path: {
					component: 'path',
					attr: {
						'd': 'M14 18l-6-6 6-6'
					}
				}
			}
		},
		it_title: {
			component: 'span',
			class: 'satus-span--title'
		},
		it_version: {
			component: 'span',
			class: 'satus-span--version',
			text: chrome.runtime.getManifest().version
		}
	},
	sectionEnd: {
		component: 'section',
		variant: 'align-end',
		search: {
			component: 'button',
			variant: 'icon',
			on: {
				click: function () {
					document.querySelector('#searchBar').hidden = false;
					document.querySelector('#searchBar').dispatchEvent(new CustomEvent('render'));
				}
			},

			svg: {
				component: 'svg',
				attr: {
					'viewBox': '0 0 24 24',
					'stroke': 'currentcolor',
					'stroke-linecap': 'round',
					'stroke-linejoin': 'round',
					'stroke-width': '1.25',
					'fill': 'none'
				},

				circle: {
					component: 'circle',
					attr: {
						'cx': '11',
						'cy': '10.5',
						'r': '6'
					}
				},
				path: {
					component: 'path',
					attr: {
						'd': 'M20 20l-4-4'
					}
				}
			}
		},
		menu: {
			component: 'button',
			variant: 'icon',
			on: {
				click: {
					component: 'popup',
					variant: 'vertical-menu'
				}
			},

			svg: {
				component: 'svg',
				attr: {
					'viewBox': '0 0 24 24',
					'stroke-width': '2',
					'stroke': 'currentColor',
					'fill': 'none'
				},

				circle1: {
					component: 'circle',
					attr: {
						'cx': '12',
						'cy': '5.25',
						'r': '0.45'
					}
				},
				circle2: {
					component: 'circle',
					attr: {
						'cx': '12',
						'cy': '12',
						'r': '0.45'
					}
				},
				circle3: {
					component: 'circle',
					attr: {
						'cx': '12',
						'cy': '18.75',
						'r': '0.45'
					}
				}
			}
		}
	}
};
/*--- MAIN ---------------------------------------------------*/
extension.skeleton.main = {
	component: 'main',

	layers: {
		component: 'layers',
		on: {
			open: function () {
				const skeleton = this.path.last,
					section = this.baseProvider.skeleton.header.sectionStart;
				let	title;

				if (skeleton.parentSkeleton) {
					if (skeleton.parentSkeleton.label) {
						title = skeleton.parentSkeleton.label.text;
					} else if (skeleton.parentSkeleton.text) {
						title = skeleton.parentSkeleton.text;
					} else {
						title = chrome.runtime.getManifest().short_name;
					}
				}

				section.back.rendered.hidden = this.path.length <= 2;
				section.it_title.rendered.innerText = satus.locale.get(title);
				section.it_version.rendered.hidden = this.path.length > 2;

				document.querySelector('.satus-popup--vertical-menu')?.close();
			}
		},

		section: {
			component: 'section',
			variant: function () {
				if (satus.storage.get('improvedtube_home') === 'list') {
					return 'card';
				}

				return 'home';
			}
		}
	}
};
