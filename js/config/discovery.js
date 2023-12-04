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
					"id": "alternativeText",
					"label": {
						"en": "alternative text"
					}
				},
				{
					"id": "annotations",
					"label": {
						"en": "annotations"
					}
				},
				{
					"id": "ARIA",
					"label": {
						"en": "ARIA roles"
					}
				},
				{
					"id": "audioDescription",
					"label": {
						"en": "audio descriptions"
					}
				},
				{
					"id": "braille",
					"label": {
						"en": "braille"
					}
				},
				{
					"id": "ChemML",
					"label": {
						"en": "ChemML"
					}
				},
				{
					"id": "closedCaptions",
					"label": {
						"en": "closed captions"
					}
				},
				{
					"id": "describedMath",
					"label": {
						"en": "described math"
					}
				},
				{
					"id": "displayTransformability",
					"label": {
						"en": "display transformability"
					}
				},
				{
					"id": "highContrastAudio",
					"label": {
						"en": "high contrast audio"
					}
				},
				{
					"id": "highContrastDisplay",
					"label": {
						"en": "high contrast display"
					}
				},
				{
					"id": "index",
					"label": {
						"en": "index"
					}
				},
				{
					"id": "largePrint",
					"label": {
						"en": "large print"
					}
				},
				{
					"id": "latex",
					"label": {
						"en": "latex"
					}
				},
				{
					"id": "longDescription",
					"label": {
						"en": "long descriptions"
					}
				},
				{
					"id": "MathML",
					"label": {
						"en": "MathML"
					}
				},
				{
					"id": "none",
					"label": {
						"en": "none"
					}
				},
				{
					"id": "openCaptions",
					"label": {
						"en": "open captions"
					}
				},
				{
					"id": "pageBreakMarkers",
					"label": {
						"en": "page break markers"
					}
				},
				{
					"id": "pageNavigation",
					"label": {
						"en": "page navigation"
					}
				},
				{
					"id": "readingOrder",
					"label": {
						"en": "reading order"
					}
				},
				{
					"id": "rubyAnnotations",
					"label": {
						"en": "ruby annotations"
					}
				},
				{
					"id": "signLanguage",
					"label": {
						"en": "sign language"
					}
				},
				{
					"id": "structuralNavigation",
					"label": {
						"en": "structural navigation"
					}
				},
				{
					"id": "synchronizedAudioText",
					"label": {
						"en": "synchronized audio text"
					}
				},
				{
					"id": "tableOfContents",
					"label": {
						"en": "table of contents"
					}
				},
				{
					"id": "tactileGraphic",
					"label": {
						"en": "tactile graphic"
					}
				},
				{
					"id": "tactileObject",
					"label": {
						"en": "tactile object"
					}
				},
				{
					"id": "timingControl",
					"label": {
						"en": "timing control"
					}
				},
				{
					"id": "transcript",
					"label": {
						"en": "transcript"
					}
				},
				{
					"id": "ttsMarkup",
					"label": {
						"en": "text-to-speech markup"
					}
				},
				{
					"id": "unknown",
					"label": {
						"en": "unknown"
					}
				},
				{
					"id": "unlocked",
					"label": {
						"en": "unlocked"
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
					"id": "flashing",
					"label": {
						"en": "flashing"
					}
				},
				{
					"id": "noFlashingHazard",
					"label": {
						"en": "no flashing risk"
					}
				},
				{
					"id": "unknownFlashingHazard",
					"label": {
						"en": "flashing risk unknown"
					}
				},
				{
					"id": "none",
					"label": {
						"en": "no hazards"
					}
				},
				{
					"id": "motionSimulation",
					"label": {
						"en": "motion simulation"
					}
				},
				{
					"id": "noMotionSimulationHazard",
					"label": {
						"en": "no motion risk"
					}
				},
				{
					"id": "unknownMotionSimulationHazard",
					"label": {
						"en": "motion risk unknown"
					}
				},
				{
					"id": "unknown",
					"label": {
						"en": "hazards not known"
					}
				},
				{
					"id": "sound",
					"label": {
						"en": "sound"
					}
				},
				{
					"id": "noSoundHazard",
					"label": {
						"en": "no sound risk"
					}
				},
				{
					"id": "unknownSoundHazard",
					"label": {
						"en": "sound risk unknown"
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
					"id": "auditory",
					"label": {
						"en": "auditory"
					}
				},
				{
					"id": "tactile",
					"label": {
						"en": "tactile"
					}
				},
				{
					"id": "textual",
					"label": {
						"en": "textual"
					}
				},
				{
					"id": "visual",
					"label": {
						"en": "visual"
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
			}
		}
	]
}
