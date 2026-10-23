// A detailed Victorian-era machine blueprint rendered on aged corrugated cardboard.
// Initially static, it responds to a user click by activating mechanical components,
// revealing micro-mechanics through controlled cyclical motion.

let seed = 1;
let gears = [];
const GEAR_COUNT = 150;
const ANNOTATION_COUNT = 80;
let isActivated = false;
let activationTime = 0;
let annotations = [];
let structureLines = [];
let crossHatchLines = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  randomSeed(seed);
  generateGears();
  generateAnnotations();
  generateStructureLines();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(245, 240, 230); // Sepia paper background
  const time = millis() * 0.001;
  
  push();
  translate(width/2, height/2);
  
  // Draw the main mechanical structure
  drawStructure(time);
  
  // Draw annotations only when activated
  if (isActivated) {
    drawAnnotations(time);
  }
  
  pop();
}

function generateGears() {
  gears = [];
  const centerX = 0;
  const centerY = 0;
  const maxRadius = min(width, height) * 0.4;

  for (let i = 0; i < GEAR_COUNT; i++) {
    const angle = random(TWO_PI);
    const r = random(maxRadius * 0.2, maxRadius);
    
    const x = r * cos(angle);
    const y = r * sin(angle);
    
    const size = random(5, 15);
    const teeth = floor(random(8, 20));
    
    // Use a sepia color scheme
    const gearColor = color(
      random(100, 160),
      random(80, 140),
      random(40, 100),
      180
    );
    
    gears.push({
      x: x,
      y: y,
      size: size,
      teeth: teeth,
      angle: angle,
      color: gearColor,
      speed: random(-0.01, 0.01)
    });
  }
}

function generateAnnotations() {
  annotations = [];
  const maxRadius = min(width, height) * 0.4;

  for (let i = 0; i < ANNOTATION_COUNT; i++) {
    const angle = random(TWO_PI);
    const r = random(maxRadius * 0.3, maxRadius * 0.8);
    
    const x = r * cos(angle);
    const y = r * sin(angle);
    
    // Random annotation text
    const texts = ['Gear A', 'Shaft B', 'Bolt C', 'Spring D', 'Fillet E'];
    const label = random(texts);
    
    annotations.push({
      x: x,
      y: y,
      text: label,
      size: random(8, 14),
      opacity: random(100, 200)
    });
  }
}

function generateStructureLines() {
  structureLines = [];
  crossHatchLines = [];
  const maxRadius = min(width, height) * 0.4;
  
  // Create a grid of lines for cross-hatching
  const gridSize = 30;
  const cols = ceil(maxRadius / gridSize);
  const rows = ceil(maxRadius / gridSize);
  
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x1 = (i - cols/2) * gridSize;
      const y1 = (j - rows/2) * gridSize;
      const x2 = x1 + random(15, 30);
      const y2 = y1 + random(15, 30);
      
      // Only draw lines that are within the main structure
      if (dist(0, 0, x1, y1) < maxRadius && dist(0, 0, x2, y2) < maxRadius) {
        structureLines.push({
          x1: x1,
          y1: y1,
          x2: x2,
          y2: y2
        });
      }
    }
  }
  
  // Generate cross-hatching lines for a blueprint effect
  const hatchCount = 150;
  for (let i = 0; i < hatchCount; i++) {
    const angle = random(TWO_PI);
    const r = random(maxRadius * 0.2, maxRadius);
    const length = random(20, 60);
    
    const x1 = r * cos(angle);
    const y1 = r * sin(angle);
    const x2 = x1 + length * cos(angle);
    const y2 = y1 + length * sin(angle);
    
    crossHatchLines.push({
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2
    });
  }
}

function drawStructure(time) {
  // Draw gears with activation motion
  for (let i = 0; i < gears.length; i++) {
    const gear = gears[i];
    
    fill(gear.color);
    push();
    translate(gear.x, gear.y);
    
    // Add activation rotation effect
    let rotSpeed = gear.speed;
    if (isActivated) {
      rotSpeed += sin(time * 0.5 + i) * 0.02;
    }
    rotate(time * rotSpeed + gear.angle);
    
    // Draw gear teeth using batched triangles
    beginShape();
    for (let j = 0; j < gear.teeth; j++) {
      const toothAngle = TWO_PI / gear.teeth * j;
      const toothX = gear.size * cos(toothAngle);
      const toothY = gear.size * sin(toothAngle);
      
      // Draw a small triangle for each tooth
      vertex(0, 0);
      vertex(toothX + 3 * cos(toothAngle), toothY + 3 * sin(toothAngle));
      vertex(toothX + 1.5 * cos(toothAngle + PI/2), toothY + 1.5 * sin(toothAngle + PI/2));
    }
    endShape(CLOSE);
    
    // Draw central circle
    ellipse(0, 0, gear.size * 0.8, gear.size * 0.8);
    pop();
  }
  
  // Draw cross-hatching lines for a blueprint effect
  stroke(150, 140, 120, 100);
  strokeWeight(0.5);
  
  beginShape(LINES);
  for (let i = 0; i < crossHatchLines.length; i++) {
    const lineData = crossHatchLines[i];
    vertex(lineData.x1, lineData.y1, 0);
    vertex(lineData.x2, lineData.y2, 0);
  }
  endShape();
  
  // Draw main structural elements
  stroke(130, 120, 100, 150);
  strokeWeight(1.5);
  noFill();
  
  // Draw circular frame
  ellipse(0, 0, max(width, height) * 0.8, max(width, height) * 0.8);
  
  // Draw central cross structure
  line(-max(width, height) * 0.2, 0, max(width, height) * 0.2, 0);
  line(0, -max(width, height) * 0.2, 0, max(width, height) * 0.2);
}

function drawAnnotations(time) {
  // Draw annotations with activation effect
  for (let i = 0; i < annotations.length; i++) {
    const ann = annotations[i];
    
    fill(100, 90, 70, ann.opacity);
    noStroke();
    
    push();
    translate(ann.x, ann.y);
    
    // Draw annotation box
    rectMode(CENTER);
    rect(0, 0, ann.size * 3, ann.size * 1.5, 3);
    
    fill(245, 240, 230);
    textSize(ann.size);
    textAlign(CENTER, CENTER);
    text(ann.text, 0, 0);
    
    pop();
  }
}

function mousePressed() {
  if (!isActivated) {
    isActivated = true;
    activationTime = millis();
  }
}
