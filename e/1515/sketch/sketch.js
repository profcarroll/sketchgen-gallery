let curtains;
let snowflakes = [];
let cameraAngle = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Create aurora curtains texture
  curtains = createGraphics(512, 512);
  curtains.noStroke();
  curtains.colorMode(HSB, 360, 100, 100, 1);
  
  // Precompute curtain pattern
  curtains.loadPixels();
  for (let y = 0; y < curtains.height; y++) {
    for (let x = 0; x < curtains.width; x++) {
      let u = x / curtains.width;
      let v = y / curtains.height;
      
      // Create flowing aurora pattern
      let a = sin(u * 10 + frameCount * 0.01) * cos(v * 8 + frameCount * 0.02);
      let b = cos(u * 7 + frameCount * 0.015) * sin(v * 6 + frameCount * 0.01);
      
      // Mix colors: neon green and sapphire blue
      let hue = (a + b) * 180 + 120; // Shift to blue range
      let sat = 100;
      let bright = (sin(u * 5 + frameCount * 0.02) * 0.5 + 0.5) * 100;
      
      curtains.set(x, y, color(hue, sat, bright, 0.8));
    }
  }
  curtains.updatePixels();
  
  // Initialize snowflakes
  for (let i = 0; i < 1000; i++) {
    snowflakes.push({
      x: random(-200, 200),
      y: random(-200, 200),
      z: random(-200, 200),
      size: random(0.5, 2),
      speed: random(0.1, 0.5),
      sway: random(TWO_PI),
      swaySpeed: random(0.01, 0.03)
    });
  }
}

function draw() {
  background(0);
  
  // Camera movement
  cameraAngle += 0.002;
  let camX = sin(cameraAngle) * 300;
  let camY = cos(cameraAngle * 0.7) * 100;
  let camZ = cos(cameraAngle) * 300;
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);
  
  // Draw snow globe sphere
  push();
  fill(200, 200, 255, 0.1);
  sphere(200);
  pop();
  
  // Draw aurora curtains
  push();
  rotateY(frameCount * 0.001);
  rotateX(sin(frameCount * 0.001) * 0.1);
  texture(curtains);
  sphere(195);
  pop();
  
  // Batch draw snowflakes as points
  push();
  noStroke();
  fill(255);
  beginShape(POINTS);
  for (let flake of snowflakes) {
    flake.y += flake.speed;
    flake.sway += flake.swaySpeed;
    
    if (flake.y > 200) {
      flake.y = -200;
      flake.x = random(-200, 200);
      flake.z = random(-200, 200);
    }
    
    // Apply sway
    flake.x += sin(flake.sway) * 0.5;
    
    vertex(flake.x, flake.y, flake.z);
  }
  endShape();
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
