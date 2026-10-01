let tunnels = [];
let crystals = [];

class Tunnel {
  constructor(x, y) {
    this.segments = [{ x, y }];
    this.width = random(15, 30);
    this.color = color(
      random(100, 150),
      random(60, 100),
      random(20, 50),
      200
    );
  }

  addSegment(x, y) {
    this.segments.push({ x, y });
  }

  draw() {
    if (this.segments.length < 2) return;
    
    stroke(this.color);
    strokeWeight(this.width);
    noFill();
    beginShape();
    for (let i = 0; i < this.segments.length; i++) {
      vertex(this.segments[i].x, this.segments[i].y);
    }
    endShape();
  }
}

class Crystal {
  constructor(x, y, size, color) {
    this.pos = { x, y };
    this.size = size;
    this.color = color;
    this.growth = 0;
    this.maxGrowth = random(5, 15);
  }

  update() {
    if (this.growth < this.maxGrowth) {
      this.growth += 0.1;
    }
  }

  draw() {
    push();
    translate(this.pos.x, this.pos.y);
    
    // Draw a crystalline vein structure
    fill(this.color);
    noStroke();
    
    // Base crystal shape (a few sharp points)
    beginShape();
    for (let i = 0; i < 6; i++) {
      let angle = map(i, 0, 6, 0, TWO_PI);
      let radius = this.size * this.growth;
      vertex(cos(angle) * radius, sin(angle) * radius);
    }
    endShape(CLOSE);
    
    // Add sharp crystal spikes
    stroke(this.color);
    strokeWeight(1);
    for (let i = 0; i < 8; i++) {
      let angle = map(i, 0, 8, 0, TWO_PI);
      let startX = cos(angle) * this.size * this.growth;
      let startY = sin(angle) * this.size * this.growth;
      let endX = cos(angle) * (this.size * this.growth + random(10, 30));
      let endY = sin(angle) * (this.size * this.growth + random(10, 30));
      
      line(startX, startY, endX, endY);
    }
    
    pop();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create initial tunnels
  for (let i = 0; i < 8; i++) {
    let startX = random(width);
    let startY = random(height);
    let tunnel = new Tunnel(startX, startY);
    
    // Add some segments
    for (let j = 0; j < 20; j++) {
      let angle = random(TWO_PI);
      let length = random(50, 150);
      let endX = startX + cos(angle) * length;
      let endY = startY + sin(angle) * length;
      
      tunnel.addSegment(endX, endY);
      startX = endX;
      startY = endY;
    }
    
    tunnels.push(tunnel);
  }

  // Find intersections and place crystals
  for (let i = 0; i < tunnels.length; i++) {
    for (let j = i + 1; j < tunnels.length; j++) {
      let t1 = tunnels[i];
      let t2 = tunnels[j];
      
      // Simple intersection detection between segments
      for (let k = 0; k < t1.segments.length - 1; k++) {
        for (let l = 0; l < t2.segments.length - 1; l++) {
          let s1 = t1.segments[k];
          let e1 = t1.segments[k + 1];
          let s2 = t2.segments[l];
          let e2 = t2.segments[l + 1];
          
          // Check if segments intersect
          let intersection = lineIntersection(s1, e1, s2, e2);
          if (intersection) {
            // Add a crystal at the intersection point
            let crystalSize = random(5, 15);
            let crystalColor = color(
              random(180, 255),
              random(100, 200),
              random(100, 255)
            );
            crystals.push(new Crystal(intersection.x, intersection.y, crystalSize, crystalColor));
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
  background(20, 15, 10); // Dark earth tone

  // Draw tunnels
  for (let tunnel of tunnels) {
    tunnel.draw();
  }

  // Update and draw crystals
  for (let crystal of crystals) {
    crystal.update();
    crystal.draw();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
