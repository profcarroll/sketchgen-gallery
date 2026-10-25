let gears = [];
let springs = [];
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pixelDensity(1);
  
  // Create interlocking gears
  for (let i = 0; i < 8; i++) {
    let angle = map(i, 0, 8, 0, TWO_PI);
    let distance = 150 + i * 30;
    let x = cos(angle) * distance;
    let y = sin(angle) * distance;
    
    gears.push({
      x: x,
      y: y,
      radius: 20 + i * 2,
      rotation: random(TWO_PI),
      teeth: 12 + i % 3 * 4,
      speed: 0.005 + i * 0.001
    });
  }
  
  // Create springs connecting gears
  for (let i = 0; i < gears.length; i++) {
    let j = (i + 1) % gears.length;
    springs.push({
      start: { x: gears[i].x, y: gears[i].y },
      end: { x: gears[j].x, y: gears[j].y },
      length: dist(gears[i].x, gears[i].y, gears[j].x, gears[j].y),
      stiffness: 0.1 + random(0.2)
    });
  }
  
  // Create particles for dynamic movement
  for (let i = 0; i < 300; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-100, 100),
      size: random(0.5, 2),
      speed: random(0.01, 0.03),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(30, 30, 40);
  
  // Create a subtle ambient light
  ambientLight(50);
  pointLight(200, 200, 200, 0, 0, 100);
  
  // Animate gears
  for (let gear of gears) {
    gear.rotation += gear.speed;
    
    push();
    translate(gear.x, gear.y);
    rotateZ(gear.rotation);
    
    // Draw gear teeth
    stroke(200, 180, 150);
    strokeWeight(1);
    noFill();
    
    beginShape();
    for (let i = 0; i < gear.teeth; i++) {
      let angle = map(i, 0, gear.teeth, 0, TWO_PI);
      let x = cos(angle) * gear.radius;
      let y = sin(angle) * gear.radius;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Draw inner circle
    ellipse(0, 0, gear.radius * 0.5, gear.radius * 0.5);
    
    pop();
  }
  
  // Animate springs
  for (let spring of springs) {
    let dx = spring.end.x - spring.start.x;
    let dy = spring.end.y - spring.start.y;
    let currentLength = dist(spring.start.x, spring.start.y, spring.end.x, spring.end.y);
    let force = (currentLength - spring.length) * spring.stiffness;
    
    let fx = dx / currentLength * force * 0.5;
    let fy = dy / currentLength * force * 0.5;
    
    // Apply spring force to gear positions
    for (let gear of gears) {
      if (dist(gear.x, gear.y, spring.start.x, spring.start.y) < 30) {
        gear.x += fx;
        gear.y += fy;
      }
      if (dist(gear.x, gear.y, spring.end.x, spring.end.y) < 30) {
        gear.x -= fx;
        gear.y -= fy;
      }
    }
    
    // Draw spring
    stroke(180, 160, 140);
    strokeWeight(1);
    line(spring.start.x, spring.start.y, spring.end.x, spring.end.y);
  }
  
  // Animate particles
  for (let p of particles) {
    p.z += p.speed;
    p.phase += 0.02;
    
    let x = p.x + sin(p.phase) * 5;
    let y = p.y + cos(p.phase) * 5;
    let z = p.z;
    
    push();
    translate(x, y, z);
    
    noStroke();
    fill(255, 180, 120, 150);
    sphere(p.size, 4, 3);
    
    pop();
  }
  
  // Add dynamic lighting effect
  blendMode(ADD);
  fill(0, 0, 0, 5);
  noStroke();
  rect(-width/2, -height/2, width, height);
  blendMode(BLEND);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
