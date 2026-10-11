let layers = [];
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create geological layers
  for (let i = 0; i < 12; i++) {
    layers.push({
      y: map(i, 0, 11, -height/2, height/2),
      hue: map(i, 0, 11, 20, 40), // Earthy browns and grays
      saturation: 20,
      brightness: map(i, 0, 11, 30, 70),
      opacity: map(i, 0, 11, 0.15, 0.4),
      speed: random(0.001, 0.003)
    });
  }
  
  // Create particles that represent crystalline structures
  particles = new Array(800).fill().map(() => ({
    x: random(-width/2, width/2),
    y: random(-height/2, height/2),
    z: random(-100, 100),
    size: random(1, 3),
    hue: random(180, 240), // Crystalline whites and blues
    speed: random(0.001, 0.005),
    offset: random(TWO_PI)
  }));
}

function draw() {
  background(0);
  
  // Slow rotation for the whole scene
  rotateY(frameCount * 0.001);
  
  // Draw sediment layers with counter-gravity movement
  for (let i = 0; i < layers.length; i++) {
    let layer = layers[i];
    
    // Apply counter-gravity effect to layers
    let offset = sin(frameCount * layer.speed) * 30;
    
    push();
    translate(0, layer.y + offset, 0);
    rotateX(PI/2);
    
    // Create a large, textured layer
    noStroke();
    fill(layer.hue, layer.saturation, layer.brightness, layer.opacity);
    plane(width * 1.5, height * 0.3);
    
    pop();
  }
  
  // Draw crystalline sediment particles with floating motion using batched points
  beginShape(POINTS);
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    let yoff = sin(frameCount * p.speed + p.offset) * 20;
    
    vertex(p.x, p.y + yoff, p.z);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
