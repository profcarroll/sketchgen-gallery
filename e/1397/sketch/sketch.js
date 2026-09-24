let titleCard;
let transitionProgress = 0;
let isTransitioning = false;
let shapes = [];
let fontSize = 48;
let textX, textY;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create initial title card
  titleCard = createGraphics(width, height);
  titleCard.colorMode(HSB, 360, 100, 100, 1);
  titleCard.background(0, 0, 0);
  titleCard.fill(240, 100, 100); // Electric blue
  titleCard.textAlign(CENTER, CENTER);
  titleCard.textSize(fontSize);
  titleCard.text("NEON SIGNAL", 0, 0);
  
  // Initialize shapes with random positions and properties
  for (let i = 0; i < 50; i++) {
    shapes.push({
      x: random(width),
      y: random(height),
      size: random(10, 50),
      hue: random(360),
      speedX: random(-1, 1),
      speedY: random(-1, 1),
      pulse: random(TWO_PI)
    });
  }
  
  textX = -titleCard.textWidth("NEON SIGNAL") / 2;
  textY = -fontSize / 2;
}

function draw() {
  background(0, 0, 0);
  
  if (isTransitioning) {
    transitionProgress += 0.05;
    if (transitionProgress >= 1) {
      isTransitioning = false;
      transitionProgress = 0;
      
      // Generate new title card
      titleCard.background(0, 0, 0);
      const colors = [240, 300, 180]; // Blue, Magenta, Cyan
      const colorIndex = floor(random(colors.length));
      titleCard.fill(colors[colorIndex], 100, 100);
      
      const titles = ["DATA STREAM", "DIGITAL TV", "ELECTRIC", "NEON FLOW"];
      const text = random(titles);
      titleCard.textAlign(CENTER, CENTER);
      titleCard.textSize(fontSize);
      titleCard.text(text, 0, 0);
    }
  }
  
  // Draw pulsing wireframe title card
  push();
  translate(width/2, height/2);
  rotate(frameCount * 0.01);
  stroke(240, 100, 100); // Electric blue wireframe
  noFill();
  rectMode(CENTER);
  rect(0, 0, width/3, height/3);
  pop();
  
  // Draw abstract geometric shapes
  for (let shape of shapes) {
    // Pulsing effect
    let pulseSize = shape.size + sin(shape.pulse) * 10;
    shape.pulse += 0.1;
    
    // Color based on hue
    fill(shape.hue, 100, 100);
    noStroke();
    
    // Draw different shapes
    if (frameCount % 20 < 10) {
      ellipse(shape.x, shape.y, pulseSize);
    } else {
      rectMode(CENTER);
      rect(shape.x, shape.y, pulseSize, pulseSize);
    }
    
    // Update positions
    shape.x += shape.speedX;
    shape.y += shape.speedY;
    
    // Bounce off edges
    if (shape.x > width || shape.x < 0) shape.speedX *= -1;
    if (shape.y > height || shape.y < 0) shape.speedY *= -1;
  }
  
  // Draw title card on top
  image(titleCard, width/2 + textX, height/2 + textY, width/3, height/3);
  
  // Transition effect during dissolving
  if (isTransitioning) {
    let alpha = map(transitionProgress, 0, 1, 255, 0);
    fill(0, 0, 0, alpha);
    noStroke();
    rect(0, 0, width, height);
  }
}

function mousePressed() {
  if (!isTransitioning) {
    isTransitioning = true;
    transitionProgress = 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
