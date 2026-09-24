let curtains;
let snowflakes = [];
let cameraAngle = 0;
let snowIntensity = 0;
let lastMouseX = 0;
let lastMouseY;
let pointCloud;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Create aurora curtains
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
  
  // Create snowflakes as a point cloud
  pointCloud = createGraphics(256, 256);
  pointCloud.noStroke();
  pointCloud.colorMode(HSB, 360, 100, 100, 1);
  pointCloud.background(0, 0, 0, 0);
  
  for (let i = 0; i < 2000; i++) {
    let x = random(pointCloud.width);
    let y = random(pointCloud.height);
    let a = random(TWO_PI);
    let s = random(0.5, 2);
    
    pointCloud.set(x, y, color(0, 0, 100, 0.8));
  }
  pointCloud.updatePixels();
  
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
  
  // Draw snowflakes as a batched point cloud
  push();
  translate(0, 0, 0);
  texture(pointCloud);
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
  
  // Draw accumulated snow effect
  if (snowIntensity > 0) {
    push();
    rotateY(frameCount * 0.003);
    for (let i = 0; i < 100; i++) {
      let angle = i * 0.1;
      let x = sin(angle) * (180 + sin(frameCount * 0.002 + angle) * 20);
      let y = cos(angle) * (180 + cos(frameCount * 0.002 + angle) * 20);
      let z = sin(frameCount * 0.001 + angle) * 50;
      fill(255, 150);
      sphere(3 + sin(frameCount * 0.002 + angle) * 2);
    }
    pop();
  }
}

function mousePressed() {
  snowIntensity = 100;
  lastMouseX = mouseX;
  lastMouseY = mouseY;
}

function mouseDragged() {
  // Increase snow intensity when dragging
  snowIntensity = min(100, snowIntensity + 2);
  
  // Create swirling effect based on drag
  let dx = mouseX - lastMouseX;
  let dy = mouseY - lastMouseY;
  
  if (abs(dx) > 5 || abs(dy) > 5) {
    for (let flake of snowflakes) {
      flake.x += dx * 0.01;
      flake.y += dy * 0.01;
    }
  }
  
  lastMouseX = mouseX;
  lastMouseY = mouseY;
}

function mouseReleased() {
  snowIntensity = max(0, snowIntensity - 2);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
