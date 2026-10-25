let gears = [];
let time = 0;
let rings = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  frameRate(30);
  
  // Create the petrified organism rings
  for (let i = 0; i < 200; i++) {
    const radius = 50 + i * 2;
    const angle = i * 0.3;
    const x = cos(angle) * radius;
    const y = sin(angle) * radius;
    rings.push({
      x,
      y,
      radius,
      rotation: angle,
      speed: 0.001 + (i % 5) * 0.0002,
      age: i
    });
  }
  
  // Create the gear mechanism
  const centerX = 0;
  const centerY = 0;
  
  // Main large gear
  gears.push({
    x: centerX,
    y: centerY,
    radius: 150,
    teeth: 24,
    rotation: 0,
    speed: -0.005,
    color: [10, 80, 30]
  });
  
  // Medium gears
  for (let i = 0; i < 6; i++) {
    const angle = (TWO_PI / 6) * i;
    const dist = 200;
    gears.push({
      x: cos(angle) * dist,
      y: sin(angle) * dist,
      radius: 80,
      teeth: 16,
      rotation: 0,
      speed: 0.01 + i * 0.002,
      color: [20, 70, 40]
    });
  }
  
  // Small gears
  for (let i = 0; i < 12; i++) {
    const angle = (TWO_PI / 12) * i;
    const dist = 300;
    gears.push({
      x: cos(angle) * dist,
      y: sin(angle) * dist,
      radius: 40,
      teeth: 12,
      rotation: 0,
      speed: -0.02 - i * 0.001,
      color: [30, 60, 50]
    });
  }
}

function draw() {
  background(20, 10, 20);
  
  time += 0.01;
  
  // Draw the petrified organism structure
  stroke(30, 20, 70);
  strokeWeight(1);
  noFill();
  
  // Draw spiral rings of growth
  for (let ring of rings) {
    ring.rotation += ring.speed;
    
    push();
    translate(ring.x, ring.y);
    
    // Draw the ring with age-based color
    const hue = (ring.age * 2) % 360;
    stroke(hue, 50, 60);
    strokeWeight(1);
    
    // Draw a spiral pattern
    beginShape();
    for (let i = 0; i < 20; i++) {
      const angle = ring.rotation + i * 0.3;
      const radius = ring.radius + sin(time + i) * 5;
      const x = cos(angle) * radius;
      const y = sin(angle) * radius;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    pop();
  }
  
  // Draw the gear mechanism
  for (let gear of gears) {
    gear.rotation += gear.speed;
    
    push();
    translate(gear.x, gear.y);
    
    // Draw gear outline
    stroke(gear.color[0], gear.color[1], gear.color[2]);
    strokeWeight(2);
    noFill();
    circle(0, 0, gear.radius * 2);
    
    // Draw teeth
    const toothAngle = TWO_PI / gear.teeth;
    for (let i = 0; i < gear.teeth; i++) {
      const angle = gear.rotation + i * toothAngle;
      const toothX = cos(angle) * gear.radius;
      const toothY = sin(angle) * gear.radius;
      
      // Tooth tip
      const tipX = cos(angle) * (gear.radius * 0.9);
      const tipY = sin(angle) * (gear.radius * 0.9);
      
      strokeWeight(1);
      line(toothX, toothY, tipX, tipY);
    }
    
    pop();
  }
  
  // Draw connecting gears with geometric patterns
  stroke(25, 30, 60);
  strokeWeight(0.5);
  noFill();
  
  for (let i = 1; i < gears.length; i++) {
    const gearA = gears[0];
    const gearB = gears[i];
    
    // Draw geometric patterns between gears
    const angle = atan2(gearB.y - gearA.y, gearB.x - gearA.x);
    const distance = dist(gearA.x, gearA.y, gearB.x, gearB.y);
    
    // Create a repeating pattern along the connection
    const segments = 20;
    beginShape();
    for (let j = 0; j <= segments; j++) {
      const t = j / segments;
      const x = lerp(gearA.x, gearB.x, t);
      const y = lerp(gearA.y, gearB.y, t);
      
      // Add a geometric wobble to the pattern
      const wobble = sin(time * 2 + j * 0.5) * 5;
      const patternX = x + cos(angle + PI/2) * wobble;
      const patternY = y + sin(angle + PI/2) * wobble;
      
      vertex(patternX, patternY);
    }
    endShape();
  }
  
  // Add some rust and age effects
  stroke(0, 0, 10);
  strokeWeight(0.5);
  for (let i = 0; i < 100; i++) {
    const x = random(-width/2, width/2);
    const y = random(-height/2, height/2);
    point(x, y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
