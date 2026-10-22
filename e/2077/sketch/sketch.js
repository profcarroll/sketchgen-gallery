let cultures = [];
const numCultures = 200;
const searchRadius = 100;
const separationDistance = 30;
const maxSpeed = 1.5;
const maxForce = 0.03;
let noiseScale = 0.01;
let noiseStrength = 0.5;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize bacterial cultures
  for (let i = 0; i < numCultures; i++) {
    cultures.push({
      pos: createVector(random(width), random(height)),
      vel: p5.Vector.random2D().mult(random(0.5, maxSpeed)),
      acc: createVector(0, 0),
      size: random(3, 8),
      color: color(random(180, 255), random(150, 220), random(100, 180), random(150, 255)),
      angle: random(TWO_PI),
      noiseOffset: random(1000)
    });
  }
}

function draw() {
  background(10, 10, 30);
  
  time += 0.01;
  
  for (let culture of cultures) {
    // Apply slime mould search behavior
    let sep = separate(culture);
    let ali = align(culture);
    let coh = cohesion(culture);
    
    // Weight the forces
    sep.mult(2.0);
    ali.mult(1.0);
    coh.mult(1.0);
    
    // Apply forces
    culture.acc.add(sep);
    culture.acc.add(ali);
    culture.acc.add(coh);
    
    // Add noise-based erratic movement for organic feel
    let nx = noise(culture.noiseOffset + time * noiseScale) - 0.5;
    let ny = noise(culture.noiseOffset + time * noiseScale + 1000) - 0.5;
    let noiseForce = createVector(nx, ny);
    noiseForce.mult(noiseStrength);
    culture.acc.add(noiseForce);
    
    // Update velocity and position
    culture.vel.add(culture.acc);
    culture.vel.limit(maxSpeed);
    culture.pos.add(culture.vel);
    culture.acc.mult(0);
    
    // Wrap around edges
    if (culture.pos.x > width + 50) culture.pos.x = -50;
    else if (culture.pos.x < -50) culture.pos.x = width + 50;
    if (culture.pos.y > height + 50) culture.pos.y = -50;
    else if (culture.pos.y < -50) culture.pos.y = height + 50;
    
    // Draw the glowing bacterial culture
    push();
    translate(culture.pos.x, culture.pos.y);
    rotate(culture.vel.heading());
    
    // Draw a simple angular glowing shape
    noStroke();
    fill(culture.color);
    beginShape();
    vertex(culture.size * 2, 0);
    vertex(-culture.size, -culture.size/2);
    vertex(-culture.size/2, 0);
    vertex(-culture.size, culture.size/2);
    endShape(CLOSE);
    
    pop();
  }
}

function separate(culture) {
  let steer = createVector(0, 0);
  let count = 0;
  for (let other of cultures) {
    let d = p5.Vector.dist(culture.pos, other.pos);
    if (d > 0 && d < separationDistance) {
      let diff = p5.Vector.sub(culture.pos, other.pos);
      diff.normalize();
      diff.div(d); // Weight by distance
      steer.add(diff);
      count++;
    }
  }

  if (count > 0) {
    steer.div(count);
    steer.normalize();
    steer.mult(maxSpeed);
    steer.sub(culture.vel);
    steer.limit(maxForce);
  }

  return steer;
}

function align(culture) {
  let sum = createVector(0, 0);
  let count = 0;
  for (let other of cultures) {
    let d = p5.Vector.dist(culture.pos, other.pos);
    if (d > 0 && d < searchRadius) {
      sum.add(other.vel);
      count++;
    }
  }

  if (count > 0) {
    sum.div(count);
    sum.normalize();
    sum.mult(maxSpeed);
    let steer = p5.Vector.sub(sum, culture.vel);
    steer.limit(maxForce);
    return steer;
  } else {
    return createVector(0, 0);
  }
}

function cohesion(culture) {
  let sum = createVector(0, 0);
  let count = 0;
  for (let other of cultures) {
    let d = p5.Vector.dist(culture.pos, other.pos);
    if (d > 0 && d < searchRadius) {
      sum.add(other.pos);
      count++;
    }
  }

  if (count > 0) {
    sum.div(count);
    return arrive(culture, sum);
  } else {
    return createVector(0, 0);
  }
}

function arrive(culture, target) {
  let desired = p5.Vector.sub(target, culture.pos);
  let d = desired.mag();
  if (d > 0) {
    desired.normalize();
    if (d < 50) {
      let m = map(d, 0, 50, 0, maxSpeed);
      desired.mult(m);
    } else {
      desired.mult(maxSpeed);
    }
    let steer = p5.Vector.sub(desired, culture.vel);
    steer.limit(maxForce);
    return steer;
  } else {
    return createVector(0, 0);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
