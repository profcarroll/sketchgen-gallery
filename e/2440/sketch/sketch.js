let circuits = [];
let layers = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pixelDensity(1);
  
  // Create sedimentary rock layers
  for (let i = 0; i < 20; i++) {
    layers.push({
      y: random(-height/2, height/2),
      height: random(50, 150),
      color: color(random(80, 140), random(60, 100), random(30, 70), random(180, 220)),
      speed: random(0.001, 0.003),
      offset: random(TWO_PI)
    });
  }
  
  // Create flowing liquid paths
  for (let i = 0; i < 50; i++) {
    circuits.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-100, 100),
      size: random(30, 80),
      color: color(random(150, 200), random(80, 120), random(30, 60), random(150, 200)),
      speed: random(0.002, 0.005),
      offset: random(TWO_PI)
    });
  }
}

function draw() {
  time += 0.01;
  
  // Dark geological background
  background(15, 10, 5);
  
  // Draw sedimentary rock layers
  for (let layer of layers) {
    layer.y += sin(time * layer.speed + layer.offset) * 0.5;
    
    push();
    translate(0, layer.y);
    fill(layer.color);
    noStroke();
    rect(-width/2, -layer.height/2, width, layer.height);
    pop();
  }
  
  // Draw flowing liquid circuits
  beginShape(LINES);
  stroke(180, 100, 40, 150);
  strokeWeight(1.5);
  
  for (let circuit of circuits) {
    circuit.x += sin(time * circuit.speed + circuit.offset) * 0.3;
    circuit.z += cos(time * circuit.speed + circuit.offset) * 0.3;
    
    let x1 = circuit.x - circuit.size/2;
    let y1 = circuit.y;
    let z1 = circuit.z;
    
    let x2 = circuit.x + circuit.size/2;
    let y2 = circuit.y;
    let z2 = circuit.z;
    
    vertex(x1, y1, z1);
    vertex(x2, y2, z2);
  }
  
  endShape();
  
  // Draw copper liquid paths with glow
  for (let circuit of circuits) {
    push();
    translate(circuit.x, circuit.y, circuit.z);
    
    // Glow effect
    fill(255, 180, 90, 30);
    noStroke();
    sphere(circuit.size/4);
    
    // Main path
    fill(circuit.color);
    sphere(circuit.size/6);
    
    pop();
  }
  
  // Draw subtle overlay for depth
  blendMode(DIFFERENCE);
  fill(255, 255, 255, 3);
  noStroke();
  rect(-width/2, -height/2, width, height);
  blendMode(BLEND);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
