let pistons = [];
let valves = [];
let connectingRods = [];
let transaxle;
let gears = [];

function setup() {
  createCanvas(800, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create pistons
  for (let i = 0; i < 4; i++) {
    pistons.push({
      id: i,
      y: 0,
      speed: random(0.5, 1.5),
      direction: 1,
      cylinderX: -200 + i * 100,
      cylinderY: 0,
      cylinderZ: 0,
      stroke: color(random(360), 80, 90),
      fill: color(random(360), 70, 80, 0.7)
    });
  }

  // Create valves
  for (let i = 0; i < 4; i++) {
    valves.push({
      id: i,
      x: -200 + i * 100,
      y: -150,
      z: 0,
      open: false,
      openTime: 0,
      stroke: color(200, 80, 90),
      fill: color(200, 70, 80, 0.6)
    });
  }

  // Create connecting rods
  for (let i = 0; i < 4; i++) {
    connectingRods.push({
      id: i,
      pistonX: -200 + i * 100,
      pistonY: 0,
      rodLength: 150,
      angle: 0
    });
  }

  // Create transaxle
  transaxle = {
    x: 0,
    y: 200,
    z: 0,
    rotation: 0
  };

  // Create gears
  for (let i = 0; i < 3; i++) {
    gears.push({
      id: i,
      x: 0,
      y: 200 + i * 50,
      z: 0,
      rotation: 0,
      radius: 30
    });
  }
}

function draw() {
  background(220, 10, 10);

  // Update and draw pistons
  for (let i = 0; i < pistons.length; i++) {
    let p = pistons[i];
    p.y += p.speed * p.direction;
    
    if (p.y > 100) {
      p.direction = -1;
      p.stroke = color(random(360), 80, 90);
      p.fill = color(random(360), 70, 80, 0.7);
    } else if (p.y < -100) {
      p.direction = 1;
    }

    // Valve logic
    let v = valves[i];
    if (frameCount % 60 === 0) {
      v.open = !v.open;
    }
    
    // Fluid flow visualization
    if (v.open) {
      stroke(v.stroke);
      fill(v.fill);
      push();
      translate(v.x, v.y, v.z);
      sphere(10);
      pop();
    }

    // Draw cylinder
    stroke(0, 0, 30);
    noFill();
    push();
    translate(p.cylinderX, p.cylinderY, p.cylinderZ);
    cylinder(50, 4);
    pop();

    // Draw piston
    fill(p.fill);
    stroke(p.stroke);
    push();
    translate(p.cylinderX, p.y, p.cylinderZ);
    sphere(25);
    pop();

    // Update connecting rod
    let cr = connectingRods[i];
    cr.angle = atan2(p.y - cr.pistonY, p.cylinderX - cr.pistonX);
    
    stroke(0, 0, 30);
    line(p.cylinderX, p.y, p.cylinderZ, cr.pistonX, cr.pistonY, cr.pistonZ);

    // Simulate spark explosion
    if (p.direction === -1 && frameCount % 10 === 0) {
      stroke(20, 100, 100);
      noFill();
      push();
      translate(p.cylinderX, p.y, p.cylinderZ);
      sphere(30);
      pop();
    }
  }

  // Update transaxle
  transaxle.rotation += 0.02;
  
  stroke(0, 0, 30);
  noFill();
  push();
  translate(transaxle.x, transaxle.y, transaxle.z);
  rotateY(transaxle.rotation);
  cylinder(100, 8);
  pop();

  // Update gears
  for (let i = 0; i < gears.length; i++) {
    let g = gears[i];
    g.rotation += 0.05 * (i + 1);
    
    stroke(0, 0, 30);
    noFill();
    push();
    translate(g.x, g.y, g.z);
    rotateY(g.rotation);
    sphere(g.radius);
    pop();
  }
}
