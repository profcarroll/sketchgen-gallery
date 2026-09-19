let sectors = [];
let spawnTimer = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  noFill();
  stroke(0, 150, 0);
  strokeWeight(2);
}

function draw() {
  background(0);
  
  spawnTimer--;
  if (spawnTimer <= 0) {
    sectors.push(new Sector());
    spawnTimer = random(30, 90);
  }
  
  for (let i = sectors.length - 1; i >= 0; i--) {
    sectors[i].update();
    sectors[i].show();
    if (sectors[i].isDead()) {
      sectors.splice(i, 1);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  sectors = [];
}

class Sector {
  constructor() {
    this.cx = width / 2;
    this.cy = height / 2;
    this.r = min(width, height) / 2;
    this.angle = random(360);
    this.maxLen = 0;
    this.growth = random(0.5, 2.5);
    this.falloff = 0;
  }
  
  update() {
    this.maxLen += this.growth;
    this.falloff = max(0, 255 - this.maxLen * 3);
  }
  
  show() {
    let endRadius = min(this.maxLen, this.r * 1.2);
    let x1 = this.cx + endRadius * cos(this.angle);
    let y1 = this.cy + endRadius * sin(this.angle);
    stroke(0, 150, this.falloff);
    line(this.cx, this.cy, x1, y1);
  }
  
  isDead() {
    return this.maxLen > this.r * 1.5 && this.falloff < 0;
  }
}
