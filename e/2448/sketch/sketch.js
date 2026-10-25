let forms = [];
let branches = [];
const NUM_FORMS = 20;
const BRANCH_LIFETIME = 150;
const ORBIT_RADIUS = 300;
const ORBIT_SPEED = 0.004;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Initialize geometric forms
  for (let i = 0; i < NUM_FORMS; i++) {
    forms.push({
      angle: random(TWO_PI),
      radius: random(ORBIT_RADIUS * 0.5, ORBIT_RADIUS * 1.5),
      z: random(-800, 0),
      size: random(20, 40),
      speed: random(0.2, 0.8),
      hue: random(40, 80), // emerald to cyan range
      alpha: random(0.7, 1),
      rotationX: random(TWO_PI),
      rotationY: random(TWO_PI),
      spinX: random(-0.01, 0.01),
      spinY: random(-0.01, 0.01),
      orbitSpeed: random(ORBIT_SPEED * 0.5, ORBIT_SPEED * 1.5)
    });
  }

  // Initialize branches
  for (let i = 0; i < 50; i++) {
    branches.push({
      points: [],
      life: random(BRANCH_LIFETIME),
      hue: random(40, 80),
      alpha: random(0.1, 0.5)
    });
  }
}

function draw() {
  background(0);

  // Update and display forms
  for (let form of forms) {
    // Apply orbital motion
    form.angle += form.orbitSpeed;
    
    // Calculate new position based on orbit
    let x = cos(form.angle) * form.radius;
    let y = sin(form.angle) * form.radius;
    
    // Add some spiral effect by varying z over time
    form.z += sin(frameCount * 0.01 + form.angle) * 0.3;

    // Rotate forms
    form.rotationX += form.spinX;
    form.rotationY += form.spinY;

    push();
    translate(x, y, form.z);
    
    // Create a glowing, structured geometric form (a torus with subtle variation)
    noStroke();
    fill(form.hue, 100, 90, form.alpha);
    rotateX(form.rotationX);
    rotateY(form.rotationY);
    torus(form.size, form.size/4, 16, 8);
    
    // Add a secondary, smaller glowing element for complexity
    fill(form.hue, 100, 100, form.alpha * 0.5);
    sphere(form.size/3);
    
    pop();
  }

  // Create branches from forms
  if (frameCount % 2 === 0) {
    for (let i = 0; i < branches.length; i++) {
      let branch = branches[i];
      branch.life -= 1;
      
      if (branch.life <= 0) {
        branch.points = [];
        branch.life = BRANCH_LIFETIME;
        branch.hue = random(40, 80);
        branch.alpha = random(0.1, 0.5);
      }
      
      // Add new points to the branch
      if (branch.points.length < 30) {
        let form = forms[Math.floor(random(forms.length))];
        branch.points.push({
          x: form.x || 0,
          y: form.y || 0,
          z: form.z || 0,
          hue: form.hue,
          life: 1.0
        });
      }
      
      // Update point positions slightly for movement effect
      for (let point of branch.points) {
        point.x += random(-0.3, 0.3);
        point.y += random(-0.3, 0.3);
        point.z += random(-0.3, 0.3);
        point.life -= 0.01;
      }
      
      // Remove old points
      branch.points = branch.points.filter(p => p.life > 0);
    }
  }

  // Draw branches
  for (let branch of branches) {
    if (branch.points.length < 2) continue;
    
    beginShape(TRIANGLE_STRIP);
    for (let point of branch.points) {
      fill(point.hue, 100, 100, point.life * branch.alpha);
      noStroke();
      vertex(point.x, point.y, point.z);
    }
    endShape();
  }

  // Add some visual effect to emphasize the glow
  ambientLight(50);
  pointLight(255, 255, 255, 0, 0, -100);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
