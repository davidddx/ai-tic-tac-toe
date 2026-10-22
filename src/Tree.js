// this.value holds the board but in string in form
// example: ['x', 'o', ...] => "x,o,..."
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
		const seen = new Set()
		while(q.length > 0) {
			const curr = q.shift()
			if(seen.has(curr.value)) {
				continue
			}
			count += 1
			seen.add(curr.value)
			if(curr.children.length === 0) {
				continue
			}
			const filtered_children = curr.children.filter((child) => !seen.has(child.value))
			q.push(...filtered_children)
		}
		return count
	}
	get_max_branching_factor() {
		let max_branching_factor = this.children.length
		const q = [...this.children]
		const seen = new Set()
		while(q.length > 0) {
			const curr = q.shift()
			if(seen.has(curr.value)) {
				continue
			}
			max_branching_factor = Math.max(curr.children.length, max_branching_factor)
			seen.add(curr.value)
			if(curr.children.length === 0) {
				continue
			}
			const filtered = curr.children.filter((child) => !seen.has(child.value))
			q.push(...filtered)
		}
		return max_branching_factor 
	}

}
export default TreeNode;
