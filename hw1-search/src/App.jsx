import { useState } from 'react'
import './App.css'
import Button from './Button.jsx'
import ModuleA from './ModuleA.jsx'
import ModuleB from './ModuleB.jsx'

function App() {
	const module_a_text = "Module A"
	const module_b_text = "Module B"
	const module_button_classname = "module-button"
	const module_button_hover_classname = "hovered-module-button"
	const module_button_selected_classname = "selected-module-button"
	const [module_a_active, set_module_a_active] = useState(false)
	const [module_b_active, set_module_b_active] = useState(false)
	const on_module_button_press = (e) => {
		const target = e.target
		console.assert(typeof target.textContent !== "undefined")
		if(target.textContent === module_a_text) {
			if(module_a_active) {
				set_module_a_active(false)
			}
			else {
				set_module_a_active(true)
			}
		}
		else if(target.textContent === module_b_text) {
			if(module_b_active) {
				set_module_b_active(false)
			}
			else {
				set_module_b_active(true)
			}
		}
		else {
			console.error("Unknown target.textContent: ", target.textContent)
			console.log(target.textContent)
		}
		console.log(target)
	}
	console.log("Module A active: ", module_a_active)
	console.log("Module B active: ", module_b_active)

	return (
		<div className="container">
			<div className="header" onClick={on_module_button_press}>
				<Button text={module_a_text} class_name={module_button_classname} hovered_class_name={module_button_hover_classname} selected_class_name={module_button_selected_classname} active={module_a_active}/>
				<Button text={module_b_text} class_name={module_button_classname} hovered_class_name={module_button_hover_classname} selected_class_name={module_button_selected_classname} active={module_b_active}/>
			</div>
			<div className="body">
				<ModuleA active={module_a_active}/>
				<ModuleB active={module_b_active}/>
			</div>
		</div>
	)
}

export default App
