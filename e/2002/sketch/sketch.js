let rock;
let veins = [];
let impacts = [];
let noiseScale = 0.005;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  rock = createGraphics(width, height);
  initializeRock();
  
  // Start with some veins
  for (let i = 0; i < 100; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    veins.push(new Vein(x, y));
  }
}

function draw() {
  background(20, 30, 40);
  time += 0.002;
  
  // Draw the rock surface
  image(rock, -width/2, -height/2);
  
  // Update and draw veins
  for (let i = veins.length - 1; i >= 0; i--) {
    let vein = veins[i];
    vein.update();
    vein.display();
    
    if (vein.isDead()) {
      veins.splice(i, 1);
    }
  }
  
  // Update and draw impacts
  for (let i = impacts.length - 1; i >= 0; i--) {
    let impact = impacts[i];
    impact.update();
    impact.display();
    
    if (impact.isDead()) {
      impacts.splice(i, 1);
    }
  }
}

function mousePressed() {
  // Create an impact at the click location
  impacts.push(new Impact(mouseX - width/2, mouseY - height/2));
  
  // Add new veins near the impact point
  for (let i = 0; i < 3; i++) {
    let angle = random(TWO_PI);
    let distance = random(50, 150);
    let x = mouseX - width/2 + cos(angle) * distance;
    let y = mouseY - height/2 + sin(angle) * distance;
    veins.push(new Vein(x, y, true)); // Fast growth
  }
}

function initializeRock() {
  rock.loadPixels();
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let noiseVal = noise(x * noiseScale, y * noiseScale, time);
      
      // Create varying rock hues
      let r = map(noiseVal, 0, 1, 30, 60);
      let g = map(noiseVal, 0, 1, 40, 70);
      let b = map(noiseVal, 0, 1, 50, 80);
      
      let index = (x + y * width) * 4;
      rock.pixels[index] = r;
      rock.pixels[index + 1] = g;
      rock.pixels[index + 2] = b;
      rock.pixels[index + 3] = 255;
    }
  }
  
  rock.updatePixels();
}

class Vein {
  constructor(x, y, fast = false) {
    this.x = x;
    this.y = y;
    this.growth = 0;
    this.maxGrowth = random(100, 300);
    if (fast) this.maxGrowth = 50; // Faster growth near impact
    this.angle = random(TWO_PI);
    this.length = random(50, 200);
    this.segments = [];
    this.maxSegments = 20;
    
    // Create initial segments
    for (let i = 0; i < this.maxSegments; i++) {
      this.segments.push({x: x, y: y, size: map(i, 0, this.maxSegments, 5, 0.1)});
    }
  }
  
  update() {
    if (this.growth < this.maxGrowth) {
      this.growth += 2;
    }
    
    // Update segments
    for (let i = this.segments.length - 1; i >= 0; i--) {
      let segment = this.segments[i];
      
      // Move segment
      segment.x += cos(this.angle) * 0.5;
      segment.y += sin(this.angle) * 0.5;
      
      // Randomize direction slightly
      this.angle += random(-0.1, 0.1);
      
      // Fade out as they grow
      if (i < this.segments.length - 1) {
        segment.size *= 0.98;
      }
    }
    
    // Add new segments at the tip
    if (this.segments.length < this.maxSegments && this.growth > 50) {
      let lastSegment = this.segments[this.segments.length - 1];
      this.segments.push({x: lastSegment.x, y: lastSegment.y, size: lastSegment.size * 0.8});
    }
  }
  
  display() {
    push();
    
    // Draw the vein
    stroke(220, 240, 255);
    strokeWeight(1);
    noFill();
    
    beginShape();
    for (let i = 0; i < this.segments.length; i++) {
      let segment = this.segments[i];
      vertex(segment.x, segment.y);
    }
    endShape();
    
    pop();
  }
  
  isDead() {
    return this.growth > this.maxGrowth && this.segments.length === 0;
  }
}

class Impact {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.maxRadius = 100;
    this.alpha = 255;
  }
  
  update() {
    this.radius += 3;
    this.alpha = map(this.radius, 0, this.maxRadius, 255, 0);
  }
  
  display() {
    push();
    
    noFill();
    stroke(255, 200, 100, this.alpha);
    strokeWeight(2);
    ellipse(this.x, this.y, this.radius * 2);
    
    pop();
  }
  
  isDead() {
    return this.radius > this.maxRadius;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  rock = createGraphics(width, height);
  initializeRock();
}
