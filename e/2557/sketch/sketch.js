// A deep cross-section of an ancient, extinct language rendered in muted blue and rich ochre,
// viewed under a microscope. Layer upon layer of glyphs and markings accrue and shift slowly.
// The viewer can drag to explore the structured field and reveal hidden strata of information.

let layers = [];
const LAYER_COUNT = 80;
const MAX_RADIUS = 250;
let rotationX = 0;
let rotationY = 0;
let targetRotationX = 0;
let targetRotationY = 0;
let revealProgress = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Generate layered cross-section with systematic glyphs
  for (let i = 0; i < LAYER_COUNT; i++) {
    const radius = map(i, 0, LAYER_COUNT - 1, MAX_RADIUS * 0.4, MAX_RADIUS);
    const thickness = random(3, 8);
    const segments = floor(random(25, 50));
    
    let points = [];
    for (let j = 0; j < segments; j++) {
      const angle = TWO_PI / segments * j;
      
      // Add subtle folding effect to create layered structure
      const foldFactor = map(noise(i * 0.1 + j * 0.15), 0, 1, -0.3, 0.3);
      const r = radius * (1 + foldFactor * 0.2);
      
      points.push({
        x: r * cos(angle),
        y: r * sin(angle),
        z: random(-6, 6)
      });
    }
    
    // Color based on depth - blue and ochre tones
    let colorR, colorG, colorB;
    if (i < LAYER_COUNT * 0.3) {
      // Surface layers - ochre
      colorR = random(150, 200);
      colorG = random(80, 120);
      colorB = random(10, 40);
    } else if (i < LAYER_COUNT * 0.6) {
      // Middle layers - muted blue
      colorR = random(30, 70);
      colorG = random(50, 90);
      colorB = random(120, 180);
    } else {
      // Deep layers - deeper blue
      colorR = random(10, 40);
      colorG = random(30, 60);
      colorB = random(100, 160);
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
  background(15, 10, 25); // Deep dark background
  
  const time = millis() * 0.0002;
  
  push();
  translate(0, 0, -350);
  rotateX(rotationX);
  rotateY(rotationY);
  
  // Animate reveal effect
  if (revealProgress < 1) {
    revealProgress += 0.001;
  }
  
  // Draw layers with progressive reveal and subtle animation
  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];
    
    // Skip unrevealed layers
    if (i > revealProgress * LAYER_COUNT) continue;
    
    fill(layer.color);
    
    beginShape();
    for (let j = 0; j < layer.points.length; j++) {
      const p = layer.points[j];
      
      // Apply subtle animation to points for depth illusion
      const anim = sin(time + i * 0.03 + j * 0.1) * 1.5;
      
      vertex(p.x, p.y, p.z + anim);
    }
    endShape(CLOSE);
    
    // Add texture with additional points
    fill(layer.color);
    beginShape(POINTS);
    for (let j = 0; j < layer.points.length; j += 3) {
      const p = layer.points[j];
      const anim = sin(time * 1.2 + i * 0.03 + j * 0.1) * 1;
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
  targetRotationY += (mouseX - pmouseX) * 0.01;
  targetRotationX += (mouseY - pmouseY) * 0.01;
}
