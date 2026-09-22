let marble;
let platforms = [];
let cameraAngle = 0;
let audioContext;
let fft;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  marble = {
    x: 0,
    y: 0,
    z: 0,
    radius: 20,
    vx: 0,
    vy: 0,
    vz: 0,
    onGround: false
  };
  
  // Create platforms in an isometric layout
  for (let i = 0; i < 15; i++) {
    let x = sin(i * 0.5) * 200;
    let y = cos(i * 0.5) * 200;
    let z = i * 30;
    platforms.push({
      x: x,
      y: y,
      z: z,
      width: 100,
      height: 20,
      depth: 40
    });
  }
  
  // Add some connecting paths
  for (let i = 0; i < 10; i++) {
    let x = sin(i * 0.7) * 150;
    let y = cos(i * 0.7) * 150;
    let z = 200 + i * 40;
    platforms.push({
      x: x,
      y: y,
      z: z,
      width: 80,
      height: 15,
      depth: 30
    });
  }
  
  // Add a few vertical walls for visual interest
  for (let i = 0; i < 8; i++) {
    let x = sin(i * 0.9) * 100;
    let y = cos(i * 0.9) * 100;
    let z = 400 + i * 50;
    platforms.push({
      x: x,
      y: y,
      z: z,
      width: 20,
      height: 80,
      depth: 20
    });
  }
  
  // Initialize audio context on user gesture
  userStartAudio();
}

function mousePressed() {
  if (!audioContext) {
    audioContext = getAudioContext();
    fft = new p5.FFT();
    audioContext.resume();
  }
}

function draw() {
  background(0);
  
  // Camera movement
  cameraAngle += 0.002;
  let camX = sin(cameraAngle) * 600;
  let camY = 100;
  let camZ = cos(cameraAngle) * 600;
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);
  
  // Lighting
  ambientLight(50);
  pointLight(255, 255, 255, 300, 300, 300);
  pointLight(255, 100, 100, -300, -300, -300);
  
  // Draw platforms
  for (let platform of platforms) {
    push();
    translate(platform.x, platform.y, platform.z);
    
    // Random color for each platform
    let hue = (platform.x + platform.z) % 255;
    fill(hue, 150, 200);
    noStroke();
    
    box(platform.width, platform.height, platform.depth);
    pop();
  }
  
  // Draw marble
  push();
  translate(marble.x, marble.y, marble.z);
  fill(255, 100, 100);
  noStroke();
  sphere(marble.radius);
  pop();
  
  // Update marble physics
  updateMarble();
  
  // Handle keyboard input
  if (keyIsPressed) {
    if (keyCode === LEFT_ARROW) {
      marble.vx -= 0.2;
    }
    if (keyCode === RIGHT_ARROW) {
      marble.vx += 0.2;
    }
    if (keyCode === UP_ARROW) {
      marble.vz -= 0.2;
    }
    if (keyCode === DOWN_ARROW) {
      marble.vz += 0.2;
    }
  }
  
  // Mouse control
  if (mouseIsPressed) {
    let dx = mouseX - width / 2;
    let dy = mouseY - height / 2;
    marble.vx -= dx * 0.001;
    marble.vz -= dy * 0.001;
  }
  
  // Apply friction
  marble.vx *= 0.95;
  marble.vz *= 0.95;
  
  // Gravity
  marble.vy += 0.1;
  
  // Constrain velocity
  marble.vx = constrain(marble.vx, -3, 3);
  marble.vz = constrain(marble.vz, -3, 3);
  
  // Update position
  marble.x += marble.vx;
  marble.z += marble.vz;
  marble.y += marble.vy;
  
  // Platform collision detection
  marble.onGround = false;
  for (let platform of platforms) {
    let dx = abs(marble.x - platform.x);
    let dy = abs(marble.y - platform.y);
    let dz = abs(marble.z - platform.z);
    
    if (dx < platform.width / 2 + marble.radius &&
        dy < platform.height / 2 + marble.radius &&
        dz < platform.depth / 2 + marble.radius) {
      
      // Simple collision response
      if (marble.y > platform.y) {
        marble.y = platform.y - platform.height / 2 - marble.radius;
        marble.vy = 0;
        marble.onGround = true;
      }
    }
  }
  
  // Reset gravity when on ground
  if (marble.onGround) {
    marble.vy = 0;
  }
}

function updateMarble() {
  // Simple animation for visual effect
  marble.x += sin(frameCount * 0.01) * 0.5;
  marble.z += cos(frameCount * 0.01) * 0.5;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
