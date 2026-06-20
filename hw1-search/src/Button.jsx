import {useState} from 'react'
function Button({text, class_name, hovered_class_name, selected_class_name, active}) {
	const [hover, set_hover] = useState(false)
	const on_mouse_over = (e) => {
		set_hover(true)
	}
	const on_mouse_out = (e) => {
		set_hover(false)
	}
	if(!hover && !active) {
		return (
			<div 
			className={class_name} 
			text={text} 
			onMouseOver={on_mouse_over} onMouseOut={on_mouse_out}
			>
				{text}
			</div>
		)
	}
	else if(hover && !active) {
		return (

			<div 
			className={hovered_class_name} 
			text={text} 
			onMouseOver={on_mouse_over} onMouseOut={on_mouse_out}
			>
				{text}
			</div>
		)

	}
	else {
		return ( 

			<div 
			className={selected_class_name} 
			text={text} 
			onMouseOver={on_mouse_over} onMouseOut={on_mouse_out}
			>
				{text}
			</div>
		)
	}
}


export default Button
