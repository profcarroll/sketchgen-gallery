let rings = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create cross-sectioned bone rings with growth patterns
  for (let i = 0; i < 15; i++) {
    rings.push({
      radius: random(80, 200),
      z: random(-300, 300),
      rotation: random(TWO_PI),
      speed: random(0.001, 0.005),
      layers: floor(random(3, 7)),
      segments: floor(random(12, 24)),
      color: color(30 + random(20), 40 + random(30), 60 + random(20), 0.9)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;
  
  // Camera movement - gentle orbit
  let camX = sin(time * 0.01) * 150;
  let camY = cos(time * 0.015) * 100;
  camera(camX, camY, height / 2, 0, 0, 0, 0, 1, 0);
  
  // Draw rings
  for (let ring of rings) {
    push();
    translate(0, 0, ring.z);
    rotateZ(ring.rotation);
    
    // Draw concentric layers
    for (let l = 0; l < ring.layers; l++) {
      let layerRadius = ring.radius * (l / ring.layers);
      if (layerRadius < 5) continue;
      
      stroke(ring.color);
      noFill();
      strokeWeight(1);
      
      // Draw growth rings
      beginShape();
      for (let i = 0; i <= ring.segments; i++) {
        let angle = TWO_PI * i / ring.segments;
        let x = cos(angle) * layerRadius;
        let y = sin(angle) * layerRadius;
        
        // Add subtle noise to create organic growth
        let noiseFactor = 0.1;
        x += cos(angle * 3 + time) * noiseFactor * layerRadius;
        y += sin(angle * 3 + time) * noiseFactor * layerRadius;
        
        vertex(x, y);
      }
      endShape(CLOSE);
    }
    
    // Draw center core
    fill(ring.color);
    noStroke();
    sphere(10, 4, 3);
    
    pop();
  }
  
  // Update rotation
  for (let ring of rings) {
    ring.rotation += ring.speed;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
