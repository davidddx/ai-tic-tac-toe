import { useState } from 'react'
import './App.css'
import Button from './Button.jsx'
import ModuleA from './ModuleA.jsx'
import ModuleB from './ModuleB.jsx'

function App() {
	return (
		<div className="container">
			<div className="body">
				<ModuleB active={true}/>
			</div>
		</div>
	)
}

export default App
