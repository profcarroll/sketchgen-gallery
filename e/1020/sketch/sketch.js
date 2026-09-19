let inkTrail;
let resolution = 2;
let speedThreshold = 5;
let maxParticles = 1000;

function setup() {
  createCanvas(windowWidth, windowHeight);
  inkTrail = [];
  colorMode(HSB, 360, 100, 100, 1);
  background(0, 0, 0);
}

function draw() {
  // Slowly fade the canvas to create persistence
  fill(0, 0, 0, 0.05);
  noStroke();
  rect(0, 0, width, height);

  if (mouseX !== pmouseX || mouseY !== pmouseY) {
    let speed = dist(mouseX, mouseY, pmouseX, pmouseY);
    
    // Add particles based on speed
    let particleCount = map(speed, 0, 200, 1, 10);
    for (let i = 0; i < particleCount; i++) {
      addInkParticle();
    }

    // Draw connections between nearby particles
    drawConnections();
  }
}

function addInkParticle() {
  let x = mouseX + random(-resolution, resolution);
  let y = mouseY + random(-resolution, resolution);
  
  // Create a particle with dynamic properties based on speed
  let hue = (frameCount * 2) % 360;
  let saturation = 80 + random(20);
  let brightness = 50 + random(30);
  let alpha = 0.7 + random(0.3);
  
  inkTrail.push({
    x: x,
    y: y,
    hue: hue,
    saturation: saturation,
    brightness: brightness,
    alpha: alpha,
    size: random(1, 4),
    age: 0
  });

  // Keep particle count under control
  if (inkTrail.length > maxParticles) {
    inkTrail.shift();
  }
}

function drawConnections() {
  beginShape(LINES);
  noFill();
  
  for (let i = 0; i < inkTrail.length; i++) {
    let p1 = inkTrail[i];
    
    for (let j = i + 1; j < inkTrail.length; j++) {
      let p2 = inkTrail[j];
      
      let d = dist(p1.x, p1.y, p2.x, p2.y);
      
      if (d < 50) {
        // Draw connection based on speed
        let speedFactor = map(dist(mouseX, mouseY, pmouseX, pmouseY), 0, 200, 0.1, 1);
        let alpha = map(d, 0, 50, 0.8 * speedFactor, 0);
        
        stroke(p1.hue, p1.saturation, p1.brightness, alpha);
        vertex(p1.x, p1.y);
        vertex(p2.x, p2.y);
      }
    }
  }
  
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
