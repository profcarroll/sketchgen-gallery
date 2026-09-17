let fragments = [];
let connections = [];
let state = 'stable'; // 'stable' or 'shattering'
let pulse = 0;
let shatterTimer = 0;
let shatterDuration = 120; // frames
let reformTimer = 0;
let reformDuration = 180; // frames

class Fragment {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-0.5, 0.5);
    this.vy = random(-0.5, 0.5);
    this.size = random(10, 30);
    this.angle = random(TWO_PI);
    this.angularVelocity = random(-0.02, 0.02);
    this.color = color(random(100, 255), random(100, 255), random(200, 255));
  }

  update() {
    if (state === 'stable') {
      this.x += this.vx;
      this.y += this.vy;
      this.angle += this.angularVelocity;
      // Dampen velocity
      this.vx *= 0.99;
      this.vy *= 0.99;
    } else if (state === 'shattering') {
      this.vx += random(-0.2, 0.2);
      this.vy += random(-0.2, 0.2);
      this.angle += this.angularVelocity;
      this.x += this.vx;
      this.y += this.vy;
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    fill(this.color);
    noStroke();
    if (state === 'stable') {
      // Draw a polygon fragment
      beginShape();
      for (let i = 0; i < 5; i++) {
        let angle = map(i, 0, 5, 0, TWO_PI);
        let x = cos(angle) * this.size;
        let y = sin(angle) * this.size;
        vertex(x, y);
      }
      endShape(CLOSE);
    } else if (state === 'shattering') {
      // Draw a sharp angular piece
      rectMode(CENTER);
      rect(0, 0, this.size, this.size/3);
    }
    pop();
  }

  isOutOfBounds() {
    return (
      this.x < -50 || this.x > width + 50 ||
      this.y < -50 || this.y > height + 50
    );
  }
}

function setup() {
  createCanvas(600, 600);
  colorMode(HSB, 255);

  // Create initial fragments
  for (let i = 0; i < 30; i++) {
    fragments.push(new Fragment(random(width), random(height)));
  }

  // Connect nearby fragments
  for (let i = 0; i < fragments.length; i++) {
    for (let j = i + 1; j < fragments.length; j++) {
      let d = dist(fragments[i].x, fragments[i].y, fragments[j].x, fragments[j].y);
      if (d < 150) {
        connections.push({a: i, b: j});
      }
    }
  }
}

function draw() {
  background(20);

  // Update and display fragments
  for (let frag of fragments) {
    frag.update();
    frag.display();
  }

  // Draw connections
  if (state === 'stable') {
    stroke(180, 255, 255, 100 + sin(pulse) * 50);
    strokeWeight(1);
    for (let conn of connections) {
      let a = fragments[conn.a];
      let b = fragments[conn.b];
      line(a.x, a.y, b.x, b.y);
    }
    pulse += 0.1;
  } else if (state === 'shattering') {
    stroke(0, 255, 255, 200);
    strokeWeight(2);
    for (let conn of connections) {
      let a = fragments[conn.a];
      let b = fragments[conn.b];
      line(a.x, a.y, b.x, b.y);
    }
  }

  // State transition logic
  if (state === 'stable') {
    // Occasionally trigger shattering event
    if (frameCount % 300 === 0) {
      state = 'shattering';
      shatterTimer = 0;
    }
  } else if (state === 'shattering') {
    shatterTimer++;
    if (shatterTimer > shatterDuration) {
      state = 'reforming';
      reformTimer = 0;
      // Reset fragments to random positions and velocities
      for (let frag of fragments) {
        frag.x = random(width);
        frag.y = random(height);
        frag.vx = random(-2, 2);
        frag.vy = random(-2, 2);
        frag.angle = random(TWO_PI);
        frag.angularVelocity = random(-0.1, 0.1);
      }
    }
  } else if (state === 'reforming') {
    reformTimer++;
    if (reformTimer > reformDuration) {
      state = 'stable';
      // Reconnect fragments
      connections = [];
      for (let i = 0; i < fragments.length; i++) {
        for (let j = i + 1; j < fragments.length; j++) {
          let d = dist(fragments[i].x, fragments[i].y, fragments[j].x, fragments[j].y);
          if (d < 150) {
            connections.push({a: i, b: j});
          }
        }
      }
    }
  }

  // Remove and add fragments during reformation
  if (state === 'reforming' && reformTimer > reformDuration / 2) {
    // Rebuild structure gradually
    if (frameCount % 5 === 0 && fragments.length < 30) {
      fragments.push(new Fragment(random(width), random(height)));
    }
  }
}
