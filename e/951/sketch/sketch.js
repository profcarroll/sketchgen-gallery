let beams = [];
let field;
let centerX, centerY;

function setup() {
  createCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
  
  // Create a corn field pattern using lines
  field = createGraphics(width, height);
  field.background(30, 100, 30);
  field.stroke(40, 120, 40);
  field.strokeWeight(1);
  for (let i = 0; i < 500; i++) {
    let x = random(width);
    let y = random(height * 0.6, height);
    let len = random(3, 8);
    field.line(x, y, x, y + len);
  }
  
  // Initialize beams
  for (let i = 0; i < 15; i++) {
    beams.push({
      angle: random(TWO_PI),
      speed: random(0.02, 0.05),
      size: random(30, 70),
      pulse: random(0, 100)
    });
  }
}

function draw() {
  background(10, 20, 30);
  
  // Draw the corn field
  image(field, 0, 0);
  
  // Draw the hovering disc
  fill(255, 255, 255, 100);
  noStroke();
  ellipse(centerX, centerY - 100, 80, 20);
  
  // Draw light beams
  for (let i = 0; i < beams.length; i++) {
    let beam = beams[i];
    beam.angle += beam.speed;
    beam.pulse += 0.5;
    
    let x = centerX + cos(beam.angle) * 150;
    let y = centerY + sin(beam.angle) * 150;
    
    // Create pulsing effect
    let pulseSize = beam.size + sin(beam.pulse) * 20;
    let alpha = map(sin(beam.pulse), -1, 1, 100, 255);
    
    // Draw beam as a gradient
    drawingContext.shadowBlur = 30;
    drawingContext.shadowColor = color(0, 255, 255, alpha * 0.7);
    
    fill(0, 255, 255, alpha);
    noStroke();
    ellipse(x, y, pulseSize, pulseSize * 0.3);
  }
  
  // Draw the semicircular light pattern on the ground
  drawingContext.shadowBlur = 40;
  drawingContext.shadowColor = color(0, 255, 255, 100);
  
  fill(0, 255, 255, 30);
  noStroke();
  arc(centerX, height, 300, 150, 0, PI, CHORD);
}
