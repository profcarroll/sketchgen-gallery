let rings = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Initialize rings with vibrant, contrasting colors
  for (let i = 0; i < 120; i++) {
    const hue = random(360);
    
    rings.push({
      radius: random(50, 200),
      width: random(2, 8),
      hue: hue,
      saturation: random(70, 90),
      alpha: random(0.3, 0.8),
      speed: random(0.001, 0.005),
      density: random(0.5, 2.0),
      // Add randomness to create abrupt transitions
      transitionOffset: random(TWO_PI)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.03); // Semi-transparent background for trail effect

  time += 0.01;

  const centerX = width / 2;
  const centerY = height / 2;

  // Draw rings
  for (let i = 0; i < rings.length; i++) {
    let r = rings[i];
    
    // Create sudden, asymmetrical color shifts using a step function on time
    const transitionStep = floor(time * 0.3) % 6;
    let currentHue = r.hue + (transitionStep * 60); // Jump between hues
    
    // Radius grows with time and speed, but with irregular jumps
    let radius = r.radius + (time * r.speed * 150);
    
    // Add sudden jumps to make transitions asymmetrical
    if (frameCount % 45 === 0) {
      radius += random(-30, 30);
    }

    let angleStep = TWO_PI / (20 * r.density);

    push();
    translate(centerX, centerY);
    
    // Add rotation to create visual complexity
    rotate(time * 0.003 + r.transitionOffset);

    fill(currentHue % 360, r.saturation, 70, r.alpha);
    
    beginShape();
    for (let a = 0; a < TWO_PI; a += angleStep) {
      let x = cos(a) * radius;
      let y = sin(a) * radius;
      
      // Add slight noise to make edges jagged and organic
      x += random(-3, 3);
      y += random(-3, 3);
      
      vertex(x, y);
    }
    endShape(CLOSE);

    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
