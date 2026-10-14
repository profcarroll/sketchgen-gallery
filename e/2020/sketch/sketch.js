// A hyper-detailed, antique-style diagram of a pitcher plant's trapping mechanism.
// Rendered with the meticulous precision of a Victorian botanical illustration,
// the central image is a magnified cross-section revealing millions of microscopic,
// hair-like structures. These hairs coat the interior, appearing both delicate and adhesive.
// The visualization shifts and pulsates subtly with organic motion, but the viewer's
// interaction is purely observational — they study the controlled, engineered mechanics
// of the natural trap, as if examining a scientific curiosity under an early microscope.

let seed = 1;
let hairs = [];
const HAIR_COUNT = 1500; // Reduced for performance
const PULSATION_SPEED = 0.003;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  randomSeed(seed);
  generateHairs();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(240); // Light beige background like old paper
  const time = millis() * PULSATION_SPEED;
  
  push();
  translate(width/2, height/2);
  
  // Draw a subtle gradient background for the cross-section
  drawCrossSectionBackground(time);
  
  // Draw the hairs with organic pulsation
  for (let i = 0; i < hairs.length; i++) {
    const hair = hairs[i];
    const pulse = sin(time + i * 0.01) * 0.15 + 1;
    
    fill(hair.hairColor);
    noStroke();
    push();
    translate(hair.x, hair.y);
    rotate(hair.angle);
    scale(pulse);
    // Draw each hair as a small triangle
    beginShape();
    vertex(0, 0);
    vertex(-hair.width * 0.5, -hair.length);
    vertex(hair.width * 0.5, -hair.length);
    endShape(CLOSE);
    pop();
  }
  
  pop();
}

function generateHairs() {
  // Create hair-like structures that fill the cross-section
  hairs = [];
  const centerX = 0;
  const centerY = 0;
  const radius = min(width, height) * 0.35;
  
  for (let i = 0; i < HAIR_COUNT; i++) {
    // Distribute hairs radially around the center
    const angle = random(TWO_PI);
    const r = random(radius * 0.1, radius);
    
    // Position in polar coordinates
    const x = r * cos(angle);
    const y = r * sin(angle);
    
    // Angle of hair (slightly tilted from radial)
    const hairAngle = angle + random(-0.2, 0.2);
    
    // Hair properties
    const length = random(3, 15);
    const width = random(0.5, 3);
    
    // Color similar to vintage botanical illustrations (brownish tones)
    const hairColor = color(
      random(80, 140),
      random(50, 100),
      random(20, 60),
      150
    );
    
    hairs.push({
      x: x,
      y: y,
      angle: hairAngle,
      length: length,
      width: width,
      hairColor: hairColor
    });
  }
}

function drawCrossSectionBackground(time) {
  // Draw a semi-transparent layer for the cross-section area
  noStroke();
  fill(250, 245, 240, 100);
  ellipse(0, 0, min(width, height) * 0.7, min(width, height) * 0.7);
  
  // Add subtle texture lines for a paper-like effect
  stroke(220, 215, 210, 30);
  strokeWeight(0.5);
  for (let i = 0; i < 50; i++) {
    const angle = random(TWO_PI);
    const r = random(0, min(width, height) * 0.35);
    const x1 = r * cos(angle);
    const y1 = r * sin(angle);
    const x2 = (r + random(10, 50)) * cos(angle);
    const y2 = (r + random(10, 50)) * sin(angle);
    line(x1, y1, x2, y2);
  }
}
