let gears = [];
let levers = [];
let pipes = [];
let clock;
let brassColor;
let minuteMarkers = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create the main clock structure
  clock = {
    centerX: 0,
    centerY: 0,
    radius: min(width, height) * 0.4,
    innerRadius: min(width, height) * 0.35,
    outerRadius: min(width, height) * 0.45
  };
  
  // Create brass-like color
  brassColor = color(30, 30, 80);
  
  // Create gears
  for (let i = 0; i < 8; i++) {
    let angle = map(i, 0, 8, 0, TWO_PI);
    let r = clock.innerRadius + random(20, 60);
    let size = random(15, 30);
    gears.push({
      angle: angle,
      radius: r,
      size: size,
      speed: random(0.005, 0.02),
      rotation: random(TWO_PI),
      teeth: floor(random(8, 16)),
      color: color(random(30, 60), 80, 90)
    });
  }
  
  // Create levers
  for (let i = 0; i < 12; i++) {
    let angle = map(i, 0, 12, 0, TWO_PI);
    let r = clock.innerRadius + random(30, 80);
    levers.push({
      angle: angle,
      radius: r,
      length: random(20, 40),
      speed: random(0.002, 0.01),
      rotation: random(TWO_PI),
      color: color(random(30, 60), 80, 90)
    });
  }
  
  // Create pipes
  for (let i = 0; i < 20; i++) {
    let angle = random(TWO_PI);
    let r = clock.radius * random(0.3, 0.8);
    let length = random(20, 80);
    pipes.push({
      angle: angle,
      radius: r,
      length: length,
      speed: random(0.001, 0.005),
      phase: random(TWO_PI),
      color: color(random(30, 60), 80, 90)
    });
  }
  
  // Create minute markers
  for (let i = 0; i < 60; i++) {
    let angle = map(i, 0, 60, 0, TWO_PI);
    let r = clock.radius - 15;
    minuteMarkers.push({
      angle: angle,
      radius: r
    });
  }
}

function draw() {
  background(0);
  
  // Center the drawing
  translate(width/2, height/2);
  
  // Draw clock face (brass-like surface)
  noStroke();
  fill(brassColor);
  sphere(clock.radius * 1.1);
  
  // Draw inner clock face
  fill(color(40, 20, 70));
  sphere(clock.innerRadius);
  
  // Draw gears
  for (let i = 0; i < gears.length; i++) {
    let gear = gears[i];
    gear.rotation += gear.speed;
    
    push();
    rotate(gear.angle);
    translate(0, -gear.radius);
    
    // Draw gear teeth
    fill(gear.color);
    for (let j = 0; j < gear.teeth; j++) {
      let toothAngle = map(j, 0, gear.teeth, 0, TWO_PI);
      rotate(toothAngle);
      push();
      translate(0, -gear.size * 0.5);
      rectMode(CENTER);
      rect(0, 0, gear.size * 0.2, gear.size);
      pop();
      rotate(-toothAngle);
    }
    
    // Draw gear center
    fill(color(30, 40, 60));
    sphere(gear.size * 0.5);
    
    pop();
  }
  
  // Draw levers
  for (let i = 0; i < levers.length; i++) {
    let lever = levers[i];
    lever.rotation += lever.speed;
    
    push();
    rotate(lever.angle);
    translate(0, -lever.radius);
    
    fill(lever.color);
    // Draw lever body
    rotate(lever.rotation);
    rectMode(CENTER);
    rect(0, 0, 5, lever.length);
    
    // Draw lever end (ball)
    fill(color(30, 40, 60));
    sphere(8);
    
    pop();
  }
  
  // Draw pipes
  for (let i = 0; i < pipes.length; i++) {
    let pipe = pipes[i];
    pipe.phase += pipe.speed;
    
    push();
    rotate(pipe.angle);
    translate(0, -pipe.radius);
    
    fill(pipe.color);
    // Draw pipe segment
    rotate(pipe.phase * 0.5);
    rectMode(CENTER);
    rect(0, 0, 8, pipe.length);
    
    pop();
  }
  
  // Draw center hub
  fill(color(30, 40, 60));
  sphere(20);
  
  // Draw minute markers
  for (let i = 0; i < minuteMarkers.length; i++) {
    let marker = minuteMarkers[i];
    push();
    rotate(marker.angle);
    translate(0, -marker.radius);
    fill(color(20, 30, 80));
    sphere(2);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
