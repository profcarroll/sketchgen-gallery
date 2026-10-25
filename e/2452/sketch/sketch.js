let cracks = [];
let heatParticles = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create obsidian slab with crack patterns
  for (let i = 0; i < 500; i++) {
    cracks.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-100, 100),
      length: random(20, 80),
      angle: random(TWO_PI),
      depth: random(5, 20),
      hue: random(20, 30), // Dark gray to black
      saturation: random(5, 15),
      brightness: random(10, 25),
      segments: floor(random(2, 6)),
      timeOffset: random(TWO_PI)
    });
  }
  
  // Create heat particles that spread from cracks
  for (let i = 0; i < 300; i++) {
    heatParticles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-100, 100),
      size: random(1, 3),
      speed: random(0.5, 2),
      life: random(0.5, 1),
      hue: random(10, 30), // Warm orange to red
      saturation: random(80, 100),
      brightness: random(60, 100),
      timeOffset: random(TWO_PI)
    });
  }
}

function draw() {
  background(0, 0, 5); // Deep dark obsidian
  ambientLight(30);
  pointLight(255, 255, 255, 0, 0, 300);
  
  let time = millis() * 0.001;
  
  // Center the view
  translate(0, 0, -400);
  
  // Slow rotation
  rotateY(time * 0.01);
  rotateX(sin(time * 0.05) * 0.03);
  
  // Draw crack patterns in obsidian
  noStroke();
  for (let i = 0; i < cracks.length; i++) {
    let crack = cracks[i];
    
    push();
    translate(crack.x, crack.y, crack.z);
    rotateZ(crack.angle);
    
    // Create jagged crack effect
    fill(crack.hue, crack.saturation, crack.brightness);
    beginShape();
    for (let j = 0; j < crack.segments; j++) {
      let segmentAngle = map(j, 0, crack.segments-1, 0, TWO_PI);
      let radius = crack.length * (0.5 + 0.5 * sin(time + crack.timeOffset + segmentAngle));
      let x = cos(segmentAngle) * radius;
      let y = sin(segmentAngle) * radius;
      vertex(x, y, crack.depth);
    }
    endShape(CLOSE);
    
    pop();
  }
  
  // Draw heat particles spreading from cracks
  noFill();
  strokeWeight(1);
  beginShape(LINES);
  for (let i = 0; i < heatParticles.length; i++) {
    let particle = heatParticles[i];
    let pulse = sin(time * 2 + particle.timeOffset) * 0.5 + 0.5;
    
    // Update position
    particle.x += cos(particle.angle) * particle.speed;
    particle.y += sin(particle.angle) * particle.speed;
    particle.life -= 0.001;
    
    // Reset if particle dies or goes off screen
    if (particle.life <= 0 || 
        abs(particle.x) > width/2 + 50 || 
        abs(particle.y) > height/2 + 50) {
      particle.x = random(-width/2, width/2);
      particle.y = random(-height/2, height/2);
      particle.z = random(-100, 100);
      particle.life = random(0.5, 1);
      particle.angle = random(TWO_PI);
    }
    
    // Draw glow trails
    let hue = (particle.hue + pulse * 20) % 360;
    stroke(hue, particle.saturation, particle.brightness, particle.life * 0.8);
    
    vertex(particle.x, particle.y, particle.z);
    vertex(particle.x - cos(particle.angle) * particle.size * 2,
           particle.y - sin(particle.angle) * particle.size * 2,
           particle.z);
  }
  endShape();
}

function mousePressed() {
  // Briefly intensify heat on click
  for (let i = 0; i < heatParticles.length; i++) {
    heatParticles[i].speed *= 2;
  }
  setTimeout(() => {
    for (let i = 0; i < heatParticles.length; i++) {
      heatParticles[i].speed /= 2;
    }
  }, 500);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
