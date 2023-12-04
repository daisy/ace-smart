
/* 
 * Adapted from https://css-tricks.com/examples/DragAndDropFileUploading/
 */

	'use strict';

	;( function( $, window, document, undefined )
	{
		// feature detection for drag&drop upload

		var isAdvancedUpload = function()
			{
				var div = document.createElement( 'div' );
				return ( ( 'draggable' in div ) || ( 'ondragstart' in div && 'ondrop' in div ) ) && 'FormData' in window && 'FileReader' in window;
			}();


		// applying the effect for every form

		$( '.box' ).each( function()
		{
			var $form		 = $( this ),
				$input		 = $form.find( 'input[type="file"]' ),
				$label		 = $form.find( 'label' ),
				$errorMsg	 = $form.find( '.box__error span' ),
				$restart	 = $form.find( '.box__restart' )

			// automatically submit the form on file select
			$input.on( 'change', function( e )
			{
				$form.trigger( 'submit' );
			});


			// drag&drop files if the feature is available
			if( isAdvancedUpload )
			{
				$form
				.addClass( 'has-advanced-upload' )
				.on( 'drag dragstart dragend dragover dragenter dragleave drop', function( e )
				{
					e.preventDefault();
					e.stopPropagation();
				})
				.on( 'dragover dragenter', function() //
				{
					$form.addClass( 'is-dragover' );
				})
				.on( 'dragleave dragend drop', function()
				{
					$form.removeClass( 'is-dragover' );
				})
				.on( 'drop', function( e )
				{
					if (e.originalEvent.dataTransfer.files.length == 1) {
						$input.prop("files", e.originalEvent.dataTransfer.files);
						$form.trigger( 'submit' );
					}
					else {
						alert(smart_errors.uploadLimit[smart_lang]);
						return false;
					}
				});
			}


			// if the form was submitted

			$form.on( 'submit', function( e )
			{
				if( $form.hasClass( 'is-uploading' ) ) return false;
				$form.addClass( 'is-uploading' ).removeClass( 'is-error is-success' );
			});


			// restart the form if has a state of error/success

			$restart.on( 'click', function( e )
			{
				e.preventDefault();
				$form.removeClass( 'is-error is-success' );
				$input.trigger( 'click' );
			});

			// Firefox focus bug fix for file input
			$input
			.on( 'focus', function(){ $input.addClass( 'has-focus' ); })
			.on( 'blur', function(){ $input.removeClass( 'has-focus' ); });
		});
	})( jQuery, window, document );
