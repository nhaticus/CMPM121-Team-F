class Day {
    constructor(initialDay = 1) {
      this.day = initialDay;
    }
  
    // Get the current day
    getCurrentDay() {
      return this.day;
    }
  
    // Increment the day
    incrementDay() {
      this.day++;
      console.log(`Day incremented: ${this.day}`);
      return this.day;
    }
  
    // Save the current day to localStorage
    saveDay() {
      localStorage.setItem('day', this.day);
      console.log(`Day saved: ${this.day}`);
    }
  
    // Load the day from localStorage
    loadDay() {
      const savedDay = parseInt(localStorage.getItem('day')) || 1;
      this.day = savedDay;
      console.log(`Day loaded: ${this.day}`);
      return this.day;
    }
}