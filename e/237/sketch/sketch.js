let plants = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create a grid of plants
  for (let x = 0; x < width; x += 100) {
    for (let y = 0; y < height; y += 120) {
      plants.push({
        x: x + random(-20, 20),
        y: y + random(-20, 20),
        size: random(30, 60),
        age: random(TWO_PI),
        stage: floor(random(4)) // 0=seed, 1=bud, 2=flower, 3=fade
      });
    }
  }
}

function draw() {
  background(15, 25, 45);
  
  time += 0.005;
  
  for (let plant of plants) {
    plant.age += 0.002;
    
    // Cycle through stages
    if (plant.age > TWO_PI) {
      plant.age = 0;
      plant.stage = (plant.stage + 1) % 4;
    }
    
    const progress = plant.age / TWO_PI;
    
    // Draw stem
    fill(30, 180, 60);
    rect(plant.x - 3, plant.y, 6, plant.size * 0.7);
    
    // Draw base of flower
    if (plant.stage > 0) {
      const baseSize = plant.size * 0.2;
      fill(50, 120, 80);
      ellipse(plant.x, plant.y + plant.size * 0.7, baseSize, baseSize * 0.4);
    }
    
    // Draw flower parts based on stage
    if (plant.stage > 1) {
      const petalCount = 6;
      const petalLength = plant.size * 0.8;
      const petalWidth = plant.size * 0.2;
      
      for (let i = 0; i < petalCount; i++) {
        const angle = map(i, 0, petalCount, 0, TWO_PI) + progress * 0.5;
        const x1 = plant.x + cos(angle) * plant.size * 0.3;
        const y1 = plant.y + sin(angle) * plant.size * 0.3;
        
        // Petal shape
        const petalAngle = angle + PI/2;
        const px = x1 + cos(petalAngle) * petalLength;
        const py = y1 + sin(petalAngle) * petalLength;
        
        // Calculate color based on progress and stage
        const hue = (progress * 30 + plant.stage * 60) % 360;
        fill(hue, 100, 85);
        
        beginShape();
        vertex(x1, y1);
        vertex(px - cos(petalAngle + PI/4) * petalWidth, py - sin(petalAngle + PI/4) * petalWidth);
        vertex(px + cos(petalAngle + PI/4) * petalWidth, py + sin(petalAngle + PI/4) * petalWidth);
        endShape(CLOSE);
      }
      
      // Center of flower
      fill(255, 200, 0);
      ellipse(plant.x, plant.y, plant.size * 0.3, plant.size * 0.3);
    }
    
    // Draw seed when stage is 0 or 3 (fade)
    if (plant.stage === 0 || plant.stage === 3) {
      const seedSize = plant.size * 0.1;
      fill(200, 180, 150);
      ellipse(plant.x, plant.y, seedSize, seedSize);
    }
    
    // Draw fading effect
    if (plant.stage === 3 && progress > 0.7) {
      const fade = map(progress, 0.7, 1, 0, 255);
      fill(255, 255, 255, fade);
      ellipse(plant.x, plant.y, plant.size * 0.3, plant.size * 0.3);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
