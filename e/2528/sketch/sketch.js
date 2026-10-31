let particles = [];
let streams = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pixelDensity(1);
  
  // Initialize particles (glowing points)
  for (let i = 0; i < 500; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-100, 100),
      size: random(0.5, 3),
      speed: random(0.001, 0.005),
      hue: random(200, 260)
    });
  }
  
  // Initialize liquid streams
  for (let i = 0; i < 20; i++) {
    streams.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-100, 100),
      length: random(50, 150),
      speed: random(0.002, 0.008),
      width: random(2, 6)
    });
  }
}

function draw() {
  time += 0.01;
  
  background(10, 15, 25);
  
  // Ambient glow
  blendMode(ADD);
  fill(0, 0, 0, 20);
  noStroke();
  rect(-width/2, -height/2, width, height);
  blendMode(BLEND);
  
  // Draw liquid streams
  for (let stream of streams) {
    push();
    translate(stream.x, stream.y, stream.z);
    
    stroke(100, 200, 255, 150);
    strokeWeight(stream.width);
    noFill();
    
    beginShape();
    for (let i = 0; i < stream.length; i += 5) {
      let angle = time * stream.speed + i * 0.1;
      let x = cos(angle) * i;
      let y = sin(angle * 1.3) * i;
      let z = sin(time * 0.002 + i * 0.05) * 20;
      vertex(x, y, z);
    }
    endShape();
    
    pop();
  }
  
  // Draw particles as batched points
  beginShape(POINTS);
  for (let p of particles) {
    let pulse = sin(time * p.speed * 10) * 0.5 + 0.5;
    let size = p.size * pulse;
    
    fill(p.hue, 255, 255, 200);
    noStroke();
    
    // Use vertex to batch all particles into one shape call
    vertex(p.x, p.y, p.z);
  }
  endShape();
  
  // Pulsing celestial mechanisms (invisible but influencing)
  for (let i = 0; i < 3; i++) {
    let angle = time * 0.001 + i * TWO_PI / 3;
    let x = cos(angle) * 200;
    let y = sin(angle * 1.5) * 200;
    let z = sin(time * 0.002 + i) * 100;
    
    push();
    translate(x, y, z);
    
    fill(255, 255, 255, 30);
    noStroke();
    sphere(30);
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
