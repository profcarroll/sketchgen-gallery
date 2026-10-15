let tapestries = [];

class SilkTapestry {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.size = random(80, 150);
    this.rotation = random(TWO_PI);
    this.rotationSpeed = random(-0.002, 0.002);
    this.color = color(
      random(100, 200),
      random(80, 160),
      random(150, 255),
      150
    );
    this.threadCount = floor(random(30, 70));
    this.threads = [];
    this.warp = [];
    this.weft = [];
    
    // Create woven thread structure
    this.createTapestry();
  }
  
  createTapestry() {
    // Generate warp threads (vertical)
    for (let i = 0; i < this.threadCount; i++) {
      let x = map(i, 0, this.threadCount - 1, -this.size/2, this.size/2);
      let yStart = -this.size/2;
      let yEnd = this.size/2;
      
      // Add some weave irregularity
      let warpThread = [];
      for (let j = 0; j < 10; j++) {
        let y = map(j, 0, 9, yStart, yEnd);
        let offset = sin(j * 0.5 + millis() * 0.001) * 2;
        warpThread.push(createVector(x + offset, y));
      }
      this.warp.push(warpThread);
    }
    
    // Generate weft threads (horizontal)
    for (let i = 0; i < this.threadCount; i++) {
      let y = map(i, 0, this.threadCount - 1, -this.size/2, this.size/2);
      let xStart = -this.size/2;
      let xEnd = this.size/2;
      
      // Add some weave irregularity
      let weftThread = [];
      for (let j = 0; j < 10; j++) {
        let x = map(j, 0, 9, xStart, xEnd);
        let offset = cos(j * 0.5 + millis() * 0.001) * 2;
        weftThread.push(createVector(x, y + offset));
      }
      this.weft.push(weftThread);
    }
  }
  
  update() {
    this.rotation += this.rotationSpeed;
    
    // Animate thread movement
    for (let i = 0; i < this.warp.length; i++) {
      for (let j = 0; j < this.warp[i].length; j++) {
        let offset = sin(j * 0.3 + millis() * 0.001 + i) * 2;
        this.warp[i][j].x += offset * 0.01;
      }
    }
    
    for (let i = 0; i < this.weft.length; i++) {
      for (let j = 0; j < this.weft[i].length; j++) {
        let offset = cos(j * 0.3 + millis() * 0.001 + i) * 2;
        this.weft[i][j].y += offset * 0.01;
      }
    }
  }
  
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.rotation);
    
    // Draw warp threads (vertical)
    stroke(red(this.color), green(this.color), blue(this.color), 100);
    strokeWeight(0.5);
    noFill();
    
    for (let i = 0; i < this.warp.length; i++) {
      beginShape();
      for (let j = 0; j < this.warp[i].length; j++) {
        let p = this.warp[i][j];
        vertex(p.x, p.y);
      }
      endShape();
    }
    
    // Draw weft threads (horizontal)
    for (let i = 0; i < this.weft.length; i++) {
      beginShape();
      for (let j = 0; j < this.weft[i].length; j++) {
        let p = this.weft[i][j];
        vertex(p.x, p.y);
      }
      endShape();
    }
    
    // Draw subtle stress lines where threads intersect
    stroke(255, 255, 255, 30);
    strokeWeight(0.1);
    for (let i = 0; i < this.warp.length; i++) {
      for (let j = 0; j < this.weft.length; j++) {
        if (random() < 0.02) {
          let warpX = this.warp[i][0].x;
          let warpY = this.warp[i][0].y;
          let weftX = this.weft[j][0].x;
          let weftY = this.weft[j][0].y;
          
          line(warpX, warpY, weftX, weftY);
        }
      }
    }
    
    pop();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  
  // Create initial tapestries
  for (let i = 0; i < 8; i++) {
    let x = random(width);
    let y = random(height);
    tapestries.push(new SilkTapestry(x, y));
  }
}

function draw() {
  background(20, 15, 30);
  
  // Draw subtle gradient background
  for (let i = 0; i < height; i += 20) {
    let alpha = map(i, 0, height, 10, 50);
    stroke(40, 30, 60, alpha);
    line(0, i, width, i);
  }
  
  // Update and display tapestries
  for (let i = 0; i < tapestries.length; i++) {
    let tapestry = tapestries[i];
    tapestry.update();
    tapestry.display();
    
    // Occasionally add new tapestries to simulate continuous weaving
    if (random() < 0.001 && tapestries.length < 15) {
      let x = random(width);
      let y = random(height);
      tapestries.push(new SilkTapestry(x, y));
    }
  }
  
  // Remove old tapestries
  if (tapestries.length > 15) {
    tapestries.shift();
  }
}

function mousePressed() {
  // Trigger a ripple effect by adjusting all tapestries
  for (let i = 0; i < tapestries.length; i++) {
    tapestries[i].rotationSpeed += random(-0.01, 0.01);
    tapestries[i].size *= random(0.95, 1.05);
  }
}
