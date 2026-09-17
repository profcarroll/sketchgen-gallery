let bands = [];
let time = 0;

function setup() {
  createCanvas(800, 600);
  noStroke();
  
  // Create horizontal bands with varying properties
  for (let i = 0; i < 15; i++) {
    bands.push({
      y: map(i, 0, 14, 0, height),
      height: height / 15,
      color: color(random(20, 100), random(50, 180), random(100, 255), 200),
      speed: random(0.001, 0.005),
      turbulence: random(2, 8)
    });
  }
}

function draw() {
  background(10, 20, 40);
  
  time += 0.01;
  
  // Draw each band with oscillating motion and turbulence
  for (let i = 0; i < bands.length; i++) {
    let band = bands[i];
    
    // Apply wave-like movement to band position
    let offset = sin(time * band.speed + i * 0.5) * band.turbulence;
    let y = band.y + offset;
    
    // Draw the band with a gradient effect
    fill(band.color);
    rect(0, y, width, band.height);
    
    // Add a darker high-water line
    if (i === 7) {
      stroke(0, 100);
      strokeWeight(2);
      line(0, y + band.height/2, width, y + band.height/2);
      noStroke();
    }
  }
  
  // Add some chaotic floating particles for visual turbulence
  for (let i = 0; i < 50; i++) {
    let x = (time * 10 + i * 30) % width;
    let y = height/2 + sin(time * 0.5 + i) * 30;
    fill(255, 150);
    ellipse(x, y, random(2, 6));
  }
}
