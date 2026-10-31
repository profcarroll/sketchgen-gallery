let layers = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create geological strata with petrified wood and mica sheets
  for (let i = 0; i < 150; i++) {
    layers.push({
      y: random(-height/2, height/2),
      z: random(-300, 300),
      width: random(80, 200),
      height: random(20, 60),
      hue: random(10, 40), // Oxidized copper tones
      saturation: random(30, 60),
      brightness: random(20, 50),
      rotation: random(TWO_PI),
      speed: random(0.0001, 0.0003),
      mica: random() > 0.7 // Add shimmering mica sheets
    });
  }
}

function draw() {
  background(0);
  noStroke();
  
  // Slow rotation to simulate geological time
  rotateY(time * 0.0001);
  rotateX(sin(time * 0.00005) * 0.03);
  
  time++;
  
  // Draw layered strata with subtle pulsing glow
  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];
    
    push();
    translate(0, layer.y, layer.z);
    rotateZ(layer.rotation + sin(time * layer.speed) * 0.1);
    
    // Layered petrified wood effect
    const pulse = sin(time * 0.005 + i * 0.02) * 0.3 + 0.7;
    const glow = map(pulse, 0, 1, 0.3, 0.8);
    
    // Draw base layer (petrified wood)
    fill(layer.hue, layer.saturation, layer.brightness, glow * 0.6);
    rectMode(CENTER);
    rect(0, 0, layer.width, layer.height);
    
    // Add mica shimmer effect
    if (layer.mica) {
      fill(180, 30, 90, 0.2 + sin(time * 0.01 + i) * 0.1);
      rect(0, 0, layer.width * 0.8, layer.height * 0.8);
    }
    
    // Add subtle organic texture
    stroke(layer.hue, layer.saturation, layer.brightness * 0.5, 0.2);
    strokeWeight(0.5);
    for (let j = 0; j < 10; j++) {
      const x = random(-layer.width/2, layer.width/2);
      const y = random(-layer.height/2, layer.height/2);
      line(x, y, x + random(-10, 10), y + random(-10, 10));
    }
    
    pop();
  }
  
  // Add subtle ambient glow
  noStroke();
  for (let i = 0; i < 50; i++) {
    const x = random(-width/2, width/2);
    const y = random(-height/2, height/2);
    const size = random(10, 30);
    const alpha = sin(time * 0.002 + i) * 0.1 + 0.2;
    
    fill(200, 50, 80, alpha);
    ellipse(x, y, size, size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
