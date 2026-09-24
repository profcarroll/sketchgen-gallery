let layers = [];
let cameraZ = 0;
let targetZ = 0;
let t = 0;
let coreParticles = [];
let rotation = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Create geological layers with different properties
  for (let i = 0; i < 50; i++) {
    const radius = map(i, 0, 49, 200, 50);
    const hue = map(i, 0, 49, 240, 0); // Blue to red
    layers.push({
      radius: radius,
      hue: hue,
      saturation: 70,
      brightness: map(i, 0, 49, 30, 90),
      speed: random(0.001, 0.005)
    });
  }
  
  // Initialize core particles
  for (let i = 0; i < 200; i++) {
    coreParticles.push({
      angle: random(TWO_PI),
      radius: random(30, 40),
      speed: random(0.01, 0.03),
      size: random(1, 3)
    });
  }
  
  // Start camera at outer crust
  cameraZ = 300;
  targetZ = -300;
}

function draw() {
  background(0);
  
  // Animate camera descent
  t += 0.002;
  cameraZ = lerp(cameraZ, targetZ, 0.01);
  
  // Add subtle rotation for dynamic view
  rotation += 0.001;
  
  // Set up camera
  camera(0, 0, cameraZ, 0, 0, 0, 0, 1, 0);
  
  // Rotate the entire scene slightly for dynamic effect
  rotateY(rotation);
  
  // Draw layers as a single mesh with dynamic coloring
  beginShape(QUADS);
  for (let i = 0; i < layers.length - 1; i++) {
    const layer = layers[i];
    const nextLayer = layers[i + 1];
    
    // Use lower detail for performance
    const detail = 12;
    for (let j = 0; j < detail; j++) {
      const angle = map(j, 0, detail - 1, 0, TWO_PI);
      
      // Current layer points
      const x1 = cos(angle) * layer.radius;
      const z1 = sin(angle) * layer.radius;
      
      const x2 = cos(angle) * nextLayer.radius;
      const z2 = sin(angle) * nextLayer.radius;
      
      // Set color for current layer
      fill(layer.hue, layer.saturation, layer.brightness);
      
      vertex(x1, 0, z1);
      vertex(x2, 0, z2);
    }
  }
  endShape();
  
  // Add glowing particles to simulate core heat
  if (cameraZ < -100) {
    drawCoreParticles();
  }
}

function drawCoreParticles() {
  // Create a few glowing points to represent the hot core
  beginShape(POINTS);
  for (let i = 0; i < coreParticles.length; i++) {
    const p = coreParticles[i];
    p.angle += p.speed;
    const x = cos(p.angle) * p.radius;
    const z = sin(p.angle) * p.radius;
    
    fill(255, 100, 0);
    vertex(x, 0, z);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
