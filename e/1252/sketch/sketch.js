let clicked = false;
let rippleRadius = 0;
let clickX = 0;
let clickY = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  drawPond();
}

function drawPond() {
  background(12, 18, 28);
  noStroke();
  fill(16, 25, 38);
  rect(0, 0, width, height);
}

function draw() {
  if (!clicked) {
    return;
  }

  drawPond();

  rippleRadius += 3.5;
  noFill();
  for (let i = 0; i < 5; i++) {
    let r = rippleRadius - i * 20;
    if (r > 0 && r < max(width, height) * 1.2) {
      let alpha = map(r, 0, max(width, height) * 0.7, 240, 0);
      stroke(180, 225, 255, alpha);
      strokeWeight(map(r, 0, max(width, height), 3.5, 0.5));
      ellipse(clickX, clickY, r * 2, r * 1.3);
    }
  }

  fill(100, 130, 160, max(0, 200 - rippleRadius * 1.5));
  noStroke();
  ellipse(clickX, clickY, 7, 5);
}

function mousePressed() {
  clicked = true;
  clickX = mouseX;
  clickY = mouseY;
  rippleRadius = 0;

  try {
    let AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      let ctx = new AudioContext();
      let osc = ctx.createOscillator();
      let gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.08);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.7);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.85);
    }
  } catch (e) {}
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  drawPond();
}
