let gears = [];
let pipes = [];
const gearCount = 12;
const pipeCount = 20;
const maxPipeLength = 200;
const minPipeLength = 50;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create gears
  for (let i = 0; i < gearCount; i++) {
    const angle = map(i, 0, gearCount, 0, TWO_PI);
    const radius = random(80, 200);
    const x = cos(angle) * radius;
    const y = sin(angle) * radius;
    const z = random(-50, 50);
    
    gears.push({
      x,
      y,
      z,
      radius: random(20, 40),
      teeth: floor(random(12, 24)),
      rotation: random(TWO_PI),
      speed: random(0.005, 0.02)
    });
  }
  
  // Create pipes with branching structure
  for (let i = 0; i < pipeCount; i++) {
    const start = createVector(
      random(-width/3, width/3),
      random(-height/3, height/3),
      random(-100, 100)
    );
    
    const end = p5.Vector.add(start, p5.Vector.random3D().mult(random(minPipeLength, maxPipeLength)));
    
    const thickness = random(2, 6);
    
    pipes.push({
      start,
      end,
      thickness,
      color: color(random(30, 60), 70, 80, 0.8)
    });
  }
}

function draw() {
  background(0);
  
  // Rotate the scene slowly
  rotateY(frameCount * 0.001);
  rotateX(frameCount * 0.0005);
  
  // Draw pipes with depth and subtle variation
  for (let pipe of pipes) {
    stroke(pipe.color);
    strokeWeight(pipe.thickness);
    line(
      pipe.start.x, pipe.start.y, pipe.start.z,
      pipe.end.x, pipe.end.y, pipe.end.z
    );
  }
  
  // Draw gears with polished copper appearance
  noStroke();
  for (let gear of gears) {
    gear.rotation += gear.speed;
    
    push();
    translate(gear.x, gear.y, gear.z);
    rotateZ(gear.rotation);
    
    // Gear body with copper-like color
    fill(30, 80, 90);
    sphere(gear.radius, 12, 8);
    
    // Gear teeth
    fill(40, 70, 85);
    for (let i = 0; i < gear.teeth; i++) {
      const angle = map(i, 0, gear.teeth, 0, TWO_PI);
      const toothX = cos(angle) * gear.radius;
      const toothY = sin(angle) * gear.radius;
      
      push();
      translate(toothX, toothY, 0);
      rotateZ(angle);
      rect(0, -2, 8, 4);
      pop();
    }
    
    pop();
  }
  
  // Draw data streams as glowing pulses
  for (let i = 0; i < 30; i++) {
    const pipeIndex = floor(random(pipes.length));
    const t = (frameCount * 0.01 + i * 0.1) % 1;
    
    const pipe = pipes[pipeIndex];
    const pos = p5.Vector.lerp(pipe.start, pipe.end, t);
    
    // Draw the glowing pulse with subtle animation
    noStroke();
    fill(200, 100, 100, 0.8);
    push();
    translate(pos.x, pos.y, pos.z);
    sphere(3 + sin(frameCount * 0.1 + i) * 1.5);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
