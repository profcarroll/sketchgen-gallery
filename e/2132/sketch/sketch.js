let crystals = [];
let snowflakes = [];
let time = 0;
let season = 0; // 0: spring, 1: summer, 2: fall, 3: winter

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create crystal structures
  for (let i = 0; i < 20; i++) {
    crystals.push({
      x: random(-width/3, width/3),
      y: random(-height/3, height/3),
      z: random(-100, 100),
      size: random(20, 80),
      angle: random(TWO_PI),
      speed: random(0.001, 0.005),
      color: color(random(20, 40), 80, 60),
      growth: 0,
      phase: i % 4
    });
  }
  
  // Create initial snowflakes
  for (let i = 0; i < 100; i++) {
    snowflakes.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-200, 200),
      size: random(2, 6),
      speed: random(0.5, 1.5),
      sway: random(TWO_PI)
    });
  }
}

function draw() {
  background(0, 0, 10);
  
  // Center the view
  translate(0, 0, -300);
  
  time += 0.01;
  season = (time * 0.02) % 4;
  
  // Draw crystal structures
  for (let crystal of crystals) {
    crystal.angle += crystal.speed;
    
    push();
    translate(crystal.x, crystal.y, crystal.z);
    rotateY(crystal.angle);
    
    // Crystal growth animation
    let growth = sin(time * 0.5 + crystal.phase) * 0.5 + 0.5;
    let scale = crystal.size * (0.8 + growth * 0.4);
    
    // Draw crystal structure using geometric shapes
    fill(crystal.color);
    noStroke();
    
    // Base crystal shape (hexagonal prism)
    for (let i = 0; i < 6; i++) {
      let angle = TWO_PI * i / 6;
      let x1 = cos(angle) * scale * 0.5;
      let y1 = sin(angle) * scale * 0.5;
      let x2 = cos(angle + TWO_PI/6) * scale * 0.5;
      let y2 = sin(angle + TWO_PI/6) * scale * 0.5;
      
      beginShape();
      vertex(0, 0, -scale * 0.3);
      vertex(x1, y1, -scale * 0.3);
      vertex(x2, y2, -scale * 0.3);
      vertex(x2, y2, scale * 0.3);
      vertex(x1, y1, scale * 0.3);
      endShape(CLOSE);
    }
    
    // Top crystal points
    for (let i = 0; i < 6; i++) {
      let angle = TWO_PI * i / 6 + crystal.angle;
      let x = cos(angle) * scale * 0.8;
      let y = sin(angle) * scale * 0.8;
      
      push();
      translate(x, y, scale * 0.3);
      sphere(scale * 0.15);
      pop();
    }
    
    // Seasonal color transitions
    let hueShift = season * 90;
    fill((hueShift + 20) % 360, 80, 60);
    
    // Draw center base
    sphere(scale * 0.2);
    
    pop();
  }
  
  // Draw seasonal effects
  if (season > 2.5) {
    // Winter - snowfall
    for (let flake of snowflakes) {
      flake.y += flake.speed;
      flake.sway += 0.02;
      flake.x += sin(flake.sway) * 0.5;
      
      if (flake.y > height/2) {
        flake.y = -height/2;
        flake.x = random(-width/2, width/2);
      }
      
      push();
      translate(flake.x, flake.y, flake.z);
      fill(360, 0, 100);
      noStroke();
      sphere(flake.size);
      pop();
    }
  } else if (season > 1.5) {
    // Fall - leaves
    for (let i = 0; i < 100; i++) {
      let angle = time * 0.3 + i * 0.1;
      let radius = 150 + sin(time * 0.2 + i) * 50;
      let x = cos(angle) * radius;
      let y = sin(angle) * radius;
      
      let hue = (time * 20 + i * 3) % 360;
      fill(hue, 80, 90);
      noStroke();
      ellipse(x, y, 10, 10);
    }
  } else if (season > 0.5) {
    // Summer - green growth
    for (let i = 0; i < 200; i++) {
      let angle = time * 0.4 + i * 0.05;
      let radius = 100 + sin(time * 0.3 + i) * 50;
      let x = cos(angle) * radius;
      let y = sin(angle) * radius;
      
      fill(120, 80, 60);
      noStroke();
      ellipse(x, y, 8, 8);
    }
  } else {
    // Spring - bud growth
    for (let i = 0; i < 150; i++) {
      let angle = time * 0.2 + i * 0.1;
      let radius = 120 + sin(time * 0.4 + i) * 60;
      let x = cos(angle) * radius;
      let y = sin(angle) * radius;
      
      fill(60, 80, 80);
      noStroke();
      ellipse(x, y, 12, 12);
    }
  }
  
  // Draw central hill
  push();
  translate(0, height/4, 0);
  rotateX(PI/2);
  fill(20, 50, 30);
  noStroke();
  ellipse(0, 0, width * 0.8, width * 0.4);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
