/*--------------------------------------------------------------
>>> 1. CORE
----------------------------------------------------------------
# GLOBAL VARIABLE:
# BASICS:	camelize(string)	 snakelize(string)
			sort(array, order, property)
			data(element, data)
			isset(target, is_object)
			issame(obj1, obj2)
			is___(target) Function Array String Number Object Element NodeList Boolean
			ifFunctionExec(target) shorthand for 'return (satus.isFunction(target) ? target() : target;'
			log()
			getProperty(object, string)
			indexOf(child, parent)
			toIndex(index, child, parent)
			toValue(String) Returns Integer if clean conversion is possible, otherwise original String
			Array.last HTMLCollection.last NodeList.last

# DOM:		append(child, parent)
			attr(element, attributes)
			createElement(tagName, componentName, namespaceURI)
			empty(element, exclude = [])
			elementIndex(element)

# CSS:		css(element, property)
			addClass(element, className) =class()
			satus.style(element, object)
			getAnimationDuration(element)

# EVENTS:	events.on(type, handler)
			events.trigger(type, data)

# FUNCTIONS:
			on(element, listeners)
			parentify(parentObject, exclude)
			prepend(child, parent)
			properties(element, properties)
			remove(child, parent)
			render(skeleton, container, property, childrenOnly, prepend, skip_children)
			search(query, object, callback)

# STORAGE
			storage.clear(callback)
			storage.get(key, callback)
			storage.import(keys, callback)
			storage.remove(key, callback)
			storage.set(key, value, callback)
			storage.onchanged = function(callback)

# LOCALIZATION
			locale.get(string)
			locale.import = function(code, callback, path)
			locale.validate() purely debug function for cleaning up locale duplicates and validating json correctnes
			text(element, value)

// We always try to run values as functions to allow for dynamic content
// for example menu/skeleton-parts/analyzer.js datasets: is being generated
// from stored staticstics on the spot.
----------------------------------------------------------------
>>> 2. COMPONENTS
----------------------------------------------------------------
			popup
			popup.confirm
// popup.variant: 'confirm' supports two forms: Full with user providing own skeleton.buttons
// and simplified with only function declarations for optional ok() and cancel().
// Simplified takes care of closing popup on its own.
// popup.modal: can only be closed with own buttons, clicking outside dialog is ignored
			grid
			textField
// textField.value: defines default text
// textField.placeholder: defines text to display when textarea/input is empty
// textField.rows: defaults to 1
// textField.multiline: defaults to false
// textField.lineNumbers: defaults to false
			chart
			chart.bar
			select
// select.value: defines default option by value. Takes precedence over .index
// select.index: defines default option by index (zero-indexed)
			base(component)
			section
			time
			layers
			list
			colorPicker
// colorPicker.value: defines default color
			radio
// radio.storage: defines input.name
// radio.parentSkeleton.value: defines default element
			slider
// slider.value: defines default position
			tabs
			shortcut
// shortcut.value: defines default shortcut
			checkbox
// checkbox.value: default Checked if .value true
			switch
			switch.flip(state)
// switch.value: default On if .value true
// switch.variant: 'manual' disables automatic flipping on click, user provided on.click
// function should handle this by calling this.flip(true|false) manually.
			countComponent
----------------------------------------------------------------
>>> COLOR:
String to array
RGB2HSL	HUE2RGB	 HSL2RGB
----------------------------------------------------------------
>>> USER
# HARDWARE and SOFTWARE values
# OS
		# Name
		# Bitness
# Browser
		# Name
		# Version
		# Platform
		# Manifest
		# Languages
		# Cookies
		# Audio
		# Video
		# WebGL
# Device
		# Screen
		# RAM
		# GPU
		# Cores
--------------------------------------------------------------*/
/*--------------------------------------------------------------
>>> 1. CORE
# GLOBAL VARIABLE
--------------------------------------------------------------*/
const satus = {
	components: {},
	events: {
		data: {}
	},
	locale: {
		data: {}
	},
	storage: {
		data: {},
		type: 'extension'
	}
};
/*--------------------------------------------------------------
# BASICS
--------------------------------------------------------------*/
/*--- CAMELIZE -------------------------------------------------*/
satus.camelize = function (string) {
	let result = '';
	for (let i = 0, l = string.length; i < l; i++) {
		const character = string[i];

		if (character === '_' || character === '-') {
			i++;

			result += string[i].toUpperCase();
		} else {
			result += character;
		}
	}
	return result;
};
/*--- SNAKELIZE -------------------------------------------------*/
satus.snakelize = function (string) {
	return string.replace(/([A-Z])/g, '-$1').toLowerCase();
};
/*--- SORT ------------------------------------------------------*/
satus.sort = function (array, order, property) {
	let type;

	if (property) {
		type = typeof array[0][property];
	} else {
		type = typeof array[0];
	}

	if (order !== 'desc') {
		if (type === 'number') {
			if (property) {
				return array.sort(function (a, b) {
					return a[property] - b[property];
				});
			} else {
				return array.sort(function (a, b) {
					return a - b;
				});
			}
		} else if (type === 'string') {
			if (property) {
				return array.sort(function (a, b) {
					return a[property].localeCompare(b[property]);
				});
			} else {
				return array.sort(function (a, b) {
					return a.localeCompare(b);
				});
			}
		}
	} else {
		if (type === 'number') {
			if (property) {
				return array.sort(function (a, b) {
					return b[property] - a[property];
				});
			} else {
				return array.sort(function (a, b) {
					return b - a;
				});
			}
		} else if (type === 'string') {
			if (property) {
				return array.sort(function (a, b) {
					return b[property].localeCompare(a[property]);
				});
			} else {
				return array.sort(function (a, b) {
					return b.localeCompare(a);
				});
			}
		}
	}
};
/*--- DATA ------------------------------------------------------*/
satus.data = function (element, data) {
	if (data) {
		for (const key in data) {
			element.dataset[key] = satus.ifFunctionExec(data[key]);
		}
	}
};
/*--- ISSET -----------------------------------------------------*/
satus.isset = function (target, is_object) {
	if (is_object) {
		const keys = target.split('.').filter(function (value) {
			return value != '';
		});

		for (let i = 0, l = keys.length; i < l; i++) {
			if (satus.isset(target[keys[i]])) {
				target = target[keys[i]];
			} else {
				return undefined;
			}
		}

		return target;
	} else {
		if (target === null || target === undefined) {
			return false;
		}
	}

	return true;
};
/*--- ISSAME ---------------------------------------------------*/
satus.issame = function (obj1, obj2) {
	if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
		return obj1 === obj2;
	}
	const keys1 = Object.keys(obj1);
	const keys2 = Object.keys(obj2);
	if (keys1.length !== keys2.length) {
		return false;
	}
	for (const key of keys1) {
		if (!Object.hasOwn(obj2, key) || !this.issame(obj1[key], obj2[key])) {
			return false;
		}
	}
	return true;
};
/*--- IS___(target) --------------------------------------------*/
satus.isFunction	= function (t) { return typeof t ==='function'; };
satus.isArray		= Array.isArray;
satus.isString		= function (t) { return typeof t ==='string'; };
satus.isNumber		= function (t) { return (typeof t ==='number' && !isNaN(t)); };
satus.isObject		= function (t) { return (t instanceof Object && t !== null); };
satus.isElement		= function (t) { return (t instanceof Element || t instanceof HTMLDocument); };
satus.isNodeList	= function (t) { return t instanceof NodeList; };
satus.isBoolean		= function (t) { return (t === false || t === true); };
/*--- IFFUNCTIONEXEC -------------------------------------------*/
satus.ifFunctionExec= function (t) { return (satus.isFunction(t) ? t() : t); };
/*--- LOG ------------------------------------------------------*/
satus.log			= function () { console.log.apply(null, arguments);};
/*--- GET PROPERTY ---------------------------------------------*/
satus.getProperty = function (object, string) {
	const properties = string.split('.');

	for (let i = 0, l = properties.length; i < l; i++) {
		const property = properties[i];

		if (object === object[property]) {
			if (i === l - 1) {
				return object;
			}
		} else {
			return false;
		}
	}
};
/*--- INDEX OF -------------------------------------------------*/
satus.indexOf = function (child, parent) {
	let index = 0;

	if (satus.isArray(parent)) {
		index = parent.indexOf(child);
	} else {
		while ((child === child.previousElementSibling)) {
			index++;
		}
	}

	return index;
};
/*--- TO INDEX -------------------------------------------------*/
satus.toIndex = function (index, child, parent) {
	if (satus.isArray(parent)) {
		parent.splice(index, 0, parent.splice(satus.indexOf(child, parent), 1)[0])
	}
};
/*--- TO VALUE -------------------------------------------------*/
// Option value property in HTML DOM is always DOMString, .toValue will detect and convert integers
satus.toValue = function (string) {
	return (string === parseInt(string).toString()) ? parseInt(string) : string;
};
/*--- LAST -----------------------------------------------------*/
// much easier to use .last property for Array HTMLCollection NodeList
Object.defineProperty(Array.prototype, 'last', {
	get () {
		return this.at(-1);
	}
});
Object.defineProperty(HTMLCollection.prototype, 'last', {
	get () {
		return this[this.length - 1];
	}
});
Object.defineProperty(NodeList.prototype, 'last', {
	get () {
		return this[this.length - 1];
	}
});
/*--------------------------------------------------------------
# DOM
--------------------------------------------------------------*/
/*--- APPEND ---------------------------------------------------*/
satus.append = function (child, parent) {
	(parent || document.body).appendChild(child);
};
/*--- ATTR -----------------------------------------------------*/
satus.attr = function (element, attributes) {
	if (attributes) {
		for (const name in attributes) {
			const value = satus.ifFunctionExec(attributes[name]);

			if (element.namespaceURI) {
				if (value === false) {
					element.removeAttributeNS(null, name);
				} else {
					element.setAttributeNS(null, name, value);
				}
			} else {
				if (value === false) {
					element.removeAttribute(name);
				} else {
					element.setAttribute(name, value);
				}
			}
		}
	}
};
/*--- CLONE ----------------------------------------------------*/
satus.clone = function (item) {
	const clone = item.cloneNode(true),
		parent_css = window.getComputedStyle(item.parentNode),
		css = window.getComputedStyle(item);
	let style = '';

	for (let i = 0, l = css.length; i < l; i++) {
		let property = css[i],
			value = css.getPropertyValue(property);

		if (property === 'background-color') {
			value = parent_css.getPropertyValue('background-color');
		}

		if (!['box-shadow', 'left', 'top', 'bottom', 'right', 'opacity'].includes(property)) {
			style += property + ':' + value + ';';
		}
	}

	clone.setAttribute('style', style);

	return clone;
};
/*--- CREATE ELEMENT -------------------------------------------*/
satus.createElement = function (tagName, componentName, namespaceURI) {
	const camelizedTagName = this.camelize(tagName);
	let className = 'satus-' + (componentName || tagName),
		element,
		match = className.match(/__[^__]+/g);

	if (!namespaceURI) {
		if (tagName === 'svg') {
			namespaceURI = 'http://www.w3.org/2000/svg';
		}
	}

	if (namespaceURI) {
		element = document.createElementNS(namespaceURI, tagName);
	} else if (this.components[camelizedTagName]) {
		element = document.createElement('div');
	} else {
		element = document.createElement(tagName);
	}

	if (match && match.length > 1) {
		className = className.slice(0, className.indexOf('__')) + match.last;
	}

	element.componentName = componentName;
	element.className = className;

	element.createChildElement = function (tagName, componentName, namespaceURI) {
		let element = satus.createElement(tagName, this.componentName + '__' + (componentName || tagName), namespaceURI);

		if (this.baseProvider) {
			element.baseProvider = this.baseProvider;
		}

		if (this.layersProvider) {
			element.layersProvider = this.layersProvider;
		}

		this.appendChild(element);

		return element;
	};

	return element;
};
/*--- EMPTY ----------------------------------------------------*/
satus.empty = function (element, exclude = []) {
	for (let i = element.childNodes.length - 1; i > -1; i--) {
		const child = element.childNodes[i];

		if (!exclude.includes(child)) {
			child.remove();
		}
	}
};
/*--- ELEMENT INDEX --------------------------------------------*/
satus.elementIndex = function (element) {
	return Array.prototype.slice.call(element.parentNode.children).indexOf(element);
};
/*--------------------------------------------------------------
# CSS
--------------------------------------------------------------*/
satus.css = function (element, property) {
	return window.getComputedStyle(element).getPropertyValue(property);
};
/*--- CLASS ----------------------------------------------------*/
satus.addClass = satus.class = function (element, className) {
	if (className) {
		element.classList.add(className);
	}
};
/*--- STYLE ----------------------------------------------------*/
satus.style = function (element, object) {
	if (object) {
		for (const key in object) {
			element.style[key] = object[key];
		}
	}
};
/*--- ANIMATION DURATION ---------------------------------------*/
satus.getAnimationDuration = function (element) {
	return Number(window.getComputedStyle(element).getPropertyValue('animation-duration').replace(/[^0-9.]/g, '')) * 1000;
};
/*--------------------------------------------------------------
# EVENTS
--------------------------------------------------------------*/
/*--- ON ------------------------------------------------------*/
satus.events.on = function (type, handler) {
	if (!this.data[type]) {
		this.data[type] = [];
	}

	this.data[type].push(handler);
};
/*--- TRIGGER ------------------------------------------------*/
satus.events.trigger = function (type, data) {
	const handlers = this.data[type];

	if (handlers) {
		for (const handler of handlers) {
			handler(data);
		}
	}
};
/*--------------------------------------------------------------
# FUNCTIONS
--------------------------------------------------------------*/
/*--- ON ------------------------------------------------------*/
satus.on = function (element, listeners) {
	if (listeners) {
		for (const type in listeners) {
			if (type === 'parentObject') continue;

			const listener = listeners[type];

			if (type === 'selectionchange') {
				element = document;
			}

			if (satus.isFunction(listener)) {
				element.addEventListener(type, listener);
			} else if (satus.isArray(listener) || satus.isObject(listener)) {
				element.addEventListener(type, function (event) {
					const target = this.skeleton.on[event.type];
					let layers = this.layersProvider;

					target.parentSkeleton = this.skeleton;
					target.parentElement = this;

					if (!layers && this.baseProvider.layers.length > 0) {
						layers = this.baseProvider.layers[0];
					}

					if (target.prepend) {
						satus.prepend(target, this.parentNode);
					} else if (layers && target.component !== 'popup') {
						layers.open(target);
					} else {
						satus.render(target, this.baseProvider);
					}
				});
			} else if (satus.isString(listener)) {
				element.addEventListener(type, function () {
					const match = this.skeleton.on[event.type].match(/(["'`].+["'`]|[^.()]+)/g);
					let target = this.baseProvider;

					for (let i = 0, l = match.length; i < l; i++) {
						const key = match[i];

						if (target.skeleton && target.skeleton[key]) {
							target = target.skeleton[key];
						} else {
							if (satus.isFunction(target[key])) {
								target[key]();
							} else {
								target = target[key];
								// render last element if its not a function, lets us use redirects
								if (i == match.length-1 && !satus.isFunction(target)) {
									let layers = this.layersProvider;
									if (!layers && this.baseProvider.layers.length > 0) {
										layers = this.baseProvider.layers[0];
									}
									layers.open(target);
								}
							}
						}

						if (target.rendered) {
							target = target.rendered;
						}
					}
				});
			}
		}
	}
};
/*--- PARENTIFY ------------------------------------------------*/
satus.parentify = function (parentObject, exclude) {
	for (const key in parentObject) {
		if (!exclude.includes(key)) {
			const child = parentObject[key];

			if (satus.isset(child)) {
				child.parentObject = parentObject;

				if (
					satus.isObject(child) &&
					!satus.isArray(child) &&
					!satus.isElement(child) &&
					!satus.isFunction(child)
				) {
					this.parentify(child, exclude);
				}
			}
		}
	}
};
/*--- PREPEND --------------------------------------------------*/
satus.prepend = function (child, parent) {
	if (this.isElement(child)) {
		parent.prepend(child);
	} else if (this.isObject(child)) {
		this.render(child, parent, undefined, undefined, true);
	}
};
/*--- REMOVE ---------------------------------------------------*/
satus.remove = function (child, parent) {
	if (satus.isArray(parent)) {
		parent.splice(satus.indexOf(child, parent), 1);
	}
};
/*--- RENDER ---------------------------------------------------*/
satus.render = function (skeleton, container, property, childrenOnly, prepend, skip_children) {
	let element;

	if (property === 'layers') skip_children = true;

	if (skeleton.component && childrenOnly !== true) {
		const tagName = skeleton.component,
			camelizedTagName = this.camelize(tagName);

		if (!skeleton.namespaceURI) {
			if (tagName === 'svg') {
				skeleton.namespaceURI = 'http://www.w3.org/2000/svg';
			} else if (skeleton.parentSkeleton && skeleton.parentSkeleton.namespaceURI) {
				skeleton.namespaceURI = skeleton.parentSkeleton.namespaceURI;
			}
		}

		element = this.createElement(tagName, tagName, skeleton.namespaceURI);

		skeleton.rendered = element;
		element.skeleton = skeleton;
		element.childrenContainer = element;
		element.componentName = tagName;

		if (skeleton.variant) {
			const variant = satus.ifFunctionExec(skeleton.variant);

			if (satus.isArray(variant)) {
				for (let i = 0, l = variant.length; i < l; i++) {
					element.classList.add('satus-' + tagName + '--' + variant[i]);
				}
			} else {
				element.classList.add('satus-' + tagName + '--' + variant);
			}
		}

		if (skeleton.id) {
			element.id = skeleton.id;
		} else if (tagName != 'section' && property) {
			// try giving all elements, except 'section's, an id=name
			element.id = property;
		}

		if (container) {
			if (container.baseProvider) element.baseProvider = container.baseProvider;
			if (container.layersProvider) element.layersProvider = container.layersProvider;
		}

		if (skeleton.attr) this.attr(element, skeleton.attr);
		if (skeleton.style) this.style(element, skeleton.style);
		if (skeleton.data) this.data(element, skeleton.data);
		if (skeleton.class) this.class(element, skeleton.class);

		// create component (slider, checkbox, section etc)
		if (this.components[camelizedTagName]) this.components[camelizedTagName](element, skeleton);

		// skeleton listeners go after component listeners. Do not move this code above component creation!
		if (skeleton.on) this.on(element, skeleton.on);

		// storage available only for appropriate elements
		if (['text-field', 'select', 'color-picker', 'radio', 'slider', 'shortcut', 'checkbox', 'switch'].includes(tagName) && skeleton.storage != false) {
			// default storage key fallback is element name (property)
			const key = satus.ifFunctionExec(skeleton.storage || property);

			element.storage = {};
			element.storage.remove = function () {
				satus.storage.remove(key);
				element.dispatchEvent(new CustomEvent('change'));
			};

			Object.defineProperties(element.storage, {
				key: {
					get () {
						return key;
					}
				},
				value: {
					get () {
						// return if stored, otherwise try .default
						if (Object.hasOwn(satus.storage.data, key)) {
							return satus.storage.data[key];
						} else if (Object.hasOwn(element, 'default')) {
							return element.default;
						} else return undefined;
					},
					set (val) {
						if ((satus.issame(val, satus.storage.data[key]))
							|| (!Object.hasOwn(satus.storage.data, key) && satus.issame(val, element.default))) return;
						if (val === undefined
							// Special case 'theme', Need to save first regardless of .default to send Light theme changes up the chain
							// ImprovedTube.setTheme will delete it for us
							|| (satus.issame(val, element.default) && key != 'theme')) {
							satus.storage.remove(key);
						} else {
							// only store if actually different value
							satus.storage.set(key, val);
						}

						element.dispatchEvent(new CustomEvent('change'));
					}
				}
			});

			// initialize element
			element.value = element.storage.value;

			// redefine element setter to automatically save to storage
			if (Object.getOwnPropertyDescriptor(element, 'value')?.enumerable) {
				const setter = Object.getOwnPropertyDescriptor(element, 'value').set.bind(element);
				Object.defineProperty(element, 'value', {
					set (val) {
						setter(val);
						this.storage.value = val;
					}
				});
			}
		}
		// initialize element lacking storage
		if (!element.storage && Object.hasOwn(element, 'default')) element.value = element.default;

		// FIXME - make element name (property) the default text
		if (skeleton.text) this.text(element.childrenContainer, skeleton.text);
		this.prepend(skeleton.before, element.childrenContainer);

		if (prepend) {
			this.prepend(element, container);
		} else {
			this.append(element, container);
		}

		if (!Object.hasOwn(skeleton, 'parentSkeleton') && container) {
			skeleton.parentSkeleton = container.skeleton;
		}

		satus.events.trigger('render', element);

		element.dispatchEvent(new CustomEvent('render'));

		container = element.childrenContainer || element;
	}

	if (!element || !skip_children) {
		// special keywords that cant be their own elements
		const excluded = [
			'attr',
			'style',
			'data',
			'class',
			'component',
			'text',
			'variant',
			'value',
			'baseProvider',
			'layersProvider',
			'parentObject',
			'parentSkeleton',
			'parentElement',
			'rendered',
			'before',
			'category',
			'on'
		];

		for (const key in skeleton) {
			if (excluded.includes(key)) continue;
			let item = skeleton[key];

			// sections can be functions, but ignore popups because that would call all the button functions
			if (skeleton.component != 'popup') item = satus.ifFunctionExec(item);

			if (item && item.component) {
				item.parentSkeleton = skeleton;

				if (element) {
					item.parentElement = element;
				}

				this.render(item, container, key, undefined, prepend);
			}
		}
	}

	return element;
};
/*--- SEARCH ---------------------------------------------------*/
satus.search = function (query, object, callback) {
	const included = ['text-field', 'select', 'color-picker', 'radio', 'slider', 'shortcut', 'checkbox', 'switch', 'label', 'button'],
		excluded = [
			'baseProvider',
			'layersProvider',
			'parentObject',
			'parentSkeleton',
			'namespaceURI',
			'svg',
			'parentElement',
			'rendered'
		];
	let threads = 0,
		results = {};

	query = query.toLowerCase();

	function parse (items) {
		threads++;

		for (const [key, item] of Object.entries(items)) {
			if (excluded.includes(key)) continue;
			if (item.component && item.text
				// list of elements we allow search on
				&& included.includes(item.component)
				// only pass buttons whose parents are variant: 'card' or special case 'appearance' (this one abuses variant tag for CSS)
				&& (item.component != 'button' || item.parentObject?.variant == "card" || item.parentObject?.variant == "appearance")
				// try to match query against localized description, (maybe add fallback on component name?)
				&& (query === '*' || satus.locale.get(item.text).toLowerCase().includes(query))) {

				// plop matching results in object - this means we cant have two elements with same name in whole Menu
				results[key] = Object.assign({}, item);
			}

			if (satus.isObject(item)
				&& !satus.isArray(item)
				&& !satus.isElement(item)
				&& !satus.isFunction(item)) parse(item);
		}

		threads--;

		if (threads === 0) {
			callback(results);
		}
	}

	parse(object);
};
/*--------------------------------------------------------------
# STORAGE
--------------------------------------------------------------*/
/*--- CLEAR ----------------------------------------------------*/
satus.storage.clear = function (callback) {
	this.data = {};

	chrome.storage.local.clear(function () {
		satus.events.trigger('storage-clear');

		if (callback) callback();
	});
};
/*--- GET ------------------------------------------------------*/
satus.storage.get = function (key, callback) {
	if (callback) callback(this.data[key]);
	return this.data[key];
};
/*--- IMPORT ---------------------------------------------------*/
satus.storage.import = function (keys, callback) {
	const self = this;
	if (satus.isFunction(keys)) {
		callback = keys;
		keys = undefined;
	}
	chrome.storage.local.get(keys || null, function (items) {
		for (const key in items) {
			self.data[key] = items[key];
		}
		satus.events.trigger('storage-import');
		if (callback) callback(items);
		loading.style.display = 'none';
	});
};
/*--- REMOVE ---------------------------------------------------*/
satus.storage.remove = function (key, callback) {
	delete this.data[key];
	chrome.storage.local.remove(key, function () {
		satus.events.trigger('storage-set', key);

		if (callback) callback();
	});
};
/*--- SET ------------------------------------------------------*/
satus.storage.set = function (key, value, callback) {
	this.data[key] = value;
	chrome.storage.local.set({[key]: value}, function () {
		satus.events.trigger('storage-set', key);

		if (callback) callback();
	});
};
/*--- ON CHANGED -----------------------------------------------*/
satus.storage.onchanged = function (callback) {
	chrome.storage.onChanged.addListener(function (changes) {
		for (const key in changes) {
			callback(key, changes[key].newValue);
		}
	});
};
/*--------------------------------------------------------------
# LOCALIZATION
--------------------------------------------------------------*/
/*--- GET ------------------------------------------------------*/
satus.locale.get = function (string) {
	if (satus.isFunction(chrome?.i18n?.getMessage)) {
		// can see here all the missing localization
		//if (!chrome.i18n.getMessage(string)) console.log('satus.locale.get: ', string);
		return chrome.i18n.getMessage(String(string)) || string;
	} else {
		return this.data[string] || string;
	}
};
/*--- IMPORT ---------------------------------------------------*/
satus.locale.import = function (code, callback, path) {
	function importLocale (locale, successCallback) {
		fetch(chrome.runtime.getURL(path + locale + '/messages.json'))
			.then(response => response.ok ? response.json() : {})
			.then(data => {
				for (const key in data) {
					if (!satus.locale.data[key]) {
						satus.locale.data[key] = data[key].message;
					}
				}
			})
			.catch(() => {console.error('satus.locale.import: We crashed and burned')})
			.finally(() => successCallback && successCallback());
	};

	if (code) {
		let language = code.replace('-', '_');
		if (language.includes('_')) {
			importLocale(language, () => importLocale(language.split('_')[0], () => importLocale('en', callback)));
		} else {
			importLocale(language, () => importLocale('en', callback));
		}
	} else if (satus.isFunction(chrome?.i18n?.getMessage)) {
		// i18n supported, no need to do anything more here
		callback();
	} else {
		// no i18n support. Handle translation manually, use window.navigator.language
		let language = window.navigator.language.replace('-', '_');
		if (language.includes('_')) {
			importLocale(language, () => importLocale(language.split('_')[0], () => importLocale('en', callback)));
		} else {
			importLocale(language, () => importLocale('en', callback));
		}
		console.log(error);
	}
};
/*--- VALIDATE ---------------------------------------------------*/
// purely debug function for cleaning up locale duplicates and validating json correctnes
satus.locale.validate = async function () {
	const allLocales = ["en", "am", "ar", "bg", "bn", "ca", "cs", "da", "de", "el", "en_GB", "en_US", "es", "es_419", "et", "fa", "fa_IR", "fi", "fil", "fr", "gu", "he", "hi", "hr", "hu", "id", "it", "ja", "kn", "ko", "lt", "lv", "ml", "mr", "ms", "nb", "nb_NO", "nl", "no", "pl", "pt", "pt_BR", "pt_PT", "ro", "ru", "si", "sk", "sl", "sr", "sv", "sw", "sw_KE", "ta", "te", "th", "tr", "uk", "vi", "zh", "zh_CN", "zh_TW"],
		fetchedLocales = {},
		allKeys = {};

	for (const language of allLocales) {
		fetchedLocales[language] = {};
		const dat = await (await fetch(chrome.runtime.getURL("_locales/" + language + '/messages.json'))).json();
			for (const key in dat) {
				if (!fetchedLocales[language][key]) {
					fetchedLocales[language][key] = dat[key].message;
				}
				if (!allKeys[key]) {
					allKeys[key] = 1;
				}
			}
	}

	//check if any duplicates exist
	for (const key in allKeys) {
		const allStrings = [];
		for (const language of allLocales) {
			if (!fetchedLocales[language][key]) continue;

			if ((language != "en") && (fetchedLocales["en"][key] === fetchedLocales[language][key])) {
				console.log(fetchedLocales[language][key] + ' | ' + key + ' ' + language);
			}
		}
	}

	return fetchedLocales;
};
/*--- TEXT -----------------------------------------------------*/
satus.text = function (element, value) {
	if (value) {
		element.appendChild(document.createTextNode(satus.locale.get(satus.ifFunctionExec(value))));
	}
};
/*--------------------------------------------------------------
>>> 2. COMPONENTS
--------------------------------------------------------------*/
/*--- POPUP ----------------------------------------------------*/
satus.components.popup = function (component, skeleton) {
	const content = satus.ifFunctionExec(skeleton.content);

	component.scrim = component.createChildElement('div', 'scrim');
	component.surface = component.createChildElement('div', 'surface');

	component.close = function () {
		this.classList.add('satus-popup--closing');

		setTimeout(function () {
			component.remove();

			component.dispatchEvent(new CustomEvent('close'));
		}, Number(satus.css(this.surface, 'animation-duration').replace(/[^0-9.]/g, '')) * 1000);
	};

	if (!skeleton.modal) {
		// this is someone clicking outside of popup dialog
		component.scrim.addEventListener('click', function () {
			switch (skeleton.variant) {
				case 'confirm':
					if (skeleton.buttons?.cancel) {
						// popup.confirm.buttons variant have own closing mechanism, lets try to click cancel button
						if (satus.isFunction(skeleton.buttons.cancel?.rendered?.click)) {
							skeleton.buttons.cancel.rendered.click();
						} else {
							// cant find cancel button, just force close it
							this.parentNode.close();
						}
					} else {
						// popup.confirm simplified variant, try optional cancel() then close()
						if (satus.isFunction(skeleton.cancel)) {
							skeleton.cancel();
						}
						this.parentNode.close();
					}
					break;

				case 'vertical-menu':
					this.parentNode.close();
					break;

				case 'shortcut':
				case 'color-picker':
					// click cancel button
					skeleton.actions.cancel.rendered.click();
					break;
			}
		});
	}

	if (satus.isset(content)) {
		component.surface.content = component.surface.createChildElement('p', 'content');

		if (satus.isObject(content)) {
			satus.render(content, component.surface.content);
		} else {
			component.surface.content.textContent = satus.locale.get(content);
		}
	} else {
		component.childrenContainer = component.surface;
	}

	if (satus.components.popup[skeleton.variant]) {
		satus.components.popup[skeleton.variant](component, skeleton);
	}
};
/*--- CONFIRM --------------------------------------------------*/
satus.components.popup.confirm = function (component, skeleton) {
	component.surface.actions = satus.render({
		component: 'section',
		variant: 'align-end'
	}, component.surface);

	if (skeleton.buttons) {
		for (const key in skeleton.buttons) {
			const button = skeleton.buttons[key];

			if (button?.component === 'button') {
				satus.render(button, component.surface.actions).popupProvider = component;
			}
		}
	} else {
		// IIFE (Immediately Invoked Function Expression) to bind component inside closure
		(function () {
			satus.render({
				cancel: {
					component: 'button',
					text: 'cancel',
					on: {
						click: function () {
							// cancel() is optional in popup.confirm simplified variant
							if (satus.isFunction(component.skeleton.cancel)) {
								component.skeleton.cancel();
							}
							component.close();
						}
					}
				},
				ok: {
					component: 'button',
					text: 'ok',
					on: {
						click: function () {
							// ok() is optional in popup.confirm simplified variant
							if (satus.isFunction(component.skeleton.ok)) {
								component.skeleton.ok();
							}
							component.close();
						}
					}
				}
			}, component.surface.actions)
		})(component);
	}
};
/*--- GRID -----------------------------------------------------*/
satus.components.grid = function (component, skeleton) {
	console.log(component, skeleton);
};
/*--- TEXT FIELD -----------------------------------------------*/
satus.components.textField = function (component, skeleton) {
	const container = component.createChildElement('div', 'container');

	if (!skeleton.rows && !skeleton.multiline) skeleton.rows = 1;
	if (skeleton.rows === 1) {
		component.setAttribute('multiline', 'false');
		component.multiline = false;
	}

	component.input = container.createChildElement(skeleton.rows === 1 ? 'input' : 'textarea');
	component.display = container.createChildElement('div', 'display');
	component.lineNumbers = component.display.createChildElement('div', 'line-numbers');
	component.pre = component.display.createChildElement('pre');
	component.cursor = component.display.createChildElement('div', 'cursor');
	component.hiddenValue = container.createChildElement('pre', 'hidden-value');
	component.selection = component.display.createChildElement('div', 'selection');
	component.selection.setAttribute('disabled', '');
	component.syntax = { // unused, do we need it? do we want it?
		current: 'text',
		handlers: {
			regex: function (value, target) {
				const regex_token = /\[\^?]?(?:[^\\\]]+|\\[\S\s]?)*]?|\\(?:0(?:[0-3][0-7]{0,2}|[4-7][0-7]?)?|[1-9][0-9]*|x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4}|c[A-Za-z]|[\S\s]?)|\((?:\?[:=!]?)?|(?:[?*+]|\{[0-9]+(?:,[0-9]*)?\})\??|[^.?*+^${[()|\\]+|./g,
					//char_class_token = /[^\\-]+|-|\\(?:[0-3][0-7]{0,2}|[4-7][0-7]?|x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4}|c[A-Za-z]|[\S\s]?)/g,
					//char_class_parts = /^(\[\^?)(]?(?:[^\\\]]+|\\[\S\s]?)*)(]?)$/,
					quantifier = /^(?:[?*+]|\{[0-9]+(?:,[0-9]*)?\})\??$/,
					matches = value.match(regex_token);

				function create (type, string) {
					const span = document.createElement('span');

					span.className = type;
					span.textContent = string;

					target.appendChild(span);
				}

				if (matches) {
					for (let i = 0, l = matches.length; i < l; i++) {
						const match = matches[i];

						if (match[0] === '[') {
							create('character-class', match);
						} else if (match[0] === '(') {
							create('group', match);
						} else if (match[0] === ')') {
							create('group', match);
						} else if (match[0] === '\\' || match === '^') {
							create('anchor', match);
						} else if (quantifier.test(match)) {
							create('quantifier', match);
						} else if (match === '|' || match === '.') {
							create('metasequence', match);
						} else {
							create('text', match);
						}
					}
				}
			}
		},
		set: function (syntax) {
			if (this.handlers[syntax]) {
				this.current = syntax;
			} else {
				this.current = 'text';
			}

			component.pre.update();
		}
	};

	if (!skeleton.lineNumbers) {
		component.setAttribute('line-numbers', 'false');

		component.lineNumbers.setAttribute('hidden', '');
	}

	component.lineNumbers.update = function () {
		const count = component.input.value.split('\n').length;

		if (count !== this.children.length) {
			satus.empty(this);

			for (let i = 1; i <= count; i++) {
				const span = document.createElement('span');

				span.textContent = i;

				this.appendChild(span);
			}
		}

		component.input.style.paddingLeft = this.offsetWidth + 'px';
	};

	component.pre.update = function () {
		const handler = component.syntax.handlers[component.syntax.current],
			value = component.value || '';

		satus.empty(this);

		if (handler) {
			handler(value, this);
		} else {
			this.textContent = value;
		}

		if (value.length === 0) {
			this.textContent = satus.locale.get(satus.ifFunctionExec(component.skeleton.placeholder));
		}
	};

	component.cursor.update = function () {
		const hiddenValue = component.hiddenValue,
			selection = component.selection,
			input = component.input,
			value = input.value,
			start = input.selectionStart,
			end = input.selectionEnd,
			rows = value.slice(0, start).split('\n');
		let top = 0;

		this.style.animation = 'none';

		if (input.selectionDirection === 'forward') {
			hiddenValue.textContent = value.substring(0, end);
		} else {
			hiddenValue.textContent = value.substring(0, start);
		}

		top = hiddenValue.offsetHeight;

		hiddenValue.textContent = rows.last;

		top -= hiddenValue.offsetHeight;

		if (component.multiline !== false) {
			this.style.top = top + 'px';
		}

		this.style.left = hiddenValue.offsetWidth + (component.lineNumbers?.offsetWidth ? component.lineNumbers?.offsetWidth : 0) + 'px';

		if (start === end) {
			selection.setAttribute('disabled', '');
		} else {
			selection.removeAttribute('disabled');

			hiddenValue.textContent = value.substring(0, start);
			selection.style.left = hiddenValue.offsetWidth - input.scrollLeft + 'px';
			hiddenValue.textContent = value.substring(start, end);
			selection.style.width = hiddenValue.offsetWidth + 'px';
		}

		this.style.animation = '';

		hiddenValue.textContent = '';
	};

	if (skeleton.syntax) component.syntax.set(skeleton.syntax);
	if (satus.isset(skeleton.cols)) component.input.cols = skeleton.cols;
	if (satus.isset(skeleton.rows)) component.input.rows = skeleton.rows;

	component.focus = function () {
		this.autofocus = true;
		this.input.focus();
	};

	function updateLinePreCursor () {
		if (component.lineNumbers) component.lineNumbers.update();
		component.pre.update();
		component.cursor.update();
	};

	//component.addEventListener('change', updateLinePreCursor);
	//component.addEventListener('render', updateLinePreCursor);

	// global listener, make sure we remove when element no longer exists
	function selectionchange () {
		if (!document.body.contains(component)) {
			document.removeEventListener('selectionchange', selectionchange);
			return;
		}

		updateLinePreCursor();
	};

	document.addEventListener('selectionchange', selectionchange);

	component.input.addEventListener('scroll', function () {
		component.display.style.top = -this.scrollTop + 'px';
		component.display.style.left = -this.scrollLeft + 'px';

		updateLinePreCursor();
	});
	component.input.addEventListener('input', function () {
		component.value = this.value;

		updateLinePreCursor();
	});

	if (skeleton.on?.blur) {
		component.input.addEventListener('blur', function (event) {
			this.parentNode.parentNode.dispatchEvent(new Event(event.type));
		});
	}

	Object.defineProperties(component, {
		default: {
			get () {
				let value = '';
				if (Object.hasOwn(this.skeleton, 'value')) {
					value = satus.locale.get(satus.ifFunctionExec(this.skeleton.value));
				}
				return value;
			}
		},
		value: {
			get () {
				return this.input.value;
			},
			set (val) {
				this.input.value = val;
			},
			enumerable: true,
			configurable: true
		}
	});
};
/*--- CHART ----------------------------------------------------*/
satus.components.chart = function (component, skeleton) {
	const type = skeleton.type;

	if (this.chart[type]) {
		component.classList.add('satus-chart--' + type);

		this.chart[type](component, skeleton);
	}
};
/*--- CHART BAR ------------------------------------------------*/
satus.components.chart.bar = function (component, skeleton) {
	const labels = satus.ifFunctionExec(skeleton.labels),
		datasets = satus.ifFunctionExec(skeleton.datasets),
		bars = [];

	if (satus.isArray(labels)) {
		const container = component.createChildElement('div', 'labels');

		for (let i = 0, l = labels.length; i < l; i++) {
			const label = labels[i],
				section = container.createChildElement('div', 'section');

			section.textContent = label;
		}
	}

	if (satus.isArray(datasets)) {
		const container = component.createChildElement('div', 'bars');

		for (let i = 0, l = datasets.length; i < l; i++) {
			const dataset = datasets[i];

			for (let j = 0, k = dataset.data.length; j < k; j++) {
				if (!satus.isElement(bars[j])) {
					bars.push(container.createChildElement('div', 'bar'));
				}

				const piece = bars[j].createChildElement('div', 'piece');

				piece.title = dataset.label;
				piece.style.height = dataset.data[j] + '%';
				piece.style.backgroundColor = 'rgb(' + dataset.color.join(',') + ')';
			}
		}
	}
};
/*--- SELECT ---------------------------------------------------*/
satus.components.select = function (component, skeleton) {
	component.childrenContainer = component.createChildElement('div', 'content');
	component.valueElement = document.createElement('span');
	component.valueElement.className = 'satus-select__value';
	component.selectElement = document.createElement('select');

	component.appendChild(component.valueElement);
	component.appendChild(component.selectElement);

	component.options = satus.ifFunctionExec(skeleton.options) || [];

	component.selectElement.addEventListener('change', function () {
		// Option value property in HTML DOM is always DOMString, use satus.toValue
		component.value = satus.toValue(this.value);
	});

	function render () {
		satus.empty(this.valueElement);

		if (this.selectElement.options[this.selectElement.selectedIndex]) {
			this.valueElement.appendChild(document.createTextNode(this.selectElement.options[this.selectElement.selectedIndex].text));
		}
	};

	component.addEventListener('change', render);
	component.addEventListener('render', render);

	Object.defineProperties(component, {
		default: {
			get () {
				// default is either in order: .value | .index | first options element
				return [satus.ifFunctionExec(this.skeleton.value), this.options[satus.ifFunctionExec(this.skeleton.index)]?.value, this.options[0]?.value].find(e => satus.isset(e));
			}
		},
		value: {
			get () {
				// Option value property in HTML DOM is always DOMString, use satus.toValue
				return satus.toValue(this.selectElement.value);
			},
			set (val) {
				this.selectElement.value = val;
				this.dataset.value = val;
			},
			enumerable: true,
			configurable: true
		}
	});

	for (const option of component.options) {
		const optionElement = document.createElement('option');
		let optionText = satus.locale.get(option.text);

		// mark Default option
		optionText += (satus.toValue(option.value) === component.default) ? ' (' + satus.locale.get('default') + ')' : '';

		optionElement.value = option.value;
		optionElement.appendChild(document.createTextNode(optionText));
		component.selectElement.appendChild(optionElement);
	}
};
/*--- SECTION --------------------------------------------------*/
satus.components.section = function (component, skeleton) {
	if (satus.isString(skeleton.title)) {
		component.dataset.title = satus.locale.get(skeleton.title);
	}
};
/*--- BASE -----------------------------------------------------*/
satus.components.base = function (component) {
	component.baseProvider = component;
	component.layers = [];
};
/*--- TIME -----------------------------------------------------*/
satus.components.time = function (component, skeleton) {
	const select_skeleton = Object.assign({}, skeleton);

	select_skeleton.component = 'select';
	select_skeleton.options = [];

	select_skeleton.hour12 = satus.ifFunctionExec(select_skeleton.hour12);

	for (let i = 0, l = 24; i < l; i++) {
		let hour = i,
			value = i;

		if (select_skeleton.hour12 && i > 12) {
			hour -= 12;
		}

		if (hour < 10) {
			hour = '0' + hour;
			value = '0' + value;
		}

		if (select_skeleton.hour12) {
			if (i > 12) {
				hour += ':00 pm';
			} else {
				hour += ':00 am';
			}
		} else {
			hour += ':00'
		}

		select_skeleton.options.push({
			text: hour,
			value: value + ':00'
		});
	}

	satus.components.select(component, select_skeleton);

	component.classList.add('satus-select');
};
/*--- LAYERS ---------------------------------------------------*/
satus.components.layers = function (component, skeleton) {
	component.path = [];
	component.rememberScrollTop;
	component.baseProvider.layers.push(component);
	component.layersProvider = component;

	component.back = function () {
		if (this.path.length > 2) {

			this.path.pop();
			this.rememberScrollTop = this.path.pop();

			this.open(this.path.last, true);
		}
	};

	component.open = function (skeleton, back) {
		// dont add duplicates to layer history, reopen last layer instead
		if (!back && this.path.last === skeleton) {
			this.dispatchEvent(new Event('open'));
			return;
		}

		const previous_layer = this.querySelector('.satus-layers__layer:last-child'),
			layer = this.createChildElement('div', 'layer');

		if (back) {
			layer.style.animation = 'fadeInRight 150ms ease forwards';
		} else {
			layer.style.animation = 'fadeInLeft 300ms ease forwards';
			this.path.push(previous_layer?.scrollTop); // remember scroll position for History traversal
			this.path.push(skeleton);
		}

		if (previous_layer) {
			previous_layer.style.animation = 'fadeOut 100ms ease forwards';
			setTimeout(function () {
				previous_layer.remove();
			}, satus.getAnimationDuration(previous_layer));
		}

		layer.skeleton = skeleton;
		layer.baseProvider = this.baseProvider;

		satus.render(skeleton, layer, undefined, skeleton.component === 'layers');

		if (back && this.rememberScrollTop) { // apply remembered scroll position of restored History element
			layer.scrollTop = this.rememberScrollTop;
		}

		this.dispatchEvent(new Event('open'));
	};

	component.update = function () {
		const layer = this.querySelector('.satus-layers__layer');

		satus.empty(layer);
		satus.render(layer.skeleton, layer);
	};

	component.open(skeleton);
	component.addEventListener('render', function () {this.dispatchEvent(new Event('open'))});
};
/*--- LIST -----------------------------------------------------*/
satus.components.list = function (component, skeleton) {
	for (const item of skeleton.items) {
		const li = component.createChildElement('div', 'item');

		for (const child of item) {
			if (satus.isObject(child)) {
				satus.render(child, li);
			} else {
				const span = li.createChildElement('span');

				span.textContent = satus.locale.get(child);
			}
		}
	}
};
/*--- COLOR PICKER ---------------------------------------------*/
satus.components.colorPicker = function (component) {
	component.childrenContainer = component.createChildElement('div', 'content');
	component.color = component.createChildElement('span', 'value');

	function render () {
		this.color.style.backgroundColor = 'rgb(' + this.value.join(',') + ')';
	};

	component.addEventListener('change', render);
	component.addEventListener('render', render);

	component.addEventListener('click', function () {
		let hsl = satus.color.rgbToHsl(this.color.value),
			s = hsl[1] / 100,
			l = hsl[2] / 100;

		s *= l < .5 ? l : 1 - l;

		let v = l + s;

		s = 2 * s / (l + s);

		satus.render({
			component: 'popup',
			variant: 'color-picker',
			value: hsl,
			parentElement: this,

			palette: {
				component: 'div',
				class: 'satus-color-picker__palette',
				style: {
					'backgroundColor': 'hsl(' + hsl[0] + 'deg, 100%, 50%)'
				},
				on: {
					mousedown: function (event) {
						if (event.button !== 0) {
							return false;
						}

						const palette = this,
							rect = this.getBoundingClientRect(),
							cursor = this.children[0];

						function mousemove (event) {
							let hsl = palette.skeleton.parentSkeleton.value,
								x = event.clientX - rect.left,
								y = event.clientY - rect.top;

							x = Math.min(Math.max(x, 0), rect.width) / (rect.width / 100);
							y = Math.min(Math.max(y, 0), rect.height) / (rect.height / 100);

							let v = 100 - y,
								l = (2 - x / 100) * v / 2;

							hsl[1] = x * v / (l < 50 ? l * 2 : 200 - l * 2);
							hsl[2] = l;

							cursor.style.left = x + '%';
							cursor.style.top = y + '%';

							palette.nextSibling.children[0].style.backgroundColor = 'hsl(' + hsl[0] + 'deg,' + hsl[1] + '%, ' + hsl[2] + '%)';

							event.preventDefault();
						}

						function mouseup () {
							window.removeEventListener('mousemove', mousemove);
							window.removeEventListener('mouseup', mouseup);
						}

						window.addEventListener('mousemove', mousemove);
						window.addEventListener('mouseup', mouseup);
						mousemove(event);
					}
				},

				cursor: {
					component: 'div',
					class: 'satus-color-picker__cursor',
					style: {
						'left': s * 100 + '%',
						'top': 100 - v * 100 + '%'
					}
				}
			},
			section: {
				component: 'section',
				variant: 'color',

				color: {
					component: 'div',
					class: 'satus-color-picker__color',
					style: {
						'backgroundColor': 'rgb(' + this.color.value.join(',') + ')'
					}
				},
				hue: {
					component: 'slider',
					class: 'satus-color-picker__hue',
					storage: false,
					value: hsl[0],
					max: 360,
					on: {
						input: function () {
							const popup = this.skeleton.parentSkeleton.parentSkeleton,
								hsl = popup.value;

							hsl[0] = this.value;

							this.previousSibling.style.backgroundColor = 'hsl(' + hsl[0] + 'deg,' + hsl[1] + '%, ' + hsl[2] + '%)';
							this.parentNode.previousSibling.style.backgroundColor = 'hsl(' + hsl[0] + 'deg, 100%, 50%)';
						}
					}
				}
			},
			actions: {
				component: 'section',
				variant: 'actions',

				reset: {
					component: 'button',
					text: 'reset',
					on: {
						click: function () {
							const popup = this.skeleton.parentSkeleton.parentSkeleton,
								component = popup.parentElement;

							component.value = component.default;

							popup.rendered.close();
						}
					}
				},
				cancel: {
					component: 'button',
					text: 'cancel',
					on: {
						click: function () {
							const popup = this.skeleton.parentSkeleton.parentSkeleton;

							popup.rendered.close();
						}
					}
				},
				ok: {
					component: 'button',
					text: 'OK',
					on: {
						click: function () {
							const popup = this.skeleton.parentSkeleton.parentSkeleton,
								component = popup.parentElement;

							component.value = satus.color.hslToRgb(popup.value);

							popup.rendered.close();
						}
					}
				}
			}
		}, this.baseProvider);
	});

	Object.defineProperties(component, {
		default: {
			get () {
				let value = [0, 0, 0];
				if (Object.hasOwn(this.skeleton, 'value')) {
					value = satus.ifFunctionExec(this.skeleton.value);
				}
				return value;
			}
		},
		value: {
			get () {
				return this.color.value;
			},
			set (val) {
				this.color.value = val;
			},
			enumerable: true,
			configurable: true
		}
	});

	component.color.title = satus.locale.get('default') + ' ' + component.default;
};
/*--- RADIO ----------------------------------------------------*/
satus.components.radio = function (component, skeleton) {
	component.childrenContainer = component.createChildElement('div', 'content');

	component.input = component.createChildElement('input', 'input');
	component.createChildElement('i');

	component.input.type = 'radio';
	component.input.name = skeleton.storage;

	component.input.addEventListener('change', function () {
		component.value = component.skeleton.value;
	});

	Object.defineProperties(component, {
		default: {
			get () {
				let value;

				if (Object.hasOwn(this.skeleton, 'value')) {
					value = satus.ifFunctionExec(this.skeleton.parentSkeleton.value);
				}
				return value;
			}
		},
		value: {
			get () {
				return this.skeleton.value;
			},
			set (val) {
				if (val === this.skeleton.value) this.input.checked = true;
			},
			enumerable: true,
			configurable: true
		}
	});
};
/*--- SLIDER ---------------------------------------------------*/
satus.components.slider = function (component, skeleton) {
	const content = component.createChildElement('div', 'content'),
		track_container = component.createChildElement('div', 'track-container');

	component.childrenContainer = content.createChildElement('div', 'children-container');
	component.number = content.createChildElement('input');
	component.track = track_container.createChildElement('div', 'track');
	component.bar = track_container.createChildElement('input', 'input');

	component.number.type = 'number';
	component.number.min = skeleton.min || 0;
	component.number.max = skeleton.max || 1;
	component.number.step = skeleton.step || 1;

	component.number.addEventListener('blur', function () {
		component.value = this.value;
	});
	component.number.addEventListener('input', function () {
		component.value = this.value;
	});
	component.number.addEventListener('wheel', function (event) {
		event.preventDefault();
		event.stopPropagation();

		component.value += (event.deltaY > 0) ? -Number(this.step) : Number(this.step);
	});

	if (skeleton.on) {
		for (const type in skeleton.on) {
			component.number.addEventListener(type, function (event) {
				component.dispatchEvent(new Event(event.type));
			});
		}
	}

	component.bar.type = 'range';
	component.bar.min = skeleton.min || 0;
	component.bar.max = skeleton.max || 1;
	component.bar.step = skeleton.step || 1;

	component.bar.addEventListener('input', function () {
		component.value = this.value;
	});

	Object.defineProperties(component, {
		default: {
			get () {
				let value = 0;
				if (Object.hasOwn(this.skeleton, 'value')) {
					value = satus.ifFunctionExec(this.skeleton.value);
				}
				return value;
			}
		},
		value: {
			get () {
				return Number(this.number.value);
			},
			set (val) {
				val = Math.min(Math.max(Number(val), this.number.min), this.number.max);
				this.number.value = val;
				this.bar.value = val;
				this.track.style.width = 100 / (this.number.max - this.number.min) * (val - this.number.min) + '%';
			},
			enumerable: true,
			configurable: true
		}
	});

	component.number.title = satus.locale.get('default') + ' ' + component.default;
	component.bar.title = satus.locale.get('default') + ' ' + component.default;
};
/*--- TABS -----------------------------------------------------*/
satus.components.tabs = function (component, skeleton) {
	const tabs = satus.ifFunctionExec(skeleton.items),
		value = satus.ifFunctionExec(skeleton.value);

	for (const tab of tabs) {
		const button = component.createChildElement('button');

		button.addEventListener('click', function () {
			const component = this.parentNode,
				index = satus.elementIndex(this);

			component.value = index;

			component.style.setProperty('--satus-tabs-current', index);
		});

		satus.text(button, tab);
	}

	component.style.setProperty('--satus-tabs-count', tabs.length);
	component.style.setProperty('--satus-tabs-current', value || 0);
};
/*--- SHORTCUT -------------------------------------------------*/
satus.components.shortcut = function (component, skeleton) {
	component.childrenContainer = component.createChildElement('div', 'content');
	component.valueElement = component.createChildElement('div', 'value');

	component.className = 'satus-button';

	component.render = function (parent = this.primary) {
		let children = parent.children;

		satus.empty(parent);

		function createElement (name) {
			const element = document.createElement('div');

			element.className = 'satus-shortcut__' + name;

			parent.appendChild(element);

			return element;
		}

		if (this.data.alt) {
			createElement('key').textContent = 'Alt';
		}

		if (this.data.ctrl) {
			if (children.length && !children.last.className.endsWith('plus')) createElement('plus');

			createElement('key').textContent = 'Ctrl';
		}

		if (this.data.shift) {
			if (children.length && !children.last.className.endsWith('plus')) createElement('plus');

			createElement('key').textContent = 'Shift';
		}

		for (const key_entries in this.data.keys) {
			const key = this.data.keys[key_entries].key,
				arrows = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'],
				index = arrows.indexOf(key);

			if (children.length && !children.last.className.endsWith('plus')) createElement('plus');

			if (index !== -1) {
				createElement('key').textContent = ['↑', '→', '↓', '←'][index];
			} else if (key === ' ') {
				createElement('key').textContent = '␣';
			} else if (key) {
				createElement('key').textContent = key.toUpperCase();
			}
		}

		if (this.data.wheel) {
			if (children.length && !children.last.className.endsWith('plus')) createElement('plus');

			const mouse = createElement('mouse'),
				div = document.createElement('div');

			mouse.appendChild(div);
			mouse.classList.add((this.data.wheel > 0));
		}

		if (this.data.click) {
			if (children.length && !children.last.className.endsWith('plus')) createElement('plus');

			const mouse = createElement('mouse'),
				div = document.createElement('div');

			mouse.appendChild(div);
			mouse.classList.add('click');
		}

		if (this.data.middle) {
			if (children.length && !children.last.className.endsWith('plus')) createElement('plus');

			const mouse = createElement('mouse'),
				div = document.createElement('div');

			mouse.appendChild(div);
			mouse.classList.add('middle');
		}

		if (this.data.context) {
			if (children.length && !children.last.className.endsWith('plus')) createElement('plus');

			const mouse = createElement('mouse'),
				div = document.createElement('div');

			mouse.appendChild(div);
			mouse.classList.add('context');
		}
	};

	component.keydown = function (event) {
		event.preventDefault();
		event.stopPropagation();
		let value = component.data,
			pressed = {
				... (((!value.alt && event.altKey) || (value.alt && !event.altKey)) && {alt: true}),
				... (((!value.ctrl && event.ctrlKey) || (value.ctrl && !event.ctrlKey)) && {ctrl: true}),
				... (((!value.shift && event.shiftKey) || (value.shift && !event.shiftKey)) && {shift: true}),
				... (value.keys && {keys: value.keys}),
				... (value.wheel && {wheel: value.wheel}),
				... (value.click && {click: true}),
				... (value.middle && {middle: true}),
				... (value.context && {context: true})
			};

		if (!['alt', 'altgraph', 'control', 'shift'].includes(event.key.toLowerCase())) {
			pressed = {
				... pressed,
				... (value.alt && {alt: true}),
				... (value.ctrl && {ctrl: true}),
				... (value.shift && {shift: true})
			};
			pressed.keys = {};
			if (!value.keys?.[event.keyCode]) {
				pressed.keys[event.keyCode] = {
					code: event.code,
					key: event.key
				};
			}
		}

		component.data = pressed;
		component.render();
		return false;
	};

	if (skeleton.wheel !== false) {
		component.mousewheel = function (event) {
			event.stopPropagation();
			let value = component.data,
				wheel = (event.deltaY < 0) ? -1 : 1,
				pressed = {
					... (value.alt && {alt: true}),
					... (value.ctrl && {ctrl: true}),
					... (value.shift && {shift: true}),
					... (value.keys && {keys: value.keys}),
					... (!value.wheel ? {wheel: wheel} : ((value.wheel != wheel) ? {} : {wheel: value.wheel})),
					... (value.click && {click: true}),
					... (value.middle && {middle: true}),
					... (value.context && {context: true})
				};

			component.data = pressed;
			component.render();
			return false;
		};
	}

	component.addEventListener('click', function () {
		satus.render({
			component: 'popup',
			variant: 'shortcut',
			modal: true,
			on: {
				close: function () {
					window.removeEventListener('keydown', component.keydown);
					window.removeEventListener('wheel', component.mousewheel);
				}
			},

			primary: {
				component: 'div',
				class: 'satus-shortcut__primary',
				on: {
					render: function () {
						component.primary = this;

						if (component.skeleton.mouseButtons === true) {
							this.addEventListener('mousedown', function (event) {
								let value = component.data,
									pressed = {
										... (value.alt && {alt: true}),
										... (value.ctrl && {ctrl: true}),
										... (value.shift && {shift: true}),
										... (value.keys && {keys: value.keys}),
										... (value.wheel && {wheel: value.wheel}),
										... (!value.click && event.button === 0 && {click: true}),
										... (!value.middle && event.button === 1 && {middle: true}),
										... (!value.context && event.button === 2 && {context: true})
									};

								component.data = pressed;
								component.render();
							});

							this.addEventListener('contextmenu', function (event) {
								event.preventDefault();
								event.stopPropagation();
								return false;
							});
						}

						component.render();
					}
				}
			},
			actions: {
				component: 'section',
				variant: 'actions',

				reset: {
					component: 'button',
					text: 'reset',
					on: {
						click: function () {
							component.value = component.default;
							this.parentNode.parentNode.parentNode.close();
						}
					}
				},
				cancel: {
					component: 'button',
					text: 'cancel',
					on: {
						click: function () {
							component.data = component.storage.value;
							this.parentNode.parentNode.parentNode.close();
						}
					}
				},
				save: {
					component: 'button',
					text: 'save',
					on: {
						click: function () {
							component.value = component.data;
							this.parentNode.parentNode.parentNode.close();
						}
					}
				}
			}
		}, this.baseProvider);

		window.addEventListener('keydown', this.keydown);
		window.addEventListener('wheel', this.mousewheel);
	});

	Object.defineProperties(component, {
		default: {
			get () {
				return satus.ifFunctionExec(this.skeleton.value) || {};
			}
		},
		value: {
			get () {
				return this.data;
			},
			set (val) {
				this.data = val;
				this.render(this.valueElement);
				this.dispatchEvent(new CustomEvent('change'));
			},
			enumerable: true,
			configurable: true
		}
	});

	//fixme: this needs adapting component.render function
	//component.valueElement.title = satus.locale.get('default') + ' ' + component.default;
};
/*--- CHECKBOX -------------------------------------------------*/
satus.components.checkbox = function (component) {
	component.childrenContainer = component.createChildElement('div', 'content');

	component.input = component.createChildElement('input');
	component.input.type = 'checkbox';

	component.checkmark = component.createChildElement('div', 'checkmark');

	component.input.addEventListener('change', function () {
		component.value = this.checked;
	});

	component.addEventListener('click', function () {
		component.input.click();
	});

	Object.defineProperties(component, {
		default: {
			get () {
				let value = false;
				if (Object.hasOwn(this.skeleton, 'value')) {
					value = satus.ifFunctionExec(this.skeleton.value);
				}
				return value;
			}
		},
		value: {
			get () {
				return this.input.checked;
			},
			set (val) {
				this.input.checked = val;
				this.dataset.value = val;
			},
			enumerable: true,
			configurable: true
		}
	});

	component.checkmark.title = satus.locale.get('default') + ' ' + (component.default ? satus.locale.get('on') : satus.locale.get('off'));
};
/*--- SWITCH ---------------------------------------------------*/
satus.components.switch = function (component, skeleton) {
	component.childrenContainer = component.createChildElement('div', 'content');
	component.switcher = component.createChildElement('i');
	component.flip = satus.components.switch.flip;

	// variant: 'manual' disables default onclick, user provided function should handle this functionality manually
	if (skeleton.variant != 'manual') {
		component.addEventListener('click', function () {
			this.flip();
		}, true);
	}

	Object.defineProperties(component, {
		default: {
			get () {
				let value = false;
				if (Object.hasOwn(this.skeleton, 'value')) {
					value = satus.ifFunctionExec(this.skeleton.value);
				}
				return value;
			}
		},
		value: {
			get () {
				return (this.dataset.value === 'true') ? true : false;
			},
			set (val) {
				this.dataset.value = val;

				this.dispatchEvent(new CustomEvent('change'));
			},
			enumerable: true,
			configurable: true
		}
	});

	component.switcher.title = satus.locale.get('default') + ' ' + (component.default ? satus.locale.get('on') : satus.locale.get('off'));
};
/*--- SWITCH FLIP ----------------------------------------------*/
satus.components.switch.flip = function (val = (this.dataset.value === 'true') ? false : true) {
	this.value = val;
};
/*--- COUNT ----------------------------------------------------*/
satus.components.countComponent = function (component) {
	function createInput (placeholder, onChange) {
		const input = document.createElement('input');
		input.type = 'number';
		input.placeholder = placeholder;
		input.addEventListener('change', onChange);
		return input;
	}

	function createSelect (options, changeHandler) {
		const select = document.createElement('select');

		for (const optionData of options) {
			const option = document.createElement('option');
			option.text = optionData.text;
			option.value = optionData.value;
			select.add(option);
		}

		// Add change event listener if provided
		if (changeHandler) {
			select.addEventListener('change', changeHandler);
		}

		return select;
	}

	component.style.display = satus.storage.get('ads') === 'small_creators' ? 'flex' : 'none';

	const countLabelText = document.createElement('span');
	countLabelText.textContent = 'Maximum number of subscribers';
	component.appendChild(countLabelText);

	const countInput = createInput('130000', function (event) {
		satus.storage.set('smallCreatorsCount', event.target.value);
	});

	// Set the initial value from storage if available
	const storedValue = satus.storage.get('smallCreatorsCount');
	if (storedValue !== undefined) {
		countInput.value = storedValue;
	}

	countInput.style.width = '80px';
	countInput.style.height = '22px';
	countInput.style.fontSize = '12px';

	component.appendChild(countInput);

	const selectionDropdown = createSelect([
		{ text: ' ', value: '1' },
		{ text: 'K', value: '1000' },
		{ text: 'M', value: '1000000' }
	], function (event) {
		satus.storage.set('smallCreatorsUnit', event.target.value);
	});

	const storedUnitValue = satus.storage.get('smallCreatorsUnit');
	if (storedUnitValue !== undefined) {
		selectionDropdown.value = storedUnitValue;
	}
	component.appendChild(selectionDropdown);
};
/*--- CONTEXT MENU ---------------------------------------------*/
satus.events.on('render', function (component) {
	if (component.skeleton.contextMenu) {
		component.addEventListener('contextmenu', function (event) {
			const base = this.baseProvider,
				base_rect = base.getBoundingClientRect(),
				popup = satus.render({
					component: 'popup',
					variant: 'contextmenu',
					parentSkeleton: this.skeleton,
					baseProvider: base
				}, base),
				y = event.clientY - base_rect.top;
			let x = event.clientX - base_rect.left;

			if (base_rect.width - x < 200) {
				x = base_rect.width - x;

				if (x + 200 > base_rect.width) {
					x = 0;
				}

				popup.childrenContainer.style.right = x + 'px';
			} else {
				popup.childrenContainer.style.left = x + 'px';
			}

			popup.childrenContainer.style.top = y + 'px';

			this.skeleton.contextMenu.parentSkeleton = this.skeleton;

			satus.render(this.skeleton.contextMenu, popup.childrenContainer);

			event.preventDefault();
			event.stopPropagation();

			return false;
		});
	}
});
/*--- SORTABLE -------------------------------------------------*/
satus.events.on('render', function (component) {
	if (component.skeleton.sortable) {
		component.addEventListener('mousedown', function (event) {
			if (event.button !== 0) {
				return false;
			}

			const component = this,
				rect = this.getBoundingClientRect(),
				x = event.clientX,
				y = event.clientY,
				offset_x = event.clientX - rect.left,
				offset_y = event.clientY - rect.top,
				ghost = satus.clone(this),
				children = this.parentNode.children;
			let appended = false;

			ghost.classList.add('satus-sortable__ghost');

			function mousemove (event) {
				if (appended === false && (Math.abs(event.clientX - x) > 4 || Math.abs(event.clientY - y) > 4)) {
					appended = true;

					component.classList.add('satus-sortable__chosen');

					component.baseProvider.appendChild(ghost);
				}

				ghost.style.transform = 'translate(' + (event.clientX - offset_x) + 'px, ' + (event.clientY - offset_y) + 'px)';
			}

			function mouseup (event) {
				component.classList.remove('satus-sortable__chosen');
				ghost.remove();

				window.removeEventListener('mousemove', mousemove, true);
				window.removeEventListener('mouseup', mouseup, true);

				for (let i = 0, l = children.length; i < l; i++) {
					const child = children[i];

					if (child !== component) {
						child.removeEventListener('mouseover', siblingMouseOver);
					}
				}

				component.dispatchEvent(new CustomEvent('sort'));

				event.stopPropagation();

				return false;
			}

			window.addEventListener('mousemove', mousemove, {
				passive: true,
				capture: true
			});

			window.addEventListener('mouseup', mouseup, {
				passive: true,
				capture: true
			});

			function siblingMouseOver (event) {
				const parent = this.parentNode,
					y = event.layerY / (this.offsetHeight / 100);

				if (y < 50 && this.previousSibling !== component || y >= 50 && this.nextSibling === component) {
					parent.insertBefore(component, this);
				} else {
					parent.insertBefore(component, this.nextSibling);
				}
			}

			for (let i = 0, l = children.length; i < l; i++) {
				const child = children[i];

				if (child !== component) {
					child.addEventListener('mouseover', siblingMouseOver);
				}
			}

			event.stopPropagation();
			event.preventDefault();

			return false;
		});
	}
});
/*--------------------------------------------------------------
>>> COLOR:
----------------------------------------------------------------
# String to array
# RGB to HSL
# HUE to RGB
# HSL to RGB
--------------------------------------------------------------*/
satus.color = {};
/*--- STRING TO ARRAY ------------------------------------------*/
satus.color.stringToArray = function (string) {
	const match = string.match(/[0-9.]+/g);

	if (match) {
		for (let i = 0, l = match.length; i < l; i++) {
			match[i] = parseFloat(match[i]);
		}
	}

	return match;
};
/*--- RGB TO HSL -----------------------------------------------*/
satus.color.rgbToHsl = function (array) {
	const r = array[0] / 255,
		g = array[1] / 255,
		b = array[2] / 255,
		min = Math.min(r, g, b),
		max = Math.max(r, g, b);
	let h = 0,
		s = 0,
		l = (min + max) / 2;

	if (min != max) {
		const delta = max - min;

		s = l <= 0.5 ? delta / (max + min) : delta / (2 - max - min);

		if (max === r) {
			h = (g - b) / delta + (g < b ? 6 : 0);
		} else if (max === g) {
			h = (b - r) / delta + 2;
		} else if (max === b) {
			h = (r - g) / delta + 4;
		}

		h /= 6;
	}

	h *= 360;
	s *= 100;
	l *= 100;

	if (array.length === 3) {
		return [h, s, l];
	} else {
		return [h, s, l, array[3]];
	}
};
/*--- HUE TO RGB -----------------------------------------------*/
satus.color.hueToRgb = function (array) {
	const t1 = array[0],
		t2 = array[1];
	let hue = array[2];

	if (hue < 0) {
		hue += 6;
	}

	if (hue >= 6) {
		hue -= 6;
	}

	if (hue < 1) {
		return (t2 - t1) * hue + t1;
	} else if (hue < 3) {
		return t2;
	} else if (hue < 4) {
		return (t2 - t1) * (4 - hue) + t1;
	} else {
		return t1;
	}
};
/*--- HSL TO RGB -----------------------------------------------*/
satus.color.hslToRgb = function (array) {
	const h = array[0] / 360,
		s = array[1] / 100,
		l = array[2] / 100;
	let r, g, b;

	if (s == 0) {
		r = g = b = l;
	} else {
		const hue2rgb = function (p, q, t) {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		};

		const q = l < 0.5 ? l * (1 + s) : l + s - l * s,
			p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}

	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};
/*--------------------------------------------------------------
>>> USER
----------------------------------------------------------------
# OS
		# Name
		# Bitness
# Browser
		# Name
		# Version
		# Platform
		# Manifest
		# Languages
		# Cookies
		# Audio
		# Video
		# WebGL
# Device
		# Screen
		# RAM
		# GPU
		# Cores
--------------------------------------------------------------*/
satus.user = {
	browser: {},
	device: {},
	os: {}
};
/*--------------------------------------------------------------
# OS
--------------------------------------------------------------*/
/*--- NAME -----------------------------------------------------*/
satus.user.os.name = function () {
	const app_version = navigator.appVersion;

	if (app_version.includes('Win')) {
		if (app_version.match(/(Windows 10.0|Windows NT 10.0)/)) {
			return 'Windows 10';
		} else if (app_version.match(/(Windows 8.1|Windows NT 6.3)/)) {
			return 'Windows 8.1';
		} else if (app_version.match(/(Windows 8|Windows NT 6.2)/)) {
			return 'Windows 8';
		} else if (app_version.match(/(Windows 7|Windows NT 6.1)/)) {
			return 'Windows 7';
		} else if (app_version.match(/(Windows NT 6.0)/)) {
			return 'Windows Vista';
		} else if (app_version.match(/(Windows NT 5.1|Windows XP)/)) {
			return 'Windows XP';
		} else {
			return 'Windows';
		}
	} else if (app_version.includes('(iPhone|iPad|iPod)')) {
		return 'iOS';
	} else if (app_version.includes('Mac')) {
		return 'macOS';
	} else if (app_version.includes('Android')) {
		return 'Android';
	} else if (app_version.includes('OpenBSD')) {
		return 'OpenBSD';
	} else if (app_version.includes('SunOS')) {
		return 'SunOS';
	} else if (app_version.includes('Linux')) {
		return 'Linux';
	} else if (app_version.includes('X11')) {
		return 'UNIX';
	}
};
/*--- BITNESS --------------------------------------------------*/
satus.user.os.bitness = function () {
	return navigator.appVersion.match(/(Win64|x64|x86_64|WOW64)/) ? '64-bit' : '32-bit';
};
/*--------------------------------------------------------------
# BROWSER
--------------------------------------------------------------*/
/*--- NAME -----------------------------------------------------*/
satus.user.browser.name = function () {
	const user_agent = navigator.userAgent;

	if (navigator.brave) {
		return 'Brave';
	}	else if (user_agent.includes("Opera") || user_agent.includes('OPR')) {
		return 'Opera';
	} else if (user_agent.includes('Vivaldi')) {
		return 'Vivaldi';
	} else if (user_agent.includes('Edge')) {
		return 'Edge';
	} else if (user_agent.includes('Chrome')) {
		return 'Chrome';
	} else if (user_agent.includes('Safari')
				&& (!/Windows|Chrom/.test(user_agent)
				|| /Macintosh|iPhone/.test(user_agent))) {
		return 'Safari';
	} else if (user_agent.includes('Firefox')) {
		return 'Firefox';
	} else if (user_agent.includes('MSIE')) {
		return 'IE';
	}
};
/*--- VERSION --------------------------------------------------*/
satus.user.browser.version = function () {
	return navigator.userAgent.match(new RegExp(satus.user.browser.name() + '/([0-9.]+)'))[1];
};
/*--- PLATFORM -------------------------------------------------*/
satus.user.browser.platform = function () {
	return navigator.platform;
};
/*--- MANIFEST -------------------------------------------------*/
satus.user.browser.manifest = function () {
	return satus.isFunction(chrome?.runtime?.getManifest) ? chrome.runtime.getManifest() : {};
};
/*--- LANGUAGES ------------------------------------------------*/
satus.user.browser.languages = function () {
	return navigator.languages;
};
/*--- COOKIES --------------------------------------------------*/
satus.user.browser.cookies = function () {
	if (document.cookie) {
		const random_cookie = Math.random().toString(36).substr(2, 5);

		document.cookie = random_cookie;

		if (document.cookie.includes(random_cookie)) {
			return true;
		}
	}

	return false;
};
/*--- AUDIO ----------------------------------------------------*/
satus.user.browser.audio = function () {
	const audio = document.createElement('audio'),
		types = {
			mp3: 'audio/mpeg',
			mp4: 'audio/mp4',
			aif: 'audio/x-aiff',
			'AAC-LC': 'audio/mp4; codecs="mp4a.40.2"',
			opus: 'audio/webm; codecs="opus"'
		};
	let result = [];

	if (satus.isFunction(audio.canPlayType)) {
		for (const key in types) {
			if (audio.canPlayType(types[key]) !== '') {
				result.push(key);
			}
		}
	}

	return result;
};
/*--- VIDEO ----------------------------------------------------*/
satus.user.browser.video = function () {
	const video = document.createElement('video'),
		types = {
			//ogg: 'video/ogg; codecs="theora"',
			'H.264 Baseline Profile 3.0': 'video/mp4; codecs="avc1.42E01E"',
			'H.264 Main Profile 4.0': 'video/mp4; codecs="avc1.640028"',
			//webm: 'video/webm; codecs="vp8, vorbis"',
			vp9: 'video/webm; codecs="vp9"',
			av1: 'video/mp4; codecs=av01.0.05M.08',
			hls: 'application/x-mpegURL; codecs="avc1.42E01E"'
		};
	let result = [];

	if (satus.isFunction(video.canPlayType)) {
		for (const key in types) {
			if (video.canPlayType(types[key]) !== '') {
				result.push(key);
			}
		}
	}

	return result;
};
/*--- WEBGL ----------------------------------------------------*/
satus.user.browser.webgl = function () {
	const cvs = document.createElement('canvas'),
		ctx = cvs.getContext('webgl');

	return ctx && ctx instanceof WebGLRenderingContext;
};
/*--------------------------------------------------------------
# HARDWARE
--------------------------------------------------------------*/
/*--- SCREEN ---------------------------------------------------*/
satus.user.device.screen = function () {
	return screen ? (screen.width + 'x' + screen.height) : '';
};
/*--- RAM ------------------------------------------------------*/
satus.user.device.ram = function () {
	// eslint-disable-next-line
	return navigator.deviceMemory ? (navigator.deviceMemory + ' GB') : '';
};
/*---  GPU --------------------------------------------------*/
satus.user.device.gpu = function () {
	const cvs = document.createElement('canvas'),
		ctx = cvs.getContext('webgl');

	if (ctx
		&& ctx instanceof WebGLRenderingContext
		&& 'getParameter' in ctx
		&& 'getExtension' in ctx) {

		const info = ctx.getExtension('WEBGL_debug_renderer_info');

		return info ? ctx.getParameter(info.UNMASKED_RENDERER_WEBGL) : '';
	}
};
/*--- CORES ----------------------------------------------------*/
satus.user.device.cores = function () {
	return navigator.deviceConcurrency || navigator.hardwareConcurrency;
};
