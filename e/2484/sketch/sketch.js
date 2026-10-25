let gears = [];
let cams = [];
let levers = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  
  // Create gears with varying sizes and positions
  for (let i = 0; i < 8; i++) {
    const radius = map(i, 0, 8, 30, 120);
    const x = width * 0.5 + cos(i * 0.5) * 200;
    const y = height * 0.5 + sin(i * 0.5) * 200;
    gears.push({
      x: x,
      y: y,
      radius: radius,
      speed: map(i, 0, 8, 0.01, 0.05),
      teeth: round(map(i, 0, 8, 12, 36))
    });
  }
  
  // Create cam systems
  for (let i = 0; i < 6; i++) {
    const x = width * 0.3 + i * 50;
    const y = height * 0.7 + sin(i) * 30;
    cams.push({
      x: x,
      y: y,
      radius: map(i, 0, 6, 15, 40),
      speed: map(i, 0, 6, 0.02, 0.08),
      phase: i * 0.5
    });
  }
  
  // Create levers
  for (let i = 0; i < 15; i++) {
    const x = width * 0.7 + cos(i) * 100;
    const y = height * 0.3 + sin(i) * 100;
    levers.push({
      x: x,
      y: y,
      length: map(i, 0, 15, 40, 120),
      speed: map(i, 0, 15, 0.005, 0.02),
      phase: i * 0.3
    });
  }
}

function draw() {
  background(20, 15, 10);
  
  time += 0.02;
  
  // Draw gears
  for (let i = 0; i < gears.length; i++) {
    const gear = gears[i];
    
    push();
    translate(gear.x, gear.y);
    
    // Draw gear outline
    stroke(180, 160, 120);
    strokeWeight(3);
    noFill();
    circle(0, 0, gear.radius * 2);
    
    // Draw teeth
    strokeWeight(2);
    for (let j = 0; j < gear.teeth; j++) {
      const angle = (TWO_PI / gear.teeth) * j + time * gear.speed;
      const x1 = cos(angle) * (gear.radius - 5);
      const y1 = sin(angle) * (gear.radius - 5);
      const x2 = cos(angle) * (gear.radius + 5);
      const y2 = sin(angle) * (gear.radius + 5);
      
      line(x1, y1, x2, y2);
    }
    
    // Draw center
    fill(100, 80, 60);
    noStroke();
    circle(0, 0, gear.radius * 0.3);
    
    pop();
  }
  
  // Draw cam systems
  for (let i = 0; i < cams.length; i++) {
    const cam = cams[i];
    
    push();
    translate(cam.x, cam.y);
    
    // Draw cam shape
    stroke(180, 160, 120);
    strokeWeight(2);
    noFill();
    ellipse(0, 0, cam.radius * 2, cam.radius * 1.5);
    
    // Draw follower
    const angle = time * cam.speed + cam.phase;
    const followerX = cos(angle) * (cam.radius - 10);
    const followerY = sin(angle) * (cam.radius - 10);
    
    stroke(200, 180, 140);
    line(0, 0, followerX, followerY);
    
    // Draw follower circle
    fill(150, 130, 90);
    noStroke();
    ellipse(followerX, followerY, 8, 8);
    
    pop();
  }
  
  // Draw levers
  for (let i = 0; i < levers.length; i++) {
    const lever = levers[i];
    
    push();
    translate(lever.x, lever.y);
    
    // Draw lever shaft
    stroke(180, 160, 120);
    strokeWeight(4);
    line(-lever.length/2, 0, lever.length/2, 0);
    
    // Draw lever arm
    const angle = sin(time * lever.speed + lever.phase) * 0.5;
    const endX = cos(angle) * (lever.length/2 - 10);
    const endY = sin(angle) * (lever.length/2 - 10);
    
    stroke(200, 180, 140);
    strokeWeight(2);
    line(-lever.length/2, 0, endX, endY);
    
    // Draw pivot point
    fill(100, 80, 60);
    noStroke();
    ellipse(-lever.length/2, 0, 8, 8);
    
    pop();
  }
  
  // Add some brass highlights
  stroke(255, 255, 220, 30);
  strokeWeight(1);
  for (let i = 0; i < 100; i++) {
    const x = (time * 0.05 + i) * 50 % width;
    const y = (time * 0.03 + i) * 40 % height;
    point(x, y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
