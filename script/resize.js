//Max resize variable for images
var max_resize_size = 2.5;
var check = 0;

function max_resize(object) {
	var filter = new fabric.Image.filters.Tint({
		color: 'red'
	});
	if (object.target.get('type') == "image") {
		if (object.target.scaleX >= globalscale*max_resize_size) {
			check++;
			if (check == 1) {
				object.target.filters.push(filter);
				object.target.applyFilters(canvas.renderAll.bind(canvas));
				$(".image_container").show();
				$(".image_text").show();
				object.target.propertyName = "resize_false";
			}
		} else {
			check = 0;
			object.target.filters=[];
			object.target.applyFilters();
			$(".image_container").hide();
			$(".image_text").hide();
			object.target.propertyName = "resize_true";
		}
		if (object.target.scaleY >= globalscale*max_resize_size) {
			check++;
			if (check == 1) {
				object.target.filters.push(filter);
				object.target.applyFilters(canvas.renderAll.bind(canvas));
				$(".image_container").show();
				$(".image_text").show();
				object.target.propertyName = "resize_false";
			}
		} else {
			check = 0;
			object.target.filters=[];
			object.target.applyFilters();
			$(".image_container").hide();
			$(".image_text").hide();
			object.target.propertyName = "resize_true";
		}
	}
}