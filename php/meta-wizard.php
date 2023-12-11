
<div id="meta-wizard" aria-label="Accessibility Metadata Wizard" title="Accessibility Metadata Wizard">
	<form action="#">
		<div id="wiz-welcome" class="tabpanel">
			<h2>Getting started</h2>
			<p>Run the DAISY Ace SMART Accessibility Metadata wizard to create a set of accessibility
				metadata for use in an EPUB publication.</p>
			<p>The tool will ask you a series of simple questions about your publication and generate
				a set of accessibility metadata you can use in the package document.</p>
			<p>Please click the Next button to begin the wizard.</p>
		</div>
		
		<div id="wiz-conformance" class="tabpanel hidden">
			<fieldset>
				<legend>Conformance</legend>
				<p>Have evaluated your publication for conformance to the EPUB Accessibility standard?</p>
				<div>
					<label><input name="conformance" type="radio" value="no" onclick="showDetails(this)" checked=""> No</label>
					<label><input name="conformance" type="radio" value="yes" onclick="showDetails(this)"> Yes</label>
				</div>
				<div id="wiz-conformance-details" class="hidden">
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
			</fieldset>
		</div>
		
		<div id="wiz-textual" class="tabpanel hidden">
			<fieldset>
				<legend>Text content</legend>
				
				<p>Does your publication include text content?</p>
				<label><input name="textual" type="radio" value="no" onclick="showDetails(this)"> No</label>
				<label><input name="textual" type="radio" value="yes" onclick="showDetails(this)" checked=""> Yes</label>
				
				<div id="wiz-textual-details">
					<p>Are all headings correctly tagged?</p>
					<div>
						<label><input name="structuralNavigation" type="radio" value="no" checked=""> No</label>
						<label><input name="structuralNavigation" type="radio" value="yes"> Yes</label>
					</div>
					
					<p>Is the text ordered so that it presents a logical reading order to users?</p>
					<div>
						<label><input name="readingOrder" type="radio" value="no" checked=""> No</label>
						<label><input name="readingOrder" type="radio" value="yes"> Yes</label>
					</div>
					
					<p>Can users adjust the text display properties to their needs?</p>
					<div>
						<label><input name="displayTransformability" type="radio" value="no" checked=""> No</label>
						<label><input name="displayTransformability" type="radio" value="yes"> Yes</label>
						<label><input name="displayTransformability" type="radio" value="unsure"> Unsure</label>
					</div>
					
					<p>Is there synchronized audio for the text?</p>
					<p class="wiz-help">Publications with text and audio synchronization are often referred as "read aloud books".</p>
					<div>
						<label><input name="synchronizedAudioText" type="radio" value="no" checked=""> No</label>
						<label><input name="synchronizedAudioText" type="radio" value="yes"> Yes</label>
					</div>
				</div>
			</fieldset>
		</div>
		
		<div id="wiz-images" class="tabpanel hidden">
			<fieldset>
				<legend>Image content</legend>
				
				<p>Does your publication include images?</p>
				<label><input name="images" type="radio" value="no" onclick="showDetails(this)" checked=""> No</label>
				<label><input name="images" type="radio" value="yes" onclick="showDetails(this)"> Yes</label>
				
				<div id="wiz-images-details" class="hidden">
					<p>Select the types of text alternatives available for the images:</p>
					
					<ul>
						<li><label><input name="images-feature" type="checkbox" value="alternativeText"> Alternative text</label></li>
						<li><label><input name="images-feature" type="checkbox" value="longDescription"> Long descriptions</label></li>
					</ul>
					
					<p>For all non-presentational images, have you provided alternative text and/or descriptions so that the
						information is available in text form?</p>
					<div>
						<label><input name="accessModeSufficientImage" type="radio" value="no" checked=""> No</label>
						<label><input name="accessModeSufficientImage" type="radio" value="yes"> Yes</label>
					</div>
					
					<p>Are there any animated images that flash more than 3 times per second?</p>
					<div>
						<label><input name="images-flashing-hazard" type="radio" value="noFlashingHazard" checked=""> No</label>
						<label><input name="images-flashing-hazard" type="radio" value="flashing"> Yes</label>
						<label><input name="images-flashing-hazard" type="radio" value="unknownFlashingHazard"> Unsure</label>
					</div>
					
					<p>Does any of the image content simulate motion? (e.g., interactive games)</p>
					<div>
						<label><input name="images-motionSimulation-hazard" type="radio" value="noMotionSimulationHazard" checked=""> No</label>
						<label><input name="images-motionSimulation-hazard" type="radio" value="motionSimulation"> Yes</label>
						<label><input name="images-motionSimulation-hazard" type="radio" value="unknownMotionSimulationHazard"> Unsure</label>
					</div>
				</div>
			</fieldset>
		</div>
		
		<div id="wiz-auditory" class="tabpanel hidden">
			<fieldset>
				<legend>Audio content</legend>
				<p>Does your publication include audio?</p>
				<label><input name="auditory" type="radio" value="no" onclick="showDetails(this)" checked=""> No</label>
				<label><input name="auditory" type="radio" value="yes" onclick="showDetails(this)"> Yes</label>
				
				<div id="wiz-auditory-details" class="hidden">
					<p>Select the types of accessible alternatives available for the audio:</p>
					
					<ul>
						<li><label><input name="auditory-feature" type="checkbox" value="audioDescription"> Audio descriptions</label></li>
						<li><label><input name="auditory-feature" type="checkbox" value="closedCaptions"> Closed captions</label></li>
						<li><label><input name="auditory-feature" type="checkbox" value="closedCaptions"> Open captions</label></li>
						<li><label><input name="auditory-feature" type="checkbox" value="signLanguage"> Sign language interpretation</label></li>
						<li><label><input name="auditory-feature" type="checkbox" value="transcript"> Transcripts</label></li>
					</ul>
					
					<p>Do the text alternatives cover all the audio content?</p>
					<div>
						<label><input name="accessModeSufficientAudio" type="radio" value="no" checked=""> No</label>
						<label><input name="accessModeSufficientAudio" type="radio" value="yes"> Yes</label>
					</div>
					
					<p>Does the audio have high contrast?</p>
					<div>
						<label><input name="highContrastAudio" type="radio" value="no" checked=""> No</label>
						<label><input name="highContrastAudio" type="radio" value="yes"> Yes</label>
					</div>
					
					<p>Does the audio present any hazard to users?</p>
					<div>
						<label><input name="sound-hazard" type="radio" value="noSoundHazard" checked=""> No</label> 
						<label><input name="sound-hazard" type="radio" value="sound"> Yes</label> 
						<label><input name="sound-hazard" type="radio" value="unknownSoundHazard"> Unsure</label>
					</div>
				</div>
			</fieldset>
		</div>
		
		<div id="wiz-video" class="tabpanel hidden">
			<fieldset>
				<legend>Video content</legend>
				<p>Does your publication include video?</p>
				<label><input name="video" type="radio" value="no" onclick="showDetails(this)" checked=""> No</label>
				<label><input name="video" type="radio" value="yes" onclick="showDetails(this)"> Yes</label>
				
				<div id="wiz-video-details" class="hidden">
					<p>Is all video content described?</p>
					<div>
						<label><input name="accessModeSufficientVideo" type="radio" value="no" checked=""> No</label>
						<label><input name="accessModeSufficientVideo" type="radio" value="yes"> Yes</label>
					</div>
					
					<p>Does the video have any sequences that flash more than 3 times per second?</p>
					<div>
						<label><input name="video-flashing-hazard" type="radio" value="noFlashingHazard" checked=""> No</label>
						<label><input name="video-flashing-hazard" type="radio" value="flashing"> Yes</label>
						<label><input name="video-flashing-hazard" type="radio" value="unknownFlashingHazard"> Unsure</label>
					</div>
					
					<p>Do any of the videos simulate motion?</p>
					<div>
						<label><input name="video-motionSimulation-hazard" type="radio" value="noMotionSimulationHazard" checked=""> No</label>
						<label><input name="video-motionSimulation-hazard" type="radio" value="motionSimulation"> Yes</label>
						<label><input name="video-motionSimulation-hazard" type="radio" value="unknownMotionSimulationHazard"> Unsure</label>
					</div>
				</div>
			</fieldset>
		</div>
		
		<div id="wiz-tactile" class="tabpanel hidden">
			<fieldset>
				<legend>Tactile content</legend>
				<p>Does your publication include tactile content?</p>
				<label><input name="tactile" type="radio" value="no" onclick="showDetails(this)" checked=""> No</label>
				<label><input name="tactile" type="radio" value="yes" onclick="showDetails(this)"> Yes</label>
				
				<div id="wiz-tactile-details" class="hidden">
					<p>What types of tactile content are included?</p>
					<div>
						<ul>
							<li><label><input name="tactile-feature" type="checkbox" value="braille"> Braille text</label></li>
							<li><label><input name="tactile-feature" type="checkbox" value="tactileGraphic"> Tactile graphics</label></li>
							<li><label><input name="tactile-feature" type="checkbox" value="tactileObject"> Tactile objects</label></li>
						</ul>
					</div>
				</div>
			</fieldset>
		</div>
		
		<div id="wiz-math" class="tabpanel hidden">
			<fieldset>
				<legend>Math</legend>
				
				<p>Does your publication include math equations?</p>
				
				<div>
					<label><input name="math" type="radio" value="no" onclick="showDetails(this)" checked=""> No</label>
					<label><input name="math" type="radio" value="yes" onclick="showDetails(this)"> Yes</label>
				</div>
				
				<div id="wiz-math-details" class="hidden">
					<p>Please select all that apply:</p>
					<ul>
						<li><label><input name="math-feature" type="checkbox" value="MathML"> Equations are marked up using MathML</label></li>
						<li><label><input name="math-feature" type="checkbox" value="text"> Equations are in plain text (e.g., ASCII math)</label></li>
						<li><label><input name="math-feature" type="checkbox" value="image"> Equations are presented as images</label></li>
						<li><label><input name="math-feature" type="checkbox" value="latex"> Equations are encoded in LaTeX</label></li>
					</ul>
				</div>
			</fieldset>
		</div>
		
		<div id="wiz-navigation" class="tabpanel hidden">
			<fieldset>
				<legend>Navigation</legend>
				
				<p>Please select all the navigation aids available in your publication:</p>
				
				<ul>
					<li><label><input name="nav-feature" type="checkbox" value="tableOfContents" checked=""> Table of contents</label></li>
					<li><label><input name="nav-feature" type="checkbox" value="index"> Index(es)</label></li>
					<li><label><input name="nav-feature" type="checkbox" value="pageNavigation"> Page list</label></li>
					<li><label><input name="nav-feature" type="checkbox" value="pageBreakMarkers"> Page break markers</label></li>
				</ul>
			</fieldset>
		</div>
		
		<div id="wiz-markup" class="tabpanel hidden">
			<h2>Accessibility Metadata</h2>
			
			<p>Add the following metadata tags to the publication's package document:</p>
				
			<textarea id="wiz-a11yMetadata" rows="8" cols="80" aria-label="Accessibility metadata tags"></textarea>
		</div>
		
		<div class="pagination">
			<a class="btn hidden" id="wiz-prev">Previous</a>
			<a class="btn" id="wiz-next">Next</a>
		</div>
	</form>
	<script src="js/a11y-meta-wizard.js<?= '?v=' . $smart_version ?>"></script>
</section>
