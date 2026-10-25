let crystals = [];
let time = 0;
let lines = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 1);

  // Create crystal lattice structures
  for (let i = 0; i < 200; i++) {
    crystals.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-500, 500),
      size: random(3, 12),
      growth: random(0.01, 0.04),
      age: random(100),
      hue: random(0.5, 0.7),
      saturation: 1,
      brightness: random(0.6, 1),
      branches: [],
      maxBranches: floor(random(3, 7)),
      branchLength: random(20, 60),
      shear: random(TWO_PI),
      shearSpeed: random(0.02, 0.05)
    });
  }

  // Pre-generate flowing lines
  for (let i = 0; i < 100; i++) {
    lines.push({
      points: [],
      speed: random(0.01, 0.03),
      offset: random(TWO_PI)
    });
    for (let j = 0; j < 20; j++) {
      lines[i].points.push({
        x: random(-width/2, width/2),
        y: random(-height/2, height/2),
        z: random(-500, 500)
      });
    }
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
    cos(time) * width/2 + 500,
    0, 0, 0,
    0, 1, 0
  );

  // Update and draw crystals
  for (let i = 0; i < crystals.length; i++) {
    let crystal = crystals[i];
    
    // Shear the crystal structure
    crystal.shear += crystal.shearSpeed;
    crystal.size += crystal.growth;

    // Create branches that grow out from the main crystal
    if (crystal.branches.length < crystal.maxBranches && random() < 0.03) {
      crystal.branches.push({
        angle: random(TWO_PI),
        length: crystal.branchLength,
        age: 0,
        hue: crystal.hue + random(-0.05, 0.05)
      });
    }

    // Update branches
    for (let j = crystal.branches.length - 1; j >= 0; j--) {
      let branch = crystal.branches[j];
      branch.age += 0.08;
      
      // Make branches pulse in brightness
      let pulse = sin(time * 3 + branch.age) * 0.5 + 0.5;
      let branchBrightness = crystal.brightness * pulse;

      // Draw the branch as a line with glowing points
      push();
      translate(crystal.x, crystal.y, crystal.z);
      rotateZ(branch.angle + crystal.shear);
      
      stroke(branch.hue, crystal.saturation, branchBrightness);
      strokeWeight(1);
      beginShape(LINES);
      vertex(0, 0, 0);
      vertex(0, branch.length * sin(time + branch.age), 0);
      endShape();
      
      // Draw a glowing point at the end of the branch
      fill(branch.hue, crystal.saturation, branchBrightness);
      noStroke();
      sphere(3, 4, 3);
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
      let angle1 = map(j, 0, 6, 0, TWO_PI) + crystal.shear;
      let angle2 = map((j + 1) % 6, 0, 6, 0, TWO_PI) + crystal.shear;
      
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

  // Add flowing lines to show mineral vein activity
  stroke(0.6, 1, 0.8);
  strokeWeight(0.5);
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    beginShape(LINES);
    for (let j = 0; j < line.points.length; j++) {
      let point = line.points[j];
      let t = j / (line.points.length - 1);
      let x = point.x + sin(t * TWO_PI * 3 + time * line.speed + line.offset) * 20;
      let y = point.y + cos(t * TWO_PI * 2 + time * line.speed + line.offset) * 20;
      let z = point.z;
      
      vertex(x, y, z);
    }
    endShape();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
