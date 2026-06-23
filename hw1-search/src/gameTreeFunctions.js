import {Heap} from 'heap-js'
import {rotate_board_90, rotate_board_180, rotate_board_270, flip_horizontal, flip_vertical} from './boardFunctions.js'
import * as user_settings from './TicTacToeSettings.jsx'

export const check_win_possible = (board, num_rows) => {
	if(check_win(board, user_settings.no_char, num_rows)) {
		return true
	}
	return false 
}

export const check_draw = (board, num_rows) => {
	const win_possible = check_win_possible(board, num_rows)
	const x_win = check_win(board, user_settings.x_char, num_rows)
	const o_win = check_win(board, user_settings.o_char, num_rows)
	if(win_possible) {
		return false
	}
	if(x_win || o_win) {
		return false
	}
	return true
}

export const construct_base_game_tree = () => {
	return []

}


const minimax = () => {

}

export const get_all_moves_normalized = (board, num_rows, character) => {
	const rv_set = new Set()
	for(let i = 0; i < num_rows; ++i) {
		for(let j = 0; j < num_rows; ++j) {
			const index = 3*i + j
			if(board[index] !== user_settings.none_char) {
				continue
			}
			const new_board = [...board]
			new_board[index] = character
			const normalized = normalize(new_board, num_rows)
			rv_set.add(normalized.toString())
		}
	}
	const rv = [...rv_set].map((x) => x.split(','))
	console.log("rv: ", rv)
	return rv
}

const construct_game_tree = (num_rows) => {
}

export const normalize = (board, num_rows) => {
	const transformations = []
	transformations.push(board)
	transformations.push(rotate_board_90(board, num_rows))
	transformations.push(rotate_board_180(board, num_rows))
	transformations.push(rotate_board_270(board, num_rows))
	transformations.push(flip_horizontal(board, num_rows))
	transformations.push(flip_vertical(board, num_rows))
	transformations.push(rotate_board_90(flip_horizontal(board, num_rows)))
	transformations.push(rotate_board_90(flip_vertical(board, num_rows)))
	let canonical_form = transformations[0]
	for(const transformed_board of transformations) {
		if(transformed_board.toString().localeCompare(canonical_form.toString()) < 0) {
			canonical_form = transformed_board
		}
	}
	return canonical_form
}

export const check_win = (board, character, num_rows) => {
	let solved = true 
	// check horizontal 
	for(let i = 0; i < num_rows; ++i) {
		solved = true
		for(let j = 0; j < num_rows; ++j) {
			const one_dimensional_index = i*num_rows + j
			if(board[one_dimensional_index] !== character) {
				solved = false
				break
			}
		}
		if(solved) {
			return true
		}
	}
	// vertical 
	for(let i = 0; i < num_rows; ++i) {
		solved = true
		for(let j = 0; j < num_rows; ++j) {
			const one_dimensional_index = i + j*num_rows
			if(board[one_dimensional_index] !== character) {
				solved = false
				break
			}
		}
		if(solved) {
			return true
		}
	}
	// topleft to bottomright diagonal
	solved = true
	for(let i = 0; i < num_rows; ++i) {
		const one_dimensional_index = i*num_rows + i
		if(board[one_dimensional_index] !== character) {
			solved = false
			break
		}
	}
	if(solved) {
		return true
	}
	// bottomleft to topright diagonal
	solved = true
	for(let i = 0; i < num_rows; ++i) {
		const one_dimensional_index = (i+1)*num_rows - (i+1)
		if(board[one_dimensional_index] !== character) {
			solved = false
			break
		}

	}
	return solved 
}
