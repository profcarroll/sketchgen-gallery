let ripples = [];
let fft;
let amplitude;
let isAudioStarted = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize audio
  fft = new p5.FFT(0.8, 128);
  amplitude = new p5.Amplitude();
  
  // Create initial ripples
  for (let i = 0; i < 20; i++) {
    ripples.push({
      x: random(width),
      y: random(height),
      radius: 0,
      maxRadius: random(100, 300),
      speed: random(0.5, 2),
      hue: random(180, 240),
      alpha: random(0.3, 0.7),
      isGrowing: true
    });
  }
}

function draw() {
  background(220, 10, 5);
  
  // Update and display ripples
  for (let i = ripples.length - 1; i >= 0; i--) {
    let ripple = ripples[i];
    
    if (ripple.isGrowing) {
      ripple.radius += ripple.speed;
      
      // Start shrinking when reaching max radius
      if (ripple.radius > ripple.maxRadius) {
        ripple.isGrowing = false;
      }
    } else {
      ripple.radius -= ripple.speed * 0.5;
      
      // Remove ripple when it disappears
      if (ripple.radius <= 0) {
        ripples.splice(i, 1);
        continue;
      }
    }
    
    // Adjust based on sound
    let vol = amplitude.getLevel();
    if (vol > 0.01) {
      // Increase vertical expansion with volume
      let expandFactor = map(vol, 0.01, 0.2, 1, 3);
      ripple.radius *= expandFactor;
      
      // Brighten and fragment with high volume
      if (vol > 0.1) {
        ripple.alpha = map(vol, 0.1, 0.2, 0.7, 1);
        ripple.hue += random(-1, 1);
        
        // Add extra ripples during high volume
        if (frameCount % 10 === 0 && random() > 0.7) {
          ripples.push({
            x: ripple.x + random(-50, 50),
            y: ripple.y + random(-50, 50),
            radius: 0,
            maxRadius: random(100, 300),
            speed: random(0.5, 2),
            hue: random(180, 240),
            alpha: random(0.3, 0.7),
            isGrowing: true
          });
        }
      } else {
        ripple.alpha = map(vol, 0.01, 0.1, 0.3, 0.7);
      }
    }
    
    // Draw the ripple
    noFill();
    stroke(ripple.hue, 80, 90, ripple.alpha);
    strokeWeight(2);
    ellipse(ripple.x, ripple.y, ripple.radius * 2);
    
    // Add some inner glow for high volume
    if (vol > 0.1) {
      noStroke();
      fill(ripple.hue, 80, 90, ripple.alpha * 0.3);
      ellipse(ripple.x, ripple.y, ripple.radius * 1.5);
    }
  }
  
  // Add new ripples occasionally
  if (frameCount % 30 === 0 && ripples.length < 50) {
    ripples.push({
      x: random(width),
      y: random(height),
      radius: 0,
      maxRadius: random(100, 300),
      speed: random(0.5, 2),
      hue: random(180, 240),
      alpha: random(0.3, 0.7),
      isGrowing: true
    });
  }
}

function mousePressed() {
  if (!isAudioStarted) {
    userStartAudio();
    isAudioStarted = true;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
