
'use strict';

smart_extensions['born_accessible'] = (function() {
	/* 
	 * if setting a logo, array values are: [0] credential image url, [1] alt text, [2] link to credential info
	 * 
	 * example: var _LOGO = ['https://example.com/image.jpg', 'Certified by FooBar', 'https://example.com/moreinfo']
	 * 
	 * result: <a href="https://example.com/moreinfo"><img src="https://example.com/image.jpg" alt="Certified by FooBar"/></a>
	 */ 
	
	var _LOGO = [];
	var _MAX_SECTION_SCORE = 4;
	var _SCORE_TEXT_CSS = {
		0: 'bad',
		1: 'mid',
		2: 'mid',
		3: 'mid',
		4: 'good',
		'N/A': 'na',
		'Unverified': 'unverified'
	}
	var _baReportScore = '';
	
	return {
	
		LOGO: _LOGO,
		
		clear: function() {
			
			// reset the output options
			var output_options = ['ba-output-report', 'ba-output-notes'];
			
			output_options.forEach(function(id) {
				var checkbox = document.getElementById(id);
				if (checkbox && !checkbox.checked) {
					checkbox.click();
				}
			});
			
			// reset text inputs
			var inputs = document.querySelectorAll('#born_accessible #ba-content-inputs input[type="text"], #born_accessible #ba-content-inputs textarea');
			
			for (var i = 0; i < inputs.length; i++) {
				inputs[i].value = '';
			}
			
			// reset the epub complexity setting
			var complexity = document.querySelector('#born_accessible #ba-content-inputs input[name="ba-complexity-level"]:checked');
			
			if (complexity) {
				complexity.checked = false;
			}
			
			// reset the filters
			
			var filters = document.querySelectorAll('#born_accessible input.test-filter:checked');
			
			if (filters) {
				for (var i = 0; i < filters.length; i++) {
					filters.click();
				}
			}
			
			// unset all the tests
			var fields = document.querySelectorAll('#born_accessible fieldset.test input[type="radio"][value="Unverified"]');
			
			for (var i = 0; i < fields.length; i++) {
				fields[i].click();
			}
			
		},
		
		
		
		validate: function() {
			
			var is_valid = true;
			
			// verify all stats are numbers
			
			var stats = document.querySelectorAll('section#born_accessible div#ba-content-inputs input[type="text"]');
			
			for (var i = 0; i < stats.length; i++) {
				var value = stats[i].value.trim();
				if (value && !value.match(/^[0-9]+$/)) {
					smartError.logError({tab_id: 'born_accessible', element_id: stats[i].id, severity: 'err', message: 'Born Accessible statistics must be numbers.'});
					smartFormat.setFieldToError({id: stats[i].id, is_warning: false, highlight_parent: true});
					is_valid = false;
				}
				else {
					smartFormat.setFieldToPass({id: stats[i].id, highlight_parent: true});
				}
			}
			
			// verify an executive summary is included
			
			if (document.getElementById('ba-executive-summary').value.trim() == '') {
					smartError.logError({tab_id: 'born_accessible', element_id: 'ba-executive-summary', severity: 'err', message: 'Born Accessible report must include an executive summary.'});
					smartFormat.setFieldToError({id: 'ba-executive-summary', is_warning: false, highlight_parent: true});
					is_valid = false;
			}
			else {
				smartFormat.setFieldToPass({id: 'ba-executive-summary', highlight_parent: true});
			}
			
			// verify the complexity has been set
			
			if (!noDesignElements && !document.querySelector('section#born_accessible fieldset#complexity-levels-section input[name="ba-complexity-level"]:checked')) {
					smartError.logError({tab_id: 'born_accessible', element_id: 'complexity-levels-section', severity: 'err', message: 'Born Accessible complexity level must be specified.'});
					smartFormat.setFieldToError({id: 'complexity-levels-section', is_warning: false, highlight_parent: false});
					is_valid = false;
			}
			else {
				smartFormat.setFieldToPass({id: 'complexity-levels-section', highlight_parent: false});
			}
			
			// verify no tests are unverified
			
			var tests = document.querySelectorAll('#born_accessible fieldset.test');
			
			for (var i = 0; i < tests.length; i++) {
				var checked_radio = tests[i].querySelector('input.test-input:checked');
				
				if (!checked_radio) {
					smartError.logError({tab_id: 'born_accessible', element_id: tests[i].id, severity: 'err', message: 'Born Accessible test "' + tests[i].querySelector('legend').textContent + '" has no result.'});
					is_valid = false;
				}
				
				else if (checked_radio.value == 'Unverified') {
					smartError.logError({tab_id: 'born_accessible', element_id: tests[i].id, severity: 'err', message: 'Born Accessible test "' + tests[i].querySelector('legend').textContent + '" has not been verified.'});
					is_valid = false;
				}
			}
			
			return is_valid;
		},
		
		
		
		generateReport: function() {
			
			var reportHTML = document.createElement('section');
				reportHTML.setAttribute('class','js-tabcontent');
				reportHTML.setAttribute('id','born_accessible');
			
			var tab_hd = document.createElement('h3');
				tab_hd.appendChild(document.createTextNode('Born Accessible Report'));
			
			reportHTML.appendChild(tab_hd);
			
			var executive_summary = document.createElement('section');
				executive_summary.setAttribute('id','ba-exec-summary');
			
			var executive_summary_hd = document.createElement('h4');
				executive_summary_hd.appendChild(document.createTextNode('Executive Summary'));
			executive_summary.appendChild(executive_summary_hd);
			
			var executive_summary_para = document.createElement('p');
				executive_summary_para.appendChild(document.createTextNode(document.getElementById('ba-executive-summary').value))
			executive_summary.appendChild(executive_summary_para);
			
			reportHTML.appendChild(executive_summary);
			
			var test_scores = document.createElement('section');
				test_scores.setAttribute('id','ba-scores')
			
			var test_scores_hd = document.createElement('h4');
				test_scores_hd.appendChild(document.createTextNode('Scoring'));
			test_scores.appendChild(test_scores_hd);
			
			var score_list = document.createElement('ul');
				score_list.setAttribute('class', 'ba-score-list')
			
			var test_sections = document.querySelectorAll('#born_accessible section.test');
			
			var exclusions = document.querySelectorAll('#born_accessible #ba-test-exclusions input:checked');
			var excludeResult = {};
			
			for (var i = 0; i < exclusions.length; i++) {
				excludeResult[exclusions[i].value] = 1;
			}
			
			var max_score = 0;
			var actual_score = 0;
			var unverified = false;
			
			for (var i = 0; i < test_sections.length; i++) {
			
				var section_unverified = false;
				var id = test_sections[i].id.replace('section-','');
				
				if (excludeResult.hasOwnProperty(id)) {
					continue;
				}
				
				var max_section_score = 0;
				var actual_section_score = 0;
				var isNA = true;
				
				var tests = test_sections[i].querySelectorAll('fieldset');
				
				var test_group_list = document.createElement('ul');
				
				for (var j = 0; j < tests.length; j++) {
					var score = tests[j].querySelector('input:checked');
					
					if (!score) {
						continue;
					}
					
					var score_li = document.createElement('li');
						score_li.setAttribute('class','ba-score');
					
					// add the test label
					
					var score_label_li = document.createElement('span');
						score_label_li.appendChild(document.createTextNode(tests[j].querySelector('legend').textContent + ':'));
					score_li.appendChild(score_label_li);
					
					// add the score
					
					var score_value_li = document.createElement('span');
					
					if (_SCORE_TEXT_CSS[score.value]) {
						score_value_li.classList.add(_SCORE_TEXT_CSS[score.value]);
					}
					
					var isNumeric = new RegExp(/[0-9]+/);
					var score_display = isNumeric.test(score.value) ? score.value + ' / ' + _MAX_SECTION_SCORE : score.value;
					
					score_value_li.appendChild(document.createTextNode(score_display));
					
					score_li.appendChild(score_value_li);
					
					// add the score description
					
					var score_desc = score.parentNode.textContent.trim();
					
					if (score_desc.toLowerCase() == 'unverified') {
						score_desc = '';
						unverified = true;
						section_unverified = true;
					}
					
					else {
						score_desc = score_desc.replace(/.*?— /i, '');
					}
					
					if (score_desc) {
						var score_li_desc = document.createElement('div');
							score_li_desc.setAttribute('class','ba-score-note ba-hlt');
							score_li_desc.appendChild(document.createTextNode(score_desc));
						score_li.appendChild(score_li_desc);
					}
					
					// add any notes
					if (document.getElementById('ba-output-notes').checked) {
						var note = tests[j].querySelector('textarea').value.trim();
						if (note) {
							var score_li_note = document.createElement('div');
								score_li_note.setAttribute('class','ba-score-note');
							
							var lines = note.trim().split(/[\r\n]+/);
							var first = true;
							
							lines.forEach(function(line) {
								if (line) {
									var notePara = document.createElement('p');
									if (first){
										var score_li_note_label = document.createElement('strong');
											score_li_note_label.appendChild(document.createTextNode('Note: '));
											notePara.appendChild(score_li_note_label);
											first = false;
									}
									notePara.appendChild(document.createTextNode(line));
									score_li_note.appendChild(notePara);
								}
							});
							score_li.appendChild(score_li_note);
						}
					}
					
					test_group_list.appendChild(score_li)
					
					if (score.value != 'N/A' && score.value != 'Unverified') {
						actual_section_score += Number(score.value);
						max_section_score += _MAX_SECTION_SCORE;
						isNA = false;
					}
				}
				
				var ba_score_li  = document.createElement('li');
					ba_score_li.setAttribute('class','ba-score');
				
				var ba_score_label = document.createElement('span');
					ba_score_label.appendChild(document.createTextNode(test_sections[i].querySelector('h4').textContent + ':'));
				ba_score_li.appendChild(ba_score_label);
				
				var section_score = (section_unverified || max_section_score == 0) ? 'N/A' : (Math.round((actual_section_score / max_section_score) * 100) + '%');
				
				var ba_score_value = document.createElement('span');
					ba_score_value.appendChild(document.createTextNode(section_score))
				ba_score_li.appendChild(ba_score_value);
				
				ba_score_li.appendChild(test_group_list);
				
				score_list.appendChild(ba_score_li);
				
				if (!isNA) {
					max_score += max_section_score;
					actual_score += actual_section_score;
				}
			}
			
			// add total score
			
			if (unverified) {
				_baReportScore = 'Incomplete';
			}
			
			else {
				_baReportScore  = (max_score == 0) ? 'N/A' : (Math.floor((actual_score / max_score) * 100) + '%');
			}
			
			var ba_total_score_div  = document.createElement('div');
				ba_total_score_div.setAttribute('id','ba-total-score');
				ba_total_score_div.setAttribute('class','ba-primary');
			
			var score_span_label = document.createElement('span');
				score_span_label.appendChild(document.createTextNode('Born Accessible Score: '));
			
			ba_total_score_div.appendChild(score_span_label);
			
			var score_span_value = document.createElement('span');
				score_span_value.appendChild(document.createTextNode(_baReportScore));
			
			ba_total_score_div.appendChild(score_span_value);
			
			test_scores.appendChild(ba_total_score_div);
			
			var complexity_selected = document.querySelector('input[name="ba-complexity-level"]:checked');
			
			if (!noDesignElements) {
				
				// add complexity level
				
				var complexity_level = complexity_selected ? complexity_selected.parentNode.textContent : 'Not specified';
				
				var complexity_div = document.createElement('div');
					complexity_div.setAttribute('id','ba-epub-complexity');
					complexity_div.setAttribute('class','ba-primary');
				
				var complexity_span = document.createElement('span');
					complexity_span.appendChild(document.createTextNode('EPUB Complexity Level: '));
				complexity_div.appendChild(complexity_span);
				
				var complexity_score = document.createElement('span');
					complexity_score.appendChild(document.createTextNode(complexity_level));
				complexity_div.appendChild(complexity_score);
				
				test_scores.appendChild(complexity_div);
			
			}
			
			// add individual scores
			
			test_scores.appendChild(score_list);
			
			reportHTML.appendChild(test_scores);
			
			if (!noDesignElements) {
				
				// generate stats section
				
				var stat_section = document.createElement('section');
					stat_section.setAttribute('id','born-accessible-stats');
				
				var stat_hd = document.createElement('h4');
					stat_hd.appendChild(document.createTextNode('Statistics'))
				stat_section.appendChild(stat_hd);
				
				// add design elements
				
				var design_div = document.createElement('div');
					design_div.setAttribute('id','ba-design-elements');
					design_div.setAttribute('class','ba-primary');
				
				var design_span = document.createElement('span');
					design_span.appendChild(document.createTextNode('Design Elements: '));
				design_div.appendChild(design_span);
				
				var design_ratio = document.createElement('span');
					design_ratio.appendChild(document.createTextNode(document.getElementById('ba-epp-num').textContent + ' per page'));
				design_div.appendChild(design_ratio);
				
				stat_section.appendChild(design_div);
				
				
				// add stats table
				
				var stat_table = document.createElement('table');
				
				var stat_table_thead = document.createElement('thead');
				
				var stat_table_trow = document.createElement('tr');
				
				var stat_table_type_th = document.createElement('th');
					stat_table_type_th.appendChild(document.createTextNode('Content Structure'));
				stat_table_trow.appendChild(stat_table_type_th);
				
				var stat_table_count_th = document.createElement('th');
					stat_table_count_th.appendChild(document.createTextNode('Count'));
				stat_table_trow.appendChild(stat_table_count_th);
				
				stat_table_thead.appendChild(stat_table_trow);
				
				stat_table.appendChild(stat_table_thead);
				
				var stat_table_tbody = document.createElement('tbody');
				
				var stats = document.querySelectorAll('#born_accessible #ba-content-inputs label');
				
				for (var i = 0; i < stats.length; i++) {
					var stat = stats[i].querySelector('input[type="text"]');
					if (stat) {
						var stat_trow = document.createElement('tr');
						
						var stat_title_td = document.createElement('td');
							stat_title_td.appendChild(document.createTextNode(stats[i].querySelector('span').textContent));
						stat_trow.appendChild(stat_title_td);
						
						var stat_count = stat.value.trim();
						
						var stat_value_td = document.createElement('td');
							stat_value_td.appendChild(document.createTextNode(stat_count != '' ? stat_count : '0'));
						stat_trow.appendChild(stat_value_td);
						
						stat_table_tbody.appendChild(stat_trow);
					}
				}
				
				stat_table.appendChild(stat_table_tbody);
				
				stat_section.appendChild(stat_table);
				
				reportHTML.appendChild(stat_section);
			
			}
			
			return reportHTML;
		},
		
		
		addReportSummaryProperty: function() {
			var property = {};
			
				property.id = 'ba-summary-score';
				property.label = 'Born Accessible Score';
				property.value = _baReportScore;
				property.property = '';
				property.value_bg_class = '';
			
			return property;
		},
		
		
		saveData: function() {
		
			var baJSON = {configuration: {}, info: {}, statistics: {}, scores: []};
			
			// add design element
			
			baJSON.info['ba-design-elements'] = document.getElementById('ba-epp-num').textContent;
			
			// add executive summary
			
			baJSON.info['ba-executive-summary'] = document.querySelector('#born_accessible #ba-content-inputs textarea').value;
			
			// add epub complexity
			
			var complexity = document.querySelector('#born_accessible #ba-content-inputs input[name="ba-complexity-level"]:checked');
			
			baJSON.info['ba-complexity-level'] = complexity ? complexity.id : '';
			
			// add content stats
			
			var stats = document.querySelectorAll('#born_accessible #ba-content-inputs input[type="text"]');
			
			for (var i = 0; i < stats.length; i++) {
				baJSON.statistics[stats[i].id] = stats[i].value;
			}
			
			// add test exclusions
			
			var exclusions = document.querySelectorAll('#born_accessible #ba-test-exclusions input:checked');
			
			baJSON.configuration.exclusions = [];
			
			for (var i = 0; i < exclusions.length; i++) {
				baJSON.configuration.exclusions.push(exclusions[i].value);
			}
			
			// add test scores
			
			var tests = document.querySelectorAll('#born_accessible fieldset.test');
			
			for (var i = 0; i < tests.length; i++) {
				var score_info = {};
					score_info.id = tests[i].id;
				
				var checked_score = tests[i].querySelector('input:checked');
				var score = '';
				var score_id = '';
				
				if (checked_score) {
					score_info.score = checked_score.value;
					if (checked_score.id) {
						score_info.score_id = checked_score.id;
					}
				}
				
				var note = tests[i].querySelector('textarea').value;
					score_info.note = note;
				
				baJSON.scores.push(score_info);
			}
			
			return baJSON;
		},
		
		
		
		loadData: function(savedJSON) {
		
			if (savedJSON.hasOwnProperty('born_accessible') && savedJSON.born_accessible) {
				// load statistics
				if (savedJSON.born_accessible.hasOwnProperty('statistics')) {
					for (var key in savedJSON.born_accessible.statistics) {
						document.getElementById(key).value = savedJSON.born_accessible.statistics[key];
					}
				}
				
				if (savedJSON.born_accessible.hasOwnProperty('info')) {
					// load the design elements count
					if (savedJSON.born_accessible.info.hasOwnProperty('ba-design-elements')) {
						document.getElementById('ba-epp-num').textContent = savedJSON.born_accessible.info['ba-design-elements'];
					}
					
					// load the executive summary
					if (savedJSON.born_accessible.info.hasOwnProperty('ba-executive-summary')) {
						document.getElementById('ba-executive-summary').value = savedJSON.born_accessible.info['ba-executive-summary'];
					}
					
					// load complexity
					if (savedJSON.born_accessible.info['ba-complexity-level']) {
						var checkbox = document.querySelector('input[name="ba-complexity-level"][id="' + savedJSON.born_accessible.info['ba-complexity-level'] + '"]');
						if (checkbox) {
						    checkbox.click();
						}
						else {
						    console.log('Failed to se born accessible complexity ' + savedJSON.born_accessible.info['ba-complexity-level']);
						}
					}
				}
				
				if (savedJSON.born_accessible.hasOwnProperty('configuration')) {
					// set test exclusions
					if (savedJSON.born_accessible.configuration.hasOwnProperty('exclusions') && savedJSON.born_accessible.configuration.exclusions) {
						savedJSON.born_accessible.configuration.exclusions.forEach(function(type) {
							var checkbox = document.querySelector('#born_accessible #ba-test-exclusions input[value="' + type + '"]');
							if (checkbox) {
							    checkbox.click();
							}
							else {
							    console.log('Failed to set born accessible exclusion ' + type);
							}
						});
					}
				}
				
				// load test scores
				if (savedJSON.born_accessible.hasOwnProperty('scores')) {
					savedJSON.born_accessible.scores.forEach(function(test) {
						var field = document.getElementById(test.id);
						if (!field) {
							console.log('Could not set born accessible field with ID: ' + test.id);
						}
						else {
							if (test.hasOwnProperty('score') && test.score != '') {
							
								var selector = 'input';
								
								if (test.hasOwnProperty('score_id') && test.score_id != '') {
									// tests with same score value have IDs
									selector += '#' + test.score_id
								}
								
								else {
									// match by the value attribute
									selector += ':not([id])[value="' + test.score + '"]';
								}
								
								var score_input = field.querySelector(selector);
								if (score_input) {
								    score_input.checked = true;
								    bornAccessible.updateSectionScore(score_input);
									bornAccessible.setBackgroundStatus(score_input);
									bornAccessible.updateResultScore();
	
								}
								else {
								    console.log('Failed to set score ' + test.score + ' for ' + test.id)
								}
							}
							if (test.hasOwnProperty('note') && test.note != '') {
								var note_field = field.querySelector('textarea');
								if (note_field) {
								    note_field.value = test.note
								}
								else {
								    console.log('Failed to find note field for born accessible test ' + test.id);
								}
							}
						}
					});
				}
			}
			
			else {
				var test_types = [{id: 'images', aceID: 'images'}, {id: 'audio', aceID: 'audios'}, {id: 'video', aceID: 'videos'}, {id: 'javascript', aceID: 'scripts'}];
				
				test_types.forEach(function(test) {
					if (!savedJSON.data.hasOwnProperty(test.aceID) || !savedJSON.data[test.aceID]) {
						var checkbox = document.querySelector('#ba-test-exclusions input[value="' + test.id + '"]');
						if (checkbox) {
						    checkbox.click();
						}
						else {
						    console.log('Failed to set born accessible exclusion for ' + test.id);
						}
					}
				});
				
				if (!savedJSON.properties.hasOwnProperty('hasMathML') || !savedJSON.properties.hasMathML) {
					var checkbox = document.querySelector('#ba-test-exclusions input[value="math"]');
					if (checkbox) {
					    checkbox.click();
					}
					else {
					    console.log('Failed to set born accessible exclusion for MathML.');
					}
				}
			}
		}
	}
})();
