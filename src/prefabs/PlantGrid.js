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
  addPlant(x, y, plant) {
    this.grid[this.getIndex(x, y)] = plant;
  }
  removePlant(x, y) {
    const index = this.getIndex(x, y);
    if (this.grid[index]) {
      delete this.grid[index];
    }
  }
  getNeighbors(x, y) {
    const neighbors = [];
    const directions = [
      { dx: -1, dy: -1 }, { dx: 0, dy: -1 }, { dx: 1, dy: -1 },
      { dx: -1, dy: 0 },                     { dx: 1, dy: 0 },
      { dx: -1, dy: 1 }, { dx: 0, dy: 1 }, { dx: 1, dy: 1 },
    ];
  
    directions.forEach(({ dx, dy }) => {
      const neighbor = this.getPlant(x + dx, y + dy);
      if (neighbor) neighbors.push(neighbor);
    });
  
    return neighbors;
  }
}