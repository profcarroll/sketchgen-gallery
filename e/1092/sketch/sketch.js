let rings = [];
let speed = 1;
let mouseDrag = false;
let lastMouseX = 0;
let lastMouseY = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  // Initialize rings
  for (let i = 0; i < 20; i++) {
    rings.push({
      radius: i * 30,
      alpha: 255 - i * 10,
      hue: i * 10,
      speed: 0.01 + i * 0.001
    });
  }
}

function draw() {
  background(0);
  
  // Update and draw rings
  for (let i = 0; i < rings.length; i++) {
    let r = rings[i];
    
    // Pulse effect
    let pulse = sin(frameCount * r.speed * speed) * 0.5 + 0.5;
    let radius = r.radius + pulse * 20;
    
    // Color shift based on position and time
    let hue = (r.hue + frameCount * 0.1) % 360;
    fill(hue, 80, 80, r.alpha * pulse);
    
    // Draw ring as a circle with radius adjusted by pulse
    ellipse(width/2, height/2, radius * 2, radius * 2);
  }
  
  // Distortion effect from mouse drag
  if (mouseDrag) {
    let dx = mouseX - lastMouseX;
    let dy = mouseY - lastMouseY;
    
    // Apply a swirling distortion to the rings
    for (let i = 0; i < rings.length; i++) {
      let r = rings[i];
      let angle = atan2(mouseY - height/2, mouseX - width/2);
      let distFromCenter = dist(mouseX, mouseY, width/2, height/2);
      
      // Distort based on mouse proximity
      if (distFromCenter < 300) {
        let distortion = map(distFromCenter, 0, 300, 1, 0);
        r.radius += dx * 0.01 * distortion;
        r.hue += dy * 0.1 * distortion;
      }
    }
  }
  
  lastMouseX = mouseX;
  lastMouseY = mouseY;
}

function mousePressed() {
  speed = random(0.5, 3);
  return false;
}

function mouseDragged() {
  mouseDrag = true;
  return false;
}

function mouseReleased() {
  mouseDrag = false;
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
