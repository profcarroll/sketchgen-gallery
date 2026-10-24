let threads = [];
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

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create initial threads
  for (let i = 0; i < 25; i++) {
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

  // Add some crystalline veins
  for (let i = 0; i < 50; i++) {
    let x = random(width);
    let y = random(height);
    let angle = random(TWO_PI);
    let length = random(30, 100);
    
    push();
    translate(x, y);
    rotate(angle);
    stroke(255, 255, 200, 100);
    strokeWeight(random(0.5, 2));
    line(0, 0, length, 0);
    pop();
  }
}

function draw() {
  background(30, 20, 15); // Deep earth tone
  
  time += 0.005;
  
  // Update and draw threads
  for (let thread of threads) {
    thread.update();
    thread.draw();
  }
  
  // Add sediment deposits
  noStroke();
  for (let i = 0; i < 100; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(1, 4);
    
    fill(150, 120, 80, 100);
    ellipse(x, y, size, size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
