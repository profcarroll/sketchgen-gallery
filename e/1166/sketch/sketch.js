let gears = [];
let books = [];
let dustParticles = [];
let steamParticles = [];
let shredderPlate;
let bookStack;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create the shredder plate
  shredderPlate = createGraphics(200, 200);
  shredderPlate.colorMode(HSB, 360, 100, 100, 1);
  shredderPlate.background(0, 0, 20);
  for (let i = 0; i < 50; i++) {
    let x = random(shredderPlate.width);
    let y = random(shredderPlate.height);
    let w = random(2, 8);
    let h = random(2, 8);
    shredderPlate.noStroke();
    shredderPlate.fill(0, 0, 10);
    shredderPlate.rect(x, y, w, h);
  }

  // Create book stack
  bookStack = createGraphics(300, 400);
  bookStack.colorMode(HSB, 360, 100, 100, 1);
  bookStack.background(0, 0, 95);
  for (let i = 0; i < 20; i++) {
    let x = random(bookStack.width);
    let y = random(bookStack.height);
    let w = random(10, 30);
    let h = random(5, 15);
    bookStack.noStroke();
    bookStack.fill(0, 0, 80);
    bookStack.rect(x, y, w, h);
  }

  // Initialize gears
  for (let i = 0; i < 12; i++) {
    gears.push({
      x: random(-width/3, width/3),
      y: random(-height/4, height/4),
      z: random(-50, 50),
      radius: random(20, 50),
      rotation: random(TWO_PI),
      speed: random(0.01, 0.05),
      color: color(random(20, 40), 80, 60)
    });
  }

  // Initialize dust particles
  for (let i = 0; i < 300; i++) {
    dustParticles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-100, 100),
      size: random(0.5, 3),
      speed: random(0.1, 0.5)
    });
  }

  // Initialize steam particles
  for (let i = 0; i < 200; i++) {
    steamParticles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-100, 100),
      size: random(2, 6),
      speed: random(0.5, 1.5)
    });
  }
}

function draw() {
  background(0, 0, 10);
  
  // Ambient lighting
  ambientLight(30);
  pointLight(255, 255, 255, 0, -height/4, 0);

  // Rotate the entire scene slowly
  rotateY(frameCount * 0.002);
  rotateX(0.1);

  // Draw the book stack
  push();
  translate(-width/4, height/4, 0);
  rotateZ(PI/6);
  image(bookStack, -bookStack.width/2, -bookStack.height/2);
  pop();

  // Draw shredder plate
  push();
  translate(width/4, -height/6, 0);
  rotateX(PI/2);
  image(shredderPlate, -shredderPlate.width/2, -shredderPlate.height/2);
  pop();

  // Draw gears
  for (let gear of gears) {
    push();
    translate(gear.x, gear.y, gear.z);
    rotateZ(gear.rotation);
    
    // Gear teeth
    strokeWeight(1);
    fill(gear.color);
    noStroke();
    sphere(gear.radius, 12, 8);
    
    // Inner hole
    fill(0, 0, 10);
    sphere(gear.radius * 0.3, 8, 4);
    
    pop();
    
    gear.rotation += gear.speed;
  }

  // Draw dust particles
  stroke(0, 0, 50);
  noFill();
  beginShape(POINTS);
  for (let particle of dustParticles) {
    let x = particle.x + sin(frameCount * 0.01 + particle.z) * 2;
    let y = particle.y + cos(frameCount * 0.01 + particle.z) * 2;
    let z = particle.z + sin(frameCount * 0.005 + particle.x) * 3;
    
    vertex(x, y, z);
    
    // Update particle position
    particle.z += particle.speed;
    if (particle.z > 200) {
      particle.z = -200;
      particle.x = random(-width/2, width/2);
      particle.y = random(-height/2, height/2);
    }
  }
  endShape();

  // Draw steam particles
  stroke(180, 50, 80, 0.7);
  noFill();
  beginShape(POINTS);
  for (let particle of steamParticles) {
    let x = particle.x + sin(frameCount * 0.02 + particle.z) * 3;
    let y = particle.y + cos(frameCount *0.02 + particle.z) * 3;
    let z = particle.z + sin(frameCount * 0.01 + particle.x) * 4;
    
    vertex(x, y, z);
    
    // Update particle position
    particle.z += particle.speed;
    if (particle.z > 200) {
      particle.z = -200;
      particle.x = random(-width/2, width/2);
      particle.y = random(-height/2, height/2);
    }
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
