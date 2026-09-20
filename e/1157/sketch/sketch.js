let bricks = [];
let roots = [];
let particles = [];
let gravity = 0.1;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();

  // Create initial bricks
  for (let i = 0; i < 50; i++) {
    bricks.push({
      x: random(-width/2 + 100, width/2 - 100),
      y: random(-height/2 + 100, height/2 - 300),
      w: random(40, 60),
      h: random(20, 30),
      z: random(-50, 50),
      color: color(random(100, 150), random(40, 80), random(20, 60)),
      health: random(0.7, 1)
    });
  }

  // Create root tendrils
  for (let i = 0; i < 100; i++) {
    roots.push({
      x: random(-width/2 + 50, width/2 - 50),
      y: random(-height/2 + 50, height/2 - 50),
      z: random(-50, 50),
      length: random(10, 40),
      angle: random(TWO_PI),
      segments: floor(random(3, 8)),
      color: color(70, 40, 10)
    });
  }

  // Create particles for debris
  for (let i = 0; i < 200; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-100, 100),
      size: random(1, 3),
      speed: random(0.01, 0.05),
      color: color(random(60, 100), random(20, 40), random(5, 15))
    });
  }
}

function draw() {
  background(20);
  
  // Rotate the scene slowly
  rotateY(time * 0.001);
  rotateX(sin(time * 0.0005) * 0.1);

  // Draw bricks with weathering
  for (let brick of bricks) {
    push();
    translate(brick.x, brick.y, brick.z);
    
    // Apply weathered texture to brick
    fill(brick.color);
    box(brick.w, brick.h, 10);
    
    // Add mortar lines
    stroke(50, 30, 10);
    strokeWeight(1);
    noFill();
    beginShape();
    vertex(-brick.w/2, -brick.h/2, 5);
    vertex(brick.w/2, -brick.h/2, 5);
    vertex(brick.w/2, brick.h/2, 5);
    vertex(-brick.w/2, brick.h/2, 5);
    endShape(CLOSE);
    
    pop();
    
    // Apply some decay over time
    if (brick.health > 0) {
      brick.health -= 0.0001;
    }
  }

  // Draw root tendrils
  for (let root of roots) {
    push();
    translate(root.x, root.y, root.z);
    
    fill(root.color);
    noStroke();
    
    beginShape();
    vertex(0, 0, 0);
    for (let i = 0; i < root.segments; i++) {
      let angle = root.angle + sin(i * 0.5) * 0.3;
      let length = root.length * (i / root.segments);
      let x = cos(angle) * length;
      let y = sin(angle) * length;
      vertex(x, y, 0);
    }
    endShape();
    
    pop();
  }

  // Animate particles
  for (let p of particles) {
    push();
    translate(p.x, p.y, p.z);
    
    fill(p.color);
    noStroke();
    sphere(p.size);
    
    p.y += p.speed * gravity;
    if (p.y > height/2 + 100) {
      p.y = -height/2 - 100;
      p.x = random(-width/2, width/2);
      p.z = random(-100, 100);
    }
    
    pop();
  }

  // Simulate brick collapse over time
  if (time % 500 === 0) {
    for (let i = 0; i < bricks.length; i++) {
      if (random() > 0.95 && bricks[i].health > 0) {
        bricks[i].health -= 0.1;
        // Add some particles when brick breaks
        for (let j = 0; j < 5; j++) {
          particles.push({
            x: bricks[i].x + random(-20, 20),
            y: bricks[i].y,
            z: bricks[i].z + random(-10, 10),
            size: random(1, 3),
            speed: random(0.05, 0.1),
            color: bricks[i].color
          });
        }
      }
    }
  }

  time++;
}
