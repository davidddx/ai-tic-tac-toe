import {Dropdown} from './Button.jsx'
import {useState} from 'react'
import sleep from './sleep.js'
import * as user_settings from './TicTacToeSettings.jsx'
import TreeNode from './Tree.js'
import {run_minimax_on_game_tree, run_alpha_beta_pruning_on_game_tree, construct_base_game_tree, check_win, normalize, denormalize, check_draw, check_terminal} from './gameTreeFunctions.js'
import {turn_to_2d, board_string_to_array} from './boardFunctions.js'
function TicTacToeHeader({settings, set_settings, set_board, set_game_tree}) {
	const choose_mode_text = "Choose Mode"
	const first_to_move_text = "First to Move"
	const class_name = "attribute-dropdown"
	const on_change_mode = (e) => {
		const options = e.target.options
		const text = options[options.selectedIndex].textContent
		const cpy = settings.get_copy()
		cpy.mode = text
		set_settings(cpy)
		set_board(user_settings.default_tic_tac_toe)
		set_game_tree(construct_base_game_tree(settings.num_rows))
		console.log("SETTING SETTINGS: ", cpy)
	}
	const on_change_first_to_move = (e) => {
		const options = e.target.options
		const text = options[options.selectedIndex].textContent
		const cpy = settings.get_copy()
		cpy.first_to_move = text
		set_settings(cpy)
		set_board(user_settings.default_tic_tac_toe)
		set_game_tree(construct_base_game_tree(settings.num_rows))
		console.log("SETTING SETTINGS: ", cpy)
	}
	const on_change_player = (e) => {
		const options = e.target.options
		const text = options[options.selectedIndex].textContent
		const cpy = settings.get_copy()
		cpy.user_char = text
		if(settings.mode === user_settings.player_vs_ai_mode) {
			cpy.ai_char = cpy.user_char === user_settings.x_char ? user_settings.o_char : user_settings.x_char
		}
		set_settings(cpy)
		console.log("SETTING SETTINGS: ", cpy)
	}
	const on_change_player_1 = (e) => {
		const options = e.target.options
		const text = options[options.selectedIndex].textContent
		const cpy = settings.get_copy()
		cpy.user_1_char = text
		cpy.user_2_char = text === user_settings.o_char ? user_settings.x_char : user_settings.o_char
		set_settings(cpy)
		console.log("SETTING SETTINGS: ", cpy)
	}
	const on_change_player_2 = (e) => {
		const options = e.target.options
		const text = options[options.selectedIndex].textContent
		const cpy = settings.get_copy()
		cpy.user_2_char = text
		cpy.user_1_char = text === user_settings.o_char ? user_settings.x_char : user_settings.o_char
		set_settings(cpy)
		console.log("SETTING SETTINGS: ", cpy)
	}
	const on_change_ai_1 = (e) => {
		const options = e.target.options
		const text = options[options.selectedIndex].textContent
		const cpy = settings.get_copy()
		cpy.ai_1_char = text
		cpy.ai_2_char = text === user_settings.o_char ? user_settings.x_char : user_settings.o_char
		set_settings(cpy)
		console.log("SETTING SETTINGS: ", cpy)
	}
	const on_change_ai_2 = (e) => {
		const options = e.target.options
		const text = options[options.selectedIndex].textContent
		const cpy = settings.get_copy()
		cpy.ai_2_char = text
		cpy.ai_1_char = text === user_settings.o_char ? user_settings.x_char : user_settings.o_char
		set_settings(cpy)
		console.log("SETTING SETTINGS: ", cpy)
	}
	const on_change_x_color = (e) => {
		const options = e.target.options
		const text = options[options.selectedIndex].textContent
		const cpy = settings.get_copy()
		cpy.x_color = text
		set_settings(cpy)
		console.log("SETTING SETTINGS: ", cpy)
	}
	const on_change_o_color = (e) => {
		const options = e.target.options
		const text = options[options.selectedIndex].textContent
		const cpy = settings.get_copy()
		cpy.o_color = text
		set_settings(cpy)
		console.log("SETTING SETTINGS: ", cpy)
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
			<Dropdown text={x_color_text} options={user_settings.available_colors} class_name={class_name} on_change={on_change_x_color} selected={settings.x_color}/>
			<Dropdown text={o_color_text} options={user_settings.available_colors} class_name={class_name} on_change={on_change_o_color} selected={settings.o_color}/>

		</div>
	)

}

function BoardImage({value, color, row_idx, col_idx}) {
	const class_name = "center fit tic-tac-toe-image"
	const img_src = user_settings.get_image(value, color)
	console.log("row, col, value: ", [row_idx, col_idx, value])
	return (
		<div className={class_name} row_idx={row_idx} col_idx={col_idx}>
			{img_src !== user_settings.none_char && <img className={class_name} src={img_src} row_idx={row_idx} col_idx={col_idx}/>}
		</div>
	)
}


const do_ai_move = async (game_tree, board, num_rows, character) => {
	await sleep(1000)
	const board_normalized = normalize(board, num_rows)
	const game_tree_after_move = game_tree.children.filter((x) => x.value === board_normalized.toString())[0]
	console.log("Board normalized: ", board_normalized)
	console.log("GAME TREE AFTER MOVE: ", game_tree_after_move)
	const res = run_minimax_on_game_tree(game_tree_after_move, num_rows, character)
	const res2 = run_alpha_beta_pruning_on_game_tree(game_tree_after_move, num_rows, character)
	console.log("RES: ", res)
	const denormalized_board = denormalize(board, board_string_to_array(res2.value, num_rows), num_rows)
	console.log("denormalized board: ", denormalized_board)
	return [res2, denormalized_board] 
}

const do_ai_move_first = async (game_tree, board, num_rows, character) => {
	await sleep(1000)
	const board_normalized = normalize(board, num_rows)
	console.log("Board normalized: ", board_normalized)
	console.log("GAME TREE AFTER MOVE: ", game_tree)
	const res = run_minimax_on_game_tree(game_tree, num_rows, character)
	const res2 = run_alpha_beta_pruning_on_game_tree(game_tree, num_rows, character)
	console.log("RES: ", res)
	const denormalized_board = denormalize(board, board_string_to_array(res2.value, num_rows), num_rows)
	console.log("denormalized board: ", denormalized_board)
	return [res2, denormalized_board] 
}

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

function BoardDisplay({board, set_board, ui_lock, set_ui_lock, game_tree, set_game_tree, settings}) {
	const board_wrapper_classname = "board-wrapper"
	const board_2d = turn_to_2d(board, settings.num_rows)
	const row_class_name = "tic-tac-toe-row"
	let invert_chars = false
	if(settings.mode === user_settings.player_vs_ai_mode) {
		if(settings.first_to_move === user_settings.player && settings.user_char === user_settings.o_char) {
			invert_chars = true
		}
		else if(settings.first_to_move === user_settings.ai && settings.ai_char === user_settings.o_char) {
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
		console.log("ENTRY: ", entry)
		console.log("NEW ENTRY: ", new_entry)
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
		const perform_ai_move = async () => {
			let rv = []
			if(settings.first_to_move === user_settings.player) {
				rv = await do_ai_move(game_tree, new_board, settings.num_rows, user_settings.o_char)
			}
			else {
				rv = await do_ai_move(game_tree, new_board, settings.num_rows, user_settings.x_char)
			}
			if(check_terminal(rv[1], settings.num_rows)) {
				console.log("ai move has done a terminal move")
				set_board(rv[1])
				set_game_tree(rv[0])
				return
			}
			set_board(rv[1])
			set_game_tree(rv[0])
			console.log("Tree after ai move: ", rv[0])
			console.log("Board after ai move: ", rv[1])
			set_ui_lock(false)
		}
		perform_ai_move()
	}
	return (
		<div className={board_wrapper_classname} onClick={on_click}>
			{board_2d.map((entry, index) => generate_row(entry, index))} 
		</div>
	)

}

function BoardDisplayPlayerVsPlayer({board, ui_lock, settings, turn, set_board, set_ui_lock, set_turn}) {
	const board_wrapper_classname = "board-wrapper"
	const board_2d = turn_to_2d(board, settings.num_rows)
	const row_class_name = "tic-tac-toe-row"
	let invert_chars = false
	if(settings.mode === user_settings.player_vs_ai_mode) {
		if(settings.first_to_move === user_settings.player_1 && settings.user_1_char === user_settings.o_char) {
			invert_chars = true
		}
		else if(settings.first_to_move === user_settings.player_2 && settings.user_2_char === user_settings.o_char) {
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
		console.log("ENTRY: ", entry)
		console.log("NEW ENTRY: ", new_entry)
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

function TicTacToePuzzle({settings, board, set_board, game_tree, set_game_tree}) {
	
	const [ui_lock, set_ui_lock] = useState(false)
	const [turn, set_turn] = useState(user_settings.player_1)
	console.log("Game tree: ", game_tree)
	console.log("board: ", board)
	console.log("ui lock: ", ui_lock)
	console.log("settings: ", settings)
	let ui_lock_val = ui_lock
	if(board.toString() === user_settings.default_tic_tac_toe.toString() && settings.mode === user_settings.player_vs_ai_mode && settings.first_to_move === user_settings.ai) {
		ui_lock_val = true
		const perform_ai_move = async (new_board) => {
			const [tree_after_ai_move, board_after_ai_move] = await do_ai_move_first(game_tree, new_board, settings.num_rows, user_settings.x_char)
			set_board(board_after_ai_move)
			set_game_tree(tree_after_ai_move)
		}
		perform_ai_move(board).then(() => set_ui_lock(false))
	}
	else if(ui_lock && board.toString() === user_settings.default_tic_tac_toe.toString() && settings.mode === user_settings.player_vs_ai_mode && settings.first_to_move === user_settings.player) {
		set_ui_lock(false)
	}
	
	return (
		<div>
		{settings.mode === user_settings.player_vs_ai_mode && <BoardDisplay board={board} set_board={set_board} ui_lock={ui_lock_val} set_ui_lock={set_ui_lock} game_tree={game_tree} set_game_tree={set_game_tree} settings={settings} turn={turn} set_turn={set_turn}/>}
		{settings.mode === user_settings.player_vs_player_mode && <BoardDisplayPlayerVsPlayer board={board} set_board={set_board} ui_lock={ui_lock_val} set_ui_lock={set_ui_lock} settings={settings} turn={turn} set_turn={set_turn}/>}
		</div>
	)

}

function ModuleB({active}) {
	const [settings, set_settings] = useState(new user_settings.UserSettings())
	const [board, set_board] = useState(user_settings.default_tic_tac_toe)
	const [game_tree, set_game_tree] = useState(construct_base_game_tree(user_settings.default_num_rows))
	if(!active) {
		return (null)
	}
	console.log("Settings: ", settings)
	return (
		<div className="module">
			<div className="tic-tac-toe-wrapper">
				<div className="puzzle-title">
					Tic-Tac-Toe
				</div>
				<TicTacToeHeader settings={settings} set_settings={set_settings} set_board={set_board} set_game_tree={set_game_tree}/>
				<TicTacToePuzzle settings={settings} board={board} set_board={set_board} game_tree={game_tree} set_game_tree={set_game_tree}/>
			</div>
		</div>
	)
}
export default ModuleB
