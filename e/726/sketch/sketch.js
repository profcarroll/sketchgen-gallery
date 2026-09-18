let rays = [];
let planes = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create architectural planes
  for (let i = 0; i < 8; i++) {
    planes.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-200, 200),
      size: random(100, 300),
      rotX: random(TWO_PI),
      rotY: random(TWO_PI),
      rotZ: random(TWO_PI),
      color: color(random(20, 40), 50, 80)
    });
  }

  // Create energy rays
  for (let i = 0; i < 100; i++) {
    rays.push({
      pos: createVector(
        random(-width/2, width/2),
        random(-height/2, height/2),
        random(-300, 300)
      ),
      vel: p5.Vector.random3D().mult(random(1, 3)),
      trail: [],
      maxTrail: 20,
      color: color(random(240, 300), 80, 100, 0.8),
      size: random(2, 6)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;

  // Ambient lighting
  ambientLight(30);
  pointLight(255, 255, 255, 0, 0, 300);

  // Draw architectural planes
  for (let plane of planes) {
    push();
    translate(plane.x, plane.y, plane.z);
    rotateX(plane.rotX + time * 0.1);
    rotateY(plane.rotY + time * 0.05);
    rotateZ(plane.rotZ + time * 0.03);
    fill(plane.color);
    noStroke();
    box(plane.size);
    pop();
  }

  // Update and draw rays
  for (let ray of rays) {
    // Move ray
    ray.pos.add(ray.vel);

    // Add to trail
    ray.trail.push(ray.pos.copy());
    if (ray.trail.length > ray.maxTrail) {
      ray.trail.shift();
    }

    // Draw trail
    noFill();
    stroke(ray.color);
    strokeWeight(ray.size * 0.5);
    beginShape();
    for (let i = 0; i < ray.trail.length; i++) {
      let alpha = map(i, 0, ray.trail.length, 0, 1);
      stroke(red(ray.color), green(ray.color), blue(ray.color), alpha);
      vertex(ray.trail[i].x, ray.trail[i].y, ray.trail[i].z);
    }
    endShape();

    // Draw current position
    fill(ray.color);
    noStroke();
    push();
    translate(ray.pos.x, ray.pos.y, ray.pos.z);
    sphere(ray.size);
    pop();

    // Reset if out of bounds
    if (ray.pos.mag() > width * 2) {
      ray.pos.set(
        random(-width/2, width/2),
        random(-height/2, height/2),
        random(-300, 300)
      );
      ray.trail = [];
    }
  }

  // Cast rays to planes for shadow effects
  for (let plane of planes) {
    push();
    translate(plane.x, plane.y, plane.z);
    rotateX(plane.rotX + time * 0.1);
    rotateY(plane.rotY + time * 0.05);
    rotateZ(plane.rotZ + time * 0.03);

    // Simulate light interaction
    for (let i = 0; i < 5; i++) {
      let angle = time * 0.2 + i * 0.5;
      let x = sin(angle) * 100;
      let y = cos(angle) * 100;
      let z = random(-plane.size/2, plane.size/2);
      
      // Simulated shadow
      fill(0, 0, 0, 0.3);
      noStroke();
      sphere(8);
    }
    pop();
  }

  // Add some glowing particles for energy effect
  for (let i = 0; i < 10; i++) {
    let x = sin(time + i) * 200;
    let y = cos(time * 0.7 + i) * 200;
    let z = sin(time * 0.3 + i) * 200;
    
    push();
    translate(x, y, z);
    fill(200, 100, 100, 0.5);
    noStroke();
    sphere(3);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
