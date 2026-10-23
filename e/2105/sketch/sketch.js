let structures = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 1);
  
  // Create layered mineral-like structures
  for (let i = 0; i < 150; i++) {
    structures.push({
      x: random(-width/2, width/2),
      y: random(-height/4, height/4),
      z: random(-height/2, height/2),
      size: random(20, 80),
      layers: floor(random(3, 8)),
      color: color(
        20 + random(30), 
        0.3 + random(0.2), 
        0.1 + random(0.2)
      ),
      growth: random(0.001, 0.005),
      age: random(1000)
    });
  }
}

function draw() {
  time += 0.005;
  
  background(0);
  noStroke();
  
  // Dynamic camera movement
  let camX = sin(time * 0.1) * width/4;
  let camY = sin(time * 0.05) * height/8;
  let camZ = cos(time * 0.1) * height/2 + height/2;
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);

  // Draw mineral structures
  for (let s of structures) {
    push();
    translate(s.x, s.y, s.z);
    
    // Slow growth effect
    let growthFactor = sin(time * s.growth + s.age) * 0.5 + 0.5;
    
    // Layered structure with soft colors
    for (let i = 0; i < s.layers; i++) {
      let layerSize = s.size * (i / s.layers) * growthFactor;
      let layerAlpha = 0.1 + 0.2 * (i / s.layers);
      
      fill(hue(s.color), saturation(s.color), brightness(s.color), layerAlpha);
      
      // Create organic, crystalline shapes
      if (i % 3 === 0) {
        sphere(layerSize * 0.8, 6, 4);
      } else if (i % 3 === 1) {
        box(layerSize * 0.7, layerSize * 0.7, layerSize * 0.7);
      } else {
        torus(layerSize * 0.6, layerSize * 0.2, 8, 4);
      }
    }
    
    pop();
  }

  // Subtle light ripples
  if (frameCount % 30 === 0) {
    let ripple = {
      x: random(-width/2, width/2),
      z: random(-height/2, height/2),
      size: 0,
      maxRadius: random(100, 300),
      alpha: 255,
      color: color(0.1 + random(0.2), 0.8, 0.7 + random(0.2))
    };
    // We don't store ripples since we're not using a ripple array
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
