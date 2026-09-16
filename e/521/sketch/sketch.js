let splines = [];
let core;
let angle = 0;

function setup() {
  createCanvas(600, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  core = {
    pos: createVector(0, 0),
    radius: 40,
    hue: 20,
    saturation: 80,
    brightness: 90
  };
  
  for (let i = 0; i < 8; i++) {
    splines.push({
      angle: random(TWO_PI),
      distance: random(150, 300),
      speed: random(0.005, 0.02),
      hue: random(40, 80),
      saturation: random(60, 90),
      brightness: random(70, 90),
      segments: 100,
      points: []
    });
  }
}

function draw() {
  background(0);
  
  angle += 0.002;
  
  // Draw core
  push();
  translate(core.pos.x, core.pos.y);
  noStroke();
  fill(core.hue, core.saturation, core.brightness, 1);
  sphere(core.radius);
  pop();
  
  // Draw glowing core effect
  push();
  translate(core.pos.x, core.pos.y);
  noFill();
  strokeWeight(2);
  stroke(core.hue, core.saturation, core.brightness, 0.5);
  sphere(core.radius * 1.5);
  pop();
  
  // Draw splines
  for (let s of splines) {
    s.angle += s.speed;
    
    let x = cos(s.angle) * s.distance;
    let y = sin(s.angle) * s.distance;
    
    // Update points
    s.points = [];
    for (let i = 0; i < s.segments; i++) {
      let t = map(i, 0, s.segments - 1, 0, TWO_PI);
      let px = x + cos(t + angle) * 20;
      let py = y + sin(t + angle) * 20;
      
      s.points.push(createVector(px, py));
    }
    
    // Draw spline
    push();
    translate(s.distance * cos(s.angle), s.distance * sin(s.angle));
    stroke(s.hue, s.saturation, s.brightness, 0.8);
    noFill();
    strokeWeight(2);
    beginShape();
    for (let p of s.points) {
      vertex(p.x, p.y);
    }
    endShape(CLOSE);
    pop();
    
    // Draw prism effect
    push();
    translate(s.distance * cos(s.angle), s.distance * sin(s.angle));
    strokeWeight(1);
    noFill();
    for (let i = 0; i < s.points.length - 1; i++) {
      let p1 = s.points[i];
      let p2 = s.points[i + 1];
      
      stroke(
        (s.hue + i * 5) % 360,
        s.saturation,
        s.brightness,
        0.7
      );
      line(p1.x, p1.y, p2.x, p2.y);
    }
    pop();
  }
}
