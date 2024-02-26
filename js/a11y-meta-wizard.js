
const previousButton = document.querySelector('#wiz-prev');
const nextButton = document.querySelector('#wiz-next');
const tabPanels = document.querySelectorAll('.tabpanel');
const isEmpty = (str) => !str.trim().length;

// check if inside an evaluation
const in_smart = (typeof ACE_USER !== 'undefined') ? true : false;

function metaWizardInit() {
	
	clearWizard();
	
	if (!in_smart) {
		return;
	}
	
	var status = document.getElementById('conformance-result-status').textContent;
	
	if (document.getElementById('sc-1.1.1-pass').checked || document.getElementById('sc-1.1.1-fail').checked) {
		// show the image questions
		document.querySelector('input[name=images][value=yes]').click();
	}
	
	if (status.match(/^Pass:/i)) {
	
		var epub = document.getElementById('epub-a11y').value;
		var wcag = document.getElementById('wcag-version').value;
		var level = document.getElementById('wcag-level').value;
		
		// set the conformance field to pass
		document.querySelector('input[name=conformance][value=yes]').click();
		
		// fill in the conformance level
		document.getElementById('wiz-epub').value = epub;
		document.getElementById('wiz-wcag').value = wcag;
		document.getElementById('wiz-wcaglvl').value = level;
		
		// set text fields to pass
		document.querySelector('input[type=radio][name=structuralNavigation][value=yes]').click();
		document.querySelector('input[type=radio][name=readingOrder][value=yes]').click();
		
	}
}


let currentStep = 1;

// total number of tabs in the wizard 
const tabs = 10;

// array of the step numbers the user has visited so they can go back to the right tab when using the previous button
var steps = [];

// track standards conformance to enable step skipping
var conforms = false;

/* watch the accessmode checkboxes */

var am_checkboxes = document.querySelectorAll('input[name=accessMode]');

for(var i = 0; i < am_checkboxes.length; i++) {
	am_checkboxes[i].addEventListener("click", function() {
		checkAccessModes(this);
	});
}

function checkAccessModes(elem) {
	var is_chk = document.querySelectorAll('input[name=accessMode]:checked');
	setActiveButtons({ canContinue: is_chk.length > 0 ? true : false });
}

function showDetails(elem) {
	var details_elem = 'wiz-' + elem.name + '-details';
	var details = document.getElementById(details_elem);
	
	if (elem.value == 'yes') {
		details.classList.remove('hidden');
		
		if (elem.name == 'conformance') {
			conforms = true;
		}
		
		else if (elem.name == 'math') {
			var math_selected = document.querySelectorAll('input[name=mathenc]:checked');
			if (!math_selected) {
				setActiveButtons({canContinue: false});
			}
		}
	}
	else {
		details.classList.add('hidden');
		
		if (elem.name == 'conforms') {
			conforms = false;
		}
		
		else if (elem.name == 'math') {
			setActiveButtons({canContinue: true});
		}
	}
}

// next button clicks
nextButton.addEventListener('click', (event) => {

	event.preventDefault();
	
	steps.push(currentStep);
	
	// hide last tab
	var lastStep = steps[steps.length - 1] - 1;
	tabPanels[lastStep].classList.add('hidden')
	
	if (currentStep !== tabs-1) {
		currentStep += 1;
		setActiveButtons({canContinue: true});
	}
	
	else {
		// end of the wizard
		generateMetadata();
		currentStep += 1;
	}

	tabPanels[currentStep-1].classList.remove('hidden');
	
	showButtons();
})


previousButton.addEventListener('click', (event) => {
	
	event.preventDefault();
	
	// hide the current tab
	tabPanels[currentStep-1].classList.add('hidden');
	
	currentStep = steps.pop();

	// show the previous tab
	tabPanels[currentStep-1].classList.remove('hidden');

	nextButton.removeAttribute('disabled');
	
	showButtons();
});


function showButtons() {
	if (currentStep === tabs) {
		// only show the previous button in the last step
		nextButton.classList.add('hidden');
		previousButton.classList.remove('hidden');
	}
	
	else if (currentStep == 1) {
		// only show the next button for the first step
		nextButton.classList.remove('hidden');
		previousButton.classList.add('hidden');
	}
	
	else {
		// otherwise show both prev/next buttons
		nextButton.classList.remove('hidden');
		previousButton.classList.remove('hidden');
	}
}

function setActiveButtons(opt) {
	if (!opt.canContinue) {
		nextButton.setAttribute('disabled', true);
	}
	else {
		nextButton.removeAttribute('disabled');
	}
}

function generateMetadata() {
	
	// check if metadata is already set
	
	var metaChecked = document.querySelectorAll('#discovery input:checked');
	
	if (in_smart && metaChecked.length > 0) {
		if (confirm('It appears accessibility metadata is already set. Continuing will reset any checked metadata.\n\nPlease confirm you wish to continue.')) {
			for (var i = 0; i < metaChecked.length; i++) {
				metaChecked[i].click();
			}
		}
		
		else {
			// TODO: close dialog
			return;
		}
	}
	
	// store the generated tags for the public version
	var meta_tags = '';
	
	/* add the access modes */
	var no_visual = true;
	var am_category = ['textual', 'images', 'auditory', 'video', 'tactile'];
	var non_visual_modes = ['textual', 'auditory', 'tactile'];
	
	var access_modes = [];
	var feature_tags = '';
	
	am_category.forEach(function (mode) {
		
		var am = document.querySelector('input[name=' + mode + '][value=yes]:checked');
		
		if (am) {
		
			if (non_visual_modes.includes(mode)) {
				
				if (in_smart) {
					document.querySelector('#discovery fieldset#accessMode input[value=' + mode + ']').click();
				}
				else {
					meta_tags += smartFormat.createMetaTag({type: 'meta', property: 'accessMode', value: mode});
				}
				
				access_modes.push(mode);
			}
			
			else {
				if (no_visual) {
				
					if (in_smart) {
						document.querySelector('#discovery fieldset#accessMode input[value=visual]').click();
					}
					
					else {
						meta_tags += smartFormat.createMetaTag({type: 'meta', property: 'accessMode', value: 'visual'});
						// make sure the other visual modes don't trigger repeat values
						no_visual = false;
					}
					
					access_modes.push('visual');
				}
			}
			
			if (mode === 'textual') {
				var features = ['structuralNavigation', 'readingOrder', 'displayTransformability', 'synchronizedTextAudio'];
				features.forEach(function(feature) {
					var hasFeature = document.querySelector('input[name=' + feature + '][value=yes]:checked');
					if (hasFeature) {
						if (in_smart) {
							document.querySelector('#discovery fieldset#accessibilityFeature input[value=' + feature + ']').click();
						}
						else {
							meta_tags += smartFormat.createMetaTag({type: 'meta', property: 'accessibilityFeature', value: feature});
						}
					}
				});
			}
			
			else {
				var features = document.querySelectorAll('input[name=' + mode + '-feature]:checked');
				for (var x = 0; x < features.length; x++) {
					if (in_smart) {
						document.querySelector('#discovery fieldset#accessibilityFeature input[value=' + features[x].value + ']').click();
					}
					else {
						feature_tags += smartFormat.createMetaTag({type: 'meta', property: 'accessibilityFeature', value: features[x].value});
					}
				}
			}
		}
	});
	
	// clear any excess ams sets
	if (in_smart) {
		for (var a = 2; a < 5; a++) {
			var ams_set = document.querySelector('#discovery fieldset#accessModeSufficient fieldset#set' + a);
			if (ams_set) {
				ams_set.remove(ams_set);
			}
		}
	}
	
	/* add sufficient access modes */
	if (access_modes.length > 1) {
		var wcag_level = document.getElementById('wiz-wcaglvl').value.toLowerCase();
		
		var is_textual = false;
		
		if (conforms) {
			is_textual = access_modes.includes('textual') && conforms && (wcag_level === 'aa' || wcag_level === 'aaa') ? true : false;
		}
		
		else {
			is_textual = true;
			
			// revert to false if any non-textual modes fail to provide text equivalents
			if (access_modes.contains('images') && (document.querySelector('input[name=accessModeSufficientImage][value=no]'))) {
				is_textual = false;
			}
			else if (access_modes.contains('auditory') && (document.querySelector('input[name=accessModeSufficientAuditory][value=no]'))) {
				is_textual = false;
			}
			else if (access_modes.contains('video') && (document.querySelector('input[name=accessModeSufficientVideo][value=no]'))) {
				is_textual = false;
			}
		}
		
		if (is_textual) {
			if (in_smart) {
				document.querySelector('#discovery fieldset#accessModeSufficient fieldset#set1 input[value=textual]').click();
			}
			
			else {
				meta_tags += smartFormat.createMetaTag({type: 'meta', property: 'accessModeSufficient', value: 'textual'});
			}
		}
	}
	
	// add the accessibility features
	
	// include features linked to access mode questions
	meta_tags += feature_tags;
	
	// get math features
	
	var hasMath = document.querySelector('input[name=math][value=yes]:checked');
	
	if (hasMath) {
		var mathType = document.querySelectorAll('input[name=math-feature]:checked');
		
		for (var i = 0; i < mathType.length; i++) {
			if (mathType[i].value !== 'image' && mathType[i].value !== 'text') {
				if (in_smart) {
					document.querySelector('#discovery fieldset#accessibilityFeature input[value=' + mathType[i].value + ']').click();
				}
				else {
					meta_tags += smartFormat.createMetaTag({type: 'meta', property: 'accessibilityFeature', value: mathType[i].value});
				}
			}
		}
	}
	
	// get navigation features
	
	var navFeatures = document.querySelectorAll('input[name=nav-feature]:checked');
	
	for (var z = 0; z < navFeatures.length; z++) {
		if (in_smart) {
			document.querySelector('#discovery fieldset#accessibilityFeature input[value=' + navFeatures[z].value + ']').click();
		}
		else {
			meta_tags += smartFormat.createMetaTag({type: 'meta', property: 'accessibilityFeature', value: navFeatures[z].value});
		}
	}

	
	// add the accessibility hazards
	
	var images_flashing_hazard = document.querySelector('input[name=images-flashing-hazard]:checked');
	var video_flashing_hazard = document.querySelector('input[name=video-flashing-hazard]:checked');
	const unknownFlash = 'unknownFlashingHazard';
	const noFlash = 'noFlashingHazard';
	
	if (images_flashing_hazard.value == 'flashing' || video_flashing_hazard.value == 'flashing') {
		if (in_smart) {
			document.querySelector('#discovery fieldset#accessibilityHazard input[value=flashing]').click();
		}
		else {
			meta_tags += smartFormat.createMetaTag({type: 'meta', property: 'accessibilityHazard', value: 'flashing'});
		}
	}
	
	else {
		if (images_flashing_hazard.value == unknownFlash || video_flashing_hazard.value == unknownFlash) {
			if (in_smart) {
				document.querySelector('#discovery fieldset#accessibilityHazard input[value=' + unknownFlash + ']').click();
			}
			else {
				meta_tags += smartFormat.createMetaTag({type: 'meta', property: 'accessibilityHazard', value: unknownFlash});
			}
		}
		else {
			if (in_smart) {
				document.querySelector('#discovery fieldset#accessibilityHazard input[value=' + noFlash + ']').click();
			}
			else {
				meta_tags += smartFormat.createMetaTag({type: 'meta', property: 'accessibilityHazard', value: noFlash});
			}
		}
	}
	
	var images_motion_hazard = document.querySelector('input[name=images-motionSimulation-hazard]:checked');
	var video_motion_hazard = document.querySelector('input[name=video-motionSimulation-hazard]:checked');
	const motion = 'motionSimulation';
	const noMotion = 'noMotionSimulationHazard';
	const unknownMotion = 'unknownMotionSimulationHazard';
	
	if (images_motion_hazard.value == motion || video_motion_hazard.value == motion) {
		if (in_smart) {
			document.querySelector('#discovery fieldset#accessibilityHazard input[value=' + motion + ']').click();
		}
		else {
			meta_tags += smartFormat.createMetaTag({type: 'meta', property: 'accessibilityHazard', value: motion});
		}
	}
	
	else {
		if (images_motion_hazard.value == unknownMotion || video_motion_hazard.value == unknownMotion) {
			if (in_smart) {
				document.querySelector('#discovery fieldset#accessibilityHazard input[value=' + unknownMotion + ']').click();
			}
			else {
				meta_tags += smartFormat.createMetaTag({type: 'meta', property: 'accessibilityHazard', value: unknownMotion});
			}
		}
		else {
			if (in_smart) {
				document.querySelector('#discovery fieldset#accessibilityHazard input[value=' + noMotion + ']').click();
			}
			else {
				meta_tags += smartFormat.createMetaTag({type: 'meta', property: 'accessibilityHazard', value: noMotion});
			}
		}
	}
	
	var sound_hazard = document.querySelector('input[name=sound-hazard]:checked');
	
	if (in_smart) {
		document.querySelector('#discovery fieldset#accessibilityHazard input[value=' + sound_hazard.value + ']').click();
	}
	else {
		meta_tags += smartFormat.createMetaTag({type: 'meta', property: 'accessibilityHazard', value: sound_hazard.value});
	}
	
	if (in_smart) {
		alert('The accessibility metadata fields have been successfully updated.');
		meta_wiz_dialog.dialog('close');
	}
	
	else {
		document.getElementById('a11yMetadata').value = meta_tags;
	}
	
	return false;
}


function clearWizard() {
	document.getElementById('meta-wiz').reset();
	tabPanels.forEach(function(panel) {
		panel.classList.add('hidden');
	});
	tabPanels[0].classList.remove('hidden');
	
	// collapse/expand the view of the questions - resetting form doesn't activate
	var names = ['conformance', 'images', 'auditory', 'video', 'tactile', 'math'];
	names.forEach(function(name) {
		document.querySelector('input[name=' + name + '][value=no]').click();
	});
	document.querySelector('input[name=textual][value=yes]').click();
	
	nextButton.classList.remove('hidden');
	previousButton.classList.add('hidden');
	currentStep = 1;
	steps = [];
	conforms = false;
}


function showHelp(help_id) {
	var help_elem = document.getElementById(help_id);
	
	if (help_elem) {
		window.alert(help_elem.textContent);
	}
}
