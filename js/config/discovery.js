var a11y_meta = {
	"properties": [
		{
			"id": "accessibilityFeature",
			"type": "checkbox",
			"required": true,
			"name": {
					"en": "Accessibility Features"
			},
			"values": [
				{
					"epub": {
						"id": "alternativeText",
						"label": "alternative text"
					},
					"onix": {
						"id": "14",
						"name": "Short alternative textual descriptions",
						"desc": "All or substantially all non-text content has short alternative (textual) descriptions, usually provided via alt attributes. Note this applies to normal images (eg photographs, charts and diagrams) and also to any embedded audio, video etc. Audio and video content should include alternative descriptions suitable for hearing-impaired as well as for visually-impaired readers. (Purely decorative non-text content can be ignored, but the accessibility of resources delivered via a network connection rather than as part of the e-publication package must be included)"
					}
				},
				{
					"epub": {
						"id": "annotations",
						"label": "annotations"
					}
				},
				{
					"epub": {
						"id": "ARIA",
						"label": "ARIA roles"
					},
					"onix": {
						"id": "30",
						"name": "ARIA roles provided",
						"desc": "Accessible Rich Internet Applications (ARIA) roles are used to organize and improve the structural or landmark navigation of the publication (eg to identify key sections of the content and the purpose of hyperlinks). Only for use in ONIX 3.0 or later"
					}
				},
				{
					"epub": {
						"id": "audioDescription",
						"label": "audio descriptions"
					},
					"onix": {
						"id": "28",
						"name": "Full alternative audio descriptions",
						"desc": "All or substantially all non-text content has full alternative descriptions as pre-recorded audio. Note this applies to normal images (eg photographs, charts and diagrams) and also to any embedded video etc. Video content should include full alternative descriptions (eg audio-described video) and transcript, subtitles or captions (whether closed or open) suitable for hearing-impaired as well as for visually-impaired readers. (Purely decorative non-text content can be ignored, but the accessibility of resources delivered via a network connection rather than as part of the e-publication package must be included). Only for use in ONIX 3.0 or later"
					}
				},
				{
					"epub": {
						"id": "braille",
						"label": "braille"
					}
				},
				{
					"epub": {
						"id": "ChemML",
						"label": "ChemML"
					},
					"onix": {
						"id": "18",
						"name": "Accessible chemistry content as ChemML",
						"desc": "Chemistry content such as chemical formulae is usable with assistive technology, through use of ChemML"
					}
				},
				{
					"epub": {
						"id": "closedCaptions",
						"label": "closed captions"
					}
				},
				{
					"epub": {
						"id": "describedMath",
						"label": "described math"
					}
				},
				{
					"epub": {
						"id": "displayTransformability",
						"label": "display transformability"
					},
					"onix": {
						"id": "36",
						"name": "All textual content can be modified",
						"desc": "E-publication does not restrict the ability of users to modify and reflow the display of any textual content to the full extent allowed by the reading system (eg to change the text size or typeface, line height and word spacing, colors). Only for use in ONIX 3.0 or later."
					}
				},
				{
					"epub": {
						"id": "highContrastAudio",
						"label":"high contrast audio"
					}
				},
				{
					"epub": {
						"id": "highContrastDisplay",
						"label": "high contrast display"
					},
					"onix": {
						"id": "27",
						"name": "Use of high contrast between foreground and background audio",
						"desc": "Foreground audio content (eg voice) is presented with no or low background noise (eg ambient sounds, music), at least 20dB below the level of the foreground, or background noise can be switched off (eg via an alternative audio track). Brief and occasional sound effects may be as loud as foreground voice so long as they are isolated from the foreground. Only for use in ONIX 3.0 or later"
					}
				},
				{
					"epub": {
						"id": "index",
						"label": "index"
					},
					"onix": {
						"id": "12",
						"name": "Index navigation",
						"desc": "Index provides direct (eg hyperlinked) access to uses of the index terms in the document body"
					}
				},
				{
					"epub": {
						"id": "largePrint",
						"label": "large print"
					}
				},
				{
					"epub": {
						"id": "latex",
						"label": "latex"
					},
					"onix": {
						"id": "35",
						"name": "Accessible math content (as LaTeX)",
						"desc": "Only for use in ONIX 3.0 or later"
					}
				},
				{
					"epub": {
						"id": "longDescription",
						"label": "long descriptions"
					},
					"onix": [
						{
							"id": "15",
							"name": "Full alternative textual descriptions",
							"desc": "All or substantially all non-text content has full alternative (textual) descriptions. Note this applies to normal images (eg photographs, charts and diagrams) and also to any embedded audio, video etc. Audio and video content should include full alternative descriptions (eg audio-described video) and transcript, subtitles or captions (whether closed or open) suitable for hearing-impaired as well as for visually-impaired readers. (Purely decorative non-text content can be ignored, but the accessibility of resources delivered via a network connection rather than as part of the e-publication package must be included)"
						},
						{
							"id": "16",
							"name": "Visualised data also available as non-graphical data",
							"desc": "Where data visualisations are provided (eg graphs and charts), the underlying data is also available in non-graphical (usually tabular, textual) form"
						}
					]
				},
				{
					"epub": {
						"id": "MathML",
						"label": "MathML"
					},
					"onix": {
						"id": "17",
						"name": "Accessible math content as MathML",
						"desc": "Mathematical content such as equations is usable with assistive technology, through use of MathML. Semantic MathML is preferred but Presentational MathML is acceptable"
					}
				},
				{
					"epub": {
						"id": "MathML-chemistry",
						"label": "Chemistry expressed as MathML"
					},
					"onix": {
						"id": "34",
						"name": "Accessible chemistry content (as MathML)",
						"desc": "Only for use in ONIX 3.0 or later"
					}
				},
				{
					"epub": {
						"id": "none",
						"label": "none"
					}
				},
				{
					"epub": {
						"id": "openCaptions",
						"label": "open captions"
					}
				},
				{
					"epub": {
						"id": "pageBreakMarkers",
						"label": "page break markers"
					},
					"onix": {
						"id": "19",
						"name": "Print-equivalent page numbering",
						"desc": "For a reflowable e-publication, contains references to the page numbering of an equivalent printed product."
					}
				},
				{
					"epub": {
						"id": "pageNavigation",
						"label": "page navigation"
					}
				},
				{
					"epub": {
						"id": "readingOrder",
						"label": "reading order"
					},
					"onix": {
						"id": "13",
						"name": "Single logical reading order",
						"desc": "All or substantially all textual matter is arranged in a single logical reading order (including text that is visually presented as separate from the main text flow, eg in boxouts, captions, tables, footnotes, endnotes, citations, etc). Non-textual content is also linked from within this logical reading order. (Purely decorative non-text content can be ignored). All or substantially all audio content should also have a single logical ‘reading order’, which is the order the content should be presented to the listener"
					}
				},
				{
					"epub": {
						"id": "rubyAnnotations",
						"label": "ruby annotations"
					}
				},
				{
					"epub": {
						"id": "signLanguage",
						"label": "sign language"
					}
				},
				{
					"epub": {
						"id": "structuralNavigation",
						"label": "structural navigation"
					},
					"onix": {
						"id": "29",
						"name": "Next / Previous structural navigation",
						"desc": "All levels of heading and other structural elements of the content are correctly marked up and (if applicable) numbered, to enable fast next heading / previous heading, next chapter / previous chapter navigation without returning to the table of contents. Only for use in ONIX 3.0 or later"
					}
				},
				{
					"epub": {
						"id": "synchronizedAudioText",
						"label": "synchronized audio text"
					},
					"onix": {
						"id": "20",
						"name": "Synchronised pre-recorded audio",
						"desc": "Text-synchronised pre-recorded audio narration (natural or synthesised voice) is included for substantially all textual matter, including all alternative descriptions, eg via a SMIL media overlay"
					}
				},
				{
					"epub": {
						"id": "tableOfContents",
						"label": "table of contents"
					},
					"onix": {
						"id": "11",
						"name": "Table of contents navigation",
						"desc": "Table of contents allows direct (eg hyperlinked) access to all levels of text organization above individual paragraphs (eg to all sections and subsections) and to all tables, figures, illustrations etc. Non-textual items such as illustrations, tables, audio or video content may be directly accessible from the Table of contents, or from a similar List of illustrations, List of tables, etc"
					}
				},
				{
					"epub": {
						"id": "tactileGraphic",
						"label": "tactile graphic"
					}
				},
				{
					"epub": {
						"id": "tactileObject",
						"label": "tactile object"
					}
				},
				{
					"epub": {
						"id": "timingControl",
						"label": "timing control"
					}
				},
				{
					"epub": {
						"id": "transcript",
						"label": "transcript"
					}
				},
				{
					"epub": {
						"id": "ttsMarkup",
						"label": "text-to-speech markup"
					},
					"onix": {
						"id": "21",
						"name": "Text-to-speech hinting provided",
						"desc": "Text-to-speech has been optimised through provision of PLS lexicons, SSML or CSS Speech synthesis hints or other speech synthesis markup languages or hinting"
					}
				},
				{
					"epub": {
						"id": "unknown",
						"label": "unknown"
					}
				},
				{
					"epub": {
						"id": "unlocked",
						"label": "unlocked"
					},
					"onix": {
						"id": "10",
						"name": "No reading system accessibility options actively disabled (except)",
						"desc": "No accessibility features or content rendering options offered by the reading system, device or reading software (including but not limited to the ability to modify or choose text size or typeface, word and line spacing, zoom level, text or background color, or use of text-to-speech) are limited, disabled, overridden or otherwise unusable with the product EXCEPT – in ONIX 3 messages only – those specifically noted as subject to restriction or prohibition in <EpubUsageConstraint>. Note that provision of any significant part of the textual content as images (ie as pictures of text, rather than as ‘text-as-text’, and without any textual equivalent) or the application of some technical protection measures (DRM), inevitably prevents full use of these accessibility options. Code 10 means ‘this e-publication is accessible to the full extent that the file format and types of content allow, on a specific reading device, by default, without necessarily inluding any additions such as textual descriptions of images or enhanced navigation. Note that for reflowable e-books, this means code 36 also applies, although code 10 can also be used with accessible non-reflowable (fixed-format) e-publications and with audio material. Should be used with other codes that describe any additions to enhance the level of accessibility"
					}
				}
			],
			"addMoreValues": {
    			"id": "add-a11y-feature",
    			"label": {
    				"en": "Add custom field"
    			}
			},
			"documentation": {
				"en": "https://www.w3.org/TR/epub-a11y-tech-11/#meta-003"
			}
		},
		{
			"id": "accessibilityHazard",
			"type": "checkbox",
			"required": true,
			"name": {
				"en": "Accessibility Hazards"
			},
			"values": [
				{
					"epub": {
						"id": "flashing",
						"label": "flashing"
					}
				},
				{
					"epub" :{
						"id": "noFlashingHazard",
						"label": "no flashing risk"
					}
				},
				{
					"epub": {
						"id": "unknownFlashingHazard",
						"label": "flashing risk unknown"
					}
				},
				{
					"epub": {
						"id": "none",
						"label": "no hazards"
					}
				},
				{
					"epub": {
						"id": "motionSimulation",
						"label": "motion simulation"
					}
				},
				{
					"epub": {
						"id": "noMotionSimulationHazard",
						"label": "no motion risk"
					}
				},
				{
					"epub": {
						"id": "unknownMotionSimulationHazard",
						"label": "motion risk unknown"
					}
				},
				{
					"epub": {
						"id": "unknown",
						"label": "hazards not known"
					}
				},
				{
					"epub": {
						"id": "sound",
						"label": "sound"
					}
				},
				{
					"epub": {
						"id": "noSoundHazard",
						"label": "no sound risk"
					}
				},
				{
					"epub": {
						"id": "unknownSoundHazard",
						"label": "sound risk unknown"
					}
				}
			],
			"documentation": {
				"en": "https://www.w3.org/TR/epub-a11y-tech-11/#meta-004"
			}
		},
		{
			"id": "accessMode",
			"type": "checkbox",
			"required": true,
			"name": {
				"en": "Access Modes"
			},
			"values": [
				{
					"epub": {
						"id": "auditory",
						"label": "auditory"
					}
				},
				{
					"epub": {
						"id": "tactile",
						"label": "tactile"
					}
				},
				{
					"epub": {
						"id": "textual",
						"label": "textual"
					}
				},
				{
					"epub": {
						"id": "visual",
						"label": "visual"
					}
				}
			],
			"documentation": {
				"en": "https://www.w3.org/TR/epub-a11y-tech-11/#meta-001"
			}
		},
		{
			"id": "accessModeSufficient",
			"type": "fieldset",
			"required": false,
			"name": {
				"en": "Sufficient Access Modes"
			},
			"addMoreValues": {
    			"id": "add-sufficient",
    			"label": {
    				"en": "Add another set"
    			}
			},
			"documentation": {
				"en": "https://www.w3.org/TR/epub-a11y-tech-11/#meta-002"
			}
		},
		{
			"id": "accessibilitySummary",
			"type": "textarea",
			"required": false,
			"name": {
				"en": "Accessibility Summary"
			},
			"autoPopulate": {
				"id": "add-summary",
				"label": {
					"en": "Suggest a summary"
				}
			},
			"documentation": {
				"en": "https://www.w3.org/TR/epub-a11y-tech-11/#meta-005"
			},
			"onix": {
				"id": "00",
				"name": "Accessibility Summary"
			}
		}
	]
}
