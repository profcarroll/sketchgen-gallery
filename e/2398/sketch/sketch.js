let pipes = [];
let gears = [];
let dataStreams = [];
const pipeCount = 20;
const gearCount = 15;
const streamCount = 100;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create brass pipes
  for (let i = 0; i < pipeCount; i++) {
    pipes.push({
      x: random(-width/2, width/2),
      y: random(-height/3, height/3),
      z: random(-50, 50),
      length: random(100, 300),
      angle: random(TWO_PI),
      radius: random(8, 15),
      color: color(30, 60, 70)
    });
  }
  
  // Create copper gears
  for (let i = 0; i < gearCount; i++) {
    gears.push({
      x: random(-width/2, width/2),
      y: random(-height/3, height/3),
      z: random(-50, 50),
      radius: random(20, 40),
      teeth: floor(random(8, 16)),
      rotation: random(TWO_PI),
      speed: random(0.01, 0.03)
    });
  }
  
  // Create data streams
  for (let i = 0; i < streamCount; i++) {
    dataStreams.push({
      pos: createVector(random(-width/2, width/2), random(-height/3, height/3), random(-50, 50)),
      vel: p5.Vector.random3D().mult(random(1, 3)),
      size: random(2, 6),
      color: color(random(180, 240), 100, 100, 0.9),
      life: random(100, 300),
      path: []
    });
  }
}

function draw() {
  background(0);
  
  // Rotate the scene slowly
  rotateY(frameCount * 0.002);
  rotateX(frameCount * 0.001);
  
  // Draw pipes
  for (let pipe of pipes) {
    push();
    translate(pipe.x, pipe.y, pipe.z);
    rotateZ(pipe.angle);
    
    noStroke();
    fill(pipe.color);
    cylinder(pipe.radius, pipe.length, 8, 1);
    pop();
  }
  
  // Draw gears
  for (let gear of gears) {
    push();
    translate(gear.x, gear.y, gear.z);
    rotateZ(gear.rotation);
    
    noStroke();
    fill(20, 40, 60);
    circle(0, 0, gear.radius * 2);
    
    // Draw teeth
    fill(25, 35, 50);
    for (let i = 0; i < gear.teeth; i++) {
      const angle = (TWO_PI / gear.teeth) * i;
      const toothX = cos(angle) * gear.radius;
      const toothY = sin(angle) * gear.radius;
      const toothLength = gear.radius * 0.3;
      
      push();
      translate(toothX, toothY);
      rotateZ(angle);
      rect(0, -toothLength/2, gear.radius * 0.2, toothLength);
      pop();
    }
    
    // Draw center
    fill(15, 30, 40);
    circle(0, 0, gear.radius * 0.3);
    pop();
    
    gear.rotation += gear.speed;
  }
  
  // Update and draw data streams
  for (let stream of dataStreams) {
    // Move stream
    stream.pos.add(stream.vel);
    stream.life--;
    
    // Add to path
    stream.path.push(stream.pos.copy());
    if (stream.path.length > 20) {
      stream.path.shift();
    }
    
    // Reset if life expired or out of bounds
    if (stream.life <= 0 || 
        abs(stream.pos.x) > width/2 + 200 ||
        abs(stream.pos.y) > height/2 + 200) {
      stream.pos = createVector(random(-width/2, width/2), random(-height/3, height/3), random(-50, 50));
      stream.vel = p5.Vector.random3D().mult(random(1, 3));
      stream.life = random(100, 300);
      stream.path = [];
    }
    
    // Draw path
    noFill();
    stroke(stream.color);
    strokeWeight(1);
    beginShape();
    for (let point of stream.path) {
      vertex(point.x, point.y, point.z);
    }
    endShape();
    
    // Draw head
    fill(stream.color);
    noStroke();
    push();
    translate(stream.pos.x, stream.pos.y, stream.pos.z);
    sphere(stream.size);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
