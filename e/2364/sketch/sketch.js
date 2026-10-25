function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  angleMode(RADIANS);
  
  // Initialize clockwork components
  gears = [];
  planets = [];
  cams = [];
  
  // Create gears
  for (let i = 0; i < 8; i++) {
    gears.push({
      radius: random(30, 60),
      speed: random(0.01, 0.05),
      angle: random(TWO_PI),
      x: 0,
      y: 0,
      teeth: floor(random(12, 20)),
      hue: random(20, 40)
    });
  }
  
  // Create planets
  for (let i = 0; i < 5; i++) {
    planets.push({
      radius: random(8, 15),
      speed: random(0.005, 0.02),
      angle: random(TWO_PI),
      distance: random(100, 250),
      hue: random(180, 240),
      orbitSpeed: random(0.002, 0.008)
    });
  }
  
  // Create cams
  for (let i = 0; i < 3; i++) {
    cams.push({
      radius: random(20, 40),
      speed: random(0.02, 0.06),
      angle: random(TWO_PI),
      x: 0,
      y: 0,
      points: floor(random(8, 12)),
      hue: random(250, 300)
    });
  }
  
  // Create connecting lines
  connections = [];
  for (let i = 0; i < 100; i++) {
    connections.push({
      x1: random(-width/2, width/2),
      y1: random(-height/2, height/2),
      x2: random(-width/2, width/2),
      y2: random(-height/2, height/2),
      hue: random(180, 240),
      alpha: random(0.3, 0.7)
    });
  }
}

function draw() {
  background(240, 10, 5, 1);
  
  const time = frameCount * 0.01;
  
  // Center the scene
  translate(0, 0, -200);
  
  // Draw connecting lines
  for (let i = 0; i < connections.length; i++) {
    const conn = connections[i];
    stroke(conn.hue, 80, 90, conn.alpha);
    strokeWeight(0.5);
    line(conn.x1, conn.y1, 0, conn.x2, conn.y2, 0);
  }
  
  // Draw gears
  for (let i = 0; i < gears.length; i++) {
    const gear = gears[i];
    
    push();
    translate(gear.x, gear.y);
    rotate(gear.angle);
    
    // Gear teeth
    fill(gear.hue, 70, 80);
    for (let j = 0; j < gear.teeth; j++) {
      const angle = TWO_PI / gear.teeth * j;
      const toothX = cos(angle) * gear.radius;
      const toothY = sin(angle) * gear.radius;
      
      push();
      translate(toothX, toothY);
      rotate(angle);
      rect(0, -5, 8, 10);
      pop();
    }
    
    // Gear center
    fill(gear.hue, 60, 90);
    ellipse(0, 0, gear.radius * 2, gear.radius * 2);
    
    pop();
    
    // Update gear angle
    gear.angle += gear.speed;
  }
  
  // Draw planets and their orbits
  for (let i = 0; i < planets.length; i++) {
    const planet = planets[i];
    
    push();
    rotate(planet.orbitSpeed * time);
    translate(planet.distance, 0);
    
    // Orbit path
    noFill();
    stroke(180, 30, 80, 0.2);
    strokeWeight(0.5);
    ellipse(0, 0, planet.distance * 2, planet.distance * 2);
    
    // Planet
    fill(planet.hue, 80, 90);
    noStroke();
    sphere(planet.radius);
    
    pop();
    
    // Update planet angle
    planet.angle += planet.speed;
  }
  
  // Draw cams
  for (let i = 0; i < cams.length; i++) {
    const cam = cams[i];
    
    push();
    translate(cam.x, cam.y);
    rotate(cam.angle);
    
    // Cam shape
    fill(cam.hue, 80, 90);
    beginShape();
    for (let j = 0; j < cam.points; j++) {
      const angle = TWO_PI / cam.points * j;
      const x = cos(angle) * cam.radius;
      const y = sin(angle) * cam.radius;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    pop();
    
    // Update cam angle
    cam.angle += cam.speed;
  }
  
  // Create interlocking connections
  stroke(180, 50, 70, 0.3);
  strokeWeight(1);
  noFill();
  
  beginShape(LINES);
  
  for (let i = 0; i < gears.length; i++) {
    const gear = gears[i];
    const nextGear = gears[(i + 1) % gears.length];
    
    // Connect gears
    const dx = nextGear.x - gear.x;
    const dy = nextGear.y - gear.y;
    const dist = sqrt(dx * dx + dy * dy);
    
    if (dist < 200) {
      vertex(gear.x, gear.y, 0);
      vertex(nextGear.x, nextGear.y, 0);
    }
  }
  
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
