CKEDITOR.editorConfig = function( config ) {
  // Define changes to default configuration here. For example:
  config.language = 'en';

  // Toolbar configuration generated automatically by the editor based on config.toolbarGroups.
	config.toolbar = [
		{ name: 'styles', items: [ 'Styles', 'Format', 'Font', 'FontSize' ] },
		{ name: 'paragraph', items : [ 'NumberedList', 'BulletedList', '-', 'Outdent',
																	 'Indent', '-', 'Blockquote', 'CreateDiv', '-',
																	 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 
																	 'JustifyBlock', '-' ,'BidiLtr' ,'BidiRtl' ] },
		{ name: 'links', items: [ 'Link', 'Unlink' ] },
		{ name: 'basicstyles', items: [ 'Bold', 'Italic', 'Strike', 'Subscript', 
																		'Superscript', '-', 'RemoveFormat' ]	},
		{ name: 'colors', items: [ 'TextColor', 'BGColor' ] },
		{ name: 'insert', items: [ 'Image', 'Smiley', 'SpecialChar' ] },
		{ name: 'tools', items: [ 'Maximize', '-', 'ShowBlocks' ] },
    { name: 'document', items: [ 'Source' ] }
	];

  // Let's have it basic on dialogs as well.
  config.removeDialogTabs = 'image:Link; image:Advanced;';
  
  /* Filebrowser routes */
  // The location of an external file browser, that should be launched when "Browse Server" button is pressed.
  config.filebrowserBrowseUrl = "/ckeditor/attachment_files";

  // The location of an external file browser, that should be launched when "Browse Server" button is pressed in the Flash dialog.
  config.filebrowserFlashBrowseUrl = "/ckeditor/attachment_files";

  // The location of a script that handles file uploads in the Flash dialog.
  config.filebrowserFlashUploadUrl = "/ckeditor/attachment_files";

  // The location of a script that handles file uploads.
  config.filebrowserUploadUrl = "/ckeditor/attachment_files";
  
  // The location of an external file browser, that should be launched when "Browse Server" button is pressed in the Link tab of Image dialog.
  config.filebrowserImageBrowseLinkUrl = "/ckeditor/pictures";

  // The location of an external file browser, that should be launched when "Browse Server" button is pressed in the Image dialog.
  config.filebrowserImageBrowseUrl = "/ckeditor/pictures";

  // The location of a script that handles file uploads in the Image dialog.
  config.filebrowserImageUploadUrl = "/ckeditor/pictures";
  
  // Rails CSRF token
  config.filebrowserParams = function(){
    var csrf_token, csrf_param, meta,
        metas = document.getElementsByTagName('meta'),
        params = new Object();
    
    for ( var i = 0 ; i < metas.length ; i++ ){
      meta = metas[i];

      switch(meta.name) {
        case "csrf-token":
          csrf_token = meta.content;
          break;
        case "csrf-param":
          csrf_param = meta.content;
          break;
        default:
          continue;
      }
    }

    if (csrf_param !== undefined && csrf_token !== undefined) {
      params[csrf_param] = csrf_token;
    }
    
    return params;
  };
  
  config.addQueryString = function( url, params ){
    var queryString = [];

    if ( !params ) {
      return url;
    } else {
      for ( var i in params )
        queryString.push( i + "=" + encodeURIComponent( params[ i ] ) );
    }

    return url + ( ( url.indexOf( "?" ) != -1 ) ? "&" : "?" ) + queryString.join( "&" );
  };
  
  // Integrate Rails CSRF token into file upload dialogs (link, image, attachment and flash)
  CKEDITOR.on( 'dialogDefinition', function( ev ){
    // Take the dialog name and its definition from the event data.
    var dialogName = ev.data.name;
    var dialogDefinition = ev.data.definition;
    var content, upload;
    
    if (CKEDITOR.tools.indexOf(['link', 'image', 'attachment', 'flash'], dialogName) > -1) {
      content = (dialogDefinition.getContents('Upload') || dialogDefinition.getContents('upload'));
      upload = (content == null ? null : content.get('upload'));
      
      if (upload && upload.filebrowser && upload.filebrowser['params'] === undefined) {
        upload.filebrowser['params'] = config.filebrowserParams();
        upload.action = config.addQueryString(upload.action, upload.filebrowser['params']);
      }
    }
  });
};