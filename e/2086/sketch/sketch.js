let roots = [];
let veins = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create root structure - solid mineral-like resin
  for (let i = 0; i < 200; i++) {
    let x = random(-width/2 + 50, width/2 - 50);
    let y = random(-height/2 + 50, height/2 - 50);
    let z = random(-300, -100); // Deep ocean floor
    let size = random(5, 25);
    
    roots.push({
      x: x,
      y: y,
      z: z,
      size: size,
      hue: 20 + random(10), // Earthy browns and grays
      saturation: 10 + random(20),
      lightness: 10 + random(30)
    });
  }
  
  // Create luminous veins flowing through roots
  for (let i = 0; i < 50; i++) {
    veins.push({
      path: [],
      hue: random(180, 240), // Blues and greens
      width: random(1, 3),
      speed: random(0.002, 0.008),
      pulse: random(TWO_PI)
    });
  }
}

function draw() {
  background(0);
  
  // Camera view from abyssal floor
  let time = millis() * 0.0003;
  camera(0, 0, 200 + sin(time) * 20, 0, 0, 0, 0, 1, 0);
  
  // Draw root system - mineral resin structure
  for (let root of roots) {
    push();
    translate(root.x, root.y, root.z);
    noStroke();
    fill(root.hue, root.saturation, root.lightness);
    
    // Create organic root shape with irregular geometry
    sphere(root.size, 4, 3); // Low detail for performance
    pop();
  }
  
  // Draw luminous veins
  for (let vein of veins) {
    // Update vein path
    if (vein.path.length === 0) {
      // Initialize path through root system
      let startX = random(-width/2 + 50, width/2 - 50);
      let startY = random(-height/2 + 50, height/2 - 50);
      let startZ = random(-300, -100);
      
      vein.path.push(createVector(startX, startY, startZ));
    } else {
      // Add new point with organic motion
      let last = vein.path[vein.path.length - 1];
      let next = createVector(
        last.x + random(-2, 2),
        last.y + random(-2, 2),
        last.z + random(0.5, 2)
      );
      
      // Keep within bounds of root system
      next.x = constrain(next.x, -width/2 + 50, width/2 - 50);
      next.y = constrain(next.y, -height/2 + 50, height/2 - 50);
      next.z = constrain(next.z, -300, -100);
      
      vein.path.push(next);
      
      // Limit path length for performance
      if (vein.path.length > 100) {
        vein.path.shift();
      }
    }
    
    // Draw the vein with pulsing glow effect
    vein.pulse += vein.speed;
    
    let alpha = 0.4 + sin(vein.pulse) * 0.3;
    
    stroke(vein.hue, 100, 100, alpha);
    strokeWeight(vein.width);
    noFill();
    
    beginShape();
    for (let point of vein.path) {
      vertex(point.x, point.y, point.z);
    }
    endShape();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
