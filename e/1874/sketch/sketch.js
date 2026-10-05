let pendulums = [];
const numPendulums = 12;
const pendulumLength = 150;
let time = 0;
let trails = [];
let axisSway = 0;
let swayDirection = 1;
let driftX = 0;
let driftSpeed = 0.001;
let phaseLock = false;
let phaseLockTimer = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);

  // Initialize pendulums with different phases and colors
  for (let i = 0; i < numPendulums; i++) {
    const angle = map(i, 0, numPendulums, 0, TWO_PI);
    const hue = map(i, 0, numPendulums, 0, 360);
    pendulums.push({
      angle: angle,
      phase: random(TWO_PI),
      length: pendulumLength,
      hue: hue,
      speed: random(0.5, 1.5),
      radius: 10
    });
  }

  // Initialize trails array
  for (let i = 0; i < numPendulums; i++) {
    trails.push([]);
  }
}

function draw() {
  background(0, 0, 0, 0.02); // Semi-transparent background for motion trails

  // Update sway of the axis
  axisSway += 0.002 * swayDirection;
  if (axisSway > 0.5 || axisSway < -0.5) {
    swayDirection *= -1;
  }

  // Update drift
  driftX += driftSpeed;
  
  // Center of the canvas
  const centerX = width / 2;
  const centerY = height / 2;

  // Update time
  time += 0.01;

  // Check for phase lock condition
  if (!phaseLock && random() < 0.005) {
    phaseLock = true;
    phaseLockTimer = 0;
  }

  // Handle phase locking
  if (phaseLock) {
    phaseLockTimer++;
    if (phaseLockTimer > 120) { // Lock for 2 seconds at 60fps
      phaseLock = false;
    }
  }

  // Update pendulums and check collisions
  for (let i = 0; i < pendulums.length; i++) {
    const p = pendulums[i];

    // Calculate oscillation with harmonic timing based on pentatonic scale
    let oscillation = sin(p.phase + time * p.speed) * 0.5 + 0.5;
    
    // Apply phase lock if active
    if (phaseLock) {
      const lockPhase = map(i, 0, pendulums.length - 1, 0, TWO_PI);
      oscillation = sin(lockPhase + time * 0.8) * 0.5 + 0.5;
    }

    const angle = p.angle + oscillation * 0.2;

    // Position of the pendulum disc
    const x = sin(angle) * p.length + driftX * 100 + centerX;
    const y = cos(angle) * p.length + axisSway * 100 + centerY;

    // Draw colored disc
    noStroke();
    fill(p.hue, 80, 90);
    ellipse(x, y, 20, 20);

    // Update trail
    trails[i].push({x: x, y: y});
    if (trails[i].length > 50) {
      trails[i].shift();
    }

    // Draw trail
    if (trails[i].length > 1) {
      noFill();
      stroke(p.hue, 80, 90, 0.5);
      beginShape();
      for (let j = 0; j < trails[i].length; j++) {
        const point = trails[i][j];
        vertex(point.x, point.y);
      }
      endShape();
    }
  }

  // Check collisions between pendulums
  for (let i = 0; i < pendulums.length; i++) {
    for (let j = i + 1; j < pendulums.length; j++) {
      const p1 = pendulums[i];
      const p2 = pendulums[j];
      
      // Calculate distance between pendulum discs
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const distance = sqrt(dx * dx + dy * dy);
      
      // Check for collision
      if (distance < p1.radius + p2.radius) {
        // Simple elastic collision response
        const angle = atan2(dy, dx);
        const targetX = p1.x + cos(angle) * (p1.radius + p2.radius);
        const targetY = p1.y + sin(angle) * (p1.radius + p2.radius);
        
        const ax = (targetX - p2.x) * 0.05;
        const ay = (targetY - p2.y) * 0.05;
        
        p1.x -= ax;
        p1.y -= ay;
        p2.x += ax;
        p2.y += ay;
      }
    }
  }

  // Update pendulum positions for next frame
  for (let i = 0; i < pendulums.length; i++) {
    const p = pendulums[i];
    
    // Calculate oscillation with harmonic timing based on pentatonic scale
    let oscillation = sin(p.phase + time * p.speed) * 0.5 + 0.5;
    
    // Apply phase lock if active
    if (phaseLock) {
      const lockPhase = map(i, 0, pendulums.length - 1, 0, TWO_PI);
      oscillation = sin(lockPhase + time * 0.8) * 0.5 + 0.5;
    }

    const angle = p.angle + oscillation * 0.2;

    // Position of the pendulum disc
    p.x = sin(angle) * p.length + driftX * 100 + width / 2;
    p.y = cos(angle) * p.length + axisSway * 100 + height / 2;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
