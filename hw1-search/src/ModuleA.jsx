import {useState} from 'react'
import { Heap } from 'heap-js';
import Button from './Button.jsx'
import UploadAndDisplayImage from './UploadAndDisplayImage.jsx'
import * as user_settings from './UserSettings.jsx'
import recognize_image from './RecognizeImage.js'

const class_name = "settings-subheading" 
const hover_class_name = "settings-subheading-hover"
const selected_class_name = "settings-subheading-selected"


// Source - https://stackoverflow.com/a/39914235
// Posted by Dan Dascalescu, modified by community. See post 'Timeline' for change history
// Retrieved 2026-06-20, License - CC BY-SA 4.0
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const image_id_name = "image-id"

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
	let shuffled = default_arr 
	console.log("Shuffled: ", shuffled)
	while(!is_valid_puzzle(shuffled) || shuffled.toString() === solved_puzzle.toString()) {
		console.log("Shuffled: ", shuffled)
		shuffle_array(shuffled)
	}
	return shuffled
}

function* bfs_generator(puzzle_state) {
	const visited = new Set()
	const q = []
	q.push([puzzle_state.toString(), 0])
	const N = 362880
	let n = 0
	const solved_puzzle_str = solved_puzzle.toString()
	let solution_path_length = Number.MAX_SAFE_INTEGER
	while(q.length > 0 && n < N) {
		const [current_node, path_length] = q.shift()	
		if(visited.has(current_node)) {
			continue
		}
		n += 1
		console.assert(typeof current_node === "string", "expected node in queue to be string")
		const curr_node_split = current_node.split(',')
		const curr_node_array = curr_node_split.map((x) => parseInt(x))
		if(current_node === solved_puzzle_str) {
			solution_path_length = path_length	
			yield [curr_node_array, solution_path_length, n] 
			break
		}
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
		}
		yield curr_node_array
		visited.add(current_node)
	}

}

function bfs(puzzle_state) {
	const solution_chain = []
	const visited = new Set() 
	const q = []
	q.push([puzzle_state.toString(), 0])
	const N = 362880
	let n = 0 // iteration count
	const solved_puzzle_str = solved_puzzle.toString()
	let solution_path_length = Number.MAX_SAFE_INTEGER 
	while (q.length > 0 && n < N) {
		const [current_node, path_length] = q.shift()
		if(visited.has(current_node)) {
			continue
		}
		n += 1
		console.assert(typeof current_node === "string", "expected node in queue to be string")
		solution_chain.push(current_node.toString())
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
		}
		visited.add(current_node)
	}
	console.log("VISITED: ", visited)
	console.log("n: ", n)
	return [solution_chain, solution_path_length]
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
	let N = 362880
	const paths = {}
	paths[source] = [puzzle_state]
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
	const g = (p) => {
		return get_puzzle_manhattan_distance(p, puzzle_state)
	}
	const source = puzzle_state.toString()
	g_score[source] = 0
	f_score[source] = h(puzzle_state)
	const paths = {}
	paths[source] = []
	let n = 0
	const N = 362880 
	pq.init([[f_score[source], source, 0]])
	console.log("PQ: ", pq)
	console.log("IS EMPTY?: ", pq.isEmpty())
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
			const tentative_g_score = g(new_puzzle) 
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
	console.log("n: ", n)
	return [paths[solved_puzzle.toString()], n, astar_path_size]

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
	const shuffle_text = "Shuffle"
	const solve_bfs_text = "Solve (BFS)"
	const solve_dijkstra_text = "Solve (Dijkstra)"
	const solve_astar_text = "Solve (A*)"
	const button_class_name = "puzzle-header-button"
	const button_hover_class_name = "puzzle-header-button-hover"
	const button_selected_class_name = "puzzle-header-button-selected"
	const [ui_lock, set_ui_lock] = useState(false)
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
					set_ui_lock(true)
					console.log("SOLVING BFS for puzzle ", puzzle_state)
					const initial_puzzle_state = [...puzzle_state]
					const bfs_gen = bfs_generator(initial_puzzle_state)
					let gen_val = bfs_gen.next().value
					do {
						//console.log("GEN VAL: ", gen_val)
						if(gen_val[0].toString() === solved_puzzle.toString()) {
							break
						}
						set_puzzle_state(gen_val)
						gen_val = bfs_gen.next().value
						
					} while(typeof gen_val[0] !== "object")
					console.log("Final puzzle state: ", gen_val)
					set_puzzle_state(gen_val[0])
					set_ui_lock(false)
				}
				catch (error) {
					console.error(error)
					set_ui_lock(false)
				}
			}
			perform_bfs()
		}
		if(e.target.textContent === solve_dijkstra_text)  {
			const perform_dijkstra = async () => {
				try{
					set_ui_lock(true)	
					set_ui_lock(false)
					const initial_puzzle_state = [...puzzle_state]
					console.log("Performing dijsktra on ", initial_puzzle_state)
					const [path_length, nodes_explored, path] = dijkstra(initial_puzzle_state)
					console.log("Optimal path: ", path)
					console.log("Shortest path len: ", path_length)
					console.log("Nodes explored: ", nodes_explored)
					set_puzzle_state(solved_puzzle)
				}
				catch (error) {
					console.error(error)
					set_ui_lock(false)
				}
			}
			perform_dijkstra()
		}
		if(e.target.textContent === solve_astar_text)  {
			const perform_astar = async () => {
				try{
					set_ui_lock(true)	
					const initial_puzzle_state = [...puzzle_state]
					console.log("Performing A* on ", initial_puzzle_state)
					const a_star_res = a_star(initial_puzzle_state)
					console.log("A*: ", a_star_res)
					set_puzzle_state(solved_puzzle)
					set_ui_lock(false)
				}
				catch (error) {
					console.error(error)
					set_ui_lock(false)
				}
			}
			perform_astar()
		}
	}
	return (
		<div className="eight-puzzle-wrapper">
			<div className="eight-puzzle-header" onClick={on_header_buttons_click}>
				<Button text={shuffle_text} class_name={button_class_name} hovered_class_name={button_hover_class_name} selected_class_name={button_selected_class_name} />
				<Button text={solve_bfs_text} class_name={button_class_name} hovered_class_name={button_hover_class_name} selected_class_name={button_selected_class_name} />
				<Button text={solve_dijkstra_text} class_name={button_class_name} hovered_class_name={button_hover_class_name} selected_class_name={button_selected_class_name} />
				<Button text={solve_astar_text} class_name={button_class_name} hovered_class_name={button_hover_class_name} selected_class_name={button_selected_class_name} />
			</div>
			<div className="eight-puzzle-container" style={style}>
				<div className="eight-puzzle">
					<PuzzleDisplay state={puzzle_state} images={puzzle_images} set_puzzle_state={set_puzzle_state} ui_lock={ui_lock}/>
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

function ModuleA({active}) {
	const default_user_settings = new user_settings.UserSettings()
	const [curr_user_settings, set_curr_user_settings] = useState(default_user_settings)
	const test_puzzle = [8,1,3,4,user_settings.space_number,2,7,6,5]
	const [puzzle_state, set_puzzle_state] = useState(test_puzzle)
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
