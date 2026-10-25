let threads = [];
let crystals = [];
let time = 0;

class Thread {
  constructor(x, y) {
    this.points = [{ x, y }];
    this.color = color(
      random(180, 255),
      random(80, 150),
      random(30, 90),
      150
    );
    this.width = random(1, 3);
    this.growth = 0;
    this.maxGrowth = random(100, 200);
  }

  update() {
    if (this.growth < this.maxGrowth) {
      this.growth += 0.3;
    }
    
    // Add new points along the path
    if (random() < 0.2 && this.points.length < 150) {
      let last = this.points[this.points.length - 1];
      let angle = random(TWO_PI);
      let length = random(3, 15);
      let x = last.x + cos(angle) * length;
      let y = last.y + sin(angle) * length;
      
      // Keep within canvas
      if (x > 0 && x < width && y > 0 && y < height) {
        this.points.push({ x, y });
      }
    }
  }

  draw() {
    if (this.points.length < 2) return;
    
    stroke(this.color);
    strokeWeight(this.width * (this.growth / this.maxGrowth));
    noFill();
    
    beginShape();
    for (let i = 0; i < this.points.length; i++) {
      let point = this.points[i];
      vertex(point.x, point.y);
    }
    endShape();
  }
}

class Crystal {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(3, 8);
    this.growth = 0;
    this.maxGrowth = random(200, 400);
    this.color = color(
      random(200, 255),
      random(150, 255),
      random(200, 255),
      200
    );
    this.pulse = 0;
  }

  update() {
    if (this.growth < this.maxGrowth) {
      this.growth += 0.8;
    }
    this.pulse = sin(time * 3 + this.x * 0.01 + this.y * 0.01) * 0.5 + 0.5;
  }

  draw() {
    push();
    translate(this.x, this.y);
    
    // Draw crystal shape
    fill(this.color);
    noStroke();
    
    // Create a crystalline form with multiple facets
    beginShape();
    for (let i = 0; i < 8; i++) {
      let angle = TWO_PI * i / 8;
      let radius = this.size * (0.7 + this.pulse * 0.3);
      let x = cos(angle) * radius;
      let y = sin(angle) * radius;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Add inner facets
    fill(255, 255, 255, 100);
    beginShape();
    for (let i = 0; i < 6; i++) {
      let angle = TWO_PI * i / 6;
      let radius = this.size * 0.4;
      let x = cos(angle) * radius;
      let y = sin(angle) * radius;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    pop();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create initial threads
  for (let i = 0; i < 30; i++) {
    let startX = random(width);
    let startY = random(height);
    let thread = new Thread(startX, startY);
    
    // Add initial segments
    for (let j = 0; j < 20; j++) {
      let last = thread.points[thread.points.length - 1];
      let angle = random(TWO_PI);
      let length = random(3, 15);
      let x = last.x + cos(angle) * length;
      let y = last.y + sin(angle) * length;
      
      if (x > 0 && x < width && y > 0 && y < height) {
        thread.points.push({ x, y });
      }
    }
    
    threads.push(thread);
  }

  // Add some initial crystals
  for (let i = 0; i < 20; i++) {
    let x = random(width);
    let y = random(height);
    crystals.push(new Crystal(x, y));
  }
}

function draw() {
  background(15, 10, 5); // Deep earth tone
  
  time += 0.01;
  
  // Update and draw threads
  for (let thread of threads) {
    thread.update();
    thread.draw();
  }
  
  // Update and draw crystals
  for (let crystal of crystals) {
    crystal.update();
    crystal.draw();
  }
}

function mousePressed() {
  // Create new branching veins from click position
  let x = mouseX;
  let y = mouseY;
  
  // Add new thread at click location
  threads.push(new Thread(x, y));
  
  // Add crystals around the click point
  for (let i = 0; i < 5; i++) {
    let angle = random(TWO_PI);
    let distance = random(20, 60);
    let cx = x + cos(angle) * distance;
    let cy = y + sin(angle) * distance;
    crystals.push(new Crystal(cx, cy));
  }
  
  // Flash existing nearby crystals
  for (let crystal of crystals) {
    let d = dist(crystal.x, crystal.y, x, y);
    if (d < 100) {
      crystal.growth = 0; // Reset growth to make it flash
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
