let umbrellas = [];
let rain = [];
let puddles = [];
let wind = 0;
let windDirection = 1;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create initial umbrellas
  for (let i = 0; i < 25; i++) {
    umbrellas.push({
      x: random(width),
      y: random(height * 0.3, height * 0.7),
      radius: random(40, 90),
      color: color(random(150, 255), random(100, 200), random(100, 200)),
      angle: 0,
      speed: random(0.01, 0.03),
      open: false,
      targetAngle: random(PI/4, PI/2),
      sway: 0,
      swaySpeed: random(0.02, 0.05)
    });
  }
  
  // Create rain drops
  for (let i = 0; i < 600; i++) {
    rain.push({
      x: random(width),
      y: random(-height, height),
      speed: random(4, 10),
      size: random(1, 3),
      wobble: random(TWO_PI)
    });
  }
  
  // Create puddles
  for (let i = 0; i < 20; i++) {
    puddles.push({
      x: random(width),
      y: random(height * 0.7, height),
      radius: random(30, 100)
    });
  }
}

function draw() {
  background(40, 60, 100);
  
  // Update wind
  wind = sin(frameCount * 0.01) * 0.5;
  windDirection += random(-0.005, 0.005);
  
  // Draw ground
  fill(50, 70, 90);
  noStroke();
  rect(0, height * 0.7, width, height * 0.3);
  
  // Draw puddles with reflections
  for (let puddle of puddles) {
    // Puddle surface
    fill(30, 50, 70, 150);
    noStroke();
    ellipse(puddle.x, puddle.y, puddle.radius * 2, puddle.radius);
    
    // Reflections from umbrellas
    for (let umbrella of umbrellas) {
      if (umbrella.open && dist(umbrella.x, umbrella.y, puddle.x, puddle.y) < umbrella.radius + puddle.radius) {
        let dx = umbrella.x - puddle.x;
        let dy = umbrella.y - puddle.y;
        let distance = dist(umbrella.x, umbrella.y, puddle.x, puddle.y);
        if (distance < umbrella.radius + puddle.radius) {
          let angle = atan2(dy, dx);
          let scale = map(distance, 0, umbrella.radius + puddle.radius, 1, 0.3);
          
          push();
          translate(puddle.x, puddle.y);
          rotate(angle);
          
          // Draw umbrella reflection
          fill(red(umbrella.color), green(umbrella.color), blue(umbrella.color), 80);
          noStroke();
          ellipse(0, -puddle.radius * 0.3, umbrella.radius * scale * 2, umbrella.radius * scale);
          
          pop();
        }
      }
    }
  }
  
  // Draw umbrellas
  for (let umbrella of umbrellas) {
    if (!umbrella.open) {
      umbrella.angle += umbrella.speed;
      if (umbrella.angle > umbrella.targetAngle) {
        umbrella.open = true;
      }
    } else {
      umbrella.sway = sin(frameCount * umbrella.swaySpeed + umbrella.x * 0.01) * wind * 0.5;
    }
    
    push();
    translate(umbrella.x, umbrella.y);
    rotate(umbrella.angle + umbrella.sway);
    
    // Draw umbrella canopy
    fill(umbrella.color);
    noStroke();
    ellipse(0, 0, umbrella.radius * 2, umbrella.radius);
    
    // Draw umbrella handle
    stroke(150, 100, 50);
    strokeWeight(3);
    line(0, umbrella.radius, 0, umbrella.radius + 30);
    
    pop();
  }
  
  // Draw rain
  for (let drop of rain) {
    drop.y += drop.speed;
    drop.wobble += 0.1;
    
    if (drop.y > height) {
      drop.y = random(-20, -5);
      drop.x = random(width);
    }
    
    stroke(200, 220, 255, 180);
    strokeWeight(drop.size);
    line(drop.x, drop.y, drop.x + sin(drop.wobble) * 2, drop.y + 5);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
