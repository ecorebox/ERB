/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/
CKEDITOR.editorConfig=function(e){e.language="en",e.toolbar=[{name:"styles",items:["Styles","Format","Font","FontSize"]},{name:"paragraph",items:["NumberedList","BulletedList","-","Outdent","Indent","-","Blockquote","CreateDiv","-","JustifyLeft","JustifyCenter","JustifyRight","JustifyBlock","-","BidiLtr","BidiRtl"]},{name:"links",items:["Link","Unlink"]},{name:"basicstyles",items:["Bold","Italic","Strike","Subscript","Superscript","-","RemoveFormat"]},{name:"colors",items:["TextColor","BGColor"]},{name:"insert",items:["Image","Smiley","SpecialChar"]},{name:"tools",items:["Maximize","-","ShowBlocks"]},{name:"document",items:["Source"]}],e.removeDialogTabs="image:Link; image:Advanced;",e.filebrowserBrowseUrl="/ckeditor/attachment_files",e.filebrowserFlashBrowseUrl="/ckeditor/attachment_files",e.filebrowserFlashUploadUrl="/ckeditor/attachment_files",e.filebrowserUploadUrl="/ckeditor/attachment_files",e.filebrowserImageBrowseLinkUrl="/ckeditor/pictures",e.filebrowserImageBrowseUrl="/ckeditor/pictures",e.filebrowserImageUploadUrl="/ckeditor/pictures",e.filebrowserParams=function(){for(var e,t,i,r=document.getElementsByTagName("meta"),a=new Object,o=0;o<r.length;o++)switch(i=r[o],i.name){case"csrf-token":e=i.content;break;case"csrf-param":t=i.content;break;default:continue}return void 0!==t&&void 0!==e&&(a[t]=e),a},e.addQueryString=function(e,t){var i=[];if(!t)return e;for(var r in t)i.push(r+"="+encodeURIComponent(t[r]));return e+(-1!=e.indexOf("?")?"&":"?")+i.join("&")},CKEDITOR.on("dialogDefinition",function(t){var i,r,a=t.data.name,o=t.data.definition;CKEDITOR.tools.indexOf(["link","image","attachment","flash"],a)>-1&&(i=o.getContents("Upload")||o.getContents("upload"),r=null==i?null:i.get("upload"),r&&r.filebrowser&&void 0===r.filebrowser.params&&(r.filebrowser.params=e.filebrowserParams(),r.action=e.addQueryString(r.action,r.filebrowser.params)))})};