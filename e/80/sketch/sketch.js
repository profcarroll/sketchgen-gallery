let time = 0;
let ripples = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 1);
}

function draw() {
  background(0);
  time += 0.002;

  // Cyclical atmospheric light transition
  let hue = (time * 0.2) % 1;
  let saturation = 0.7;
  let brightness = 0.3 + 0.2 * sin(time * 2);

  // Create bioluminescent flora
  for (let i = 0; i < 50; i++) {
    let x = sin(time + i) * 300;
    let y = cos(time * 0.7 + i) * 200;
    let z = sin(time * 0.5 + i) * 100;

    push();
    translate(x, y, z);
    rotateX(time * 0.5);
    rotateY(time * 0.3);

    // Pulsing bioluminescent light
    let pulse = 0.5 + 0.5 * sin(time * 5 + i);
    fill(hue, saturation, brightness * pulse, 0.8);
    sphere(20 * pulse);

    pop();
  }

  // Generate ripples from flora light
  if (frameCount % 10 === 0) {
    ripples.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      size: 0,
      max: random(50, 200),
      color: color(hue, saturation, brightness * 0.8)
    });
  }

  // Update and draw ripples
  for (let i = ripples.length - 1; i >= 0; i--) {
    let ripple = ripples[i];
    ripple.size += 2;
    
    push();
    translate(ripple.x, ripple.y, 0);
    noFill();
    stroke(ripple.color, 0.5);
    ellipse(0, 0, ripple.size);
    pop();

    if (ripple.size > ripple.max) {
      ripples.splice(i, 1);
    }
  }

  // Reflective cityscape
  for (let i = 0; i < 200; i++) {
    let x = sin(time * 0.3 + i) * 400;
    let y = cos(time * 0.4 + i) * 300;
    let z = sin(time * 0.2 + i) * 150;

    push();
    translate(x, y, z);
    rotateX(time * 0.1);
    rotateY(time * 0.2);

    // Wet, reflective surfaces
    fill(hue, saturation * 0.8, brightness * 0.6, 0.7);
    box(30, 80, 30);

    pop();
  }

  // Atmospheric glow effect
  let glow = color(hue, saturation, brightness, 0.1);
  fill(glow);
  noStroke();
  sphere(width * 0.8);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
