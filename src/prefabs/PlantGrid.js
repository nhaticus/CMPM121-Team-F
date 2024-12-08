class PlantGrid{
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.grid = new Array(width * height).fill(null);
  }

  getIndex(x, y) {
    return (Math.floor(y / 16) - 23) * this.width + (Math.floor(x / 16) - 15);
  }

  getPlant(x, y) {
    return this.grid[this.getIndex(x, y)];
  }

  setPlant(x, y, plant) {
    const index = this.getIndex(x, y);
    this.grid[index] = plant;
  }

  setGrid(newGrid){
    this.grid = newGrid;
  }

  getGrid(){
    return this.grid;
  }
  
}