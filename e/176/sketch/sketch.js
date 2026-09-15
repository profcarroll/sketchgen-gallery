let buildings = [];
let plankton = [];
let time = 0;
let sun;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create buildings
  for (let i = 0; i < 50; i++) {
    buildings.push({
      x: random(-width/2, width/2),
      y: 0,
      z: random(-height/2, height/2),
      w: random(30, 80),
      h: random(100, 300),
      d: random(30, 80),
      color: color(random(200, 300), 50, 80, 0.8),
      glow: random(0.5, 1)
    });
  }

  // Create plankton
  for (let i = 0; i < 200; i++) {
    plankton.push({
      x: random(-width/2, width/2),
      y: random(-height/4, height/4),
      z: random(-height/2, height/2),
      size: random(1, 3),
      speed: random(0.1, 0.5),
      hue: random(100, 150)
    });
  }

  sun = createVector(0, -height/4, 0);
}

function draw() {
  time += 0.002;
  
  background(0);

  // Create dynamic lighting based on time
  let dayCycle = (sin(time) + 1) / 2;
  let skyHue = lerp(220, 30, dayCycle); // Deep blue to orange
  let skySat = lerp(50, 80, dayCycle);
  let skyBri = lerp(10, 90, dayCycle);

  // Ambient light
  ambientLight(skyHue, skySat, skyBri);

  // Directional sun light
  let sunAngle = time;
  let sunX = cos(sunAngle) * width/4;
  let sunY = sin(sunAngle) * height/4;
  directionalLight(skyHue + 30, skySat, skyBri, sunX, sunY, -100);

  // Draw buildings
  for (let b of buildings) {
    push();
    translate(b.x, b.y - b.h/2, b.z);
    
    // Reflective surfaces
    let reflectivity = map(sin(time * 2 + b.x * 0.01), -1, 1, 0.3, 0.8);
    let spec = color(255, 255, 255, 0.5 * reflectivity);
    
    // Building with reflective facets
    fill(b.color);
    specularColor(spec);
    shininess(50);
    
    box(b.w, b.h, b.d);
    
    pop();
  }

  // Draw plankton
  beginShape(POINTS);
  for (let p of plankton) {
    let pX = p.x + sin(time * p.speed + p.z * 0.01) * 2;
    let pY = p.y + cos(time * p.speed + p.x * 0.01) * 2;
    let pZ = p.z + sin(time * p.speed * 0.5 + p.y * 0.01) * 2;
    
    // Move plankton
    p.x = pX;
    p.y = pY;
    p.z = pZ;

    // Wrap around the scene
    if (p.x > width/2) p.x = -width/2;
    if (p.x < -width/2) p.x = width/2;
    if (p.y > height/2) p.y = -height/2;
    if (p.y < -height/2) p.y = height/2;
    if (p.z > height/2) p.z = -height/2;
    if (p.z < -height/2) p.z = height/2;

    // Glow effect
    let glow = 0.5 + 0.5 * sin(time * 3 + p.x * 0.01);
    fill(p.hue, 100, 100 * glow, 0.8);
    
    vertex(p.x, p.y, p.z);
  }
  endShape();

  // Draw dynamic light paths
  let pathPoints = [];
  for (let i = 0; i < 50; i++) {
    let angle = time + i * 0.2;
    let radius = 100 + 50 * sin(time * 0.5 + i);
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    let z = 50 * sin(time * 0.3 + i);
    pathPoints.push({x, y, z});
  }

  stroke(200, 100, 100, 0.3);
  noFill();
  beginShape();
  for (let p of pathPoints) {
    vertex(p.x, p.y, p.z);
  }
  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
