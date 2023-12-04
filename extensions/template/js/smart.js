
'use strict';

// change 'module' to module name in config.php
smart_extensions['module'] = (function() {
	/* 
	 * if setting a logo, array values are: [0] credential image url, [1] alt text, [2] link to credential info
	 * 
	 * example: var _LOGO = ['https://example.com/image.jpg', 'Certified by FooBar', 'https://example.com/moreinfo']
	 * 
	 * result: <a href="https://example.com/moreinfo"><img src="https://example.com/image.jpg" alt="Certified by FooBar"/></a>
	 */ 
	
	var _LOGO = [];
	
	return {
	
		LOGO: _LOGO,
		
		clear: function() {
			// called when the form is being reset - add code to clear extension tabs, if necessary
			 
		},
		
		validate: function() {
			
			var is_valid = true;
			
			// add any validation calls before generating HTML here
			
			return is_valid;
		},
		
		generateReport: function() {
			
			var reportHTML = document.createElement('section');
				reportHTML.setAttribute('class','js-tabcontent');
				reportHTML.setAttribute('id','module'); // change module to name of the module in config.php
			
			var tab_hd = document.createElement('h3');
				tab_hd.appendChild(document.createTextNode('Tab title')); // replace with actual title
			
			reportHTML.appendChild(tab_hd);
			
			// add code that generates additional HTML to include in the output report
			
			return reportHTML;
		},
		
		addReportSummaryProperty: function() {
			var property = {};
			
			/* 
			 * Adds an entry after the conformance result to the summary table in the report overview tab  
			 * 
			 * When adding a property, the following should always be set (with the exception of value_bg_class)
			 * 
			 * property.id = ''; unique id
			 * property.label = ''; label for the property
			 * property.value = ''; value for the property
			 * property.property = ''; vocabulary property to attach to value
			 * property.value_bg_class = ''; modify background colour used for the value
			 */
			
			return property;
		},
		
		saveData: function() {
		
			var JSON = {};
			
			/* 
			 * generate an JSON fragment that includes any data you need to save
			 * fragment is appended to the root of the saved data json object
			*/
			
			return JSON.toString();
		},
		
		
		loadData: function(JSON) {
			
			/*  use this function to reload data created in saveData function */
			
			if (JSON.hasOwnProperty('module') && JSON.module) { // change 'module' to extension name
				// saved report json
			}
			
			else {
				// ace report json
			}
		}
	}
	
})();
