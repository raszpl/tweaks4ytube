/*--- SETTINGS -------------------------------------------------
# Button
# Appearance
# Language
# Date & time
# Backup & reset
# Developer options
# About
--------------------------------------------------------------*/

/*--- BUTTON -------------------------------------------------*/
extension.skeleton.header.sectionEnd.menu.on.click.settings = {
	component: 'button',
	category: true,

	on: {
		click: {
			firstSection: {
				component: 'section',
				variant: 'card'
			},
			secondSection: {
				component: 'section',
				variant: 'card'
			}
		}
	},
	svg: {
		component: 'svg',
		attr: {
			'viewBox': '0 0 24 24',
			'fill': 'none',
			'stroke': 'currentColor',
			'stroke-width': '1.75'
		},

		circle: {
			component: 'circle',
			attr: {
				'cx': '12',
				'cy': '12',
				'r': '3'
			}
		},
		path: {
			component: 'path',
			attr: {
				'd': 'M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z'
			}
		}
	},
	label: {
		component: 'span',
		text: 'settings'
	}
};
/*--- APPEARANCE ---------------------------------------------*/
extension.skeleton.header.sectionEnd.menu.on.click.settings.on.click.firstSection.appearance = {
	component: 'button',
	before: {
		svg: {
			component: 'svg',
			attr: {
				'viewBox': '0 0 24 24',
				'fill': 'currentColor'
			},

			path: {
				component: 'path',
				attr: {
					'd': 'M7 16c.6 0 1 .5 1 1a2 2 0 0 1-2 2h-.5a4 4 0 0 0 .5-2c0-.6.5-1 1-1M18.7 3a1 1 0 0 0-.7.3l-9 9 2.8 2.7 9-9c.3-.4.3-1 0-1.4l-1.4-1.3a1 1 0 0 0-.7-.3zM7 14a3 3 0 0 0-3 3c0 1.3-1.2 2-2 2 1 1.2 2.5 2 4 2a4 4 0 0 0 4-4 3 3 0 0 0-3-3z'
				}
			}
		}
	},
	on: {
		click: {
			header: {
				component: 'section',
				variant: 'card',
				title: 'header',

				it_version: {
					component: 'switch',
					text: 'showVersion',
					value: true
				}
			},
			home: {
				component: 'section',
				variant: 'card',
				title: 'homeScreen',

				it_layout: {
					component: 'select',
					text: 'layout',
					options: [{
						text: 'bubbles',
						value: 'bubbles'
					}, {
						text: 'list',
						value: 'list'
					}]
				},
				hideCategories: {
					component: 'button',
					on: {
						click: {
							section: {
								component: 'section',
								variant: 'card',

								it_general: {
									component: 'checkbox',
									text: 'general'
								},
								it_appearance: {
									component: 'checkbox',
									text: 'appearance'
								},
								it_themes: {
									component: 'checkbox',
									text: 'themes'
								},
								it_player: {
									component: 'checkbox',
									text: 'player'
								},
								it_playlist: {
									component: 'checkbox',
									text: 'playlist'
								},
								it_subscriptions: {
									component: 'checkbox',
									text: 'subscriptions'
								},
								it_channel: {
									component: 'checkbox',
									text: 'channel'
								},
								it_shortcuts: {
									component: 'checkbox',
									text: 'shortcuts'
								},
								it_mixer: {
									component: 'checkbox',
									text: 'mixer'
								},
								it_analyzer: {
									component: 'checkbox',
									text: 'analyzer'
								},
								it_blocklist: {
									component: 'checkbox',
									text: 'blocklist'
								}
							}
						}
					}
				},
			},
			animations: {
				component: 'section',
				variant: 'card',
				title: 'animations',

				it_layer_animation_scale: {
					component: 'select',
					text: 'layerAnimationScale',
					options: [{
						text: '0x',
						value: 0
					}, {
						text: '1x',
						value: 1
					}]
				}
			}
		}
	}
};
/*--- LANGUAGE -----------------------------------------------*/
extension.skeleton.header.sectionEnd.menu.on.click.settings.on.click.secondSection.language = {
	component: 'button',
	before: {
		svg: {
			component: 'svg',
			attr: {
				'viewBox': '0 0 24 24',
				'fill': 'none',
				'stroke': 'currentColor',
				'troke-linecap': 'round',
				'stroke-linejoin': 'round',
				'stroke-width': '1.75'
			},

			circle: {
				component: 'circle',
				attr: {
					'cx': '12',
					'cy': '12',
					'r': '10'
				}
			},
			path: {
				component: 'path',
				attr: {
					'd': 'M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'
				}
			}
		}
	},
	on: {
		click: {
			section: {
				component: 'section',
				variant: 'card',
				languages: [
					{value: 'default', text: 'default'},
					{value: "ko", text: "한국어"},
					{value: "en", text: "English"},
					{value: "en-IN", text: "English (India)"},
					{value: "en-GB", text: "English (UK)"},
					{value: "en-US", text: "English (US)"},
					{value: "ja", text: "日本語"},
					{value: "ru", text: "Русский"},
					{value: "pt", text: "Português (Brasil)"},
					{value: "pt-PT", text: "Português"},
					{value: "es-419", text: "Español (Latinoamérica)"},
					{value: "es", text: "Español (España)"},
					{value: "es-US", text: "Español (US)"},
					{value: "fr", text: "Français"},
					{value: "fr-CA", text: "Français (Canada)"},
					{value: "de", text: "Deutsch"},
					{value: "pl", text: "Polski"},
					{value: "zh-CN", text: "中文 (简体)"},
					{value: "zh-TW", text: "中文 (繁體)"},
					{value: "zh-HK", text: "中文 (香港)"},
					{value: "fil", text: "Filipino"},
					{value: "af", text: "Afrikaans"},
					{value: "az", text: "Azərbaycan"},
					{value: "id", text: "Bahasa Indonesia"},
					{value: "ms", text: "Bahasa Malaysia"},
					{value: "bs", text: "Bosanski"},
					{value: "ca", text: "Català"},
					{value: "cs", text: "Čeština"},
					{value: "da", text: "Dansk"},
					{value: "et", text: "Eesti"},
					{value: "eu", text: "Euskara"},
					{value: "gl", text: "Galego"},
					{value: "hr", text: "Hrvatski"},
					{value: "zu", text: "IsiZulu"},
					{value: "is", text: "Íslenska"},
					{value: "it", text: "Italiano"},
					{value: "sw", text: "Kiswahili"},
					{value: "lv", text: "Latviešu valoda"},
					{value: "lt", text: "Lietuvių"},
					{value: "hu", text: "Magyar"},
					{value: "nl", text: "Nederlands"},
					{value: "no", text: "Norsk"},
					{value: "nb-NO", text: "Norwegian Bokmål (not yet selectable on YouTube)"},
					{value: "uz", text: "O‘zbek"},
					{value: "ro", text: "Română"},
					{value: "sq", text: "Shqip"},
					{value: "sk", text: "Slovenčina"},
					{value: "sl", text: "Slovenščina"},
					{value: "sr-Latn", text: "Srpski"},
					{value: "fi", text: "Suomi"},
					{value: "sv", text: "Svenska"},
					{value: "vi", text: "Tiếng Việt"},
					{value: "tr", text: "Türkçe"},
					{value: "be", text: "Беларуская"},
					{value: "bg", text: "Български"},
					{value: "ky", text: "Кыргызча"},
					{value: "kk", text: "Қазақ Тілі"},
					{value: "mk", text: "Македонски"},
					{value: "mn", text: "Монгол"},
					{value: "sr", text: "Српски"},
					{value: "uk", text: "Українська"},
					{value: "el", text: "Ελληνικά"},
					{value: "hy", text: "Հայերեն"},
					{value: "iw", text: "עברית"},
					{value: "ur", text: "اردو"},
					{value: "ar", text: "العربية"},
					{value: "fa", text: "فارسی"},
					{value: "fa-IR", text: "Iranian Persian (not yet selectable on YouTube)"},
					{value: "ne", text: "नेपाली"},
					{value: "mr", text: "मराठी"},
					{value: "hi", text: "हिन्दी"},
					{value: "bn", text: "বাংলা"},
					{value: "pa", text: "ਪੰਜਾਬੀ"},
					{value: "gu", text: "ગુજરાતી"},
					{value: "ta", text: "தமிழ்"},
					{value: "te", text: "తెలుగు"},
					{value: "kn", text: "ಕನ್ನಡ"},
					{value: "ml", text: "മലയാളം"},
					{value: "si", text: "සිංහල"},
					{value: "th", text: "ภาษาไทย"},
					{value: "lo", text: "ລາວ"},
					{value: "my", text: "ဗမာ"},
					{value: "ka", text: "ქართული"},
					{value: "am", text: "አማርኛ"},
					{value: "km", text: "ខ្មែរ"},
					{value: "zh-CN", text: "中文 (简体)"},
					{value: "zh-TW", text: "中文 (繁體)"},
					{value: "zh-HK", text: "中文 (香港)"},
					{value: "ko", text: "한국어"}
				],
				it_language: {
					component: 'select',
					text: 'improvedtubeLanguage',
					options: function () {
						return extension.skeleton.header.sectionEnd.menu.on.click.settings.on.click.secondSection.language.on.click.section.languages;
					}
				},
				youtube_language: {
					component: 'select',
					text: 'youtubeLanguage',
					options: function () {
						return [{value: 'disabled', text: "Disabled"}].concat(extension.skeleton.header.sectionEnd.menu.on.click.settings.on.click.secondSection.language.on.click.section.languages);
					},
					on: {
						change: function (event) {
							if (event.target.value === 'default') {
								satus.storage.remove('youtube_language');
							}
						}
					}
				}
			}
		}
	}
};
/*--- BACKUP & RESET -----------------------------------------*/
extension.skeleton.header.sectionEnd.menu.on.click.settings.on.click.secondSection.backupAndReset = {
	component: 'button',
	before: {
		svg: {
			component: 'svg',
			attr: {
				'viewBox': '0 0 24 24',
				'fill': 'currentColor'
			},

			path: {
				component: 'path',
				attr: {
					'd': 'M13.3 3A9 9 0 0 0 4 12H2.2c-.5 0-.7.5-.3.8l2.7 2.8c.2.2.6.2.8 0L8 12.8c.4-.3.1-.8-.3-.8H6a7 7 0 1 1 2.7 5.5 1 1 0 0 0-1.3.1 1 1 0 0 0 0 1.5A9 9 0 0 0 22 11.7C22 7 18 3.1 13.4 3zm-.6 5c-.4 0-.7.3-.7.8v3.6c0 .4.2.7.5.9l3.1 1.8c.4.2.8.1 1-.2.2-.4.1-.8-.2-1l-3-1.8V8.7c0-.4-.2-.7-.7-.7z'
				}
			}
		}
	},
	on: {
		click: {
			section: {
				component: 'section',
				variant: 'card',
				importSettings: {
					component: 'button',
					on: {
						click: {
							component: 'popup',
							variant: 'confirm',
							content: 'areYouSureYouWantToImportTheData',
							ok: function () {
								// Firefox 'popups opened from a panel cause the panel to close' from 2017
								// https://bugzilla.mozilla.org/show_bug.cgi?id=1378527 workaround:
								if (satus.user.browser.name() == 'Firefox' && !document.body.hasAttribute('tab')) {
									window.open(chrome.runtime.getURL('menu/index.html?action=import-settings'), '_blank');
									return;
								}

								const input = document.createElement('input');

								input.type = 'file';

								input.addEventListener('change', function () {
									const file_reader = new FileReader();

									file_reader.onload = function () {
										// FIXME
										//satus.storage.clear();
										const data = JSON.parse(this.result);
										for (const key in data) {
											satus.storage.set(key, data[key]);
										}
										if (location.search == '?action=import-settings') window.close();
									};

									file_reader.readAsText(this.files[0]);
								});

								input.click();
							}
						}
					}
				},
				exportSettings: {
					component: 'button',
					on: {
						click: {
							component: 'popup',
							variant: 'confirm',
							content: 'areYouSureYouWantToExportTheData',
							ok: function () {
								// Firefox 'popups opened from a panel cause the panel to close' from 2017
								// https://bugzilla.mozilla.org/show_bug.cgi?id=1378527 workaround:
								if (satus.user.browser.name() == 'Firefox' && !document.body.hasAttribute('tab')) {
									window.open(chrome.runtime.getURL('menu/index.html?action=export-settings'), '_blank');
									return;
								}

								const blob = new Blob([JSON.stringify(satus.storage.data)], {
									type: 'application/json;charset=utf-8'
								});

								chrome.permissions.request({
									permissions: ['downloads']
								}, function (granted) {
									if (granted) {
										chrome.downloads.download({
											url: URL.createObjectURL(blob),
											filename: 'improvedtube.json',
											saveAs: true
										});
									}
									if (location.search == '?action=export-settings') document.body.onfocus = () => window.close();
								});
							}
						}
					}
				}
			},
			sync: {
				component: 'section',
				variant: 'card',
				title: 'browserAccountSync',

				pushSyncSettings: {
					component: 'button',
					on: {
						click: {
							component: 'popup',
							variant: 'confirm',
							content: 'areYouSureYouWantToSyncTheData',
							ok: function () {
								try {
									chrome.storage.sync.clear();
									chrome.storage.sync.set({settings: JSON.stringify(satus.storage.data)});
								} catch (error) {
									console.error(error);
								}
							}
						}
					}
				},
				pullSyncSettings: {
					component: 'button',
					on: {
						click: {
							component: 'popup',
							variant: 'confirm',
							content: 'areYouSureYouWantToImportTheData',
							ok: function () {
								chrome.storage.sync.get('settings', function (r) {
									const data = JSON.parse(r['settings']);
									for (const key in data) {
										satus.storage.set(key, data[key]);
									}
								});
							}
						}
					}
				}
			},
			reset: {
				component: 'section',
				variant: 'card',
				delete_youtube_cookies: {
					component: 'button',
					text: 'deleteYoutubeCookies',
					on: {
						click: {
							component: 'popup',
							variant: 'confirm',
							content: 'thisWillRemoveAllYouTubeCookies',
							ok: function () {
								chrome.tabs.query({
									url: 'https://www.youtube.com/*',
									discarded: false
								}).then(tabs => {
									for (const tab of tabs) {
										chrome.tabs.sendMessage(tab.id, {
											action: 'delete-youtube-cookies'
										});
									}
								});
							}
						}
					}
				},
				resetAllSettings: {
					component: 'button',
					on: {
						click: {
							component: 'popup',
							variant: 'confirm',
							content: 'allYourSettingsWillBeErasedAndCanTBeRecovered',
							ok: function () {
								satus.storage.clear();
							}
						}
					}
				},
				resetAllShortcuts: {
					component: 'button',
					on: {
						click: {
							component: 'popup',
							variant: 'confirm',
							content: 'allYourShortcutsWillBeErasedAndCanTBeRecovered',
							ok: function () {
								for (const key in satus.storage.data) {
									if (key.startsWith('shortcut_')) {
										satus.storage.remove(key);
									}
								}
							}
						}
					}
				}
			}
		}
	}
};
/*--- DEVELOPER OPTIONS --------------------------------------*/
extension.skeleton.header.sectionEnd.menu.on.click.settings.on.click.secondSection.developerOptions = {
	component: 'button',
	before: {
		svg: {
			component: 'svg',
			attr: {
				'viewBox': '0 0 24 24',
				'fill': 'currentColor'
			},

			path: {
				component: 'path',
				attr: {
					'd': 'M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z'
				}
			}
		}
	},
	on: {
		click: {
			header: {
				component: 'section',
				variant: 'card',
				title: 'youtube',

				api: {
					component: 'button',
					text: 'API',

					on: {
						click: {
							component: 'section',
							variant: 'transparent-card',
							title: 'YouTube API',
							google_api_key: {
								component: 'text-field'
							}
						}
					}
				},
				css: {
					component: 'button',
					text: 'CSS',

					on: {
						click: {
							custom_css: {
								component: 'text-field',
								multiline: true,
								lineNumbers: true,
								style: {
									height: '100%'
								}
							}
						}
					}
				},
				js: {
					component: 'button',
					text: 'JavaScript',

					on: {
						click: {
							custom_js: {
								component: 'text-field',
								multiline: true,
								lineNumbers: true,
								style: {
									height: '100%'
								}
							}
						}
					}
				}
			},
			home: {
				component: 'section',
				variant: 'card',
				title: 'improvedTube',

				it_debug_stats: {
					component: 'switch'
				},
				it_debug_locale: {
					component: 'button',

					on: {
						click: {
							component: 'section',
							variant: 'transparent-card',
							title: 'not_finished',
							not_finished: {
								component: 'text-field'
							}
							// fixme: finish this satus.locale.validate
						}
					}
				}
			},
		}
	}
};
/*--- ABOUT ----------------------------------------------------*/
extension.skeleton.header.sectionEnd.menu.on.click.settings.on.click.secondSection.about = {
	component: 'button',
	text: 'My_specs',
	before: {
		svg: {
			component: 'svg',
			attr: {
				'viewBox': '0 0 24 24',
				'fill': 'currentColor'
			},

			path: {
				component: 'path',
				attr: {
					'd': 'M11 7h2v2h-2zm0 4h2v6h-2zm1-9a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z'
				}
			}
		}
	},
	on: {
		click: {
			extensionSection: {
				component: 'section',
				variant: 'card',

				list: {
					component: 'list',
					items: [
						['name', satus.user.browser.manifest().short_name],
						['version', satus.user.browser.manifest().version_name || satus.user.browser.manifest().version],
						['permissions', satus.user.browser.manifest().permissions.join(', ').replace('https://www.youtube.com/', 'YouTube')]
					]
				}
			},
			otherSection: {
				component: 'section',
				variant: 'card',

				softwareInformation: {
					component: 'button',
					on: {
						click: {
							osSection: {
								component: 'section',
								variant: 'card',
								title: 'os',

								list: {
									component: 'list',
									items: [
										['name', satus.user.os.name()],
										['bitness', satus.user.os.bitness()]
									]
								}
							},
							browserSection: {
								component: 'section',
								variant: 'card',
								title: 'browser',

								list: {
									component: 'list',
									items: [
										['name', satus.user.browser.name()],
										['version', satus.user.browser.version()],
										['platform', satus.user.browser.platform()],
										['audioFormats', satus.user.browser.audio().join(', ')],
										['videoFormats', satus.user.browser.video().join(', ')],
										['Cookies', satus.user.browser.cookies()]
									]
								}
							}
						}
					}
				},
				hardwareInformation: {
					component: 'button',
					on: {
						click: {
							component: 'section',
							variant: 'card',

							list: {
								component: 'list',
								items: [
									['screen', satus.user.device.screen()],
									['cores', satus.user.device.cores()],
									['gpu', satus.user.device.gpu()],
									['ram', satus.user.device.ram()]
								]
							}
						}
					}
				}
			}
		}
	}
};
/*--- DATE & TIME --------------------------------------------*/
extension.skeleton.header.sectionEnd.menu.on.click.settings.on.click.secondSection.dateAndTime = {
	component: 'button',
	before: {
		svg: {
			component: 'svg',
			attr: {
				'viewBox': '0 0 24 24',
				'fill': 'currentColor'
			},

			path: {
				component: 'path',
				attr: {
					'd': 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-.2-13c-.5 0-.8.3-.8.7v4.7c0 .4.2.7.5.9l4.1 2.5c.4.2.8 0 1-.3.2-.3.1-.7-.2-1l-3.9-2.2V7.7c0-.4-.3-.7-.7-.7z'
				}
			}
		}
	},
	on: {
		click: {
			component: 'section',
			variant: 'card',

			use_24_hour_format: {
				component: 'switch',
				text: 'use24HourFormat',
				value: true
			}
		}
	}
};
