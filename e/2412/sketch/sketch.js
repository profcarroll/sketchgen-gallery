let layers = [];
let flora = [];
let mineralColors = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Set up mineral color palette
  mineralColors = [
    color(120, 130, 140),
    color(100, 110, 120),
    color(80, 90, 100),
    color(60, 70, 80),
    color(40, 50, 60),
    color(180, 190, 200),
    color(160, 170, 180),
    color(140, 150, 160)
  ];
  
  // Create geological layers
  for (let i = 0; i < 15; i++) {
    let y = map(i, 0, 14, height * 0.2, height * 0.8);
    let thickness = random(15, 50);
    let layerColor = random(mineralColors);
    layers.push({
      y: y,
      thickness: thickness,
      color: layerColor,
      offset: random(TWO_PI),
      texture: []
    });
    
    // Add texture to each layer
    for (let j = 0; j < 30; j++) {
      layers[i].texture.push({
        x: random(width),
        y: y + random(thickness),
        w: random(1, 4),
        h: random(0.5, 2)
      });
    }
  }
  
  // Create fossilized flora in center
  createFlora();
}

function createFlora() {
  let centerX = width / 2;
  let centerY = height / 2;
  
  // Create a central fossilized bouquet
  for (let i = 0; i < 8; i++) {
    let angle = map(i, 0, 7, 0, TWO_PI);
    let distance = random(100, 150);
    let x = centerX + cos(angle) * distance;
    let y = centerY + sin(angle) * distance;
    
    flora.push({
      x: x,
      y: y,
      size: random(20, 40),
      color: random(mineralColors),
      petals: random(3, 7),
      stem: {
        x1: centerX,
        y1: centerY,
        x2: x,
        y2: y
      }
    });
  }
}

function draw() {
  background(30, 40, 50);
  
  // Draw geological layers
  for (let layer of layers) {
    let y = layer.y + sin(frameCount * 0.002 + layer.offset) * 1;
    
    noStroke();
    fill(layer.color);
    rect(0, y, width, layer.thickness);
    
    // Add intricate texture to layers
    stroke(200, 210, 220, 40);
    strokeWeight(0.5);
    for (let tex of layer.texture) {
      line(tex.x, tex.y, tex.x + tex.w, tex.y + tex.h);
    }
  }
  
  // Draw fossilized flora
  noFill();
  strokeWeight(1);
  for (let flower of flora) {
    // Draw stem
    stroke(flower.color);
    line(flower.stem.x1, flower.stem.y1, flower.stem.x2, flower.stem.y2);
    
    // Draw petals
    stroke(flower.color);
    fill(255, 255, 255, 30);
    for (let i = 0; i < flower.petals; i++) {
      let angle = map(i, 0, flower.petals - 1, 0, TWO_PI);
      let petalX = flower.x + cos(angle) * flower.size;
      let petalY = flower.y + sin(angle) * flower.size;
      
      beginShape();
      for (let j = 0; j < 5; j++) {
        let a = map(j, 0, 4, 0, TWO_PI);
        let px = petalX + cos(a) * (flower.size * 0.7);
        let py = petalY + sin(a) * (flower.size * 0.7);
        vertex(px, py);
      }
      endShape(CLOSE);
    }
    
    // Draw center of flower
    noStroke();
    fill(255, 255, 255, 100);
    ellipse(flower.x, flower.y, flower.size * 0.3, flower.size * 0.3);
  }
  
  // Add subtle shimmer effect
  if (frameCount % 20 === 0) {
    let shimmerX = random(width);
    let shimmerY = random(height);
    let size = random(1, 3);
    fill(255, 255, 255, 20);
    noStroke();
    ellipse(shimmerX, shimmerY, size, size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
