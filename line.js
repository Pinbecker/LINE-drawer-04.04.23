class Line {
    constructor(material, height, startX, startY, endX, endY) {
      this.material = material;
      this.height = height;
      this.startX = startX;
      this.startY = startY;
      this.endX = endX;
      this.endY = endY;
    }
  
    // Method to calculate the length of the line
    get length() {
      const dx = this.endX - this.startX;
      const dy = this.endY - this.startY;
      return Math.sqrt(dx * dx + dy * dy);
    }
  }
  