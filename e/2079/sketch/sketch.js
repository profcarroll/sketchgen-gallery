let strata = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  // Create geological strata layers
  for (let i = 0; i < 20; i++) {
    strata.push({
      y: -300 + i * 30,
      height: 30,
      color: getColorForLayer(i),
      pattern: random(['solid', 'striped', 'grainy']),
      texture: random([0, 1, 2])
    });
  }
}

function draw() {
  background(30, 35, 40);
  
  // Animate time
  time += 0.005;
  
  // Set camera to view cross-section
  const camX = sin(time * 0.1) * 200;
  const camY = cos(time * 0.08) * 50 - 50;
  const camZ = time * 50 - 300;
  
  camera(0, 0, camZ, 0, 0, 0, 0, 1, 0);
  translate(-camX, -camY, 0);
  
  // Draw strata layers
  for (let layer of strata) {
    push();
    translate(0, layer.y, 0);
    
    // Layer base
    fill(layer.color);
    noStroke();
    rect(-500, 0, 1000, layer.height);
    
    // Add texture based on layer type
    if (layer.texture === 1) {
      // Add some variation to concrete layers
      for (let i = 0; i < 200; i++) {
        const x = random(-500, 500);
        const y = random(0, layer.height);
        const size = random(1, 3);
        fill(20, 25, 30);
        rect(x, y, size, size);
      }
    } else if (layer.texture === 2) {
      // Add slag-like texture
      for (let i = 0; i < 100; i++) {
        const x = random(-500, 500);
        const y = random(0, layer.height);
        const size = random(2, 6);
        fill(100 + random(50), 30 + random(30), 20 + random(20));
        rect(x, y, size, size);
      }
    }
    
    // Add subtle pattern
    if (layer.pattern === 'striped') {
      stroke(20, 25, 30);
      strokeWeight(1);
      for (let i = 0; i < 10; i++) {
        const y = i * (layer.height / 10);
        line(-500, y, 500, y);
      }
    } else if (layer.pattern === 'grainy') {
      fill(20, 25, 30);
      noStroke();
      for (let i = 0; i < 150; i++) {
        const x = random(-500, 500);
        const y = random(0, layer.height);
        rect(x, y, 1, 1);
      }
    }
    
    pop();
  }
  
  // Add some sediment particles
  stroke(60, 50, 30);
  strokeWeight(1);
  for (let i = 0; i < 500; i++) {
    const x = random(-500, 500);
    const y = random(-300, 300);
    const z = random(-500, 500);
    point(x, y, z);
  }
  
  // Add some structural elements
  stroke(80, 85, 90);
  strokeWeight(2);
  for (let i = 0; i < 100; i++) {
    const x = random(-500, 500);
    const y = random(-300, -100);
    const z = random(-500, 500);
    line(x, y, z, x, y + 20, z);
  }
}

function getColorForLayer(i) {
  // Different colors based on layer position
  if (i < 5) {
    // Concrete layers - muted grays
    return color(80 + random(10), 85 + random(10), 90 + random(10));
  } else if (i < 12) {
    // Steel slag layers - rusty browns
    return color(120 + random(30), 40 + random(20), 20 + random(10));
  } else {
    // Sediment layers - earthy ochres
    return color(100 + random(30), 60 + random(20), 20 + random(10));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
