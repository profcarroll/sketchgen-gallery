let paths = [];
let inkTexture;
let mouseTrail = [];
let fadeRate = 0.97;
let maxTrailLength = 50;

function setup() {
  createCanvas(windowWidth, windowHeight);
  inkTexture = createGraphics(width, height);
  // Draw newsprint texture
  inkTexture.background(240, 230, 220);
  inkTexture.noiseDetail(2, 0.5);
  for (let y = 0; y < height; y += 10) {
    for (let x = 0; x < width; x += 10) {
      let n = inkTexture.noise(x * 0.01, y * 0.01) * 255;
      if (n < 30) {
        inkTexture.stroke(200, 190, 180);
        inkTexture.point(x, y);
      }
    }
  }
  // Initialize paths
  for (let i = 0; i < 10; i++) {
    paths.push(new Path());
  }
}

function draw() {
  background(240, 230, 220);
  image(inkTexture, 0, 0);
  
  // Update and display paths
  for (let path of paths) {
    path.update();
    path.display();
  }
  
  // Add mouse trail
  mouseTrail.push({x: mouseX, y: mouseY});
  if (mouseTrail.length > maxTrailLength) {
    mouseTrail.shift();
  }
  
  // Draw mouse trail
  stroke(100, 150, 200);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let i = 0; i < mouseTrail.length; i++) {
    let alpha = map(i, 0, mouseTrail.length, 0, 255);
    stroke(100, 150, 200, alpha * 0.7);
    vertex(mouseTrail[i].x, mouseTrail[i].y);
  }
  endShape();
  
  // Draw glow effect around mouse
  noStroke();
  fill(100, 150, 200, 30);
  ellipse(mouseX, mouseY, 40, 40);
}

class Path {
  constructor() {
    this.points = [];
    this.growth = random(0.5, 2.0);
    this.speed = random(0.1, 0.5);
    this.angle = random(TWO_PI);
    this.length = int(random(50, 200));
    this.color = color(
      random(80, 160),
      random(100, 200),
      random(180, 255),
      random(80, 180)
    );
    // Initialize with a few points
    for (let i = 0; i < 5; i++) {
      this.points.push({
        x: random(width),
        y: random(height),
        age: 0
      });
    }
  }
  
  update() {
    // Add new point
    if (random() < 0.3) {
      let last = this.points[this.points.length - 1];
      let nextX = last.x + cos(this.angle) * this.growth;
      let nextY = last.y + sin(this.angle) * this.growth;
      
      // Boundary check
      if (nextX < 0 || nextX > width || nextY < 0 || nextY > height) {
        this.angle += random(-0.5, 0.5);
      } else {
        this.points.push({
          x: nextX,
          y: nextY,
          age: 0
        });
      }
    }
    
    // Move existing points slightly
    for (let p of this.points) {
      p.x += random(-this.speed, this.speed);
      p.y += random(-this.speed, this.speed);
      p.age++;
    }
    
    // Remove old points
    while (this.points.length > this.length) {
      this.points.shift();
    }
  }
  
  display() {
    if (this.points.length < 2) return;
    
    stroke(this.color);
    strokeWeight(1);
    noFill();
    beginShape();
    for (let p of this.points) {
      vertex(p.x, p.y);
    }
    endShape();
    
    // Draw glow around first point
    let first = this.points[0];
    noStroke();
    fill(red(this.color), green(this.color), blue(this.color), 30);
    ellipse(first.x, first.y, 8, 8);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Reinitialize texture
  inkTexture = createGraphics(width, height);
  inkTexture.background(240, 230, 220);
  inkTexture.noiseDetail(2, 0.5);
  for (let y = 0; y < height; y += 10) {
    for (let x = 0; x < width; x += 10) {
      let n = inkTexture.noise(x * 0.01, y * 0.01) * 255;
      if (n < 30) {
        inkTexture.stroke(200, 190, 180);
        inkTexture.point(x, y);
      }
    }
  }
}
