let burnerPositions = [];
let dialAngle = 0;
let flameIntensity = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Position burners in a grid
  const rows = 2;
  const cols = 3;
  const spacingX = width / (cols + 1);
  const spacingY = height / (rows + 1);
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      burnerPositions.push({
        x: spacingX * (j + 1),
        y: spacingY * (i + 1),
        radius: 30
      });
    }
  }
}

function draw() {
  background(50);
  
  // Draw stovetop surface
  fill(80, 80, 80);
  noStroke();
  rect(0, 0, width, height);
  
  // Draw burners
  fill(40, 40, 40);
  for (let burner of burnerPositions) {
    ellipse(burner.x, burner.y, burner.radius * 2);
  }
  
  // Draw dial
  const dialX = width / 2;
  const dialY = height - 100;
  const dialRadius = 60;
  
  fill(30, 30, 30);
  ellipse(dialX, dialY, dialRadius * 2);
  
  // Draw dial indicator
  stroke(255);
  strokeWeight(3);
  line(
    dialX,
    dialY,
    dialX + cos(dialAngle) * (dialRadius - 10),
    dialY + sin(dialAngle) * (dialRadius - 10)
  );
  
  // Draw flames if dial is turned
  if (abs(dialAngle) > 0.1) {
    drawFlames();
  }
}

function drawFlames() {
  const flameLength = map(flameIntensity, 0, 1, 50, 150);
  const hueOffset = (frameCount * 2) % 360;
  
  for (let burner of burnerPositions) {
    // Create flame particles
    const numParticles = 20;
    for (let i = 0; i < numParticles; i++) {
      const angle = random(TWO_PI);
      const distance = random(1, flameLength);
      const x = burner.x + cos(angle) * distance;
      const y = burner.y - distance * 0.5;
      
      // Color based on dial position and time
      const hue = (hueOffset + map(i, 0, numParticles, 0, 60)) % 360;
      const saturation = 100;
      const brightness = map(i, 0, numParticles, 80, 40);
      
      fill(hue, saturation, brightness);
      noStroke();
      ellipse(x, y, random(2, 6));
    }
  }
  
  // Animate flame intensity
  flameIntensity = (flameIntensity + 0.02) % 1;
}

function mouseDragged() {
  // Update dial angle based on horizontal drag
  const deltaX = mouseX - width / 2;
  dialAngle = map(deltaX, -width/2, width/2, -PI/3, PI/3);
  
  // Update flame intensity based on dial position
  flameIntensity = map(abs(dialAngle), 0, PI/3, 0, 1);
}
