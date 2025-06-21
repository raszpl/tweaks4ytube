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
		variant: 'align-start',

		back: {
			component: 'button',
			variant: 'icon',
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
			variant: 'it_title',
			text: chrome.runtime.getManifest().short_name
		},
		it_version: {
			component: 'span',
			variant: 'it_version',
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
					variant: 'vertical-menu',
					category: true,
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
				let	title,
					parent = skeleton;

				// update Title element
				// find label for opened Layer, can be category, button name or section card title
				const label = function (element) {
					if (element.category) {
						if (element.label) {
							return element.label.text;
						} else if (element.text) {
							return element.text;
						}
					} else if (element.component === 'button') {
						return element.text;
					} else if (element.variant === 'card') {
						return element.title;
					}
				};

				if (skeleton.component === 'layers') {
					// 'layers' is Home screen
					title = section.it_title.text;
				} else if (skeleton.parentSkeleton && skeleton.parentSkeleton.category) {
					// category
					title = label(skeleton.parentSkeleton);
				} else if (skeleton.parentObject) {
					// skeleton is a section clicked from Search redirect

					// traverse skeleton all the way back to find label/title/text
					while (parent.parentObject && !parent.category && !label(parent)) {
						parent = parent.parentObject;
					}
					title = label(parent);
				}

				section.it_title.rendered.innerText = satus.locale.get(title);
				section.back.rendered.hidden = this.path.length <= 2;
				section.it_version.rendered.hidden = this.path.length > 2;

				document.querySelector('.satus-popup--vertical-menu')?.close();
			}
		},
		section: {
			component: 'section',
			variant: function () {
				if (satus.storage.get('it_layout') === 'list') {
					return 'card';
				}

				return 'home';
			}
		}
	}
};
