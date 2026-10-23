let pipes = [];
let numPipes = 80;
let pipeRadius = 300;
let pipeThickness = 12;
let glowIntensity = 0;
let cursorX, cursorY;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  colorMode(HSB, 360, 100, 100, 1);

  // Create a network of glowing pipes
  for (let i = 0; i < numPipes; i++) {
    let angle = map(i, 0, numPipes, 0, TWO_PI);
    let x = cos(angle) * pipeRadius;
    let z = sin(angle) * pipeRadius;
    
    // Create a spiral-like path
    let y = sin(angle * 3) * 150;
    
    pipes.push({
      x: x,
      y: y,
      z: z,
      angle: angle,
      radius: pipeRadius,
      thickness: pipeThickness,
      glow: 0
    });
  }
}

function draw() {
  background(220, 10, 5);
  
  // Ambient light for overall illumination
  ambientLight(30);
  
  // Dynamic point light that follows cursor
  pointLight(255, 255, 255, cursorX, cursorY, 0);
  
  // Draw pipes
  for (let i = 0; i < pipes.length; i++) {
    let pipe = pipes[i];
    
    push();
    translate(pipe.x, pipe.y, pipe.z);
    rotateY(pipe.angle);
    
    // Create a glowing bronze pipe
    let hue = 30 + sin(frameCount * 0.01 + i) * 5;
    let saturation = 80 + sin(frameCount * 0.02 + i) * 10;
    let brightness = 70 + sin(frameCount * 0.03 + i) * 10;
    
    // Glow effect
    let glow = pipe.glow;
    if (glow > 0) {
      fill(hue, saturation, brightness + 20, 0.8);
      sphere(pipe.thickness * 1.5, 6, 4);
    }
    
    // Main pipe body
    fill(hue, saturation, brightness, 0.9);
    cylinder(pipe.thickness, 16, 1, false);
    
    pop();
  }

  // Draw connections between pipes
  beginShape(LINES);
  for (let i = 0; i < pipes.length; i++) {
    let pipeA = pipes[i];
    let pipeB = pipes[(i + 1) % pipes.length];
    
    // Calculate distance between pipes
    let dx = pipeA.x - pipeB.x;
    let dy = pipeA.y - pipeB.y;
    let dz = pipeA.z - pipeB.z;
    let dist = sqrt(dx * dx + dy * dy + dz * dz);
    
    // Only draw connection if pipes are close enough
    if (dist < 500) {
      let alpha = map(dist, 0, 500, 0.2, 0);
      
      // Connect with a glowing line
      let hue = 30 + sin(frameCount * 0.01 + i) * 5;
      stroke(hue, 80, 90, alpha);
      vertex(pipeA.x, pipeA.y, pipeA.z);
      vertex(pipeB.x, pipeB.y, pipeB.z);
    }
  }
  endShape();
}

function mouseMoved() {
  cursorX = map(mouseX, 0, width, -width/2, width/2);
  cursorY = map(mouseY, 0, height, -height/2, height/2);
  
  // Update glow intensity based on cursor position
  for (let i = 0; i < pipes.length; i++) {
    let pipe = pipes[i];
    
    // Calculate distance to cursor
    let dx = pipe.x - cursorX;
    let dy = pipe.y - cursorY;
    let dz = pipe.z - cursorY;
    let dist = sqrt(dx * dx + dy * dy + dz * dz);
    
    // Intensify glow around cursor
    pipe.glow = map(dist, 0, 300, 1, 0);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
