/**
 * Floating Octagonal Frames
 * A vast, empty void with widely dispersed, drifting photographic octagons.
 * Revised for WEBGL to provide depth and scale.
 */

let frames = [];
const FRAME_COUNT = 12;
let img;

function preload() {
  // Using picsum for a stable, CORS-friendly image
  img = loadImage('https://picsum.photos/seed/void/800/800');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  // Initialize octagonal frame objects
  for (let i = 0; i < FRAME_COUNT; i++) {
    frames.push(new OctagonFrame(i));
  }
}

function draw() {
  background(5, 5, 8);

  // Subtle ambient light to define the shapes in the void
  ambientLight(40);
  pointLight(100, 100, 120, 0, 0, 200);

  // Move camera slightly to simulate a slow drift through space
  let camX = sin(frameCount * 0.002) * 50;
  let camY = cos(frameCount * 0.0015) * 50;
  camera(camX, camY, 600, 0, 0, 0, 0, 1, 0);

  // Draw the floating, widely dispersed frames
  for (let f of frames) {
    f.update();
    f.display();
  }
}

class OctagonFrame {
  constructor(id) {
    this.id = id;
    this.reset();
    // Spread them across a large 3D volume
    this.x = random(-width, width);
    this.y = random(-height, height);
    this.z = random(-1000, 200);
  }

  reset() {
    this.size = random(150, 300);
    this.velX = random(-0.2, 0.2);
    this.velY = random(-0.2, 0.2);
    this.velZ = random(-0.3, 0.3);
    this.rot = random(TWO_PI);
    this.rotVel = random(-0.005, 0.005);
    this.scaleVal = random(0.8, 1.2);
    this.scaleVel = random(0.0005, 0.0015);
    this.phase = random(TWO_PI);
  }

  update() {
    this.x += this.velX;
    this.y += this.velY;
    this.z += this.velZ;
    this.rot += this.rotVel;
    
    this.scaleVal += this.scaleVel;
    if (this.scaleVal > 1.2 || this.scaleVal < 0.8) {
      this.scaleVel *= -1;
    }

    // Wrap around 3D space
    const wrap = 1200;
    if (this.x < -wrap) this.x = wrap;
    if (this.x > wrap) this.x = -wrap;
    if (this.y < -wrap) this.y = wrap;
    if (this.y > wrap) this.y = -wrap;
    if (this.z < -1200) this.z = 500;
    if (this.z > 500) this.z = -1200;
  }

  display() {
    push();
    translate(this.x, this.y, this.z);
    rotateZ(this.rot);
    scale(this.scaleVal);

    // 1. Draw the "Photograph" as a textured plane
    // In WEBGL, we use a plane with the image texture
    push();
    // We simulate the octagon clipping by drawing the plane 
    // and then overlaying an octagonal frame.
    // Since true stencil masking is heavy, we use a geometric approach.
    texture(img);
    // Slightly larger than the frame to allow for internal movement
    let imgSize = this.size * 1.2;
    plane(imgSize, imgSize);
    pop();

    // 2. Draw the Octagonal Frame (as a wireframe/line geometry)
    noFill();
    stroke(200, 200, 220, 180);
    strokeWeight(2);
    this.drawOctagonShape(0, 0, this.size / 2);
    
    // 3. Inner glow highlight
    stroke(255, 255, 255, 60);
    strokeWeight(1);
    this.drawOctagonShape(0, 0, this.size / 2 - 4);
    
    pop();
  }

  drawOctagonShape(x, y, r) {
    // Using vertex to create an octagon in WEBGL
    beginShape(LINES);
    // We create an octagon by drawing lines between points
    let pts = [];
    for (let i = 0; i < 8; i++) {
      let theta = map(i, 0, 8, 0, TWO_PI);
      pts.push({
        x: cos(theta) * r,
        y: sin(theta) * r
      });
    }
    for (let i = 0; i < 8; i++) {
      let next = (i + 1) % 8;
      vertex(pts[i].x, pts[i].y, 0);
      vertex(pts[next].x, pts[next].y, 0);
    }
    endShape();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  try {
    if (typeof userStartAudio === 'function') {
      userStartAudio();
    }
  } catch (e) {}
}
