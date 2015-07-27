function hideContainers_removeClasses() {
	$("#global").removeClass("active");
	$("#text").removeClass("active");
	$("#clipart").removeClass("active");
	$("#upload").removeClass("active");
	$(".global_container").hide();
	$(".welcome_container").hide();
	$(".text_container").hide();
	$(".clipart_container").hide();
	$(".upload_container").hide();
	$(".image_container").hide();
	$(".image_text").hide();
}

function hideMenu() {
	$(".arrow-up").css({
		"left":"500px"
	});
	hideContainers_removeClasses();
}

function showGlobal() {
	$(".arrow-up").css({
		"left":"21px"
	});
	$("#global").addClass("active");
	$(".global_container").show();
}

function showText() {
	$(".arrow-up").css({
		"left":"91px"
	});
	$("#text").addClass("active");
	$(".text_container").show();
}

function showClipArt() {
	$(".arrow-up").css({
		"left":"155px"
	});
	$("#clipart").addClass("active");
	$(".clipart_container").show();
}

function showUpload() {
	$(".arrow-up").css({
		"left":"226px"
	});

	$("#upload").addClass("active");
	$(".upload_container").show();
}

function getMenu(item) {
	if (item == "none") {
		hideMenu();
	} else if (item == "global") {
		showGlobal();
	} else if (item == "text") {
		showText();
	} else if (item == "clipart") {
		showClipArt();
	} else if (item == "upload") {
		showUpload();
	}
}

$(document).ready(function() {
	var text = false;
	var clipart = false;
	var upload = false;

	$(".global_container").hide();
	$(".text_container").hide();
	$(".clipart_container").hide();
	$(".upload_container").hide();

	$(document).on("click",".menu_item",function() {
		hideContainers_removeClasses();
		previous_menu = this.id;
		if (this.id == "global") {
			getMenu("global");
		} else if (this.id == "text") {
			getMenu("text");
		} else if (this.id == "clipart") {
			getMenu("clipart");
		} else if (this.id == "upload") {
			getMenu("upload");
		}
	});

	$('html').keyup(function(e){
		if (e.keyCode == 27) {
	    	canvas.discardActiveObject();
	    	canvas.discardActiveGroup();
	    	canvas.renderAll();
	    }
	});
	$(document).on("click",".add_text",function() {
		var value = $("#add_text_value").val();
		var font = $(".text_show").text();
		var color = $(".color").val();
		if (value != "") {
			add_text(value,20,20,100,200,font,color,0);
		}
		$("#add_text_value").val("");
		//add_text(text,left,top,height,width)
	});
	$(document).on("click",".add_rect",function() {
		var color = $(".color_clipart").val();
		add_line(color);
	});
	$(document).on("click",".image",function() {
		$("#file_input").trigger('click');
		add_image();
		return false;
	});
	$(document).on("click",".change_background",function() {
		var color = $(".color_global").val();
		background(color);
	});
	$(document).on("click","#copy",function() {
		copy();
	});
	$(document).on("click",".preview",function(){
		preview();
	});
	$(document).on("click",".no",function(){
		back_to_editing();
	});
	$(document).on("click","#center_h",function(){
		var obj = canvas.getActiveObject();
		if (obj != null) {
			center_h(obj);
		} else {
			center_h(canvas.getActiveGroup());
		}
	});
	$(document).on("click","#center_h_c",function(){
		var obj = canvas.getActiveObject();
		if (obj != null) {
			center_h_c(obj);
		} else {
			center_h_c(canvas.getActiveGroup());
		}
	});
	$(document).on("click","#center_v",function(){
		var obj = canvas.getActiveObject();
		if (obj != null) {
			center_v(obj);
		} else {
			center_v(canvas.getActiveGroup());
		}
	});
	$(document).on("click",".to_left",function(){
		var obj = canvas.getActiveObject();
		if (obj != null) {
			outline_left(obj);
		} else {
			outline_left(canvas.getActiveGroup());
		}
	});
	$(document).on("click",".to_right",function(){
		var obj = canvas.getActiveObject();
		if (obj != null) {
			outline_right(obj);
		} else {
			outline_right(canvas.getActiveGroup());
		}
	});
	$(document).on("click","#remove",function() {
		var obj = canvas.getActiveObject();
		remove_selected(obj);
	});
	$(document).on("click","#layer_up",function() {
		var obj = canvas.getActiveObject();
		layer_up(obj);
	});
	$(document).on("click","#layer_down",function() {
		var obj = canvas.getActiveObject();
		layer_down(obj);
	});
	$(document).on("click",".menu-container",function() {
		$(".layerorder-container").finish().slideUp("fast");
		canvas.deactivateAll().renderAll();
	});
	$(document).on("click","#spacing",function() {
		var obj = canvas.getActiveObject();
		if (obj != null) {
			center_obj(obj);
		} else {
			center_obj(canvas.getActiveGroup());
		}
	});
	$(document).on("click","#gridcheck",function(){
		show_grid_slider();
	});
	$(document).on("change","#menu",function(){
		var selected = $("#menu :selected").attr('value');
		change_text_font(selected);
	});
	$(document).on("change",".select_svg_map",function(){
		$(".svg_container").fadeIn('fast');
		var selected = $(".select_svg_map :selected").attr('value');
		change_svg_show(selected);
	});
	$(document).on("click","#lock",function(){
		lockObject();
	});
	$(document).on("click",".svg_preview",function(e){
		var url = e.currentTarget.src;
		add_svg(url);
	});
	$(document).on("keypress",".measure_input",function(e){
		if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
			return false;
    	}
	});
});