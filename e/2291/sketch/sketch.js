let fragments = [];
let veins = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 1);

  // Create concrete fragments with random positions and rotations
  for (let i = 0; i < 200; i++) {
    fragments.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-500, 500),
      size: random(10, 40),
      rotationX: random(TWO_PI),
      rotationY: random(TWO_PI),
      rotationZ: random(TWO_PI),
      rx: random(-0.002, 0.002),
      ry: random(-0.002, 0.002),
      rz: random(-0.002, 0.002),
      color: color(random(0.05, 0.15), random(0.3, 0.6), random(0.7, 0.9)),
      collapseTime: random(1000, 5000)
    });
  }

  // Create bioluminescent veins
  for (let i = 0; i < 150; i++) {
    veins.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-500, 500),
      size: random(1, 3),
      speed: random(0.005, 0.02),
      hue: random(0.5, 0.7),
      saturation: 1,
      brightness: random(0.8, 1),
      life: random(100, 500),
      trail: []
    });
  }
}

function draw() {
  background(0.02);
  noStroke();

  // Camera slowly orbits the scene
  time = millis() * 0.0003;
  camera(
    sin(time) * width/2,
    sin(time * 0.5) * height/4,
    cos(time) * width/2 + 300,
    0, 0, 0,
    0, 1, 0
  );

  // Update and draw fragments
  for (let i = 0; i < fragments.length; i++) {
    let f = fragments[i];
    
    // Apply slow rotation to each fragment
    f.rotationX += f.rx;
    f.rotationY += f.ry;
    f.rotationZ += f.rz;

    // Random collapse effect over time
    if (frameCount > f.collapseTime) {
      f.x += random(-0.5, 0.5);
      f.y += random(-0.5, 0.5);
      f.z += random(-0.5, 0.5);
      f.size *= 0.99;
    }

    // Draw fragment
    push();
    translate(f.x, f.y, f.z);
    rotateX(f.rotationX);
    rotateY(f.rotationY);
    rotateZ(f.rotationZ);
    
    // Create a cracked concrete-like appearance with multiple polygons
    fill(f.color);
    for (let j = 0; j < 5; j++) {
      let angle = map(j, 0, 5, 0, TWO_PI);
      let radius = f.size * (0.8 + sin(time * 2 + j) * 0.2);
      let x = cos(angle) * radius;
      let y = sin(angle) * radius;
      
      push();
      translate(x, y, 0);
      sphere(f.size * 0.15, 3, 2);
      pop();
    }
    
    // Draw main fragment as a polyhedron
    beginShape();
    for (let j = 0; j < 8; j++) {
      let angle = map(j, 0, 8, 0, TWO_PI);
      let x = cos(angle) * f.size;
      let y = sin(angle) * f.size;
      vertex(x, y, 0);
    }
    endShape(CLOSE);
    
    pop();
  }

  // Add bioluminescent veins
  noStroke();
  beginShape(POINTS);
  for (let i = 0; i < veins.length; i++) {
    let vein = veins[i];
    
    // Update vein position
    vein.z += vein.speed * sin(time * 0.5);
    vein.life--;
    
    // Reset if life ends or goes off screen
    if (vein.life <= 0 || abs(vein.z) > 1000) {
      vein.x = random(-width/2, width/2);
      vein.y = random(-height/2, height/2);
      vein.z = random(-500, 500);
      vein.life = random(100, 500);
      vein.trail = [];
    }
    
    // Update trail
    vein.trail.push({x: vein.x, y: vein.y, z: vein.z});
    if (vein.trail.length > 20) {
      vein.trail.shift();
    }

    // Draw glowing vein
    fill(vein.hue, vein.saturation, vein.brightness);
    vertex(vein.x, vein.y, vein.z);
    
    // Draw trail as a line
    if (vein.trail.length > 1) {
      stroke(vein.hue, vein.saturation, vein.brightness);
      strokeWeight(0.5);
      beginShape(LINES);
      for (let j = 0; j < vein.trail.length - 1; j++) {
        let p1 = vein.trail[j];
        let p2 = vein.trail[j + 1];
        vertex(p1.x, p1.y, p1.z);
        vertex(p2.x, p2.y, p2.z);
      }
      endShape();
    }
  }
  endShape();

  // Add subtle flowing lines to show structural activity
  stroke(0.6, 1, 0.9);
  strokeWeight(0.5);
  beginShape(LINES);
  for (let i = 0; i < 200; i++) {
    let t = i / 200;
    let x = map(t, 0, 1, -width/2, width/2);
    let y = sin(t * TWO_PI * 3 + time) * height/4;
    let z = random(-500, 500);
    
    vertex(x, y, z);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
