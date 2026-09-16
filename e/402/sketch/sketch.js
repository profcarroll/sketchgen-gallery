let cornStalks = [];
let dustPlumes = [];
let ufo;
let skyColor;

function setup() {
  createCanvas(windowWidth, windowHeight);
  skyColor = color(200, 150, 100); // dusky sky

  // Create corn stalks
  for (let i = 0; i < 300; i++) {
    cornStalks.push({
      x: random(width),
      y: random(height * 0.7, height),
      height: random(20, 60),
      angle: random(-0.1, 0.1),
      swayOffset: random(TWO_PI)
    });
  }

  ufo = {
    x: width / 2,
    y: -50,
    radius: 30,
    speed: 2,
    hoverTimer: 0,
    hoverDuration: 100
  };
}

function draw() {
  background(skyColor);

  // Draw sun
  fill(255, 200, 0);
  noStroke();
  ellipse(width * 0.8, height * 0.2, 60, 60);

  // Update and draw corn stalks
  for (let stalk of cornStalks) {
    stalk.swayOffset += 0.02;
    let sway = sin(stalk.swayOffset) * 3;
    
    stroke(100, 80, 0);
    strokeWeight(2);
    line(stalk.x, stalk.y, stalk.x + sway, stalk.y - stalk.height);
    
    // Draw leaf at top
    fill(50, 150, 50);
    noStroke();
    ellipse(stalk.x + sway, stalk.y - stalk.height, 8, 12);
  }

  // Update and draw UFO
  ufo.y += ufo.speed;
  
  if (ufo.y > height / 2) {
    ufo.hoverTimer++;
    if (ufo.hoverTimer > ufo.hoverDuration) {
      ufo.speed = -3; // Ascend
    }
  } else {
    ufo.speed = 2; // Descend
    ufo.hoverTimer = 0;
  }

  // Create dust plumes when descending
  if (ufo.speed > 1 && ufo.y > height * 0.3) {
    for (let i = 0; i < 3; i++) {
      dustPlumes.push({
        x: random(ufo.x - 20, ufo.x + 20),
        y: ufo.y,
        size: random(5, 15),
        speed: random(0.5, 1.5)
      });
    }
  }

  // Update and draw dust plumes
  for (let i = dustPlumes.length - 1; i >= 0; i--) {
    let p = dustPlumes[i];
    p.y += p.speed;
    p.size *= 0.97;
    
    if (p.size < 1) {
      dustPlumes.splice(i, 1);
    } else {
      fill(200, 180, 150, 150);
      noStroke();
      ellipse(p.x, p.y, p.size, p.size * 0.6);
    }
  }

  // Draw UFO
  fill(255, 255, 200, 200);
  stroke(200, 200, 150);
  strokeWeight(2);
  ellipse(ufo.x, ufo.y, ufo.radius * 2, ufo.radius);

  // UFO glow
  noStroke();
  fill(255, 255, 200, 50);
  ellipse(ufo.x, ufo.y, ufo.radius * 3, ufo.radius * 1.5);

  // Draw shadow
  fill(0, 0, 0, 50);
  noStroke();
  ellipse(ufo.x, height - 20, ufo.radius * 1.5, 5);

  // Reset UFO position if it goes off screen
  if (ufo.y > height + 100) {
    ufo.y = -50;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
