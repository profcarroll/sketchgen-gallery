let layers = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Create layered geological structures
  for (let i = 0; i < 25; i++) {
    layers.push({
      centerX: random(width),
      centerY: random(height),
      baseRadius: random(80, 300),
      layerCount: floor(random(4, 10)),
      hueShift: random(360),
      saturation: random(60, 90),
      brightness: random(70, 95),
      alpha: random(0.15, 0.35),
      speed: random(0.001, 0.01)
    });
  }
}

function draw() {
  background(0, 0, 5, 0.03);
  
  time += 0.01;
  
  // Draw layered structures
  for (let i = 0; i < layers.length; i++) {
    let l = layers[i];
    
    push();
    translate(l.centerX, l.centerY);
    
    // Create shifting, organic patterns
    let rotation = time * l.speed;
    
    for (let j = 0; j < l.layerCount; j++) {
      let radius = l.baseRadius * (1 - j * 0.12);
      let angleOffset = rotation * (j + 1) + l.hueShift;
      
      // Create asymmetrical ring patterns
      let segments = floor(map(j, 0, l.layerCount-1, 15, 50));
      
      fill((angleOffset * 2 + j * 15) % 360, l.saturation, l.brightness, l.alpha);
      
      beginShape();
      for (let k = 0; k < segments; k++) {
        let angle = map(k, 0, segments, 0, TWO_PI) + angleOffset;
        let distortion = sin(time * 2 + angle * 4 + j) * 0.25;
        let r = radius * (1 + distortion);
        
        let x = cos(angle) * r;
        let y = sin(angle) * r;
        
        vertex(x, y);
      }
      endShape(CLOSE);
    }
    
    pop();
  }
  
  // Add dynamic color shifts
  for (let i = 0; i < 25; i++) {
    let x = (sin(time * 0.15 + i) * width * 0.35) + width * 0.5;
    let y = (cos(time * 0.12 + i) * height * 0.35) + height * 0.5;
    let size = sin(time * 0.2 + i) * 20 + 40;
    
    fill((time * 15 + i * 12) % 360, 75, 85, 0.12);
    ellipse(x, y, size, size * 0.6);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
