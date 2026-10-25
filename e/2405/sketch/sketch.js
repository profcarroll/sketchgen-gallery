let rootSystems;
let tensionPoints = [];
let cursorPos;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pixelDensity(1);
  
  // Create root systems with different structures
  rootSystems = [];
  for (let i = 0; i < 8; i++) {
    let system = {
      centerX: random(width),
      centerY: random(height),
      branches: [],
      tension: []
    };
    
    // Create main trunk
    system.branches.push({
      x: system.centerX,
      y: system.centerY,
      length: random(100, 250),
      angle: PI/2 + random(-0.2, 0.2),
      depth: 0,
      width: random(2, 6)
    });
    
    // Generate branching structure
    generateBranches(system.branches[0], system, 0);
    
    rootSystems.push(system);
  }
  
  cursorPos = createVector(width/2, height/2);
}

function draw() {
  background(25, 15, 10);
  
  // Update tension points based on cursor
  updateTensionPoints();
  
  // Draw root systems
  for (let system of rootSystems) {
    drawRootSystem(system);
  }
  
  // Draw stress lines from cursor
  drawStressLines();
}

function generateBranches(parent, system, depth) {
  if (depth > 4 || random() < 0.3) return;
  
  let branchCount = floor(random(1, 4));
  for (let i = 0; i < branchCount; i++) {
    let angle = parent.angle + random(-0.8, 0.8);
    let length = parent.length * random(0.5, 0.8);
    let width = parent.width * random(0.6, 0.9);
    
    let newBranch = {
      x: parent.x + cos(parent.angle) * parent.length,
      y: parent.y + sin(parent.angle) * parent.length,
      length: length,
      angle: angle,
      depth: depth + 1,
      width: width
    };
    
    system.branches.push(newBranch);
    generateBranches(newBranch, system, depth + 1);
  }
}

function updateTensionPoints() {
  // Move cursor towards mouse with some lag
  if (mouseX !== undefined && mouseY !== undefined) {
    cursorPos.x = lerp(cursorPos.x, mouseX, 0.05);
    cursorPos.y = lerp(cursorPos.y, mouseY, 0.05);
  }
  
  // Find closest branches to cursor for tension points
  tensionPoints = [];
  let minDist = 100;
  
  for (let system of rootSystems) {
    for (let branch of system.branches) {
      let distance = dist(branch.x, branch.y, cursorPos.x, cursorPos.y);
      if (distance < minDist && random() > 0.7) {
        tensionPoints.push({
          x: branch.x,
          y: branch.y,
          intensity: map(distance, 0, minDist, 1, 0)
        });
      }
    }
  }
}

function drawRootSystem(system) {
  // Draw branches with subtle pulsing
  for (let branch of system.branches) {
    let pulse = sin(frameCount * 0.02 + branch.depth) * 0.2 + 0.8;
    
    stroke(180, 160, 140);
    strokeWeight(branch.width * pulse);
    noFill();
    
    let endX = branch.x + cos(branch.angle) * branch.length;
    let endY = branch.y + sin(branch.angle) * branch.length;
    
    line(branch.x, branch.y, endX, endY);
  }
  
  // Draw subtle glow at root points
  for (let branch of system.branches) {
    if (branch.depth === 0) {
      noStroke();
      fill(180, 160, 140, 30);
      ellipse(branch.x, branch.y, branch.width * 2);
    }
  }
}

function drawStressLines() {
  // Draw stress lines from tension points
  for (let point of tensionPoints) {
    let intensity = point.intensity;
    
    stroke(255, 255, 200, intensity * 100);
    strokeWeight(intensity * 0.5);
    
    beginShape();
    vertex(point.x, point.y);
    
    // Draw multiple stress lines in different directions
    for (let i = 0; i < 8; i++) {
      let angle = random(TWO_PI);
      let length = random(20, 100) * intensity;
      
      let endX = point.x + cos(angle) * length;
      let endY = point.y + sin(angle) * length;
      
      vertex(endX, endY);
    }
    
    endShape();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
