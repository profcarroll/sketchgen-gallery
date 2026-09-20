let structures = [];
let orbitingPoints = [];
let energyBursts = [];
let centralCube;
let audioContext;
let fft;

function setup() {
  createCanvas(800, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Setup central rotating cube
  centralCube = {
    size: 100,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0
  };
  
  // Create crystalline structures
  for (let i = 0; i < 20; i++) {
    structures.push({
      x: random(-300, 300),
      y: random(-300, 300),
      z: random(-300, 300),
      size: random(15, 40),
      rotationX: random(TWO_PI),
      rotationY: random(TWO_PI),
      rotationZ: random(TWO_PI),
      pulse: random(1),
      pulseSpeed: random(0.02, 0.05)
    });
  }
  
  // Create orbiting points
  for (let i = 0; i < 100; i++) {
    orbitingPoints.push({
      angle: random(TWO_PI),
      radius: random(200, 400),
      speed: random(0.005, 0.01),
      size: random(3, 8),
      hue: random(100, 150)
    });
  }
  
  // Setup audio
  fft = new p5.FFT();
  noLoop();
}

function draw() {
  background(0);
  
  // Update and draw central cube
  centralCube.rotationX += 0.005;
  centralCube.rotationY += 0.003;
  centralCube.rotationZ += 0.002;
  
  push();
  rotateX(centralCube.rotationX);
  rotateY(centralCube.rotationY);
  rotateZ(centralCube.rotationZ);
  
  // Draw central cube with emerald glow
  fill(60, 70, 30);
  stroke(50, 80, 20);
  strokeWeight(1);
  box(centralCube.size);
  
  pop();
  
  // Draw orbiting points
  for (let point of orbitingPoints) {
    point.angle += point.speed;
    
    let x = cos(point.angle) * point.radius;
    let y = sin(point.angle) * point.radius;
    let z = sin(point.angle * 0.5) * 100;
    
    push();
    translate(x, y, z);
    
    // Draw glowing point
    noStroke();
    fill(point.hue, 80, 90, 0.8);
    sphere(point.size);
    
    // Draw energy trail
    stroke(point.hue, 70, 100, 0.3);
    strokeWeight(2);
    line(0, 0, 0, x * 0.5, y * 0.5, z * 0.5);
    
    pop();
  }
  
  // Draw crystalline structures
  for (let struct of structures) {
    struct.pulse += struct.pulseSpeed;
    if (struct.pulse > TWO_PI) struct.pulse = 0;
    
    let pulseSize = sin(struct.pulse) * 5 + struct.size;
    
    push();
    translate(struct.x, struct.y, struct.z);
    rotateX(struct.rotationX);
    rotateY(struct.rotationY);
    rotateZ(struct.rotationZ);
    
    // Draw crystal structure with emerald green
    fill(100, 80, 25, 0.8);
    stroke(90, 90, 20);
    strokeWeight(1);
    
    // Simple crystal shape (tetrahedron)
    beginShape();
    vertex(0, -pulseSize/2, 0);
    vertex(pulseSize/2, pulseSize/2, 0);
    vertex(-pulseSize/2, pulseSize/2, 0);
    endShape(CLOSE);
    
    beginShape();
    vertex(0, -pulseSize/2, 0);
    vertex(0, pulseSize/2, pulseSize/2);
    vertex(0, pulseSize/2, -pulseSize/2);
    endShape(CLOSE);
    
    pop();
  }
  
  // Draw energy bursts
  for (let burst of energyBursts) {
    burst.life -= 5;
    if (burst.life <= 0) {
      energyBursts = energyBursts.filter(b => b !== burst);
    } else {
      let alpha = map(burst.life, 0, 100, 0, 1);
      
      push();
      translate(burst.x, burst.y, burst.z);
      noStroke();
      fill(200, 100, 100, alpha);
      sphere(burst.size);
      
      // Add glow effect
      fill(240, 100, 100, alpha * 0.5);
      sphere(burst.size * 1.5);
      
      pop();
    }
  }
  
  // Draw energy lines from central cube to structures
  stroke(200, 100, 100, 0.3);
  strokeWeight(0.5);
  
  beginShape(LINES);
  for (let struct of structures) {
    vertex(0, 0, 0);
    vertex(struct.x, struct.y, struct.z);
  }
  endShape();
}

function mousePressed() {
  if (!audioContext) {
    audioContext = getAudioContext();
    userStartAudio();
    loop();
  }
  
  // Trigger energy burst
  let x = random(-200, 200);
  let y = random(-200, 200);
  let z = random(-200, 200);
  
  energyBursts.push({
    x: x,
    y: y,
    z: z,
    size: random(10, 30),
    life: 100
  });
}
