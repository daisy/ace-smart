
<div id="meta-wizard" aria-label="Accessibility Metadata Wizard" title="Accessibility Metadata Wizard">
	<form action="#" id="meta-wiz">
		<div id="wiz-welcome" class="tabpanel">
			<h2>Getting started</h2>
			<p>This accessibility metadata wizard populates the discovery tab based on the
				answers you provide to a series of questions about the publication.</p>
			<p>Do not use this wizard if the accessibility metadata is already up to date.</p>
			<p><strong>CAUTION</strong>: The wizard is still in beta testing. Please <a 
				href="https://github.com/daisy/ace-smart/issues" target="_blank">log an issue</a>
				 if you encounter any difficulties.</p>			
			<p>Click the Next button to begin the wizard.</p>
		</div>
		
		<div id="wiz-conformance" class="tabpanel hidden">
			<p>Does the publication conform to the EPUB Accessibility standard?</p>
			<div>
				<label><input name="conformance" type="radio" value="no" checked=""> No</label>
				<label><input name="conformance" type="radio" value="yes"> Yes</label>
			</div>
		</div>
			
		<div id="wiz-conformance-details" class="tabpanel hidden">
			<p>Please indicate what version and level it passed:</p>
			
			<div class="conf">
				<label for="wiz-epub">EPUB Accessibility:</label>
				<select id="wiz-epub">
					<option>1.0</option>
					<option selected="">1.1</option>
				</select>
			</div>
			
			<div class="conf">
				<label for="wiz-wcag">WCAG:</label>
				<select id="wiz-wcag">
					<option>2.0</option>
					<option selected="">2.1</option>
					<option>2.2</option>
				</select>
			</div>
			
			<div class="conf">
				<label for="wiz-wcaglvl">Conformance:</label>
				<select id="wiz-wcaglvl">
					<option value="a">Level A</option>
					<option value="aa" selected="">Level AA</option>
				</select>
			</div>
		</div>
		
		<div id="wiz-textual" class="tabpanel hidden">
			<p>Does the publication include text content?</p>
			<label><input name="textual" type="radio" value="no"> No</label>
			<label><input name="textual" type="radio" value="yes" checked=""> Yes</label>
		</div>
		
		<div id="wiz-textual-details" class="tabpanel hidden">
			<p>Are all headings tagged using h1-h6 elements?</p>
			<div>
				<label><input name="structuralNavigation" type="radio" value="no" checked=""> No</label>
				<label><input name="structuralNavigation" type="radio" value="yes"> Yes</label>
			</div>
		</div>
					
		<div id="wiz-textual-order" class="tabpanel hidden">
			<p>Is the text ordered so that it presents a logical reading order to users and all secondary content marked up as asides, figures, etc.?</p>
			<div>
				<label><input name="readingOrder" type="radio" value="no" checked=""> No</label>
				<label><input name="readingOrder" type="radio" value="yes"> Yes</label>
			</div>
		</div>
					
		<div id="wiz-textual-transform" class="tabpanel hidden">
			<p>Will users be able to adjust the text display properties?</p>
			<p id="text-xform-help" class="wiz-help">Note: Set the answer to yes if the publication does not include HTML <code>style</code> attributes or CSS <code>!important</code> flags.</p>
			<div>
				<label><input name="displayTransformability" type="radio" value="no" checked=""> No</label>
				<label><input name="displayTransformability" type="radio" value="yes"> Yes</label>
				<label><input name="displayTransformability" type="radio" value="unsure"> Unsure</label>
			</div>
		</div>
		
		<div id="wiz-textual-overlays" class="tabpanel hidden">
			<p>Is there synchronized audio for the text?</p>
			<p id="sync-audio-help" class="wiz-help">Note: Text and audio synchronization is done using media overlays in EPUB 3.</p>
			<div>
				<label><input name="synchronizedAudioText" type="radio" value="no" checked=""> No</label>
				<label><input name="synchronizedAudioText" type="radio" value="yes"> Yes</label>
			</div>
		</div>
		
		<div id="wiz-images" class="tabpanel hidden">
			<p>Does the publication include images?</p>
			<label><input name="images" type="radio" value="no" checked=""> No</label>
			<label><input name="images" type="radio" value="yes"> Yes</label>
		</div>
		
		<div id="wiz-images-alt" class="tabpanel hidden">
			<p>Select the types of text alternatives available for the images:</p>
			
			<ul>
				<li><label><input name="images-feature" type="checkbox" value="alternativeText"> Alternative text</label></li>
				<li><label><input name="images-feature" type="checkbox" value="longDescription"> Long descriptions</label></li>
			</ul>
		</div>
		
		<div id="wiz-images-text" class="tabpanel hidden">
			<p>For all non-presentational images, have you provided alternative text and/or descriptions so that the
				information is available in text form?</p>
			<div>
				<label><input name="accessModeSufficientImage" type="radio" value="no" checked=""> No</label>
				<label><input name="accessModeSufficientImage" type="radio" value="yes"> Yes</label>
			</div>
		</div>
			
		<div id="wiz-images-flash" class="tabpanel hidden">
			<p>Are there any animated images that flash more than 3 times per second?</p>
			<div>
				<label><input name="images-flashing-hazard" type="radio" value="noFlashingHazard" checked=""> No</label>
				<label><input name="images-flashing-hazard" type="radio" value="flashing"> Yes</label>
				<label><input name="images-flashing-hazard" type="radio" value="unknownFlashingHazard"> Unsure</label>
			</div>
		</div>
			
		<div id="wiz-images-motion" class="tabpanel hidden">
			<p>Does any of the image content simulate motion? (e.g., interactive games)</p>
			<div>
				<label><input name="images-motionSimulation-hazard" type="radio" value="noMotionSimulationHazard" checked=""> No</label>
				<label><input name="images-motionSimulation-hazard" type="radio" value="motionSimulation"> Yes</label>
				<label><input name="images-motionSimulation-hazard" type="radio" value="unknownMotionSimulationHazard"> Unsure</label>
			</div>
		</div>
		
		<div id="wiz-auditory" class="tabpanel hidden">
			<p>Does the publication include standalone audio clips?</p>
			<label><input name="auditory" type="radio" value="no" checked=""> No</label>
			<label><input name="auditory" type="radio" value="yes"> Yes</label>
		</div>
		
		<div id="wiz-auditory-details" class="tabpanel hidden">
			<p>Select the types of accessible alternatives available for the audio:</p>
			
			<ul>
				<li><label><input name="auditory-feature" type="checkbox" value="transcript"> Transcripts</label></li>
				<li><label><input name="auditory-feature" type="checkbox" value="signLanguage"> Sign language interpretation</label></li>
			</ul>
		</div>
		
		<div id="wiz-auditory-alt" class="tabpanel hidden">
			<p>Do the text alternatives provide access to the same information as the audio content?</p>
			<div>
				<label><input name="accessModeSufficientAuditory" type="radio" value="no" checked=""> No</label>
				<label><input name="accessModeSufficientAuditory" type="radio" value="yes"> Yes</label>
			</div>
		</div>
		
		<div id="wiz-auditory-contrast" class="tabpanel hidden">
			<p>Does the publication have high contrast audio?</p>
			<p id="audio-contrast-help" class="wiz-help">Note: High contrast audio is audio in which foreground speech is at least 20dB higher than any background noise. Refer to WCAG <a href="https://www.w3.org/TR/WCAG/#low-or-no-background-audio" target="_blank">success criterion 1.4.7</a> for more information.</p>
			<div>
				<label><input name="highContrastAudio" type="radio" value="no" checked=""> No</label>
				<label><input name="highContrastAudio" type="radio" value="yes"> Yes</label>
			</div>
		</div>
		
		<div id="wiz-auditory-hazard" class="tabpanel hidden">
			<p>Does the audio present any hazard to users?</p>
			<div>
				<label><input name="sound-hazard" type="radio" value="noSoundHazard" checked=""> No</label> 
				<label><input name="sound-hazard" type="radio" value="sound"> Yes</label> 
				<label><input name="sound-hazard" type="radio" value="unknownSoundHazard"> Unsure</label>
			</div>
		</div>
		
		<div id="wiz-video" class="tabpanel hidden">
			<p>Does the publication include video?</p>
			<label><input name="video" type="radio" value="no" checked=""> No</label>
			<label><input name="video" type="radio" value="yes"> Yes</label>
		</div>
		
		<div id="wiz-video-alt" class="tabpanel hidden">
			<p>Select the types of accessible alternatives available for the audio:</p>
			
			<ul>
				<li><label><input name="video-feature" type="checkbox" value="audioDescription"> Audio descriptions</label></li>
				<li><label><input name="video-feature" type="checkbox" value="closedCaptions"> Closed captions</label></li>
				<li><label><input name="video-feature" type="checkbox" value="closedCaptions"> Open captions</label></li>
				<li><label><input name="video-feature" type="checkbox" value="signLanguage"> Sign language interpretation</label></li>
				<li><label><input name="video-feature" type="checkbox" value="transcript"> Transcripts</label></li>
			</ul>
		</div>
		
		<div id="wiz-video-details" class="tabpanel hidden">
			<p>Is all video content described?</p>
			<div>
				<label><input name="accessModeSufficientVideo" type="radio" value="no" checked=""> No</label>
				<label><input name="accessModeSufficientVideo" type="radio" value="yes"> Yes</label>
			</div>
		</div>
			
		<div id="wiz-video-flash" class="tabpanel hidden">
			<p>Does the video have any sequences that flash more than 3 times per second?</p>
			<div>
				<label><input name="video-flashing-hazard" type="radio" value="noFlashingHazard" checked=""> No</label>
				<label><input name="video-flashing-hazard" type="radio" value="flashing"> Yes</label>
				<label><input name="video-flashing-hazard" type="radio" value="unknownFlashingHazard"> Unsure</label>
			</div>
		</div>
			
		<div id="wiz-video-motion" class="tabpanel hidden">
			<p>Do any of the videos simulate motion?</p>
			<div>
				<label><input name="video-motionSimulation-hazard" type="radio" value="noMotionSimulationHazard" checked=""> No</label>
				<label><input name="video-motionSimulation-hazard" type="radio" value="motionSimulation"> Yes</label>
				<label><input name="video-motionSimulation-hazard" type="radio" value="unknownMotionSimulationHazard"> Unsure</label>
			</div>
		</div>
		
		<div id="wiz-tactile" class="tabpanel hidden">
			<p>Does the publication include tactile content?</p>
			<label><input name="tactile" type="radio" value="no" checked=""> No</label>
			<label><input name="tactile" type="radio" value="yes"> Yes</label>
		</div>
		
		<div id="wiz-tactile-details" class="tabpanel hidden">
			<p>What types of tactile content are included?</p>
			<div>
				<ul>
					<li><label><input name="tactile-feature" type="checkbox" value="braille"> Braille text</label></li>
					<li><label><input name="tactile-feature" type="checkbox" value="tactileGraphic"> Tactile graphics</label></li>
					<li><label><input name="tactile-feature" type="checkbox" value="tactileObject"> Tactile objects</label></li>
				</ul>
			</div>
		</div>
		
		<div id="wiz-math" class="tabpanel hidden">
			<p>Does the publication include math equations?</p>
			
			<div>
				<label><input name="math" type="radio" value="no" checked=""> No</label>
				<label><input name="math" type="radio" value="yes"> Yes</label>
			</div>
		</div>
				
		<div id="wiz-math-details" class="tabpanel hidden">
			<p>Please select all that apply:</p>
			<ul>
				<li><label><input name="math-feature" type="checkbox" value="MathML"> Equations are marked up using MathML</label></li>
				<li><label><input name="math-feature" type="checkbox" value="text"> Equations are in plain text (e.g., ASCII math)</label></li>
				<li><label><input name="math-feature" type="checkbox" value="image"> Equations are presented as images</label></li>
				<li><label><input name="math-feature" type="checkbox" value="latex"> Equations are encoded in LaTeX</label></li>
			</ul>
		</div>
		
		<div id="wiz-navigation" class="tabpanel hidden">
			<p>Please select all the navigation aids available in the publication:</p>
			
			<ul>
				<li><label><input name="nav-feature" type="checkbox" value="tableOfContents" checked=""> Table of contents</label></li>
				<li><label><input name="nav-feature" type="checkbox" value="index"> Index(es)</label></li>
				<li><label><input name="nav-feature" type="checkbox" value="pageNavigation"> Page list</label></li>
				<li><label><input name="nav-feature" type="checkbox" value="pageBreakMarkers"> Page break markers</label></li>
			</ul>
		</div>
		
		<div id="wiz-markup" class="tabpanel hidden">
			<h2>Accessibility Metadata</h2>
			
			<p>Add the following metadata tags to the publication's package document:</p>
				
			<textarea id="wiz-a11yMetadata" rows="8" cols="80" aria-label="Accessibility metadata tags"></textarea>
		</div>
	</form>
	<script src="js/a11y-meta-wizard.js<?= '?v=' . $smart_version ?>"></script>
</section>
