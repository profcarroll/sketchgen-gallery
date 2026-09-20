let shapes = [];
let paletteIndex = 0;
let tempo = 1;
let time = 0;

// Predefined palettes: deep blues/violets, gold/crimson
const palettes = [
  // Deep blues and violets
  [[25, 10, 60], [45, 20, 90], [65, 30, 120]],
  // Gold and crimson
  [[255, 215, 0], [220, 20, 60], [255, 140, 0]]
];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize shapes with different geometries
  for (let i = 0; i < 15; i++) {
    shapes.push({
      type: floor(random(3)), // 0=sphere, 1=box, 2=torus
      pos: createVector(
        random(-width/3, width/3),
        random(-height/3, height/3),
        random(-200, 200)
      ),
      size: random(20, 60),
      rotation: createVector(random(TWO_PI), random(TWO_PI), random(TWO_PI)),
      rotSpeed: createVector(
        random(-0.01, 0.01),
        random(-0.01, 0.01),
        random(-0.01, 0.01)
      ),
      pulse: 0,
      pulseSpeed: random(0.02, 0.05),
      colorIndex: floor(random(palettes[paletteIndex].length))
    });
  }
}

function draw() {
  background(0);
  noStroke();
  
  // Update time for pulsing effect
  time += tempo * 0.02;
  
  // Draw all shapes with their pulsing and rotation effects
  for (let shape of shapes) {
    push();
    
    translate(shape.pos.x, shape.pos.y, shape.pos.z);
    shape.rotation.add(shape.rotSpeed);
    rotateX(shape.rotation.x);
    rotateY(shape.rotation.y);
    rotateZ(shape.rotation.z);
    
    // Pulsing effect using sine
    shape.pulse = sin(time + shape.pulseSpeed) * 0.5 + 0.5;
    let scale = 1 + shape.pulse * 0.3;
    
    // Apply current palette color
    const [h, s, b] = palettes[paletteIndex][shape.colorIndex];
    fill(h, s, b, 0.6);
    
    // Draw different geometries based on type
    if (shape.type === 0) {
      sphere(shape.size * scale);
    } else if (shape.type === 1) {
      box(shape.size * scale);
    } else {
      torus(shape.size * scale, shape.size * scale * 0.4);
    }
    
    pop();
  }
  
  // Update positions for drifting effect
  for (let shape of shapes) {
    shape.pos.x += sin(time * 0.1 + shape.colorIndex) * 0.2;
    shape.pos.y += cos(time * 0.1 + shape.colorIndex) * 0.2;
    shape.pos.z += sin(time * 0.05 + shape.colorIndex) * 0.1;
  }
}

function mousePressed() {
  // Cycle palette and tempo on click
  paletteIndex = (paletteIndex + 1) % palettes.length;
  tempo = random(0.5, 2);
}
