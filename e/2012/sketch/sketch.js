let grains = [];
let veins = [];
let noiseScale = 0.02;
let noiseStrength = 5;

function setup() {
  createCanvas(windowWidth, windowHeight);
  generatePattern();
}

function draw() {
  background(30, 30, 35);
  
  // Draw veins first (background)
  for (let vein of veins) {
    stroke(60, 60, 70);
    strokeWeight(2);
    noFill();
    beginShape();
    for (let i = 0; i < vein.length; i++) {
      vertex(vein[i].x, vein[i].y);
    }
    endShape();
  }
  
  // Draw grains
  for (let grain of grains) {
    fill(grain.color);
    noStroke();
    ellipse(grain.x, grain.y, grain.size);
  }
}

function generatePattern() {
  grains = [];
  veins = [];
  
  // Generate veins
  for (let i = 0; i < 15; i++) {
    let vein = [];
    let startX = random(width);
    let startY = random(height);
    let length = random(200, 600);
    let angle = random(TWO_PI);
    
    for (let j = 0; j < length; j += 5) {
      let x = startX + cos(angle) * j;
      let y = startY + sin(angle) * j;
      
      // Add some noise to make it look natural
      x += noise(x * noiseScale, y * noiseScale) * noiseStrength;
      y += noise(y * noiseScale, x * noiseScale) * noiseStrength;
      
      if (x >= 0 && x <= width && y >= 0 && y <= height) {
        vein.push({x, y});
      }
    }
    
    veins.push(vein);
  }
  
  // Generate grains
  let density = 3000;
  for (let i = 0; i < density; i++) {
    let x = random(width);
    let y = random(height);
    
    // Check if it's too close to a vein
    let tooClose = false;
    for (let vein of veins) {
      for (let point of vein) {
        let d = dist(x, y, point.x, point.y);
        if (d < 10) {
          tooClose = true;
          break;
        }
      }
      if (tooClose) break;
    }
    
    if (!tooClose) {
      let size = random(1, 4);
      let hue = random(200, 260); // Blue-gray range
      let sat = random(5, 20);
      let bright = random(80, 100);
      
      // Add some variation in color for a natural look
      if (random() > 0.7) {
        hue = random(240, 260); // Slightly more blue
      } else if (random() > 0.7) {
        hue = random(0, 10); // Slightly red/orange
      }
      
      let grainColor = color(hue, sat, bright);
      
      grains.push({x, y, size, color: grainColor});
    }
  }
}

function mousePressed() {
  generatePattern();
}
