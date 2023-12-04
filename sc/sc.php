<?php

	class SMART_SC_GENERATOR {
			
		function __construct() {
		}
		
		private $sc = [
			"sc-1.1.1" => [
				"ref" => "non-text-content",
				"version" => "2.0",
				"level" => "a",
		        "name" =>  [
					"en" => "Non-text Content"
				]
			],
			
			"sc-1.2.1" => [
				"ref" => "audio-only-and-video-only-prerecorded",
				"version" => "2.0",
				"level" => "a",
		        "name" => [
					"en" => "Audio-only and Video-only (Prerecorded)"
				]
			],
			
			"sc-1.2.2" => [
				"ref" => "captions-prerecorded",
				"version" => "2.0",
				"level" => "a",
		        "name" => [
					"en" => "Captions (Prerecorded)"
				]
			],
			
			"sc-1.2.3" => [
				"ref" => "audio-description-or-media-alternative-prerecorded",
				"version" => "2.0",
				"level" => "a",
		        "name" => [
					"en" => "Audio Description or Media Alternative (Prerecorded)"
				]
			],
			
			"sc-1.2.4" => [
				"ref" => "captions-live",
				"version" => "2.0",
				"level" => "aa",
		        "name" => [
					"en" => "Captions (Live)"
				]
			],
			
			"sc-1.2.5" => [
				"ref" => "audio-description-prerecorded",
				"version" => "2.0",
				"level" => "aa",
		        "name" => [
					"en" => "Audio Description (Prerecorded)"
				]
			],
			
			"sc-1.2.6" => [
				"ref" => "sign-language-prerecorded",
				"version" => "2.0",
				"level" => "aaa",
		        "name" => [
					"en" => "Sign Language (Prerecorded)"
				]
			],
			
			"sc-1.2.7" => [
				"ref" => "extended-audio-description-prerecorded",
				"version" => "2.0",
				"level" => "aaa",
		        "name" => [
					"en" => "Extended Audio Description (Prerecorded)"
				]
			],
			
			"sc-1.2.8" => [
				"ref" => "media-alternative-prerecorded",
				"version" => "2.0",
				"level" => "aaa",
		        "name" => [
					"en" => "Media Alternative (Prerecorded)"
				]
			],
			
			"sc-1.2.9" => [
				"ref" => "audio-only-live",
				"version" => "2.0",
				"level" => "aaa",
		        "name" => [
					"en" => "Audio-only (Live)"
				]
			],
		
			"sc-1.3.1" => [
				"ref" => "info-and-relationships",
				"version" => "2.0",
				"level" => "a",
		        "name" => [
					"en" => "Info and Relationships"
				]
			],
			
			"sc-1.3.2" => [
				"ref" => "meaningful-sequence",
				"version" => "2.0",
				"level" => "a",
		        "name" => [
					"en" => "Meaningful Sequence"
				]
			],
			
			"sc-1.3.3" => [
				"ref" => "sensory-characteristics",
				"version" => "2.0",
				"level" => "a",
		        "name" => [
					"en" => "Sensory Characteristics"
				]
			],
			
			"sc-1.3.4" => [
				"ref" => "orientation",
				"version" => "2.1",
				"level" => "aa",
		        "name" => [
					"en" => "Orientation"
				]
			],
			
			"sc-1.3.5" => [
				"ref" => "identify-input-purpose",
				"version" => "2.1",
				"level" => "aa",
		        "name" => [
					"en" => "Identify Input Purpose"
				]
			],
			
			"sc-1.3.6" => [
				"ref" => "identify-purpose",
				"version" => "2.1",
				"level" => "aaa",
		        "name" => [
					"en" => "Identify Purpose"
				]
			],
		
			"sc-1.4.1" => [
				"ref" => "use-of-color",
				"version" => "2.0",
				"level" => "a",
		        "name" => [
					"en" => "Use of Color"
				]
			],
			
			"sc-1.4.2" => [
				"ref" => "audio-control",
				"version" => "2.0",
				"level" => "a",
		        "name" => [
					"en" => "Audio Control"
				]
			],
			
			"sc-1.4.3" => [
				"ref" => "contrast-minimum",
				"version" => "2.0",
				"level" => "aa",
		        "name" => [
					"en" => "Contrast (Minimum)"
				]
			],
			
			"sc-1.4.4" => [
				"ref" => "resize-text",
				"version" => "2.0",
				"level" => "aa",
		        "name" => [
					"en" => "Resize text"
				]
			],
			
			"sc-1.4.5" => [
				"ref" => "images-of-text",
				"version" => "2.0",
				"level" => "aa",
		        "name" => [
					"en" => "Images of Text"
				]
			],
			
			"sc-1.4.6" => [
				"ref" => "contrast-enhanced",
				"version" => "2.0",
				"level" => "aaa",
		        "name" => [
					"en" => "Contrast (Enhanced)"
				]
			],
			
			"sc-1.4.7" => [
				"ref" => "low-or-no-background-audio",
				"version" => "2.0",
				"level" => "aaa",
		        "name" => [
					"en" => "Low or No Background Audio"
				]
			],
			
			"sc-1.4.8" => [
				"ref" => "visual-presentation",
				"version" => "2.0",
				"level" => "aaa",
		        "name" => [
					"en" => "Visual Presentation"
				]
			],
			
			"sc-1.4.9" => [
				"ref" => "images-of-text-no-exception",
				"version" => "2.0",
				"level" => "aaa",
		        "name" => [
					"en" => "Images of Text (No Exception)"
				]
			],
		
			"sc-1.4.10" => [
				"ref" => "reflow",
				"version" => "2.1",
				"level" => "aa",
		        "name" => [
					"en" => "Reflow"
				]
			],
	
			"sc-1.4.11" => [
				"ref" => "non-text-contrast",
				"version" => "2.1",
				"level" => "aa",
		        "name" => [
					"en" => "Non-text Contrast"
				]
			],
	
			"sc-1.4.12" => [
				"ref" => "text-spacing",
				"version" => "2.1",
				"level" => "aa",
		        "name" => [
					"en" => "Text Spacing"
				]
			],
	
			"sc-1.4.13" => [
				"ref" => "content-on-hover-or-focus",
				"version" => "2.1",
				"level" => "aa",
		        "name" => [
					"en" => "Content on Hover or Focus"
				]
			],
			
			"sc-2.1.1" => [
				"ref" => "keyboard",
				"version" => "2.0",
				"level" => "a",
		        "name" => [
					"en" => "Keyboard"
				]
			],
			
			"sc-2.1.2" => [
				"ref" => "no-keyboard-trap",
				"version" => "2.0",
				"level" => "a",
		        "name" => [
					"en" => "No Keyboard Trap"
				]
			],
			
			"sc-2.1.3" => [
				"ref" => "keyboard-no-exception",
				"version" => "2.0",
				"level" => "aaa",
		        "name" => [
					"en" => "Keyboard (No Exception)"
				]
			],
		
			"sc-2.1.4" => [
				"ref" => "character-key-shortcuts",
				"version" => "2.1",
				"level" => "a",
		        "name" => [
					"en" => "Character Key Shortcuts"
				]
			],
			
			"sc-2.2.1" => [
				"ref" => "timing-adjustable",
				"version" => "2.0",
				"level" => "a",
		        "name" => [
					"en" => "Timing Adjustable"
				]
			],
			
			"sc-2.2.2" => [
				"ref" => "pause-stop-hide",
				"version" => "2.0",
				"level" => "a",
		        "name" => [
					"en" => "Pause, Stop, Hide"
				]
			],
			
			"sc-2.2.3" => [
				"ref" => "no-timing",
				"version" => "2.0",
				"level" => "aaa",
		        "name" => [
					"en" => "No Timing"
				]
			],
			
			"sc-2.2.4" => [
				"ref" => "interruptions",
				"version" => "2.0",
				"level" => "aaa",
		        "name" => [
					"en" => "Interruptions"
				]
			],
			
			"sc-2.2.5" => [
				"ref" => "re-authenticating",
				"version" => "2.0",
				"level" => "aaa",
		        "name" => [
					"en" => "Re-authenticating"
				]
			],
		
			"sc-2.2.6" => [
				"ref" => "timeouts",
				"version" => "2.1",
				"level" => "aaa",
		        "name" => [
					"en" => "Timeouts"
				]
			],
			
			"sc-2.3.1" => [
				"ref" => "three-flashes-or-below-threshold",
				"version" => "2.0",
				"level" => "a",
		        "name" => [
					"en" => "Three Flashes or Below Threshold"
				]
			],
			
			"sc-2.3.2" => [
				"ref" => "three-flashes",
				"version" => "2.0",
				"level" => "aaa",
		        "name" => [
					"en" => "Three Flashes"
				]
			],
		
			"sc-2.3.3" => [
				"ref" => "animation-from-interactions",
				"version" => "2.1",
				"level" => "aaa",
		        "name" => [
					"en" => "Animation from Interactions"
				]
			],
			
			"sc-2.4.1" => [
				"ref" => "bypass-blocks",
				"version" => "2.0",
				"level" => "a",
		        "name" => [
					"en" => "Bypass Blocks"
				]
			],
			
			"sc-2.4.2" => [
				"ref" => "page-titled",
				"version" => "2.0",
				"level" => "a",
		        "name" => [
					"en" => "Page Titled"
				]
			],
			
			"sc-2.4.3" => [
				"ref" => "focus-order",
				"version" => "2.0",
				"level" => "a",
		        "name" => [
					"en" => "Focus Order"
				]
			],
			
			"sc-2.4.4" => [
				"ref" => "link-purpose-in-context",
				"version" => "2.0",
				"level" => "a",
		        "name" => [
					"en" => "Link Purpose (In Context)"
				]
			],
			
			"sc-2.4.5" => [
				"ref" => "multiple-ways",
				"version" => "2.0",
				"level" => "aa",
		        "name" => [
					"en" => "Multiple Ways"
				]
			],
			
			"sc-2.4.6" => [
				"ref" => "headings-and-labels",
				"version" => "2.0",
				"level" => "aa",
		        "name" => [
					"en" => "Headings and Labels"
				]
			],
			
			"sc-2.4.7" => [
				"ref" => "focus-visible",
				"version" => "2.0",
				"level" => "aa",
		        "name" => [
					"en" => "Focus Visible"
				]
			],
			
			"sc-2.4.8" => [
				"ref" => "location",
				"version" => "2.0",
				"level" => "aaa",
		        "name" => [
					"en" => "Location"
				]
			],
			
			"sc-2.4.9" => [
				"ref" => "link-purpose-link-only",
				"version" => "2.0",
				"level" => "aaa",
		        "name" => [
					"en" => "Link Purpose (Link Only)"
				]
			],
			
			"sc-2.4.10" => [
				"ref" => "section-headings",
				"version" => "2.0",
				"level" => "aaa",
		        "name" => [
					"en" => "Section Headings"
				]
			],
			
			"sc-2.4.11" => [
				"ref" => "focus-not-obscured-minimum",
				"version" => "2.2",
				"level" => "aa",
		        "name" => [
					"en" => "Focus Not Obscured (Minimum)"
				]
			],
			
			"sc-2.4.12" => [
				"ref" => "focus-not-obscured-enhanced",
				"version" => "2.2",
				"level" => "aaa",
		        "name" => [
					"en" => "Focus Not Obscured (Enhanced)"
				]
			],
			
			"sc-2.4.13" => [
				"ref" => "focus-appearance",
				"version" => "2.2",
				"level" => "aaa",
		        "name" => [
					"en" => "Focus Appearance"
				]
			],
			
			"sc-2.5.1" => [
				"ref" => "pointer-gestures",
				"version" => "2.1",
				"level" => "a",
		        "name" => [
					"en" => "Pointer Gestures"
				]
			],
			
			"sc-2.5.2" => [
				"ref" => "pointer-cancellation",
				"version" => "2.1",
				"level" => "a",
		        "name" => [
					"en" => "Pointer Cancellation"
				]
			],
			
			"sc-2.5.3" => [
				"ref" => "label-in-name",
				"version" => "2.1",
				"level" => "a",
		        "name" => [
					"en" => "Label in Name"
				]
			],
			
			"sc-2.5.4" => [
				"ref" => "motion-actuation",
				"version" => "2.1",
				"level" => "a",
		        "name" => [
					"en" => "Motion Actuation"
				]
			],
			
			"sc-2.5.5" => [
				"ref" => "target-size",
				"version" => "2.1",
				"level" => "aaa",
		        "name" => [
					"en" => "Target Size (Enhanced)"
				]
			],
			
			"sc-2.5.6" => [
				"ref" => "concurrent-input-mechanisms",
				"version" => "2.1",
				"level" => "aaa",
		        "name" => [
					"en" => "Concurrent Input Mechanisms"
				]
			],
			
			"sc-2.5.7" => [
				"ref" => "dragging-movements",
				"version" => "2.2",
				"level" => "aa",
		        "name" => [
					"en" => "Dragging Movements"
				]
			],
			
			"sc-2.5.8" => [
				"ref" => "target-size-minimum",
				"version" => "2.2",
				"level" => "aa",
		        "name" => [
					"en" => "Target Size (Minimum)"
				]
			],
			
			"sc-3.1.1" => [
				"ref" => "language-of-page",
				"version" => "2.0",
				"level" => "a",
		        "name" => [
					"en" => "Language of Page"
				]
			],
			
			"sc-3.1.2" => [
				"ref" => "language-of-parts",
				"version" => "2.0",
				"level" => "aa",
		        "name" => [
					"en" => "Language of Parts"
				]
			],
			
			"sc-3.1.3" => [
				"ref" => "unusual-words",
				"version" => "2.0",
				"level" => "aaa",
		        "name" => [
					"en" => "Unusual Words"
				]
			],
			
			"sc-3.1.4" => [
				"ref" => "abbreviations",
				"version" => "2.0",
				"level" => "aaa",
		        "name" => [
					"en" => "Abbreviations"
				]
			],
			
			"sc-3.1.5" => [
				"ref" => "reading-level",
				"version" => "2.0",
				"level" => "aaa",
		        "name" => [
					"en" => "Reading Level"
				]
			],
			
			"sc-3.1.6" => [
				"ref" => "pronunciation",
				"version" => "2.0",
				"level" => "aaa",
		        "name" => [
					"en" => "Pronunciation"
				]
			],
			
			"sc-3.2.1" => [
				"ref" => "on-focus",
				"version" => "2.0",
				"level" => "a",
		        "name" => [
					"en" => "On Focus"
				]
			],
			
			"sc-3.2.2" => [
				"ref" => "on-input",
				"version" => "2.0",
				"level" => "a",
		        "name" => [
					"en" => "On Input"
				]
			],
			
			"sc-3.2.3" => [
				"ref" => "consistent-navigation",
				"version" => "2.0",
				"level" => "aa",
		        "name" => [
					"en" => "Consistent Navigation"
				]
			],
			
			"sc-3.2.4" => [
				"ref" => "consistent-identification",
				"version" => "2.0",
				"level" => "aa",
		        "name" => [
					"en" => "Consistent Identification"
				]
			],
			
			"sc-3.2.5" => [
				"ref" => "change-on-request",
				"version" => "2.0",
				"level" => "aaa",
		        "name" => [
					"en" => "Change on Request"
				]
			],
			
			"sc-3.2.6" => [
				"ref" => "consistent-help",
				"version" => "2.2",
				"level" => "a",
		        "name" => [
					"en" => "Consistent Help"
				]
			],
			
			"sc-3.3.1" => [
				"ref" => "error-identification",
				"version" => "2.0",
				"level" => "a",
		        "name" => [
					"en" => "Error Identification"
				]
			],
			
			"sc-3.3.2" => [
				"ref" => "labels-or-instructions",
				"version" => "2.0",
				"level" => "a",
		        "name" => [
					"en" => "Labels or Instructions"
				]
			],
			
			"sc-3.3.3" => [
				"ref" => "error-suggestion",
				"version" => "2.0",
				"level" => "aa",
		        "name" => [
					"en" => "Error Suggestion"
				]
			],
			
			"sc-3.3.4" => [
				"ref" => "error-prevention-legal-financial-data",
				"version" => "2.0",
				"level" => "aa",
		        "name" => [
					"en" => "Error Prevention (Legal, Financial, Data)"
				]
			],
			
			"sc-3.3.5" => [
				"ref" => "help",
				"version" => "2.0",
				"level" => "aaa",
		        "name" => [
					"en" => "Help"
				]
			],
			
			"sc-3.3.6" => [
				"ref" => "error-prevention-all",
				"version" => "2.0",
				"level" => "aaa",
		        "name" => [
					"en" => "Error Prevention (All)"
				]
			],
			
			"sc-3.3.7" => [
				"ref" => "accessible-authentication",
				"version" => "2.2",
				"level" => "aa",
		        "name" => [
					"en" => "Accessible Authentication"
				]
			],
			
			"sc-3.3.8" => [
				"ref" => "accessible-authentication-no-exception",
				"version" => "2.2",
				"level" => "aaa",
		        "name" => [
					"en" => "Accessible Authentication (No Exception)"
				]
			],
			
			"sc-3.3.9" => [
				"ref" => "redundant-entry",
				"version" => "2.2",
				"level" => "a",
		        "name" => [
					"en" => "Redundant Entry"
				]
			],
		
			"sc-4.1.1" => [
				"ref" => "parsing",
				"version" => "2.0",
				"level" => "a",
		        "name" => [
					"en" => "Parsing"
				],
				"obsolete" => true
			],
			
			"sc-4.1.2" => [
				"ref" => "name-role-value",
				"version" => "2.0",
				"level" => "a",
		        "name" => [
					"en" => "Name, Role, Value"
				]
			],
		
			"sc-4.1.3" => [
				"ref" => "status-messages",
				"version" => "2.1",
				"level" => "aa",
		        "name" => [
					"en" => "Status Messages"
				]
			],
			
			"epub-pagesrc" => [
				"level" => "normative",
				"name" => [
					"en" => "Page Source"
				]
			],
			
			"epub-pagelist" => [
				"level" => "normative",
				"name" => [
					"en" => "Page List"
				]
			],
			
			"epub-pagebreaks" => [
				"level" => "normative",
				"name" => [
					"en" => "Page Breaks"
				]
			],
			
			"epub-mo-readorder" => [
				"level" => "informative",
				"name" => [
					"en" => "Reading Order"
				]
			],
			
			"epub-mo-skip" => [
				"level" => "informative",
				"name" => [
					"en" => "Skippability"
				]
			],
			
			"epub-mo-esc" => [
				"level" => "informative",
				"name" => [
					"en" => "Escapability"
				]
			],
			
			"epub-mo-nav" => [
				"level" => "informative",
				"name" => [
					"en" => "Navigation Document"
				]
			],
			
			"epub-discovery" => [
				"level" => "normative",
				"name" => [
					"en" => "Discovery Metadata"
				]
			]
		];
		
		private $reporting = <<<HTML
	<div class="reporting">
		<fieldset id="%%id%%-legend" class="flat status">
			<legend>Status:</legend>
			<label><input id="%%id%%-unverified" type="radio" name="%%id%%" value="unverified" class="sc_status" aria-labelledby="%%id%%-legend" checked="checked"> Unverified</label>
			<label><input id="%%id%%-pass" type="radio" name="%%id%%" value="pass" class="sc_status" aria-labelledby="%%id%%-legend"> Pass</label>
			<label><input id="%%id%%-fail" type="radio" name="%%id%%" value="fail" class="sc_status" aria-labelledby="%%id%%-legend"> Fail</label>
			<label><input id="%%id%%-na" type="radio" name="%%id%%" value="na" class="sc_status" aria-labelledby="%%id%%-legend"> N/A</label>
			%%obsolete%%
		</fieldset>
		<div id="%%id%%-failnote" class="failure">
			<p><label for="%%id%%-err">Describe failure(s):</label></p>
			<textarea id="%%id%%-err" rows="5" cols="80"></textarea>
		</div>
		<p><label><input type="checkbox" id="%%id%%-notebox" name="%%id%%-notebox" class="show-note"> Add Note</label></p>
		<div id="%%id%%-note" class="info">
			<textarea id="%%id%%-info" rows="5" cols="80" aria-label="Note"></textarea>
		</div>
	</div>
HTML;
		
		public function generate() {
	
			echo '<div id="sc-list">';
		
			foreach ($this->sc as $id => $info) {
			
				$class = '';
				$level = '';
				$level_class = '';
				$display_id = '';
				$moreinfo_link = '';
				$body = file_get_contents('sc/en/' . $id . '.html');
				$reporting = str_replace('%%id%%', $id, $this->reporting);
				
				if ($info['obsolete']) {
					$obs_value = '<label><input id="' . $id . '-obsolete" type="radio" name="' . $id . '" value="obsolete" class="sc_status" aria-labelledby="' . $id . '-legend"> Obsolete</label>';
					$reporting = str_replace('%%obsolete%%', $obs_value, $reporting);
				}
				else {
					$reporting = str_replace('%%obsolete%%', '', $reporting);
				}
				
				if (strpos($id, 'epub-') !== false) {
					$class = 'epub';
					$level = 'EPUB';
					$level_class = 'epub';
				}
				
				else {
					$class = 'w' . str_replace('.', '', $info['version']) . ' ' . $info['level'];
					$level = 'Level ' . strtoupper($info['level']);
					$level_class = $info['level'];
					$display_id = str_replace('sc-', '', $id) . ' ';
					$alt = 'Additional help with success criterion ' . $display_id;
					
					$moreinfo_link = <<<HTML
	<p class="info">
		<a href="https://kb.daisy.org/publishing/docs/wcag/{$info['ref']}.html" target="_blank">
			<img src="/images/info.png" alt="{$alt}" title="{$alt}"
				onmouseover="this.src='/images/info_hover.png'"
				onmouseout="this.src='/images/info.png'">
		</a>
	</p>
HTML;
				}
			
				echo <<<SC
<section id="{$id}" class="{$class}">
	<h3>
		<span class="label">{$display_id}{$info['name']['en']}</span>
		<span class="{$level_class}-label">{$level}</span>
	</h3>
	
	{$moreinfo_link}
	
	{$body}
	
	{$reporting}
</section>
SC;
			}
			
			echo '</div>';
		}
	
	}

?>