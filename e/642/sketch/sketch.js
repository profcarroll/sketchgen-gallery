let rings = [];
let numRings = 20;
let maxRadius = 300;

function setup() {
  createCanvas(600, 600);
  angleMode(RADIANS);
  
  for (let i = 0; i < numRings; i++) {
    rings.push({
      radius: map(i, 0, numRings - 1, 20, maxRadius),
      speed: map(i, 0, numRings - 1, 0.005, 0.02),
      amp: map(i, 0, numRings - 1, 0, 30),
      hueOffset: map(i, 0, numRings - 1, 0, 360)
    });
  }
}

function draw() {
  background(0);
  translate(width / 2, height / 2);
  
  let time = millis() * 0.001;
  
  for (let i = 0; i < rings.length; i++) {
    let ring = rings[i];
    let hue = (time * ring.speed * 20 + ring.hueOffset) % 360;
    stroke(hue, 100, 100, 200);
    noFill();
    
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.05) {
      let x = ring.radius * cos(a);
      let y = ring.radius * sin(a);
      
      let ripple = sin(time * ring.speed + a * 3) * ring.amp;
      let r = ring.radius + ripple;
      
      let px = r * cos(a);
      let py = r * sin(a);
      vertex(px, py);
    }
    endShape(CLOSE);
  }
}
