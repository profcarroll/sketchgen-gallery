let tracery = [];
let cardboardTexture;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create cardboard texture
  cardboardTexture = createGraphics(width, height);
  cardboardTexture.colorMode(HSB, 360, 100, 100, 1);
  cardboardTexture.background(20, 5, 80);
  for (let i = 0; i < 1000; i++) {
    let x = random(width);
    let y = random(height);
    let w = random(2, 8);
    let h = random(1, 3);
    cardboardTexture.noStroke();
    cardboardTexture.fill(20, 10, 70, 0.3);
    cardboardTexture.rect(x, y, w, h);
  }
  
  // Create mycelial tracery
  for (let i = 0; i < 500; i++) {
    tracery.push({
      points: [],
      hue: random(180, 240),
      alpha: random(0.1, 0.3),
      speed: random(0.001, 0.005),
      size: random(0.5, 2),
      segments: floor(random(5, 15))
    });
  }
  
  // Initialize tracery paths
  for (let t of tracery) {
    let x = random(width);
    let y = random(height);
    let angle = random(TWO_PI);
    let length = random(50, 200);
    
    for (let i = 0; i < t.segments; i++) {
      let point = {
        x: x,
        y: y,
        age: 0
      };
      t.points.push(point);
      
      x += cos(angle) * length / t.segments;
      y += sin(angle) * length / t.segments;
      angle += random(-0.5, 0.5);
      length *= random(0.8, 1.2);
    }
  }
}

function draw() {
  // Draw textured background
  image(cardboardTexture, 0, 0);
  
  time += 0.01;
  
  // Update and draw tracery
  for (let t of tracery) {
    let pulse = sin(time * t.speed + t.hue) * 0.5 + 0.5;
    
    // Animate points
    for (let point of t.points) {
      point.age += 0.01;
      point.x += sin(point.age * 2) * 0.5;
      point.y += cos(point.age * 1.5) * 0.5;
    }
    
    // Draw tracery with pulsing
    noFill();
    stroke(t.hue, 60, 90, t.alpha * pulse);
    strokeWeight(t.size * pulse);
    
    beginShape();
    for (let point of t.points) {
      vertex(point.x, point.y);
    }
    endShape();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
