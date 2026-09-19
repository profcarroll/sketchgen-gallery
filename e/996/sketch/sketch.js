let rocks = [];
let snow = [];
let debris = [];
let avalancheActive = false;
let avalancheTime = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create rock channels
  for (let i = 0; i < 200; i++) {
    rocks.push({
      x: random(-width/2, width/2),
      y: random(height/4, height/2),
      z: random(-100, 100),
      size: random(50, 150),
      color: color(random(20, 40), 20, 30)
    });
  }

  // Create snow particles
  for (let i = 0; i < 5000; i++) {
    snow.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-300, 300),
      size: random(1, 3)
    });
  }
}

function draw() {
  background(220, 5, 95); // Cold sky

  // Camera movement
  rotateY(frameCount * 0.001);
  translate(0, 0, -500);

  // Draw snow
  noStroke();
  fill(360, 0, 100);
  beginShape(POINTS);
  for (let s of snow) {
    vertex(s.x, s.y, s.z);
  }
  endShape();

  // Draw rocks
  stroke(0);
  noFill();
  for (let r of rocks) {
    push();
    translate(r.x, r.y, r.z);
    rotateX(PI/4);
    rotateY(PI/6);
    box(r.size, r.size * 0.3, r.size * 0.5);
    pop();
  }

  // Draw debris if avalanche is active
  if (avalancheActive && avalancheTime < 200) {
    noStroke();
    for (let d of debris) {
      fill(d.color);
      ellipse(d.x, d.y, d.size);
    }
    avalancheTime++;
  } else if (avalancheActive) {
    avalancheActive = false;
  }

  // Draw mineral streaks on rock channels
  if (avalancheActive && avalancheTime < 100) {
    strokeWeight(2);
    for (let i = 0; i < 50; i++) {
      let r = rocks[i % rocks.length];
      stroke(random(20, 40), 80, 90);
      line(r.x, r.y, r.z, r.x + random(-100, 100), r.y + random(-50, 50), r.z + random(-50, 50));
    }
  }
}

function mousePressed() {
  if (!avalancheActive) {
    avalancheActive = true;
    avalancheTime = 0;
    
    // Create debris particles
    debris = [];
    for (let i = 0; i < 1000; i++) {
      debris.push({
        x: random(-width/2, width/2),
        y: random(height/4, height/2),
        z: random(-300, 300),
        size: random(2, 8),
        color: color(random(10, 50), 90, 90)
      });
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
