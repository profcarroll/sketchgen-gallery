let time = 0;
let flora = [];
let rippleCount = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Create bioluminescent flora
  for (let i = 0; i < 20; i++) {
    flora.push({
      x: random(-width/2, width/2),
      y: 0,
      z: random(-500, 500),
      size: random(20, 60),
      color: [random(100, 255), random(50, 150), random(200, 255)],
      pulseSpeed: random(0.02, 0.05),
      pulsePhase: random(TWO_PI)
    });
  }
}

function draw() {
  background(0);
  
  // Time progression
  time += 0.01;
  
  // Dynamic lighting based on time
  const lightIntensity = map(sin(time * 0.3), -1, 1, 0.5, 1);
  const skyColor = [
    map(sin(time * 0.2), -1, 1, 20, 80),
    map(sin(time * 0.2 + PI/3), -1, 1, 10, 40),
    map(sin(time * 0.2 + PI/2), -1, 1, 60, 120)
  ];
  
  // Sky gradient
  for (let i = 0; i < height; i++) {
    const t = map(i, 0, height, 0, 1);
    const r = lerp(0, skyColor[0], t);
    const g = lerp(0, skyColor[1], t);
    const b = lerp(0, skyColor[2], t);
    stroke(r, g, b);
    line(-width/2, i - height/2, width/2, i - height/2);
  }
  
  // City buildings with reflective surfaces
  push();
  translate(0, 0, -300);
  for (let i = 0; i < 15; i++) {
    const x = map(i, 0, 14, -width/2, width/2);
    const heightBuilding = random(100, 300);
    const buildingColor = [
      map(sin(time + i), -1, 1, 30, 80),
      map(cos(time + i * 0.7), -1, 1, 40, 90),
      map(sin(time * 0.5 + i * 0.3), -1, 1, 60, 120)
    ];
    
    push();
    translate(x, heightBuilding/2, 0);
    fill(buildingColor[0], buildingColor[1], buildingColor[2]);
    
    // Wet reflective surface effect
    const reflect = 0.8 + sin(time * 0.5 + i) * 0.2;
    specularMaterial(255 * reflect, 255 * reflect, 255 * reflect);
    
    box(60, heightBuilding, 40);
    
    // Add ripples to building surface
    if (rippleCount > 0 && random() < 0.3) {
      const ripple = new Ripple(x, heightBuilding/2, 0, time + i);
      ripple.display();
    }
    
    pop();
  }
  pop();
  
  // Bioluminescent flora
  for (let f of flora) {
    const pulse = sin(time * f.pulseSpeed + f.pulsePhase) * 0.5 + 0.5;
    const size = f.size * pulse;
    
    push();
    translate(f.x, f.y, f.z);
    
    // Create pulsing glow effect
    fill(f.color[0], f.color[1], f.color[2], 150);
    noStroke();
    sphere(size);
    
    pop();
  }
  
  // Generate ripples periodically
  if (frameCount % 30 === 0) {
    rippleCount = random(1, 4);
  }
  
  if (rippleCount > 0) {
    rippleCount--;
  }
}

class Ripple {
  constructor(x, y, z, phase) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.phase = phase;
    this.maxRadius = random(50, 150);
    this.alpha = 200;
  }
  
  display() {
    const timeOffset = this.phase * 2;
    const radius = this.maxRadius * (1 - sin(timeOffset) * 0.5);
    
    push();
    translate(this.x, this.y, this.z);
    
    // Create ripple effect using sphere with transparency
    fill(255, 255, 255, this.alpha * (1 - sin(timeOffset)));
    noStroke();
    
    sphere(radius);
    
    pop();
  }
}
