var previous_menu,grid,round_left,round_top;
var grid_active = false;

function background(color) {
	if (custom) {
		canvas.forEachObject(function(obj){
			if (obj.name == "template") {
				obj.fill = color;
				canvas.renderAll();
			}
			if (obj.name == "margin") {
				obj.fill = color;
				canvas.renderAll();
			}
			if (obj.name == "rect_background") {
				obj.fill = color;
				canvas.renderAll();
			}
		});
	} else {
		background_color.set({fill:color});
		canvas.renderAll();
	}
}

function copy() {
	var obj = canvas.getActiveObject();
	var group = canvas.getActiveGroup();
	canvas.renderAll();
	//console.log(group);
	if (obj != null) {
		if (fabric.util.getKlass(obj.type).async) {
			//console.log("async");
			if (obj.get('text')) {
				//console.log(obj.get('text'));
			}
			obj.clone(function (clone) {
				clone.set({
					text:obj.get('text'),
					font:obj.get('font'),
					borderColor: '#3498db',
					cornerColor: '#2c3e50',
					cornerSize: 12,
					transparentCorners: true,
					angle:clone.get('angle'),
					left:100,
					top:100
				});
				canvas.add(clone);
				canvas.renderAll();
			});
		} else {
			//console.log("not async, one object");
			var new_obj = obj.clone();
			new_obj.set({
				borderColor: '#3498db',
				cornerColor: '#2c3e50',
				cornerSize: 12,
				angle:obj.get('angle'),
				transparentCorners: true,
				left:0,
				top:50
			});
			canvas.add(new_obj);
			canvas.renderAll();
			new_obj.animate('top', new_obj.getTop() === 0 ? 400 : 100, {
		      duration: 200,
		      onChange: canvas.renderAll.bind(canvas),
		      easing: fabric.util.ease['easeOutCubic']
		    });
		}
	} else if (group != null) {
		//console.log("group async");
		for (var i = 0; i < group.objects.reverse().length; i++) {
			//console.log(group.objects[i].get('type'));
			if (group.objects[i].get('type') != 'rect') {
				group.objects[i].clone(function (clone) {
					clone.set({
						borderColor: '#3498db',
						cornerColor: '#2c3e50',
						cornerSize: 12,
						transparentCorners: true,
						angle:clone.get('angle'),
						left:clone.get('left')+100,
						top:clone.get('top')+100,
					});
					canvas.add(clone);
					canvas.renderAll();
				});
			} else {
				var new_obj = group.objects[i].clone();
				new_obj.set({
					angle:group.objects[i].get('angle'),
					borderColor: '#3498db',
					cornerColor: '#2c3e50',
					cornerSize: 12,
					transparentCorners: true,
					left:group.objects[i].get('left')+100,
					top:group.objects[i].get('top')+100,
				});
				canvas.add(new_obj);
				canvas.renderAll();
			}
		}
	}
}

function add_image() {
	//console.log("add image");
	document.getElementById("file_input").value='';
	document.getElementById('file_input').onchange = function handleImage(e) {
		var reader = new FileReader();
		reader.onload = function (event) {
			if (event.target.result.indexOf("/pdf") > -1) {
				//console.log("pdf!");
				//console.log(event);
				ajax = $.ajax({
					type:"GET",
					url:"library/tcpdf/pdf_to_jpg.php",
					cache:false,
					success: function(result) {
						//console.log(result);
						//console.log("WORK IN PROGRESS");
					}
				});
			} else {
				//console.log("not a pdf");
				var imgObj = new Image();
				imgObj.src = event.target.result;
				imgObj.onload = function () {
					var image = new fabric.Image(imgObj);
					image.set({
						borderColor: '#3498db',
					    cornerColor: '#2c3e50',
					    cornerSize: 12,
					    transparentCorners: true,
						left: 0,
						top: 100,
						scaleY:globalscale,
						scaleX:globalscale,
						propertyName:"resize_true"
					});
					image.lockUniScaling = true;
					canvas.add(image);
					image.centerH().centerV();
					image.setCoords();
					canvas.renderAll();
					image.on('selected', function(object) {
						$("#fontFamily_list").hide();
						$("#textColor").hide();
					});
				}
			}
		}
		reader.readAsDataURL(e.target.files[0]);
	}
}

function generate_text_font_list() {
	ajax = $.ajax({
		type:"GET",
		url:"designboks/script/ajax_font.php",
		cache:false,
		success: function(result) {
			var result = JSON.parse(result);
			result.sort();
			//console.log("generate");
			for (var i = 0; i < result.length; i++) {
				var url = result[i];
				var value = result[i].split("fonts/")[1].split('.')[0];
				$("head").prepend("<style type=\"text/css\">" + 
                                "@font-face {\n" + 
                                    "\tfont-family: "+value+";\n" + 
                                    "\tsrc: local('☺'), url('designboks/designboks/"+url+"') format('opentype');\n" + 
                                "}\n" + 
                                    "\tp.myClass {\n" + 
                                    "\tfont-family: "+value+" !important;\n" + 
                                "}\n" + 
                            "</style>");
				$("#menu_drop").append("<div style='font-family:"+value+";' class=\"font-select\" id="+value+">"+value+"</div>");
			}
			$("#add_text_value").css("font-family",result[0].split("fonts/")[1].split('.')[0]);
			$(".text_show").text(result[0].split("fonts/")[1].split('.')[0]).css("font-family",result[0].split("fonts/")[1].split('.')[0]);
			var active;
			$(document).on("click",".text_show",function(){
				active = true;
				$(".menu_drop").slideDown("fast");
			});
			$(document).on("click",".font-select",function(){
				active = false;
				$(".menu_drop").hide();
				$("#add_text_value").css("font-family",this.id);
				$(".text_show").text(this.id).css("font-family",this.id);
			});
			$(document).on("click",".canvas-container",function(){
				$(".menu_drop").hide();
			});
		}
	});
}

function add_text(text,left,top,height,width,font,color,angle,scaleY,scaleX) {
	var scaleY_edit;
	var scaleX_edit;
	if (scaleY == undefined) {
		scaleY_edit = 1;
		scaleX_edit = 1;
	} else {
		scaleY_edit = scaleY;
		scaleX_edit = scaleX;
	}
	//console.log(scaleY_edit+" "+scaleX_edit);
	var textfont = font;
	opentype.load('designboks/library/opentype/fonts/'+font+'.ttf', function (err, font) {
	//opentype.load('library/opentype/fonts/ZOMBIE.TTF', function (err, font) {
	    if (!err) {
			var font_path = font.getPath(text, 0, 0, (50));
			var font_string = '';
			function generate_font_string(scale_value) {
				var scale_value = scale_value;
				for (var i = 0; i < font_path.commands.length; i++) {
					font_string = font_string+font_path.commands[i]['type']+" ";
					if (font_path.commands[i]['x1'] || font_path.commands[i]['x2'] != undefined) {
						font_string = font_string+(font_path.commands[i]['x1']/scale_value)+",";
						font_string = font_string+(font_path.commands[i]['y1']/scale_value);
						font_string = font_string+",";
					}
					if (font_path.commands[i]['x'] || font_path.commands[i]['y'] != undefined) {
						font_string = font_string+(font_path.commands[i]['x']/scale_value)+",";
						font_string = font_string+(font_path.commands[i]['y']/scale_value);
					}
					font_string = font_string+" ";
				}
			}
			generate_font_string(1);
			//console.log(font_string);
			var path = new fabric.Path(font_string);
			path.set({
				text: text,
				font: textfont,
				fill: color,
				left: left,
				top: top,
				angle:angle,
				borderColor: '#3498db',
			    cornerColor: '#2c3e50',
			    cornerSize: 12,
			    transparentCorners: true,
			    scaleY:scaleY_edit,
			    scaleX:scaleX_edit,
			    name:"text"
			});
			//console.log(path);
			canvas.add(path);
			path.centerH().setCoords();
			path.centerV().setCoords();
			canvas.renderAll();
			path.on('selected', function(object) {
				$("#fontFamily_list").hide();
				$("#textColor").hide();
			});
			canvas.on('selection:cleared', function() {
				
			});
		}
	});
}

function add_line(color) {
	//console.log("add line");
	var rect = new fabric.Rect({
		borderColor: '#3498db',
		cornerColor: '#2c3e50',
		cornerSize: 12,
		transparentCorners: true,
		width: 150, 
		height: 30, 
		fill: color, 
		left: 0, 
		top:50
	});
	canvas.add(rect);

	rect.animate('top', rect.getTop() === 0 ? 400 : 100, {
      duration: 200,
      onChange: canvas.renderAll.bind(canvas),
      easing: fabric.util.ease['easeOutCubic']
    });

	rect.on('selected', function(object) {
		$("#textColor").val(rect.fill);
		
		$("#fontFamily_list").hide();
	});
	canvas.on('selection:cleared', function() {
		
	});
	$("#textColor").change(function(){
		change_color_properties(rect);
	});
}

function preview() {
	//console.log("preview");
	$(".upload").fadeOut("fast");
	$(".upload_menu").slideDown("fast");
	$(".menu-container").hide();
	canvas.deactivateAllWithDispatch();
	canvas.selection = false;
	canvas.forEachObject(function(o) {
		o.selectable = false;
	});
	if (!custom) {
		group.set({opacity:1});
	} else {
		rect_template_overlay1.set({ opacity:1 });
		rect_template_overlay2.set({ opacity:1 });
		rect_template_overlay3.set({ opacity:1 });
		rect_template_overlay4.set({ opacity:1 });
	}
	remove_grid();
	hideContainers_removeClasses();
	canvas.renderAll();
}

function back_to_editing() {
	$(".upload").show();
	$(".menu-container").show();
	$(".upload_menu").hide();
	$("#gridcheck b").text("Inschakelen");
	$("#slider").hide();
	canvas.selection = true;
	canvas.forEachObject(function(o) {
		o.selectable = true;
	});
	if (custom) {
		rect_template_overlay1.set({ opacity:0.6,selectable:false,hasControls:false,hasBorders:false,evented:false });
		rect_template_overlay2.set({ opacity:0.6,selectable:false,hasControls:false,hasBorders:false,evented:false });
		rect_template_overlay3.set({ opacity:0.6,selectable:false,hasControls:false,hasBorders:false,evented:false });
		rect_template_overlay4.set({ opacity:0.6,selectable:false,hasControls:false,hasBorders:false,evented:false });

		rect_template_container.set({
			selectable:false,
			hasControls:false,
			hasBorders:false,
			evented:false
		});
		rect_background.set({
			selectable:false,
			hasControls:false,
			hasBorders:false,
			evented:false
		});
		rect_template.set({
			selectable:false,
			hasControls:false,
			hasBorders:false,
			evented:false
		});
		rect_template_margin.set({
			selectable:false,
			hasControls:false,
			hasBorders:false,
			evented:false
		});
	} else {
		group.set({opacity:0.6,selectable:false,evented:false});	
		background_color.set({
			selectable:false,
			hasControls:false,
			hasBorders:false,
			evented:false
		});
	}
	canvas.renderAll();
	keep_group_on_front();
	showPreviousMenu(previous_menu);
}

function remove_selected(obj) {
	if(canvas.getActiveGroup()) {
		canvas.getActiveGroup().forEachObject(function (o){ 
			canvas.remove(o);
		});
		canvas.discardActiveGroup().renderAll();
	} else {
		canvas.remove(obj);
	}
}

function layer_up(obj) {
	if(canvas.getActiveGroup()) {
		canvas.getActiveGroup().forEachObject(function (o){ 
			canvas.bringForward(o);
		});
	} else {
		canvas.bringForward(obj);
	}
	canvas.renderAll();
	keep_group_on_front();
}

function layer_down(obj) {
	if(canvas.getActiveGroup()) {
		canvas.getActiveGroup().forEachObject(function (o){
			canvas.sendBackwards(o);
		});
	} else {
		canvas.sendBackwards(obj);
	}
	canvas.renderAll();
	keep_group_on_front();
}

function center_h(obj) {
	for (var i = 0; i < obj.objects.length; i++) {
		var width = obj.objects[i].oCoords.br.x - obj.objects[i].oCoords.tl.x;
		obj.objects[i].left = -(width/2);
		//console.log(obj.objects[i].left);
	}
	obj.setCoords();
	canvas.renderAll();
}

function center_h_c(obj) {
	obj.centerH().setCoords();
	canvas.renderAll();
}

function center_v(obj) {
	//console.log(obj);
	obj.centerV().setCoords();
	canvas.renderAll();
}

function outline_left(obj) {
	for (var i = 0; i < obj.objects.length; i++) {
		var left;
		var offset = obj.objects[i].oCoords.tl.x - obj.objects[i].oCoords.bl.x;
		if (obj.objects[i].oCoords.tl.x >= obj.objects[i].oCoords.tr.x) {
			offset = offset+(obj.objects[i].oCoords.tl.x - obj.objects[i].oCoords.tr.x);
		}
		if (obj.objects[i].oCoords.tr.x <= obj.objects[i].oCoords.br.x) {
			offset = offset+(obj.objects[i].oCoords.br.x - obj.objects[i].oCoords.tr.x);
		}
		if (offset >= 0) {
			left = -(obj.width/2)+offset;
		} else {
			left = -(obj.width/2);
		}
		obj.objects[i].left = left;
	}
	obj.setCoords();
	canvas.renderAll();
}

function outline_right(obj) {
	for (var i = 0; i < obj.objects.length; i++) {
		var width = obj.objects[i].oCoords.tr.x - obj.objects[i].oCoords.tl.x;
		var left = ((obj.width/2)-width);
		if (obj.objects[i].oCoords.tr.x <= obj.objects[i].oCoords.br.x) {
			left = left-(obj.objects[i].oCoords.br.x - obj.objects[i].oCoords.tr.x);
		}
		if (obj.objects[i].oCoords.tl.x >= obj.objects[i].oCoords.tr.x) {
			left = left-(obj.objects[i].oCoords.tl.x - obj.objects[i].oCoords.tr.x);
		}
		//console.log(left);
		obj.objects[i].left = left;
	}
	obj.setCoords();
	canvas.renderAll();
}

function center_obj(obj) {
	var top_values = new Array();
	for (var i=0; i < obj.objects.length; i++){
		top_values.push(obj.objects[i].top);
	}
	var lowest = Math.max.apply(Math,top_values);
	var highest = Math.min.apply(Math,top_values);

	for (var i = 0; i < obj.objects.length; i++) {
		if (obj.objects[i].top == lowest) {
			//obj.objects[i].fill = 'blue';
		} else if (obj.objects[i].top == highest) {
			//obj.objects[i].fill = 'red';
		} else {
			var height = (obj.objects[i].oCoords.br.y - obj.objects[i].oCoords.tl.y);
			//obj.objects[i].fill = 'green';
			//console.log(-height/2);
			obj.objects[i].top = -(height/2);
		}
		canvas.renderAll();
	}
	obj.setCoords();
}

function lockObject() {
	if (canvas.getActiveGroup()) {
		var objects = canvas.getActiveGroup()._objects;
		for (var i = 0; i < objects.length; i++) {
			if (objects[i].lockMovementX == true) {
				objects[i].lockMovementX = false;
				objects[i].lockMovementY = false;
			} else {
				objects[i].lockMovementX = true;
				objects[i].lockMovementY = true;
			}
		}
		if ($("#lock").css("background-color") == "rgb(217, 83, 79)") {
			for (var i = 0; i < objects.length; i++) {
				objects[i].lockMovementX = false;
				objects[i].lockMovementY = false;
			}
		}
	} else if (canvas.getActiveObject()) {
		var object = canvas.getActiveObject();
		if (object.lockMovementX == false) {
			object.lockMovementX = true;
			object.lockMovementY = true;
		} else {
			object.lockMovementX = false;
			object.lockMovementY = false;
		}
	}
	canvas.renderAll();
	checkLock();
}

function checkLock() {
	if (canvas.getActiveObject()) {
		var object = canvas.getActiveObject();
		if (object.lockMovementX == false) {
			object.hasControls = true;
			$("#lock").css({
				"background-color":"rgb(219, 219, 219)",
				"color":"#545454",
			});
			$(".lock-container").css({
				"margin-top":"21px",
				"float":"right"
			});
			$(".lock-container b").text("Object vergrendelen");
		} else {
			object.hasControls = false;
			$("#lock").css("background-color","#d9534f").css("color","white");
			$(".lock-container").css({
				"margin-top":"21px",
				"float":"right"
			});
			$(".lock-container b").text("Object ontgrendelen");
		}
	} else if (canvas.getActiveGroup()) {
		var objects = canvas.getActiveGroup()._objects;
		var same;
		for (var i = 0; i < objects.length; i++) {
			if (objects[i].lockMovementX == false) {
				same = true;
			} else {
				same = false;
				break;
			}
		}
		if (same) {
			$("#lock").css("background-color","rgb(219, 219, 219)").css("color","#545454");
			$(".lock-container").css({
				"margin-top":"0px",
				"float":""
			});
			$(".lock-container b").text("Groep vergrendelen");
		} else {
			$("#lock").css("background-color","#d9534f").css("color","white");
			$(".lock-container").css({
				"margin-top":"0px",
				"float":""
			});
			$(".lock-container b").text("Groep ontgrendelen");
		}
	}
	canvas.renderAll();
}

function create_grid(size) {
	grid_active = true;
	grid = size;
	canvas.forEachObject(function(obj) {
		if (obj.get('type') == 'line') {
			canvas.remove(obj);
		}
	});
	for (var i = 0; i < (canvas.width / grid); i++) {
		var line_x = new fabric.Line([ i * grid, 0, i * grid, canvas.width], { stroke: '#ccc', selectable: false });
		var line_y = new fabric.Line([ 0, i * grid, canvas.width, i * grid], { stroke: '#ccc', selectable: false });
		canvas.add(line_x);
		canvas.add(line_y);
		canvas.sendToBack(line_x);
		canvas.sendToBack(line_y);
	}
	canvas.on('object:moving', function(options) {
		if (grid_active) {
			round_left = Math.round(options.target.left / grid) * grid;
			round_top = Math.round(options.target.top / grid) * grid;
		} else {
			round_left = options.target.left;
			round_top = options.target.top;
		}
		options.target.set({
			left: round_left,
			top: round_top
		});
	});
	canvas.renderAll();
}

function remove_grid() {
	grid_active = false;
	canvas.forEachObject(function(obj) {
		if (obj.get('type') == 'line') {
			canvas.remove(obj);
		}
	});
	canvas.renderAll();
}

function show_grid_slider() {
	if ($("#gridcheck b").text() == "Inschakelen") {
		create_grid(15);
		$("#gridcheck").css({"background_color":"#d9534f"});
		$("#gridcheck b").text("Uitschakelen");
		$("#slider").show();
	} else {
		remove_grid();
		$("#gridcheck b").text("Inschakelen");
		$("#slider").hide();
	}
}

function editObject() {
	canvas.on('object:selected', function(obj) {
		$("#measure_title").html("Afmetingen van geselecteerde object");
		$(".lock-container").show();
		$(".image_container").hide();
		$(".image_text").hide();
		checkLock();
		getMeasures();
		hideContainers_removeClasses();
		$(".measure-container").show();
		$("#align_template").show().css("float","");
		var name = obj.target.get('name');
		var property = obj.target.propertyName;
		if (canvas.getActiveGroup()) {
			var type;
			var same;
			$("#measure_title").html("");
			$(".measure-container").hide();
			$("#align_template").show().css("float","right");
			hideMenu();
			for (var i = 0; i < canvas.getActiveGroup()._objects.length; i++) {
				type = canvas.getActiveGroup()._objects[0].get('type');
				name = canvas.getActiveGroup()._objects[0].get('name');
				if (canvas.getActiveGroup()._objects[i].get('name') == name) {
					same = true;
				} else {
					same = false;
					break;
				}
			}
			if (same) {
				if (name == "clipart") {
					//console.log("clipart");
					showClipArt();
					$("#align_template").show().css("float","right");
					$("#new_rect").hide();
					$("#edit_rect").show();
					$("#edit_rect_color").val(obj.target.get('fill'));
					$(".edit_rect").click(function(){
						if (canvas.getActiveGroup()) {
							for (var i = 0; i < canvas.getActiveGroup()._objects.length; i++) {
								canvas.getActiveGroup()._objects[i].set('fill',$("#edit_rect_color").val());
							}
						}
						canvas.renderAll();
					});
				} else if (name == "text") {
					showText();
					$("#align_template").show().css("float","right");
					$("#new_text").hide();
					$("#edit_text").show();
					$("#edit_text_color").val(obj.target.get('fill'));
					$(".edit_text").click(function(){
						if (canvas.getActiveGroup()) {
							for (var i = 0; i < canvas.getActiveGroup()._objects.length; i++) {
								canvas.getActiveGroup()._objects[i].set('fill',$("#edit_text_color").val());
							}
						}
						canvas.renderAll();
					});
				} else if (name == "svg_group") {
					//console.log("clipart");
					showClipArt();
					$("#align_template").show().css("float","right");
					$("#new_rect").hide();
					$("#edit_rect").show();
					$("#edit_rect_color").val(obj.target.get('fill'));
					$(".edit_rect").click(function(){
						if (canvas.getActiveGroup()) {
							for (var i = 0; i < canvas.getActiveGroup()._objects.length; i++) {
								canvas.getActiveGroup()._objects[i].set('fill',$("#edit_rect_color").val());
							}
						}
						canvas.renderAll();
					});
				}
			}
		} else if (property == 'resize_false') {
			$(".image_container").show();
			$(".image_text").show();
			showUpload();
			//console.log("Image too big");
			$(".upload_container").hide();
		} else if (property == 'resize_true') {
			$(".image_container").hide();
			$(".image_text").hide();
			//console.log("Image");
			showUpload();
			$(".upload_container").hide();
		} else if (obj.target.get('name') == 'clipart' || obj.target.get('name') == 'svg_group') {
			showClipArt();
			$("#new_rect").hide();
			$("#edit_rect").show();
			$("#edit_rect_color").val(obj.target.get('fill'));
			$(".edit_rect").click(function(){
				if (canvas.getActiveObject()) {
					canvas.getActiveObject().set('fill',$("#edit_rect_color").val());
				}
				canvas.renderAll();
			});
		} else if (obj.target.get('name') == 'text') {
			showText();
			$("#edit_text_input").css("font-family",obj.target.get('font'));
			$("#add_text_value").val(obj.target.get('text')).css("font-family",obj.target.get('font'));
			$(".text_show").text(obj.target.get('font')).css("font-family",obj.target.get('font'));
			$(".edit_font_text_no").hide();
			$(".edit_font_text").show();
			$(".edit_font_text").click(function(){
				changeText(obj.target);
			});
			$("#edit_text_input").val(obj.target.get('text'));
			$("#edit_text_color").val(obj.target.get('fill'));
			$("#new_text").hide();
			$("#edit_text").show();
			$("#edit_text_value").show();
			$("#new_text_value").hide();
			$(".edit_text_input_value").click(function(){
				//console.log($("#edit_text_input").val());
				changeText(obj.target);
			});
			$(".edit_text").click(function(){
				if (canvas.getActiveObject()) {
					canvas.getActiveObject().set('fill',$("#edit_text_color").val());
				}
				canvas.renderAll();
			});
		}
	});
	canvas.on('selection:cleared',function(obj) {
		//console.log("EGH");
		$(".image_container").hide();
		$(".image_text").hide();
		$("#edit_text_value").hide();
		$("#new_text_value").show();
		$(".edit_font_text_no").show();
		$(".edit_font_text").hide();
		$("#add_text_value").val('');
		$(".lock-container").hide();
		hideContainers_removeClasses();
		showPreviousMenu(previous_menu);
		$("#new_rect").show();
		$("#new_text").show();
		$("#align_template").hide().css("float","right");
		$("#edit_rect").hide();
		$("#edit_text").hide();
	});
}

function changeText(obj) {
	if (obj) {
		if (canvas.getActiveObject()) {
			var object = canvas.getActiveObject();
			//console.log(object);
			add_text($("#edit_text_input").val(),object.get('left'),object.get('top'),object.get('height'),object.get('width'),$(".text_show").text(),$("#edit_text_color").val(),object.get('angle'),object.scaleY,object.scaleX);
			canvas.remove(object);
		}
	}
}

function showPreviousMenu(item) {
	getMenu(item);
}

function getMeasures() {
	$("#measure_height").val("");
	$("#measure_width").val("");
	$("#measure_rotate").val("");
	if (canvas.getActiveObject()) {
		var object = canvas.getActiveObject();
		//console.log(object);
		$("#measure_height").val(Math.round(object.getHeight()));
		$("#measure_width").val(Math.round(object.getWidth()));
		$("#measure_rotate").val(Math.round(object.get('angle')));
		$(".measure_input").change(function(){
			changeObjectMeasures();
		});
	}
}

function changeObjectMeasures() {
	if (canvas.getActiveObject()) {
		var object = canvas.getActiveObject();
		if (object.get('type') == 'rect') {
			var height = Math.round($("#measure_height").val());
			var	width = Math.round($("#measure_width").val());
			var rotate = Math.round($("#measure_rotate").val());
			if (rotate > 359) {
				$("#measure_rotate").val(0);
			} else if (rotate < 0) {
				$("#measure_rotate").val(359);
			}
			object.set("height",height*object.scaleY);
			object.set("width",width*object.scaleX);
			object.set("scaleY",1);
			object.set("scaleX",1);

			object.setAngle(rotate);
			object.setCoords();
			canvas.renderAll();
		} else if (object.get('type') == 'path') {
			var height = Math.round($("#measure_height").val());
			var	width = Math.round($("#measure_width").val());
			var rotate = Math.round($("#measure_rotate").val());
			var scaleY = Math.round($("#measure_height").val())/object.height;
			var scaleX = Math.round($("#measure_width").val())/object.width;
			if (rotate > 359) {
				$("#measure_rotate").val(0);
			} else if (rotate < 0) {
				$("#measure_rotate").val(359);
			}
			object.set("scaleX",scaleX);
			object.set("scaleY",scaleY);

			object.setAngle(rotate);
			object.setCoords();
			canvas.renderAll();
		}
	}
}

function get_svg_maps() {
	//console.log("get maps");
	ajax = $.ajax({
		type:"GET",
		url:"designboks/script/ajax_svg_maps.php",
		cache:false,
		success: function(result) {
			var result = JSON.parse(result);
			//console.log(result.length);
			for (var i = 0; i < result.length; i++) {
				if (result[i].substring(0,1) != ".") {
					$(".select_svg_map").append("<option value='"+result[i]+"'>"+result[i]+"</option>");
				}
			}
		}
	});
}

function change_svg_show(selected) {
	$(".svg_container").empty();
	//console.log(selected);
	ajax = $.ajax({
		type:"POST",
		data:{'directory':selected},
		url:"designboks/script/ajax_svg.php",
		cache:false,
		success: function(result) {
			var result = JSON.parse(result);
			var x = 0;
			for (var i = 0; i < result.length; i++) {
				if (i % 3 == 0) {
					x++;
					$(".svg_container").append("<div class='svg_div svg_div"+x+"'></div>");
				}
				$(".svg_div"+x+"").append("<img class='svg_preview' src=designboks/"+result[i].substring(3)+">");
			}
		}
	});
}

function add_svg(url) {
	var color = $("#new_rect_color").val();
	fabric.loadSVGFromURL(url, function(objects, options) {
		//console.log(objects);
		var svg_group = new fabric.Group([],{
			left: 0,
			top: 0,
			name: "svg_group"
		});
		if (objects.length > 1) {
			for (var i = 0; i < objects.length; i++) {
				var font_string = objects[i].d;
				var path_art = new fabric.Path(font_string);
				path_art.set({
					fill: color,
					height: path_art.height,
					width: path_art.width,
				});
				//console.log(path_art);
				svg_group.addWithUpdate(path_art);
				path_art.hasBorders = false;
			}
		} else {
			var font_string = objects[0].d;
			var path_art = new fabric.Path(font_string);
			path_art.set({
				fill: color,
				left: 50,
				top: 50,
				height: path_art.height,
				width: path_art.width,
				scaleX:1*125/path_art.height,
				scaleY:1*125/path_art.width,
				name: "clipart",
			});
			canvas.add(path_art);
			path_art.centerV();
			path_art.centerH();
			path_art.setCoords().setObjectsCoords();
		}
		canvas.add(svg_group);
		//console.log(svg_group);
		canvas.renderAll();
		svg_group.set({
			top:0,
			left:0,
			scaleX:1*125/svg_group.height,
			scaleY:1*125/svg_group.width,
		});
		svg_group.centerV();
		svg_group.centerH();
		svg_group.setCoords().setObjectsCoords();
		svg_group.hasRotatingPoint = false;
		canvas.renderAll();

	});
}