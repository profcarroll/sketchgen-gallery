let tunnels = [];
let streams = [];
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

class Stream {
  constructor(x, y) {
    this.pos = { x, y };
    this.size = random(2, 6);
    this.speed = random(0.5, 1.5);
    this.color = color(
      random(0, 50),
      random(100, 200),
      random(180, 255)
    );
    this.life = random(30, 60);
  }

  update() {
    this.pos.x += random(-this.speed, this.speed);
    this.pos.y += random(-this.speed, this.speed);
    this.life--;
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

  // Create initial streams
  for (let i = 0; i < 100; i++) {
    let x = random(width);
    let y = random(height);
    streams.push(new Stream(x, y));
  }
}

function draw() {
  background(30, 20, 10); // Dark earth tone

  // Draw tunnels
  for (let tunnel of tunnels) {
    tunnel.draw();
  }

  // Update and draw streams
  for (let i = streams.length - 1; i >= 0; i--) {
    streams[i].update();
    streams[i].draw();
    
    if (streams[i].life <= 0) {
      streams.splice(i, 1);
    }
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
    
    // Create streams at the intersection
    for (let i = 0; i < 5; i++) {
      streams.push(new Stream(newSegment.x, newSegment.y));
    }
  }

  // Add some streams to follow the main tunnel
  if (frameCount % 10 === 0 && streams.length < 200) {
    let startX = tunnels[0].segments[tunnels[0].segments.length - 1].x;
    let startY = tunnels[0].segments[tunnels[0].segments.length - 1].y;
    streams.push(new Stream(startX, startY));
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
