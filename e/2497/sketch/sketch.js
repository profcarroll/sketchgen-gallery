// A deep cross-section of planetary strata rendered in saturated hues of ochre,
// sapphire, and malachite, depicted as geometrically folded origami panels.
// These layered planes are systematically arranged to resemble delicate, folded
// crystal cleavage. The entire structure slowly unfolds over time, revealing
// deeper strata. Dragging the cursor shifts the viewing angle, emphasizing
// the sheer depth and layered complexity of the planet's history.

let layers = [];
const LAYER_COUNT = 60;
const MAX_RADIUS = 300;
let rotationX = 0;
let rotationY = 0;
let targetRotationX = 0;
let targetRotationY = 0;
let revealProgress = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Generate folded origami-like layers
  for (let i = 0; i < LAYER_COUNT; i++) {
    const radius = map(i, 0, LAYER_COUNT - 1, MAX_RADIUS * 0.3, MAX_RADIUS);
    const thickness = random(5, 12);
    const segments = floor(random(20, 40));
    
    // Create folded panel structure
    let points = [];
    for (let j = 0; j < segments; j++) {
      const angle = TWO_PI / segments * j;
      
      // Add folding effect to create origami panels
      const foldFactor = map(noise(i * 0.1 + j * 0.1), 0, 1, -0.5, 0.5);
      const r = radius * (1 + foldFactor * 0.3);
      
      points.push({
        x: r * cos(angle),
        y: r * sin(angle),
        z: random(-8, 8)
      });
    }
    
    // Color based on depth and geological hues
    let colorR, colorG, colorB;
    if (i < LAYER_COUNT * 0.25) {
      // Surface layers - ochre
      colorR = random(180, 220);
      colorG = random(90, 130);
      colorB = random(20, 60);
    } else if (i < LAYER_COUNT * 0.5) {
      // Middle layers - sapphire
      colorR = random(30, 80);
      colorG = random(60, 120);
      colorB = random(180, 240);
    } else {
      // Deep layers - malachite
      colorR = random(20, 60);
      colorG = random(120, 180);
      colorB = random(40, 90);
    }
    
    layers.push({
      points: points,
      radius: radius,
      thickness: thickness,
      color: color(colorR, colorG, colorB),
      depth: i
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(10, 5, 20); // Deep dark background to emphasize mineral tones
  
  const time = millis() * 0.0003;
  
  push();
  translate(0, 0, -400);
  rotateX(rotationX);
  rotateY(rotationY);
  
  // Animate reveal effect
  if (revealProgress < 1) {
    revealProgress += 0.0015;
  }
  
  // Draw layers with progressive reveal and subtle animation
  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];
    
    // Skip layers that haven't been revealed yet
    if (i > revealProgress * LAYER_COUNT) continue;
    
    fill(layer.color);
    
    beginShape();
    for (let j = 0; j < layer.points.length; j++) {
      const p = layer.points[j];
      
      // Apply subtle animation to points for depth illusion
      const anim = sin(time + i * 0.05 + j * 0.1) * 2;
      
      vertex(p.x, p.y, p.z + anim);
    }
    endShape(CLOSE);
    
    // Add some texture with additional points
    fill(layer.color);
    beginShape(POINTS);
    for (let j = 0; j < layer.points.length; j += 4) {
      const p = layer.points[j];
      const anim = sin(time * 1.5 + i * 0.05 + j * 0.1) * 1.5;
      vertex(p.x, p.y, p.z + anim);
    }
    endShape();
  }
  
  pop();
  
  // Smooth rotation transition
  rotationX += (targetRotationX - rotationX) * 0.02;
  rotationY += (targetRotationY - rotationY) * 0.02;
}

function mouseDragged() {
  // Adjust rotation based on drag movement
  targetRotationY += (mouseX - pmouseX) * 0.01;
  targetRotationX += (mouseY - pmouseY) * 0.01;
}
