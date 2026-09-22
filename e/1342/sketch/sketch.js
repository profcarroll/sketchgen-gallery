/**
 * Floating Octagonal Frames
 * A vast, empty void with widely dispersed, drifting photographic octagons.
 */

let frames = [];
const FRAME_COUNT = 6;
let bgGradient;
let img;

function preload() {
  // Using picsum for a stable, CORS-friendly image
  img = loadImage('https://picsum.photos/seed/void/800/800');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create a background gradient buffer to avoid per-frame gradient calculation
  bgGradient = createGraphics(width, height);
  drawGradient(bgGradient);

  // Initialize octagonal frame objects
  for (let i = 0; i < FRAME_COUNT; i++) {
    frames.push(new OctagonFrame(i));
  }
}

function draw() {
  // Draw the vast, empty void background
  image(bgGradient, 0, 0);

  // Draw the floating, widely dispersed frames
  for (let f of frames) {
    f.update();
    f.display();
  }
}

function drawGradient(pg) {
  pg.noStroke();
  // Deep, vast darkness (near black to very dark charcoal)
  for (let y = 0; y < pg.height; y++) {
    let inter = map(y, 0, pg.height, 0, 1);
    let c = lerpColor(color(5, 5, 8), color(15, 15, 20), inter);
    pg.stroke(c);
    pg.line(0, y, pg.width, y);
  }
}

class OctagonFrame {
  constructor(id) {
    this.id = id;
    this.reset();
    // Ensure they are widely dispersed across the void
    this.x = random(width);
    this.y = random(height);
  }

  reset() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(180, 350);
    // Very slow, independent drift
    this.velX = random(-0.2, 0.2);
    this.velY = random(-0.2, 0.2);
    this.rot = random(TWO_PI);
    this.rotVel = random(-0.002, 0.002);
    this.scaleVal = random(0.9, 1.1);
    this.scaleVel = random(0.0005, 0.0015);
    this.phase = random(TWO_PI);
    this.bobX = 0;
    this.bobY = 0;
  }

  update() {
    // Linear drift
    this.x += this.velX;
    this.y += this.velY;
    this.rot += this.rotVel;
    
    // Subtle scale breathing
    this.scaleVal += this.scaleVel;
    if (this.scaleVal > 1.15 || this.scaleVal < 0.85) {
      this.scaleVel *= -1;
    }

    // Extremely slow, nearly imperceptible bobbing
    this.bobX = sin(frameCount * 0.005 + this.phase) * 15;
    this.bobY = cos(frameCount * 0.007 + this.phase) * 15;

    // Wrap around edges to maintain the sense of infinite space
    const buffer = this.size;
    if (this.x < -buffer) this.x = width + buffer;
    if (this.x > width + buffer) this.x = -buffer;
    if (this.y < -buffer) this.y = height + buffer;
    if (this.y > height + buffer) this.y = -buffer;
  }

  display() {
    push();
    translate(this.x + this.bobX, this.y + this.bobY);
    rotate(this.rot);
    scale(this.scaleVal);

    // 1. Draw the Photo (clipped to octagon)
    this.drawClippedPhoto();

    // 2. Draw the Octagonal Frame
    noFill();
    stroke(180, 180, 190, 120); // Ghostly, thin frame
    strokeWeight(3);
    this.drawOctagon(0, 0, this.size / 2);
    
    // Inner highlight
    strokeWeight(1);
    stroke(255, 255, 255, 40);
    this.drawOctagon(0, 0, this.size / 2 - 3);
    
    pop();
  }

  drawClippedPhoto() {
    push();
    // Using beginClip for the octagonal mask
    beginClip();
    this.drawOctagon(0, 0, this.size / 2);
    endClip();
    
    imageMode(CENTER);
    // Slight parallax-like movement within the frame
    let imgShiftX = sin(frameCount * 0.004 + this.id) * 15;
    let imgShiftY = cos(frameCount * 0.003 + this.id) * 15;
    image(img, imgShiftX, imgShiftY, this.size * 1.3, this.size * 1.3);
    pop();
  }

  drawOctagon(x, y, r) {
    beginShape();
    for (let i = 0; i < 8; i++) {
      let theta = map(i, 0, 8, 0, TWO_PI);
      let vx = x + cos(theta) * r;
      let vy = y + sin(theta) * r;
      vertex(vx, vy);
    }
    endShape(CLOSE);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  bgGradient = createGraphics(width, height);
  drawGradient(bgGradient);
}

function mousePressed() {
  try {
    if (typeof userStartAudio === 'function') {
      userStartAudio();
    }
  } catch (e) {
    // Silently handle audio context issues
  }
}
