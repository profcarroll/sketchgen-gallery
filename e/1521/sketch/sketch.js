let seeds = [];
let soilColor;
let greenSprouts = [];
let furrow = [];
let pulse = { x: 0, y: 0, radius: 0, active: false };
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB);

  // Create rich earth tones
  soilColor = color(139, 69, 19); // Brown

  // Generate initial seeds
  for (let i = 0; i < 200; i++) {
    seeds.push({
      x: random(width),
      y: random(height),
      size: random(2, 5),
      dormant: true,
      sprout: null,
      pulse: false,
      pulseRadius: 0
    });
  }
}

function draw() {
  background(soilColor);

  // Animate the field gently
  time += 0.01;
  for (let i = 0; i < seeds.length; i++) {
    let s = seeds[i];
    if (s.dormant) {
      // Slight movement to simulate wind or soil settling
      s.x += sin(time + i) * 0.2;
      s.y += cos(time + i) * 0.2;
    }
  }

  // Draw furrow if exists
  if (furrow.length > 1) {
    stroke(34, 139, 34); // Dark green for furrow
    strokeWeight(3);
    noFill();
    beginShape();
    for (let i = 0; i < furrow.length; i++) {
      vertex(furrow[i].x, furrow[i].y);
    }
    endShape();
  }

  // Draw seeds
  noStroke();
  fill(101, 67, 33); // Darker brown for seeds
  for (let i = 0; i < seeds.length; i++) {
    let s = seeds[i];
    if (s.dormant) {
      ellipse(s.x, s.y, s.size);
    }
  }

  // Draw sprouts that are growing
  for (let i = 0; i < greenSprouts.length; i++) {
    let g = greenSprouts[i];
    g.grow();
    if (g.isFinished()) {
      greenSprouts.splice(i, 1);
      i--;
    }
  }

  // Draw sprouts
  for (let i = 0; i < greenSprouts.length; i++) {
    greenSprouts[i].draw();
  }

  // Draw pulse if active
  if (pulse.active) {
    stroke(255, 255, 0, 100);
    noFill();
    ellipse(pulse.x, pulse.y, pulse.radius * 2);
    pulse.radius += 3;
    if (pulse.radius > 300) {
      pulse.active = false;
    }
  }

  // Update seeds with pulse
  for (let i = 0; i < seeds.length; i++) {
    let s = seeds[i];
    if (s.pulse && s.dormant) {
      s.pulseRadius += 2;
      if (s.pulseRadius > 30) {
        s.dormant = false;
        greenSprouts.push(new Sprout(s.x, s.y));
        s.pulse = false;
        s.pulseRadius = 0;
      }
    }
  }

  // Draw pulse effect on seeds
  for (let i = 0; i < seeds.length; i++) {
    let s = seeds[i];
    if (s.pulse && !s.dormant) {
      noStroke();
      fill(255, 255, 0, 100);
      ellipse(s.x, s.y, s.pulseRadius);
    }
  }
}

function mousePressed() {
  furrow = [];
  pulse.active = true;
  pulse.x = width / 2;
  pulse.y = height / 2;
  pulse.radius = 0;

  // Check if any seeds are under the click and start pulse
  for (let i = 0; i < seeds.length; i++) {
    let s = seeds[i];
    let d = dist(width / 2, height / 2, s.x, s.y);
    if (d < 100 && s.dormant) {
      s.pulse = true;
    }
  }
}

function mouseDragged() {
  // Add to furrow path
  furrow.push({x: mouseX, y: mouseY});

  // Check if any seeds are under the cursor and make them sprout
  for (let i = 0; i < seeds.length; i++) {
    let s = seeds[i];
    let d = dist(mouseX, mouseY, s.x, s.y);
    if (d < s.size + 10 && s.dormant) {
      s.dormant = false;
      greenSprouts.push(new Sprout(s.x, s.y));
    }
  }
}

class Sprout {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.height = 0;
    this.growthRate = random(0.5, 1.5);
    this.maxHeight = random(30, 60);
    this.color = color(random(30, 50), random(100, 150), random(30, 50));
  }

  grow() {
    this.height += this.growthRate;
  }

  isFinished() {
    return this.height >= this.maxHeight;
  }

  draw() {
    stroke(this.color);
    strokeWeight(2);
    line(this.x, this.y, this.x, this.y - this.height);
  }
}
