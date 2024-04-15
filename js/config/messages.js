
var smart_ui = {
	"buttons": {
		"save": {
			"en": "Save"
		},
		"close": {
			"en": "Close"
		}
	},
	"save": {
		"first": {
			"en": "This evaluation has not been saved. It cannot be resumed if you leave without saving."
		},
		"changes": {
			"en": "You appear to have unsaved changes."
		}
	},
	"eval": {
		"clean": {
			"en": "No errors or warnings found."
		},
		"error": {
			"en": "Evaluation contains errors or warnings.\n\nPlease see the error panel for more information."
		}
	},
	"evalTitle": {
		"en": "Please specify a title for the new evaluation:"
	},
	"evalDelete": {
		"en": "You are about to permanently delete the evaluation."
	},
	"evalDeleteStored": {
		"en": "You are about to delete the stored evaluation data from the server."
	},
	"noUndo": {
		"en": "This action cannot be undone.\n\nClick Ok to continue."
	},
	"historyTable": {
		"searchLabel": {
			"en": "Find evaluation"
		},
		"searchPlaceholder": {
			"en": "Enter a publication title"
		},
		"emptyTable": {
			"en": "No evaluations initiated."
		}
	},
	"a11yProperties": {
		"summary": {
			"en": "Accessibility Summary"
		},
		"features": {
			"en": "Accessibility Features"
		},
		"hazards": {
			"en": "Accessibility Hazards"
		},
		"modes": {
			"en": "Access Modes"
		},
		"ams": {
			"en": "Sufficient Mode(s)"
		},
		"evaluator": {
			"en": "Evaluated By"
		}
	},
	"manage": {
		"serverError": {
			"unknown": {
				"en": "Sorry, an unexpected error occurred. Please try again."
			},
			"contact": {
				"en": "Sorry, an error occurred contacting the server. Please try again."
			}
		}
	},
	"ace": {
		"contentType": {
			"images": {
				"en": "images"
			},
			"scripting": {
				"en": "scripting"
			},
			"audio": {
				"en": "audio"
			},
			"video": {
				"en": "video"
			},
			"pagebreaks": {
				"en": "page breaks"
 			},
 			"overlays": {
 				"en": "media overlays"
 			}
		},
		"load": {
			"hasConformsTo": {
				"en": "This publication already specifies the conformance string:\n\n%%conformance_url%%\n\nClick Ok to set the success criteria to pass this standard or Cancel to start a new evaluation."
			},
			"success": {
				"en": "Ace report successfully imported!"
			},
			"disabled": {
				"en": "The following content types were not found in the publication:"
			},
			"reenable": {
				"en": "Checks related to these types have been turned off. To re-enable these checks, see the Conformance Verification tab."
			},
			"a11yMetadata": {
				"en": "The following accessibility metadata was set based on the Ace report:"
			},
			"verifyMetadata": {
				"en": "Verify the accuracy of these assumptions in the Discovery Metadata tab."
			},
			"unknownFeatures": {
				"en": "The following accessibility features were found in the metadata but do not match known values:"
			},
			"obsoleteFeatures": {
				"en": "The following accessibility features are no longer recommended (the values in parentheses have been used instead):"
			},
			"verifyFeatures": {
				"en": "Verify these features are not typos or invalid."
			},
			"inferMetadata": {
				"en": "This publication does not contain any accessibility metadata.\n\nWould you like the SMART tool to attempt to infer applicable metadata?"
			}
		},
		"error": {
			"accessMode": {
				"en": "The schema:accessMode property is not set."
			},
			"accessibilityFeature": {
				"en": "The schema:accessibilityFeature property is not set."
			},
			"accessibilityHazard": {
				"en": "The schema:accessibilityHazard property is not set."
			},
			"accessibilitySummary": {
				"en": "The schema:accessibilitySummary property is not set."
			}
		}
	},
	"pubinfo": {
		"required_fields": {
			"title": {
				"en": "The title"
			},
			"modified": {
				"en": "The last modified date"
			}
		}
	},
	"discovery": {
		"replaceSummary": {
			"en": "There already appears to be a summary. Click Ok to replace."
		},
		"newFeatureName": {
			"en": "Enter the accessibility feature as it will appear in the metadata:"
		},
		"featureExists": {
			"en": "Feature already exists. Unable to add."
		},
		"invalidFeature": {
			"en": "Invalid feature value. Values must be at least one character in length."
		},
		"generateSummary": {
			"incomplete": {
				"en": "This EPUB Publication has not been fully evaluated against the EPUB Accessibility %VER% specification."
			},
			"fail": {
				"en": "This EPUB Publication does not meet the requirements of the EPUB Accessibility %VER% specification."
			},
			"pass": {
				"en": "This EPUB Publication meets the requirements of the EPUB Accessibility %VER% specification"
			},
			"wcagLevel": {
				"en": "with conformance to WCAG %VER% Level"
			},
			"publication": {
				"en": "The publication"
			},
			"sufficientTranslation": {
				"auditory": {
					"en": "has pre-recorded narration"
				},
				"textual": {
					"en": "is screen reader friendly"
				}
			},
			"listItemCombine": {
				"en": "and"
			},
			"featureStart": {
				"en": "It includes"
			},
			"singleHazard": {
				"en": "The publication contains content that may present a %%val%% hazard."
			},
			"multiHazard": {
				"en": "The publication contains content that may present the following hazards:"
			}
		},
		"moreInfo": {
			"en": "How to specify "
		}
	},
	"conformance": {
		"status": {
			"incomplete": {
				"en": "Incomplete"
			},
			"fail": {
				"en": "Failed"
			},
			"pass": {
				"en": "Pass"
			},
			"epub10": {
				"en": "EPUB Accessibility 1.0"
			},
			"epub11": {
				"en": "EPUB Accessibility 1.1"
			},
			"wcag20": {
				"en": "WCAG 2.0"
			},
			"wcag21": {
				"en": "WCAG 2.1"
			},
			"wcag22": {
				"en": "WCAG 2.2"
			},
			"a": {
				"en": "Level A"	
			},
			"aa": {
				"en": "Level AA"
			}
		},
		"result": {
			"unverified": {
				"en": "Unverified"
			},
			"pass": {
				"en": "Pass"
			},
			"fail": {
				"en": "Fail"
			},
			"na": {
				"en": "N/A"
			},
			"obsolete": {
				"en": "Obsolete"
			}
		},
		"level": {
			"en": "Level"
		},
		"note": {
			"en": "Note"
		},
		"labels": {
			"failure": {
				"en": "Describe failure(s):"
			},
			"note": {
				"en": "Add Note"
			},
			"status": {
				"en": "Status:"
			}
		},
		"kb": {
			"linkText": {
				"en": "Explainer page for success criterion "
			}
		},
		"changeSC": {
			"en": "This action will change all current status fields and cannot be undone.\n\nPlease confirm to continue."
		},
		"toggleDesc": {
			"hidden": {
				"en": "Descriptions are now hidden."
			},
			"visible": {
				"en": "Descriptions are now visible."
			}
		}
	},
	"reporting": {
		"confirm": {
			"en": "Your evaluation contains usage errors/warnings. These may be due to incomplete fields or incorrectly applied metadata.\n\nClick Ok to ignore these issues and generate the final report, or Cancel to exit and correct."
		},
		"title": {
			"en": "EPUB Accessibility Conformance Report for %%val%%"
		},
		"tabs": {
			"overview": {
				"en": "Overview"
			},
			"eval": {
				"en": "Evaluated Against"
			},
			"conformance": {
				"en": "Conformance"
			},
			"addinfo": {
				"en": "Additional Info"
			}
		},
		"sections": {
			"stats": {
				"en": "Statistics"
			},
			"results": {
				"en": "Conformance Results"
			}
		},
		"table": {
			"headers": {
				"sc": {
					"en": "Success Criteria"
				},
				"level": {
					"en": "Level"
				},
				"result": {
					"en": "Result"
				}
			},
			"results": {
				"pass": {
					"en": "Pass"
				},
				"fail": {
					"en": "Fail"
				},
				"na": {
					"en": "Not Applicable"
				},
				"unchecked": {
					"en": "Not Checked"
				},
				"obsolete": {
					"en": "Obsolete"
				}
			}
		},
		"addinfo": {
			"format": {
				"en": "Format"
			},
			"id": {
				"en": "Identifier"
			},
			"modified": {
				"en": "Last Modified"
			},
			"published": {
				"en": "Published"
			},
			"desc": {
				"en": "Description"
			},
			"subject": {
				"en": "Subject"
			}
		},
		"unspecified": {
			"en": "not specified"
		}
	},
	"metaWizard": {
		"done": {
			"en": "The accessibility metadata fields have been successfully updated."
		}
	}
}






/* 
 * 
 * 
 * 
 * 
 * 
 * 						ERROR MESSAGES
 * 
 * 
 * 
 * 
 * 
 * 
 */




var smart_errors = {
	"uploadLimit": {
		"en": "You can only upload one report file. Please try again."
	},
	"noEvalTitle": {
		"en": "A new evaluation cannot be started without a title."
	},
	"unknown": {
		"en": "An unknown error occurred. Please report this problem if it persists."
	},
	"loadErrors": {
		"nojson": {
			"en": "Uploaded file did not contain JSON data or the data could not be read. Please try again."
		},
		"unknownload": {
			"en": "Uploaded file does not appear to be an Ace report. Please try again."
		},
		"unknownreload": {
			"en": "Uploaded file does not appear to be a previously saved report. Please try again."
		},
		"noreloadid": {
			"en": "Saved evaluation does not contain an identifier. Please reload from your evaluation history."
		},
		"uidselect": {
			"en": "An error occurred retrieving the unique identifier. Please try again."
		},
		"uidbind": {
			"en": "An error occurred checking the unique identifier. Please try again."
		},
		"uidexec": {
			"en": "An error occurred verifying the unique identifier. Please try again."
		},
		"notunique": {
			"en": "An evaluation has already been started with the same identifier. Each publication must have a unique identifier in its dc:identifier element. Please resume the existing report or correct the identifier and try again."
		},
		"newins": {
			"en": "Failed to add blank evaluation. Please try again."
		},
		"newbind": {
			"en": "Invalid data adding blank evaluation. Please try again."
		},
		"newexec": {
			"en": "Failed to register blank evaluation. Please try again."
		},
		"evalins": {
			"en": "Failed to add evaluation. Please try again."
		},
		"evalbind": {
			"en": "Invalid data adding evaluation. Please try again."
		},
		"evalexec": {
			"en": "Failed to register evaluation. Please try again."
		},
		"resselect": {
			"en": "An error occurred accessing the saved evaluation data. Please try again."
		},
		"resbind": {
			"en": "An error occurred preparing the saved evaluation data. Please try again."
		},
		"resexec": {
			"en": "An error occurred retrieving the saved evaluation data. Please try again."
		},
		"noaction": {
			"en": "The SMART interface cannot be loaded without an Ace report or saved evaluation. Please try again."
		},
		"noeval": {
			"en": "No data is available for the specified evaluation. Please try again."
		},
		"delfail": {
			"en": "Failed to delete evaluation. Please try again."
		},
		"recfail": {
			"en": "Failed to delete evaluation. Please return to the previous page and try again."
		},
		"noconfirm": {
			"en": "Failed to confirm report. Please try again."
		},
		"confconn": {
			"en": "Database is currently unavailable. Please try again."
		},
		"confprep": {
			"en": "An error occurred confirming the evaluation. Please try again."
		},
		"confbind": {
			"en": "An error occurred while preparing to confirm the evaluation. Please try again."
		},
		"confexec": {
			"en": "An error occurred retrieving confirmation information. Please try again."
		},
		"notitle": {
			"en": "Blank evaluations require a title. Please try again."
		},
		"idprep": {
			"en": "An error occurred checking the evaluation id. Please try again."
		},
		"idbind": {
			"en": "An error occurred verifying the evaluation id. Please try again."
		},
		"idexec": {
			"en": "An error occurred retrieving the evauation id. Please try again."
		},
		"noid": {
			"en": "The evaluation identifier does not match any evaluations for your account. The file could not be loaded."
		}
	},
	"ace": {
		"noData": {
			"en": "Ace report does not contain any data. Failed to load."
		}
	},
	"validation": {
		"general": {
			"noMetadata": {
				"en": "No metadata specified. Failed to generate."
			},
			"failure": {
				"en": "Metadata does not validate!\n\nClick Ok to generate anyway or Cancel to close this dialog and correct."
			}
		},
		"pubinfo": {
			"required": {
				"en": "%%val%% is a required field."
			},
			"noSeparator": {
				"en": "Missing a colon separator on line %%val%%."
			},
			"unverifiedSC": {
				"en": "Success criterion %%val%% is unverified."
			}
		},
		"discovery": {
			"accessibilityFeature": {
				"en": "At least one accessibility feature must be specified."
			},
			"accessibilityFeature_invalid": {
				"en": "The feature values 'unknown' and 'none' cannot be set when the Discovery Metadata success criterion passes."
			},
			"accessibilityFeature_none": {
				"en": "The 'none' and 'unknown' values cannot be used together or when other features are selected."
			},
			"accessibilityHazard": {
				"en": "A hazard indication is required. If uncertain whether there are hazards in the content, select the 'unknown' value."
			},
			"accessibilityHazard_none": {
				"en": "The 'none' and 'unknown' values cannot be used together or when other hazards are selected."
			},
			"accessibilityHazard_flashing": {
				"en": "The 'flashing' hazard cannot be set when 'no flashing risk' or 'unknown flashing risk' is selected."
			},
			"accessibilityHazard_motion": {
				"en": "The 'motion simulation' hazard cannot be set when 'no motion risk' or 'unknown motion risk' is selected."
			},
			"accessibilityHazard_sound": {
				"en": "The 'sound' hazard cannot be set when 'no sound risk' or 'unknown sound risk' is selected."
			},
			"accessibilityHazard_flashingneg": {
				"en": "The 'no flashing risk' value cannot be set when 'flashing risk unknown' is selected."
			},
			"accessibilityHazard_motionneg": {
				"en": "The 'no motion risk' value cannot be set when 'motion risk unknown' is selected."
			},
			"accessibilityHazard_soundneg": {
				"en": "The 'no sound risk' value cannot be set when 'sound risk unknown' is selected."
			},
			"accessMode": {
				"en": "At least one access mode must be selected."
			},
			"accessibilitySummary": {
				"en": "An accessibility summary is recommended."
			},
			"accessModeSufficient_missing": {
				"en": "Sufficient access mode '%%val%%' checked but is not listed as an access mode. It is not common for a publication to have a sufficient access mode that is not also an access mode."
			},
			"accessModeSufficient_none": {
				"en": "Sufficient access modes for reading the publication not specified."
			},
			"accessModeSufficient_duplicate": {
				"en": "Duplicate sets of sufficient access modes specified."
			}
		},
		"distribution": {
			"a11yConflict": {
				"en": "Publication cannot be marked both as conforming to accessibility standard(s) (values 01, 02, 03, or 04) and as inaccessible (09) or having an unknown accessibility status (08)."
			},
			"a11yDuplication": {
				"en": "Publication cannot be marked both as conforming to both Level A and AA of the EPUB Accessibility 1.0 specification."
			},
			"a11yMultipleLevel": {
				"en": "Multiple WCAG conformance levels specified."
			},
			"a11yMultipleWCAG": {
				"en": "Multiple WCAG conformance versions specified."
			},
			"a11yNoLevel": {
				"en": "When claiming conformance to EPUB Accessibility 1.1, the WCAG level must also be specified (code 84, 85, or 86)."
			},
			"a11yNoWCAG": {
				"en": "When claiming conformance to EPUB Accessibility 1.1, the version of WCAG must also be specified (code 80, 81, or 82)."
			},
			"eaaConflict": {
				"en": "Exemption to the European Accessibility Act should not be specified when also making an accessibility conformance claim."
			},
			"nonURL": {
				"en": "ONIX Field %%val%% must be a URL that starts with http:// or https://"
			}
		},
		"evaluation": {
			"failed": {
				"en": "Metadata failed validation.\n\nClick Ok to generate, or Cancel to review errors."
			},
			"noMetadata": {
				"en": "No metadata specified. Failed to generate."
			},
			"noCertifier": {
				"en": "Evaluator name is a required field."
			},
			"nonURL": {
				"en": "%%val%% should begin with http:// or https://"
			}
		}
	},
	"summaryGenerator": {
		"failed": {
			"en": "Sorry, it was not possible to create a summary for this publication from the available information.\n\nPlease refer to the help link in the summary field for more information."
		}
	}
}
