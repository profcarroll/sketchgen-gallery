let primaryField, secondaryField;
let bg;

function setup() {
  createCanvas(windowWidth, windowHeight);
  bg = color(240, 235, 230);
  
  // Create the main fields with soft edges
  primaryField = createGraphics(width, height);
  primaryField.noStroke();
  primaryField.rectMode(CENTER);
  
  secondaryField = createGraphics(width, height);
  secondaryField.noStroke();
  secondaryField.rectMode(CENTER);
}

function draw() {
  background(bg);
  
  // Animate the primary field
  let hue1 = (frameCount * 0.2) % 360;
  let saturation1 = 30 + sin(frameCount * 0.02) * 10;
  let brightness1 = 85 + sin(frameCount * 0.015) * 15;
  
  primaryField.fill(hue1, saturation1, brightness1, 200);
  primaryField.rect(width/2, height/2, width * 0.7, height * 0.6);
  
  // Add soft edges
  primaryField.blendMode(ADD);
  primaryField.fill(255, 200);
  primaryField.ellipse(width/2, height/2, width * 0.8, height * 0.7);
  primaryField.blendMode(BLEND);
  
  // Draw the primary field
  image(primaryField, 0, 0);
  
  // Animate the secondary field
  let hue2 = (frameCount * 0.15 + 60) % 360;
  let saturation2 = 40 + sin(frameCount * 0.025) * 15;
  let brightness2 = 90 + sin(frameCount * 0.01) * 10;
  
  secondaryField.fill(hue2, saturation2, brightness2, 180);
  
  // Vary the size and position based on cursor
  let sizeFactor = map(mouseX, 0, width, 0.5, 1.5);
  let x = width/2 + (mouseX - width/2) * 0.1;
  let y = height/2 + (mouseY - height/2) * 0.1;
  
  secondaryField.rect(x, y, width * 0.4 * sizeFactor, height * 0.3 * sizeFactor);
  
  // Add soft edges to secondary field
  secondaryField.blendMode(ADD);
  secondaryField.fill(255, 150);
  secondaryField.ellipse(x, y, width * 0.5 * sizeFactor, height * 0.4 * sizeFactor);
  secondaryField.blendMode(BLEND);
  
  // Draw the secondary field
  image(secondaryField, 0, 0);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
