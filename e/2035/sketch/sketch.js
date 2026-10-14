let cables = [];
let particles = [];
let crystals = [];
let shockwaves = [];
let cablePoints = [];
let crystalMeshes = [];

const cableCount = 100;
const particleCount = 200;
const crystalCount = 150;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create cables
  for (let i = 0; i < cableCount; i++) {
    cables.push({
      points: [],
      length: random(80, 150),
      hue: random(20, 50),
      sat: random(30, 60),
      bri: random(10, 30)
    });
  }

  // Initialize cable paths
  for (let cable of cables) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-300, 300);

    cable.points.push(createVector(x, y, z));

    let angle = random(TWO_PI);
    let prevPoint = cable.points[0];
    for (let i = 1; i < cable.length; i++) {
      let dx = cos(angle) * random(5, 12);
      let dy = sin(angle) * random(5, 12);
      let dz = random(-6, 6);

      let newPoint = createVector(
        prevPoint.x + dx,
        prevPoint.y + dy,
        prevPoint.z + dz
      );

      // Keep cables within canvas bounds
      if (newPoint.x < -width/2 || newPoint.x > width/2 ||
          newPoint.y < -height/2 || newPoint.y > height/2 ||
          newPoint.z < -500 || newPoint.z > 500) {
        newPoint.x = constrain(newPoint.x, -width/2, width/2);
        newPoint.y = constrain(newPoint.y, -height/2, height/2);
        newPoint.z = constrain(newPoint.z, -500, 500);
      }

      cable.points.push(newPoint);
      angle += random(-0.15, 0.15);
    }
  }

  // Create particles along cables
  for (let i = 0; i < particleCount; i++) {
    let cableIndex = floor(random(cables.length));
    let pointIndex = floor(random(cables[cableIndex].points.length));
    let pos = cables[cableIndex].points[pointIndex].copy();
    
    particles.push({
      pos: pos,
      cableIndex: cableIndex,
      pointIndex: pointIndex,
      speed: random(0.3, 1.0),
      hue: random(180, 300),
      sat: 100,
      bri: 100,
      size: random(1, 2)
    });
  }

  // Create crystal formations
  for (let i = 0; i < crystalCount; i++) {
    crystals.push({
      pos: createVector(random(-width/2, width/2), random(-height/2, height/2), random(-400, 400)),
      size: random(10, 25),
      hue: random(200, 260),
      sat: random(30, 70),
      bri: random(20, 80)
    });
  }

  // Build crystal meshes once
  buildCrystalMeshes();
}

function buildCrystalMeshes() {
  for (let crystal of crystals) {
    let mesh = [];
    let detail = 4;
    let radius = crystal.size;

    for (let i = 0; i < detail; i++) {
      let angle1 = map(i, 0, detail, 0, TWO_PI);
      let angle2 = map(i, 0, detail, 0, PI);

      let x1 = cos(angle1) * radius;
      let y1 = sin(angle1) * radius;
      let z1 = 0;

      let x2 = cos(angle1 + PI / detail) * radius;
      let y2 = sin(angle1 + PI / detail) * radius;
      let z2 = 0;

      mesh.push(createVector(x1, y1, z1));
      mesh.push(createVector(x2, y2, z2));

      // Add vertical lines
      for (let j = 0; j < detail; j++) {
        let a = map(j, 0, detail, 0, TWO_PI);
        let b = map(j + 1, 0, detail, 0, TWO_PI);

        mesh.push(createVector(cos(a) * radius, sin(a) * radius, 0));
        mesh.push(createVector(cos(b) * radius, sin(b) * radius, 0));
      }
    }

    crystalMeshes.push(mesh);
  }
}

function draw() {
  background(0);
  noFill();

  // Camera movement
  let time = millis() * 0.0001;
  let camX = sin(time) * 200;
  let camY = cos(time * 0.7) * 100;
  let camZ = 500 + sin(time * 0.5) * 200;
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);

  // Draw cables as lines
  strokeWeight(1);
  beginShape(LINES);
  for (let cable of cables) {
    let hue = cable.hue;
    let sat = cable.sat;
    let bri = cable.bri;
    stroke(hue, sat, bri, 0.7);
    for (let point of cable.points) {
      vertex(point.x, point.y, point.z);
    }
  }
  endShape();

  // Draw crystals
  for (let i = 0; i < crystals.length; i++) {
    let crystal = crystals[i];
    let mesh = crystalMeshes[i];

    push();
    translate(crystal.pos.x, crystal.pos.y, crystal.pos.z);
    fill(crystal.hue, crystal.sat, crystal.bri, 0.2);
    noStroke();
    
    beginShape(LINES);
    for (let v of mesh) {
      vertex(v.x, v.y, v.z);
    }
    endShape();

    pop();
  }

  // Update and draw particles
  for (let particle of particles) {
    // Move along cable path
    let cable = cables[particle.cableIndex];
    let nextPointIndex = (particle.pointIndex + 1) % cable.points.length;
    let target = cable.points[nextPointIndex];
    
    let dir = p5.Vector.sub(target, particle.pos);
    let distance = dir.mag();
    
    if (distance < 2) {
      particle.pointIndex = nextPointIndex;
    } else {
      dir.normalize();
      dir.mult(particle.speed);
      particle.pos.add(dir);
    }

    // Draw glowing particle
    noStroke();
    fill(particle.hue, particle.sat, particle.bri, 0.9);
    push();
    translate(particle.pos.x, particle.pos.y, particle.pos.z);
    sphere(particle.size, 2, 2); // Lower detail
    pop();
    
    // Add pulse effect
    let pulse = sin(frameCount * 0.1 + particle.pointIndex) * 0.5 + 0.5;
    fill(particle.hue, particle.sat, particle.bri, pulse * 0.8);
    push();
    translate(particle.pos.x, particle.pos.y, particle.pos.z);
    sphere(particle.size * (1 + pulse * 0.5), 2, 2); // Lower detail
    pop();
  }

  // Draw shockwaves
  for (let i = shockwaves.length - 1; i >= 0; i--) {
    let wave = shockwaves[i];
    wave.radius += wave.speed;
    wave.alpha -= 0.02;
    
    if (wave.alpha <= 0) {
      shockwaves.splice(i, 1);
    } else {
      push();
      translate(wave.pos.x, wave.pos.y, wave.pos.z);
      noFill();
      stroke(255, 255, 255, wave.alpha);
      sphere(wave.radius, 6, 6); // Lower detail
      pop();
    }
  }
}

function mousePressed() {
  // Create a shockwave at the click position
  let x = random(-width/2, width/2);
  let y = random(-height/2, height/2);
  let z = random(-400, 400);
  
  shockwaves.push({
    pos: createVector(x, y, z),
    radius: 0,
    speed: 2,
    alpha: 1
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
