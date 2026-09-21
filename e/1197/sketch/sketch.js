let waves = [];
let circles = [];
let audioContext;

function setup() {
  createCanvas(600, 600);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize seismic waves
  for (let i = 0; i < 5; i++) {
    waves.push({
      x: random(width),
      y: random(height),
      radius: 0,
      maxRadius: random(100, 300),
      speed: random(0.5, 2),
      hue: random(260, 300)
    });
  }

  // Initialize fracturing circles
  for (let i = 0; i < 8; i++) {
    circles.push({
      x: width / 2,
      y: height / 2,
      radius: random(50, 200),
      segments: floor(random(5, 15)),
      angle: random(TWO_PI),
      speed: random(0.005, 0.02),
      hue: random(200, 240),
      pulse: random(0.5, 1.5)
    });
  }
}

function draw() {
  background(0, 0, 10);
  
  // Update and display seismic waves
  for (let i = 0; i < waves.length; i++) {
    let wave = waves[i];
    
    wave.radius += wave.speed;
    
    noFill();
    stroke(wave.hue, 80, 90, 0.5);
    strokeWeight(1);
    ellipse(wave.x, wave.y, wave.radius * 2);
    
    if (wave.radius > wave.maxRadius) {
      wave.radius = 0;
      wave.x = random(width);
      wave.y = random(height);
    }
  }

  // Update and display fracturing circles
  for (let i = 0; i < circles.length; i++) {
    let circle = circles[i];
    
    circle.angle += circle.speed;
    circle.radius += sin(frameCount * 0.02) * 0.5;
    
    push();
    translate(circle.x, circle.y);
    rotate(circle.angle);
    
    noFill();
    stroke(circle.hue, 80, 90, 0.7);
    strokeWeight(2);
    
    beginShape();
    for (let j = 0; j < circle.segments; j++) {
      let angle = map(j, 0, circle.segments, 0, TWO_PI);
      let x = cos(angle) * circle.radius;
      let y = sin(angle) * circle.radius;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    pop();
  }
}
