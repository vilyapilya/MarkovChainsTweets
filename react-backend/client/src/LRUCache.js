import Node from './Node'

class LRUCache {
	constructor() {
		this.head = null
		this.tail = null
		this.map = {}
		this.limit = 10
		this.currentSize = 0

		this.getKey = this.getKey.bind(this)
		this.setHead = this.setHead.bind(this)
		this.size = 0
	}

	setHead(node) {
		node.prev = null
		node.next = this.head
		if(this.head !== null) {
			this.head.prev = node
		}
		if(this.tail == null) {
			this.tail = node;
		}
		this.head = node
		this.size++
	}

	getKey(key) {
		if(this.map[key]){
			this.setHead(this.map[key])
			return this.map[key]
		}
		return null
	}

	setKey(username, mat) {
		var node = new Node(username, mat)
		this.map[username] = node
		if(this.size >= this.limit) {
			delete this.map[this.tail]
			this.tail = this.tail.prev
			this.size--;
			this.tail.next = null
		}
		this.setHead(node)
	}
	
}

export default LRUCache;