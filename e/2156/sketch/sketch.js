let branches = [];
let maxDepth = 6;
let branchCount = 200;
let flowStrength = 0.02;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create initial branches
  for (let i = 0; i < branchCount; i++) {
    let startAngle = random(TWO_PI);
    let startX = width/2 + cos(startAngle) * 50;
    let startY = height/2 + sin(startAngle) * 50;
    
    branches.push({
      x: startX,
      y: startY,
      angle: startAngle,
      depth: 0,
      length: random(30, 80),
      hue: random(360),
      children: []
    });
  }
}

function draw() {
  background(220, 10, 95); // Soft blue background
  
  // Update and draw branches
  for (let i = 0; i < branches.length; i++) {
    updateBranch(branches[i]);
  }
  
  // Add new branches occasionally
  if (random() < 0.02 && branches.length < 500) {
    let parent = random(branches);
    if (parent.depth < maxDepth) {
      createChildBranch(parent);
    }
  }
}

function updateBranch(branch) {
  // Move branch
  branch.x += cos(branch.angle) * flowStrength * 10;
  branch.y += sin(branch.angle) * flowStrength * 10;
  
  // Randomly change direction (mimic fluid flow)
  branch.angle += random(-0.2, 0.2);
  
  // Draw the branch
  stroke(branch.hue, 70, 80, 0.7);
  strokeWeight(1 + branch.depth * 0.3);
  noFill();
  
  if (branch.children.length > 0) {
    for (let child of branch.children) {
      line(branch.x, branch.y, child.x, child.y);
    }
  } else {
    // Draw main branch
    let endX = branch.x + cos(branch.angle) * branch.length;
    let endY = branch.y + sin(branch.angle) * branch.length;
    line(branch.x, branch.y, endX, endY);
    
    // Occasionally create child branches
    if (branch.depth < maxDepth && random() < 0.1) {
      createChildBranch(branch);
    }
  }
  
  // Remove branches that are off screen or too deep
  if ((branch.x < -50 || branch.x > width + 50 || 
       branch.y < -50 || branch.y > height + 50) ||
      branch.depth > maxDepth) {
    // Remove from array (this is a simplified version)
    // In reality, we'd want to handle this more carefully
  }
}

function createChildBranch(parent) {
  let child = {
    x: parent.x,
    y: parent.y,
    angle: parent.angle + random(-0.5, 0.5),
    depth: parent.depth + 1,
    length: parent.length * 0.7,
    hue: (parent.hue + random(-30, 30)) % 360,
    children: []
  };
  
  parent.children.push(child);
  branches.push(child);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
