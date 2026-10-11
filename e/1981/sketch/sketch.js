let mechanisms = [];
let slurryParticles = [];
let lightBeams = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create bio-mechanical mechanisms
  for (let i = 0; i < 15; i++) {
    mechanisms.push({
      x: random(-width/3, width/3),
      y: random(-height/4, height/4),
      z: random(-200, 100),
      size: random(30, 80),
      rotation: random(TWO_PI),
      speed: random(0.005, 0.02),
      color: {
        h: random(180, 240),
        s: random(60, 90),
        b: random(70, 90)
      },
      decay: random(0.99, 0.999)
    });
  }

  // Create slurry particles
  for (let i = 0; i < 500; i++) {
    slurryParticles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-300, 300),
      size: random(0.5, 3),
      speed: random(0.1, 0.5),
      opacity: random(0.2, 0.7)
    });
  }

  // Create light beams
  for (let i = 0; i < 8; i++) {
    lightBeams.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-300, 300),
      size: random(100, 300),
      speed: random(0.001, 0.005),
      color: {
        h: random(180, 240),
        s: random(70, 90),
        b: random(80, 100)
      }
    });
  }
}

function draw() {
  background(200, 10, 95); // Icy blue background
  time += 0.01;

  // Camera movement for slow internal shifts
  let camX = sin(time * 0.1) * 50;
  let camY = cos(time * 0.08) * 30;
  camera(camX, camY, height * 0.8, 0, 0, 0, 0, 1, 0);

  // Draw mechanisms
  for (let mech of mechanisms) {
    push();
    translate(mech.x, mech.y, mech.z);
    rotateX(time * mech.speed);
    rotateY(time * mech.speed * 0.7);
    rotateZ(time * mech.speed * 0.3);
    
    // Main structure with decay effect
    noStroke();
    fill(mech.color.h, mech.color.s, mech.color.b, 0.8);
    sphere(mech.size, 6, 4);
    
    // Internal glowing core
    fill(mech.color.h, mech.color.s, 100, 0.6);
    sphere(mech.size * 0.3, 4, 3);
    
    // Degrading parts (spikes)
    for (let i = 0; i < 8; i++) {
      let angle = map(i, 0, 8, 0, TWO_PI);
      let spikeX = cos(angle) * mech.size * 0.9;
      let spikeZ = sin(angle) * mech.size * 0.9;
      
      push();
      translate(spikeX, 0, spikeZ);
      rotateY(time * 0.5);
      fill(mech.color.h, mech.color.s, mech.color.b * 0.7, 0.6);
      cone(8, 20, 3, 1);
      pop();
    }
    
    pop();
  }

  // Draw slurry particles
  for (let p of slurryParticles) {
    push();
    translate(p.x, p.y, p.z);
    noStroke();
    fill(200, 20, 50, p.opacity);
    sphere(p.size, 3, 2);
    pop();
  }

  // Draw light beams
  for (let beam of lightBeams) {
    push();
    translate(beam.x, beam.y, beam.z);
    
    // Refracting glow
    noStroke();
    fill(beam.color.h, beam.color.s, beam.color.b, 0.2);
    sphere(beam.size * 0.5, 8, 6);
    
    // Light scattering effect
    for (let i = 0; i < 5; i++) {
      let angle = time * beam.speed * 10 + i * TWO_PI / 5;
      let radius = beam.size * 0.3;
      let x = cos(angle) * radius;
      let z = sin(angle) * radius;
      
      fill(beam.color.h, beam.color.s, 100, 0.3);
      sphere(3, 4, 3);
    }
    
    pop();
  }

  // Slow internal movement and decay
  for (let mech of mechanisms) {
    mech.rotation += mech.speed;
    mech.color.b *= mech.decay;
    if (mech.color.b < 20) {
      mech.color.b = 20;
    }
  }

  // Animate slurry particles
  for (let p of slurryParticles) {
    p.y += p.speed * 0.5;
    p.x += sin(time * 0.1 + p.z * 0.01) * 0.3;
    p.z += cos(time * 0.08 + p.x * 0.01) * 0.2;
    
    if (p.y > height/2) {
      p.y = -height/2;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
