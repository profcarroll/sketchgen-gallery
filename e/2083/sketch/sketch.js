let threads = [];
let figures = [];
let time = 0;

class Thread {
  constructor(x, y) {
    this.points = [{ x, y }];
    this.color = color(
      random(120, 200),
      random(30, 80),
      random(60, 120),
      180
    );
    this.width = random(2, 6);
    this.growth = 0;
    this.maxGrowth = random(50, 150);
  }

  update() {
    if (this.growth < this.maxGrowth) {
      this.growth += 0.5;
    }
    
    // Add new points along the path
    if (random() < 0.3 && this.points.length < 100) {
      let last = this.points[this.points.length - 1];
      let angle = random(TWO_PI);
      let length = random(5, 20);
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

class Figure {
  constructor(x, y) {
    this.pos = { x, y };
    this.size = random(15, 30);
    this.color = color(
      random(180, 255),
      random(100, 180),
      random(100, 200)
    );
    this.type = floor(random(3)); // 0=humanoid, 1=animal, 2=abstract
    this.rotation = random(TWO_PI);
    this.growth = 0;
    this.maxGrowth = random(5, 15);
  }

  update() {
    if (this.growth < this.maxGrowth) {
      this.growth += 0.1;
    }
    this.rotation += 0.01;
  }

  draw() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.rotation);
    
    fill(this.color);
    noStroke();
    
    // Draw different figure types
    switch (this.type) {
      case 0: // Humanoid
        ellipse(0, 0, this.size * this.growth, this.size * this.growth * 1.5);
        // Head
        ellipse(0, -this.size * this.growth * 0.7, this.size * this.growth * 0.6, this.size * this.growth * 0.6);
        break;
      case 1: // Animal
        ellipse(0, 0, this.size * this.growth, this.size * this.growth * 0.8);
        // Tail
        let tailLength = this.size * this.growth * 0.8;
        line(0, 0, -tailLength, 0);
        break;
      case 2: // Abstract
        beginShape();
        for (let i = 0; i < 6; i++) {
          let angle = map(i, 0, 6, 0, TWO_PI);
          let radius = this.size * this.growth * (0.8 + noise(time + i) * 0.4);
          vertex(cos(angle) * radius, sin(angle) * radius);
        }
        endShape(CLOSE);
        break;
    }
    
    pop();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create initial threads
  for (let i = 0; i < 15; i++) {
    let startX = random(width);
    let startY = random(height);
    let thread = new Thread(startX, startY);
    
    // Add initial segments
    for (let j = 0; j < 30; j++) {
      let last = thread.points[thread.points.length - 1];
      let angle = random(TWO_PI);
      let length = random(5, 20);
      let x = last.x + cos(angle) * length;
      let y = last.y + sin(angle) * length;
      
      if (x > 0 && x < width && y > 0 && y < height) {
        thread.points.push({ x, y });
      }
    }
    
    threads.push(thread);
  }

  // Place figures at intersections
  for (let i = 0; i < threads.length; i++) {
    for (let j = i + 1; j < threads.length; j++) {
      let t1 = threads[i];
      let t2 = threads[j];
      
      // Simple intersection detection
      for (let k = 0; k < t1.points.length - 1; k++) {
        for (let l = 0; l < t2.points.length - 1; l++) {
          let s1 = t1.points[k];
          let e1 = t1.points[k + 1];
          let s2 = t2.points[l];
          let e2 = t2.points[l + 1];
          
          // Check if segments intersect
          let intersection = lineIntersection(s1, e1, s2, e2);
          if (intersection && random() < 0.3) {
            figures.push(new Figure(intersection.x, intersection.y));
          }
        }
      }
    }
  }
}

function lineIntersection(a, b, c, d) {
  let denom = (a.x - b.x) * (c.y - d.y) - (a.y - b.y) * (c.x - d.x);
  if (abs(denom) < 0.001) return null;
  
  let t = ((a.x - c.x) * (c.y - d.y) - (a.y - c.y) * (c.x - d.x)) / denom;
  let u = -((a.x - b.x) * (a.y - c.y) - (a.y - b.y) * (a.x - c.x)) / denom;
  
  if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
    return { x: a.x + t * (b.x - a.x), y: a.y + t * (b.y - a.y) };
  }
  return null;
}

function draw() {
  background(25, 15, 10); // Deep earth tone
  
  time += 0.01;
  
  // Update and draw threads
  for (let thread of threads) {
    thread.update();
    thread.draw();
  }
  
  // Update and draw figures
  for (let figure of figures) {
    figure.update();
    figure.draw();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
