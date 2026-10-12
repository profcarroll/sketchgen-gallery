let crystals = [];
let particles = [];
let palette = [];

class Crystal {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.segments = [];
    this.growth = 0;
    this.maxGrowth = random(50, 150);
    this.color = random(palette);
    this.shattered = false;
    this.shatterTime = 0;
  }

  update() {
    if (!this.shattered) {
      // Grow crystal
      this.growth += 1;
      
      if (this.growth > this.maxGrowth) {
        this.shattered = true;
        this.shatterTime = frameCount;
        
        // Create fragments
        for (let i = 0; i < 50; i++) {
          particles.push({
            pos: createVector(this.pos.x, this.pos.y),
            vel: p5.Vector.random2D().mult(random(2, 8)),
            life: 1,
            color: this.color,
            size: random(2, 6)
          });
        }
      } else {
        // Add new segments during growth
        let angle = random(TWO_PI);
        let length = random(5, 15);
        let endX = this.pos.x + cos(angle) * length;
        let endY = this.pos.y + sin(angle) * length;
        
        this.segments.push({
          start: createVector(this.pos.x, this.pos.y),
          end: createVector(endX, endY),
          life: 1
        });
      }
      
      // Update segments
      for (let i = this.segments.length - 1; i >= 0; i--) {
        this.segments[i].life -= 0.01;
        if (this.segments[i].life <= 0) {
          this.segments.splice(i, 1);
        }
      }
    } else {
      // Update fragments
      for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.pos.add(p.vel);
        p.vel.mult(0.95); // Slow down
        p.life -= 0.01;
        
        if (p.life <= 0) {
          particles.splice(i, 1);
        }
      }
    }
  }

  display() {
    noFill();
    
    if (!this.shattered) {
      // Draw growing crystal
      stroke(this.color);
      strokeWeight(2);
      
      for (let seg of this.segments) {
        let alpha = map(seg.life, 0, 1, 50, 255);
        stroke(red(this.color), green(this.color), blue(this.color), alpha);
        line(seg.start.x, seg.start.y, seg.end.x, seg.end.y);
      }
      
      // Draw growth tip
      if (this.segments.length > 0) {
        let lastSeg = this.segments[this.segments.length - 1];
        stroke(this.color);
        strokeWeight(3);
        point(lastSeg.end.x, lastSeg.end.y);
      }
    } else {
      // Draw fragments
      noStroke();
      for (let p of particles) {
        fill(red(p.color), green(p.color), blue(p.color), p.life * 200);
        ellipse(p.pos.x, p.pos.y, p.size * p.life);
      }
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);

  // Edo woodblock print palette - muted and ethereal
  palette = [
    color(255, 255, 255), // White
    color(180, 180, 180), // Light gray
    color(120, 120, 120), // Medium gray
    color(60, 60, 60),    // Dark gray
    color(255, 200, 200), // Pale pink
    color(255, 150, 150)  // Pink
  ];

  // Create initial crystals
  for (let i = 0; i < 3; i++) {
    crystals.push(new Crystal(random(width), random(height)));
  }
}

function draw() {
  background(10, 10, 20);

  // Update and display crystals
  for (let crystal of crystals) {
    crystal.update();
    crystal.display();
  }

  // Add new crystals occasionally
  if (frameCount % 300 === 0 && crystals.length < 8) {
    crystals.push(new Crystal(random(width), random(height)));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
