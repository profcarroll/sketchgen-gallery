let forms = [];
let trails = [];
const NUM_FORMS = 20;
const NUM_TRAILS = 800;
const TRAIL_LIFETIME = 150;
const ORBIT_RADIUS = 250;
const ORBIT_SPEED = 0.003;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Initialize geometric forms
  for (let i = 0; i < NUM_FORMS; i++) {
    forms.push({
      angle: random(TWO_PI),
      radius: random(ORBIT_RADIUS * 0.5, ORBIT_RADIUS * 1.5),
      z: random(-800, 0),
      size: random(20, 50),
      speed: random(0.2, 1.2),
      hue: random(180, 300), // blue to violet range
      alpha: random(0.7, 1),
      rotationX: random(TWO_PI),
      rotationY: random(TWO_PI),
      spinX: random(-0.01, 0.01),
      spinY: random(-0.01, 0.01),
      orbitSpeed: random(ORBIT_SPEED * 0.5, ORBIT_SPEED * 1.5)
    });
  }

  // Initialize trails
  for (let i = 0; i < NUM_TRAILS; i++) {
    trails.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-800, 0),
      life: random(TRAIL_LIFETIME),
      hue: random(200, 360),
      size: random(1, 4),
      prevX: 0,
      prevY: 0,
      prevZ: 0
    });
  }
}

function draw() {
  background(0);

  // Update and display trails
  beginShape(POINTS);
  for (let i = trails.length - 1; i >= 0; i--) {
    let t = trails[i];
    
    // Store previous position
    t.prevX = t.x;
    t.prevY = t.y;
    t.prevZ = t.z;
    
    // Move trail particles with some drift and randomness
    t.x += random(-1.5, 1.5);
    t.y += random(-1.5, 1.5);
    t.z += random(-1.5, 1.5);
    
    // Fade out
    t.life -= 1;
    
    if (t.life <= 0) {
      trails.splice(i, 1);
      // Add new trail particle to maintain count
      trails.push({
        x: random(-width/2, width/2),
        y: random(-height/2, height/2),
        z: random(-800, 0),
        life: TRAIL_LIFETIME,
        hue: random(200, 360),
        size: random(1, 4),
        prevX: 0,
        prevY: 0,
        prevZ: 0
      });
      continue;
    }
    
    fill(t.hue, 100, 100, t.life / TRAIL_LIFETIME);
    noStroke();
    vertex(t.x, t.y, t.z);
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
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
