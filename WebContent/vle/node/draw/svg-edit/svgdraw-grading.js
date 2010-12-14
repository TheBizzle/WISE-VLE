function SVGDRAW() {
	this.descriptionActive = false;
	this.snapshotsActive = false;
	this.svgString = '';
	this.description = '';
	this.drawObj = null;
	this.snapObj = null;
	this.instructions = '';
	this.snapshots = [];
	this.nodeData = null;
	this.nodeTitle = '';
	this.loadModules(this);
}

SVGDRAW.prototype.loadModules = function(context){
	// load instructions here
	//this.instructions = '';
	
	var contentUrl = window.opener.$('#'+divId+'_contentUrl').text();
	
	$.getJSON(contentUrl, 
		function(data){
			context.nodeData = data;
			if(data.snapshots_active){
				context.snapshotsActive = data.snapshots_active;
			}
			if(data.description_active){
				context.descriptionActive = data.description_active;
			}
			if(data.prompt){
				context.instructions = data.prompt;
			}
			context.init(context);
	});
};

SVGDRAW.prototype.init = function(context){
	if (typeof(snapsLoaded) != 'undefined' && typeof(descriptionLoaded) != 'undefined' && typeof(promptLoaded) != 'undefined' && typeof(stampsLoaded) != 'undefined' &&
		snapsLoaded && descriptionLoaded && promptLoaded && stampsLoaded) {
		
		context.nodeTitle = window.opener.$('.objectToGradeTd').text();
		var drawObj = window.opener.$('#'+divId);
		var snapObj = window.opener.$('#'+divId+'_snaps');
		if(drawObj.length>0){
			context.svgString = xml2Str(drawObj[0].childNodes[0]);
			context.svgString = context.svgString.replace(/<svg.*>/, '<svg xmlns="http://www.w3.org/2000/svg" xmlns:se="http://svg-edit.googlecode.com" xmlns:xlink="http://www.w3.org/1999/xlink" width="600" height="450">');
			context.svgString = context.svgString.replace(/<g transform="scale(.*)">/gmi,'<g>');
			$('#tool_snapshot').remove();
			$('#snapshotpanel').remove();
			descriptionObj = window.opener.$('#'+divId+'_description');
			if(descriptionObj){
				//context.descriptionActive = true;
				context.description = descriptionObj.text();
			}
			
		} else if(snapObj.length>0){
			//context.snapshotsActive = true;
			var multiplier = 150/600;
			var snapHeight = 450 * multiplier;
			var snapWidth = 150;
			window.opener.$('#'+divId+'_snaps > .snapCell').each(function(index) {
				var current = this.childNodes[0];
				var svg = xml2Str(current);
				svg = svg.replace(/<svg.*>/, '<svg xmlns="http://www.w3.org/2000/svg" xmlns:se="http://svg-edit.googlecode.com" xmlns:xlink="http://www.w3.org/1999/xlink" width="600" height="450">');
				svg = svg.replace(/<g transform="scale(.*)">/gmi,'<g>');
				var description = window.opener.$('#'+divId+'_snap_'+index+'_description').text();
				var current = new Snapshot(svg,index,description);
				context.snapshots.push(current);
			});
			svgEditor.loadSnapshots(context.snapshots);
		}
		this.initDisplay(context);
	}
	else {
		setTimeout(function(){
			context.init(context);
		},100);
	}
};

SVGDRAW.prototype.initSnapshots = function(context){
	if(svgEditor.snapshots.length>0){
		svgEditor.openSnapshot(0);
		$('#description_content').html(svgEditor.snapshots[0].description);
		$("#snap_images").attr({ scrollTop: 0 });
	} else {
		setTimeout(function(){
			context.initSnapshots(context);
		},100);
	}
};

SVGDRAW.prototype.initDisplay = function(context){
	svgEditor.setIconSize('m');
	
	// initialize prompt
	if(context.instructions!=''){
		$('#prompt_text').html(context.instructions);
	} else {
		$('#tool_prompt').remove();
	}
	
	// initialize snapshot display
	if(context.snapshotsActive==true){
		context.initSnapshots(context);
	} else {
		svgEditor.loadFromString(context.svgString);
	}
	
	// initialize description/annotation
	if(context.descriptionActive == true){
		$('#description').css('left','8px');
		if (context.snapshotsActive == true) { // check whether snapshots are active
			$('#workarea').css('bottom','36px');
			$('#description_content').unbind('keyup');
			
			
			// update description input focus function to accommodate snapshots
			$('#description_content').unbind('focus');
			$('#description_content').focus(function(){
				for (var i=0; i<svgEditor.snapshots.length; i++) { // TODO: this is just a double check (should be removed eventually)
					if (svgEditor.snapshots[i].id == svgEditor.active) {
						$('#description_content').val(svgEditor.snapshots[i].description);
					}
				}
				if($('#sidepanels').width()<3){
					svgEditor.toggleSidePanel();
				}
			});
			
			$('#loop, #play').mouseup(function(){
				$('#workarea').css('bottom','36px');
				$('#description').hide();
				$('#fit_to_canvas').mouseup();
			});
			
			$('#pause').mouseup(function(){
				$('#workarea').css('bottom','158px');
				$('#description').show();
				$('#fit_to_canvas').mouseup();
			});
			
			$('.description_header_text').html('Snapshot Description<span>&nbsp;(Enter your text in the box below)</span>');
			
			$('#description_collapse').remove();
			
			// update snapCheck function to include description modifications
			svgEditor.snapCheck = function(){
				if(svgEditor.playback == "pause"){
					if(svgEditor.warningStackSize == svgCanvas.getUndoStackSize()){
						for (var i=0; i<svgEditor.snapshots.length; i++){
							if(svgEditor.snapshots[i].id == svgEditor.active){
								svgEditor.index = i;
								$('#description_content').val(svgEditor.snapshots[i].description);
								//$('#draw_description_content').html(svgEditor.snapshots[i].description);
								$('#description').show();
								svgEditor.selected = true;
								break;
							}
							else {
								svgEditor.index = -1;
								svgEditor.selected = false;
								$('#description').hide();
							}
						}
						svgEditor.updateClass(svgEditor.index);
					} else {
						svgEditor.selected = false;
						$('#description').hide();
						$('#workarea').css('bottom','36px');
						svgEditor.updateClass(-1);
						//$('#fit_to_canvas').mouseup();
					}
					svgEditor.toggleDescription(false);
				}
			};
			
			// update toggleSidePanel function to accommodate for description input
			svgEditor.toggleSidePanel = function(close){
				var SIDEPANEL_OPENWIDTH = 205;
				var w = parseInt($('#sidepanels').css('width'));
				var deltax = (w > 2 || close ? 2 : SIDEPANEL_OPENWIDTH) - w;
				var sidepanels = $('#sidepanels');
				var layerpanel = $('#layerpanel');
				$('#description').css('right', parseInt(workarea.css('right'))+deltax);
				workarea.css('right', parseInt(workarea.css('right'))+deltax);
				sidepanels.css('width', parseInt(sidepanels.css('width'))+deltax);
				layerpanel.css('width', parseInt(layerpanel.css('width'))+deltax);
				if(svgEditor.playback == 'pause'){
					svgEditor.toggleDescription();
				} else {
					$('#workarea').css('bottom','36px');	
				}
			};
			
			svgEditor.toggleDescription = function(resize){
				if(resize==false){
					doResize = false;
				} else {
					doResize = true;
				}
				if($('#sidepanels').width()<3){
					if(svgEditor.selected==true){
						$('#workarea').css('bottom','98px');
						$('#description').css('height','74px');
						$('#description_content').css('height','15px');
						$('description').show();
						$('#description_edit').show();
					} else {
						$('#workarea').css('bottom','36px');
						$('description').hide();
					}
					if(doResize==true){
						// resize window to fit canvas
						var height, width;
						if(window.outerHeight){
							height = window.outerHeight;
							width = window.outerWidth;
							window.resizeTo(width+1,height+1);
						} else { // for IE
							height = document.body.clientWidth; 
							width = document.body.clientHeight;
							self.resizeTo(width+1,height+1);
						}
					} else {
						$('#fit_to_canvas').mouseup();
					}
				} else {
					if(svgEditor.selected==true){
						$('#workarea').css('bottom','158px');
						$('#description').css('height','134px');
						$('#description_content').css('height','75px');
						$('description').show();
						$('#description_edit').hide();
					} else {
						$('#workarea').css('bottom','36px');
						$('description').hide();
					}
					if(doResize==true){
						// resize window to fit canvas
						var height, width;
						if(window.outerHeight){
							height = window.outerHeight;
							width = window.outerWidth;
							window.resizeTo(width-1,height-1);
						} else { // for IE
							height = document.body.clientWidth; 
							width = document.body.clientHeight;
							self.resizeTo(width-1,height-1);
						}
					} else {
						$('#fit_to_canvas').mouseup();
					}
				}
			};
			$('.description_header_text').text('Description of Snapshot:');
			
		} else {
			if(context.description && context.description!=""){
				svgEditor.description = context.description;
				//$('#draw_description').show();
				$('#description_content').html(context.description);
				//setTimeout(function(){
					//$('#description_content').css({'left':$('#description_header').width()+12,'right':$('#edit_description').width()+12});
				//},500);
				// TODO: Once Firefox supports text-overflow css property, remove this (and jquery.text-overflow.js plugin)
				//$('#draw_description_content').ellipsis();
			} /*else if (context.defaultDescription!="") {
				svgEditor.description = context.defaultDescription;
				$('#description_content').html(context.defaultDescription);
			}*/
			$('.description_header_text').text('Description of Drawing:');
		}
		$('#description_edit').text('Expand');
		$('#description_content').attr('disabled','disabled').css('color','#000000');
		
	} else if(context.descriptionActive == false){
		//$('#tool_description').remove();
		$('#description').remove();
		$('#workarea').css('bottom','36px');
		//$('#fit_to_canvas').mouseup();
	}
	
	// update teacher view display (editing tools disabled for now)
	$('#zoom_panel').show().css({'margin':'0','height':'32px'});
	$('#zoom_panel > .tool_sep').remove();
	$('#history_panel').hide();
	$('#tools_top').css({'margin-top':'4px','height':'34px'});
	$('#tools_left').hide();
	$('#workarea').css({'top':'36px','left':'8px'});
	$('#sidepanels').css('top','36px');
	$('#tools_bottom').css('left','10px');
	$('#snapshot_tools').remove();
	$('#snap_images').css('top','4px');
	$('.snap_delete').hide();
	$('#tools_top > div').each(function(){
		if($(this).attr('id') != 'tool_prompt' && $(this).attr('id') != 'tool_snapshot'){
			$(this).remove();
		}
	});
	var titleDiv = '<div id="node_title" style="font-size:1.1em; font-weight:bold; left:8px; position:absolute;">Student Work for Step '+context.nodeTitle+'</div>';
	$('#tools_top').prepend(titleDiv);
	$('#snap_images').sortable('destroy');
	
	setTimeout(function(){
		//$('#fit_to_canvas').mouseup();
		// resize window to fit canvas
		var height, width;
		if(window.outerHeight){
			height = window.outerHeight;
			width = window.outerWidth;
			window.resizeTo(width+1,height+1);
		} else { // for IE
			height = document.body.clientWidth; 
			width = document.body.clientHeight;
			self.resizeTo(width+1,height+1);
		}
		$('#closepath_panel').insertAfter('#path_node_panel');
		$('#tool_prompt').insertAfter('#tool_snapshot');
		if(context.snapshotsActive==true){
			svgEditor.toggleSidePanel(false);
		}
	},500);
};

function Snapshot(svg, id, description){
	this.svg = svg;
	this.id = id;
	if(description)	{
		this.description = description;
	} else {
		this.description = '';
	}
};
	
function xml2Str(xmlNode){
  try {
    // Gecko-based browsers, Safari, Opera.
    return (new XMLSerializer()).serializeToString(xmlNode);
  }
  catch (e) {
    try {
      // Internet Explorer.
      return xmlNode.xml;
    }
    catch (e)
    {//Strange Browser ??
     alert('XMLSerializer not supported');
    }
  }
  return false;
};