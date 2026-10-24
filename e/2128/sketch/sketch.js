let gears = [];
let crystalParticles = [];
let linkages = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Create initial gear components
  for (let i = 0; i < 20; i++) {
    gears.push({
      x: random(width),
      y: random(height),
      radius: random(15, 40),
      rotation: random(TWO_PI),
      speed: random(-0.005, 0.005),
      age: 0,
      encased: false
    });
  }
  
  // Create linkages between gears
  for (let i = 0; i < 30; i++) {
    linkages.push({
      x1: random(width),
      y1: random(height),
      x2: random(width),
      y2: random(height),
      life: 1.0,
      thickness: random(1, 3)
    });
  }
  
  // Create initial crystal particles
  for (let i = 0; i < 500; i++) {
    crystalParticles.push({
      x: random(width),
      y: random(height),
      size: random(0.5, 2),
      life: 1.0,
      age: random(1000),
      hue: random(180, 240)
    });
  }
}

function draw() {
  // Very light translucent background to simulate deep time sediment
  background(200, 5, 95, 0.02);
  
  // Update and draw gears
  for (let i = gears.length - 1; i >= 0; i--) {
    let gear = gears[i];
    
    // Slow rotation to simulate time passing
    gear.rotation += gear.speed;
    gear.age += 0.005;
    
    // Encase in crystal when age reaches threshold
    if (!gear.encased && gear.age > 2) {
      for (let j = 0; j < 15; j++) {
        crystalParticles.push({
          x: gear.x + random(-gear.radius * 2, gear.radius * 2),
          y: gear.y + random(-gear.radius * 2, gear.radius * 2),
          size: random(0.5, 3),
          life: 1.0,
          age: 0,
          hue: 200 + (j % 3) * 20
        });
      }
      gear.encased = true;
    }
    
    // Draw gear with corrugated cardboard effect
    push();
    translate(gear.x, gear.y);
    rotate(gear.rotation);
    
    // Main gear body
    fill(200, 5, 80, 0.9);
    ellipse(0, 0, gear.radius * 2, gear.radius * 2);
    
    // Gear teeth - corrugated effect
    for (let j = 0; j < 12; j++) {
      let angle = TWO_PI / 12 * j;
      let toothX = cos(angle) * (gear.radius * 0.8);
      let toothY = sin(angle) * (gear.radius * 0.8);
      
      fill(200, 5, 60, 0.9);
      ellipse(toothX, toothY, gear.radius * 0.1, gear.radius * 0.3);
    }
    
    // Draw crystal particles around gear
    for (let p of crystalParticles) {
      if (dist(gear.x, gear.y, p.x, p.y) < gear.radius * 2) {
        fill(p.hue, 30, 90, p.life * 0.6);
        ellipse(p.x - gear.x, p.y - gear.y, p.size * p.life, p.size * p.life);
      }
    }
    
    pop();
  }
  
  // Update and draw linkages
  for (let i = linkages.length - 1; i >= 0; i--) {
    let linkage = linkages[i];
    
    // Slowly fade out
    linkage.life -= 0.001;
    
    if (linkage.life <= 0) {
      linkages.splice(i, 1);
      continue;
    }
    
    stroke(200, 5, 60, linkage.life * 0.7);
    strokeWeight(linkage.thickness * linkage.life);
    line(linkage.x1, linkage.y1, linkage.x2, linkage.y2);
  }
  
  // Update and draw crystal particles
  for (let i = crystalParticles.length - 1; i >= 0; i--) {
    let p = crystalParticles[i];
    
    // Slowly grow and fade
    p.size += 0.005;
    p.life -= 0.0005;
    p.age += 0.01;
    
    if (p.life <= 0) {
      crystalParticles.splice(i, 1);
      continue;
    }
    
    // Draw crystal particle with glow effect
    fill(p.hue, 30, 90, p.life * 0.6);
    noStroke();
    ellipse(p.x, p.y, p.size * p.life, p.size * p.life);
    
    // Add subtle pulsing for crystalline look
    let pulse = sin(p.age) * 0.5 + 0.5;
    fill(p.hue, 20, 95, p.life * 0.3 * pulse);
    ellipse(p.x, p.y, p.size * p.life * 0.5, p.size * p.life * 0.5);
  }
  
  // Occasionally add new particles to simulate slow sedimentation
  if (random() < 0.1 && crystalParticles.length < 1000) {
    crystalParticles.push({
      x: random(width),
      y: random(height),
      size: random(0.5, 2),
      life: 1.0,
      age: 0,
      hue: random(180, 240)
    });
  }
  
  // Occasionally add new linkages
  if (random() < 0.05 && linkages.length < 50) {
    linkages.push({
      x1: random(width),
      y1: random(height),
      x2: random(width),
      y2: random(height),
      life: 1.0,
      thickness: random(1, 3)
    });
  }
  
  // Occasionally add new gears
  if (random() < 0.01 && gears.length < 30) {
    gears.push({
      x: random(width),
      y: random(height),
      radius: random(15, 40),
      rotation: random(TWO_PI),
      speed: random(-0.005, 0.005),
      age: 0,
      encased: false
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
