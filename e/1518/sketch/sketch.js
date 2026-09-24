let letters = [];
let words = ['hello', 'world', 'p5', 'js', 'code', 'flow', 'light', 'fall'];
let wordPositions = [];
let fontSize = 24;
let gravity = 0.1;
let wind = 0.01;
let cohesion = 0.02;
let separation = 0.5;
let maxSpeed = 3;
let mouseForce = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(fontSize);
  
  // Initialize word positions
  for (let i = 0; i < words.length; i++) {
    wordPositions.push({
      x: random(width),
      y: random(-500, -100),
      word: words[i],
      size: random(30, 60)
    });
  }
  
  // Create initial letters
  for (let i = 0; i < 200; i++) {
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
  
  // Update mouse force
  if (mouseForce > 0) {
    mouseForce -= 0.02;
  }
  
  // Update and display letters
  for (let i = letters.length - 1; i >= 0; i--) {
    let letter = letters[i];
    
    // Apply forces
    letter.vy += gravity;
    letter.vx += wind;
    
    // Mouse interaction
    if (mouseForce > 0) {
      let d = dist(letter.x, letter.y, mouseX, mouseY);
      if (d < 100) {
        let force = createVector(mouseX - letter.x, mouseY - letter.y);
        force.normalize();
        force.mult(mouseForce * 0.5);
        letter.vx += force.x;
        letter.vy += force.y;
      }
    }
    
    // Limit speed
    letter.vx = constrain(letter.vx, -maxSpeed, maxSpeed);
    letter.vy = constrain(letter.vy, 0, maxSpeed);
    
    // Update position
    letter.x += letter.vx;
    letter.y += letter.vy;
    
    // Apply cohesion and separation
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
    
    // Apply word attraction
    if (letter.wordIndex === -1) {
      for (let j = 0; j < wordPositions.length; j++) {
        let wp = wordPositions[j];
        let d = dist(letter.x, letter.y, wp.x, wp.y);
        if (d < 100) {
          let desired = createVector(wp.x - letter.x, wp.y - letter.y);
          desired.normalize();
          desired.mult(0.05);
          letter.vx += desired.x;
          letter.vy += desired.y;
          
          // If close enough to word, assign it
          if (d < 30) {
            letter.wordIndex = j;
            break;
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
  
  // Draw words at their positions
  for (let i = 0; i < wordPositions.length; i++) {
    let wp = wordPositions[i];
    
    // Only draw if it's time to show this word
    if (frameCount > 300 + i * 150) {
      fill(255, 100);
      noStroke();
      textSize(wp.size);
      text(wp.word, wp.x, wp.y);
      
      // Animate the word appearance
      wp.y += 0.5;
    }
  }
}

function mousePressed() {
  mouseForce = 1.0;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
