export const default_image_dir = "./images"
export const red_color = "red"
export const black_color = "black"
export const blue_color = "blue"
export const green_color = "green"
export const cyan_color = "cyan"
export const yellow_color = "yellow"
export const purple_color = "purple"
export const no_color = "no_color"
export const default_color = red_color
const default_box_outline_color = blue_color 
export const default_image_color_options = [red_color, black_color, blue_color, green_color, cyan_color, yellow_color, purple_color]  
export const default_box_color = green_color
export const rounded_corners_box_type = "rounded corners"
export const squared_corners_box_type = "squared corners"
export const default_box_type = squared_corners_box_type 
export const misc_subsection = "Misc"
export const box_subsection = "Puzzle Box"
export const images_subsection = "Images"
export const no_subsection = "none"
export const settings_subsections = [images_subsection, misc_subsection, box_subsection]
export const min_image_number = 1
export const max_image_number = 8
export const space_number = 0
export const get_rgb_by_color = (color) => {
	switch (color) {
		case red_color: 
			return 'rgb(255, 0, 0)'
		case black_color:
			return 'rgb(0, 0, 0)'
		case blue_color:
			return 'rgb(0, 0, 255)'
		case green_color:
			return 'rgb(0, 255, 0)'
		case cyan_color:
			return 'rgb(0, 255, 255)'
		case yellow_color:
			return 'rgb(255, 255, 0)'
		case purple_color:
			return 'rgb(255, 0, 255)'
	}
	return null
}

export const get_image_path = (color, number) => {
	console.assert(default_image_color_options.includes(color))
	console.assert(number >= min_image_number && number <= max_image_number)
	return default_image_dir + '/' + color + `/${number}.png`
}

const default_image_paths = {
	1: get_image_path(default_color, 1), 
	2: get_image_path(default_color, 2), 
	3: get_image_path(default_color, 3), 
	4: get_image_path(default_color, 4), 
	5: get_image_path(default_color, 5), 
	6: get_image_path(default_color, 6), 
	7: get_image_path(default_color, 7), 
	8: get_image_path(default_color, 8)
}
const initial_custom_image_paths = {
	1: null,
	2: null,
	3: null,
	4: null,
	5: null,
	6: null,
	7: null,
	8: null
}
const initial_is_custom = {
	1: false,
	2: false,
	3: false,
	4: false,
	5: false,
	6: false,
	7: false,
	8: false
}

export const get_color_by_path = (number, path) => {
	for(const color of default_image_color_options) {
		const color_path = get_image_path(color, number)
		if (color_path === path) {
			return color
		}
	}
	return no_color
	
}

export class UserSettings {
	constructor() {
		this.image_paths = default_image_paths  
		this.custom_image_paths = initial_custom_image_paths
		this.is_custom = initial_is_custom
		this.box_color = default_box_color
		this.box_outline_color = default_box_outline_color
		this.box_type = default_box_type
	}
	get_copy() {
		console.log("Getting copy of obj ", this)
		const obj = new UserSettings()
		obj.image_paths = this.image_paths 
		obj.box_color = this.box_color
		obj.box_type = this.box_type
		return obj
	}
	get_puzzle_image_paths() {
		const rv = {}
		for(let i = min_image_number; i <= max_image_number; ++i) {
			if(this.is_custom[i]) {
				rv[i] = this.custom_image_paths[i]
			}
			else {
				rv[i] = this.image_paths[i]
			}
		}
		rv[space_number] = ''
		return rv
	}
	get_puzzle_image_paths_without_null() {
		const rv = {}
		for(let i = min_image_number; i <= max_image_number; ++i) {
			if(this.is_custom[i]) {
				rv[i] = this.custom_image_paths[i]
				if (rv[i] === null) {
					rv[i] = this.image_paths[i]
				}
			}
			else {
				rv[i] = this.image_paths[i]
			}
		}
		rv[space_number] = ''
		return rv
	}
	get_image_colors() {
		const rv = {}
		for(let i = min_image_number; i <= max_image_number; ++i) {
			rv[i] = get_color_by_path(i, this.image_paths[i])
		}
		console.log("rv")
		console.log(rv)
		return rv

	}
}
export default UserSettings;
