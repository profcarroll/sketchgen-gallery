let crystals = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 1);

  // Create crystal lattice structures
  for (let i = 0; i < 150; i++) {
    crystals.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-500, 500),
      size: random(2, 8),
      growth: random(0.01, 0.03),
      age: random(100),
      hue: random(0.5, 0.7),
      saturation: 1,
      brightness: random(0.7, 1),
      branches: [],
      maxBranches: floor(random(3, 7)),
      branchLength: random(20, 60)
    });
  }
}

function draw() {
  background(0.02);
  noStroke();

  // Camera slowly orbits the scene
  time = millis() * 0.0002;
  camera(
    sin(time) * width/2,
    sin(time * 0.5) * height/4,
    cos(time) * width/2 + 300,
    0, 0, 0,
    0, 1, 0
  );

  // Update and draw crystals
  for (let i = 0; i < crystals.length; i++) {
    let crystal = crystals[i];
    
    // Grow the crystal over time
    crystal.size += crystal.growth;
    crystal.age += 0.02;

    // Create branches that grow out from the main crystal
    if (crystal.branches.length < crystal.maxBranches && random() < 0.05) {
      crystal.branches.push({
        angle: random(TWO_PI),
        length: crystal.branchLength,
        age: 0
      });
    }

    // Update branches
    for (let j = 0; j < crystal.branches.length; j++) {
      let branch = crystal.branches[j];
      branch.age += 0.05;
      
      // Make branches pulse in brightness
      let pulse = sin(time * 3 + branch.age) * 0.5 + 0.5;
      let branchBrightness = crystal.brightness * pulse;

      // Draw the branch as a line with glowing points
      push();
      translate(crystal.x, crystal.y, crystal.z);
      rotateZ(branch.angle);
      
      stroke(crystal.hue, crystal.saturation, branchBrightness);
      strokeWeight(1);
      beginShape(LINES);
      vertex(0, 0, 0);
      vertex(0, branch.length * sin(time + branch.age), 0);
      endShape();
      
      // Draw a glowing point at the end of the branch
      fill(crystal.hue, crystal.saturation, branchBrightness);
      noStroke();
      sphere(2, 3, 2);
      pop();
    }

    // Draw main crystal structure
    push();
    translate(crystal.x, crystal.y, crystal.z);
    
    // Main crystal core with pulsing effect
    let pulse = sin(time * 2 + crystal.age) * 0.3 + 0.7;
    fill(crystal.hue, crystal.saturation, crystal.brightness * pulse);
    sphere(crystal.size, 6, 4);
    
    // Draw inner lattice structure
    stroke(crystal.hue, crystal.saturation, crystal.brightness * 0.5);
    strokeWeight(0.5);
    beginShape(LINES);
    for (let j = 0; j < 6; j++) {
      let angle1 = map(j, 0, 6, 0, TWO_PI);
      let angle2 = map((j + 1) % 6, 0, 6, 0, TWO_PI);
      
      let x1 = cos(angle1) * crystal.size;
      let y1 = sin(angle1) * crystal.size;
      let x2 = cos(angle2) * crystal.size;
      let y2 = sin(angle2) * crystal.size;
      
      vertex(x1, y1, 0);
      vertex(x2, y2, 0);
    }
    endShape();
    
    pop();
  }

  // Add subtle flowing lines to show mineral vein activity
  stroke(0.6, 1, 0.8);
  strokeWeight(0.3);
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
