let tunnels = [];
let ants = [];
let focusPoint = { x: 0, y: 0 };
let isDigging = false;
let diggingProgress = 0;

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

class Ant {
  constructor(x, y) {
    this.pos = { x, y };
    this.target = null;
    this.speed = random(0.5, 1.5);
    this.size = random(3, 6);
    this.color = color(
      random(200, 255),
      random(100, 150),
      random(50, 100)
    );
  }

  update() {
    if (this.target) {
      let dx = this.target.x - this.pos.x;
      let dy = this.target.y - this.pos.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 1) {
        this.pos.x += (dx / distance) * this.speed;
        this.pos.y += (dy / distance) * this.speed;
      } else {
        this.target = null;
      }
    }
  }

  draw() {
    fill(this.color);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.size);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  focusPoint.x = width / 2;
  focusPoint.y = height / 2;

  // Create initial tunnels
  for (let i = 0; i < 5; i++) {
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

  // Create ants
  for (let i = 0; i < 50; i++) {
    let x = random(width);
    let y = random(height);
    ants.push(new Ant(x, y));
  }
}

function draw() {
  background(30, 20, 10); // Dark earth tone

  // Draw tunnels
  for (let tunnel of tunnels) {
    tunnel.draw();
  }

  // Update and draw ants
  for (let ant of ants) {
    ant.update();
    ant.draw();
  }

  if (isDigging && diggingProgress < 1) {
    diggingProgress += 0.02;
    
    // Create new tunnel segments toward focus point
    let angle = atan2(focusPoint.y - tunnels[0].segments[0].y, 
                      focusPoint.x - tunnels[0].segments[0].x);
    
    let newSegment = {
      x: tunnels[0].segments[tunnels[0].segments.length - 1].x + cos(angle) * 20,
      y: tunnels[0].segments[tunnels[0].segments.length - 1].y + sin(angle) * 20
    };
    
    tunnels[0].addSegment(newSegment.x, newSegment.y);
    
    // Keep tunnel width growing
    if (tunnels[0].width < 50) {
      tunnels[0].width += 0.5;
    }
  }

  // Add some ants to follow the main tunnel
  if (frameCount % 30 === 0 && ants.length < 100) {
    let startX = tunnels[0].segments[0].x;
    let startY = tunnels[0].segments[0].y;
    ants.push(new Ant(startX, startY));
  }
}

function mousePressed() {
  // Set new focus point
  focusPoint.x = mouseX;
  focusPoint.y = mouseY;
  
  // Start digging animation
  isDigging = true;
  diggingProgress = 0;
}
