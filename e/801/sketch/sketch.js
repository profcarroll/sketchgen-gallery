let bands = [];
let plumes = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create water bands
  for (let i = 0; i < 8; i++) {
    bands.push({
      y: map(i, 0, 7, height * 0.3, height * 0.9),
      height: height * 0.05,
      color: color(60 + i * 15, 100 + i * 10, 200 + i * 5, 200),
      speed: 0.005 + i * 0.001
    });
  }
  
  // Initialize plumes
  for (let i = 0; i < 20; i++) {
    plumes.push({
      x: random(width),
      y: random(height * 0.3, height * 0.9),
      size: random(5, 15),
      speed: random(0.5, 2),
      direction: random(TWO_PI),
      life: random(100, 200)
    });
  }
}

function draw() {
  background(200, 220, 255);
  
  time += 0.02;
  
  // Draw water bands
  for (let band of bands) {
    let wave = sin(time * band.speed + band.y * 0.01) * 5;
    let offset = sin(time * band.speed * 0.7 + band.y * 0.02) * 3;
    
    // Create undulating shape
    beginShape();
    for (let x = 0; x <= width; x += 10) {
      let y = band.y + wave * sin(x * 0.01 + time * band.speed);
      vertex(x, y);
    }
    vertex(width, band.y + offset);
    vertex(0, band.y + offset);
    endShape(CLOSE);
    
    fill(band.color);
  }
  
  // Update and draw plumes
  for (let i = plumes.length - 1; i >= 0; i--) {
    let p = plumes[i];
    
    // Move plume
    p.x += cos(p.direction) * p.speed;
    p.y += sin(p.direction) * p.speed;
    
    // Fade out
    p.life--;
    
    if (p.life <= 0 || p.x < -10 || p.x > width + 10 || p.y < 0 || p.y > height) {
      plumes.splice(i, 1);
      continue;
    }
    
    // Create new plume occasionally
    if (random() < 0.02) {
      plumes.push({
        x: random(width),
        y: random(height * 0.3, height * 0.9),
        size: random(5, 15),
        speed: random(0.5, 2),
        direction: random(TWO_PI),
        life: random(100, 200)
      });
    }
    
    // Draw plume
    fill(255, 200, 100, 150);
    noStroke();
    ellipse(p.x, p.y, p.size, p.size * 0.5);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
