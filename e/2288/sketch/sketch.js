let crystals = [];
let pulse = 0;
let noiseScale = 0.01;
let crystalGrowth = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize crystals
  for (let i = 0; i < 20; i++) {
    crystals.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-500, 500),
      size: random(10, 30),
      growth: 0,
      maxGrowth: random(100, 300),
      hue: random(200, 300), // Blue-green range
      stable: false,
      time: random(100)
    });
  }
}

function draw() {
  background(0);
  
  // Update pulse effect
  pulse = sin(frameCount * 0.02) * 0.3 + 0.7;
  
  // Draw crystals
  for (let crystal of crystals) {
    push();
    
    translate(crystal.x, crystal.y, crystal.z);
    
    // Slowly rotate crystals
    rotateX(frameCount * 0.001);
    rotateY(frameCount * 0.002);
    
    // Pulsing effect
    let scale = 1 + sin(frameCount * 0.03 + crystal.time) * 0.2;
    scale *= pulse;
    
    // Only draw if growing or stable
    if (crystal.growth > 0 || crystal.stable) {
      noStroke();
      
      // Glow effect
      fill(crystal.hue, 80, 100, 0.8);
      sphere(crystal.size * scale * 0.5, 6, 4);
      
      // Crystal structure
      fill(crystal.hue, 100, 100, 0.3);
      for (let i = 0; i < 8; i++) {
        let angle = TWO_PI * i / 8;
        let x = cos(angle) * crystal.size * scale * 0.8;
        let y = sin(angle) * crystal.size * scale * 0.8;
        push();
        translate(x, y, 0);
        sphere(crystal.size * scale * 0.2, 4, 3);
        pop();
      }
      
      // Growth effect
      if (crystal.growth < crystal.maxGrowth && !crystal.stable) {
        let growth = map(crystal.growth, 0, crystal.maxGrowth, 0, 1);
        fill(crystal.hue, 80, 100, 0.5);
        sphere(crystal.size * scale * (1 + growth * 0.3), 6, 4);
      }
    }
    
    pop();
    
    // Update crystal state
    if (!crystal.stable) {
      crystal.growth += 0.5;
      if (crystal.growth >= crystal.maxGrowth) {
        crystal.stable = true;
      }
    } else {
      // Add slight movement to stable crystals
      crystal.x += sin(frameCount * 0.01 + crystal.time) * 0.2;
      crystal.y += cos(frameCount * 0.015 + crystal.time) * 0.2;
    }
    
    // Reset position occasionally for continuous flow
    if (frameCount % 300 === 0 && !crystal.stable) {
      crystal.x = random(-width/2, width/2);
      crystal.y = random(-height/2, height/2);
      crystal.z = random(-500, 500);
      crystal.growth = 0;
      crystal.maxGrowth = random(100, 300);
      crystal.stable = false;
    }
  }
  
  // Add subtle noise to crystal positions for organic feel
  for (let crystal of crystals) {
    if (!crystal.stable) {
      let n = noise(crystal.x * noiseScale, crystal.y * noiseScale, frameCount * 0.01);
      crystal.x += (n - 0.5) * 0.3;
      crystal.y += (n - 0.5) * 0.3;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
