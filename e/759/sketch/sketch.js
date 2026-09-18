let hexagons = [];
const numHexagons = 150;
let time = 0;
let audioContext;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize hexagons with random positions and properties
  for (let i = 0; i < numHexagons; i++) {
    hexagons.push({
      x: random(width),
      y: random(height),
      size: random(30, 70),
      rotation: random(TWO_PI),
      rotationSpeed: random(-0.02, 0.02),
      hue: random(360),
      saturation: random(50, 100),
      alpha: random(0.3, 0.8)
    });
  }
  
  // Create a subtle audio context for interaction
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
}

function draw() {
  background(0, 0, 10);
  
  time += 0.01;
  
  // Update and display hexagons
  for (let i = 0; i < hexagons.length; i++) {
    let h = hexagons[i];
    
    // Apply rotation and update position slightly over time
    h.rotation += h.rotationSpeed;
    
    // Shift positions gently
    h.x += sin(time + i) * 0.1;
    h.y += cos(time + i) * 0.1;
    
    // Keep hexagons on canvas
    if (h.x < -50) h.x = width + 50;
    if (h.x > width + 50) h.x = -50;
    if (h.y < -50) h.y = height + 50;
    if (h.y > height + 50) h.y = -50;
    
    // Dynamic color based on neighbors' velocities
    let avgSpeed = 0;
    let count = 0;
    for (let j = 0; j < hexagons.length; j++) {
      if (i !== j && dist(h.x, h.y, hexagons[j].x, hexagons[j].y) < 150) {
        avgSpeed += abs(hexagons[j].rotationSpeed);
        count++;
      }
    }
    
    if (count > 0) {
      h.saturation = map(avgSpeed / count, 0, 0.04, 30, 100);
    }
    
    // Draw hexagon
    push();
    translate(h.x, h.y);
    rotate(h.rotation);
    noStroke();
    fill(h.hue, h.saturation, 90, h.alpha);
    drawHexagon(h.size);
    pop();
  }
  
  // Draw connecting lines between close hexagons
  stroke(255, 10);
  noFill();
  for (let i = 0; i < hexagons.length; i++) {
    for (let j = i + 1; j < hexagons.length; j++) {
      let d = dist(hexagons[i].x, hexagons[i].y, hexagons[j].x, hexagons[j].y);
      if (d < 100) {
        line(hexagons[i].x, hexagons[i].y, hexagons[j].x, hexagons[j].y);
      }
    }
  }
}

function drawHexagon(size) {
  beginShape();
  for (let i = 0; i < 6; i++) {
    let angle = TWO_PI / 6 * i;
    let x = cos(angle) * size;
    let y = sin(angle) * size;
    vertex(x, y);
  }
  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  // Change the global rotation speed of all hexagons
  for (let h of hexagons) {
    h.rotationSpeed += random(-0.01, 0.01);
  }
  
  // Trigger a sound effect
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  
  let oscillator = audioContext.createOscillator();
  let gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.type = 'sine';
  oscillator.frequency.value = 220 + random(-50, 50);
  gainNode.gain.value = 0.1;
  
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.1);
}
