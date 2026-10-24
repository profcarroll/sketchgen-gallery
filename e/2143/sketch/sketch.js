let structures = [];
let backgroundTexture;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  backgroundTexture = createGraphics(width, height);
  backgroundTexture.background(30, 40, 60);
  backgroundTexture.noiseDetail(3, 0.3);
  for (let y = 0; y < height; y += 15) {
    for (let x = 0; x < width; x += 15) {
      let n = backgroundTexture.noise(x * 0.005, y * 0.005) * 255;
      if (n < 40) {
        backgroundTexture.stroke(20, 30, 50);
        backgroundTexture.point(x, y);
      }
    }
  }

  // Initialize sedimentary structures
  for (let i = 0; i < 50; i++) {
    structures.push(new SedimentaryStructure());
  }
}

function draw() {
  background(30, 40, 60);
  image(backgroundTexture, -width/2, -height/2);

  // Update and display structures
  for (let structure of structures) {
    structure.update();
    structure.display();
  }

  time += 0.001;
}

class SedimentaryStructure {
  constructor() {
    this.points = [];
    this.growth = random(0.3, 1.0);
    this.speed = random(0.02, 0.08);
    this.angle = random(TWO_PI);
    this.length = int(random(50, 200));
    this.color = color(
      random(60, 120),
      random(80, 150),
      random(180, 230),
      random(100, 180)
    );
    this.crystal = [];
    this.growthRate = random(0.001, 0.005);
    this.phase = random(TWO_PI);
    
    // Initialize with a few points
    for (let i = 0; i < 3; i++) {
      this.points.push({
        x: random(-width/2, width/2),
        y: random(-height/2, height/2),
        z: random(-100, 100),
        age: 0
      });
    }
    
    // Initialize crystal points (fewer for performance)
    for (let i = 0; i < 10; i++) {
      this.crystal.push({
        x: random(-50, 50),
        y: random(-50, 50),
        z: random(-50, 50),
        size: random(1, 4)
      });
    }
  }
  
  update() {
    // Add new point
    if (random() < 0.2) {
      let last = this.points[this.points.length - 1];
      let nextX = last.x + cos(this.angle) * this.growth;
      let nextY = last.y + sin(this.angle) * this.growth;
      let nextZ = last.z + random(-0.5, 0.5) * this.growth;
      
      // Boundary check
      if (nextX < -width/2 || nextX > width/2 || 
          nextY < -height/2 || nextY > height/2 ||
          nextZ < -100 || nextZ > 100) {
        this.angle += random(-0.3, 0.3);
      } else {
        this.points.push({
          x: nextX,
          y: nextY,
          z: nextZ,
          age: 0
        });
      }
    }
    
    // Move existing points slightly
    for (let p of this.points) {
      p.x += random(-this.speed, this.speed);
      p.y += random(-this.speed, this.speed);
      p.z += random(-this.speed * 0.5, this.speed * 0.5);
      p.age++;
    }
    
    // Remove old points
    while (this.points.length > this.length) {
      this.points.shift();
    }
    
    // Update crystal points
    for (let c of this.crystal) {
      c.x += sin(time * 0.5 + c.z * 0.1) * 0.1;
      c.y += cos(time * 0.3 + c.z * 0.1) * 0.1;
      c.size = 1 + sin(time * 0.7 + c.x * 0.02) * 0.5;
    }
  }
  
  display() {
    if (this.points.length < 2) return;
    
    // Draw sedimentary layers
    stroke(this.color);
    strokeWeight(1);
    noFill();
    beginShape();
    for (let p of this.points) {
      vertex(p.x, p.y, p.z);
    }
    endShape();
    
    // Draw crystal structures using batched spheres
    push();
    translate(this.points[0].x, this.points[0].y, this.points[0].z);
    rotateX(time * 0.3);
    rotateY(time * 0.2);
    rotateZ(time * 0.1);
    
    // Batch crystal drawing to avoid too many sphere() calls
    beginShape(POINTS);
    for (let c of this.crystal) {
      fill(red(this.color), green(this.color), blue(this.color), 150);
      vertex(c.x, c.y, c.z);
    }
    endShape();
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Reinitialize texture
  backgroundTexture = createGraphics(width, height);
  backgroundTexture.background(30, 40, 60);
  backgroundTexture.noiseDetail(3, 0.3);
  for (let y = 0; y < height; y += 15) {
    for (let x = 0; x < width; x += 15) {
      let n = backgroundTexture.noise(x * 0.005, y * 0.005) * 255;
      if (n < 40) {
        backgroundTexture.stroke(20, 30, 50);
        backgroundTexture.point(x, y);
      }
    }
  }
}
