import * as user_settings from './TicTacToeSettings.jsx'

export const rotate_board_90 = (board, num_rows) => {
	const new_board = [...board]
	for(let i = 0; i < num_rows; ++i) {
		for(let j = 0; j < num_rows; ++j) {
			const original_index = num_rows*i + j
			const new_col_index = num_rows - i - 1
			const new_row_index = j
			const new_index = num_rows*new_row_index + new_col_index
			new_board[new_index] = board[original_index]
		}
	}
	return new_board
}

export const rotate_board_270 = (board, num_rows) => {
	const rotated_90 = rotate_board_90(board, num_rows)
	return rotate_board_180(rotated_90, num_rows)
}

export const board_string_to_array = (string) => {
	return string.split(',')	
}

export const rotate_board_180 = (board, num_rows) => {
	return [...board].reverse()	
}

export const flip_vertical = (board, num_rows) => {
	const new_board = [...board]
	for(let i = 0; i < num_rows; ++i) {
		for(let j = 0; j < num_rows; ++j) {
			const new_row_index = num_rows - i - 1
			const new_col_index = j
			const new_index = num_rows*new_row_index + new_col_index
			const original_index = num_rows*i + j
			new_board[new_index] = board[original_index]
		}
	}
	return new_board
}

export const flip_horizontal = (board, num_rows) => {
	const new_board = [...board]
	for(let i = 0; i < num_rows; ++i) {
		for(let j = 0; j < num_rows; ++j) {
			const new_row_index = i
			const new_col_index = num_rows - j - 1
			const new_index = num_rows*new_row_index + new_col_index
			const original_index = num_rows*i + j
			new_board[new_index] = board[original_index]
		}
	}
	return new_board
}

export const turn_to_2d = (board, num_rows) => {
	const outer = []
	let inner = []
	for(let i = 0; i < board.length; ++i) {
		if(i !== 0 && i % num_rows === 0) {
			outer.push(inner)
			inner = []
		}
		inner.push(board[i])
	}
	outer.push(inner)
	return outer
}


