let dialAngle = 0;
let burners = [];
let flameIntensity = 0;
let glowIntensity = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create burners in a circular arrangement
  let numBurners = 5;
  let radius = min(width, height) * 0.3;
  for (let i = 0; i < numBurners; i++) {
    let angle = (TWO_PI / numBurners) * i;
    let x = width/2 + cos(angle) * radius;
    let y = height/2 + sin(angle) * radius;
    burners.push({x, y, on: false});
  }
}

function draw() {
  background(30);
  
  // Update glow based on flame intensity
  glowIntensity = map(flameIntensity, 0, 1, 0, 50);
  
  // Draw metal rim
  drawRim();
  
  // Draw burners
  for (let burner of burners) {
    drawBurner(burner);
  }
  
  // Draw dial
  drawDial();
  
  // Animate flame and glow
  if (frameCount % 30 === 0) {
    flameIntensity = random(0, 1);
  }
}

function drawRim() {
  noStroke();
  fill(80);
  ellipse(width/2, height/2, min(width, height) * 0.6, min(width, height) * 0.6);
  
  // Draw glow around rim
  drawingContext.shadowBlur = glowIntensity;
  drawingContext.shadowColor = color(255, 100, 100);
  fill(80);
  ellipse(width/2, height/2, min(width, height) * 0.6, min(width, height) * 0.6);
  drawingContext.shadowBlur = 0;
}

function drawBurner(burner) {
  let size = min(width, height) * 0.08;
  
  // Draw burner base
  noStroke();
  fill(60);
  ellipse(burner.x, burner.y, size, size);
  
  // Draw flame if on
  if (burner.on) {
    let flameSize = size * (0.5 + flameIntensity * 0.5);
    
    // Flame core (blue)
    drawingContext.shadowBlur = flameSize * 0.3;
    drawingContext.shadowColor = color(100, 150, 255);
    fill(100, 150, 255);
    ellipse(burner.x, burner.y - size/2 - flameSize/4, flameSize * 0.3, flameSize);
    
    // Flame outer (orange/red)
    drawingContext.shadowColor = color(255, 100, 0);
    fill(255, 100, 0);
    ellipse(burner.x, burner.y - size/2 - flameSize/4, flameSize * 0.7, flameSize * 0.8);
    
    drawingContext.shadowBlur = 0;
  }
}

function drawDial() {
  let dialRadius = min(width, height) * 0.15;
  let centerX = width/2;
  let centerY = height/2 + dialRadius * 0.8;
  
  // Draw dial base
  noStroke();
  fill(40);
  ellipse(centerX, centerY, dialRadius * 2, dialRadius * 2);
  
  // Draw dial indicator
  stroke(200);
  strokeWeight(3);
  line(centerX, centerY, centerX + cos(dialAngle) * dialRadius * 0.8, 
       centerY + sin(dialAngle) * dialRadius * 0.8);
}

function mousePressed() {
  // Start dragging the dial
  if (dist(mouseX, mouseY, width/2, height/2 + min(width, height) * 0.15 * 0.8) < 
      min(width, height) * 0.15) {
    return true;
  }
  return false;
}

function mouseDragged() {
  // Update dial angle based on mouse position
  let dx = mouseX - width/2;
  let dy = mouseY - (height/2 + min(width, height) * 0.15 * 0.8);
  dialAngle = atan2(dy, dx);
  
  // Update burner states based on dial position
  let numBurners = burners.length;
  for (let i = 0; i < numBurners; i++) {
    let angleDiff = abs(dialAngle - (TWO_PI / numBurners) * i);
    if (angleDiff < PI/8 || angleDiff > 15*PI/8) {
      burners[i].on = true;
    } else {
      burners[i].on = false;
    }
  }
  
  // Update flame intensity based on dial position
  flameIntensity = map(dialAngle, -PI, PI, 0, 1);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
