let layers = [];
let angle = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Create multiple layers of intersecting planes
  for (let i = 0; i < 15; i++) {
    layers.push({
      z: random(-1000, 1000),
      size: random(200, 600),
      rotation: random(TWO_PI),
      speed: random(0.001, 0.005)
    });
  }
}

function draw() {
  background(30, 35, 40);
  
  // Ambient cyan wash
  fill(20, 40, 60, 30);
  noStroke();
  plane(width * 2, height * 2);
  
  // Camera movement for immersive effect
  let camX = sin(angle * 0.3) * 500;
  let camY = cos(angle * 0.2) * 200;
  camera(0, 0, 1000 + camY, 0, 0, 0, 0, 1, 0);
  
  // Draw layers with varying properties
  for (let i = 0; i < layers.length; i++) {
    let layer = layers[i];
    
    push();
    translate(0, 0, layer.z);
    rotateZ(layer.rotation + angle * layer.speed);
    rotateX(angle * 0.1);
    
    // Color palette: aged concrete, oxidized steel
    if (i % 3 === 0) {
      fill(80, 75, 70); // Concrete
    } else if (i % 3 === 1) {
      fill(100, 60, 40); // Oxidized steel
    } else {
      fill(120, 90, 80); // Steel variation
    }
    
    // Create interlocking geometric forms
    box(layer.size, layer.size * 0.3, layer.size * 0.1);
    pop();
  }
  
  angle += 0.005;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
