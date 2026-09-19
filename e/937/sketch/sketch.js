let filaments = [];
let crystals = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Create initial filament network
  for (let i = 0; i < 200; i++) {
    filaments.push({
      pos: createVector(
        random(-width/2, width/2),
        random(-height/2, height/2),
        random(-100, 100)
      ),
      size: random(2, 8),
      color: color(random(100, 255), random(100, 255), random(200, 255), 150),
      age: 0,
      target: createVector(
        random(-width/2, width/2),
        random(-height/2, height/2),
        random(-100, 100)
      )
    });
  }
  
  // Create sediment accumulation points
  for (let i = 0; i < 50; i++) {
    crystals.push({
      pos: createVector(
        random(-width/2, width/2),
        random(-height/2, height/2),
        random(-100, 100)
      ),
      size: random(3, 15),
      color: color(random(200, 255), random(200, 255), random(255), 200),
      growth: 0
    });
  }
}

function draw() {
  background(10, 15, 30);
  time += 0.005;
  
  // Camera movement for dynamic view
  let cx = sin(time * 0.2) * width/4;
  let cy = cos(time * 0.15) * height/4;
  let cz = sin(time * 0.1) * 300;
  camera(0, 0, cz + 600, cx, cy, 0, 0, 1, 0);
  
  // Draw filaments
  for (let f of filaments) {
    f.age += 0.02;
    
    // Animate filament movement
    let target = p5.Vector.lerp(f.pos, f.target, 0.01);
    f.pos = target;
    
    if (f.age > 1 || dist(f.pos.x, f.pos.y, f.pos.z, f.target.x, f.target.y, f.target.z) < 5) {
      f.target = createVector(
        random(-width/2, width/2),
        random(-height/2, height/2),
        random(-100, 100)
      );
      f.age = 0;
    }
    
    // Draw filament
    push();
    translate(f.pos.x, f.pos.y, f.pos.z);
    rotateX(time * 0.5 + f.pos.x * 0.01);
    rotateY(time * 0.3 + f.pos.y * 0.01);
    fill(f.color);
    sphere(f.size);
    pop();
  }
  
  // Draw crystals
  for (let c of crystals) {
    c.growth += 0.002;
    
    // Draw crystal
    push();
    translate(c.pos.x, c.pos.y, c.pos.z);
    fill(c.color);
    sphere(c.size * (1 + c.growth));
    pop();
  }
  
  // Add some subtle ambient light effects
  pointLight(255, 255, 255, 0, 0, 300);
  pointLight(255, 255, 255, 0, 0, -300);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
