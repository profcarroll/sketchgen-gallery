// 1970s mural with interlocking geometric shapes and a field of luminous arcs
// that vibrate slowly. Clicking restructures the composition while maintaining
// the arc field. Uses WEBGL renderer for depth and vibrant color effects.

let seed = 7;
let time = 0;

const PALETTE = [
  '#e8531f', '#f2a71b', '#1f8a8c', '#d8c39a',
  '#7a3b1d', '#c8102e', '#2e6b2e', '#efe6d0'
];

let arcs = [];
let shapes = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  frameRate(30);
  
  // Initialize static arc field
  initArcs();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  randomSeed(seed);
  initShapes();
  time = 0; // Reset animation for restructure effect
}

function draw() {
  background(0);
  time += 0.01;
  
  // Draw the luminous concentric arc field
  drawArcField();
  
  // Draw the interlocking geometric shapes
  drawShapes();
}

function initArcs() {
  arcs = [];
  const numArcs = 200;
  for (let i = 0; i < numArcs; i++) {
    arcs.push({
      radius: random(50, 300),
      angle: random(TWO_PI),
      speed: random(0.001, 0.005),
      opacity: random(20, 60),
      color: color(random([255, 200, 150]), random([255, 200, 150]), 255, 100)
    });
  }
}

function initShapes() {
  shapes = [];
  const numShapes = 100;
  for (let i = 0; i < numShapes; i++) {
    shapes.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      size: random(20, 100),
      rotation: random(TWO_PI),
      speed: random(0.01, 0.05),
      color: color(random([255, 200, 150]), random([255, 200, 150]), 255, 200)
    });
  }
}

function drawArcField() {
  push();
  for (let arc of arcs) {
    rotate(time * arc.speed);
    fill(arc.color);
    noStroke();
    ellipse(0, 0, arc.radius * 2, arc.radius * 2);
    
    // Draw the concentric effect
    stroke(arc.color);
    strokeWeight(1);
    noFill();
    ellipse(0, 0, arc.radius * 2 + 5, arc.radius * 2 + 5);
  }
  pop();
}

function drawShapes() {
  for (let i = 0; i < shapes.length; i++) {
    const shape = shapes[i];
    
    // Animate the shapes
    shape.rotation += shape.speed;
    
    push();
    translate(shape.x, shape.y);
    rotate(shape.rotation);
    
    fill(shape.color);
    stroke(255);
    strokeWeight(1);
    
    // Draw interlocking geometric patterns
    if (i % 3 === 0) {
      rect(0, 0, shape.size, shape.size);
    } else if (i % 3 === 1) {
      ellipse(0, 0, shape.size, shape.size);
    } else {
      triangle(-shape.size/2, shape.size/2, shape.size/2, shape.size/2, 0, -shape.size/2);
    }
    
    pop();
  }
}
