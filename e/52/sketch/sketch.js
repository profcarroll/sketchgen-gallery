let time = 0;
let sun;
let buildings = [];
let plants = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create buildings
  for (let i = 0; i < 50; i++) {
    buildings.push({
      x: random(-width/2, width/2),
      y: 0,
      z: random(-height/2, height/2),
      w: random(20, 80),
      h: random(100, 300),
      d: random(20, 80),
      color: color(random(200, 300), 50, 70)
    });
  }

  // Create bioluminescent plants
  for (let i = 0; i < 100; i++) {
    plants.push({
      x: random(-width/2, width/2),
      y: 0,
      z: random(-height/2, height/2),
      size: random(5, 20),
      color: color(random(100, 200), 100, 100),
      pulseSpeed: random(0.02, 0.05)
    });
  }
}

function draw() {
  time += 0.005;
  
  // Set up the sky
  background(0);
  
  // Sun position based on time
  let sunAngle = time % (TWO_PI);
  let sunX = cos(sunAngle) * width/4;
  let sunY = sin(sunAngle) * height/4;
  
  // Sky color changes with time
  let skyHue = (sunAngle / TWO_PI * 360 + 180) % 360;
  let skySat = map(sin(sunAngle), -1, 1, 20, 80);
  let skyBri = map(sin(sunAngle), -1, 1, 10, 90);
  
  // Draw sun
  push();
  translate(sunX, sunY, 0);
  noStroke();
  fill(skyHue, skySat, skyBri, 1);
  sphere(30);
  pop();
  
  // Draw buildings
  for (let building of buildings) {
    push();
    translate(building.x, building.y, building.z);
    rotateY(time * 0.1);
    noStroke();
    
    // Building color changes with time
    let buildingHue = (skyHue + 120) % 360;
    fill(buildingHue, 40, 80);
    
    // Wet reflection effect
    let reflect = sin(time * 2 + building.x * 0.01) * 0.5 + 0.5;
    let wetColor = color(buildingHue, 60, 90 + reflect * 10);
    
    fill(wetColor);
    box(building.w, building.h, building.d);
    
    pop();
  }
  
  // Draw bioluminescent plants
  for (let plant of plants) {
    push();
    translate(plant.x, plant.y, plant.z);
    
    let pulse = sin(time * plant.pulseSpeed) * 0.5 + 0.5;
    let plantColor = color(
      hue(plant.color),
      saturation(plant.color),
      brightness(plant.color) * (0.5 + pulse * 0.5)
    );
    
    noStroke();
    fill(plantColor);
    sphere(plant.size);
    pop();
  }
  
  // Add atmospheric haze
  push();
  noStroke();
  fill(skyHue, skySat, skyBri, 0.02);
  sphere(width * 1.5);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
