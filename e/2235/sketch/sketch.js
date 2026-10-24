let shells = [];
let energyBursts = [];
let isGlitching = false;
let glitchTimer = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create fossil shell structures
  for (let i = 0; i < 15; i++) {
    shells.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-300, -50),
      sizeX: random(80, 200),
      sizeY: random(80, 200),
      rotation: random(TWO_PI),
      segments: 16,
      pulse: random(TWO_PI),
      thickness: random(0.5, 2)
    });
  }

  // Create energy bursts
  for (let i = 0; i < 300; i++) {
    energyBursts.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-300, -50),
      size: random(1, 4),
      hue: random(360),
      speed: random(0.02, 0.08),
      pulse: random(TWO_PI),
      active: false
    });
  }
}

function draw() {
  background(20, 10, 5); // Dark slate background

  // Camera movement for subtle organic feel
  let time = millis() * 0.0003;
  camera(
    sin(time) * width/4,
    sin(time * 0.7) * height/6,
    cos(time) * width/4 + 500,
    0, 0, 0,
    0, 1, 0
  );

  // Draw fossil shells with chalk-like texture
  for (let shell of shells) {
    push();
    translate(shell.x, shell.y, shell.z);
    rotateY(shell.rotation);

    // Breathing motion
    let pulse = sin(shell.pulse) * 0.05 + 1;
    scale(pulse, pulse, 1);

    // Shell structure with planar geometry
    noStroke();
    fill(240, 30, 85); // Dark chalk color

    beginShape(QUADS);
    let segments = shell.segments;
    for (let i = 0; i < segments; i++) {
      let angle1 = map(i, 0, segments, 0, TWO_PI);
      let angle2 = map(i + 1, 0, segments, 0, TWO_PI);

      let x1 = cos(angle1) * shell.sizeX/2;
      let y1 = sin(angle1) * shell.sizeY/2;
      let x2 = cos(angle2) * shell.sizeX/2;
      let y2 = sin(angle2) * shell.sizeY/2;

      // Create planar structure
      vertex(x1, y1, 0);
      vertex(x2, y2, 0);
      vertex(x2, y2, shell.thickness);
      vertex(x1, y1, shell.thickness);
    }
    endShape();

    shell.pulse += 0.005;
    pop();
  }

  // Draw energy bursts
  for (let burst of energyBursts) {
    if (!burst.active) continue;

    push();
    translate(burst.x, burst.y, burst.z);

    // Pulsing and flowing motion
    let pulse = sin(burst.pulse) * 0.7 + 1;
    let size = burst.size * pulse;

    // Color based on hue
    fill(burst.hue, 100, 100);
    noStroke();

    // Draw energy burst as a glowing point with trail
    sphere(size);

    burst.pulse += burst.speed;
    pop();
  }

  // Slow pulse rhythm for the whole scene
  let rhythm = sin(millis() * 0.0005) * 0.1 + 0.9;
  ambientLight(255 * rhythm);
  pointLight(255, 255, 255, 0, 0, 500);

  // Random energy bursts
  if (frameCount % 60 === 0) {
    let index = floor(random(energyBursts.length));
    energyBursts[index].active = true;
    energyBursts[index].pulse = 0;
    energyBursts[index].hue = random(360);
  }

  // Deactivate bursts
  for (let i = energyBursts.length - 1; i >= 0; i--) {
    if (energyBursts[i].active && frameCount % 30 === 0) {
      energyBursts[i].active = false;
    }
  }

  // Trigger glitch on click
  if (isGlitching) {
    glitchTimer++;
    if (glitchTimer > 30) {
      isGlitching = false;
      glitchTimer = 0;
    }
  }
}

function mousePressed() {
  // Trigger a glitch effect
  isGlitching = true;

  // Scatter the shells into fragments
  for (let shell of shells) {
    shell.x += random(-50, 50);
    shell.y += random(-50, 50);
    shell.z += random(-50, 50);
  }

  // Activate many energy bursts at once
  for (let burst of energyBursts) {
    if (random() < 0.3) {
      burst.active = true;
      burst.pulse = 0;
      burst.hue = random(360);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
