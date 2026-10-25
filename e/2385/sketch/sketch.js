// A deep cross-section of fossilized coral rendered in rich sheets of oxidizing steel.
// Intricate layers of orange, red, and deep brown mineral accretion fractalize outwards,
// creating complex structures suggestive of ancient life. The strata appear to slowly peel back
// and reveal deeper, more densely packed formations over time. Clicking focuses the view on a
// specific junction where the layers meet, allowing the viewer to trace the hidden depth.

let seed = 1;
let layers = [];
const LAYER_COUNT = 80;
const MAX_RADIUS = 300;
let clickFocus = null;
let focusRadius = 0;
let revealProgress = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  randomSeed(seed);
  
  // Generate coral-like layers with fractal patterns
  for (let i = 0; i < LAYER_COUNT; i++) {
    const radius = map(i, 0, LAYER_COUNT - 1, MAX_RADIUS * 0.2, MAX_RADIUS);
    const thickness = random(8, 15);
    const segments = floor(random(30, 60));
    
    // Create fractal pattern for each layer
    let points = [];
    for (let j = 0; j < segments; j++) {
      const angle = TWO_PI / segments * j;
      const noiseFactor = map(noise(i * 0.1 + j * 0.05), 0, 1, 0.8, 1.2);
      const r = radius * noiseFactor;
      
      points.push({
        x: r * cos(angle),
        y: r * sin(angle),
        z: random(-5, 5)
      });
    }
    
    // Color based on depth and mineral composition
    let colorR, colorG, colorB;
    if (i < LAYER_COUNT * 0.3) {
      // Surface layers - orange
      colorR = random(200, 255);
      colorG = random(80, 150);
      colorB = random(20, 60);
    } else if (i < LAYER_COUNT * 0.6) {
      // Middle layers - red
      colorR = random(150, 220);
      colorG = random(30, 80);
      colorB = random(20, 60);
    } else {
      // Deep layers - brown
      colorR = random(80, 150);
      colorG = random(40, 90);
      colorB = random(20, 60);
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
  background(20, 15, 10); // Deep dark background to emphasize mineral tones
  
  const time = millis() * 0.0005;
  
  push();
  translate(0, 0, -300);
  
  // Animate reveal effect
  if (revealProgress < 1) {
    revealProgress += 0.002;
  }
  
  // Draw layers with progressive reveal
  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];
    
    // Skip layers that haven't been revealed yet
    if (i > revealProgress * LAYER_COUNT) continue;
    
    fill(layer.color);
    
    beginShape();
    for (let j = 0; j < layer.points.length; j++) {
      const p = layer.points[j];
      
      // Apply subtle animation to points
      const anim = sin(time + i * 0.1 + j * 0.2) * 3;
      
      vertex(p.x, p.y, p.z + anim);
    }
    endShape(CLOSE);
    
    // Add some texture with additional points
    fill(layer.color);
    beginShape(POINTS);
    for (let j = 0; j < layer.points.length; j += 3) {
      const p = layer.points[j];
      const anim = sin(time * 2 + i * 0.1 + j * 0.2) * 2;
      vertex(p.x, p.y, p.z + anim);
    }
    endShape();
  }
  
  // Draw focus effect when clicked
  if (clickFocus !== null) {
    const focusX = clickFocus.x;
    const focusY = clickFocus.y;
    
    // Create a glow effect around the focus point
    noFill();
    stroke(255, 200);
    strokeWeight(1);
    
    for (let i = 0; i < 30; i++) {
      const radius = map(i, 0, 29, 0, 80);
      ellipse(focusX, focusY, radius, radius);
    }
    
    // Draw a more detailed cross-section at the click point
    drawDetailedSection();
  }
  
  pop();
}

function drawDetailedSection() {
  if (clickFocus === null) return;
  
  const centerX = clickFocus.x;
  const centerY = clickFocus.y;
  
  // Draw a small detailed view around the focus point
  push();
  translate(centerX, centerY, -100);
  
  // Draw a grid of points showing structure
  stroke(255, 80);
  strokeWeight(0.5);
  
  beginShape(POINTS);
  for (let i = 0; i < 1000; i++) {
    const angle = random(TWO_PI);
    const r = random(20, 60);
    const x = r * cos(angle);
    const y = r * sin(angle);
    
    vertex(x, y, 0);
  }
  endShape();
  
  // Draw some mineral structures
  fill(180, 70, 30, 200);
  noStroke();
  
  for (let i = 0; i < 20; i++) {
    const angle = random(TWO_PI);
    const r = random(5, 20);
    const size = random(1, 4);
    
    const x = r * cos(angle);
    const y = r * sin(angle);
    
    ellipse(x, y, size, size);
  }
  
  pop();
}

function mousePressed() {
  // Record click location for focus effect
  clickFocus = {x: mouseX - width/2, y: mouseY - height/2};
  
  // Deepen the reveal at the clicked point
  revealProgress = 0.3;
}
