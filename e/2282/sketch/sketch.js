let springs = [];
let cartilage = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create cartilage structures - interwoven organic forms
  for (let i = 0; i < 150; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-300, 300);
    
    cartilage.push({
      x: x,
      y: y,
      z: z,
      size: random(5, 20),
      angle: random(TWO_PI),
      speed: random(0.01, 0.03)
    });
  }
  
  // Create steel springs - taut linear connections
  for (let i = 0; i < 800; i++) {
    let x1 = random(-width/2, width/2);
    let y1 = random(-height/2, height/2);
    let z1 = random(-300, 300);
    
    let x2 = x1 + random(-200, 200);
    let y2 = y1 + random(-200, 200);
    let z2 = z1 + random(-200, 200);
    
    springs.push({
      x1: x1,
      y1: y1,
      z1: z1,
      x2: x2,
      y2: y2,
      z2: z2
    });
  }
}

function draw() {
  background(20, 30, 5); // Deep earthy background
  
  // Slow rotation of the entire scene
  rotateY(time * 0.001);
  rotateX(sin(time * 0.0005) * 0.1);
  
  time += 0.02;
  
  // Draw cartilage structures with subtle vibration
  beginShape(POINTS);
  for (let i = 0; i < cartilage.length; i++) {
    let c = cartilage[i];
    
    // Organic, fragile movement
    c.angle += c.speed;
    c.x += sin(c.angle) * 0.2;
    c.y += cos(c.angle * 0.7) * 0.2;
    c.z += sin(c.angle * 1.3) * 0.2;
    
    // Pulsing glow effect
    let pulse = sin(time * 3 + i) * 0.3 + 0.7;
    let hue = 20 + sin(time * 0.01 + i) * 5; // Bone white with slight tint
    let sat = 30 + sin(time * 0.02 + i) * 10;
    let bright = 70 + sin(time * 0.03 + i) * 15;
    
    fill(hue, sat, bright, pulse * 0.4);
    
    vertex(c.x, c.y, c.z);
  }
  endShape();
  
  // Draw steel springs with taut tension
  beginShape(LINES);
  for (let i = 0; i < springs.length; i++) {
    let s = springs[i];
    
    // Spring tension effect - subtle pulsing
    let tension = sin(time * 2 + i) * 0.3 + 0.7;
    
    stroke(200, 10, 80, tension * 0.8);
    strokeWeight(0.5 + tension * 0.5);
    
    vertex(s.x1, s.y1, s.z1);
    vertex(s.x2, s.y2, s.z2);
  }
  endShape();
  
  // Add subtle strain visualization
  beginShape(POINTS);
  for (let i = 0; i < 30; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-300, 300);
    
    let strain = sin(time * 4 + i) * 0.5 + 0.5;
    
    stroke(180, 20, 90, strain * 0.6);
    strokeWeight(strain * 0.3);
    
    vertex(x, y, z);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
