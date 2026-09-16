let blooms = [];
const NUM_BLOOMS = 150;
const MAX_PETALS = 8;
const MIN_PETALS = 4;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  for (let i = 0; i < NUM_BLOOMS; i++) {
    blooms.push({
      x: random(width),
      y: random(height),
      size: random(20, 60),
      hue: random(360),
      speed: random(0.005, 0.02),
      sway: random(TWO_PI),
      petals: [],
      age: random(100)
    });
  }
  
  // Precompute petal shapes
  for (let bloom of blooms) {
    const numPetals = floor(random(MIN_PETALS, MAX_PETALS + 1));
    bloom.petals = [];
    for (let i = 0; i < numPetals; i++) {
      const angle = map(i, 0, numPetals, 0, TWO_PI);
      const curve = random(0.5, 1.5);
      const petalSize = random(0.8, 1.2);
      bloom.petals.push({
        angle,
        curve,
        size: petalSize
      });
    }
  }
}

function draw() {
  background(220, 10, 95);
  
  for (let bloom of blooms) {
    // Update sway motion
    bloom.sway += bloom.speed;
    bloom.age += 0.01;
    
    // Calculate sway offset
    const swayOffset = sin(bloom.sway) * 3;
    
    // Draw bloom with layered petals
    push();
    translate(bloom.x + swayOffset, bloom.y);
    
    // Draw center
    fill(bloom.hue, 80, 90, 0.8);
    noStroke();
    ellipse(0, 0, bloom.size * 0.3);
    
    // Draw petals
    for (let petal of bloom.petals) {
      const angle = petal.angle + sin(bloom.sway * 2 + petal.curve) * 0.5;
      const size = petal.size * bloom.size;
      
      // Create curved petal shape
      push();
      rotate(angle);
      
      // Gradient fill for depth
      const hue = (bloom.hue + random(-10, 10)) % 360;
      const sat = 70 + sin(bloom.age + angle) * 20;
      const bri = 70 + cos(bloom.age + angle) * 20;
      
      fill(hue, sat, bri, 0.8);
      noStroke();
      
      // Petal shape using bezier curves for organic look
      beginShape();
      vertex(0, 0);
      bezierVertex(
        size * 0.5, -size * 0.3,
        size * 0.8, size * 0.2,
        0, size * 0.8
      );
      bezierVertex(
        -size * 0.8, size * 0.2,
        -size * 0.5, -size * 0.3,
        0, 0
      );
      endShape(CLOSE);
      
      pop();
    }
    
    pop();
  }
  
  // Add subtle background texture
  if (frameCount % 10 === 0) {
    const x = random(width);
    const y = random(height);
    const size = random(1, 3);
    fill(220, 5, 90, 0.1);
    noStroke();
    ellipse(x, y, size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
