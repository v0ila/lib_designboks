//Output dpi, used for image resizing and output pdf scaling
var mm_to_inch = 0.0393701;
var output_dpi = 300;

var custom, background_color, orig_template_props, globalscale, overlay, group, output_pdf_flag_width_mm, c_width, c_height;
var template_initiated = false;
var px_to_mm = 0.28222254482312465909619442122814*1.24906626401;
var designboks_active = 0;

function load_designboks(url_template,height,width,margin_top) {
	var url_template = url_template;
	if (designboks_active == 1) {
		canvas.clear();
		init_template(url_template,height,width);
	} else {
		designboks_active = 1;
		output_pdf_flag_width_mm = width;
		$.ajax({
			type:"POST",
			url:"designboks/get_headers.php",
			cache:false,
			success: function(head) {
				$('head').append(head);
				$.ajax({
					type:"POST",
					url:"designboks/get_html.php",
					cache:false,
					success: function(result) {
						$('body').append(result);
						$(".designboks_container").hide();
						$(".designboks_container").fadeIn('fast');
						$("#edit_rect").hide();
						$("#edit_text").hide();
						$(".menubar_upload").hide();
						$("#file_input").hide();
						$(".layer1").hide();
						$(".layer2").hide();
						$(".svg_container").hide();
						canvas_size();
						canvas = new fabric.Canvas('c');
						c_width = canvas.width;
						c_height = canvas.height;
						orig_template_props = [];
						init_template(url_template,height,width,margin_top);
						generate_text_font_list();
						canvas.observe("object:rotating", function(object) {
							getMeasures(object);
						});
						canvas.observe("object:scaling", function(object) {
							getMeasures(object);
							//console.log(((object.target.width*object.target.scaleX)/globalscale)*px_to_mm);
							max_resize(object);
							if (object.target.get('type') == "i-text") {
								object.lockScaling = true;
							}
						});
						canvas.on('object:selected', function() {
							$(".svg_main_container").fadeOut('fast');
							$(".layerorder-container").slideDown("fast");
							var obj = canvas.getActiveObject();
							if (obj != null) {
								$(".layer1").show();
								$(".layer2").show();
							} else {
								$(".outline-container").show();
								var group = canvas.getActiveGroup();
								if (group._objects.length == 3) {
									$("#spacing").show();
								}
							}
						});
						canvas.on('selection:cleared', function() {
							//console.log("huh");
							$(".svg_main_container").finish().fadeIn('fast');
							$(".layer1").hide();
							$(".layer2").hide();
							$("#spacing").hide();
							$(".outline-container").finish().hide();
							$(".layerorder-container").finish().slideUp("fast");
						});
						$("#slider").slider({
							value:15,
							min:10,
							max:25,
							step:5,
							slide: function( event, ui ) {
								$("#amount").val(ui.value);
								create_grid(ui.value);
							}
						});
						hideMenu();
						get_svg_maps();
						$(document).on("click",".yes",function(){
							generate_pdf(height,width,margin_top);
						});
						canvas.centeredScaling = true;
						canvas.controlsAboveOverlay = true;
					}
				});
			}
		});
	}
}

function canvas_size() {
	var height = window.innerHeight*0.8;
	var width = height*1.5;
	document.getElementById('c').width = width;
	document.getElementById('c').height = height;
	$('.designboks_container').css("margin-left",-(width/2)-150);
}

function init_template(url_template,height,width,margin) {
	if (url_template == '') {
		custom = true;
		//console.log("custom size");
		//console.log("height: "+height);
		//console.log("width: "+width);

		if (width > height) {
			//console.log("change relativity");
		}

		var template_container_height = (height+(width/2))/px_to_mm;
		var template_container_width = template_container_height*1.5;

		var template_height = height/px_to_mm;
		var template_width = width/px_to_mm;

		globalscale = (c_height)/(template_container_height);
		//console.log("svg heightAttr "+template_container_height);
		//console.log("globalscale "+globalscale);

		rect_template_container = new fabric.Rect({
			selectable: false,
			evented: false,
			borderColor: "black",
			width: template_container_width,
			height: template_container_height,
			scaleY: globalscale,
			scaleX: globalscale,
			fill: "white",
			name: "template_container"
		});

		rect_background = new fabric.Rect({
			selectable: false,
			evented: false,
			width: template_width,
			height: template_height,
			scaleY: globalscale*1.01,
			scaleX: globalscale*1.01,
			fill: "#B8CFDB",
			name: "rect_background"
		});

		rect_template = new fabric.Rect({
			selectable: false,
			evented: false,
			borderColor: "black",
			width: template_width,
			height: template_height,
			scaleY: globalscale,
			scaleX: globalscale,
			stroke: '#000000',
			strokeWidth: 2/globalscale,
			fill: "#B8CFDB",
			name: "template"
		});

		rect_template_margin = new fabric.Rect({
			selectable: false,
			evented: false,
			borderColor: "black",
			width: template_width-(margin*2),
			height: template_height-(margin*2),
			scaleY: globalscale,
			scaleX: globalscale,
			stroke: '#000000',
			strokeWidth: 1/globalscale,
			fill: "#B8CFDB",
			name: "margin"
		});

		rect_template_overlay1 = new fabric.Rect({
			selectable: false,
			evented: false,
			width: template_container_width/2-(template_width/2),
			height: template_container_height,
			scaleY: globalscale,
			scaleX: globalscale,
			fill: "white",
			name: "overlay1",
			opacity:0.6
		});

		rect_template_overlay2 = new fabric.Rect({
			selectable: false,
			evented: false,
			width: template_width,
			height:(template_container_height-template_height)/2,
			scaleY: globalscale*1.01,
			scaleX: globalscale*1.01,
			fill: "white",
			name: "overlay2",
			opacity:0.6
		});

		rect_template_overlay3 = new fabric.Rect({
			selectable: false,
			evented: false,
			width: template_width,
			height:(template_container_height-template_height)/2,
			scaleY: globalscale*1.01,
			scaleX: globalscale*1.01,
			fill: "white",
			name: "overlay3",
			opacity:0.6
		});

		rect_template_overlay4 = new fabric.Rect({
			selectable: false,
			evented: false,
			width: template_container_width/2-(template_width/2),
			height: template_container_height,
			scaleY: globalscale,
			scaleX: globalscale,
			fill: "white",
			name: "overlay4",
			opacity:0.6
		});

		canvas.add(rect_template_container);
		canvas.add(rect_background);
		canvas.add(rect_template);
		canvas.add(rect_template_margin);

		canvas.add(rect_template_overlay1);
		canvas.add(rect_template_overlay2);
		canvas.add(rect_template_overlay3);
		canvas.add(rect_template_overlay4);

		rect_template_container.hasBorders = true;
		rect_background.centerH();
		rect_background.centerV();
		rect_template_container.centerH();
		rect_template_container.centerV();
		rect_template.centerH();
		rect_template.centerV();
		rect_template_margin.centerH();
		rect_template_margin.centerV();

		rect_template_overlay2.set({
			left:rect_template_overlay1.currentWidth,
		});

		rect_template_overlay3.set({
			left:rect_template_overlay1.currentWidth,
			top:rect_template.top+rect_template.currentHeight,
		});

		rect_template_overlay4.set({
			left:rect_template.left+rect_template.currentWidth
		});

		canvas.renderAll();
		keep_group_on_front();

		editObject();

		orig_template_props.push({
			orig_height:template_container_height,
			orig_width:template_container_width
		});

		canvas.on('object:added',function(){
			keep_group_on_front();

		});

	} else {
		custom = false;
		fabric.loadSVGFromURL(url_template,function(objects, options) {
			var dynamic_temp_width;
			group = new fabric.PathGroup(objects, {});
			dynamic_temp_width = ((c_height)/(group.paths[0].heightAttr)*group.paths[0].widthAttr);
			globalscale = (c_height)/(group.paths[0].heightAttr);
			//console.log("svg heightAttr "+group.paths[0].heightAttr);
			//console.log("globalscale "+globalscale);
			group.set({
				selectable:false,
				evented:false,
				opacity:0.6,
				scaleY:globalscale,
				scaleX:globalscale,
				height:group.paths[0].heightAttr,
				width:group.paths[0].widthAttr,
				left:0,
				name:"template"
			});
			//console.log(group);
			group.paths[0].set({strokeWidth: 2, stroke: '#0D0D0D'});
			orig_template_props.push({
				orig_height:group.paths[0].heightAttr,
				orig_width:group.paths[0].widthAttr
			});
			canvas.add(group);
			canvas.renderAll();
			background_init();
			//console.log(globalscale+" globalscale");
			canvas.on('object:added',function(){
				keep_group_on_front();
			});
		});
		editObject();
	}
}

function keep_group_on_front() {
	if (custom) {
		canvas.sendToBack(rect_template_margin);
		canvas.sendToBack(rect_template);
		canvas.sendToBack(rect_background);
		canvas.sendToBack(rect_template_container);

		canvas.bringToFront(rect_template_overlay1);
		canvas.bringToFront(rect_template_overlay2);
		canvas.bringToFront(rect_template_overlay3);
		canvas.bringToFront(rect_template_overlay4);
	} else {
		canvas.bringToFront(group);
		canvas.sendToBack(background_color);
	}
}

function background_init() {
	var color = "#ffffff";
	var width = (output_pdf_flag_width_mm/px_to_mm)*globalscale;
	if (custom) {
		//console.log("custom");
	} else {
		background_color = new fabric.Rect({
			width: width,
			height: canvas.height,
			fill: color,
			left: (canvas.width/2)-(width/2),
			top: 0,
			selectable:false,
			hasControls:false,
			hasBorders:false,
			evented:false
		});
		canvas.add(background_color);
	}
	keep_group_on_front();
	canvas.renderAll();
}
function saveAsJSON(){
            canvas.item(0).sourcePath = 'designboks/json/brochure.json';
            document.getElementById("JsonFile").value = JSON.stringify(canvas.toDatalessJSON());
            //console.log(JSON.stringify(canvas));
        }

        function loadFrmJSON(){
            var src = document.getElementById("JsonFile").value;
            canvas.loadFromDatalessJSON(src);
            canvas.renderAll();
			keep_group_on_front();
        }

 function resize() {
    var width = 'px';
    var height = 'px';
    var canvas = document.getElementById('c');
    var canvasRatio = canvas.height / canvas.width;
    var windowRatio = window.innerHeight / window.innerWidth;
    

    if (windowRatio < canvasRatio) {
        height = window.innerHeight;
        width = height / canvasRatio;
    } else {
        width = window.innerWidth;
        height = width * canvasRatio;
    }

    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
};

window.addEventListener('resize', resize, false);

 var canvas = document.querySelector('#c');
      var X,Y,r;              
     
             
        function inicializarCanvas(){ 
        
        if (canvas && canvas.getContext) {
        var ctx = canvas.getContext("2d");
        if (ctx) {
             var s = getComputedStyle(canvas);//console.log(s);
             var w = s.width;//console.log("w: "+w);
             var h = s.height;//console.log("h: "+h);
                    
             var W = canvas.width = w.split('px')[0];//console.log("X: "+X);
             var H = canvas.height = h.split('px')[0];//console.log("Y: "+Y);
             
             X = Math.floor(W/2);
             Y = Math.floor(H/2);
             r = Math.floor(X/2);
               
             init(ctx);
         }
     }   
}      
        function init(ctx){
               ctx.strokeStyle = "#006400";
               ctx.fillStyle = "#6ab155";
               ctx.lineWidth = 5;
               ctx.arc(X,Y,r,0,2*Math.PI);
               ctx.fill();
               ctx.stroke();
        }
        
      


setTimeout(function() {
  inicializarCanvas();
  addEventListener('inicializarCanvas', inicializarCanvas, false);
  }, 15);