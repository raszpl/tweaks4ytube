/*--- ACTIVE FEATURES ----------------------------------------*/
extension.skeleton.header.sectionEnd.menu.on.click.activeFeatures = {
	component: 'button',
	category: true,

	on: {},
	svg: {
		component: 'svg',
		attr: {
			'viewBox': '0 0 24 24',
			'fill': 'none',
			'stroke': 'currentColor',
			'stroke-width': '1.75'
		},

		path1: {
			component: 'path',
			attr: {
				'd': 'M22 11.08V12a10 10 0 11-5.93-9.14'
			}
		},
		path2: {
			component: 'path',
			attr: {
				'd': 'M22 4L12 14.01l-3-3'
			}
		}
	},
	label: {
		component: 'span'
	}
};
/*--- SECTION ------------------------------------------------*/
extension.skeleton.header.sectionEnd.menu.on.click.activeFeatures.on.click = {
	component: 'section',
	variant: 'card',

	on: {
		render: function () {
			const active = ['select', 'color-picker', 'radio', 'slider', 'shortcut', 'checkbox', 'switch'];
			let component = this;

			satus.search('', extension.skeleton, function (features) {
				let skeleton = {};

				for (const [key, feature] of Object.entries(features)) {
					// only check potentially active elements
					if (!active.includes(feature.component)) continue;

					let parent = feature,
						category,
						subcategory,
						text;

					let default_value = feature.value,
						value = feature.storage && satus.storage.get(feature.storage) || satus.storage.get(key),
						parent_object = feature;

					if (!satus.isset(default_value)) {
						if (feature.component === 'select') {
							if (feature.options && feature.options[0]) {
								default_value = feature.options[0].value;
							}
						} else {
							default_value = false;
						}
					}

					// no setting, bailing out
					if (!satus.isset(value)) continue;
					// interested in values different from default, except for 'radio'
					if (value !== default_value && (feature.component === 'radio')
						|| (value === default_value && feature.component !== 'radio')) continue;

					while (parent.parentObject && !parent.parentObject.category) {
						parent = parent.parentObject;
						subcategory = '';

						if (parent.component == 'button') {
							subcategory = satus.locale.get(parent.text);
						} else if (parent.title) {
							subcategory = satus.locale.get(parent.title);
						}
						text = !subcategory ? text : (!text ? subcategory : subcategory + ' > ' + text);
						category = !category ? subcategory : (!subcategory ? category : subcategory + category);
					}

					if (parent.parentObject?.label?.text) {
						subcategory = satus.locale.get(parent.parentObject.label.text);
						text = subcategory + (!text ? '' : ' > ' + text);
						category = (!category ? subcategory : subcategory + category).replace(/[^a-zA-Z]/g, '');
					}

					skeleton[category + '_label'] = {
						component: 'section',
						variant: 'label',
						text: text
					}

					if (!skeleton[category]) {
						skeleton[category] = {
							component: 'section',
							variant: 'card'
						}
					}

					skeleton[category][key] = feature;
				}

				if (Object.keys(skeleton).length === 0) {
					satus.render({
						component: 'span',
						text: 'empty'
					}, component);
				} else {
					satus.render(skeleton, component.parentNode);

					component.remove();
				}
			});
		}
	}
};
