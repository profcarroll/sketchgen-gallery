let panels = [];
let joints = [];
let surfaceDetails = [];

function setup() {
  createCanvas(800, 600);
  colorMode(RGB);

  // Create a complex mechanical structure with panels and joints
  for (let i = 0; i < 12; i++) {
    let x = random(100, width - 100);
    let y = random(100, height - 100);
    let w = random(80, 150);
    let h = random(60, 120);
    panels.push({ x, y, w, h });
  }

  // Add panel joints
  for (let i = 0; i < 20; i++) {
    let x = random(50, width - 50);
    let y = random(50, height - 50);
    joints.push({ x, y });
  }

  // Add surface details like scratches and patinas
  for (let i = 0; i < 1000; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(0.5, 3);
    let opacity = random(30, 100);
    surfaceDetails.push({ x, y, size, opacity });
  }

  noLoop();
}

function draw() {
  background(40, 40, 45); // Deep steel tone base

  // Draw panels with aged metallic gradients
  for (let panel of panels) {
    let gradient = drawingContext.createLinearGradient(
      panel.x, panel.y, panel.x + panel.w, panel.y + panel.h
    );
    gradient.addColorStop(0, color(100, 60, 30)); // Oxidized brown
    gradient.addColorStop(0.5, color(80, 50, 20));
    gradient.addColorStop(1, color(60, 40, 10)); // Tarnished green

    drawingContext.fillStyle = gradient;
    rect(panel.x, panel.y, panel.w, panel.h);

    // Panel seams
    stroke(30, 30, 35);
    strokeWeight(2);
    line(panel.x, panel.y, panel.x + panel.w, panel.y);
    line(panel.x, panel.y, panel.x, panel.y + panel.h);
    line(panel.x + panel.w, panel.y, panel.x + panel.w, panel.y + panel.h);
    line(panel.x, panel.y + panel.h, panel.x + panel.w, panel.y + panel.h);

    // Panel joints
    noStroke();
    fill(40, 40, 45);
    rect(panel.x + 10, panel.y + 10, 20, 20);
    rect(panel.x + panel.w - 30, panel.y + 10, 20, 20);
    rect(panel.x + 10, panel.y + panel.h - 30, 20, 20);
    rect(panel.x + panel.w - 30, panel.y + panel.h - 30, 22, 22);
  }

  // Draw joints
  for (let joint of joints) {
    noStroke();
    fill(120, 100, 80);
    ellipse(joint.x, joint.y, 15, 15);
    fill(100, 90, 70);
    ellipse(joint.x, joint.y, 8, 8);
  }

  // Draw surface details
  noStroke();
  for (let detail of surfaceDetails) {
    fill(30, 30, 35, detail.opacity);
    ellipse(detail.x, detail.y, detail.size, detail.size);
  }

  // Add some micro-fractures spiderwebbing across the metal
  stroke(20, 20, 25);
  strokeWeight(1);
  for (let i = 0; i < 300; i++) {
    let x1 = random(width);
    let y1 = random(height);
    let x2 = x1 + random(-20, 20);
    let y2 = y1 + random(-20, 20);
    line(x1, y1, x2, y2);
  }

  // Add a subtle patina effect
  blendMode(DIFFERENCE);
  noStroke();
  fill(255, 255, 255, 5);
  rect(0, 0, width, height);
  blendMode(BLEND);
}
