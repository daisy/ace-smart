var onix_meta = {
	"properties": [
		{
			"id": "00",
			"type": "textarea",
			"name": {
				"en": "Accessibility Summary"
			}
		},
		{
			"type": "checkbox",
			"name": {
				"en": "Check all applicable fields"
			},
			"values": [
				{
					"id": "01",
					"en": {
						"name": "LIA Compliance Scheme", 
						"desc": "(Proprietary scheme)"
					}
				},
				{
					"id": "02",
					"en": {
						"name": "EPUB Accessibility Specification 1.0 A",
						"desc": "Conforms with the requirements of EPUB Accessibility Spec 1.0 and WCAG level A. <ProductFormFeatureDescription> may carry a URL linking to a compliance report or certification provided by an independent third party certifier. In the absence of a URL, conformance with the requirements of the Accessibility Specification is self-certified by the publisherConforms with the requirements of EPUB Accessibility Spec 1.0 and WCAG level A. <ProductFormFeatureDescription> may carry a URL linking to a compliance report or certification provided by an independent third party certifier. In the absence of a URL, conformance with the requirements of the Accessibility Specification is self-certified by the publisher"
					},
					"optionalFields": ["ProductFormFeatureDescription"]
				},
				{
					"id": "03",
					"en": {
						"name": "EPUB Accessibility Specification 1.0 AA",
						"desc": "Conforms with the requirements of EPUB Accessibility Spec 1.0 and WCAG level AA. <ProductFormFeatureDescription> may carry a URL linking to a compliance report or certification provided by an independent third party certifier. In the absence of a URL, conformance with the requirements of the Accessibility Specification is self-certified by the publisher"
					},
					"optionalFields": ["ProductFormFeatureDescription"]
				},
				{
					"id": "04",
					"en": {
						"name": "EPUB Accessibility Specification 1.1",
						"desc": "Conforms with the requirements of EPUB Accessibility Spec v1.1 – see https://www.w3.org/TR/epub-a11y-11/. <ProductFormFeatureDescription> may carry a URL linking to a compliance report or certification provided by an independent third-party certifier. In the absence of a URL, conformance with the requirements of the Accessibility Specification is self- certified by the publisher. Use with other List 196 codes to indicate WCAG version and level, ARIA inclusion. Only for use in ONIX 3.0 or later"
					},
					"optionalFields": ["ProductFormFeatureDescription"]
				},
				{
					"id": "08",
					"en": {
						"name": "Unknown accessibility",
						"desc": "Product has not yet been assessed for accessibility, or no or insufficient accessibility information is provided. It should be treated as likely to be inaccessible (and also may not have been checked for hazards). <ProductFormFeatureDescription> may carry details of why the accessibility of the title is unknown. Only for use in ONIX 3.0 or later"
					},
					"optionalFields": ["ProductFormFeatureDescription"]
				},
				{
					"id": "09",
					"en": {
						"name": "Inaccessible, or known limited accessibility",
						"desc": "Known to lack significant features required for broad accessibility. Details of and reasons for limitations on accessibility can be given in <ProductFormFeatureDescription>. Only for use in ONIX 3.0 or later"
					},
					"optionalFields": ["ProductFormFeatureDescription"]
				},
				{
					"id": "10",
					"en": {
						"name": "No reading system accessibility options actively disabled (except)",
						"desc": "No accessibility features or content rendering options offered by the reading system, device or reading software (including but not limited to the ability to modify or choose text size or typeface, word and line spacing, zoom level, text or background color, or use of text-to-speech) are limited, disabled, overridden or otherwise unusable with the product EXCEPT – in ONIX 3 messages only – those specifically noted as subject to restriction or prohibition in <EpubUsageConstraint>. Note that provision of any significant part of the textual content as images (ie as pictures of text, rather than as ‘text-as-text’, and without any textual equivalent) or the application of some technical protection measures (DRM), inevitably prevents full use of these accessibility options. Code 10 means ‘this e-publication is accessible to the full extent that the file format and types of content allow, on a specific reading device, by default, without necessarily inluding any additions such as textual descriptions of images or enhanced navigation. Note that for reflowable e-books, this means code 36 also applies, although code 10 can also be used with accessible non-reflowable (fixed-format) e-publications and with audio material. Should be used with other codes that describe any additions to enhance the level of accessibility"
					}
				},
				{
					"id": "11",
					"en": {
						"name": "Table of contents navigation",
						"desc": "Table of contents allows direct (eg hyperlinked) access to all levels of text organization above individual paragraphs (eg to all sections and subsections) and to all tables, figures, illustrations etc. Non-textual items such as illustrations, tables, audio or video content may be directly accessible from the Table of contents, or from a similar List of illustrations, List of tables, etc"
					}
				},
				{
					"id": "12",
					"en": {
						"name": "Index navigation",
						"desc": "Index provides direct (eg hyperlinked) access to uses of the index terms in the document body"
					}
				},
				{
					"id": "13",
					"en": {
						"name": "Single logical reading order",
						"desc": "All or substantially all textual matter is arranged in a single logical reading order (including text that is visually presented as separate from the main text flow, eg in boxouts, captions, tables, footnotes, endnotes, citations, etc). Non-textual content is also linked from within this logical reading order. (Purely decorative non-text content can be ignored). All or substantially all audio content should also have a single logical ‘reading order’, which is the order the content should be presented to the listener"
					}
				},
				{
					"id": "14",
					"en": {
						"name": "Short alternative textual descriptions",
						"desc": "All or substantially all non-text content has short alternative (textual) descriptions, usually provided via alt attributes. Note this applies to normal images (eg photographs, charts and diagrams) and also to any embedded audio, video etc. Audio and video content should include alternative descriptions suitable for hearing-impaired as well as for visually-impaired readers. (Purely decorative non-text content can be ignored, but the accessibility of resources delivered via a network connection rather than as part of the e-publication package must be included)"
					}
				},
				{
					"id": "15",
					"en": {
						"name": "Full alternative textual descriptions",
						"desc": "All or substantially all non-text content has full alternative (textual) descriptions. Note this applies to normal images (eg photographs, charts and diagrams) and also to any embedded audio, video etc. Audio and video content should include full alternative descriptions (eg audio-described video) and transcript, subtitles or captions (whether closed or open) suitable for hearing-impaired as well as for visually-impaired readers. (Purely decorative non-text content can be ignored, but the accessibility of resources delivered via a network connection rather than as part of the e-publication package must be included)"
					}
				},
				{
					"id": "16",
					"en": {
						"name": "Visualised data also available as non-graphical data",
						"desc": "Where data visualisations are provided (eg graphs and charts), the underlying data is also available in non-graphical (usually tabular, textual) form"
					}
				},
				{
					"id": "17",
					"en": {
						"name": "Accessible math content as MathML",
						"desc": "Mathematical content such as equations is usable with assistive technology, through use of MathML. Semantic MathML is preferred but Presentational MathML is acceptable"
					}
				},
				{
					"id": "18",
					"en": {
						"name": "Accessible chemistry content as ChemML",
						"desc": "Chemistry content such as chemical formulae is usable with assistive technology, through use of ChemML"
					}
				},
				{
					"id": "19",
					"en": {
						"name": "Print-equivalent page numbering",
						"desc": "For a reflowable e-publication, contains references to the page numbering of an equivalent printed product."
					}
				},
				{
					"id": "20",
					"en": {
						"name": "Synchronised pre-recorded audio",
						"desc": "Text-synchronised pre-recorded audio narration (natural or synthesised voice) is included for substantially all textual matter, including all alternative descriptions, eg via a SMIL media overlay"
					}
				},
				{
					"id": "21",
					"en": {
						"name": "Text-to-speech hinting provided",
						"desc": "Text-to-speech has been optimised through provision of PLS lexicons, SSML or CSS Speech synthesis hints or other speech synthesis markup languages or hinting"
					}
				},
				{
					"id": "22",
					"en": {
						"name": "Language tagging provided",
						"desc": "The language of the text has been specified (eg via the HTML or XML lang attribute) to optimise text-to-speech (and other alternative renderings), both at whole document level and, where appropriate, for individual words, phrases or passages in a different language"
					}
				},
				{
					"id": "24",
					"en": {
						"name": "Dyslexia readability",
						"desc": "Specialised font, character and/or line spacing, justification and paragraph spacing, coloring and other options provided specifically to improve readability for dyslexic readers."
					}
				},
				{
					"id": "25",
					"en": {
						"name": "Use of color is not sole means of conveying information",
						"desc": "For readers with color vision deficiency, use of color (eg in diagrams, graphs and charts, in prompts or on buttons inviting a response) is not the sole means of graphical distinction or of conveying information. Only for use in ONIX 3.0 or later"
					}
				},
				{
					"id": "26",
					"en": {
						"name": "Use of high contrast between text and background color",
						"desc": "Body text is presented with a contrast ratio of at least 4.5:1 (or 3:1 for large/heading text). Only for use in ONIX 3.0 or later"
					}
				},
				{
					"id": "27",
					"en": {
						"name": "Use of high contrast between foreground and background audio",
						"desc": "Foreground audio content (eg voice) is presented with no or low background noise (eg ambient sounds, music), at least 20dB below the level of the foreground, or background noise can be switched off (eg via an alternative audio track). Brief and occasional sound effects may be as loud as foreground voice so long as they are isolated from the foreground. Only for use in ONIX 3.0 or later"
					}
				},
				{
					"id": "28",
					"en": {
						"name": "Full alternative audio descriptions",
						"desc": "All or substantially all non-text content has full alternative descriptions as pre-recorded audio. Note this applies to normal images (eg photographs, charts and diagrams) and also to any embedded video etc. Video content should include full alternative descriptions (eg audio-described video) and transcript, subtitles or captions (whether closed or open) suitable for hearing-impaired as well as for visually-impaired readers. (Purely decorative non-text content can be ignored, but the accessibility of resources delivered via a network connection rather than as part of the e-publication package must be included). Only for use in ONIX 3.0 or later"
					}
				},
				{
					"id": "29",
					"en": {
						"name": "Next / Previous structural navigation",
						"desc": "All levels of heading and other structural elements of the content are correctly marked up and (if applicable) numbered, to enable fast next heading / previous heading, next chapter / previous chapter navigation without returning to the table of contents. Only for use in ONIX 3.0 or later"
					}
				},
				{
					"id": "30",
					"en": {
						"name": "ARIA roles provided",
						"desc": "Accessible Rich Internet Applications (ARIA) roles are used to organize and improve the structural or landmark navigation of the publication (eg to identify key sections of the content and the purpose of hyperlinks). Only for use in ONIX 3.0 or later"
					}
				},
				{
					"id": "31",
					"en": {
						"name": "Accessible controls provided",
						"desc": "Where interactive content is included in the product, controls are labelled to make their use clear. Only for use in ONIX 3.0 or later"
					}
				},
				{
					"id": "32",
					"en": {
						"name": "Landmark navigation",
						"desc": "E-publication includes basic landmark navigation (usually less detailed than TOC-based navigation). Only for use in ONIX 3.0 or later"
					}
				},
				{
					"id": "34",
					"en": {
						"name": "Accessible chemistry content (as MathML)",
						"desc": "Only for use in ONIX 3.0 or later"
					}
				},
				{
					"id": "35",
					"en": {
						"name": "Accessible math content (as LaTeX)",
						"desc": "Only for use in ONIX 3.0 or later"
					}
				},
				{
					"id": "36",
					"en": {
						"name": "All textual content can be modified",
						"desc": "E-publication does not restrict the ability of users to modify and reflow the display of any textual content to the full extent allowed by the reading system (eg to change the text size or typeface, line height and word spacing, colors). Only for use in ONIX 3.0 or later."
					}
				},
				{
					"id": "37",
					"en": {
						"name": "Use of ultra-high contrast between text foreground and background",
						"desc": "Body text is presented with a contrast ratio of at least 7:1 (or 4.5:1 for large/heading text). Only for use in ONIX 3.0 or later	"
					}
				},
				{
					"id": "38",
					"en": {
						"name": "Unusual words or abbreviations explained",
						"desc": "E-publication provides explanations for unusual words, abbreviations, acronyms, idioms, jargon in an accessible form, such as glossaries, scripted pop-ups. Only for use in ONIX 3.0 or later"
					}
				},
				{
					"id": "39",
					"en": {
						"name": "Supplementary material to an audiobook is accessible",
						"desc": "All supplementary visual or textual material necessary for understanding of an audiobook, is available as pre-recorded audio, or has full alternative text that can be read via text-to- speech. Only for use in ONIX 3.0 or later"
					}
				},
				{
					"id": "40",
					"en": {
						"name": "Link purposes clear",
						"desc": "Where links are included in the product, the purpose or functionality of each link is apparent from the link text alone – or where it is unclear, separate link descriptions provided). Only for use in ONIX 3.0 or later"
					}
				},
				{
					"id": "51",
					"en": {
						"name": "All non-decorative content supports reading via pre-recorded audio",
						"desc": "All contents of the digital publication necessary to use and understanding, including any text, images (via alternative descriptions), video (via audio description) is fully accessible via suitable audio reproduction. The entire publication can be navigated and ‘read’ using only pre-recorded sound, and does not require visual or tactile perception. NB this implies that all <ProductContent> types listed can be accessed without sight. Only for use in ONIX 3.0 or later"
					}
				},
				{
					"id": "52",
					"en": {
						"name": "All non-decorative content supports reading without sight",
						"desc": "Sometimes termed ‘screen reader-friendly’, and fully supports multiple forms of non-visual reading. All contents of the digital publication necessary to use and understanding, including text, images (via their alternative descriptions), audio and video material (via their transcripts, descriptions, captions or subtitles) are fully accessible via suitable reading devices, for example text-to-speech screen readers or tactile reading devices (‘Braille displays’), and nothing in the digital publication prevents or blocks the use of alternative reading modes. The entire publication can be navigated and ‘read’ using only text rendered via sound or touch, and does not require visual perception. NB this implies that all <ProductContent> types listed can be accessed without sight. Only for use in ONIX 3.0 or later"
					}
				},
				{
					"id": "75",
					"en": {
						"name": "EEA Exception1 – Micro-enterprises",
						"desc": "Digital product falls under European Accessibility Act exception for Micro-enterprises (as defined by current regulations). The product may not have to comply with requirements of the EAA if the publisher is a micro-enterprise. <ProductFormFeatureDescription> may carry details justifying the exception claim. Use for example with code 09. Only for use in ONIX 3.0 or later"
					},
					"optionalFields": ["ProductFormFeatureDescription"]
				},
				{
					"id": "76",
					"en": {
						"name": "EAA exception 2 – Disproportionate burden",
						"desc": "Digital product falls under European Accessibility Act exception for Disproportionate burden (as defined by current regulations). The product may not have to comply with requirements of the EAA if doing so would financially overburden the publisher. <ProductFormFeatureDescription> may carry details justifying the exception claim. Use for example with code 09. Only for use in ONIX 3.0 or later"
					},
					"optionalFields": ["ProductFormFeatureDescription"]
				},
				{
					"id": "77",
					"en": {
						"name": "EAA exception 3 – Fundamental modification",
						"desc": "Digital product falls under European Accessibility Act exception for Fundamental modification (as defined by current regulations). The product may not have to comply with requirements of the EAA if doing so requires a fundamental modification of the nature of the product or service. <ProductFormFeatureDescription> may carry details justifying the exception claim. Use for example with code 09. Only for use in ONIX 3.0 or later"
					},
					"optionalFields": ["ProductFormFeatureDescription"]
				},
				{
					"id": "80",
					"en": {
						"name": "WCAG v2.0",
						"desc": "Conforms with the requirements of WCAG version 2.0 – see https://www.w3.org/WAI/standards-guidelines/wcag/. <ProductFormFeatureDescription> may carry a URL linking to a compliance report or certification provided by an independent third-party certifier. In the absence of a URL, conformance with the requirements of the Specification is self-certified by the publisher. Should be used in combination with code 04. Only for use in ONIX 3.0 or later"
					},
					"optionalFields": ["ProductFormFeatureDescription"]
				},
				{
					"id": "81",
					"en": {
						"name": "WCAG v2.1",
						"desc": "Only for use in ONIX 3.0 or later"
					},
					"optionalFields": ["ProductFormFeatureDescription"]
				},
				{
					"id": "82",
					"en": {
						"name": "WCAG v2.2",
						"desc": "Only for use in ONIX 3.0 or later"
					},
					"optionalFields": ["ProductFormFeatureDescription"]
				},
				{
					"id": "84",
					"en": {
						"name": "WCAG level A",
						"desc": "Conforms with the requirements of WCAG level A. <ProductFormFeatureDescription> may carry a URL linking to a compliance report or certification provided by an independent third-party certifier. In the absence of a URL, conformance with the requirements of the Specification is self-certified by the publisher. Should be used in combination with code 04. Only for use in ONIX 3.0 or later"
					},
					"optionalFields": ["ProductFormFeatureDescription"]
				},
				{
					"id": "85",
					"en": {
						"name": "WCAG level AA",
						"desc": "Only for use in ONIX 3.0 or later"
					},
					"optionalFields": ["ProductFormFeatureDescription"]
				},
				{
					"id": "86",
					"en": {
						"name": "WCAG level AAA",
						"desc": "Only for use in ONIX 3.0 or later"
					},
					"optionalFields": ["ProductFormFeatureDescription"]
				}
			]
		},
		{
			"id": "93",
			"type": "text",
			"name": {
				"en": "Compliance certification by"
			}
		},
		{
			"id": "94",
			"type": "text",
			"name": {
				"en": "Compliance web page for detailed accessibility information"
			}
		},
		{
			"id": "95",
			"type": "text",
			"name": {
				"en": "Trusted intermediary’s web page for detailed accessibility information"
			}
		},
		{
			"id": "96",
			"type": "text",
			"name": {
				"en": "Publisher’s web page for detailed accessibility information"
			}
		},
		{
			"id": "97",
			"type": "text",
			"name": {
				"en": "Compatibility tested"
			}
		},
		{
			"id": "98",
			"type": "text",
			"name": {
				"en": "Trusted Intermediary contact"
			}
		},
		{
			"id": "99",
			"type": "text",
			"name": {
				"en": "Publisher contact for further accessibility information"
			}
		}
	]
}