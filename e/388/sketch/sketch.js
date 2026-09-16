let dustDevils = [];
let terrainTexture;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create terrain texture with terracotta and beige tones
  terrainTexture = createGraphics(width, height);
  terrainTexture.noiseDetail(2, 0.5);
  terrainTexture.colorMode(HSB, 360, 100, 100, 1);
  
  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x += 2) {
      let n = terrainTexture.noise(x * 0.005, y * 0.005, time * 0.001);
      let c = color(
        map(n, 0, 1, 10, 30),   // terracotta hue
        map(n, 0, 1, 40, 70),   // saturation
        map(n, 0, 1, 20, 60),   // brightness
        1
      );
      terrainTexture.set(x, y, c);
    }
  }
  
  // Add some cracks and fissures
  for (let i = 0; i < 5000; i++) {
    let x = random(width);
    let y = random(height);
    let w = random(2, 8);
    let h = random(10, 30);
    terrainTexture.noiseDetail(1, 0.1);
    let n = terrainTexture.noise(x * 0.05, y * 0.05);
    if (n > 0.7) {
      terrainTexture.fill(0, 0, 0, 0.3);
      terrainTexture.rect(x, y, w, h);
    }
  }
  
  // Initialize dust devils
  for (let i = 0; i < 15; i++) {
    dustDevils.push({
      x: random(width),
      y: random(height * 0.6, height),
      size: random(20, 80),
      speed: random(0.5, 2),
      angle: random(TWO_PI),
      life: random(100, 300),
      color: color(random(200, 255), random(100, 200), random(50, 100))
    });
  }
}

function draw() {
  time++;
  
  // Draw the textured terrain
  image(terrainTexture, 0, 0);
  
  // Draw dust devils
  for (let i = dustDevils.length - 1; i >= 0; i--) {
    let devil = dustDevils[i];
    
    // Update position with some randomness
    devil.x += cos(devil.angle) * devil.speed;
    devil.y += sin(devil.angle) * devil.speed;
    devil.angle += random(-0.1, 0.1);
    
    // Fade out and regenerate if needed
    devil.life--;
    if (devil.life <= 0 || devil.x < -50 || devil.x > width + 50 || devil.y < -50 || devil.y > height + 50) {
      dustDevils.splice(i, 1);
      dustDevils.push({
        x: random(width),
        y: random(height * 0.6, height),
        size: random(20, 80),
        speed: random(0.5, 2),
        angle: random(TWO_PI),
        life: random(100, 300),
        color: color(random(200, 255), random(100, 200), random(50, 100))
      });
    } else {
      // Draw dust devil
      fill(devil.color);
      noStroke();
      
      // Draw a swirling pattern
      push();
      translate(devil.x, devil.y);
      for (let j = 0; j < 8; j++) {
        let angle = map(j, 0, 8, 0, TWO_PI);
        let xoff = cos(angle) * devil.size;
        let yoff = sin(angle) * devil.size;
        ellipse(xoff, yoff, devil.size * 0.5, devil.size * 0.3);
      }
      pop();
    }
  }
  
  // Occasionally form larger patterns
  if (random() < 0.02 && dustDevils.length > 5) {
    let group = [];
    for (let i = 0; i < 5; i++) {
      group.push(dustDevils[i]);
    }
    
    let centerX = 0, centerY = 0;
    for (let d of group) {
      centerX += d.x;
      centerY += d.y;
    }
    centerX /= group.length;
    centerY /= group.length;
    
    for (let d of group) {
      let dx = d.x - centerX;
      let dy = d.y - centerY;
      d.angle = atan2(dy, dx);
    }
  }
  
  // Add some subtle atmospheric movement
  if (time % 10 === 0) {
    for (let i = 0; i < 5; i++) {
      let x = random(width);
      let y = random(height * 0.7);
      let size = random(5, 20);
      fill(255, 255, 255, 30);
      ellipse(x, y, size, size * 0.5);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
