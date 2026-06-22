
/* Extensions should be self-contained, but this function is
 * for those that need to make changes outside their tabs.
 */

function extension_scripts() {
    
    /* add a GCA credential to the result tabs */
    if (smart_extensions.hasOwnProperty('born_accessible')) {
    	if (gca_credential) {
	    	bornAccessible.setGCACredential();
    	}
    	else {
    		document.getElementById('credential_field').style.display = 'none';
    	}
    }
}
