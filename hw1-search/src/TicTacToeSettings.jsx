export const player_vs_ai_mode = "Player vs AI"
export const ai_vs_ai_mode = "AI vs AI"
export const default_mode = player_vs_ai_mode
export const mode_options = [ai_vs_ai_mode, player_vs_ai_mode]
export const red_color = "red"
export const black_color = "black"
export const blue_color = "blue"
export const green_color = "green"
export const cyan_color = "cyan"
export const yellow_color = "yellow"
export const purple_color = "purple"
export const available_colors = [red_color, black_color, blue_color, green_color, cyan_color, yellow_color, purple_color]
export const no_color = "no_color"
export const default_x_color = red_color
export const default_o_color = red_color
export const default_lines_color = green_color
export const default_tic_tac_toe = ['', '', '', '', '', '', '', '', '']
export const default_num_rows = 3
const x_char = 'x'
const o_char = 'o'
const none_char = ''
const x_dir_path = './images/x_tic_tac_toe'
const o_dir_path = './images/o_tic_tac_toe'
export const user_char = x_char
export const get_image = (value, color) => {
	console.assert(value === o_char || value === x_char || value === none_char, `INVALID VALUE ${value} TO GET IMAGE`)
	if(value === none_char) {
		return ''
	}
	let base = o_dir_path
	let end = 'o.png'
	if(value === x_char) {
		base = x_dir_path
		end = 'x.png'
	}
	console.assert(available_colors.includes(color), `INVALID COLOR ${color} TO GET COLOR`)
	base += `/${color}/${end}`
	return base
}
