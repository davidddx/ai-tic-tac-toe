import Button from './Button.jsx'
import {Dropdown} from './Button.jsx'
import {useState} from 'react'
import sleep from './sleep.js'
import * as user_settings from './TicTacToeSettings.jsx'
import TreeNode from './Tree.js'
import {run_minimax_on_game_tree, run_alpha_beta_pruning_on_game_tree, get_all_moves_normalized, construct_base_game_tree, check_win, normalize, denormalize} from './gameTreeFunctions.js'
import {turn_to_2d, board_string_to_array} from './boardFunctions.js'
function TicTacToeHeader({selected_mode, set_selected_mode}) {
	const choose_mode_text = "Choose Mode"
	const class_name = "attribute-dropdown"
	const on_change = (e) => {
		const options = e.target.options
		const text = options[options.selectedIndex].textContent
		console.log("TEXT: ", text)
		set_selected_mode(text)
	}
	const mode_options = user_settings.mode_options
	return (
		<div className="tic-tac-toe-header">
			<Dropdown text={choose_mode_text} options={mode_options} class_name={class_name} on_change={on_change} selected={selected_mode}/>
			<Button/>
		</div>
	)

}

function BoardImage({value, color, row_idx, col_idx}) {
	const class_name = "center fit tic-tac-toe-image"
	const img_src = user_settings.get_image(value, color)
	return (
		<div className={class_name} row_idx={row_idx} col_idx={col_idx}>
			{img_src !== user_settings.none_char && <img className={class_name} src={img_src} row_idx={row_idx} col_idx={col_idx}/>}
		</div>
	)
}


const do_ai_move = async (game_tree, board, num_rows, character) => {
	//await sleep(1000)
	const board_normalized = normalize(board, num_rows)
	const game_tree_after_move = game_tree.children.filter((x) => x.value === board_normalized.toString())[0]
	console.log("Board normalized: ", board_normalized)
	console.log("GAME TREE AFTER MOVE: ", game_tree_after_move)
	const res = run_minimax_on_game_tree(game_tree_after_move, num_rows, character)
	const res2 = run_alpha_beta_pruning_on_game_tree(game_tree_after_move, num_rows, character)
	console.log("RES: ", res)
	const denormalized_board = denormalize(board, board_string_to_array(res.value, num_rows), num_rows)
	console.log("denormalized board: ", denormalized_board)
	return [res, denormalized_board] 
}

function BoardDisplay({board, num_rows, x_color, o_color, set_board, ui_lock, set_ui_lock, game_tree, set_game_tree}) {
	const board_wrapper_classname = "board-wrapper"
	const board_2d = turn_to_2d(board, num_rows)
	const row_class_name = "tic-tac-toe-row"
	const generate_row = (entry, row_index) => {
		return (
			<div className={row_class_name}>
				{entry.map((x, index) => <BoardImage key={index} value={x} color={x === user_settings.x_char ? x_color : o_color} row_idx={row_index} col_idx={index}/>)}
			</div>
		)
	}
	if(check_win(board, user_settings.x_char, num_rows)) {
		console.log("YOU WIN!!!")
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
		console.log("Clicked. Target: ", target)
		const attributes = target.attributes
		const row_value = parseInt(attributes['row_idx'].value)
		const col_value = parseInt(attributes['col_idx'].value)
		const board_idx = row_value*3 + col_value
		if(board[board_idx] === user_settings.x_char || board[board_idx] === user_settings.o_char) {
			return
		}
		const new_board = [...board]
		new_board[board_idx] = user_settings.user_char
		set_board(new_board)
		set_ui_lock(true)
		const perform_ai_move = async () => {
			const [tree_after_ai_move, board_after_ai_move] = await do_ai_move(game_tree, new_board, num_rows, user_settings.o_char)
			set_board(board_after_ai_move)
			set_game_tree(tree_after_ai_move)
			console.log("Tree after ai move: ", tree_after_ai_move)
			console.log("Board after ai move: ", board_after_ai_move)
		}
		perform_ai_move().then(() => set_ui_lock(false))
	}
	return (
		<div className={board_wrapper_classname} onClick={on_click}>
			{board_2d.map((entry, index) => generate_row(entry, index))} 
		</div>
	)

}

function TicTacToePuzzle({mode, num_rows, x_color, o_color}) {
	const [board, set_board] = useState(user_settings.default_tic_tac_toe)
	const [game_tree, set_game_tree] = useState(construct_base_game_tree(user_settings.default_num_rows))
	console.log("Game tree: ", game_tree)
	const [ui_lock, set_ui_lock] = useState(false)
	console.log("NORMALIZED num_rows=3: ", get_all_moves_normalized(['', '', '', '', '', '', '', '', ''], num_rows, user_settings.x_char))
	console.log("NORMALIZED num_rows=4: ", get_all_moves_normalized(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], 4, user_settings.x_char))
	console.log("NORMALIZED num_rows=5: ", get_all_moves_normalized(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], 5, user_settings.x_char))
	return (
		<BoardDisplay board={board} num_rows={num_rows} x_color={x_color} o_color={o_color} set_board={set_board} ui_lock={ui_lock} set_ui_lock={set_ui_lock} game_tree={game_tree} set_game_tree={set_game_tree}/>
	)

}

function ModuleB({active}) {
	const [mode, set_mode] = useState(user_settings.default_mode)
	const [num_rows, set_num_rows] = useState(user_settings.default_num_rows)
	const [x_color, set_x_color] = useState(user_settings.default_x_color)
	const [o_color, set_o_color] = useState(user_settings.default_o_color)
	const [bg_color, default_bg_color] = useState(user_settings.default_bg_color)
	if(!active) {
		return (null)
	}
	return (
		<div className="module">
			<div className="tic-tac-toe-wrapper">
				<div className="puzzle-title">
					Tic-Tac-Toe
				</div>
				<TicTacToeHeader selected_mode={mode} set_selected_mode={set_mode}/>
				<TicTacToePuzzle mode={mode} num_rows={num_rows} x_color={x_color} o_color={o_color}/>
			</div>
		</div>
	)
}
export default ModuleB
