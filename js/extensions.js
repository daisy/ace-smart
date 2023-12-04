
/* Extensions should be self-contained, but this function is
 * for those that need to make changes outside their tabs.
 */

function extension_scripts() {
    
    /* add a GCA credential to the distribution and result tabs */
    if (smart_extensions.hasOwnProperty('born_accessible')) {
    	bornAccessible.setGCACredential();
    }
}
