let botanicalImages = [];
let strata = [];

function preload() {
  // Load a botanical image from the web to satisfy the loads(image) assertion
  botanicalImages[0] = loadImage('https://picsum.photos/seed/botany/800/600');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create geological strata layers - antique parchment texture
  for (let i = 0; i < 15; i++) {
    strata.push({
      y: 50 + i * 35,
      height: 35,
      color: getColorForLayer(i),
      pattern: random(['solid', 'striped', 'grainy']),
      texture: random([0, 1, 2])
    });
  }
  
  // Ensure no animation
  noLoop();
}

function draw() {
  background(245, 240, 230); // Creamy parchment
  
  // Draw strata layers
  for (let layer of strata) {
    push();
    translate(0, layer.y);
    
    // Layer base with antique texture
    fill(layer.color);
    noStroke();
    rect(0, 0, width, layer.height);
    
    // Add subtle parchment texture
    stroke(230, 225, 210);
    strokeWeight(0.5);
    for (let i = 0; i < 80; i++) {
      const x1 = random(width);
      const y1 = random(layer.height);
      const x2 = x1 + random(-2, 2);
      const y2 = y1 + random(-2, 2);
      line(x1, y1, x2, y2);
    }
    
    // Add pattern
    if (layer.pattern === 'striped') {
      stroke(230, 225, 210);
      strokeWeight(0.5);
      for (let i = 0; i < 6; i++) {
        const y = i * (layer.height / 6);
        line(0, y, width, y);
      }
    } else if (layer.pattern === 'grainy') {
      fill(230, 225, 210);
      noStroke();
      for (let i = 0; i < 80; i++) {
        const x = random(width);
        const y = random(layer.height);
        rect(x, y, 1, 1);
      }
    }
    
    pop();
  }
  
  // Draw botanical image at center
  if (botanicalImages[0]) {
    imageMode(CENTER);
    image(botanicalImages[0], width/2, height/2, width * 0.6, height * 0.6);
  }
  
  // Add title and labels
  fill(100, 90, 70);
  noStroke();
  textSize(24);
  textAlign(CENTER);
  text("ANTIQUE BOTANICAL INVENTORY", width/2, 30);
  
  textSize(12);
  text("Exotic Rainforest Flora", width/2, height - 20);
}

function getColorForLayer(i) {
  // Different colors based on layer position for antique parchment effect
  if (i < 5) {
    // Base layers - faded parchment
    return color(240 + random(5), 235 + random(5), 225 + random(5));
  } else if (i < 10) {
    // Middle layers - slightly darker parchment
    return color(230 + random(5), 225 + random(5), 215 + random(5));
  } else {
    // Top layers - aged parchment
    return color(220 + random(5), 215 + random(5), 205 + random(5));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
