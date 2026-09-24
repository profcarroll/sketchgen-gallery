/**
 * Floating Octagonal Frames
 * A vast, empty void with octagonal frames drifting in a synchronized spiral,
 * receding into the distance to create a sense of rhythmic depth.
 */

let frames = [];
const FRAME_COUNT = 15;
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
  pointLight(100, 100, 150, 0, 0, 400);

  // The camera remains relatively stable to emphasize the motion of the objects
  // moving through the depth of the field.
  camera(0, 0, 800, 0, 0, 0, 0, 1, 0);

  // Draw the floating frames
  for (let f of frames) {
    f.update();
    f.display();
  }
}

class OctagonFrame {
  constructor(id) {
    this.id = id;
    // Spiral parameters
    // We use the id to create a distributed, synchronized spiral effect
    this.angleOffset = (TWO_PI / FRAME_COUNT) * id;
    this.radiusOffset = id * 40;
    
    this.reset();
  }

  reset() {
    this.size = random(100, 200);
    this.rot = random(TWO_PI);
    this.rotVel = random(-0.01, 0.01);
    
    // Spiral movement variables
    this.spiralAngle = this.angleOffset;
    this.spiralRadius = this.radiusOffset;
    this.z = random(-1000, 200);
    this.zVel = -1.5; // Constant receding speed
  }

  update() {
    // Slowly rotate the frame itself
    this.rot += this.rotVel;

    // Update spiral position
    this.spiralAngle += 0.005; // The synchronized rotation
    this.x = cos(this.spiralAngle) * this.spiralRadius;
    this.y = sin(this.spiralAngle) * this.spiralRadius;
    
    // Move away from viewer
    this.z += this.zVel;

    // If it recedes too far, recycle it to the front
    if (this.z < -1500) {
      this.z = 500;
      this.spiralAngle = 0; // Reset spiral phase for new entry
    }
  }

  display() {
    push();
    translate(this.x, this.y, this.z);
    rotateZ(this.rot);
    
    // Calculate scale based on depth to enhance the receding effect
    // Z ranges from 500 to -1500. Map to a sensible visual scale.
    let depthScale = map(this.z, 500, -1500, 1.0, 0.1);
    scale(depthScale);

    // 1. Draw the "Photograph" 
    push();
    texture(img);
    // The image is clipped by the octagon logic of the frame
    // Since we can't easily clip in WEBGL without stencils, we draw a plane
    // that fits the size of the octagon.
    plane(this.size, this.size);
    pop();

    // 2. Draw the Octagonal Frame
    // We draw the octagon as a single shape to stay within budget
    noFill();
    stroke(220, 220, 240, 200);
    strokeWeight(this.size * 0.02); // Weight scales with size for consistency
    
    this.drawOctagon(this.size / 2);
    
    // 3. Inner highlight ring
    stroke(255, 255, 255, 100);
    strokeWeight(this.size * 0.005);
    this.drawOctagon(this.size / 2 - 5);

    pop();
  }

  drawOctagon(r) {
    beginShape(LINE_LOOP);
    for (let i = 0; i < 8; i++) {
      let theta = map(i, 0, 8, 0, TWO_PI);
      vertex(cos(theta) * r, sin(theta) * r, 0);
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
