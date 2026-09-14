let shapes = [];
let time = 0;
let state = 0; // 0: chaotic, 1: stable, 2: collapsing, 3: reborn

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  for (let i = 0; i < 200; i++) {
    shapes.push({
      x: random(width),
      y: random(height),
      size: random(10, 50),
      angle: random(TWO_PI),
      speed: random(0.01, 0.05),
      color: color(random(255), random(255), random(255), 180),
      life: random(100, 300)
    });
  }
}

function draw() {
  background(10);
  
  time += 0.01;
  
  // Update state
  if (state === 0 && time > 10) state = 1; // chaotic to stable
  else if (state === 1 && time > 20) state = 2; // stable to collapsing
  else if (state === 2 && time > 30) state = 3; // collapsing to reborn
  else if (state === 3 && time > 40) {
    state = 0;
    time = 0;
  }
  
  // Draw shapes
  for (let i = 0; i < shapes.length; i++) {
    let s = shapes[i];
    
    // Apply motion based on state
    if (state === 0) { // chaotic
      s.x += sin(s.angle) * s.speed * 2;
      s.y += cos(s.angle) * s.speed * 2;
      s.angle += random(-0.1, 0.1);
      s.size *= 1.005;
      fill(red(s.color), green(s.color), blue(s.color), 180);
    } else if (state === 1) { // stable
      let targetX = width / 2;
      let targetY = height / 2;
      let dx = targetX - s.x;
      let dy = targetY - s.y;
      s.x += dx * 0.01;
      s.y += dy * 0.01;
      s.size *= 0.995;
      fill(200, 100, 150, 180);
    } else if (state === 2) { // collapsing
      let targetX = width / 2;
      let targetY = height / 2;
      let dx = s.x - targetX;
      let dy = s.y - targetY;
      s.x += dx * 0.03;
      s.y += dy * 0.03;
      s.size *= 1.05;
      fill(100, 50, 200, 180);
    } else if (state === 3) { // reborn
      s.x += sin(s.angle + time) * s.speed * 3;
      s.y += cos(s.angle + time) * s.speed * 3;
      s.angle += random(-0.2, 0.2);
      s.size *= 0.98;
      fill(255, 100, 50, 180);
    }
    
    // Draw shape
    push();
    translate(s.x, s.y);
    rotate(s.angle);
    ellipse(0, 0, s.size, s.size);
    pop();
    
    // Reset if out of bounds or life expired
    if (s.life-- < 0 || s.x < -100 || s.x > width + 100 || s.y < -100 || s.y > height + 100) {
      shapes[i] = {
        x: random(width),
        y: random(height),
        size: random(10, 50),
        angle: random(TWO_PI),
        speed: random(0.01, 0.05),
        color: color(random(255), random(255), random(255), 180),
        life: random(100, 300)
      };
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
