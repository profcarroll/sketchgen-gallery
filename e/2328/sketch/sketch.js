let filaments = [];
let junction;
let time;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  time = 0;
  
  // Create two energy filaments approaching junction
  for (let i = 0; i < 2; i++) {
    filaments.push({
      path: [],
      hue: i === 0 ? 200 : 120, // Blue and green
      width: random(3, 6),
      speed: random(0.005, 0.01),
      pulse: random(TWO_PI),
      direction: i === 0 ? 1 : -1,
      startX: random(-100, 100),
      startY: random(-100, 100)
    });
  }
  
  // Set up junction point
  junction = {
    x: 0,
    y: 0,
    z: 0,
    pulse: 0
  };
}

function draw() {
  background(30, 20, 10); // Amber-toned resin
  
  time += 0.01;
  
  // Camera zoomed in on junction
  let camZ = 150 + sin(time * 0.5) * 20;
  camera(0, 0, camZ, 0, 0, 0, 0, 1, 0);
  
  // Draw resin background - subtle texture using batched points
  let points = [];
  for (let i = 0; i < 1000; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-500, -100);
    points.push(createVector(x, y, z));
  }
  
  push();
  translate(0, 0, 0);
  noStroke();
  fill(30, 15, 5);
  beginShape(POINTS);
  for (let v of points) {
    vertex(v.x, v.y, v.z);
  }
  endShape();
  pop();
  
  // Update and draw filaments
  for (let i = 0; i < filaments.length; i++) {
    let filament = filaments[i];
    
    // Initialize path if empty
    if (filament.path.length === 0) {
      let startX = filament.startX;
      let startY = filament.startY;
      let startZ = -300;
      
      filament.path.push(createVector(startX, startY, startZ));
    } else {
      // Add new point along path
      let last = filament.path[filament.path.length - 1];
      let next = createVector(
        last.x + random(-2, 2) * filament.direction,
        last.y + random(-2, 2) * filament.direction,
        last.z + random(1, 3)
      );
      
      // Make them converge toward junction
      next.x += (junction.x - next.x) * 0.02;
      next.y += (junction.y - next.y) * 0.02;
      next.z += (junction.z - next.z) * 0.02;
      
      filament.path.push(next);
      
      // Limit path length
      if (filament.path.length > 150) {
        filament.path.shift();
      }
    }
    
    // Pulsing glow effect
    filament.pulse += filament.speed;
    let alpha = 0.6 + sin(filament.pulse) * 0.3;
    
    // Draw filament as batched line
    stroke(filament.hue, 100, 100, alpha);
    strokeWeight(filament.width);
    noFill();
    
    beginShape();
    for (let point of filament.path) {
      vertex(point.x, point.y, point.z);
    }
    endShape();
    
    // Draw junction interaction
    if (filament.path.length > 10) {
      let lastPoint = filament.path[filament.path.length - 1];
      let distToJunction = dist(lastPoint.x, lastPoint.y, lastPoint.z, junction.x, junction.y, junction.z);
      
      if (distToJunction < 30) {
        // Visual interaction at junction
        junction.pulse += 0.1;
        let pulseSize = 5 + sin(junction.pulse) * 3;
        
        push();
        translate(lastPoint.x, lastPoint.y, lastPoint.z);
        noStroke();
        fill(200, 100, 100, 0.5);
        sphere(pulseSize);
        pop();
      }
    }
  }
  
  // Draw energy flow lines at junction
  if (time % 0.3 < 0.05) {
    stroke(200, 100, 100, 0.7);
    strokeWeight(1);
    noFill();
    
    beginShape();
    for (let i = 0; i < 10; i++) {
      let angle = map(i, 0, 9, 0, TWO_PI);
      let radius = 5 + sin(time * 3 + angle) * 3;
      let x = junction.x + cos(angle) * radius;
      let y = junction.y + sin(angle) * radius;
      let z = junction.z;
      
      vertex(x, y, z);
    }
    endShape(CLOSE);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
