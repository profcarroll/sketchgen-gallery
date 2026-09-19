let keys = [];
let audioContext;
let oscillators = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create keys across the canvas
  const keyCount = 12;
  const keyWidth = width / keyCount;
  for (let i = 0; i < keyCount; i++) {
    keys.push({
      x: i * keyWidth,
      y: height / 2,
      w: keyWidth,
      h: height / 3,
      hue: (i * 30) % 360,
      isPressed: false,
      pulseSize: 0,
      pulseColor: null
    });
  }
  
  // Initialize audio context on first user interaction
  userStartAudio();
}

function draw() {
  background(0);
  
  // Draw keys
  for (let key of keys) {
    if (key.isPressed) {
      // Draw glowing key
      fill(key.hue, 100, 100, 0.8);
      noStroke();
      rect(key.x, key.y, key.w, key.h, 10);
      
      // Draw pulsing effect
      if (key.pulseSize > 0) {
        stroke(key.pulseColor);
        strokeWeight(3);
        noFill();
        ellipse(key.x + key.w/2, key.y + key.h/2, key.pulseSize);
      }
    } else {
      // Draw normal key
      fill(key.hue, 100, 80);
      noStroke();
      rect(key.x, key.y, key.w, key.h, 10);
      
      // Draw key highlight
      fill(255, 20);
      rect(key.x, key.y, key.w, key.h/4, 10);
    }
  }
  
  // Update pulse effects
  for (let key of keys) {
    if (key.isPressed && key.pulseSize > 0) {
      key.pulseSize += 8;
      if (key.pulseSize > 200) {
        key.pulseSize = 0;
      }
    }
  }
}

function mousePressed() {
  // Check if any key was clicked
  for (let key of keys) {
    if (
      mouseX >= key.x &&
      mouseX <= key.x + key.w &&
      mouseY >= key.y &&
      mouseY <= key.y + key.h
    ) {
      // Play note
      const osc = new p5.Oscillator();
      osc.setType('sine');
      osc.freq(220 * pow(2, (key.hue / 30) - 4));
      osc.amp(0.3);
      osc.start();
      oscillators.push(osc);
      
      // Set key to pressed
      key.isPressed = true;
      
      // Set pulse effect
      key.pulseSize = 20;
      key.pulseColor = (key.hue + 180) % 360; // Complementary color
      
      // Stop oscillator after a short time
      setTimeout(() => {
        osc.stop();
        oscillators = oscillators.filter(o => o !== osc);
      }, 500);
      
      break;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
