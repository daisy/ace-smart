
<?php

	class SMART_EXTENSIONS {
		
		private $ext_module_access = '';
		private $extension = '';
		private $ace_extension_tabs = '';
		
		function __construct($modules, $extension) {
			$this->ext_module_access = explode(' ', $modules);
			$this->extension = $extension;
		}
	
		public function print_css() {
			if ($this->ext_module_access) {
				foreach ($this->ext_module_access as $module) {
					if (array_key_exists($module, $this->extension)) {
						echo '<link rel="stylesheet" type="text/css" href="extensions/' . $module . '/css/smart.css"/>';
					}
				}
			}
		}
		
		public function print_tabs() {
			$this->ace_extension_tabs = array();
			
			if ($this->ext_module_access) {
				foreach ($this->ext_module_access as $module) {
					if (array_key_exists($module, $this->extension) && array_key_exists('tab', $this->extension[$module])) {
						foreach ($this->extension[$module]['tab'] as $key => $value) {
							echo '<li class="js-tablist__item"><a href="#' . $key . '" id="label_' . $key . '" class="js-tablist__link">' . $value . '</a></li>';
							$ext_js_object = "{id: '" . $key . "', label: '" . str_replace("'", "\\'", $value) . "'}";
							array_push($this->ace_extension_tabs, $ext_js_object);
						}
					}
				}
			}
		}
		
		public function add_tab_includes() {
			if ($this->ext_module_access) {
				foreach ($this->ext_module_access as $module) {
					if (array_key_exists($module, $this->extension) && array_key_exists('tab', $this->extension[$module])) {
						foreach ($this->extension[$module]['tab'] as $key => $value) {
							include 'extensions/' . $module . '/tab/' . $key . '.html';
						}
					}
				}
			}
		}
		
		public function add_output_options() {
			if ($this->ext_module_access) {
				foreach ($this->ext_module_access as $module) {
					if (array_key_exists($module, $this->extension) && array_key_exists('output_options', $this->extension[$module])) {
						include 'extensions/' . $module . '/includes/output_options.html';
					}
				}
			}
		}
		
		public function print_scripts() {
			if ($this->ext_module_access) {
				foreach ($this->ext_module_access as $module) {
					if (array_key_exists($module, $this->extension)) {
						echo '<script src="extensions/' . $module . '/js/smart.js" defer></script>';
					}
				}
				if ($this->ace_extension_tabs) {
					echo '<script>';
					foreach ($this->ace_extension_tabs as $tab) {
						echo 'smartReport.addExtensionTab(' . $tab . ');';
					}
					echo '</script>';
				}
			}
		}
	}

?>