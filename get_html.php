<?php
	echo '
 
	<div class="designboks_container" style="position:absolute; top:20px;">
		<div class="leftbar" id="leftbar"></div>
		<div class="title" id="title"><b>DESIGN</b><b style="color:#009ee0;">BOKS</b></div>
		<div class="menu-container">
			<div class="menu_top_line">
			</div>
			<div class="menubar" id="menubar">
				<div class="menubar_edit">
					<div class="menu_item" id="global">
						<b>Globaal</b>
					</div>
					<div class="menu_item" id="text">
						<b>Tekst</b>
					</div>
					<div class="menu_item" id="clipart">
						<b>Clipart</b>
					</div>
					<div class="menu_item" id="upload">
						<b>Upload</b>
					</div>
				</div>
			</div>
			<div class="menu_line menu_top">
				<div class="arrow-up" style="left: 91px;"></div>
			</div>
		</div>
		<div class="ui-container">
			<div class="menu-slider-container welcome_container" style="display: none;">
				<div class="menu-item">
					<div class="upload_text" style="text-align:center">
						Klik op een optie om te beginnen
					</div>
				</div>
			</div>

			<div class="menu-slider-container global_container" id="global" style="display: none;">
				<div class="menu-item">
					<div class="global_text">
						Verander de kleur van de template.
					</div>
					<div class="icon_container"><i class="fa fa-pencil"></i></div><input type="color" class="input color_global" value="#FFFFFF">
					<input class="add change_background" type="submit" value="Verander" style="float: right;">
				</div>
				<div class="menu-item">
					<div class="global_text">
						Grid instellen
					</div>
					<button class="layer-edit grid" type="submit" id="gridcheck">
						<i class="fa fa-table"></i><b>Inschakelen</b>
					</button>
					<div id="slider" class="ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all"><span class="ui-slider-handle ui-state-default ui-corner-all" tabindex="0" style="left: 33.3333333333333%;"></span></div>
				</div>
			</div>

			<div class="menu-slider-container text_container" id="text" style="display: block;">
				<div class="menu-item" id="new_text_value">
					<div class="icon_container"><i class="fa fa-text-width"></i></div><input type="text" class="input" placeholder="Tekst" id="add_text_value" style="font-family: Adventure;">
					<input class="add add_text" type="submit" value="Voeg toe">
				</div>
				<div class="menu-item" id="edit_text_value">
					<div class="icon_container"><i class="fa fa-text-width"></i></div><input type="text" class="input" placeholder="Tekst" id="edit_text_input">
					<input class="add edit_text_input_value" type="submit" value="Pas aan">
				</div>
				<div class="menu-item" id="new_text">
					<div class="icon_container"><i class="fa fa-pencil"></i></div><input type="color" id="new_text_color" class="input color">
					<input class="add_no add_text_no" type="submit" value="Kleur">
				</div>
				<div class="menu-item" id="edit_text" style="display: none;">
					<div class="icon_container"><i class="fa fa-pencil"></i></div><input type="color" class="input color color_edit_text" id="edit_text_color">
					<input class="add edit_text" type="submit" value="Pas aan" style="float: right;">
				</div>
				<div class="menu-item">
					<div class="icon_container"><i class="fa fa-font"></i></div>
					<input disabled="" class="add_no edit_font_text_no nohover" type="submit" value="Lettertype">
					<input class="add edit_font_text" type="submit" value="Pas aan" style="float: right;">
					<div class="menu-show" id="menu_show"><div class="text_show" style="font-family: Adventure;">Adventure</div></div>
					<div class="menu_drop" id="menu_drop"></div>
				</div>
			</div>

			<div class="menu-slider-container clipart_container" id="clipart" style="display: none;">
				<div class="menu-item" id="new_rect">
					<div class="icon_container"><i class="fa fa-pencil"></i></div><input type="color" class="input color_clipart" id="new_rect_color" value="#2ecc71">
					<input class="add_no add_text_no" type="submit" value="Kleur">
				</div>
				<div class="menu-item" id="edit_rect" style="display: none;">
					<div class="icon_container"><i class="fa fa-pencil"></i></div><input type="color" class="input color_clipart" id="edit_rect_color" value="#009ee0">
					<input class="add edit_rect" type="submit" value="Pas aan" style="float: right;">
				</div>
				<div class="svg_main_container">
					<select class="select_svg_map">
						<option value="" disabled selected style="display:none">Categorie</option>
					</select>
					<div class="menu-item svg_container" id="svg_container">

					</div>
				</div>
			</div>

			<div class="menu-slider-container upload_container" id="upload" style="display: none;">
				<div class="upload_text">
					Upload een foto vanaf uw computer.<br><br>

					Geaccepteerde bestandstypes:<br>
					.jpg, .jpeg, .png<br><br>

					Ik heb de rechten om deze afbeelding te gebruiken</div>
				<input type="file" id="file_input" style="display: none;">
				<input type="submit" class="input image" value="Upload" id="add_image_value">
			</div>

			<div class="menu-slider-container image_container" id="image" style="display: none;">
				<div class="image_text">
					Wegens kwaliteitsbehouding kunt u de afbeelding maar met 2.5x vergroten.<br> 
					Graag verkleinen of een andere afbeelding kiezen.
				</div>
			</div>

			<div class="layerorder-container" style="">
				<div class="measure-container" onkeyup="changeObjectMeasures();">
					<div class="layer-title" id="measure_title">Afmetingen</div>
					Hoogte:<input type="text" class="measure_input" id="measure_height" step="any" min="1" max="500" maxlength="4" onclick="this.select();">
					Breedte:<input type="text" class="measure_input" id="measure_width" step="any" min="1" max="500" maxlength="4" onclick="this.select();">
					Hoek:<input type="text" class="measure_input" id="measure_rotate" step="any" min="-1" max="360" maxlength="3" onclick="this.select();">
				</div>
				<div class="lock-container">
					<button class="object-edit lock" type="submit" id="lock">
						<i class="fa fa-lock"></i>
					</button> <b>Vergrendelen</b>
				</div>
				<div class="outline-container" style="float:left">
					<div class="layer-title">Op selectie uitlijnen</div>
					<button class="object-edit to_left" type="submit" id="to_left">
						<i class="fa fa-align-left"></i>
					</button>
					<button class="object-edit center_h" type="submit" id="center_h">
						<i class="fa fa-align-center"></i>
					</button>
					<button class="object-edit to_right" type="submit" id="to_right">
						<i class="fa fa-align-right"></i>
					</button>
				</div>
				<div class="outline-container" style="float:right" id="align_template">
					<div class="layer-title">Op template uitlijnen</div>
					<button class="object-edit center_h" type="submit" id="center_h_c">
						<i class="fa fa-align-center"></i>
					</button>
					<button class="object-edit center_v" type="submit" id="center_v">
						<i class="fa fa-align-center center_v_icon"></i>
					</button>
				</div>
				<div class="layer-title">Laag volgorde</div>
				<button class="layer-edit layer1" type="submit" id="layer_up" style="display: none;">
					<i class="fa fa-arrow-up"></i><b>Naar voren</b>
				</button>
				<button class="layer-edit layer2" type="submit" id="layer_down" style="display: none;">
					<i class="fa fa-arrow-down"></i><b>Naar achteren</b>
				</button>
				<button class="layer-edit copy" type="submit" id="copy">
					<i class="fa fa-files-o"></i><b>Kopieren</b>
				</button>
				<button class="layer-edit remove" type="submit" id="remove">
					<i class="fa fa-trash"></i><b>Verwijderen</b>
				</button>
			</div>
			<div class="upload_menu">
				<div class="global_text finish_text">
				<i class="fa fa-spinner fa-spin" style="font-size:30px; color:rgb(231, 231, 231)"></i>
					<br>
					Bent u klaar met ontwerpen?
				</div>
				<button class="layer-edit yes" type="submit" id="yes">
					<i class="fa fa-thumbs-up"></i><b>Akkoord</b>
				</button>
				<button class="layer-edit no" type="submit" id="no">
					<i class="fa fa-thumbs-down"></i><b>Terug</b>
				</button>
			</div>
			<div class="preview"><i class="upload">Voorbeeld en bestelling afronden</i></div>
			
			<canvas id="c"  width="600" height="400"></canvas>
			
			<input type="file" id="file_input" accept="image/*">
			<div class="footer" id="footer"></div>
		</div>
	</div>
	';
?>