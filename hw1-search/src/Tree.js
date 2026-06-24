class TreeNode {
	constructor(value) {
		this.value = value
		this.children = []
	}
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
