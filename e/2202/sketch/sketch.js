let gears = [];
let links = [];
let flowOffset = 0;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 1);

  // Create clockwork mechanisms with interlocking gears
  for (let i = 0; i < 8; i++) {
    let angle = map(i, 0, 8, 0, TWO_PI);
    let radius = 150 + sin(time * 0.5 + i) * 30;
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    let z = 0;

    gears.push({
      x: x,
      y: y,
      z: z,
      radius: 20 + i * 2,
      rotation: time * (i % 2 ? 1 : -1),
      speed: 0.01 + i * 0.005
    });
  }

  // Create connecting links between gears
  for (let i = 0; i < gears.length; i++) {
    let next = (i + 1) % gears.length;
    links.push({
      from: i,
      to: next,
      length: dist(gears[i].x, gears[i].y, gears[next].x, gears[next].y),
      angle: atan2(gears[next].y - gears[i].y, gears[next].x - gears[i].x)
    });
  }
}

function draw() {
  background(0.1);
  noStroke();

  // Camera movement to explore the structure
  time = millis() * 0.0005;
  camera(
    sin(time * 0.3) * width/2,
    sin(time * 0.2) * height/4,
    cos(time * 0.3) * width/2 + 500,
    0, 0, 0,
    0, 1, 0
  );

  // Update gear rotations
  for (let gear of gears) {
    gear.rotation += gear.speed;
  }

  // Draw brass filaments flowing through the structure
  stroke(0.1, 0.7, 0.9);
  strokeWeight(1);
  flowOffset += 0.02;

  beginShape(LINES);
  for (let i = 0; i < 500; i++) {
    let t = i / 500;
    let angle = t * TWO_PI * 8 + flowOffset;
    let x = cos(angle) * (100 + sin(angle * 2) * 30);
    let y = sin(angle) * (100 + cos(angle * 2) * 30);
    let z = sin(angle * 0.5 + flowOffset) * 50;
    
    vertex(x, y, z);
  }
  endShape();

  // Draw gears with realistic brass shading
  noStroke();
  for (let i = 0; i < gears.length; i++) {
    let gear = gears[i];
    
    push();
    translate(gear.x, gear.y, gear.z);
    rotateZ(gear.rotation);
    
    // Gear teeth
    fill(0.1, 0.6, 0.9);
    for (let j = 0; j < 20; j++) {
      let toothAngle = j * TWO_PI / 20;
      let toothX = cos(toothAngle) * gear.radius;
      let toothY = sin(toothAngle) * gear.radius;
      
      push();
      translate(toothX, toothY);
      rotateZ(toothAngle + gear.rotation);
      rect(0, -3, 8, 6);
      pop();
    }
    
    // Gear center
    fill(0.1, 0.8, 0.7);
    sphere(gear.radius * 0.3, 6, 4);
    
    pop();
  }

  // Draw interconnecting links with flowing effect
  stroke(0.1, 0.5, 0.8);
  strokeWeight(2);
  for (let link of links) {
    let fromGear = gears[link.from];
    let toGear = gears[link.to];
    
    push();
    translate(fromGear.x, fromGear.y, fromGear.z);
    rotateZ(fromGear.rotation);
    
    let dx = toGear.x - fromGear.x;
    let dy = toGear.y - fromGear.y;
    let dz = toGear.z - fromGear.z;
    let distance = dist(fromGear.x, fromGear.y, toGear.x, toGear.y);
    
    // Create flowing animation along the link
    let flow = sin(time * 2 + link.from) * 0.5 + 0.5;
    let offset = map(flow, 0, 1, 0, distance);
    
    line(0, 0, 0, dx, dy, dz);
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
