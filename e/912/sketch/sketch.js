let ripple;
let canvas;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  background(240);
  noStroke();
  ripple = [];
}

function draw() {
  // Keep background static
  if (frameCount === 1) {
    background(240);
  }
  
  // Update and display ripples
  for (let i = ripple.length - 1; i >= 0; i--) {
    let r = ripple[i];
    r.radius += r.speed;
    r.alpha -= 2;
    
    if (r.alpha <= 0) {
      ripple.splice(i, 1);
    } else {
      fill(200, 200, 220, r.alpha);
      ellipse(r.x, r.y, r.radius * 2);
    }
  }
}

function mousePressed() {
  // Start audio on first click
  if (frameCount === 1) {
    userStartAudio();
  }
  
  // Create new ripple at click point
  ripple.push({
    x: mouseX,
    y: mouseY,
    radius: 0,
    speed: 2,
    alpha: 150
  });
  
  // Play chime sound immediately
  playChime(mouseX, mouseY);
}

function playChime(x, y) {
  // Simple tone generation for chime effect
  let osc = new p5.Oscillator('sine');
  osc.freq(440 + (x / width) * 220);
  osc.amp(0.3);
  osc.start();
  osc.stop(frameCount + 15);
}
