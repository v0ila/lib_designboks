var url = "designboks/script/ajax_pdf.php";

function generate_pdf(heightSVG,widthSVG,margin_top) {
	preview();
	var output_top = parseInt(margin_top);
	var globalscale_and_px_to_mm = globalscale/px_to_mm;
	var custom_page_size = [heightSVG,widthSVG];
	var json_string = JSON.stringify(canvas);
	var json_text = [];

	if (custom) {
		output_top = rect_template.top/globalscale_and_px_to_mm;
	}

	function Element(type,font,top,left,textTop,textLeft,height,textHeight,textWidth,width,angle,fill_r,fill_g,fill_b,layer,text,base64) {
		this.type = type;
		this.font = font;
		this.top = (top/globalscale_and_px_to_mm-output_top);
		this.left = ((left/globalscale_and_px_to_mm)-((orig_template_props[0].orig_width*px_to_mm/2)-(widthSVG/2)));
		this.textTop = (textTop/globalscale_and_px_to_mm-output_top);
		this.textLeft = ((textLeft/globalscale_and_px_to_mm)-((orig_template_props[0].orig_width*px_to_mm/2)-(widthSVG/2)));
		this.height = (height/globalscale_and_px_to_mm);
		this.textHeight = (textHeight/globalscale_and_px_to_mm);
		this.textWidth = (textWidth/globalscale_and_px_to_mm);
		this.width = (width/globalscale_and_px_to_mm);
		this.angle = angle;
		this.fill_r = fill_r;
		this.fill_g = fill_g;
		this.fill_b = fill_b;
		this.layer = layer;
		this.text = text;
		this.base64 = base64;
	}

	canvas.forEachObject(function(obj){
		function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
		function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
		function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
		function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}
		
		var base64 = '';
		var path = '';
		var textTop = '';
		var textLeft = '';
		var textHeight = '';
		var textWidth = '';
		var angle = '';

		if (obj.get('name') != "svg_group") {
			if (obj.get('name') != "template") {
				if (obj.get('name') != "template_container") {
					if (obj.get('name') != "overlay1") {
						if (obj.get('name') != "overlay2") {
							if(obj.get('name') != "overlay3") {
								if(obj.get('name') != "overlay4") {
									if (obj.get('name') != "margin") {
										if (obj.propertyName != "resize_false") {
											if (obj.get('type') == "image") {
												base64 = obj.getSrc();
												base64 = base64.substring(base64.indexOf(",") + 1);
												angle = obj.get('angle');
											} else if (obj.get('type') == "path") {
												var text1;
												var text3;
												path = obj;
												text = path.toSVG();
												text1 = text.split(' transform=')[0];
												text2 = ' transform="translate('+(-path.minX*path.scaleX)+' '+((path.height*path.scaleY)-((path.minY+path.height)*path.scaleY))+') rotate(0) scale('+(path.scaleX)+' '+(path.scaleY)+')"';
												base64 = '<svg id="svg1" viewBox="0 0 '+(path.width*path.scaleX)+' '+(path.height*path.scaleY)+'" preserveAspectRatio="none">'+text1+text2+' stroke-linecap="round" /></svg>';
												angle = obj.get('angle');
											} else if (obj.get('type') == "rect") {
												angle = obj.get('angle');
											}
											var new_element = new Element(
												obj.get('type'),
												obj.get('font'),
												obj.top,
												obj.left,
												textTop,
												textLeft,
												obj.get('currentHeight'),
												textHeight,
												textWidth,
												obj.get('currentWidth'),
												angle,
												hexToR(obj.fill),
												hexToG(obj.fill),
												hexToB(obj.fill),
												canvas.getObjects().indexOf(obj),
												obj.text,
												base64
											);
											json_text.push(new_element);
										}
									}
								}
							}
						}
					}
				}
			}
		} else {

			var svg_group = new fabric.Group([],{
				name: "svg_group"
			});

			var obj_layer = canvas.getObjects().indexOf(obj);
			var obj_top = obj.top;
			var obj_left = obj.left;
			var obj_height = (obj.height*obj.scaleY)/2;
			var obj_width = (obj.width*obj.scaleX)/2;
			//var obj_height = 0;
			//var obj_width = 0;

			var group = obj;
			var items = group._objects;
			group._restoreObjectsState();
			canvas.remove(group);

			for(var i = 0; i < items.length; i++) {
				canvas.add(items[i]);

				items[i].set({
					top:items[i].top+obj_height,
					left:items[i].left+obj_width,
				});
				items[i].moveTo(obj_layer);

				var text1;
				var text3;
				path = items[i];
				text = path.toSVG();
				text1 = text.split(' transform=')[0];
				text2 = ' transform="translate('+(-path.minX*path.scaleX)+' '+((path.height*path.scaleY)-((path.minY+path.height)*path.scaleY))+') rotate(0) scale('+(path.scaleX)+' '+(path.scaleY)+')"';
				base64 = '<svg id="svg1" viewBox="0 0 '+(path.width*path.scaleX)+' '+(path.height*path.scaleY)+'" preserveAspectRatio="none">'+text1+text2+' stroke-linecap="round" /></svg>';
				angle = path.get('angle');

				var new_element = new Element(
					path.get('type'),
					path.get('font'),
					path.top,
					path.left,
					textTop,
					textLeft,
					path.get('currentHeight'),
					textHeight,
					textWidth,
					path.get('currentWidth'),
					angle,
					hexToR(path.fill),
					hexToG(path.fill),
					hexToB(path.fill),
					canvas.getObjects().indexOf(path),
					path.text,
					base64
				);
				json_text.push(new_element);
				svg_group.addWithUpdate(items[i]);
				canvas.remove(items[i]);
			}
			canvas.add(svg_group);
			svg_group.set({
				top:obj.top,
				left:obj.left,
			});
			svg_group.setCoords();
			svg_group.moveTo(obj_layer);
			svg_group.hasRotatingPoint = false;
			canvas.renderAll();
		}
	});

	json_text.sort(function(a, b){
		return a.layer-b.layer
	});
	json_text = JSON.stringify(json_text);
	console.log("Sending..");
	ajax = $.ajax({
		type:"POST",
		url:url,
		data: {'data':json_text,'size':custom_page_size},
		cache:false,
		success: function(result) {
			console.log("Saved file!");
			back_to_editing();
		}
	});
	var url2 = "designboks/library/tcpdf/pdf_to_png.php";
	ajax = $.ajax({
		type:"POST",
		url:url2,
		cache:false,
		success: function(result) {

		}
	});
}