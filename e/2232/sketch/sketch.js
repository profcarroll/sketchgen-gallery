let layers = [];
let time = 0;
let clockworkMechanism;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Create a folded origami-inspired clockwork mechanism
  clockworkMechanism = createClockworkStructure();
  
  // Create layered rock strata with warm earth tones
  for (let i = 0; i < 25; i++) {
    const z = -i * 180 - 600;
    const height = random(250, 450);
    const width = random(900, 1300);
    const depth = random(60, 180);
    
    // Warm, earthy colors for rock layers
    const r = random(110, 170);
    const g = random(70, 110);
    const b = random(40, 80);
    
    layers.push({
      x: random(-600, 600),
      y: random(-300, 300),
      z,
      width,
      height,
      depth,
      color: [r, g, b],
      tilt: random(-0.4, 0.4),
      foldPhase: random(PI * 2)
    });
  }
}

function draw() {
  background(15, 20, 30);
  
  // Slowly drift through the cavern
  time += 0.002;
  
  // Set up camera with slow, organic movement
  const camX = sin(time * 0.2) * 400;
  const camY = cos(time * 0.15) * 200;
  const camZ = -time * 80;
  
  const targetX = camX + sin(time * 0.08) * 150;
  const targetY = camY + cos(time * 0.12) * 150;
  const targetZ = camZ - 1800;
  
  perspective(PI / 3, width / height, 1, 5000);
  camera(camX, camY, camZ, targetX, targetY, targetZ, 0, 1, 0);
  
  // Draw the clockwork mechanism
  push();
  translate(0, 0, -1000);
  rotateY(time * 0.05);
  drawClockworkMechanism();
  pop();
  
  // Draw each rock layer
  for (let i = 0; i < layers.length; i++) {
    const l = layers[i];
    
    push();
    translate(l.x, l.y, l.z);
    rotateX(l.tilt + sin(time * 0.5 + l.foldPhase) * 0.2);
    
    // Layered rock with subtle bioluminescent glow
    fill(l.color[0], l.color[1], l.color[2]);
    box(l.width, l.height, l.depth);
    
    // Add some bioluminescent highlights
    const highlight = color(40, 220, 255, 100);
    fill(highlight);
    for (let j = 0; j < 2; j++) {
      const hX = random(-l.width/2 + 15, l.width/2 - 15);
      const hY = random(-l.height/2 + 15, l.height/2 - 15);
      const hSize = random(8, 35);
      
      push();
      translate(hX, hY, l.depth/2 - 3);
      sphere(hSize);
      pop();
    }
    
    pop();
  }
  
  // Add some pulsing bioluminescent pockets in the cavern walls
  for (let i = 0; i < 15; i++) {
    const x = random(-1200, 1200);
    const y = random(-600, 600);
    const z = -time * 80 - random(1200, 3500);
    const size = random(25, 90);
    const pulse = sin(time * 2.5 + i) * 15;
    
    push();
    translate(x, y, z);
    noStroke();
    fill(0, 240, 255, 120);
    sphere(size + pulse);
    pop();
  }
}

function createClockworkStructure() {
  const mechanism = [];
  const numGears = 8;
  
  for (let i = 0; i < numGears; i++) {
    const radius = 150 + i * 30;
    const angle = (i / numGears) * TWO_PI;
    mechanism.push({
      x: cos(angle) * radius,
      y: sin(angle) * radius,
      z: 0,
      size: 20 + i * 5,
      rotation: i * 0.5,
      speed: 0.01 + (i * 0.005)
    });
  }
  
  return mechanism;
}

function drawClockworkMechanism() {
  // Draw the main frame
  fill(60, 50, 40);
  box(300, 300, 20);
  
  // Draw gears
  for (let i = 0; i < clockworkMechanism.length; i++) {
    const gear = clockworkMechanism[i];
    
    push();
    translate(gear.x, gear.y, gear.z);
    rotateZ(time * gear.speed + gear.rotation);
    
    // Gear body
    fill(70, 60, 50);
    cylinder(gear.size, 10);
    
    // Gear teeth
    noFill();
    stroke(180, 170, 160);
    strokeWeight(2);
    for (let j = 0; j < 12; j++) {
      const toothAngle = (j / 12) * TWO_PI;
      const toothX = cos(toothAngle) * gear.size;
      const toothY = sin(toothAngle) * gear.size;
      
      line(0, 0, toothX, toothY);
    }
    
    pop();
  }
  
  // Draw connecting rods
  fill(80, 70, 60);
  for (let i = 0; i < clockworkMechanism.length; i++) {
    const a = clockworkMechanism[i];
    const b = clockworkMechanism[(i + 1) % clockworkMechanism.length];
    
    push();
    translate(a.x, a.y, a.z);
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const length = sqrt(dx * dx + dy * dy);
    const angle = atan2(dy, dx);
    
    rotateZ(angle);
    rect(0, -5, length, 10);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
