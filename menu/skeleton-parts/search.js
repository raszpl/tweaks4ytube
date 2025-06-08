/*--- SEARCH -------------------------------------------------*/
extension.skeleton.header.searchBar = {
	component: 'text-field',
	variant: 'search',
	focus: true,
	storage: false,
	prepend: true,
	placeholder: 'search',
	attr: {
		'hidden': false
	},
	on: {
		render: function () {
			this.input.focus();
			if (this.dataset.search) {
				this.value = this.dataset.search;
				this.dispatchEvent(new CustomEvent('input'));
			}
		},
		blur: function () {
			if (this.value.length === 0 || this.dataset.results === '0') {
				document.querySelector('.search-results')?.close();
				this.hidden = true;
			}
		},
		input: function () {
			const searchbar = this,
				value = this.value.trim();

			if (value != this.dataset.search ) {
				this.dataset.search = value;
			}

			if (value.length > 0) {
				satus.search(value, extension.skeleton, function (results) {
					let search_results = document.querySelector('.search-results'),
						skeleton = {
							component: 'popup',
							class: 'search-results'
						};

					// prepare search results
					for (const [key, result] of Object.entries(results)) {
						let parent = result,
							category,
							subcategory,
							text;

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
							component: 'span',
							class: 'satus-section--label',
							text: text
						}

						if (!skeleton[category]) {
							skeleton[category] = {
								component: 'section',
								variant: 'card'
							}
						}

						skeleton[category][key] = result;
					}

					if (Object.keys(results).length === 0) {
						search_results?.remove();
						delete searchbar.searchPosition;
						searchbar.removeAttribute('results');
						searchbar.dataset.results = 0;
						searchbar.title = '0 ' + satus.locale.get('searchResults');
					} else {
						if (search_results) {
							const surface = document.querySelector('.search-results .satus-popup__surface');

							satus.empty(surface);
							satus.render(skeleton, surface, undefined, true);

							searchbar.dataset.results = Object.keys(results).length;
							searchbar.title = Object.keys(results).length + ' ' + satus.locale.get('searchResults');
						} else {
							searchbar.setAttribute('results', '');
							searchbar.dataset.results = Object.keys(results).length;
							searchbar.title = Object.keys(results).length + ' ' + satus.locale.get('searchResults');

							search_results = satus.render(skeleton, searchbar.baseProvider);

							// restore scroll position
							if (searchbar.searchPosition) {
								search_results.childNodes[1].scrollTop = searchbar.searchPosition;
							}

							// close Search results on 'button' or clicking outside
							search_results.addEventListener('click', (event) => {
								// buttons call component.open and load new sections
								if (event.target.closest('button')
									// or click outside of Search results window
									|| event.target.componentName === "popup__scrim") {
									// just click Close Search button, its going to take care of the rest
									searchbar.skeleton.close.rendered.click();
								}
							});

							// we need one unique global listener to catch vertical-menu button clicks
							if (!searchbar.globalListener) {
								searchbar.globalListener = function (event) {
									// hide search results when clicking on vertical-menu button
									if (event.target.closest('.satus-popup.satus-popup--vertical-menu') && event.target.closest('.satus-button')) {
										searchbar.skeleton.close.rendered.click();
									}
								};
							}
							document.addEventListener('click', searchbar.globalListener);
						}
					}
				});
			} else {
				const search_results = document.querySelector('.search-results');

				if (search_results) {
					search_results.close();

					searchbar.removeAttribute('results');
				}
			}
		}
	},

	close: {
		component: 'button',
		variant: 'icon',
		on: {
			click: function () {
				const search_results = document.querySelector('.search-results'),
					searchbar = this.parentNode;

				if (search_results) {
					// remember scroll position when closing Search
					searchbar.searchPosition = search_results.childNodes[1].scrollTop;
					// remove global listener
					document.removeEventListener('click', searchbar.globalListener);
					search_results.close();
				}

				document.querySelector('#searchBar').hidden = true;
			}
		},

		svg: {
			component: 'svg',
			attr: {
				'viewBox': '0 0 24 24',
				'stroke-width': '1.75',
				'stroke': 'none',
				'fill': 'currentColor'
			},

			path: {
				component: 'path',
				attr: {
					'd': 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'
				}
			}
		}
	}
};
