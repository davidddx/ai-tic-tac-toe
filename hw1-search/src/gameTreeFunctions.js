import {Heap} from 'heap-js'
import TreeNode from './Tree.js'
import {rotate_board_90, rotate_board_180, rotate_board_270, flip_horizontal, flip_vertical, board_string_to_array} from './boardFunctions.js'
import * as user_settings from './TicTacToeSettings.jsx'

// checks if won given board, character, and num rows  
export const check_win = (board, character, num_rows) => {
	let solved = true 
	// check horizontal 
	for(let i = 0; i < num_rows; ++i) {
		let solved = true
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

//check if win possible
export const check_win_possible = (board, num_rows) => {
	//console.log("BOARD: ", board)
	const check_x_board = board.map(item => item == user_settings.none_char ? user_settings.x_char : item)
	if(check_win(check_x_board, user_settings.x_char, num_rows)) {
		return true
	}
	const check_o_board = board.map(item => item == user_settings.none_char ? user_settings.o_char : item)
	if(check_win(check_o_board, user_settings.o_char, num_rows)) {
		return true
	}
	return false 
}

// check draw
export const check_draw = (board, num_rows) => {
	const win_possible = check_win_possible(board, num_rows)
	const x_win = check_win(board, user_settings.x_char, num_rows)
	const o_win = check_win(board, user_settings.o_char, num_rows)
	if(x_win || o_win) {
		return false
	}
	if(win_possible) {
		return false
	}
	return true
}

// check if terminal state
export const check_terminal = (board, num_rows) => {
	if(check_draw(board, num_rows)) {
		return true
	}
	if(check_win(board, user_settings.x_char, num_rows)) {
		return true
	}
	if(check_win(board, user_settings.o_char, num_rows)) {
		return true
	}
	return false
}

// creates the game tree
export const construct_base_game_tree = (num_rows) => {
	const default_board = []
	for(let i = 0; i < num_rows*num_rows; ++i) {
		default_board.push(user_settings.none_char)
	}
	const queue = [] 
	const root = new TreeNode(default_board.toString())
	const max_char = user_settings.max_char
	const min_char = user_settings.min_char
	const visited = {}
	queue.push([max_char, root])
	let nodes = 0 // just to check for node count for comparative analysis
	let max_queue_length = Number.MIN_SAFE_INTEGER
	while(queue.length > 0) {
		const [curr_char, board_tree] = queue.shift()
		const board_string = board_tree.value
		max_queue_length = Math.max(max_queue_length, queue.length)
		if(board_string in visited) {
			board_tree.children = visited[board_string].children
			continue
		}
		nodes += 1
		const board = board_string_to_array(board_string)
		const succeeding_states = get_all_moves_normalized(board, num_rows, curr_char) 
		const succeeding_nodes = succeeding_states.map((s) => new TreeNode(s.toString()))
		const filtered_nodes = succeeding_nodes.filter((node) => !check_terminal(board_string_to_array(node.value), num_rows))
		let next_char = min_char
		if(curr_char === min_char) {
			next_char = max_char
		}
		for(const node of succeeding_nodes) {
			if(node.value in visited) {
				board_tree.children.push(visited[node.value])
				continue
			}
			board_tree.children.push(node)
		}
		for(const node of filtered_nodes) {
			if(node.value in visited) {
				continue
			}
			queue.push([next_char, node])
		}
		visited[board_string] = board_tree 
	}
	return root 
}

// values for minimax
const draw_value = 0
const win_value = 10
const lose_value = -10

// runs alpha beta pruning
// assuming that max char is x and min char is o,
// and that max char moves first
export const run_alpha_beta_pruning_on_game_tree = (game_tree, num_rows, player_char) => {
	const score_node_map = {}
	const visited = new Set()
	const min_char = user_settings.min_char 
	const max_char = user_settings.max_char 
	let nodes_visited = 0
	const minimax = (board, is_max, alpha, beta) => {
		if(visited.has(board.value)) {
			return score_node_map[board.value]
		}
		const board_array = board_string_to_array(board.value)
		if(check_terminal(board_array, num_rows)) {
			if(check_draw(board_array, num_rows)) {
				score_node_map[board.value] = draw_value 
				return draw_value
			}
			else if(check_win(board_array, max_char, num_rows)) {
				score_node_map[board.value] = win_value
				return win_value 
			}
			else if(check_win(board_array, min_char, num_rows)){
				score_node_map[board.value] = lose_value
				return lose_value
			}
			else {
				console.error("INVALID TERMINAL STATE DETECTED FOR ", board)
			}
		}
		nodes_visited++
		if(is_max) {
			let best = Number.MIN_SAFE_INTEGER
			for(const child of board.children) {
				const score = minimax(child, false, alpha, beta)
				best = Math.max(best, score)
				alpha = Math.max(alpha, best)
				if(beta <= alpha) {
					break
				}
			}
			visited.add(board.value)
			score_node_map[board.value] = best
			return best
		}
		else {
			let best = Number.MAX_SAFE_INTEGER
			for(const child of board.children) {
				const score = minimax(child, true, alpha, beta)
				best = Math.min(best, score)
				beta = Math.min(beta, best)
				if(beta <= alpha) {
					break
				}
			}
			visited.add(board.value)
			score_node_map[board.value] = best
			return best
		}
	}
	const start_max = player_char === max_char 
	const initial_alpha = Number.MIN_SAFE_INTEGER
	const initial_beta = Number.MAX_SAFE_INTEGER
	const start = new Date().getTime();
	const rv = minimax(game_tree, start_max, initial_alpha, initial_beta)
	const end = new Date().getTime()
	const solve_time = end - start
	console.log("ALPHA-BETA PRUNING NODES VISITED: ", nodes_visited)
	let max_child = null
	let min_child = null
	for(const child of game_tree.children) {
		if(max_child === null) {
			max_child = child
			min_child = child
			continue
		}
		if(score_node_map[max_child.value] < score_node_map[child.value]) {
			max_child = child
		}
		if(score_node_map[min_child.value] > score_node_map[child.value]) {
			min_child = child
		}
	}
	const node =  start_max ? max_child : min_child
	return [node, solve_time, nodes_visited]
}

// same as above but minimax i.e. no alpha-beta pruning
export const run_minimax_on_game_tree = (game_tree, num_rows, player_char) => {
	const score_node_map = {}
	const visited = new Set()
	const min_char = user_settings.min_char 
	const max_char = user_settings.max_char 
	let nodes_visited = 0
	const minimax = (board, is_max) => {
		if(visited.has(board.value)) {
			return score_node_map[board.value]
		}
		const board_array = board_string_to_array(board.value)
		if(check_terminal(board_array, num_rows)) {
			if(check_draw(board_array, num_rows)) {
				score_node_map[board.value] = draw_value 
				return draw_value
			}
			else if(check_win(board_array, max_char, num_rows)) {
				score_node_map[board.value] = win_value
				return win_value 
			}
			else if(check_win(board_array, min_char, num_rows)){
				score_node_map[board.value] = lose_value
				return lose_value
			}
			else {
				console.error("INVALID TERMINAL STATE DETECTED FOR ", board)
			}
		}
		nodes_visited++;
		if(is_max) {
			let best = Number.MIN_SAFE_INTEGER
			for(const child of board.children) {
				const score = minimax(child, false)
				best = Math.max(best, score)
			}
			visited.add(board.value)
			score_node_map[board.value] = best
			return best
		}
		else {
			let best = Number.MAX_SAFE_INTEGER
			for(const child of board.children) {
				const score = minimax(child, true)
				best = Math.min(best, score)
			}
			visited.add(board.value)
			score_node_map[board.value] = best
			return best
		}
	}
	const start_max = player_char === max_char 
	const start = new Date().getTime();
	const rv = minimax(game_tree, start_max)
	const end = new Date().getTime();
	const solve_time = end - start
	let max_child = null
	let min_child = null
	for(const child of game_tree.children) {
		if(max_child === null) {
			max_child = child
			min_child = child
			continue
		}
		if(score_node_map[max_child.value] < score_node_map[child.value]) {
			max_child = child
		}
		if(score_node_map[min_child.value] > score_node_map[child.value]) {
			min_child = child
		}
	}
	console.log("Minimax nodes visited: ", nodes_visited)
	const node = start_max ? max_child : min_child
	return [node, solve_time, nodes_visited]
}

//gets all possible moves of board and normalizes for smaller state space.
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
	return rv
}

// normalization function on lexicographic order
export const normalize = (board, num_rows) => {
	const transformations = []
	transformations.push(board)
	transformations.push(rotate_board_90(board, num_rows))
	transformations.push(rotate_board_180(board, num_rows))
	transformations.push(rotate_board_270(board, num_rows))
	transformations.push(flip_horizontal(board, num_rows))
	transformations.push(flip_vertical(board, num_rows))
	transformations.push(rotate_board_90(flip_horizontal(board, num_rows), num_rows))
	transformations.push(rotate_board_90(flip_vertical(board, num_rows), num_rows))
	let canonical_form = transformations[0]
	for(const transformed_board of transformations) {
		if(transformed_board.toString().localeCompare(canonical_form.toString()) < 0) {
			canonical_form = transformed_board
		}
	}
	return canonical_form
}

// reverses normalization given old_board state and current board. 
export const denormalize = (old_board, board, num_rows) => {
	const transformations = []
	transformations.push(board)
	transformations.push(rotate_board_90(board, num_rows))
	transformations.push(rotate_board_180(board, num_rows))
	transformations.push(rotate_board_270(board, num_rows))
	transformations.push(flip_horizontal(board, num_rows))
	transformations.push(flip_vertical(board, num_rows))
	transformations.push(rotate_board_90(flip_horizontal(board, num_rows), num_rows))
	transformations.push(rotate_board_90(flip_vertical(board, num_rows), num_rows))
	for(const transformed_board of transformations) {
		let num_different_characters = 0
		for(let i = 0; i < transformed_board.length; ++i) {
			if(transformed_board[i] !== old_board[i]) {
				num_different_characters++
			}
		}
		if(num_different_characters === 1) {
			return transformed_board
		}
	}
	return null 
}
