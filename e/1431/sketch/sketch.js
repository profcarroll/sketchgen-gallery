let marbles = [];
let track;
let finishLine;
let timer = 30;
let gameActive = true;
let trails = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  // Initialize track
  track = generateTrack();
  finishLine = { x: 0, z: -250, width: 100, height: 20 };
  
  // Create marbles
  for (let i = 0; i < 3; i++) {
    marbles.push({
      x: -150 + i * 100,
      y: 0,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
      radius: 8,
      color: color(255, 0, 0 + i * 80),
      trail: []
    });
  }
  
  // Setup timer
  timer = 30;
}

function draw() {
  background(0);
  ambientLight(60);
  pointLight(255, 255, 255, 0, -100, 0);
  
  // Update and draw track
  drawTrack();
  
  // Draw finish line
  push();
  translate(0, 0, -250);
  fill(255, 255, 0);
  plane(finishLine.width, finishLine.height);
  pop();
  
  // Draw marbles and trails
  for (let i = 0; i < marbles.length; i++) {
    let marble = marbles[i];
    
    if (gameActive) {
      updateMarble(marble);
    }
    
    // Draw trail
    drawTrail(marble);
    
    // Draw marble
    push();
    translate(marble.x, marble.y, marble.z);
    fill(marble.color);
    noStroke();
    sphere(marble.radius, 6, 4); // Lower detail for performance
    pop();
    
    // Check win condition
    if (marble.z < -240 && gameActive) {
      gameActive = false;
      timer = 0;
    }
  }
  
  // Draw timer
  drawTimer();
}

function updateMarble(marble) {
  // Apply gravity
  marble.vy += 0.1;
  
  // Update position
  marble.x += marble.vx;
  marble.y += marble.vy;
  marble.z += marble.vz;
  
  // Simple track boundaries
  if (marble.x > 150 || marble.x < -150) {
    marble.vx *= -0.5;
  }
  
  // Update trail
  marble.trail.push({ x: marble.x, y: marble.y, z: marble.z });
  if (marble.trail.length > 20) {
    marble.trail.shift();
  }
}

function drawTrail(marble) {
  if (marble.trail.length < 2) return;
  
  beginShape(LINES);
  noFill();
  for (let i = 0; i < marble.trail.length - 1; i++) {
    let alpha = map(i, 0, marble.trail.length - 1, 0, 255);
    stroke(red(marble.color), green(marble.color), blue(marble.color), alpha);
    vertex(marble.trail[i].x, marble.trail[i].y, marble.trail[i].z);
    vertex(marble.trail[i + 1].x, marble.trail[i + 1].y, marble.trail[i + 1].z);
  }
  endShape();
}

function drawTrack() {
  // Draw track lanes
  for (let i = -150; i <= 150; i += 100) {
    push();
    translate(i, 0, 0);
    fill(200);
    plane(30, 500);
    pop();
  }
  
  // Draw track borders
  push();
  translate(0, 0, -250);
  fill(100);
  plane(400, 500);
  pop();
}

function drawTimer() {
  if (gameActive) {
    timer -= 0.016; // Approximate frame rate
    if (timer <= 0) {
      timer = 0;
      gameActive = false;
    }
  }
  
  textSize(32);
  fill(255);
  textAlign(CENTER);
  text(`Time: ${nf(timer, 1, 2)}`, 0, -height/2 + 40);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function generateTrack() {
  // Simple track generation
  let lanes = [];
  for (let i = -150; i <= 150; i += 100) {
    lanes.push({ x: i });
  }
  return lanes;
}
