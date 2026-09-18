let time = 0;
let numRings = 12;
let maxRadius = 250;

function setup() {
  createCanvas(500, 500);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
}

function draw() {
  background(0, 0, 0, 1);
  
  translate(width/2, height/2);
  time += 0.01;
  
  for (let i = 0; i < numRings; i++) {
    let radius = map(i, 0, numRings-1, 30, maxRadius);
    let angleOffset = time * (i + 1) * 0.5;
    let hue = (time * 20 + i * 30) % 360;
    
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.05) {
      let x = cos(a + angleOffset) * radius;
      let y = sin(a + angleOffset) * radius;
      let alpha = map(sin(time + a), -1, 1, 0.3, 0.8);
      
      fill(hue, 100, 100, alpha);
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Add inner ring for glow effect
    let innerRadius = radius * 0.7;
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.05) {
      let x = cos(a + angleOffset) * innerRadius;
      let y = sin(a + angleOffset) * innerRadius;
      let alpha = map(sin(time + a), -1, 1, 0.1, 0.4);
      
      fill(hue, 100, 100, alpha);
      vertex(x, y);
    }
    endShape(CLOSE);
  }
}
