let hexagons = [];
let fft;
let amplitude;
let clickTriggered = false;
let stressFractures = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize hexagons in a tessellated pattern
  let spacing = 80;
  for (let x = -width/2; x < width/2; x += spacing) {
    for (let y = -height/2; y < height/2; y += spacing * Math.sqrt(3)) {
      hexagons.push({
        x: x + (y % (spacing * Math.sqrt(3)) === 0 ? 0 : spacing/2),
        y: y,
        size: spacing * 0.4,
        rotation: random(TWO_PI),
        speed: random(0.005, 0.02),
        hue: random(360),
        stability: random(0.8, 1)
      });
    }
  }

  // Setup audio
  fft = new p5.FFT();
  amplitude = new p5.Amplitude();
}

function draw() {
  background(0);
  time += 0.01;

  // Draw hexagons with rotation and pulsing
  for (let h of hexagons) {
    push();
    translate(h.x, h.y);
    rotate(h.rotation + time * h.speed);
    
    // Pulsing effect
    let pulse = sin(time * 3 + h.x * 0.01) * 0.2 + 0.8;
    let size = h.size * pulse;
    
    // Color based on position and hue
    fill(h.hue, 90, 90, 0.9);
    noStroke();
    
    beginShape();
    for (let i = 0; i < 6; i++) {
      let angle = TWO_PI / 6 * i;
      let x = size * cos(angle);
      let y = size * sin(angle);
      vertex(x, y);
    }
    endShape(CLOSE);
    
    pop();
    
    // Add stress fracture effect
    if (frameCount % 30 === 0 && random() > 0.7) {
      stressFractures.push({
        x: h.x,
        y: h.y,
        angle: random(TWO_PI),
        size: random(10, 30),
        life: 1
      });
    }
  }

  // Draw stress fractures
  for (let f of stressFractures) {
    push();
    translate(f.x, f.y);
    rotate(f.angle);
    stroke(255, 0.7);
    noFill();
    strokeWeight(2);
    line(-f.size/2, 0, f.size/2, 0);
    pop();
    f.life -= 0.02;
  }

  // Remove dead fractures
  stressFractures = stressFractures.filter(f => f.life > 0);

  // Change pattern on click
  if (clickTriggered) {
    for (let h of hexagons) {
      h.stability *= 0.95;
      if (h.stability < 0.3) {
        // Collapse into segments
        h.size = random(5, 15);
        h.rotation += random(-0.5, 0.5);
      }
    }
  }

  // Audio-reactive changes
  let vol = amplitude.getLevel();
  if (vol > 0.01) {
    for (let h of hexagons) {
      h.rotation += vol * 0.02;
      h.hue = (h.hue + vol * 5) % 360;
    }
  }

  // Draw connections between nearby hexagons
  stroke(255, 0.1);
  noFill();
  beginShape(LINES);
  for (let i = 0; i < hexagons.length; i++) {
    for (let j = i + 1; j < hexagons.length; j++) {
      let dx = hexagons[i].x - hexagons[j].x;
      let dy = hexagons[i].y - hexagons[j].y;
      let dist = sqrt(dx * dx + dy * dy);
      
      if (dist < 120) {
        vertex(hexagons[i].x, hexagons[i].y);
        vertex(hexagons[j].x, hexagons[j].y);
      }
    }
  }
  endShape();
}

function mousePressed() {
  clickTriggered = true;
  userStartAudio();
}
