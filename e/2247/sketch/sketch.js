let veins = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create mineral veins
  for (let i = 0; i < 200; i++) {
    veins.push({
      pos: createVector(
        random(-width/4, width/4),
        random(-height/4, height/4),
        random(-100, 100)
      ),
      growth: random(0.001, 0.005),
      size: random(2, 8),
      hue: random(180, 240),
      age: 0
    });
  }
}

function draw() {
  background(0);
  noStroke();
  
  // Rotate view slowly
  rotateY(time * 0.001);
  rotateX(sin(time * 0.0005) * 0.2);
  
  time++;
  
  // Draw veins
  for (let i = 0; i < veins.length; i++) {
    const v = veins[i];
    
    // Grow vein
    v.age += v.growth;
    
    // Draw main vein
    push();
    translate(v.pos.x, v.pos.y, v.pos.z);
    
    // Glow effect based on age
    const bright = map(v.age, 0, 1, 30, 90);
    fill(v.hue, 80, bright, 0.8);
    
    sphere(v.size * v.age, 4, 3);
    
    pop();
    
    // Draw connections to nearby veins
    beginShape(LINES);
    for (let j = i + 1; j < veins.length; j++) {
      const v2 = veins[j];
      const d = p5.Vector.dist(v.pos, v2.pos);
      
      if (d < 80) {
        // Connection intensity based on distance
        const intensity = map(d, 0, 80, 1, 0.1);
        const hue = (v.hue + v2.hue) / 2;
        
        stroke(hue, 90, map(intensity, 0, 1, 40, 90), 0.6);
        
        vertex(v.pos.x, v.pos.y, v.pos.z);
        vertex(v2.pos.x, v2.pos.y, v2.pos.z);
      }
    }
    endShape();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
