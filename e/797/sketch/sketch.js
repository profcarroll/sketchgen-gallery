let marbles = [];
let trails = [];
let pulseEffects = [];
let lanes = [];
let numLanes = 5;
let trackRadius = 200;
let laneWidth = 30;
let marbleRadius = 8;
let trailLength = 20;
let pulseDuration = 30;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create lanes
  for (let i = 0; i < numLanes; i++) {
    lanes.push({
      radius: trackRadius - i * laneWidth,
      angleOffset: i * 0.2
    });
  }
  
  // Initialize marbles
  for (let i = 0; i < 8; i++) {
    marbles.push({
      id: i,
      lane: i % numLanes,
      angle: random(TWO_PI),
      speed: random(0.01, 0.03),
      trail: [],
      color: color(random(360), 80, 90, 0.8)
    });
  }
}

function draw() {
  background(0);
  
  // Ambient lighting
  ambientLight(20);
  pointLight(255, 255, 255, 0, -300, 300);
  
  // Draw track surface
  drawTrackSurface();
  
  // Update and draw marbles
  for (let marble of marbles) {
    updateMarble(marble);
    drawMarble(marble);
  }
  
  // Update and draw pulse effects
  updatePulseEffects();
  drawPulseEffects();
}

function drawTrackSurface() {
  noStroke();
  fill(20, 10, 20, 0.8);
  
  beginShape(QUADS);
  for (let i = 0; i < 64; i++) {
    let angle1 = map(i, 0, 64, 0, TWO_PI);
    let angle2 = map(i + 1, 0, 64, 0, TWO_PI);
    
    // Outer ring
    let x1 = cos(angle1) * (trackRadius + laneWidth * numLanes);
    let y1 = sin(angle1) * (trackRadius + laneWidth * numLanes);
    let x2 = cos(angle2) * (trackRadius + laneWidth * numLanes);
    let y2 = sin(angle2) * (trackRadius + laneWidth * numLanes);
    
    // Inner ring
    let x3 = cos(angle2) * trackRadius;
    let y3 = sin(angle2) * trackRadius;
    let x4 = cos(angle1) * trackRadius;
    let y4 = sin(angle1) * trackRadius;
    
    vertex(x1, y1, 0);
    vertex(x2, y2, 0);
    vertex(x3, y3, 0);
    vertex(x4, y4, 0);
  }
  endShape(CLOSE);
}

function updateMarble(marble) {
  // Update position
  marble.angle += marble.speed;
  
  let lane = lanes[marble.lane];
  let x = cos(marble.angle + lane.angleOffset) * lane.radius;
  let y = sin(marble.angle + lane.angleOffset) * lane.radius;
  
  // Add to trail
  marble.trail.push({x, y, time: frameCount});
  
  // Remove old trail points
  if (marble.trail.length > trailLength) {
    marble.trail.shift();
  }
  
  // Occasionally create a pulse effect at current position
  if (frameCount % 15 === 0) {
    pulseEffects.push({
      x,
      y,
      time: frameCount,
      color: marble.color
    });
  }
}

function drawMarble(marble) {
  let lane = lanes[marble.lane];
  let x = cos(marble.angle + lane.angleOffset) * lane.radius;
  let y = sin(marble.angle + lane.angleOffset) * lane.radius;
  
  // Draw trail
  noFill();
  strokeWeight(2);
  beginShape();
  for (let i = 0; i < marble.trail.length; i++) {
    let point = marble.trail[i];
    let alpha = map(point.time, frameCount - trailLength, frameCount, 0, 0.8);
    stroke(hue(marble.color), saturation(marble.color), brightness(marble.color), alpha);
    vertex(point.x, point.y, 0);
  }
  endShape();
  
  // Draw marble
  push();
  translate(x, y, 0);
  noStroke();
  fill(marble.color);
  sphere(marbleRadius);
  pop();
}

function updatePulseEffects() {
  for (let i = pulseEffects.length - 1; i >= 0; i--) {
    let effect = pulseEffects[i];
    if (frameCount - effect.time > pulseDuration) {
      pulseEffects.splice(i, 1);
    }
  }
}

function drawPulseEffects() {
  for (let effect of pulseEffects) {
    let alpha = map(frameCount - effect.time, 0, pulseDuration, 0.8, 0);
    let size = map(frameCount - effect.time, 0, pulseDuration, 20, 50);
    
    noFill();
    stroke(hue(effect.color), saturation(effect.color), brightness(effect.color), alpha);
    strokeWeight(2);
    ellipse(effect.x, effect.y, size, size);
  }
}

function mousePressed() {
  // Reset all marbles to random positions
  for (let marble of marbles) {
    marble.angle = random(TWO_PI);
    marble.trail = [];
  }
  
  // Clear pulse effects
  pulseEffects = [];
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
