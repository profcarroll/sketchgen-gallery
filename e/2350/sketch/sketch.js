let forms = [];
let veins = [];
const NUM_FORMS = 15;
const VEIN_LIFETIME = 200;
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
      size: random(30, 60),
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

  // Initialize veins
  for (let i = 0; i < 30; i++) {
    veins.push({
      points: [],
      life: random(VEIN_LIFETIME),
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

  // Create veins from forms
  if (frameCount % 2 === 0) {
    for (let i = 0; i < veins.length; i++) {
      let vein = veins[i];
      vein.life -= 1;
      
      if (vein.life <= 0) {
        vein.points = [];
        vein.life = VEIN_LIFETIME;
        vein.hue = random(40, 80);
        vein.alpha = random(0.1, 0.5);
      }
      
      // Add new points to the vein
      if (vein.points.length < 40) {
        let form = forms[Math.floor(random(forms.length))];
        vein.points.push({
          x: form.x || 0,
          y: form.y || 0,
          z: form.z || 0,
          hue: form.hue,
          life: 1.0
        });
      }
      
      // Update point positions slightly for movement effect
      for (let point of vein.points) {
        point.x += random(-0.3, 0.3);
        point.y += random(-0.3, 0.3);
        point.z += random(-0.3, 0.3);
        point.life -= 0.01;
      }
      
      // Remove old points
      vein.points = vein.points.filter(p => p.life > 0);
    }
  }

  // Draw veins
  for (let vein of veins) {
    if (vein.points.length < 2) continue;
    
    beginShape(TRIANGLE_STRIP);
    for (let point of vein.points) {
      fill(point.hue, 100, 100, point.life * vein.alpha);
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
