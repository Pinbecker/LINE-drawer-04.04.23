class AnchorPoint {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.connectedLines = [];
    }
  
    // Method to add a connected line to the anchor point
    addConnectedLine(line) {
      this.connectedLines.push(line);
    }
  
    // Method to remove a connected line from the anchor point
    removeConnectedLine(line) {
      const index = this.connectedLines.indexOf(line);
      if (index > -1) {
        this.connectedLines.splice(index, 1);
      }
    }
  
    // Method to determine the type (end post or corner post) of the anchor point
    get type() {
      return this.connectedLines.length === 1 ? 'end post' : 'corner post';
    }
  
    // Method to determine the height of the anchor point
    get height() {
      let maxHeight = 0;
      this.connectedLines.forEach(line => {
        if (line.height > maxHeight) {
          maxHeight = line.height;
        }
      });
      return maxHeight;
    }

    // Methos to determine the material of the anchor point
    get materials() {
      const uniqueMaterials = new Set();
      this.connectedLines.forEach(line => {
        uniqueMaterials.add(line.material);
      });
      return Array.from(uniqueMaterials);
    }

      // Add this method to the AnchorPoint class
    distanceTo(x, y) {
      const dx = this.x - x;
      const dy = this.y - y;
      return Math.sqrt(dx * dx + dy * dy);
  }
  }
  