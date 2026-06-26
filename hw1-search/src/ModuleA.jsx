import {useState} from 'react'
import { Heap } from 'heap-js';
import Button from './Button.jsx'
import { Dropdown } from './Button.jsx'
import sleep from './sleep.js'
import UploadAndDisplayImage from './UploadAndDisplayImage.jsx'
import * as user_settings from './EightPuzzleSettings.jsx'
import recognize_image from './RecognizeImage.js'

const class_name = "settings-subheading" 
const hover_class_name = "settings-subheading-hover"
const selected_class_name = "settings-subheading-selected"

const image_id_name = "image-id"

//adjacent indices in 8-puzzle given index
//because i decided to store everything in a 1d array
const get_adj_indices = (idx) => {
	const rv = []
	const [row, col] = get_2d_pos(idx)
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

const get_2d_pos = (idx) => {
	return [Math.floor(idx/3), idx%3]
}

//Durstenfeld shuffle algorithm
const shuffle_array = (array) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
}

const solved_puzzle = [1, 2, 3, 4, 5, 6, 7, 8, 0]
const is_valid_puzzle = (puzzle_to_check) => {
	let inversions = 0
	for(let i = 0; i < puzzle_to_check.length; ++i) {
		if(puzzle_to_check[i] === 0) {
			continue
		}
		for(let j = i+1; j < puzzle_to_check.length; ++j) {
			if(puzzle_to_check[j] === 0) {
				continue
			}
			if(puzzle_to_check[i] > puzzle_to_check[j]) {
				inversions += 1
			}

		}
	}
	return inversions % 2 === 0 ? true : false

}

const generate_shuffled_puzzle = () => {
	const default_arr = [...solved_puzzle] 
	const shuffled = default_arr 
	console.log("Shuffled: ", shuffled)
	while(!is_valid_puzzle(shuffled) || shuffled.toString() === solved_puzzle.toString()) {
		console.log("Shuffled: ", shuffled)
		shuffle_array(shuffled)
	}
	return shuffled
}

function bfs(puzzle_state) {
	const visited = new Set() 
	const q = []
	q.push([puzzle_state.toString(), 0])
	const N = 362880
	let n = 0 // iteration count
	const solved_puzzle_str = solved_puzzle.toString()
	let solution_path_length = Number.MAX_SAFE_INTEGER 
	const paths = {}
	paths[puzzle_state.toString()] = []
	while (q.length > 0 && n < N) {
		const [current_node, path_length] = q.shift()
		if(visited.has(current_node)) {
			continue
		}
		n += 1
		console.assert(typeof current_node === "string", "expected node in queue to be string")
		if(current_node === solved_puzzle_str) {
			solution_path_length = path_length	
			break
		}
		const curr_node_split = current_node.split(',')
		const curr_node_array = curr_node_split.map((x) => parseInt(x))
		const space_index = curr_node_array.indexOf(user_settings.space_number)
		const adj_indices = get_adj_indices(space_index)
		for(const adj_index of adj_indices) {
			const new_puzzle = [...curr_node_array]
			new_puzzle[adj_index] = curr_node_array[space_index]
			new_puzzle[space_index] = curr_node_array[adj_index]
			const stringified = new_puzzle.toString()
			if(visited.has(stringified)) {
				continue
			}
			q.push([stringified, path_length + 1])
			paths[stringified] = [...paths[current_node], new_puzzle]
		}
		visited.add(current_node)
	}
	console.log("VISITED: ", visited)
	console.log("n: ", n)
	return [paths[solved_puzzle_str], solution_path_length, n]
}

function dijkstra(puzzle_state) {
	const dist = {}
	const source = puzzle_state.toString() 
	dist[source] = 0 
	const visited = new Set()
	const min_comparator = (a, b) => a[0] - b[0]
	const pq = new Heap(min_comparator)
	pq.init([[0, source]])
	let n = 0
	const N = 362880
	const paths = {}
	paths[source] = []
	while(!pq.isEmpty() && n < N) {
		const [dist_so_far, u] = pq.pop()
		if(u === solved_puzzle.toString()) {
			break
		}
		if(visited.has(u)) {
			continue
		}
		n += 1
		const curr_node_split = u.split(',')
		const curr_node_array = curr_node_split.map((x) => parseInt(x))
		const space_index = curr_node_array.indexOf(user_settings.space_number)
		const adj_indices = get_adj_indices(space_index)
		for(const adj_idx of adj_indices) {
			const v = [...curr_node_array]
			v[adj_idx] = curr_node_array[space_index]
			v[space_index] = curr_node_array[adj_idx]
			const v_str = v.toString()
			if(visited.has(v_str)) {
				continue
			}
			dist[v_str] = dist[u] + 1
			pq.push([dist[v_str], v_str])
			paths[v_str] = [...paths[u], v] 
		}
		visited.add(u)
	}
	console.log("Path: ", paths[solved_puzzle.toString()])
	return [dist[solved_puzzle.toString()], n, paths[solved_puzzle.toString()]]
}

// heuristic: manhattan 
function a_star(puzzle_state) {
	const get_puzzle_manhattan_distance = (p, reference_puzzle) => {
		let rv = 0
		for(const [index, element] of p.entries()) {
			const [curr_row, curr_col] = get_2d_pos(index)
			const [goal_row, goal_col] = get_2d_pos(reference_puzzle.indexOf(element)) 
			rv += Math.abs(curr_row - goal_row) + Math.abs(curr_col - goal_col)
		}
		return rv
	}
	const comparator = (a, b) => a[0] - b[0]
	const pq = new Heap(comparator)
	const visited = new Set()
	const g_score = {}
	const f_score = {}
	const h = (p) => {
		return get_puzzle_manhattan_distance(p, solved_puzzle) 
	}
	const source = puzzle_state.toString()
	g_score[source] = 0
	f_score[source] = h(puzzle_state)
	const paths = {}
	paths[source] = []
	let n = 0
	const N = 362880 
	pq.init([[f_score[source], source, 0]])
	let astar_path_size = N
	while(!pq.isEmpty() && n < N) {
		const [priority, curr, path_size] = pq.pop()
		if(curr.toString() === solved_puzzle.toString()) {
			astar_path_size = path_size
			break
		}
		n += 1
		visited.add(curr)
		const curr_node_split = curr.split(',')
		const curr_node_array = curr_node_split.map((x) => parseInt(x))
		const space_index = curr_node_array.indexOf(user_settings.space_number)
		for(const idx of get_adj_indices(space_index)) {
			const new_puzzle = [...curr_node_array]
			new_puzzle[idx] = curr_node_array[space_index]
			new_puzzle[space_index] = curr_node_array[idx]
			const tentative_g_score = g_score[curr] + 1 // edge weight = 1
			const new_puzzle_str = new_puzzle.toString()
			if(Object.hasOwn(g_score, new_puzzle_str)) {
				continue
			}
			g_score[new_puzzle_str] = tentative_g_score
			f_score[new_puzzle_str] = g_score[new_puzzle_str] + h(new_puzzle)
			pq.push([f_score[new_puzzle_str], new_puzzle_str, path_size + 1]) 
			paths[new_puzzle_str] = [...paths[curr], new_puzzle]
		}
	}
	return [paths[solved_puzzle.toString()], n, astar_path_size]

}

function gbfs(puzzle_state) {
	const get_puzzle_manhattan_distance = (p, reference_puzzle) => {
		let rv = 0
		for(const [index, element] of p.entries()) {
			const [curr_row, curr_col] = get_2d_pos(index)
			const [goal_row, goal_col] = get_2d_pos(reference_puzzle.indexOf(element)) 
			rv += Math.abs(curr_row - goal_row) + Math.abs(curr_col - goal_col)
		}
		return rv
	}
	const h = (p) => {
		return get_puzzle_manhattan_distance(p, solved_puzzle) 
	}
	const comparator = (a, b) => a[0] - b[0]
	const pq = new Heap(comparator)
	const visited = new Set()
	const source = puzzle_state.toString()
	const paths = {}
	paths[source] = []
	let n = 0
	const N = 362880 
	pq.init([[h(puzzle_state), source, 0]])
	let gbfs_path_size = N
	visited.add(source)
	while(!pq.isEmpty() && n < N) {
		const [priority, curr, path_size] = pq.pop()
		if(curr.toString() === solved_puzzle.toString()) {
			gbfs_path_size = path_size
			break
		}
		n += 1
		const curr_node_split = curr.split(',')
		const curr_node_array = curr_node_split.map((x) => parseInt(x))
		const space_index = curr_node_array.indexOf(user_settings.space_number)
		for(const idx of get_adj_indices(space_index)) {
			const new_puzzle = [...curr_node_array]
			new_puzzle[idx] = curr_node_array[space_index]
			new_puzzle[space_index] = curr_node_array[idx]
			const new_puzzle_str = new_puzzle.toString()
			if(visited.has(new_puzzle_str)) {
				continue
			}
			pq.push([h(new_puzzle), new_puzzle_str, path_size + 1]) 
			paths[new_puzzle_str] = [...paths[curr], new_puzzle]
			visited.add(new_puzzle_str)
		}
	}
	return [paths[solved_puzzle.toString()], n, gbfs_path_size]
}

function PuzzleImage({image, is_highlighted, id}) {
	let source = image
	if(typeof image === "object") {
		source = URL.createObjectURL(image)	
	}
	let className = "center fit"
	if(is_highlighted) {
		className += ` highlighted-puzzle-image`
	}
	return (
		<img className={className} src={source} image-id={id}/>
	)
}

function PuzzleDisplay({state, set_puzzle_state, images, ui_lock}) {
	console.log("STATE: ", state)
	const top_row = state.slice(0, 3)
	const middle_row = state.slice(3, 6)
	const bottom_row = state.slice(6, 9)
	const get_adj_indices = (idx) => {
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
		if(ui_lock) {
			return
		}
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
	return (
		<div onClick={on_click} className="eight-puzzle-row-wrapper">
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



function Puzzle({puzzle_state, set_puzzle_state, puzzle_images, box_outline_color, box_color, box_type, show_settings, set_show_settings}) {
	const border_radius = box_type === user_settings.rounded_corners_box_type ? "5px" : "0px"
	const style = {
		backgroundColor: user_settings.get_rgb_by_color(box_color),
		borderColor: user_settings.get_rgb_by_color(box_outline_color),
		borderRadius: border_radius, 
		borderStyle: "solid",
		borderWidth: "2px"
	}
	const shuffle_text = "Shuffle"
	const solve_bfs_text = "Solve (BFS)"
	const solve_dijkstra_text = "Solve (Dijkstra)"
	const solve_astar_text = "Solve (A*)"
	const solve_gbfs_text = "Solve (GBFS)"
	const button_class_name = "puzzle-header-button"
	const button_hover_class_name = "puzzle-header-button-hover"
	const button_selected_class_name = "puzzle-header-button-selected"
	const show_settings_text = "Show Settings"
	const hide_settings_text = "Hide Settings"
	const [ui_lock, set_ui_lock] = useState(false)
	const not_animating_state = "NOT ANIMATING"
	const processing_state = "PROCESSING"
	const animating_state = "ANIMATING"
	const done_state = "DONE"
	const [animation_state, set_animation_state] = useState(not_animating_state) 
	const animate_puzzle_sequence = async (sequence) => {
		set_animation_state(animating_state)
		for(const item of sequence) {
			await sleep(500)
			set_puzzle_state(item)
		}
		set_animation_state(done_state)
	}
	console.log("ANIMATION STATE: ", animation_state)
	const on_header_buttons_click = (e) => {
		if(ui_lock) {
			return
		}
		if(e.target.textContent === shuffle_text) {
			//const state = [...puzzle_state]	
			const state = generate_shuffled_puzzle()
			set_puzzle_state(state)
		}
		if(e.target.textContent === solve_bfs_text) {
			const perform_bfs = async () => {
				try {
					console.log("SOLVING BFS for puzzle ", puzzle_state)
					const initial_puzzle_state = [...puzzle_state]
					const start = new Date().getTime();
					const [path, path_length, nodes_explored] = bfs(initial_puzzle_state)
					const end = new Date().getTime()
					console.log("BFS PATH: ", path)
					console.log("path length: ", path_length)
					console.log("Nodes explored: ", nodes_explored)
					await animate_puzzle_sequence(path)
					set_solve_time(end - start)
					if(initial_puzzle_state.toString() === solved_puzzle.toString()) {
						set_nodes_expanded(0)
					}
					else{
						set_nodes_expanded(nodes_explored)
					}
					set_solution_length(path_length)
					set_ui_lock(false)
				}
				catch (error) {
					console.error(error)
					set_ui_lock(false)
				}
			}
			const x = async () => {
				set_ui_lock(true)
				await sleep(50)
				perform_bfs().then(() => set_ui_lock(false))
			}
			const set_to_processing = async () => {set_animation_state(processing_state)}
			set_to_processing()
			x()
		}
		if(e.target.textContent === solve_dijkstra_text)  {
			const perform_dijkstra = async () => {
				try{
					set_ui_lock(true)	
					const initial_puzzle_state = [...puzzle_state]
					console.log("Performing dijsktra on ", initial_puzzle_state)
					const start = new Date().getTime();
					const [path_length, nodes_explored, path] = dijkstra(initial_puzzle_state)
					const end = new Date().getTime()
					set_solve_time(end - start)
					set_nodes_expanded(nodes_explored)
					set_solution_length(path_length)

					console.log("Optimal path: ", path)
					console.log("Shortest path len: ", path_length)
					console.log("Nodes explored: ", nodes_explored)
					await animate_puzzle_sequence(path)
					set_ui_lock(false)
				}
				catch (error) {
					console.error(error)
					set_ui_lock(false)
				}
			}
			const x = async () => {
				set_ui_lock(true)
				await sleep(50)
				perform_dijkstra().then(() => set_ui_lock(false))
			}
			const set_to_processing = () => {set_animation_state(processing_state)}
			set_to_processing()
			x()
		}
		if(e.target.textContent === solve_astar_text)  {
			const perform_astar = async () => {
				try{
					set_ui_lock(true)	
					const initial_puzzle_state = [...puzzle_state]
					console.log("Performing A* on ", initial_puzzle_state)
					const start = new Date().getTime()
					const a_star_res = a_star(initial_puzzle_state)
					const nodes_explored = a_star_res[1]
					const path_length = a_star_res[2]
					console.log("A*: ", a_star_res)
					const end = new Date().getTime()
					set_solve_time(end - start)
					set_nodes_expanded(nodes_explored)
					set_solution_length(path_length)
					const path = a_star_res[0]
					await animate_puzzle_sequence(path)
					set_ui_lock(false)
				}
				catch (error) {
					console.error(error)
					set_ui_lock(false)
				}
			}
			const x = async () => {
				set_ui_lock(true)
				await sleep(50)
				perform_astar().then(() => set_ui_lock(false))
			}
			const set_to_processing = async () => {set_animation_state(processing_state)}
			set_to_processing()
			x()
		}
		if(e.target.textContent === solve_gbfs_text)  {
			const perform_gbfs = async () => {
				try{
					set_ui_lock(true)	
					sleep(10)
					const initial_puzzle_state = [...puzzle_state]
					console.log("Performing GBFS on ", initial_puzzle_state)
					const start = new Date().getTime()
					const gbfs_res = gbfs(initial_puzzle_state)
					const end = new Date().getTime()
					const nodes_explored = gbfs_res[1]
					const path_length = gbfs_res[2]
					set_solve_time(end - start)
					set_nodes_expanded(nodes_explored)
					set_solution_length(path_length)
					console.log("gbfs: ", gbfs_res)
					const path = gbfs_res[0]
					await animate_puzzle_sequence(path)
					set_ui_lock(false)
				}
				catch (error) {
					console.error(error)
					set_ui_lock(false)
				}
			}
			const x = () => {
				set_ui_lock(true)
				perform_gbfs().then(() => {
					console.log("Unlocking ui")
					set_ui_lock(false)
				})
			}
			x()
			//perform_gbfs()
		}
		if(e.target.textContent === hide_settings_text) {
			set_show_settings(false)
		}
		if(e.target.textContent === show_settings_text) {
			set_show_settings(true)
		}
	}
	const on_puzzle_click = (e) => {
		console.log("TARGET: ", e.target)
		if(!e.target.classList.contains('highlighted-puzzle-image')) {
			return
		}
		if(animation_state === done_state) {
			set_animation_state(not_animating_state)
		}
	}
	const eight_puzzle_wrapper_class = "eight-puzzle-wrapper"
	const [nodes_expanded, set_nodes_expanded] = useState(0)
	const [solve_time, set_solve_time] = useState(0)
	const [solution_length, set_solution_length] = useState(0)
	return (
		<div className={eight_puzzle_wrapper_class}>
			<div className="puzzle-title">
				{"8-puzzle"}
			</div>
			<div className="eight-puzzle-header" onClick={on_header_buttons_click}>
				<Button text={shuffle_text} class_name={button_class_name} hovered_class_name={button_hover_class_name} selected_class_name={button_selected_class_name} />
				<Button text={solve_bfs_text} class_name={button_class_name} hovered_class_name={button_hover_class_name} selected_class_name={button_selected_class_name} />
				<Button text={solve_dijkstra_text} class_name={button_class_name} hovered_class_name={button_hover_class_name} selected_class_name={button_selected_class_name} />
				<Button text={solve_astar_text} class_name={button_class_name} hovered_class_name={button_hover_class_name} selected_class_name={button_selected_class_name} />
				<Button text={solve_gbfs_text} class_name={button_class_name} hovered_class_name={button_hover_class_name} selected_class_name={button_selected_class_name} />
				{!show_settings && <Button text={show_settings_text} class_name={button_class_name} hovered_class_name={button_hover_class_name} selected_class_name={button_selected_class_name} />}
				{show_settings && <Button text={hide_settings_text} class_name={button_class_name} hovered_class_name={button_hover_class_name} selected_class_name={button_selected_class_name} />}
			</div>
			<div className="eight-puzzle-container" style={style}>
				<div className="eight-puzzle" onClick={on_puzzle_click}>
					<PuzzleDisplay state={puzzle_state} images={puzzle_images} set_puzzle_state={set_puzzle_state} ui_lock={ui_lock}/>
				</div>
			</div>
			<div className="eight-puzzle-footer">
				{animation_state === processing_state && "Processing..."}
				{animation_state === animating_state && "Animating..."}
				{animation_state === done_state && (
					<div>
						<div>
							Nodes expanded: {nodes_expanded}
						</div>
						<div>
							Solve time: {solve_time} ms
						</div>
						<div>
							Solution length: {solution_length}
						</div>
					</div>
				)}
				{
					animation_state === not_animating_state && 
					puzzle_state.toString() === solved_puzzle.toString() &&
					<div>
						You win!
					</div>

				}
			</div>
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
					{curr_button_choice === default_text && <Dropdown options={user_settings.default_image_color_options} text="color" class_name={dropdown_class} on_change={on_dropdown_change} selected={color}/>}
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

function PuzzleSettingsHeader({active_subsection, set_active_subsection}) {
	const settings_text = "Settings"
	const on_subheading_click = (e) => {
		const target = e.target
		if (target.textContent == "") {
			return
		}
		if(active_subsection === target.textContent) {
			set_active_subsection(user_settings.no_subsection)
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

function PuzzleSettings({settings, set_settings, show}) {
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
	if(!show) {
		return (null)
	}
	const colors = settings.get_image_colors()
	return (
		<div className="eight-puzzle-settings-container">
			<PuzzleSettingsHeader active_subsection={active_subsection} set_active_subsection={set_active_subsection}/>
			<div className="settings-body-container">
				{active_subsection === user_settings.images_subsection && (<SettingsImagesSubsection curr_images={curr_images} set_image={set_image} set_is_default={set_is_default} colors={colors}/>)}
			</div>
		</div>
	)
}

function ModuleA({active}) {
	const default_user_settings = new user_settings.UserSettings()
	const [curr_user_settings, set_curr_user_settings] = useState(default_user_settings)
	const test_puzzle = [8,1,3,4,user_settings.space_number,2,7,6,5]
	const [puzzle_state, set_puzzle_state] = useState(test_puzzle)
	const [show_settings, set_show_settings] = useState(true)
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
			<Puzzle puzzle_state={puzzle_state} puzzle_images={curr_user_settings.get_puzzle_image_paths_without_null()} box_color={curr_user_settings.box_color} box_outline={curr_user_settings.box_outline} set_puzzle_state={set_puzzle_state} show_settings={show_settings} set_show_settings={set_show_settings}/>
			<PuzzleSettings settings={curr_user_settings} set_settings={debug_set_curr_user_settings} show={show_settings}/>	
		</div>
	)
}
export default ModuleA
