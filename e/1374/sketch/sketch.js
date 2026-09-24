let chars = [];
let font;
let audioContext;
let amplitude;
let fft;
let isAudioInitialized = false;

function preload() {
  // Use a system font to avoid loading issues
  // font = loadFont('https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;600&display=swap');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize characters
  for (let i = 0; i < 200; i++) {
    chars.push({
      x: random(width),
      y: random(height),
      size: random(12, 36),
      char: random(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω']),
      hue: random(180, 240),
      saturation: random(60, 90),
      brightness: random(40, 70),
      alpha: random(0.3, 0.7),
      speedX: random(-0.5, 0.5),
      speedY: random(-0.5, 0.5),
      angle: random(TWO_PI),
      spin: random(-0.02, 0.02),
      life: random(100, 300),
      maxLife: 300,
      solid: false
    });
  }
  
  // Set up audio
  amplitude = new p5.Amplitude();
  fft = new p5.FFT();
}

function draw() {
  background(0, 0, 10, 0.02);
  
  // Update and draw characters
  for (let i = chars.length - 1; i >= 0; i--) {
    let c = chars[i];
    
    // Apply movement
    if (!c.solid) {
      c.x += c.speedX;
      c.y += c.speedY;
      c.angle += c.spin;
      
      // Bounce off edges
      if (c.x < 0 || c.x > width) c.speedX *= -1;
      if (c.y < 0 || c.y > height) c.speedY *= -1;
    }
    
    // Apply audio influence
    if (isAudioInitialized && amplitude && fft) {
      let vol = amplitude.getLevel();
      let freqs = fft.analyze();
      let bass = freqs[0];
      
      if (vol > 0.05 || bass > 50) {
        c.solid = true;
        c.alpha = 1.0;
        c.size += 0.2;
      } else {
        c.solid = false;
        c.alpha = map(c.life, 0, c.maxLife, 0.1, 0.7);
      }
      
      if (c.solid) {
        // Move towards center when solid
        let centerX = width / 2;
        let centerY = height / 2;
        c.x += (centerX - c.x) * 0.01;
        c.y += (centerY - c.y) * 0.01;
      }
    }
    
    // Fade out over time
    if (!c.solid) {
      c.life -= 1;
    }
    
    // Reset if life ends or off-screen
    if (c.life <= 0 || c.x < -50 || c.x > width + 50 || c.y < -50 || c.y > height + 50) {
      chars.splice(i, 1);
      chars.push({
        x: random(width),
        y: random(height),
        size: random(12, 36),
        char: random(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω']),
        hue: random(180, 240),
        saturation: random(60, 90),
        brightness: random(40, 70),
        alpha: random(0.3, 0.7),
        speedX: random(-0.5, 0.5),
        speedY: random(-0.5, 0.5),
        angle: random(TWO_PI),
        spin: random(-0.02, 0.02),
        life: random(100, 300),
        maxLife: 300,
        solid: false
      });
    }
    
    // Draw character
    push();
    translate(c.x, c.y);
    rotate(c.angle);
    fill(c.hue, c.saturation, c.brightness, c.alpha);
    noStroke();
    textSize(c.size);
    // textFont(font); // Commented out to avoid font loading issues
    textAlign(CENTER, CENTER);
    text(c.char, 0, 0);
    pop();
  }
  
  // Add new characters occasionally
  if (random() < 0.1) {
    chars.push({
      x: random(width),
      y: random(height),
      size: random(12, 36),
      char: random(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω']),
      hue: random(180, 240),
      saturation: random(60, 90),
      brightness: random(40, 70),
      alpha: random(0.3, 0.7),
      speedX: random(-0.5, 0.5),
      speedY: random(-0.5, 0.5),
      angle: random(TWO_PI),
      spin: random(-0.02, 0.02),
      life: random(100, 300),
      maxLife: 300,
      solid: false
    });
  }
}

function mousePressed() {
  if (!isAudioInitialized) {
    userStartAudio();
    isAudioInitialized = true;
  }
  
  // Make nearby characters solid on click
  for (let i = chars.length - 1; i >= 0; i--) {
    let c = chars[i];
    let d = dist(mouseX, mouseY, c.x, c.y);
    if (d < 100) {
      c.solid = true;
      c.alpha = 1.0;
      c.size += 2;
    }
  }
}

function mouseDragged() {
  // Make characters solid during drag
  for (let i = chars.length - 1; i >= 0; i--) {
    let c = chars[i];
    let d = dist(mouseX, mouseY, c.x, c.y);
    if (d < 150) {
      c.solid = true;
      c.alpha = 1.0;
      c.size += 1;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
