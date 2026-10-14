let fragments = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Create initial grid of structural fragments
  const gridSize = 30;
  const spacing = 120;
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (random() > 0.3) { // Not all fragments exist
        fragments.push({
          x: (i - gridSize/2) * spacing,
          y: (j - gridSize/2) * spacing,
          z: 0,
          size: random(40, 100),
          rotX: random(TWO_PI),
          rotY: random(TWO_PI),
          rotZ: random(TWO_PI),
          speedX: random(-0.01, 0.01),
          speedY: random(-0.01, 0.01),
          speedZ: random(-0.01, 0.01),
          color: [random(150, 255), random(30, 80), random(20, 60)], // Rust tones
          age: 0,
          life: random(200, 500)
        });
      }
    }
  }
}

function draw() {
  background(10);
  
  time += 0.01;
  
  // Ambient light
  ambientLight(30);
  
  // Dynamic directional light
  const lightX = sin(time * 0.3) * 200;
  const lightY = cos(time * 0.5) * 150;
  const lightZ = sin(time * 0.7) * 100;
  directionalLight(255, 255, 255, lightX, lightY, lightZ);
  
  // Rotate the whole scene slowly
  rotateY(time * 0.02);
  rotateX(sin(time * 0.1) * 0.05);
  
  // Draw and update fragments
  for (let i = fragments.length - 1; i >= 0; i--) {
    const f = fragments[i];
    
    push();
    translate(f.x, f.y, f.z);
    rotateX(f.rotX);
    rotateY(f.rotY);
    rotateZ(f.rotZ);
    
    // Gradual aging and decay
    f.age++;
    if (f.age > f.life) {
      // Fragment splits into smaller pieces
      for (let j = 0; j < 3; j++) {
        fragments.push({
          x: f.x + random(-20, 20),
          y: f.y + random(-20, 20),
          z: f.z + random(-20, 20),
          size: random(5, 20),
          rotX: random(TWO_PI),
          rotY: random(TWO_PI),
          rotZ: random(TWO_PI),
          speedX: random(-0.02, 0.02),
          speedY: random(-0.02, 0.02),
          speedZ: random(-0.02, 0.02),
          color: [f.color[0] + random(-30, 10), f.color[1], f.color[2]],
          age: 0,
          life: random(100, 300)
        });
      }
      fragments.splice(i, 1);
      continue;
    }
    
    // Apply motion
    f.x += f.speedX * sin(time + i);
    f.y += f.speedY * cos(time + i);
    f.z += f.speedZ * sin(time * 0.5 + i);
    
    // Add some subtle rotation
    f.rotX += 0.002;
    f.rotY += 0.001;
    f.rotZ += 0.003;
    
    // Color based on age and position
    const hue = (f.color[0] + time * 2) % 360;
    fill(hue, f.color[1], f.color[2]);
    
    // Draw the fragment as a sheet of steel
    scale(f.size);
    box(1); // Thin rectangular prism to simulate steel sheets
    
    pop();
  }
  
  // Occasionally add new fragments to simulate rain of rust flakes
  if (frameCount % 30 === 0) {
    fragments.push({
      x: random(-width/2, width/2),
      y: -height/2,
      z: random(-1000, 1000),
      size: random(5, 20),
      rotX: random(TWO_PI),
      rotY: random(TWO_PI),
      rotZ: random(TWO_PI),
      speedX: random(-0.02, 0.02),
      speedY: random(0.5, 1.0),
      speedZ: random(-0.02, 0.02),
      color: [random(180, 255), random(30, 70), random(10, 40)],
      age: 0,
      life: random(200, 400)
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
