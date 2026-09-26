let letters = [];
let fontSize = 24;
let gravity = 0.1;
let wind = 0.01;
let cohesion = 0.02;
let separation = 0.5;
let maxSpeed = 3;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(fontSize);
  
  // Create initial letters
  for (let i = 0; i < 100; i++) {
    letters.push({
      x: random(width),
      y: random(-500, -100),
      char: random('abcdefghijklmnopqrstuvwxyz'),
      vx: random(-1, 1),
      vy: random(0.5, 2),
      life: 255,
      wordIndex: -1
    });
  }
}

function draw() {
  background(20);
  
  // Update and display letters
  for (let i = letters.length - 1; i >= 0; i--) {
    let letter = letters[i];
    
    // Apply forces
    letter.vy += gravity;
    letter.vx += wind;
    
    // Limit speed
    letter.vx = constrain(letter.vx, -maxSpeed, maxSpeed);
    letter.vy = constrain(letter.vy, 0, maxSpeed);
    
    // Update position
    letter.x += letter.vx;
    letter.y += letter.vy;
    
    // Apply cohesion and separation with nearby letters
    for (let j = 0; j < letters.length; j++) {
      if (i !== j) {
        let other = letters[j];
        let d = dist(letter.x, letter.y, other.x, other.y);
        
        if (d < 50) {
          // Cohesion
          let desired = createVector(other.x - letter.x, other.y - letter.y);
          desired.normalize();
          desired.mult(cohesion);
          letter.vx += desired.x;
          letter.vy += desired.y;
          
          // Separation
          if (d < 20) {
            let diff = createVector(letter.x - other.x, letter.y - other.y);
            diff.normalize();
            diff.div(d); // Weight by distance
            letter.vx += diff.x * separation;
            letter.vy += diff.y * separation;
          }
        }
      }
    }
    
    // Update life
    letter.life -= 1;
    
    // Remove dead letters
    if (letter.life <= 0 || letter.y > height + 50) {
      letters.splice(i, 1);
      continue;
    }
    
    // Draw letter
    fill(255, letter.life);
    noStroke();
    text(letter.char, letter.x, letter.y);
  }
  
  // Occasionally add new letters
  if (random() < 0.3) {
    letters.push({
      x: random(width),
      y: -10,
      char: random('abcdefghijklmnopqrstuvwxyz'),
      vx: random(-1, 1),
      vy: random(0.5, 2),
      life: 255,
      wordIndex: -1
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
