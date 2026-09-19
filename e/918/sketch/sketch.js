let fft;
let amplitude;
let ripples = [];
let isListening = false;

function setup() {
  createCanvas(400, 400);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Setup audio
  fft = new p5.FFT();
  amplitude = new p5.Amplitude();
  
  // Initialize ripples
  for (let i = 0; i < 5; i++) {
    ripples.push({
      x: random(width),
      y: random(height),
      radius: 0,
      maxRadius: random(20, 60),
      speed: random(0.5, 1.5),
      hue: random(180, 240)
    });
  }
}

function draw() {
  background(200, 10, 90);
  
  // Draw ripples
  for (let i = 0; i < ripples.length; i++) {
    let ripple = ripples[i];
    
    // Update ripple
    ripple.radius += ripple.speed;
    
    // Draw ripple
    noFill();
    stroke(ripple.hue, 80, 90, 0.5);
    strokeWeight(2);
    ellipse(ripple.x, ripple.y, ripple.radius * 2);
    
    // Reset if too big
    if (ripple.radius > ripple.maxRadius) {
      ripple.x = random(width);
      ripple.y = random(height);
      ripple.radius = 0;
      ripple.maxRadius = random(20, 60);
      ripple.hue = random(180, 240);
    }
  }
  
  // Dynamic background based on sound
  if (isListening) {
    let vol = amplitude.getLevel();
    let bgHue = map(vol, 0, 0.5, 180, 240);
    background(bgHue, 10, 90);
    
    // Add subtle wave effect
    let time = millis() * 0.001;
    for (let y = 0; y < height; y += 20) {
      let wave = sin(y * 0.05 + time) * 10;
      stroke(200, 10, 80, 0.3);
      line(0, y + wave, width, y + wave);
    }
    
    // Add more ripples based on volume
    let newRipples = Math.floor(vol * 5);
    for (let i = 0; i < newRipples; i++) {
      if (ripples.length < 20) {
        ripples.push({
          x: random(width),
          y: random(height),
          radius: 0,
          maxRadius: random(20, 60),
          speed: random(0.5, 1.5),
          hue: random(180, 240)
        });
      }
    }
  } else {
    // Idle animation
    let time = millis() * 0.0005;
    for (let y = 0; y < height; y += 30) {
      let wave = sin(y * 0.05 + time) * 5;
      stroke(200, 10, 80, 0.2);
      line(0, y + wave, width, y + wave);
    }
  }
}

function mousePressed() {
  if (!isListening) {
    userStartAudio();
    isListening = true;
  }
}
