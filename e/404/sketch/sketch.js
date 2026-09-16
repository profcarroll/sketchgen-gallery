let gears = [];
let rollers = [];
let papers = [];
let cameraAngle = 0;
let isPaused = false;
let pauseTime = 0;

function setup() {
  createCanvas(800, 600, WEBGL);
  noStroke();

  // Create gears
  for (let i = 0; i < 10; i++) {
    gears.push({
      x: random(-300, 300),
      y: random(-200, 200),
      z: random(-100, 100),
      radius: random(20, 50),
      rotation: random(TWO_PI),
      speed: random(0.01, 0.03)
    });
  }

  // Create rollers
  for (let i = 0; i < 8; i++) {
    rollers.push({
      x: random(-350, 350),
      y: random(-250, 250),
      z: random(-150, 150),
      radius: random(15, 30),
      rotation: random(TWO_PI),
      speed: random(0.02, 0.05)
    });
  }

  // Create papers
  for (let i = 0; i < 20; i++) {
    papers.push({
      x: random(-400, 400),
      y: random(-300, 300),
      z: random(-200, 200),
      width: random(80, 120),
      height: random(100, 150),
      rotation: random(TWO_PI),
      speed: random(0.005, 0.01)
    });
  }
}

function draw() {
  background(30);
  ambientLight(60);
  pointLight(255, 255, 255, 0, 0, 400);

  // Camera movement
  cameraAngle += 0.002;
  if (!isPaused) {
    camera(0, 0, 400 + sin(cameraAngle) * 100, 0, 0, 0, 0, 1, 0);
  } else {
    camera(0, 0, 400, 0, 0, 0, 0, 1, 0);
  }

  // Draw gears
  for (let gear of gears) {
    push();
    translate(gear.x, gear.y, gear.z);
    rotateZ(gear.rotation);
    gear.rotation += gear.speed;
    
    fill(100, 80, 60);
    cylinder(gear.radius, 10);

    // Gear teeth
    fill(150, 120, 90);
    for (let i = 0; i < 20; i++) {
      let angle = (TWO_PI / 20) * i;
      let x = gear.radius * cos(angle);
      let y = gear.radius * sin(angle);
      rotateZ(PI / 10);
      push();
      translate(x, y, 0);
      box(8, 3, 5);
      pop();
    }
    pop();
  }

  // Draw rollers
  for (let roller of rollers) {
    push();
    translate(roller.x, roller.y, roller.z);
    rotateZ(roller.rotation);
    roller.rotation += roller.speed;

    fill(120, 100, 80);
    cylinder(roller.radius, 30);

    // Roller texture
    fill(140, 120, 100);
    for (let i = 0; i < 5; i++) {
      let angle = (TWO_PI / 5) * i;
      let x = roller.radius * cos(angle);
      let y = roller.radius * sin(angle);
      push();
      translate(x, y, 15);
      box(3, 3, 20);
      pop();
    }
    pop();
  }

  // Draw papers
  for (let paper of papers) {
    push();
    translate(paper.x, paper.y, paper.z);
    rotateZ(paper.rotation);
    paper.rotation += paper.speed;

    fill(240, 240, 240);
    rectMode(CENTER);
    rect(0, 0, paper.width, paper.height);

    // Paper streaks
    fill(200, 180, 160);
    for (let i = 0; i < 5; i++) {
      let x = random(-paper.width/2 + 5, paper.width/2 - 5);
      let y = random(-paper.height/2 + 5, paper.height/2 - 5);
      rect(x, y, 3, 10);
    }
    pop();
  }

  // Ink streaks
  for (let i = 0; i < 10; i++) {
    let x = random(-400, 400);
    let y = random(-300, 300);
    let z = random(-200, 200);
    let width = random(50, 150);
    let height = random(3, 10);
    
    push();
    translate(x, y, z);
    rotateZ(random(TWO_PI));
    fill(40, 40, 40, 100);
    rect(0, 0, width, height);
    pop();
  }
}

function mousePressed() {
  if (!isPaused) {
    isPaused = true;
    pauseTime = millis();
  } else {
    isPaused = false;
  }
}
