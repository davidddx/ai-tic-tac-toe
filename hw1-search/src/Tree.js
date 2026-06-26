// this.value holds the board but in string in form
// ex: ['x', 'o', ...] => "x,o,..."
// so that i can put node.value into sets 
// or check if its in an object 
class TreeNode {
	constructor(value) {
		this.value = value
		this.children = []
	}
	//debug function
	get_node_count() {
		let count = this.children.length
		const q = [...this.children]
		while(q.length > 0) {
			const curr = q.shift()
			if(curr.children.length === 0) {
				continue
			}
			count += curr.children.length
			q.push(...curr.children)
		}
		return count
	}
	
}
export default TreeNode;
