let substrate;
let mold;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  substrate = createGraphics(width, height);
  substrate.background(50, 60, 70);
  for (let i = 0; i < 1000; i++) {
    let x = random(width);
    let y = random(height);
    let sz = random(2, 8);
    substrate.noStroke();
    substrate.fill(40, 50, 60);
    substrate.ellipse(x, y, sz, sz);
  }
  mold = new Mold();
}

function draw() {
  background(10);
  time += 0.01;
  
  // Substrate
  image(substrate, 0, 0);
  
  // Mold
  mold.update();
  mold.display();
}

class Mold {
  constructor() {
    this.parts = [];
    this.growthRate = 0.02;
    this.maxParts = 500;
    for (let i = 0; i < 10; i++) {
      this.parts.push({
        x: random(-width/4, width/4),
        y: random(-height/4, height/4),
        size: random(5, 20),
        age: 0,
        maxAge: random(100, 300)
      });
    }
  }

  update() {
    for (let part of this.parts) {
      part.age++;
      if (part.age > part.maxAge) {
        part.x += random(-2, 2);
        part.y += random(-2, 2);
        part.size *= 0.98;
        if (part.size < 1) {
          this.parts.splice(this.parts.indexOf(part), 1);
          this.parts.push({
            x: random(-width/4, width/4),
            y: random(-height/4, height/4),
            size: random(5, 20),
            age: 0,
            maxAge: random(100, 300)
          });
        }
      } else {
        part.x += random(-0.5, 0.5);
        part.y += random(-0.5, 0.5);
        part.size *= (1 + this.growthRate);
      }
    }
    
    // Add new parts occasionally
    if (random() < 0.3 && this.parts.length < this.maxParts) {
      this.parts.push({
        x: random(-width/4, width/4),
        y: random(-height/4, height/4),
        size: random(5, 10),
        age: 0,
        maxAge: random(100, 300)
      });
    }
  }

  display() {
    noStroke();
    for (let part of this.parts) {
      // Create organic lighting
      let bright = map(part.age, 0, part.maxAge, 200, 255);
      let hue = (time * 10 + part.age) % 360;
      fill(hue, 70, bright, 200);
      
      // Volumetric sphere with depth
      ellipse(part.x, part.y, part.size);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
