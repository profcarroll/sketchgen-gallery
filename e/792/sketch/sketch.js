let rocks = [];
let snow = [];
let avalancheActive = false;
let avalancheTime = 0;
let terrainHeight;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  terrainHeight = height * 0.3;
  
  // Generate rock formations
  for (let i = 0; i < 200; i++) {
    rocks.push({
      x: random(-width/2, width/2),
      y: random(terrainHeight, height/2),
      z: random(-100, 100),
      size: random(20, 60),
      shape: random(['sphere', 'box', 'torus']),
      color: color(random(80, 120), random(70, 100), random(60, 90))
    });
  }
  
  // Generate initial snow
  for (let i = 0; i < 5000; i++) {
    snow.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-100, 100),
      size: random(0.5, 3),
      speed: random(0.1, 0.5)
    });
  }
}

function draw() {
  background(180, 210, 240);
  
  // Camera movement for atmospheric effect
  let time = millis() * 0.0001;
  camera(
    sin(time) * width/3,
    height/4,
    cos(time) * width/3,
    0, 0, 0,
    0, 1, 0
  );
  
  // Draw ground and sky
  noStroke();
  fill(200, 220, 240);
  plane(width, height);
  
  // Draw distant mountains
  drawMountains();
  
  // Draw rocks
  for (let rock of rocks) {
    push();
    translate(rock.x, rock.y, rock.z);
    fill(rock.color);
    if (rock.shape === 'sphere') sphere(rock.size);
    else if (rock.shape === 'box') box(rock.size);
    else torus(rock.size, rock.size/2);
    pop();
  }
  
  // Draw snow
  drawSnow();
  
  // Handle avalanche
  if (avalancheActive) {
    handleAvalanche();
  }
}

function drawMountains() {
  noStroke();
  fill(180, 200, 220);
  beginShape();
  for (let i = -width/2; i < width/2; i += 50) {
    let h = map(noise(i * 0.001 + millis() * 0.0001), 0, 1, terrainHeight, terrainHeight * 1.5);
    vertex(i, h, 0);
  }
  vertex(width/2, height/2, 0);
  vertex(-width/2, height/2, 0);
  endShape(CLOSE);
}

function drawSnow() {
  beginShape(POINTS);
  for (let flake of snow) {
    let y = flake.y + sin(millis() * 0.001 + flake.z) * 2;
    let x = flake.x + cos(millis() * 0.001 + flake.z) * 2;
    
    // Apply gravity and wind
    flake.y += flake.speed;
    if (flake.y > height/2) {
      flake.y = -height/2;
      flake.x = random(-width/2, width/2);
    }
    
    fill(240, 245, 255);
    vertex(flake.x, flake.y, flake.z);
  }
  endShape();
}

function handleAvalanche() {
  avalancheTime++;
  
  if (avalancheTime > 100) {
    avalancheActive = false;
    avalancheTime = 0;
    return;
  }
  
  // Create debris
  for (let i = 0; i < 50; i++) {
    let x = random(-width/4, width/4);
    let y = random(terrainHeight, height/2);
    let z = random(-100, 100);
    
    push();
    translate(x, y, z);
    fill(220, 230, 240);
    sphere(random(5, 15));
    pop();
  }
  
  // Add snow in channels
  for (let i = 0; i < 100; i++) {
    let x = random(-width/4, width/4);
    let y = random(terrainHeight, height/2);
    let z = random(-100, 100);
    
    // Only place in rock channels
    if (abs(x) > 50 && abs(y - terrainHeight) < 30) {
      push();
      translate(x, y, z);
      fill(230, 240, 250);
      sphere(random(3, 8));
      pop();
    }
  }
}

function mousePressed() {
  avalancheActive = true;
  avalancheTime = 0;
}
