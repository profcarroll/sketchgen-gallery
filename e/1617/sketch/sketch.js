let rings = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Initialize rings with alternating drought/flood colors
  for (let i = 0; i < 80; i++) {
    const isDrought = i % 2 === 0;
    const hue = isDrought ? 
      (random(20, 60)) :   // Yellow/orange for drought
      (random(180, 240));  // Blue/green for flood
    
    rings.push({
      radius: random(30, 150),
      width: random(3, 12),
      hue: hue,
      saturation: random(60, 90),
      alpha: random(0.2, 0.7),
      speed: random(0.002, 0.008),
      density: random(0.3, 1.5),
      // Add randomness to create abrupt transitions
      transitionOffset: random(TWO_PI)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.05); // Semi-transparent background for trail effect

  time += 0.01;

  const centerX = width / 2;
  const centerY = height / 2;

  // Draw rings
  for (let i = 0; i < rings.length; i++) {
    let r = rings[i];
    
    // Create abrupt transitions by using a step function on time
    const transitionStep = floor(time * 0.5) % 4;
    const currentHue = r.hue + (transitionStep * 90); // Jump between hues
    
    // Radius grows with time and speed, but with irregular jumps
    let radius = r.radius + (time * r.speed * 100);
    
    // Add sudden jumps to make transitions asymmetrical
    if (frameCount % 60 === 0) {
      radius += random(-50, 50);
    }

    let angleStep = TWO_PI / (30 * r.density);

    push();
    translate(centerX, centerY);
    
    // Add rotation to create visual complexity
    rotate(time * 0.002 + r.transitionOffset);

    fill(currentHue % 360, r.saturation, 70, r.alpha);
    
    beginShape();
    for (let a = 0; a < TWO_PI; a += angleStep) {
      let x = cos(a) * radius;
      let y = sin(a) * radius;
      
      // Add slight noise to make edges jagged
      x += random(-2, 2);
      y += random(-2, 2);
      
      vertex(x, y);
    }
    endShape(CLOSE);

    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
