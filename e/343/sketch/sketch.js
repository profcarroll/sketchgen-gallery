let particles = [];
let fields = [];
let obsidianForms = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create glowing particles
  for (let i = 0; i < 800; i++) {
    particles.push({
      pos: p5.Vector.random3D().mult(random(200, 400)),
      vel: p5.Vector.random3D().mult(random(0.1, 0.5)),
      size: random(1, 3),
      hue: random(160, 180)
    });
  }

  // Create light fields
  for (let i = 0; i < 3; i++) {
    fields.push({
      center: p5.Vector.random3D().mult(random(100, 300)),
      radius: random(100, 200),
      speed: random(0.001, 0.005),
      time: random(1000)
    });
  }

  // Create obsidian forms
  for (let i = 0; i < 5; i++) {
    obsidianForms.push({
      pos: p5.Vector.random3D().mult(random(150, 350)),
      size: random(30, 80),
      rotation: random(TWO_PI),
      spin: random(-0.005, 0.005)
    });
  }
}

function draw() {
  background(0);
  noStroke();

  // Camera movement
  let time = millis() * 0.0002;
  camera(
    sin(time) * 600,
    sin(time * 0.5) * 100,
    cos(time) * 600,
    0, 0, 0,
    0, 1, 0
  );

  // Draw light fields
  for (let field of fields) {
    field.time += field.speed;
    let alpha = map(sin(field.time), -1, 1, 0.2, 0.6);
    fill(field.hue, 80, 90, alpha);
    
    push();
    translate(field.center.x, field.center.y, field.center.z);
    sphere(field.radius, 8, 6);
    pop();
  }

  // Draw particles
  beginShape(POINTS);
  for (let p of particles) {
    // Update particle position
    p.pos.add(p.vel);
    
    // Wrap around the world
    if (p.pos.mag() > 500) {
      p.pos = p5.Vector.random3D().mult(490);
    }
    
    // Particle lighting effect from fields
    let lightIntensity = 0;
    for (let field of fields) {
      let d = p.pos.dist(field.center);
      if (d < field.radius * 1.5) {
        lightIntensity += map(d, 0, field.radius * 1.5, 1, 0);
      }
    }
    
    // Particle color based on field interaction
    let hue = (p.hue + lightIntensity * 30) % 360;
    fill(hue, 80, 90, 0.8);
    
    vertex(p.pos.x, p.pos.y, p.pos.z);
  }
  endShape();

  // Draw obsidian forms
  for (let form of obsidianForms) {
    form.rotation += form.spin;
    
    push();
    translate(form.pos.x, form.pos.y, form.pos.z);
    rotateX(form.rotation);
    rotateY(form.rotation * 0.7);
    rotateZ(form.rotation * 1.3);
    
    fill(0, 0, 0);
    sphere(form.size, 12, 8);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
