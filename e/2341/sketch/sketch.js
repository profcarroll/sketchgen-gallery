let circuits = [];
let worlds = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  
  // Create circuit board grid
  for (let x = 0; x < width; x += random(40, 80)) {
    for (let y = 0; y < height; y += random(40, 80)) {
      circuits.push({
        x: x,
        y: y,
        width: random(20, 40),
        height: random(20, 40),
        color: color(random(30, 60), random(50, 90), random(100, 150), random(150, 200)),
        pulse: random(TWO_PI)
      });
    }
  }
  
  // Create miniature worlds
  for (let i = 0; i < 8; i++) {
    worlds.push({
      x: random(width),
      y: random(height),
      size: random(30, 70),
      color: color(random(150, 255), random(100, 200), random(200, 255), random(200, 255)),
      pulse: random(TWO_PI),
      speed: random(0.005, 0.02),
      rotation: random(TWO_PI),
      glow: random(100, 200)
    });
  }
}

function draw() {
  time += 0.01;
  
  // Dark retro-futuristic background
  background(10, 5, 20);
  
  // Draw flowing liquid circuitry
  for (let circuit of circuits) {
    circuit.pulse += 0.02;
    
    // Draw circuit board pattern
    fill(circuit.color);
    noStroke();
    rect(circuit.x, circuit.y, circuit.width, circuit.height);
    
    // Draw glowing connections
    stroke(100, 200, 255, 80);
    strokeWeight(2);
    line(circuit.x + circuit.width/2, circuit.y, 
         circuit.x + circuit.width/2, circuit.y + circuit.height);
    line(circuit.x, circuit.y + circuit.height/2, 
         circuit.x + circuit.width, circuit.y + circuit.height/2);
    
    // Draw flowing liquid effect
    let flowOffset = sin(time + circuit.x * 0.01) * 5;
    stroke(50, 150, 255, 100);
    strokeWeight(1);
    for (let i = 0; i < 5; i++) {
      let y = circuit.y + i * (circuit.height / 5) + flowOffset;
      line(circuit.x, y, circuit.x + circuit.width, y);
    }
  }
  
  // Draw miniature worlds
  for (let world of worlds) {
    world.pulse += world.speed;
    world.rotation += 0.002;
    
    push();
    translate(world.x, world.y);
    rotate(world.rotation);
    
    // Glow effect
    let glowSize = world.size * (1 + sin(world.pulse) * 0.3);
    let glowAlpha = map(sin(world.pulse), -1, 1, 50, 150);
    
    fill(255, 255, 255, glowAlpha);
    noStroke();
    ellipse(0, 0, glowSize * 1.5, glowSize * 1.5);
    
    // World body
    fill(world.color);
    ellipse(0, 0, glowSize, glowSize);
    
    // Bioluminescent details
    let detail = sin(world.pulse + time) * 0.5 + 0.5;
    fill(255, 255, 255, detail * 100);
    ellipse(0, 0, glowSize * 0.6, glowSize * 0.6);
    
    // Draw pulsing rings
    for (let i = 0; i < 3; i++) {
      let ringSize = glowSize + i * 10;
      let ringAlpha = map(i, 0, 2, 50, 0);
      stroke(100, 200, 255, ringAlpha);
      strokeWeight(1);
      noFill();
      ellipse(0, 0, ringSize, ringSize);
    }
    
    pop();
  }
  
  // Draw overall glow overlay
  blendMode(DIFFERENCE);
  fill(255, 255, 255, 5);
  noStroke();
  rect(0, 0, width, height);
  blendMode(BLEND);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
