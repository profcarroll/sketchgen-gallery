let gears = [];
let cams = [];
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create clockwork gears
  for (let i = 0; i < 8; i++) {
    let radius = map(i, 0, 7, 30, 120);
    let speed = map(i, 0, 7, 0.005, 0.02);
    gears.push({
      radius: radius,
      speed: speed,
      angle: random(TWO_PI),
      teeth: floor(random(12, 24)),
      hue: 30 + random(30) // Brass tones
    });
  }
  
  // Create interlocking cams
  for (let i = 0; i < 6; i++) {
    let radius = map(i, 0, 5, 10, 40);
    let speed = map(i, 0, 5, 0.01, 0.03);
    cams.push({
      radius: radius,
      speed: speed,
      angle: random(TWO_PI),
      hue: 40 + random(20) // Patina tones
    });
  }
  
  // Create floating particles representing settled material
  particles = new Array(800).fill().map(() => ({
    x: random(-width/2, width/2),
    y: random(-height/2, height/2),
    z: random(-300, 300),
    size: random(0.5, 3),
    hue: 30 + random(40), // Gold to bronze tones
    speed: random(0.001, 0.005),
    offset: random(TWO_PI),
    layer: floor(random(5)) // Assign to different strata
  }));
}

function draw() {
  background(0);
  
  // Slow rotation for the whole scene
  rotateY(frameCount * 0.0003);
  rotateX(frameCount * 0.0002);
  
  // Draw clockwork gears
  for (let i = 0; i < gears.length; i++) {
    let gear = gears[i];
    
    push();
    translate(0, 0, -50 + i * 15);
    
    // Rotate gear
    gear.angle += gear.speed;
    
    // Draw gear teeth
    noStroke();
    fill(gear.hue, 60, 80, 0.9);
    rotateZ(gear.angle);
    
    for (let j = 0; j < gear.teeth; j++) {
      let angle = map(j, 0, gear.teeth, 0, TWO_PI);
      let toothWidth = TWO_PI / gear.teeth * 0.6;
      
      push();
      rotateZ(angle);
      translate(gear.radius * 0.8, 0);
      ellipse(0, 0, toothWidth * 10, toothWidth * 20);
      pop();
    }
    
    // Draw gear center
    fill(gear.hue, 70, 90, 0.9);
    sphere(gear.radius * 0.2);
    
    pop();
  }
  
  // Draw interlocking cams
  for (let i = 0; i < cams.length; i++) {
    let cam = cams[i];
    
    push();
    translate(0, 0, -100 + i * 20);
    
    // Rotate cam
    cam.angle += cam.speed;
    
    // Draw cam shape
    noStroke();
    fill(cam.hue, 60, 70, 0.8);
    
    beginShape();
    for (let j = 0; j < 100; j++) {
      let angle = map(j, 0, 99, 0, TWO_PI);
      let radius = cam.radius + sin(angle * 3 + cam.angle) * 5;
      
      let x = cos(angle) * radius;
      let y = sin(angle) * radius;
      
      vertex(x, y, 0);
    }
    endShape(CLOSE);
    
    pop();
  }
  
  // Draw floating particles with counter-intuitive movement
  beginShape(POINTS);
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Layered motion with different speeds and patterns
    let yoff = sin(frameCount * p.speed + p.offset) * 15;
    let zoff = cos(frameCount * p.speed * 0.7 + p.offset) * 10;
    let xoff = sin(frameCount * p.speed * 0.5 + p.offset) * 12;
    
    // Apply some clockwork influence to particle motion
    let influence = 0.01;
    let gearInfluence = sin(frameCount * 0.003) * 0.5;
    let camInfluence = cos(frameCount * 0.004) * 0.3;
    
    vertex(p.x + xoff, p.y + yoff + gearInfluence * 10, p.z + zoff + camInfluence * 10);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
