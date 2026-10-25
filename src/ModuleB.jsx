import {Dropdown} from './Button.jsx'
import {useState, useRef, useEffect} from 'react'
import sleep from './sleep.js'
import * as user_settings from './TicTacToeSettings.jsx'
import Button from './Button.jsx'
import {run_minimax_on_game_tree, run_alpha_beta_pruning_on_game_tree, construct_base_game_tree, check_win, normalize, denormalize, check_draw, check_terminal} from './gameTreeFunctions.js'
import {turn_to_2d, board_string_to_array} from './boardFunctions.js'

// displays the game result message, play again button
function TicTacToeFooter({draw, player_won, ai_won, player_1_won, player_2_won, ai_1_won, ai_2_won, on_play_again_click, minimax_time, minimax_visited, alpha_beta_pruning_time, alpha_beta_pruning_visited, 
	ai_1_minimax_time,
	ai_1_minimax_visited,
	ai_1_alpha_beta_pruning_time,
	ai_1_alpha_beta_pruning_visited,
	ai_2_minimax_time,
	ai_2_minimax_visited,
	ai_2_alpha_beta_pruning_time,
	ai_2_alpha_beta_pruning_visited,
	settings,
	ui_lock,
	set_ui_lock
}) {

	let result = ""
	if(player_won) {
		result = `${user_settings.player} wins!`
	}
	else if(ai_won) {
		result = `${user_settings.ai} wins!`
	}
	else if(player_1_won) {
		result = `${user_settings.player_1} wins!`
	}
	else if(player_2_won) {
		result = `${user_settings.player_2} wins!`
	}
	else if(ai_1_won) {
		result = `${user_settings.ai_1} wins!`
	}
	else if(ai_2_won) {
		result = `${user_settings.ai_2} wins!`
	}
	else if(draw) {
		result = 'Draw.'
	}
	const button_class_name = "tic-tac-toe-footer-button"
	const button_hover_class_name = "tic-tac-toe-footer-button-hover"
	const play_again_text = "Play Again"
	const on_button_press = (e) => {
		if(e.target.textContent !== play_again_text) {
			return
		}
		on_play_again_click()
	}
	let pruning_efficiency = 1 - alpha_beta_pruning_visited/minimax_visited
	if(isNaN(pruning_efficiency)) {
		pruning_efficiency = 0
	}
	else {
		pruning_efficiency *= 100
	}

	if(settings.mode !== user_settings.ai_vs_ai_mode) {
		return (
			<div className="tic-tac-toe-footer-wrapper">
				<div className="tic-tac-toe-footer-result">
					{result}
				</div>
				<div className="tic-tac-toe-footer-button-wrapper" onClick={on_button_press}>
					{result !== '' && <Button text={play_again_text} class_name={button_class_name} hovered_class_name={button_hover_class_name}/>}
				</div>
				<div>
					{settings.ai_algorithm === user_settings.minimax_algorithm_name && `Minimax Time: ${minimax_time} ms`}
				</div>
				<div>
					{settings.ai_algorithm === user_settings.minimax_algorithm_name && `Minimax Nodes visited: ${minimax_visited}`}
				</div>
				<div>
					{settings.ai_algorithm === user_settings.alpha_beta_pruning_algorithm_name && `Alpha Beta Pruning Time: ${alpha_beta_pruning_time} ms`}
				</div>
				<div>
					{settings.ai_algorithm === user_settings.alpha_beta_pruning_algorithm_name && `Alpha Beta Pruning Nodes Visited: ${alpha_beta_pruning_visited}`}
				</div>
					
				<div>
					{settings.ai_algorithm === user_settings.alpha_beta_pruning_algorithm_name && `Pruning Efficiency: ${pruning_efficiency.toPrecision(5)}%`}
				</div>
			</div>

		)
	}
	else if(settings.mode === user_settings.ai_vs_ai_mode) {
		let ai_1_pruning_efficiency = 1 - ai_1_alpha_beta_pruning_visited/ai_1_minimax_visited
		let ai_2_pruning_efficiency = 1 - ai_2_alpha_beta_pruning_visited/ai_2_minimax_visited
		if(isNaN(ai_1_pruning_efficiency)) {
			ai_1_pruning_efficiency = 0
		}
		else {
			ai_1_pruning_efficiency *= 100
		}
		if(isNaN(ai_2_pruning_efficiency)) {
			ai_2_pruning_efficiency = 0
		}
		else {
			ai_2_pruning_efficiency *= 100
		}
		return (
			<div className="tic-tac-toe-footer-wrapper">
				<div className="tic-tac-toe-footer-result">
					{result}
				</div>
				<div className="tic-tac-toe-footer-button-wrapper" onClick={on_button_press}>
					{result !== '' && <Button text={play_again_text} class_name={button_class_name} hovered_class_name={button_hover_class_name}/>}
				</div>
				<div className="puzzle-subtitle">
					{user_settings.ai_1}
				</div>
				<div>
					{settings.ai_1_algorithm === user_settings.minimax_algorithm_name && `Minimax Time: ${ai_1_minimax_time} ms`}
				</div>
				<div>
					{settings.ai_1_algorithm === user_settings.minimax_algorithm_name && `Minimax Nodes visited: ${ai_1_minimax_visited}`}
				</div>
				<div>
					{settings.ai_1_algorithm === user_settings.alpha_beta_pruning_algorithm_name && `Alpha Beta Pruning Time: ${ai_1_alpha_beta_pruning_time} ms`}
				</div>
				<div>
					{settings.ai_1_algorithm === user_settings.alpha_beta_pruning_algorithm_name && `Alpha Beta Pruning Nodes Visited: ${ai_1_alpha_beta_pruning_visited}`}
				</div>
					
				<div>
					{settings.ai_1_algorithm === user_settings.alpha_beta_pruning_algorithm_name && `Pruning Efficiency: ${ai_1_pruning_efficiency.toPrecision(5)}%`}
				</div>
				<div className="puzzle-subtitle">
					{user_settings.ai_2}
				</div>
				<div>
					{settings.ai_2_algorithm === user_settings.minimax_algorithm_name && `Minimax Time: ${ai_2_minimax_time} ms`}
				</div>
				<div>
					{settings.ai_2_algorithm === user_settings.minimax_algorithm_name && `Minimax Nodes visited: ${ai_2_minimax_visited}`}
				</div>
				<div>
					{settings.ai_2_algorithm === user_settings.alpha_beta_pruning_algorithm_name && `Alpha Beta Pruning Time: ${ai_2_alpha_beta_pruning_time} ms`}
				</div>
				<div>
					{settings.ai_2_algorithm === user_settings.alpha_beta_pruning_algorithm_name && `Alpha Beta Pruning Nodes Visited: ${ai_2_alpha_beta_pruning_visited}`}
				</div>
					
				<div>
					{settings.ai_2_algorithm === user_settings.alpha_beta_pruning_algorithm_name && `Pruning Efficiency: ${ai_2_pruning_efficiency.toPrecision(5)}%`}
				</div>
			</div>

		)
	}
	return (
		<div className="tic-tac-toe-footer-wrapper">
			<div className="tic-tac-toe-footer-result">
				{result}
			</div>
			<div className="tic-tac-toe-footer-button-wrapper" onClick={on_button_press}>
				{result !== '' && <Button text={play_again_text} class_name={button_class_name} hovered_class_name={button_hover_class_name}/>}
			</div>
		</div>
	)
}

// Header for managing settings using a bunch of dropdowns 
// just a bunch of button listeners and making options according
// to current gamemode.
function TicTacToeHeader({settings, set_settings, set_board, set_game_tree, default_game_tree, ai_vs_ai_done, set_ai_vs_ai_done, player_vs_ai_done, set_player_vs_ai_done, set_ui_lock, turn, set_turn}) {
	const choose_mode_text = "Choose Mode"
	const first_to_move_text = "First to Move"
	const class_name = "attribute-dropdown"
	const on_change_mode = (e) => {
		const options = e.target.options
		const text = options[options.selectedIndex].textContent
		const cpy = settings.get_copy()
		cpy.mode = text
		if(text === user_settings.ai_vs_ai_mode) {
			cpy.first_to_move = user_settings.ai_1
			cpy.ai_1_char = user_settings.x_char
			cpy.ai_2_char = user_settings.o_char
			set_ai_vs_ai_done(false)
		}
		else if(text === user_settings.player_vs_player_mode) {
			cpy.first_to_move = user_settings.player_1
		}
		else {
			cpy.first_to_move = user_settings.player
		}
		set_turn(cpy.first_to_move)
		set_settings(cpy)
		set_board(user_settings.default_tic_tac_toe)
		set_game_tree(default_game_tree)
		set_ui_lock(false)
		console.log("SETTING SETTINGS: ", cpy)
	}
	const on_change_first_to_move = (e) => {
		if(!player_vs_ai_done && settings.mode === user_settings.player_vs_ai_mode) {
			return
		}
		if(!ai_vs_ai_done && settings.mode === user_settings.ai_vs_ai_mode) {
			return
		}
		const options = e.target.options
		const text = options[options.selectedIndex].textContent
		const cpy = settings.get_copy()
		cpy.first_to_move = text
		if(cpy.mode === user_settings.ai_vs_ai_mode) {
			cpy.ai_1_char = user_settings.x_char
			cpy.ai_2_char = user_settings.o_char
			set_ai_vs_ai_done(false)
			set_turn(user_settings.first_to_move)
		}
		if (cpy.mode === user_settings.player_vs_player_mode) {
			set_ui_lock(false)
			set_turn(cpy.first_to_move)
		}
		set_settings(cpy)
		set_board(user_settings.default_tic_tac_toe)
		set_game_tree(default_game_tree)
	}
	const on_change_ai_algorithm = (e) => {
		if(!player_vs_ai_done) {
			return
		}
		const options = e.target.options
		const text = options[options.selectedIndex].textContent
		const cpy = settings.get_copy()
		cpy.ai_algorithm = text
		set_settings(cpy)
	}
	const on_change_ai_1_algorithm = (e) => {
		if(!ai_vs_ai_done) {
			return
		}
		const options = e.target.options
		const text = options[options.selectedIndex].textContent
		const cpy = settings.get_copy()
		cpy.ai_1_algorithm = text
		set_settings(cpy)
	}
	const on_change_ai_2_algorithm = (e) => {
		if(!ai_vs_ai_done) {
			return
		}
		const options = e.target.options
		const text = options[options.selectedIndex].textContent
		const cpy = settings.get_copy()
		cpy.ai_2_algorithm = text
		set_settings(cpy)
	}
	const on_change_player = (e) => {
		const options = e.target.options
		const text = options[options.selectedIndex].textContent
		const cpy = settings.get_copy()
		cpy.user_char = text
		cpy.ai_char = cpy.user_char === user_settings.x_char ? user_settings.o_char : user_settings.x_char
		set_settings(cpy)
	}
	const on_change_player_1 = (e) => {
		const options = e.target.options
		const text = options[options.selectedIndex].textContent
		const cpy = settings.get_copy()
		cpy.user_1_char = text
		cpy.user_2_char = text === user_settings.o_char ? user_settings.x_char : user_settings.o_char
		set_settings(cpy)
	}
	const on_change_player_2 = (e) => {
		const options = e.target.options
		const text = options[options.selectedIndex].textContent
		const cpy = settings.get_copy()
		cpy.user_2_char = text
		cpy.user_1_char = text === user_settings.o_char ? user_settings.x_char : user_settings.o_char
		set_settings(cpy)
	}
	const on_change_ai_1 = (e) => {
		const options = e.target.options
		const text = options[options.selectedIndex].textContent
		const cpy = settings.get_copy()
		cpy.ai_1_char = text
		cpy.ai_2_char = text === user_settings.o_char ? user_settings.x_char : user_settings.o_char
		set_settings(cpy)
	}
	const on_change_ai_2 = (e) => {
		const options = e.target.options
		const text = options[options.selectedIndex].textContent
		const cpy = settings.get_copy()
		cpy.ai_2_char = text
		cpy.ai_1_char = text === user_settings.o_char ? user_settings.x_char : user_settings.o_char
		set_settings(cpy)
	}
	const on_change_x_color = (e) => {
		const options = e.target.options
		const text = options[options.selectedIndex].textContent
		const cpy = settings.get_copy()
		cpy.x_color = text
		set_settings(cpy)
	}
	const on_change_o_color = (e) => {
		const options = e.target.options
		const text = options[options.selectedIndex].textContent
		const cpy = settings.get_copy()
		cpy.o_color = text
		set_settings(cpy)
	}
	let first_to_move_options = user_settings.first_to_move_options_player_vs_ai
	if(settings.mode === user_settings.player_vs_player_mode) {
		first_to_move_options = user_settings.first_to_move_options_player_vs_player
	}
	else if(settings.mode === user_settings.ai_vs_ai_mode) {
		first_to_move_options = user_settings.first_to_move_options_ai_vs_ai
	}
	const x_color_text = "x color"
	const o_color_text = "o color"
	return (
		<div className="tic-tac-toe-header">
			<Dropdown text={choose_mode_text} options={user_settings.mode_options} class_name={class_name} on_change={on_change_mode} selected={settings.mode}/>
			<Dropdown text={first_to_move_text} options={first_to_move_options} class_name={class_name} on_change={on_change_first_to_move} selected={settings.first_to_move}/>
			{settings.mode === user_settings.player_vs_ai_mode && 
				<Dropdown text={user_settings.player} options={user_settings.char_options} class_name={class_name} on_change={on_change_player} selected={settings.user_char}/> } 
			{settings.mode === user_settings.player_vs_player_mode && 
				<Dropdown text={user_settings.player_1} options={user_settings.char_options} class_name={class_name} on_change={on_change_player_1} selected={settings.user_1_char}/> }
			{settings.mode === user_settings.player_vs_player_mode && 
				<Dropdown text={user_settings.player_2} options={user_settings.char_options} class_name={class_name} on_change={on_change_player_2} selected={settings.user_2_char}/>}
			{settings.mode === user_settings.ai_vs_ai_mode && 
				<Dropdown text={user_settings.ai_1} options={user_settings.char_options} class_name={class_name} on_change={on_change_ai_1} selected={settings.ai_1_char}/> }
			{settings.mode === user_settings.ai_vs_ai_mode && 
				<Dropdown text={user_settings.ai_2} options={user_settings.char_options} class_name={class_name} on_change={on_change_ai_2} selected={settings.ai_2_char}/>}
			{settings.mode === user_settings.ai_vs_ai_mode && 
				<Dropdown text={user_settings.ai_1_algorithm} options={user_settings.algorithm_options} class_name={class_name} on_change={on_change_ai_1_algorithm} selected={settings.ai_1_algorithm}/>
			}
			{settings.mode === user_settings.ai_vs_ai_mode && 
				<Dropdown text={user_settings.ai_2_algorithm} options={user_settings.algorithm_options} class_name={class_name} on_change={on_change_ai_2_algorithm} selected={settings.ai_2_algorithm}/>
			}
			{settings.mode === user_settings.player_vs_ai_mode && 
				<Dropdown text={user_settings.ai_algorithm} options={user_settings.algorithm_options} class_name={class_name} on_change={on_change_ai_algorithm} selected={settings.ai_algorithm}/>
			}
			<Dropdown text={x_color_text} options={user_settings.available_colors} class_name={class_name} on_change={on_change_x_color} selected={settings.x_color}/>
			<Dropdown text={o_color_text} options={user_settings.available_colors} class_name={class_name} on_change={on_change_o_color} selected={settings.o_color}/>

		</div>
	)

}

// Image i.e. the X and O and its border
function BoardImage({value, color, row_idx, col_idx}) {
	const class_name = "center fit tic-tac-toe-image"
	const img_src = user_settings.get_image(value, color)
	return (
		<div className={class_name} row_idx={row_idx} col_idx={col_idx}>
			{img_src !== user_settings.none_char && <img className={class_name} src={img_src} row_idx={row_idx} col_idx={col_idx}/>}
		</div>
	)
}


// does ai move assuming that board.toString() is one of the
// values of a child node of game_tree.children
const do_ai_move = async (game_tree, board, num_rows, character, algorithm) => {
	await sleep(10)
	const board_normalized = normalize(board, num_rows)
	const game_tree_after_move = game_tree.children.filter((x) => x.value === board_normalized.toString())[0]
	console.log("Board normalized: ", board_normalized)
	console.log("GAME TREE AFTER MOVE: ", game_tree_after_move)
	const res = run_minimax_on_game_tree(game_tree_after_move, num_rows, character)
	const res2 = run_alpha_beta_pruning_on_game_tree(game_tree_after_move, num_rows, character)
	console.log("RES: ", res)
	if(algorithm === user_settings.alpha_beta_pruning_algorithm_name) {
		const denormalized_board = denormalize(board, board_string_to_array(res2[0].value, num_rows), num_rows)
		console.log("denormalized board: ", denormalized_board)
		return [res, denormalized_board, res2] 
	}
	else {
		const denormalized_board = denormalize(board, board_string_to_array(res[0].value, num_rows), num_rows)
		console.log("denormalized board: ", denormalized_board)
		return [res, denormalized_board, res2] 
	}
}

// does ai move according to the game tree 
const do_ai_move_first = async (game_tree, board, num_rows, character, algorithm) => {
	await sleep(1000)
	const board_normalized = normalize(board, num_rows)
	console.log("Board normalized: ", board_normalized)
	console.log("GAME TREE AFTER MOVE: ", game_tree)
	const res = run_minimax_on_game_tree(game_tree, num_rows, character)
	const res2 = run_alpha_beta_pruning_on_game_tree(game_tree, num_rows, character)
	console.log("RES: ", res)
	console.log("RES 2: ", res2)
	if(algorithm === user_settings.alpha_beta_pruning_algorithm_name) {
		const denormalized_board = denormalize(board, board_string_to_array(res2[0].value, num_rows), num_rows)
		console.log("denormalized board: ", denormalized_board)
		return [res, denormalized_board, res2] 

	}
	else {
		const denormalized_board = denormalize(board, board_string_to_array(res[0].value, num_rows), num_rows)
		console.log("denormalized board: ", denormalized_board)
		return [res, denormalized_board, res2] 
	}
}

// Inverts characters on render 
// so i can keep logic of
// x player being first to move
// and o player being the next
const invert = (character) => {
	if(character !== user_settings.x_char && character !== user_settings.o_char) {
		return user_settings.none_char
	}
	if(character === user_settings.x_char) {
		console.log("returning o char")
		return user_settings.o_char
	}
	return user_settings.x_char
}

const player_vs_ai_id = 0
const player_vs_player_id = 1
const ai_vs_ai_id = 2

// Player vs ai mode
function BoardDisplay({board, set_board, ui_lock, set_ui_lock, game_tree, set_game_tree, settings, player_vs_ai_done, set_player_vs_ai_done,
			set_minimax_time,
			set_minimax_visited,
			set_alpha_beta_pruning_time,
			set_alpha_beta_pruning_visited
}) {
	const board_wrapper_classname = "board-wrapper"
	const board_2d = turn_to_2d(board, settings.num_rows)
	const row_class_name = "tic-tac-toe-row"
	let invert_chars = false
	if(settings.first_to_move === user_settings.player && settings.user_char === user_settings.o_char) {
		invert_chars = true
	}
	else if(settings.first_to_move === user_settings.ai && settings.ai_char === user_settings.o_char) {
		invert_chars = true
	}
	const generate_row = (entry, row_index) => {

		const x_char_color = settings.x_color
		const o_char_color = settings.o_color
		let new_entry = entry
		if(invert_chars) {
			new_entry = entry.map((x) => invert(x)) 
		}
		return (
			<div className={row_class_name}>
				{new_entry.map((x, index) => <BoardImage key={index} value={x} color={x === user_settings.x_char ? x_char_color : o_char_color} row_idx={row_index} col_idx={index}/>)}
			</div>
		)
	}
	if(check_win(board, user_settings.x_char, settings.num_rows)) {
		console.log("YOU WIN!!!")
	}
	else if(check_draw(board, settings.num_rows)) {
		console.log("DRAW!")
	}
	const on_click = (e) => {
		if(ui_lock) {
			console.log("Clicked but ui is locked")
			return
		}
		const target = e.target
		if(target.tagName !== "DIV") {
			return
		}
		if(!target.classList.contains('tic-tac-toe-image')) {
			return
		}
		set_ui_lock(true)
		console.log("Clicked. Target: ", target)
		const attributes = target.attributes
		const row_value = parseInt(attributes['row_idx'].value)
		const col_value = parseInt(attributes['col_idx'].value)
		const board_idx = row_value*3 + col_value
		if(board[board_idx] === user_settings.x_char || board[board_idx] === user_settings.o_char) {
			return
		}
		const new_board = [...board]
		new_board[board_idx] = settings.first_to_move === user_settings.player ? user_settings.user_char : user_settings.ai_char 
		if(check_terminal(new_board, settings.num_rows)) {
			console.log("game tree: ", game_tree)
			set_board(new_board)
			set_game_tree(game_tree.children.filter((c) => c.toString === new_board.toString())[0])
			return
		}
		set_board(new_board)
		const algorithm = user_settings.ai_algorithm
		const perform_ai_move = async () => {
			let rv = []
			const orig_board = new_board.toString()
			if(settings.first_to_move === user_settings.player) {
				rv = await do_ai_move(game_tree, new_board, settings.num_rows, user_settings.o_char, algorithm)
			}
			else {
				rv = await do_ai_move(game_tree, new_board, settings.num_rows, user_settings.x_char, algorithm)
			}
			let res = rv[0]
			if(algorithm === user_settings.alpha_beta_pruning_algorithm_name) {
				res = rv[2]
			}
			const res_pruning = rv[2]
			const res_minimax = rv[0]
			if(check_terminal(rv[1], settings.num_rows)) {
				console.log("ai move has done a terminal move")
				set_board(rv[1])
				set_game_tree(rv[0])
				return
			}
			set_board(rv[1])
			set_game_tree(res[0])
			console.log("Tree after ai move: ", res[0])
			console.log("Board after ai move: ", rv[1])
			set_ui_lock(false)
			set_player_vs_ai_done(true)
			set_minimax_visited(res_minimax[2])
			set_minimax_time(res_minimax[1])
			set_alpha_beta_pruning_visited(res_pruning[2])
			set_alpha_beta_pruning_time(res_pruning[1])
		}
		set_player_vs_ai_done(false)
		perform_ai_move()
	}
	return (
		<div className={board_wrapper_classname} onClick={on_click}>
			{board_2d.map((entry, index) => generate_row(entry, index))} 
		</div>
	)

}

// AI vs AI mode
function BoardDisplayAIvsAI({board, set_board, game_tree, set_game_tree, settings, turn, set_turn, done, set_done,
	set_ai_1_minimax_time,
	set_ai_1_minimax_visited,
	set_ai_1_alpha_beta_pruning_time,
	set_ai_1_alpha_beta_pruning_visited,
	set_ai_2_minimax_time,
	set_ai_2_minimax_visited,
	set_ai_2_alpha_beta_pruning_time,
	set_ai_2_alpha_beta_pruning_visited
}) {
	const board_wrapper_classname = "board-wrapper"
	const board_2d = turn_to_2d(board, settings.num_rows)
	const row_class_name = "tic-tac-toe-row"
	let invert_chars = false
	if(settings.first_to_move === user_settings.ai_1) {
		if(settings.ai_1_char === user_settings.o_char) {
			invert_chars = true
		}
	}
	if(settings.first_to_move === user_settings.ai_2) {
		if(settings.ai_2_char === user_settings.o_char) {
			invert_chars = true
		}
	}
	const generate_row = (entry, row_index) => {

		const x_char_color = settings.x_color
		const o_char_color = settings.o_color
		let new_entry = entry
		if(invert_chars) {
			new_entry = entry.map((x) => invert(x)) 
		}
		return (
			<div className={row_class_name}>
				{new_entry.map((x, index) => <BoardImage key={index} value={x} color={x === user_settings.x_char ? x_char_color : o_char_color} row_idx={row_index} col_idx={index}/>)}
			</div>
		)
	}
	const next_to_move = settings.first_to_move === user_settings.ai_1 ? 
		user_settings.ai_2 : user_settings.ai_1
	const first_to_move_algorithm = settings.first_to_move === user_settings.ai_1 ?
		settings.ai_1_algorithm : settings.ai_2_algorithm
	const next_to_move_algorithm = settings.first_to_move === user_settings.ai_1 ?
		settings.ai_2_algorithm : settings.ai_1_algorithm
	const currently_moving = user_settings.ai_1 === turn ? user_settings.ai_1 : user_settings.ai_2
	console.log("First to move algorithm: ", first_to_move_algorithm)
	console.log("Next to move algorithm: ", next_to_move_algorithm)
	if(check_win(board, user_settings.x_char, settings.num_rows)) {
		console.log("YOU WIN!!!")
	}
	else if(check_draw(board, settings.num_rows)) {
		console.log("DRAW!")
	}
	else if(!done) {
		if(turn === settings.first_to_move) {
			const perform_ai_move = async (new_board) => {
				const [res_minimax, board_after_ai_move, res_pruning] = await do_ai_move_first(game_tree, new_board, settings.num_rows, user_settings.x_char, first_to_move_algorithm)
				let res = res_pruning
				if(first_to_move_algorithm === user_settings.minimax_algorithm_name) {
					res = res_minimax
				}
				const tree_after_ai_move = res[0]
				const setboardrv = set_board(board_after_ai_move, ai_vs_ai_id)
				if(setboardrv === -1) {
					return
				}
				set_game_tree(tree_after_ai_move)
				if(check_terminal(board_after_ai_move, settings.num_rows)) {
					set_done(true)
				}
				if(currently_moving === user_settings.ai_1) {
					set_ai_1_minimax_time(res_minimax[1])
					set_ai_1_minimax_visited(res_minimax[2])
					set_ai_1_alpha_beta_pruning_time(res_pruning[1])
					set_ai_1_alpha_beta_pruning_visited(res_pruning[2])
				}
				else {
					set_ai_2_minimax_time(res_minimax[1])
					set_ai_2_minimax_visited(res_minimax[2])
					set_ai_2_alpha_beta_pruning_time(res_pruning[1])
					set_ai_2_alpha_beta_pruning_visited(res_pruning[2])
				}
				set_turn(settings.first_to_move === user_settings.ai_1 ? user_settings.ai_2 : user_settings.ai_1)
			}
			perform_ai_move(board).then( () => 
				console.log("AAA")
				//set_turn(settings.first_to_move === user_settings.ai_1 ? user_settings.ai_2 : user_settings.ai_1)
			)
		}
		else if(turn === next_to_move) {
			const perform_ai_move = async (new_board) => {
				const [res_minimax, board_after_ai_move, res_pruning] = await do_ai_move_first(game_tree, new_board, settings.num_rows, user_settings.o_char, next_to_move_algorithm)
				let res = res_pruning
				if(next_to_move_algorithm === user_settings.minimax_algorithm_name) {
					res = res_minimax	
				}
				const tree_after_ai_move = res[0]
				const setboardrv = set_board(board_after_ai_move, ai_vs_ai_id)
				if(setboardrv === -1) {
					return
				}
				set_game_tree(tree_after_ai_move)
				if(check_terminal(board_after_ai_move, settings.num_rows)) {
					set_done(true)
				}
				if(currently_moving === user_settings.ai_1) {
					set_ai_1_minimax_time(res_minimax[1])
					set_ai_1_minimax_visited(res_minimax[2])
					set_ai_1_alpha_beta_pruning_time(res_pruning[1])
					set_ai_1_alpha_beta_pruning_visited(res_pruning[2])
				}
				else {
					set_ai_2_minimax_time(res_minimax[1])
					set_ai_2_minimax_visited(res_minimax[2])
					set_ai_2_alpha_beta_pruning_time(res_pruning[1])
					set_ai_2_alpha_beta_pruning_visited(res_pruning[2])
				}
				set_turn(settings.first_to_move === user_settings.ai_1 ? user_settings.ai_1 : user_settings.ai_2)
			}
			perform_ai_move(board).then(() => 
				console.log("AAA")
				//set_turn(settings.first_to_move === user_settings.ai_1 ? user_settings.ai_1 : user_settings.ai_2)
			)
		}
	}
	return (
		<div className={board_wrapper_classname}>
			{board_2d.map((entry, index) => generate_row(entry, index))} 
		</div>
	)

}

// Player vs Player mode 
function BoardDisplayPlayerVsPlayer({board, ui_lock, settings, turn, set_board, set_ui_lock, set_turn}) {
	const board_wrapper_classname = "board-wrapper"
	const board_2d = turn_to_2d(board, settings.num_rows)
	const row_class_name = "tic-tac-toe-row"
	let invert_chars = false
	if(settings.mode === user_settings.player_vs_player_mode) {
		if(settings.first_to_move === user_settings.player_1 && settings.user_1_char === user_settings.o_char) {
			invert_chars = true
		}
		else if(settings.first_to_move === user_settings.player_2 && settings.user_2_char === user_settings.x_char) {
			invert_chars = true
		}
	}
	console.log("INVERT CHARS: ",invert_chars)
	const generate_row = (entry, row_index) => {

		const x_char_color = settings.x_color
		const o_char_color = settings.o_color
		let new_entry = entry
		if(invert_chars) {
			new_entry = entry.map((x) => invert(x)) 
		}
		return (
			<div className={row_class_name}>
				{new_entry.map((x, index) => <BoardImage key={index} value={x} color={x === user_settings.x_char ? x_char_color : o_char_color} row_idx={row_index} col_idx={index}/>)}
			</div>
		)
	}
	if(check_win(board, user_settings.x_char, settings.num_rows)) {
		console.log("YOU WIN!!!")
	}
	else if(check_draw(board, settings.num_rows)) {
		console.log("DRAW!")
	}
	const on_click = (e) => {
		if(ui_lock) {
			console.log("Clicked but ui is locked")
			return
		}
		const target = e.target
		if(target.tagName !== "DIV") {
			return
		}
		if(!target.classList.contains('tic-tac-toe-image')) {
			return
		}
		set_ui_lock(true)
		console.log("Clicked. Target: ", target)
		const attributes = target.attributes
		const row_value = parseInt(attributes['row_idx'].value)
		const col_value = parseInt(attributes['col_idx'].value)
		const board_idx = row_value*3 + col_value
		if(board[board_idx] === user_settings.x_char || board[board_idx] === user_settings.o_char) {
			return
		}
		const new_board = [...board]
		if(turn === user_settings.player_1) {
			new_board[board_idx] = user_settings.player_1_char
		}
		else {
			new_board[board_idx] = user_settings.player_2_char
		}
		if(check_terminal(new_board, settings.num_rows)) {
			set_board(new_board)
			return
		}
		set_board(new_board)
		if(turn === user_settings.player_1) {
			set_turn(user_settings.player_2)
		}
		else {
			set_turn(user_settings.player_1)
		}
		set_ui_lock(false)
	}
	return (
		<div className={board_wrapper_classname} onClick={on_click}>
			{board_2d.map((entry, index) => generate_row(entry, index))} 
		</div>
	)
}

// Tic Tac toe puzzle container
function TicTacToePuzzle({settings, board, set_board, game_tree, set_game_tree, ai_vs_ai_done, set_ai_vs_ai_done, player_vs_ai_done, set_player_vs_ai_done,
	set_minimax_visited,
	set_minimax_time,
	set_alpha_beta_pruning_time,
	set_alpha_beta_pruning_visited,
	set_ai_1_minimax_time,
	set_ai_1_minimax_visited,
	set_ai_1_alpha_beta_pruning_time,
	set_ai_1_alpha_beta_pruning_visited,
	set_ai_2_minimax_time,
	set_ai_2_minimax_visited,
	set_ai_2_alpha_beta_pruning_time,
	set_ai_2_alpha_beta_pruning_visited,
	ui_lock,
	set_ui_lock,
	turn,
	set_turn
}) {
	console.log("Game tree: ", game_tree)
	console.log("board: ", board)
	console.log("ui lock: ", ui_lock)
	console.log("settings: ", settings)
	console.log("TURN: ", turn)
	console.log("player vs ai done: ", player_vs_ai_done)
	console.log("set player vs ai done: ", set_player_vs_ai_done)
	let ui_lock_val = ui_lock
	if(board.toString() === user_settings.default_tic_tac_toe.toString() && settings.mode === user_settings.player_vs_ai_mode && settings.first_to_move === user_settings.ai) {
		ui_lock_val = true
		const perform_ai_move = async (new_board) => {
			const orig_board = board.toString()
			const [res_minimax, board_after_ai_move, res_pruning] = await do_ai_move_first(game_tree, new_board, settings.num_rows, user_settings.x_char, settings.ai_algorithm)
			let rv = res_pruning
			if(settings.ai_algorithm === user_settings.minimax_algorithm_name) {
				rv = res_minimax
			}
			const curr_board = board.toString() 
			console.log("ORIG BOARD: ", orig_board)
			console.log("CURR BOARD: ", curr_board)
			if (orig_board !== curr_board) {
				return
			}
			const tree_after_ai_move = rv[0]
			set_board(board_after_ai_move)
			set_game_tree(tree_after_ai_move)
			set_minimax_visited(res_minimax[2])
			set_minimax_time(res_minimax[1])
			set_alpha_beta_pruning_visited(res_pruning[2])
			set_alpha_beta_pruning_time(res_pruning[1])
		}
		perform_ai_move(board).then(() => set_ui_lock(false))
	}
	else if(ui_lock && board.toString() === user_settings.default_tic_tac_toe.toString() && settings.mode === user_settings.player_vs_ai_mode && settings.first_to_move === user_settings.player) {
		set_ui_lock(false)
	}
	if(settings.mode === user_settings.ai_vs_ai_mode && (turn !== settings.first_to_move && board.toString() === user_settings.default_tic_tac_toe.toString())){ 
		set_turn(settings.first_to_move)
	}
	const settingsRef = useRef(settings);

	useEffect(() => {
		settingsRef.current = settings;
	}, [settings]);
	const inner_set_board = (board, board_id) => {
		console.log("RUNNING INNER SET BOARD")
		const currsettings = settingsRef.current
		if(board_id === player_vs_ai_id && currsettings.mode !== user_settings.player_vs_ai_mode) {
			console.log("BOARD INVALID")
			return -1
		}
		if(board_id === ai_vs_ai_id && currsettings.mode !== user_settings.ai_vs_ai_mode) {
			console.log("BOARD INVALID")
			return -1
		}
		console.log("Board valid, board id is ", board_id, ", game mode is ", settings.mode)
		set_board(board)
	}
	return (
		<div>
		{settings.mode === user_settings.player_vs_ai_mode && <BoardDisplay board={board} set_board={set_board} ui_lock={ui_lock_val} set_ui_lock={set_ui_lock} game_tree={game_tree} set_game_tree={set_game_tree} settings={settings} turn={turn} set_turn={set_turn} player_vs_ai_done={player_vs_ai_done} set_player_vs_ai_done={set_player_vs_ai_done}
			set_minimax_time={set_minimax_time}
			set_minimax_visited={set_minimax_visited}
			set_alpha_beta_pruning_time={set_alpha_beta_pruning_time}
			set_alpha_beta_pruning_visited={set_alpha_beta_pruning_visited}
			/>}
		{settings.mode === user_settings.player_vs_player_mode && <BoardDisplayPlayerVsPlayer board={board} set_board={set_board} ui_lock={ui_lock_val} set_ui_lock={set_ui_lock} settings={settings} turn={turn} set_turn={set_turn}/>}
		{settings.mode === user_settings.ai_vs_ai_mode && <BoardDisplayAIvsAI board={board} set_board={inner_set_board} settings={settings} turn={turn} set_turn={set_turn} game_tree={game_tree} set_game_tree={set_game_tree} done={ai_vs_ai_done} set_done={set_ai_vs_ai_done}
			set_ai_1_minimax_time={set_ai_1_minimax_time}
			set_ai_1_minimax_visited={set_ai_1_minimax_visited}
			set_ai_1_alpha_beta_pruning_time={set_ai_1_alpha_beta_pruning_time}
			set_ai_1_alpha_beta_pruning_visited={set_ai_1_alpha_beta_pruning_visited}
			set_ai_2_minimax_time={set_ai_2_minimax_time}
			set_ai_2_minimax_visited={set_ai_2_minimax_visited}
			set_ai_2_alpha_beta_pruning_time={set_ai_2_alpha_beta_pruning_time}
			set_ai_2_alpha_beta_pruning_visited={set_ai_2_alpha_beta_pruning_visited}
				/>}
		</div>
	)

}

// Module B
function ModuleB({active}) {
	const [settings, set_settings] = useState(new user_settings.UserSettings())
	const [board, set_board] = useState(user_settings.default_tic_tac_toe)
	const [default_game_tree, set_default_game_tree] = useState(construct_base_game_tree(user_settings.default_num_rows))
	const [game_tree, set_game_tree] = useState(null)
	const [ai_vs_ai_done, set_ai_vs_ai_done] = useState(true)
	const [player_vs_ai_done, set_player_vs_ai_done] = useState(true)
	const [alpha_beta_pruning_visited, set_alpha_beta_pruning_visited] = useState(0)
	const [minimax_visited, set_minimax_visited] = useState(0)
	const [minimax_time, set_minimax_time] = useState(0)
	const [alpha_beta_pruning_time, set_alpha_beta_pruning_time] = useState(0)
	const [ai_1_alpha_beta_pruning_visited, set_ai_1_alpha_beta_pruning_visited] = useState(0)
	const [ai_1_minimax_visited, set_ai_1_minimax_visited] = useState(0)
	const [ai_1_minimax_time, set_ai_1_minimax_time] = useState(0)
	const [ai_1_alpha_beta_pruning_time, set_ai_1_alpha_beta_pruning_time] = useState(0)
	const [ai_2_alpha_beta_pruning_visited, set_ai_2_alpha_beta_pruning_visited] = useState(0)
	const [ai_2_minimax_visited, set_ai_2_minimax_visited] = useState(0)
	const [ai_2_minimax_time, set_ai_2_minimax_time] = useState(0)
	const [ai_2_alpha_beta_pruning_time, set_ai_2_alpha_beta_pruning_time] = useState(0)
	if(game_tree === null && game_tree !== default_game_tree) {
		set_game_tree(default_game_tree)
	}
	if(!active) {
		return (null)
	}
	console.log("Settings: ", settings)
	console.log("ai_1_minimax_visited: ", ai_1_minimax_visited)
	console.log("ai_1_minimax_time: ", ai_1_minimax_time)
	console.log("ai_1_alpha_beta_pruning_visited: ", ai_1_alpha_beta_pruning_visited)
	console.log("ai_1_alpha_beta_pruning_time: ", ai_1_alpha_beta_pruning_time)

	console.log("ai_2_minimax_visited: ", ai_2_minimax_visited)
	console.log("ai_2_minimax_time: ", ai_2_minimax_time)
	console.log("ai_2_alpha_beta_pruning_visited: ", ai_2_alpha_beta_pruning_visited)
	console.log("ai_2_alpha_beta_pruning_time: ", ai_2_alpha_beta_pruning_time)
	console.log("minimax_visited: ", minimax_visited)
	console.log("minimax_time: ", minimax_time)
	console.log("alpha_beta_pruning_visited: ", alpha_beta_pruning_visited)
	console.log("alpha_beta_pruning_time: ", alpha_beta_pruning_time)
	let board_player_char = 'x'
	let board_ai_char = 'o'
	// if (settings.mode === "Player vs AI" && settings.first_to_move === "AI") {
	// 	board_player_char = 'o'
	// 	board_ai_char = 'x'
	// }
	// if(settings.mode === user_settings.player_vs_player_mode && settings.first_to_move === 'Player 2') {
	// 	board_player_char = 'o'
	// 	board_ai_char = 'x'	
	// }
	if(settings.mode === user_settings.player_vs_ai_mode && settings.first_to_move === 'AI') {
		board_player_char = 'o'
		board_ai_char = 'x'
	}
	console.log("BOARD PLAYER CHAR: ", board_player_char, ", BOARD AI CHAR: ", board_ai_char);
	const player_won = settings.mode === user_settings.player_vs_ai_mode ?
		check_win(board, board_player_char, settings.num_rows) : false
	const ai_won = settings.mode === user_settings.player_vs_ai_mode ? 
		check_win(board, board_ai_char, settings.num_rows) : false
	const ai_1_won = settings.mode === user_settings.ai_vs_ai_mode ? 
		check_win(board, settings.ai_1_char, settings.num_rows) : false
	const ai_2_won = settings.mode === user_settings.ai_vs_ai_mode ? 
		check_win(board, settings.ai_2_char, settings.num_rows) : false
	const player_1_won = settings.mode === user_settings.player_vs_player_mode ? 
		check_win(board, board_player_char, settings.num_rows) : false
	const player_2_won = settings.mode === user_settings.player_vs_player_mode ? 
		check_win(board, board_ai_char, settings.num_rows) : false
	const draw = check_draw(board, settings.num_rows)
	const is_terminal = check_terminal(board, settings.num_rows)
	if(is_terminal && settings.mode === user_settings.player_vs_ai_mode) {
		if(!player_vs_ai_done) {
			set_player_vs_ai_done(true)
		}
	}
	const on_play_again_click = () => {
		set_board(user_settings.default_tic_tac_toe)
		set_game_tree(default_game_tree)
		if(settings.mode === user_settings.ai_vs_ai_mode) {
			set_ai_vs_ai_done(false)
		}
		if(settings.mode === user_settings.player_vs_player_mode) {
			set_ui_lock(false)
		}
	}
	const [ui_lock, set_ui_lock] = useState(false)
	const [turn, set_turn] = useState(user_settings.player_1)
	return (
		<div className="module">
			<div className="tic-tac-toe-wrapper">
				<div className="puzzle-title">
					Tic-Tac-Toe
				</div>
				<TicTacToeHeader settings={settings} set_settings={set_settings} set_board={set_board} set_game_tree={set_game_tree} default_game_tree={default_game_tree} ai_vs_ai_done={ai_vs_ai_done} set_ai_vs_ai_done={set_ai_vs_ai_done} player_vs_ai_done={player_vs_ai_done} set_player_vs_ai_done={set_player_vs_ai_done} set_ui_lock={set_ui_lock} set_turn={set_turn}/>
				<TicTacToePuzzle settings={settings} board={board} set_board={set_board} game_tree={game_tree} set_game_tree={set_game_tree} ai_vs_ai_done={ai_vs_ai_done} set_ai_vs_ai_done={set_ai_vs_ai_done} player_vs_ai_done={player_vs_ai_done} set_player_vs_ai_done={set_player_vs_ai_done} 
					set_minimax_visited={set_minimax_visited}
					set_alpha_beta_pruning_visited={set_alpha_beta_pruning_visited}
					set_minimax_time={set_minimax_time}
					set_alpha_beta_pruning_time={set_alpha_beta_pruning_time}
					set_ai_1_minimax_visited={set_ai_1_minimax_visited}
					set_ai_1_alpha_beta_pruning_visited={set_ai_1_alpha_beta_pruning_visited}
					set_ai_1_minimax_time={set_ai_1_minimax_time}
					set_ai_1_alpha_beta_pruning_time={set_ai_1_alpha_beta_pruning_time}
					set_ai_2_minimax_visited={set_ai_2_minimax_visited}
					set_ai_2_alpha_beta_pruning_visited={set_ai_2_alpha_beta_pruning_visited}
					set_ai_2_minimax_time={set_ai_2_minimax_time}
					set_ai_2_alpha_beta_pruning_time={set_ai_2_alpha_beta_pruning_time}
		ui_lock={ui_lock}
		set_ui_lock={set_ui_lock}
		turn={turn}
		set_turn={set_turn}


					/>
				<TicTacToeFooter settings={settings} 
					draw={draw}
					player_won={player_won}
					player_1_won={player_1_won}
					player_2_won={player_2_won}
					ai_won={ai_won}
					ai_1_won={ai_1_won}
					ai_2_won={ai_2_won}
					on_play_again_click={on_play_again_click}
					minimax_time={minimax_time}
					minimax_visited={minimax_visited}
					alpha_beta_pruning_time={alpha_beta_pruning_time}
					alpha_beta_pruning_visited={alpha_beta_pruning_visited}
					ai_1_minimax_time={ai_1_minimax_time}
					ai_1_minimax_visited={ai_1_minimax_visited}
					ai_1_alpha_beta_pruning_time={ai_1_alpha_beta_pruning_time}
					ai_1_alpha_beta_pruning_visited={ai_1_alpha_beta_pruning_visited}
					ai_2_minimax_time={ai_2_minimax_time}
					ai_2_minimax_visited={ai_2_minimax_visited}
					ai_2_alpha_beta_pruning_time={ai_2_alpha_beta_pruning_time}
					ai_2_alpha_beta_pruning_visited={ai_2_alpha_beta_pruning_visited}
					/>
			</div>
		</div>
	)
}
export default ModuleB
