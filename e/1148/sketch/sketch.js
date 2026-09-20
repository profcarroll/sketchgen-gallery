let waves = [];
let boatX, boatY;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize waves
  for (let i = 0; i < 100; i++) {
    waves.push({
      y: random(height/2, height),
      speed: random(0.005, 0.02),
      amplitude: random(5, 20),
      frequency: random(0.01, 0.03)
    });
  }
  // Set initial boat position
  boatX = width;
  boatY = height * 0.6;
}

function draw() {
  // Sky gradient
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(255, 100, 0), color(138, 43, 226), inter);
    stroke(c);
    line(0, y, width, y);
  }

  // Draw ocean
  fill(0, 50, 100);
  noStroke();
  rect(0, height/2, width, height/2);

  // Update and draw waves
  time += 0.01;
  for (let wave of waves) {
    wave.y += wave.speed;
    if (wave.y > height) wave.y = height/2;
    
    stroke(255, 200);
    noFill();
    beginShape();
    for (let x = 0; x < width; x += 10) {
      let y = wave.y + sin(x * wave.frequency + time) * wave.amplitude;
      vertex(x, y);
    }
    endShape();
  }

  // Draw sailboat
  boatX -= 0.5;
  if (boatX < -100) boatX = width + 100;
  
  // Boat hull
  fill(30);
  noStroke();
  ellipse(boatX, boatY, 60, 20);
  
  // Mast and sail
  stroke(150);
  strokeWeight(2);
  line(boatX, boatY - 15, boatX, boatY - 40);
  fill(255, 200);
  noStroke();
  triangle(
    boatX, boatY - 40,
    boatX - 30, boatY - 20,
    boatX + 30, boatY - 20
  );
}
