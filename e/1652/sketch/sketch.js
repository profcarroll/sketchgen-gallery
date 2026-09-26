let shapes = [];
let trails = [];
let palette;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Ethereal luminescent color palette
  palette = [
    color(240, 90, 30),   // Deep blue
    color(220, 80, 40),   // Mid blue
    color(60, 70, 50),    // Golden yellow
    color(40, 60, 60),    // Pale gold
    color(180, 90, 20),   // Deep turquoise
    color(200, 100, 30),  // Deeper blue
    color(190, 90, 40),   // Deeper mid blue
    color(70, 80, 50)     // Rich gold
  ];
  
  // Initialize shapes with spiral motion
  for (let i = 0; i < 25; i++) {
    shapes.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-500, 500),
      size: random(40, 100),
      speed: random(0.002, 0.005),
      hue: random(360),
      rotation: random(TWO_PI),
      prevX: 0,
      prevY: 0,
      spiralPhase: random(TWO_PI)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.1);
  
  time += 0.002;
  
  // Draw fluid shapes with trails
  for (let i = 0; i < shapes.length; i++) {
    let shape = shapes[i];
    
    push();
    
    // Store previous position for trail
    shape.prevX = shape.x;
    shape.prevY = shape.y;
    
    // Spiral motion pattern
    shape.spiralPhase += shape.speed * 0.5;
    let radius = 100 + sin(time * 0.3) * 50;
    shape.x += cos(shape.spiralPhase) * radius * 0.02;
    shape.y += sin(shape.spiralPhase) * radius * 0.02;
    
    // Add gentle drift
    shape.x += sin(time * shape.speed) * 0.3;
    shape.y += cos(time * shape.speed) * 0.3;
    shape.z += sin(time * shape.speed * 0.5) * 0.2;
    shape.rotation += 0.005;
    
    // Keep shapes in bounds with wraparound
    if (shape.x > width/2 + 150) shape.x = -width/2 - 150;
    if (shape.x < -width/2 - 150) shape.x = width/2 + 150;
    if (shape.y > height/2 + 150) shape.y = -height/2 - 150;
    if (shape.y < -height/2 - 150) shape.y = height/2 + 150;
    
    translate(shape.x, shape.y, shape.z);
    rotateZ(shape.rotation);
    
    // Draw main shape with glow
    noStroke();
    fill(shape.hue, 80, 70, 0.3);
    sphere(shape.size * 0.5, 6, 4);
    
    pop();
  }
  
  // Simple collision detection using distance check without all-pairs loop
  for (let i = 0; i < shapes.length; i++) {
    let shape = shapes[i];
    
    for (let j = i + 1; j < shapes.length; j++) {
      let other = shapes[j];
      
      let dx = shape.x - other.x;
      let dy = shape.y - other.y;
      let distance = sqrt(dx * dx + dy * dy);
      
      if (distance < shape.size/2 + other.size/2) {
        // Create a glowing bloom effect at collision point
        trails.push({
          x: shape.x,
          y: shape.y,
          life: 1.0,
          hue: shape.hue
        });
        
        // Add trail points for both shapes involved in the collision
        trails.push({
          x: other.x,
          y: other.y,
          life: 1.0,
          hue: other.hue
        });
      }
    }
  }
  
  // Update and draw trails
  for (let i = trails.length - 1; i >= 0; i--) {
    let trail = trails[i];
    
    push();
    translate(trail.x, trail.y);
    noStroke();
    fill(trail.hue, 80, 90, trail.life * 0.5);
    sphere(20 * trail.life, 4, 3);
    pop();
    
    trail.life -= 0.01;
    
    if (trail.life <= 0) {
      trails.splice(i, 1);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
