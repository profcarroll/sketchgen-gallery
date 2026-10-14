let dominoes = [];
let blooms = [];
let noiseScale = 0.01;
let noiseStrength = 3;
let bloomSpeed = 0.3;
let dominoFallSpeed = 2;
let pendulumAngle = 0;
let pendulumSpeed = 0.01;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create initial dominoes in a row
  for (let i = 0; i < 15; i++) {
    dominoes.push({
      x: -width/2 + i * 40,
      y: -height/3,
      z: 0,
      fallen: false,
      fallTime: 0,
      height: 20,
      width: 5,
      depth: 5
    });
  }
}

function draw() {
  background(0);
  
  // Update pendulum
  pendulumAngle = sin(frameCount * pendulumSpeed) * 0.3;
  
  // Update dominoes and trigger blooms
  for (let i = 0; i < dominoes.length; i++) {
    let d = dominoes[i];
    
    if (!d.fallen) {
      // Start falling after a delay
      if (frameCount > 30 + i * 5) {
        d.fallen = true;
      }
    } else {
      // Animate fall
      d.z += dominoFallSpeed;
      d.y += dominoFallSpeed;
      
      // Trigger bloom when domino hits bottom
      if (d.z > height/4) {
        blooms.push({
          x: d.x,
          y: d.y,
          z: d.z,
          radius: 5,
          alpha: 1,
          hue: random(10, 40), // Orange-red range
          growthRate: random(0.5, 1.5),
          id: frameCount,
          crystalGrowth: random(0.1, 0.3)
        });
      }
    }
    
    // Draw domino
    push();
    translate(d.x, d.y, d.z);
    rotateX(HALF_PI);
    noStroke();
    fill(d.fallen ? 30 : 200, 100, 100, 0.9); // Dark gray or white
    box(d.width, d.height, d.depth);
    pop();
  }
  
  // Update and display blooms
  for (let i = blooms.length - 1; i >= 0; i--) {
    let b = blooms[i];
    
    // Animate bloom
    b.radius += b.growthRate;
    b.alpha -= 0.005;
    
    // Add organic noise to position
    let n = noise(b.x * noiseScale, b.y * noiseScale, frameCount * 0.01) * noiseStrength;
    b.x += n;
    
    // Add crystal growth effect
    if (frameCount % 3 === 0) {
      b.radius += b.crystalGrowth;
    }
    
    // Draw bloom with glow effect and crystalline structure
    push();
    translate(b.x, b.y, b.z);
    
    // Create a pulsing effect for crystals
    let pulse = sin(frameCount * 0.05) * 0.1 + 1;
    scale(pulse);
    
    noStroke();
    fill(b.hue, 100, 100, b.alpha);
    sphere(b.radius, 6, 4); // Lower detail for performance
    
    // Add a crystalline highlight
    fill(b.hue, 100, 100, b.alpha * 0.5);
    sphere(b.radius * 0.7, 4, 3);
    
    pop();
    
    // Remove old blooms
    if (b.alpha <= 0 || b.radius > width) {
      blooms.splice(i, 1);
    }
  }
  
  // Occasionally create new blooms from random positions
  if (frameCount % 60 === 0 && random() < 0.3) {
    blooms.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: 0,
      radius: random(5, 15),
      alpha: random(0.7, 1),
      hue: random(10, 40),
      growthRate: random(0.3, 1.0),
      id: frameCount,
      crystalGrowth: random(0.05, 0.2)
    });
  }
  
  // Apply pendulum effect to the entire scene
  rotateY(pendulumAngle);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
