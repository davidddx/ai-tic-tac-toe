import {useState} from 'react'
import Button from './Button.jsx'
import UploadAndDisplayImage from './UploadAndDisplayImage.jsx'
import * as user_settings from './UserSettings.jsx'

const image_id_name = "image-id"
function PuzzleImage({image, is_highlighted, id}) {
	console.log("IMAGE SOURCE: ", image)
	let source = image
	if(typeof image === "object") {
		source = URL.createObjectURL(image)	
	}
	console.log("IS HIGHLIGHTED: ", is_highlighted)
	let className = "center fit"
	if(is_highlighted) {
		className += ` highlighted-puzzle-image`
	}
	return (
		<img className={className} src={source} image-id={id}/>
	)
}

function PuzzleDisplay({state, set_puzzle_state, images}) {
	console.log("STATE: ", state)
	const top_row = state.slice(0, 3)
	const middle_row = state.slice(3, 6)
	const bottom_row = state.slice(6, 9)
	const get_adj_indices = (idx) => {
		console.log("Adjacent indices of ", idx)
		const rv = []
		const row = Math.floor(idx/3)
		const col = idx % 3
		console.log("Row: ", row)
		console.log("Col: ", col)
		if(row != 0) {
			const row_top = row - 1
			rv.push(row_top*3 + col)
		}
		if(row != 2) {
			const row_bottom = row + 1
			rv.push(row_bottom*3 + col)
		}
		if(col != 0) {
			const col_left = col - 1
			rv.push(row*3 + col_left)
		}
		if(col != 2) {
			const col_right = col + 1
			rv.push(row*3 + col_right)
		}
		return rv 
	}
	const adjacent_indices = get_adj_indices(state.indexOf(user_settings.space_number))
	const on_click = (e) => {
		const target = e.target
		if(target.tagName !== "IMG") {
			return
		}
		const attributes = target.attributes
		const value = parseInt(attributes[image_id_name].value)
		const index_from = state.indexOf(value) 
		if (!adjacent_indices.includes(index_from)) {
			return
		}
		const new_state = [...state]
		const index_to = state.indexOf(user_settings.space_number)
		new_state[index_from] = state[index_to]
		new_state[index_to] = state[index_from]
		set_puzzle_state(new_state)
		console.log("NEW STATE: ", new_state)
	}
	console.log("IMAGES: ", images)
	console.log("Adjacent indices: ", adjacent_indices)
	return (
		<div onClick={on_click}>
			<div className="eight-puzzle-row">
				{top_row.map((number, index) => <PuzzleImage key={number} image={images[number]} is_highlighted={adjacent_indices.includes(index)} id={number}/>)}
			</div>
			<div className="eight-puzzle-row">
				{middle_row.map((number, index) => <PuzzleImage key={number} image={images[number]} is_highlighted={adjacent_indices.includes(index + 3)} id={number}/>)}
			</div>
			<div className="eight-puzzle-row">
				{bottom_row.map((number, index) => <PuzzleImage key={number} image={images[number]} is_highlighted={adjacent_indices.includes(index + 6)} id={number}/>)}
			</div>
		</div>
	)
}

function Puzzle({puzzle_state, set_puzzle_state, puzzle_images, box_outline_color, box_color, box_type}) {
	console.log("Puzzle images: ", puzzle_images)
	console.log("Box outline color: ", box_outline_color)
	console.log("box color: ", box_color)
	console.log("puzzle state: ", puzzle_state)
	const border_radius = box_type === user_settings.rounded_corners_box_type ? "5px" : "0px"
	const style = {
		backgroundColor: user_settings.get_rgb_by_color(box_color),
		borderColor: user_settings.get_rgb_by_color(box_outline_color),
		borderRadius: border_radius, 
		borderStyle: "solid",
		borderWidth: "2px"
	}
	return (
		<div className="eight-puzzle-wrapper">
			<div className="eight-puzzle-container" style={style}>
				<div className="eight-puzzle">
					<PuzzleDisplay state={puzzle_state} images={puzzle_images} set_puzzle_state={set_puzzle_state}/>
				</div>
			</div>
		</div>
	)
}

function SettingsDropdown({text, options, class_name, on_change, selected}) {
	return (
		<div className="settings-dropdown-wrapper">
			<label for={text}>Choose {text}:</label>
			<select name={text} id={text} className={class_name} onChange={on_change} value={selected}>
				{options.map((option) => 
					<option selected key={option} value={option}>{option}</option>)
				
				}
			</select>
		</div>
	)
}

function PuzzleSubheading({text, active_subheading}) {

	const class_name = "settings-subheading" 
	const hover_class_name = "settings-subheading-hover"
	const selected_class_name = "settings-subheading-selected"
	const is_active = text === active_subheading
	console.log(`text: ${text}, active: ${is_active}`)
	return (
		<Button text={text} class_name={class_name} hovered_class_name={hover_class_name} selected_class_name={selected_class_name} active={is_active}/>
	)

}

function SettingsImagesEntry({image_number, curr_image, set_image, set_is_default, color}) {
	console.assert(image_number >= user_settings.min_image_number && image_number <= user_settings.max_image_number)
	const default_text = "Default"
	const custom_text = "Custom"
	const class_name = "settings-attribute"
	const hovered_class_name = `${class_name}-hover`
	const selected_class_name = `${class_name}-selected`
	const [curr_button_choice, set_curr_button_choice] = useState(default_text)
	const on_click = (e) => {
		if(e.target.textContent === default_text) {
			set_is_default(true)
			set_curr_button_choice(default_text)
		}
		else if (e.target.textContent === custom_text) {
			set_is_default(false)
			set_curr_button_choice(custom_text)
		}
	}
	const on_dropdown_change = (e) => {
		const options = e.target.options
		const color = options[options.selectedIndex].textContent
		console.assert(user_settings.default_image_color_options.includes(color), "The color found in the target is not valid", options)
		set_image(user_settings.get_image_path(color, image_number))
	}
	const dropdown_class = "settings-attribute-dropdown"
	const set_selected_image = (image) => {
		set_image(image)	
	}
	const selected_image = curr_image 
	return (
		<div className="settings-subsection-entry">
			<div className="settings-subsection-attribute-name">
				{image_number}:
			</div>
			<div className="settings-subsection-attributes-wrapper" onClick={on_click}>
				<div className="settings-subsection-attributes">
					<div className="settings-images-buttons">
						<Button text={default_text} class_name={class_name} hovered_class_name={hovered_class_name} selected_class_name={selected_class_name} active={curr_button_choice===default_text}/>
						<Button text={custom_text} class_name={class_name} hovered_class_name={hovered_class_name} selected_class_name={selected_class_name} active={curr_button_choice===custom_text}/>
					</div>
					{curr_button_choice === custom_text && <UploadAndDisplayImage button_class_name={class_name} button_hover_class_name={hovered_class_name} selected_image={selected_image} set_selected_image={set_selected_image} imageContainerClassName="settings-preview-image-container"/>}
					{curr_button_choice === default_text && <SettingsDropdown options={user_settings.default_image_color_options} text="color" class_name={dropdown_class} on_change={on_dropdown_change} selected={color}/>}
				</div>
			</div>

			
		</div>
	)
}

function SettingsImagesSubsection({curr_images, set_image, set_is_default, colors}) {
	const image_numbers = []
	for (let i = user_settings.min_image_number; i <= user_settings.max_image_number; ++i) {
		image_numbers.push(i)
	}
	return (
		<div className="settings-subsection-body">
			{image_numbers.map((x) => (<SettingsImagesEntry image_number={x} curr_image={curr_images[x]} set_image={(image_path) => set_image(x, image_path)} set_is_default={(a) => set_is_default(x,a)} color={colors[x]}/>))}
		</div>
	)
}

function SettingsBoxSubsection({}) {
	return (
		<div className="settings-subsection-body">
		</div>	
	)
}

function SettingsMiscSubsection({}) {
	return (
		<div className="settings-subsection-body">

		</div>
	)
}



function PuzzleSettingsHeader({active_subsection, set_active_subsection}) {
	const settings_text = "Settings"
	const on_subheading_click = (e) => {
		const target = e.target
		if (target.textContent == "") {
			return
		}
		if (user_settings.settings_subsections.includes(target.textContent)) {
			set_active_subsection(target.textContent)
		}
	}
	return (
		<div className="settings-header">
			<div className="settings-title">
				{settings_text}
			</div>
			<div className="settings-subheadings" onClick={on_subheading_click}>
				{user_settings.settings_subsections.map((subsection) => <PuzzleSubheading key={subsection} text={subsection} active_subheading={active_subsection}/>)}
			</div>
					
		</div>
	)
}

function PuzzleSettings({settings, set_settings}) {
	const [active_subsection, set_active_subsection] = useState(user_settings.no_subsection)
	const curr_images = settings.get_puzzle_image_paths()
	const set_image = (number, path) => {
		console.log("setting image: ")
		console.log(`number=${number}, path=${path}`)
		const new_settings = settings.get_copy()
		if(new_settings.is_custom[number]) {
			new_settings.custom_image_paths[number] = path 
		}
		else {
			new_settings.image_paths[number] = path
		}
		set_settings(new_settings)
	}
	const set_is_default = (number, is_default) => {
		console.log("Settings is default: ")
		console.log("Number=", number)
		console.log("is_default=", is_default)
		const new_settings = settings.get_copy()
		new_settings.is_custom[number] = !is_default
		set_settings(new_settings)
	}
	const colors = settings.get_image_colors()
	return (
		<div className="eight-puzzle-settings-container">
			<PuzzleSettingsHeader active_subsection={active_subsection} set_active_subsection={set_active_subsection}/>
			<div className="settings-body-container">
				{active_subsection === user_settings.misc_subsection && (<SettingsMiscSubsection/>)}
				{active_subsection === user_settings.box_subsection && (<SettingsBoxSubsection/>)}
				{active_subsection === user_settings.images_subsection && (<SettingsImagesSubsection curr_images={curr_images} set_image={set_image} set_is_default={set_is_default} colors={colors}/>)}
			</div>
		</div>
	)
}

const default_puzzle_state = [5, 7, 8, 3, 4, 2, 1, 6, user_settings.space_number]

function ModuleA({active}) {
	const default_user_settings = new user_settings.UserSettings()
	const [curr_user_settings, set_curr_user_settings] = useState(default_user_settings)
	const [puzzle_state, set_puzzle_state] = useState(default_puzzle_state)
	if(!active) {
		return (null)
	}
	console.log("User settings")
	console.log(curr_user_settings)
	const debug_set_curr_user_settings = (a) => {
		console.log("New settings: ")
		console.log(a)
		set_curr_user_settings(a)
	}
	return (
		<div className="module">
			<Puzzle puzzle_state={puzzle_state} puzzle_images={curr_user_settings.get_puzzle_image_paths_without_null()} box_color={curr_user_settings.box_color} box_outline={curr_user_settings.box_outline} set_puzzle_state={set_puzzle_state}/>
			<PuzzleSettings settings={curr_user_settings} set_settings={debug_set_curr_user_settings}/>	
		</div>
	)
}
export default ModuleA
