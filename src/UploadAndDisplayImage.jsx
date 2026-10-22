import { useState } from "react";

//https://stackoverflow.com/questions/43692479/how-to-upload-an-image-in-react-js
function UploadAndDisplayImage({button_class_name, button_hover_class_name, selected_image, set_selected_image, imageContainerClassName}) {
	const [remove_hover, set_remove_hover] = useState(false);
	const [browse_hover, set_browse_hover] = useState(false);
	const [hide_hover, set_hide_hover] = useState(false);
	const [show_hover, set_show_hover] = useState(false);
	const [hide, set_hide] = useState(false)
	const on_browse_mouse_over = (e) => {
		set_browse_hover(true)
	}
	const on_browse_mouse_out = (e) => {
		set_browse_hover(false)
	}
	const on_remove_mouse_over = (e) => {
		set_remove_hover(true)
	}
	const on_remove_mouse_out = (e) => {
		set_remove_hover(false)
	}
	const on_remove_click = (e) => {
		set_selected_image(null)
		set_remove_hover(false)
	}
	const on_show_click = (e) => {
		set_hide(false)
	}
	const on_hide_click = (e) => {
		set_hide(true)
	}
	const on_hide_mouse_over = (e) => {
		set_hide_hover(true)
	}
	const on_hide_mouse_out = (e) => {
		set_hide_hover(false)
	}
	const on_show_mouse_over = (e) => {
		set_show_hover(true) 
	}
	const on_show_mouse_out = (e) => {
		set_show_hover(false)
	}
	const on_file_change = (e) => {
		console.log("Running on change for ", e)
		console.log(event.target.files[0]); 
		set_selected_image(event.target.files[0]);
	}
	let browse_button_class = button_class_name
	if (browse_hover) {
		browse_button_class = button_hover_class_name
	}
	let remove_button_class = button_class_name
	if (remove_hover) {
		remove_button_class = button_hover_class_name
	}
	let hide_button_class = button_class_name
	if(hide_hover) {
		hide_button_class = button_hover_class_name
	}
	let show_button_class = button_class_name
	if(show_hover) {
		show_button_class = button_hover_class_name
	}
	console.log("selected image: ", selected_image)
	return (
		<div className="upload-and-display-images">
			{selected_image && !hide && (
				<div>
					<img
					alt="not found"
					className="center fit"
					src={URL.createObjectURL(selected_image)}
					/>
				</div>
			)}
		<div className="upload-buttons">
		<label className={browse_button_class}
			onMouseOver={on_browse_mouse_over}
			onMouseOut={on_browse_mouse_out} >
			<input
			type="file"
			name="number_image"
			onChange={on_file_change}
			/>
			Browse
		</label>
		{selected_image && 
					<div className={remove_button_class} onClick={on_remove_click} onMouseOver={on_remove_mouse_over} onMouseOut={on_remove_mouse_out}>Remove</div>
		}
		{selected_image && hide && 
			<div className={show_button_class} onClick={on_show_click} onMouseOver={on_show_mouse_over} onMouseOut={on_show_mouse_out}>Show</div>
		}
		{selected_image && !hide && 
			<div className={hide_button_class} onClick={on_hide_click} onMouseOver={on_hide_mouse_over} onMouseOut={on_hide_mouse_out}>Hide</div>
		}
		{selected_image === null && "No file selected"}
		</div>
		</div>
	);
};

// Export the UploadAndDisplayImage component as default
export default UploadAndDisplayImage;
