let layers = [];
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create geological layers with crystalline strata
  for (let i = 0; i < 15; i++) {
    layers.push({
      y: map(i, 0, 14, -height/2, height/2),
      hue: map(i, 0, 14, 220, 280), // Cool blues and purples
      saturation: 60,
      brightness: map(i, 0, 14, 40, 80),
      opacity: map(i, 0, 14, 0.1, 0.35),
      speed: random(0.0005, 0.002)
    });
  }
  
  // Create particles that represent floating crystalline sediment
  particles = new Array(600).fill().map(() => ({
    x: random(-width/2, width/2),
    y: random(-height/2, height/2),
    z: random(-150, 150),
    size: random(0.5, 2),
    hue: random(200, 300), // Vibrant blues and purples
    speed: random(0.0005, 0.003),
    offset: random(TWO_PI)
  }));
}

function draw() {
  background(0);
  
  // Slow rotation for the whole scene
  rotateY(frameCount * 0.0005);
  
  // Draw sediment layers with counter-gravity movement
  for (let i = 0; i < layers.length; i++) {
    let layer = layers[i];
    
    // Apply counter-gravity effect to layers
    let offset = sin(frameCount * layer.speed) * 20;
    
    push();
    translate(0, layer.y + offset, 0);
    rotateX(PI/2);
    
    // Create a textured layer with crystalline pattern
    noStroke();
    fill(layer.hue, layer.saturation, layer.brightness, layer.opacity);
    plane(width * 1.5, height * 0.25);
    
    pop();
  }
  
  // Draw floating crystalline particles with counter-gravity motion using batched points
  beginShape(POINTS);
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    let yoff = sin(frameCount * p.speed + p.offset) * 15;
    
    vertex(p.x, p.y + yoff, p.z);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
