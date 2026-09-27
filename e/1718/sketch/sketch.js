let tunnels = [];
let streams = [];
let sedimentParticles = [];

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

class SedimentParticle {
  constructor(x, y) {
    this.pos = { x, y };
    this.size = random(1, 3);
    this.color = color(
      random(80, 120),
      random(50, 90),
      random(20, 40)
    );
    this.life = random(60, 120);
  }

  update() {
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
    
    // Leave behind sediment at junctions and bends
    if (frameCount % 5 === 0) {
      sedimentParticles.push(new SedimentParticle(streams[i].pos.x, streams[i].pos.y));
    }
    
    if (streams[i].life <= 0) {
      streams.splice(i, 1);
    }
  }

  // Update and draw sediment particles
  for (let i = sedimentParticles.length - 1; i >= 0; i--) {
    sedimentParticles[i].update();
    sedimentParticles[i].draw();
    
    if (sedimentParticles[i].life <= 0) {
      sedimentParticles.splice(i, 1);
    }
  }

  // Add some streams to follow the main tunnel
  if (frameCount % 10 === 0 && streams.length < 200) {
    let startX = tunnels[0].segments[tunnels[0].segments.length - 1].x;
    let startY = tunnels[0].segments[tunnels[0].segments.length - 1].y;
    streams.push(new Stream(startX, startY));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
