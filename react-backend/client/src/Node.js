class Node {
	constructor(username, mat) {
		this.matrix = mat;
		this.username = username;
		this.next = null;
		this.prev = null;
	}
}
export default Node;