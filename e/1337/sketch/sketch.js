/**
 * Floating Octagonal Frames
 * A liminal space with drifting, photo-bearing octagons.
 */

let frames = [];
const FRAME_COUNT = 8;
let bgGradient;
let img;

function preload() {
  // Using picsum for a stable, CORS-friendly image
  img = loadImage('https://picsum.photos/seed/liminal/600/600');
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
  // Draw the hazy, atmospheric background
  image(bgGradient, 0, 0);

  // Draw the floating frames
  for (let f of frames) {
    f.update();
    f.display();
  }
}

function drawGradient(pg) {
  pg.noStroke();
  // Muted, dreamlike colors (dusty blues, soft purples, greys)
  for (let y = 0; y < pg.height; y++) {
    let inter = map(y, 0, pg.height, 0, 1);
    let c = lerpColor(color(20, 25, 35), color(60, 55, 70), inter);
    pg.stroke(c);
    pg.line(0, y, pg.width, y);
  }
}

class OctagonFrame {
  constructor(id) {
    this.id = id;
    this.reset();
    // Stagger initial positions so they don't all start together
    this.x = random(width);
    this.y = random(height);
  }

  reset() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(150, 300);
    this.velX = random(-0.5, 0.5);
    this.velY = random(-0.5, 0.5);
    this.rot = random(TWO_PI);
    this.rotVel = random(-0.005, 0.005);
    this.scaleVal = random(0.8, 1.2);
    this.scaleVel = random(0.001, 0.003);
    this.phase = random(TWO_PI); // For bobbing motion
    this.bobX = 0;
    this.bobY = 0;
  }

  update() {
    // Linear drift
    this.x += this.velX;
    this.y += this.velY;
    this.rot += this.rotVel;
    
    // Subtle scale pulsing
    this.scaleVal += this.scaleVel;
    if (this.scaleVal > 1.3 || this.scaleVal < 0.7) {
      this.scaleVel *= -1;
    }

    // Bobbing/weaving motion using sine waves
    this.bobX = sin(frameCount * 0.01 + this.phase) * 20;
    this.bobY = cos(frameCount * 0.012 + this.phase) * 20;

    // Wrap around edges for continuous motion
    if (this.x < -this.size) this.x = width + this.size;
    if (this.x > width + this.size) this.x = -this.size;
    if (this.y < -this.size) this.y = height + this.size;
    if (this.y > height + this.size) this.y = -this.size;
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
    stroke(200, 200, 210, 150); // Muted metallic/ghostly stroke
    strokeWeight(4);
    this.drawOctagon(0, 0, this.size / 2);
    
    // Inner glow/border
    strokeWeight(1);
    stroke(255, 255, 255, 50);
    this.drawOctagon(0, 0, this.size / 2 - 4);
    
    pop();
  }

  drawClippedPhoto() {
    push();
    // Note: beginClip is a relatively recent addition and might be slow or 
    // unavailable in some environments. For robustness in this specific task, 
    // we simulate the "liminal" feel by layering.
    beginClip();
    this.drawOctagon(0, 0, this.size / 2);
    endClip();
    
    imageMode(CENTER);
    // The image is drawn slightly larger/offset to create movement within the frame
    let imgShift = sin(frameCount * 0.005 + this.id) * 10;
    image(img, imgShift, imgShift, this.size * 1.2, this.size * 1.2);
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
  // Handle audio context safely if needed, or simply avoid calling 
  // undefined functions like getAudioContext() if the library isn't loaded.
  try {
    if (userStartAudio) {
      userStartAudio();
    }
  } catch (e) {
    // Ignore if audio is not available
  }
}
