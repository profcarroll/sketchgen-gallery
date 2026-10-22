let letters = [];
let words = ['glow', 'light', 'deep', 'sea', 'crystal', 'fall', 'form', 'flow'];
let wordPositions = [];
let fontSize = 24;
let gravity = 0.05;
let wind = 0.005;
let cohesion = 0.01;
let separation = 0.3;
let maxSpeed = 2;
let mouseForce = 0;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(fontSize);
  
  // Initialize word positions
  for (let i = 0; i < words.length; i++) {
    wordPositions.push({
      x: random(width),
      y: random(-500, -100),
      word: words[i],
      size: random(30, 60),
      fadeIn: false,
      fadeTime: 0
    });
  }
  
  // Create initial letters
  for (let i = 0; i < 150; i++) {
    letters.push({
      x: random(width),
      y: random(-500, -100),
      char: random('abcdefghijklmnopqrstuvwxyz'),
      vx: random(-0.5, 0.5),
      vy: random(0.5, 1.5),
      life: random(200, 255),
      wordIndex: -1,
      size: random(12, 24),
      hue: random(180, 240), // Blue-green hues for bioluminescence
      saturation: random(60, 100),
      brightness: random(70, 100)
    });
  }
}

function draw() {
  background(10, 15); // Dark blue-black background
  
  time += 0.01;
  
  // Update mouse force
  if (mouseForce > 0) {
    mouseForce -= 0.02;
  }
  
  // Update and display letters
  for (let i = letters.length - 1; i >= 0; i--) {
    let letter = letters[i];
    
    // Apply forces
    letter.vy += gravity;
    letter.vx += wind + sin(time + i) * 0.002; // Gentle drifting
    
    // Mouse interaction
    if (mouseForce > 0) {
      let d = dist(letter.x, letter.y, mouseX, mouseY);
      if (d < 100) {
        let force = createVector(mouseX - letter.x, mouseY - letter.y);
        force.normalize();
        force.mult(mouseForce * 0.3);
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
    
    // Apply cohesion and separation with nearby letters
    for (let j = 0; j < letters.length; j++) {
      if (i !== j) {
        let other = letters[j];
        let d = dist(letter.x, letter.y, other.x, other.y);
        
        if (d < 60) {
          // Cohesion
          let desired = createVector(other.x - letter.x, other.y - letter.y);
          desired.normalize();
          desired.mult(cohesion);
          letter.vx += desired.x;
          letter.vy += desired.y;
          
          // Separation
          if (d < 25) {
            let diff = createVector(letter.x - other.x, letter.y - other.y);
            diff.normalize();
            diff.div(d); // Weight by distance
            letter.vx += diff.x * separation;
            letter.vy += diff.y * separation;
          }
        }
      }
    }
    
    // Apply word attraction (only if not already part of a word)
    if (letter.wordIndex === -1) {
      for (let j = 0; j < wordPositions.length; j++) {
        let wp = wordPositions[j];
        let d = dist(letter.x, letter.y, wp.x, wp.y);
        if (d < 120) {
          let desired = createVector(wp.x - letter.x, wp.y - letter.y);
          desired.normalize();
          desired.mult(0.03);
          letter.vx += desired.x;
          letter.vy += desired.y;
          
          // If close enough to word, assign it
          if (d < 40) {
            letter.wordIndex = j;
            break;
          }
        }
      }
    }
    
    // Update life and fade out
    letter.life -= 0.5;
    
    // Remove dead letters
    if (letter.life <= 0 || letter.y > height + 50) {
      letters.splice(i, 1);
      continue;
    }
    
    // Draw letter with bioluminescent effect
    fill(letter.hue, letter.saturation, letter.brightness, letter.life);
    noStroke();
    textSize(letter.size);
    text(letter.char, letter.x, letter.y);
  }
  
  // Occasionally add new letters
  if (random() < 0.2) {
    letters.push({
      x: random(width),
      y: -10,
      char: random('abcdefghijklmnopqrstuvwxyz'),
      vx: random(-0.5, 0.5),
      vy: random(0.5, 1.5),
      life: random(200, 255),
      wordIndex: -1,
      size: random(12, 24),
      hue: random(180, 240),
      saturation: random(60, 100),
      brightness: random(70, 100)
    });
  }
  
  // Draw words at their positions
  for (let i = 0; i < wordPositions.length; i++) {
    let wp = wordPositions[i];
    
    // Only draw if it's time to show this word
    if (frameCount > 200 + i * 150) {
      // Animate the word appearance
      if (!wp.fadeIn) {
        wp.fadeTime++;
        if (wp.fadeTime > 60) {
          wp.fadeIn = true;
        }
      }
      
      if (wp.fadeIn) {
        let alpha = map(sin(time + i), -1, 1, 80, 150);
        fill(200, 100, 200, alpha); // Purple-blue glow
        noStroke();
        textSize(wp.size);
        text(wp.word, wp.x, wp.y);
        
        // Make word drift gently
        wp.x += sin(time * 0.5 + i) * 0.5;
        wp.y += 0.3;
      }
    }
  }
}

function mousePressed() {
  mouseForce = 1.0;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
