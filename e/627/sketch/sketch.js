let bands = [];
const numBands = 8;
const speed = 0.01;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize bands with random properties
  for (let i = 0; i < numBands; i++) {
    bands.push({
      angle: random(TWO_PI),
      speed: random(0.005, 0.02),
      hue: random(360),
      width: random(100, 200),
      segments: floor(random(3, 8)),
      distortion: random(0.5, 2)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.05); // Semi-transparent background for trail effect
  
  translate(width / 2, height / 2);
  
  for (let i = 0; i < bands.length; i++) {
    let band = bands[i];
    
    // Update band properties
    band.angle += band.speed;
    band.hue = (band.hue + 0.5) % 360;
    
    // Draw the band as a series of polygons
    push();
    rotate(band.angle);
    
    noStroke();
    fill(band.hue, 90, 90, 0.8);
    
    beginShape();
    for (let j = 0; j < band.segments; j++) {
      let angle = map(j, 0, band.segments, 0, TWO_PI);
      let radius = band.width * (1 + sin(frameCount * speed + angle * band.distortion) * 0.3);
      let x = cos(angle) * radius;
      let y = sin(angle) * radius;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
