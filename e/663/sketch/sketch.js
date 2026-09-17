let streams = [];
let grid;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 100);
  
  // Create a structural grid
  grid = [];
  for (let i = 0; i < 20; i++) {
    grid.push([]);
    for (let j = 0; j < 20; j++) {
      grid[i].push({x: map(i, 0, 19, -width/2, width/2), y: map(j, 0, 19, -height/2, height/2)});
    }
  }

  // Create initial streams
  for (let i = 0; i < 50; i++) {
    streams.push(new Stream());
  }
}

function draw() {
  background(0);
  
  // Draw grid
  stroke(20, 100, 100, 30);
  noFill();
  for (let i = 0; i < grid.length; i++) {
    beginShape(LINES);
    for (let j = 0; j < grid[i].length; j++) {
      vertex(grid[i][j].x, grid[i][j].y);
    }
    endShape();
    
    beginShape(LINES);
    for (let j = 0; j < grid[i].length; j++) {
      vertex(grid[j][i].x, grid[j][i].y);
    }
    endShape();
  }

  // Update and display streams
  for (let i = 0; i < streams.length; i++) {
    streams[i].update();
    streams[i].display();
  }
}

class Stream {
  constructor() {
    this.points = [];
    this.life = random(100, 200);
    this.maxPoints = 100;
    this.hue = random(30, 60);
    this.saturation = 100;
    this.brightness = 100;
    
    // Start point
    let startX = random(-width/2, width/2);
    let startY = random(-height/2, height/2);
    this.points.push({x: startX, y: startY, size: 1, intensity: 0});
  }
  
  update() {
    if (this.points.length > 0) {
      // Add new point
      let lastPoint = this.points[this.points.length - 1];
      let angle = random(-0.5, 0.5);
      let newX = lastPoint.x + cos(angle) * 2;
      let newY = lastPoint.y + sin(angle) * 2;
      
      // Keep within bounds
      if (newX > width/2 || newX < -width/2 || newY > height/2 || newY < -height/2) {
        return;
      }
      
      this.points.push({x: newX, y: newY, size: 1, intensity: 0});
      
      // Limit points
      if (this.points.length > this.maxPoints) {
        this.points.shift();
      }
    }
    
    // Increase intensity of all points
    for (let i = 0; i < this.points.length; i++) {
      this.points[i].intensity += 0.02;
    }
    
    // Decrease life
    this.life--;
  }
  
  display() {
    if (this.points.length < 2) return;
    
    // Draw the stream as a series of connected points with varying intensity
    beginShape(LINES);
    for (let i = 0; i < this.points.length - 1; i++) {
      let p1 = this.points[i];
      let p2 = this.points[i + 1];
      
      // Calculate size based on intensity
      let size = map(p1.intensity, 0, 1, 1, 8);
      
      // Color with hue variation
      let h = (this.hue + i * 0.5) % 100;
      stroke(h, this.saturation, this.brightness, p1.intensity * 255);
      noFill();
      
      vertex(p1.x, p1.y, 0);
      vertex(p2.x, p2.y, 0);
    }
    endShape();
    
    // Draw central pulsing core
    let centerPoint = this.points[this.points.length - 1];
    fill(this.hue, this.saturation, this.brightness, 50 * centerPoint.intensity);
    noStroke();
    ellipse(centerPoint.x, centerPoint.y, 10 * centerPoint.intensity, 10 * centerPoint.intensity);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
