let forms = [];
let dustParticles = [];
const NUM_FORMS = 30;
const NUM_DUST = 800;
const GRAVITY = 0.05;
const DRIFT = 0.01;
const DUST_LIFETIME = 200;
const ORBIT_RADIUS = 300;
const ORBIT_SPEED = 0.005;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Initialize geometric forms
  for (let i = 0; i < NUM_FORMS; i++) {
    forms.push({
      angle: random(TWO_PI),
      radius: random(ORBIT_RADIUS * 0.5, ORBIT_RADIUS * 1.5),
      z: random(-1000, 0),
      size: random(15, 60),
      speed: random(0.3, 1.5),
      hue: random(180, 300), // blue to violet range
      alpha: random(0.7, 1),
      rotationX: random(TWO_PI),
      rotationY: random(TWO_PI),
      spinX: random(-0.01, 0.01),
      spinY: random(-0.01, 0.01),
      orbitSpeed: random(ORBIT_SPEED * 0.5, ORBIT_SPEED * 1.5)
    });
  }

  // Initialize dust particles
  for (let i = 0; i < NUM_DUST; i++) {
    dustParticles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-1000, 0),
      life: random(DUST_LIFETIME),
      hue: random(200, 360),
      size: random(0.5, 3)
    });
  }
}

function draw() {
  background(0);

  // Update and display dust particles
  beginShape(POINTS);
  for (let i = dustParticles.length - 1; i >= 0; i--) {
    let d = dustParticles[i];
    
    // Slowly move dust toward center
    d.x += (0 - d.x) * 0.001;
    d.y += (0 - d.y) * 0.001;
    d.z += (0 - d.z) * 0.001;
    
    // Fade out
    d.life -= 0.5;
    
    if (d.life <= 0) {
      dustParticles.splice(i, 1);
      // Add new particle to maintain count
      dustParticles.push({
        x: random(-width/2, width/2),
        y: random(-height/2, height/2),
        z: random(-1000, 0),
        life: DUST_LIFETIME,
        hue: random(200, 360),
        size: random(0.5, 3)
      });
      continue;
    }
    
    fill(d.hue, 100, 100, d.life / DUST_LIFETIME);
    noStroke();
    vertex(d.x, d.y, d.z);
  }
  endShape();

  // Update and display forms
  for (let form of forms) {
    // Apply orbital motion
    form.angle += form.orbitSpeed;
    
    // Calculate new position based on orbit
    let x = cos(form.angle) * form.radius;
    let y = sin(form.angle) * form.radius;
    
    // Add some spiral effect by varying z over time
    form.z += sin(frameCount * 0.01 + form.angle) * 0.5;

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
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
