let stalks = [];
let ufo;
let beam;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create corn stalks
  for (let i = 0; i < 200; i++) {
    stalks.push({
      x: random(width),
      y: random(height * 0.3, height * 0.7),
      height: random(80, 150),
      angle: random(TWO_PI),
      speed: random(0.001, 0.005)
    });
  }
  // UFO setup
  ufo = {
    x: width / 2,
    y: height * 0.2,
    radius: 40,
    pulse: 0,
    pulseSpeed: 0.02
  };
  // Beam setup
  beam = {
    radius: 150,
    intensity: 0,
    intensitySpeed: 0.03
  };
}

function draw() {
  background(20, 30, 40);
  
  // Update and draw UFO
  ufo.pulse += ufo.pulseSpeed;
  let pulseSize = sin(ufo.pulse) * 5 + 40;
  fill(100, 255, 255, 180);
  noStroke();
  ellipse(ufo.x, ufo.y, pulseSize * 2, pulseSize);
  
  // Draw UFO disc
  fill(180, 220, 255, 200);
  stroke(220, 240, 255, 220);
  strokeWeight(2);
  ellipse(ufo.x, ufo.y, ufo.radius * 2, ufo.radius * 1.2);
  
  // Update and draw beam
  beam.intensity += beam.intensitySpeed;
  let beamAlpha = map(sin(beam.intensity), -1, 1, 50, 150);
  let beamRadius = map(sin(beam.intensity), -1, 1, 120, 180);
  
  // Draw beam
  noStroke();
  for (let i = 0; i < 30; i++) {
    let a = map(i, 0, 29, 0, PI);
    let r = map(a, 0, PI, beamRadius * 0.5, beamRadius);
    let x = ufo.x + cos(a) * r;
    let y = ufo.y + sin(a) * r;
    
    fill(0, 255, 255, beamAlpha * (1 - a / PI));
    ellipse(x, y, 20, 20);
  }
  
  // Draw ground illumination
  for (let i = 0; i < 300; i++) {
    let x = random(width);
    let y = height;
    let r = random(5, 15);
    let a = map(noise(x * 0.01, y * 0.01), 0, 1, 0, 255);
    fill(0, 255, 255, a * 0.3);
    noStroke();
    ellipse(x, y, r, r);
  }
  
  // Draw corn stalks
  for (let stalk of stalks) {
    stalk.angle += stalk.speed;
    let sway = sin(stalk.angle) * 3;
    
    // Draw stalk base
    stroke(100, 80, 20);
    strokeWeight(3);
    line(stalk.x, stalk.y, stalk.x + sway, stalk.y - stalk.height);
    
    // Draw leaves
    stroke(30, 120, 30);
    strokeWeight(1);
    for (let i = 0; i < 5; i++) {
      let leafAngle = PI / 4 + i * PI / 8;
      let leafLength = random(10, 20);
      let leafX = stalk.x + sway + cos(leafAngle) * leafLength;
      let leafY = stalk.y - stalk.height + i * 10;
      line(stalk.x + sway, stalk.y - stalk.height, leafX, leafY);
    }
    
    // Draw light glow on stalks
    let glowIntensity = map(noise(stalk.x * 0.01, stalk.y * 0.01), 0, 1, 50, 150);
    fill(0, 255, 255, glowIntensity * 0.2);
    noStroke();
    ellipse(stalk.x + sway, stalk.y - stalk.height, 8, 8);
  }
  
  // Draw ground
  noStroke();
  fill(40, 60, 30);
  rect(0, height * 0.7, width, height * 0.3);
}
