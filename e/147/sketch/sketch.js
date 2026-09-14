let particles = [];
let connections = [];
let colorPalette = [];

function setup() {
  createCanvas(800, 600);
  noStroke();
  
  // Generate a vibrant color palette
  for (let i = 0; i < 20; i++) {
    colorPalette.push(color(
      random(150, 255),
      random(100, 255),
      random(150, 255),
      180
    ));
  }

  // Initialize particles
  for (let i = 0; i < 100; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-1, 1),
      vy: random(-1, 1),
      size: random(5, 20),
      colorIndex: floor(random(colorPalette.length)),
      age: 0
    });
  }
}

function draw() {
  background(10, 10, 20);
  
  // Update and display particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Apply velocity
    p.x += p.vx;
    p.y += p.vy;
    
    // Boundary check with bounce
    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;
    
    // Slowly fade out as age increases
    p.age++;
    if (p.age > 200) {
      p.age = 0;
      p.x = random(width);
      p.y = random(height);
      p.vx = random(-1, 1);
      p.vy = random(-1, 1);
      p.colorIndex = floor(random(colorPalette.length));
    }
    
    // Draw particle
    fill(colorPalette[p.colorIndex]);
    ellipse(p.x, p.y, p.size);
    
    // Connect nearby particles
    for (let j = i + 1; j < particles.length; j++) {
      let other = particles[j];
      let d = dist(p.x, p.y, other.x, other.y);
      
      if (d < 80) {
        stroke(colorPalette[p.colorIndex]);
        strokeWeight(map(d, 0, 80, 1, 0.2));
        line(p.x, p.y, other.x, other.y);
      }
    }
  }

  // Occasionally shift the palette slightly
  if (frameCount % 100 === 0) {
    for (let i = 0; i < colorPalette.length; i++) {
      let c = colorPalette[i];
      let h = hue(c);
      let s = saturation(c);
      let b = brightness(c);
      
      // Slight hue shift over time
      h += random(-1, 1);
      if (h > 360) h -= 360;
      if (h < 0) h += 360;
      
      colorPalette[i] = color(h, s, b, 180);
    }
  }
}
