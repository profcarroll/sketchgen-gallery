let jellyfish;
let structures = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create jellyfish colony
  jellyfish = [];
  for (let i = 0; i < 8; i++) {
    let angle = random(TWO_PI);
    let radius = random(150, 300);
    let height = random(-100, 100);
    jellyfish.push({
      pos: createVector(
        cos(angle) * radius,
        height,
        sin(angle) * radius
      ),
      vel: p5.Vector.random3D().mult(random(0.5, 2)),
      size: random(8, 15),
      hue: random(190, 230), // Blue-green hues for bioluminescence
      saturation: 80,
      brightness: random(70, 100),
      pulse: random(PI),
      pulseSpeed: random(0.02, 0.05)
    });
  }

  // Create origami-like structures
  for (let i = 0; i < 20; i++) {
    let angle = random(TWO_PI);
    let radius = random(100, 350);
    let height = random(-150, 150);
    structures.push({
      pos: createVector(
        cos(angle) * radius,
        height,
        sin(angle) * radius
      ),
      size: random(20, 50),
      hue: random(200, 260), // Cool blue hues
      saturation: 70,
      brightness: random(60, 90),
      rotation: random(TWO_PI),
      rotationSpeed: random(-0.01, 0.01),
      segments: floor(random(3, 7)),
      foldAngle: random(0.5, 1.5)
    });
  }
}

function draw() {
  background(0);
  time += 0.003;

  // Rotate the whole scene gently
  rotateY(time * 0.1);
  rotateX(sin(time * 0.2) * 0.05);

  // Draw jellyfish colony with synchronized movement
  for (let j = 0; j < jellyfish.length; j++) {
    let jf = jellyfish[j];
    
    // Synchronized pulsing animation
    jf.pulse += jf.pulseSpeed;
    let pulseSize = sin(jf.pulse) * 0.3 + 1;
    
    // Smooth movement with some randomness
    jf.pos.add(jf.vel);
    
    // Bounce off boundaries
    if (jf.pos.x > 400 || jf.pos.x < -400) jf.vel.x *= -1;
    if (jf.pos.y > 300 || jf.pos.y < -300) jf.vel.y *= -1;
    if (jf.pos.z > 400 || jf.pos.z < -400) jf.vel.z *= -1;
    
    // Add some orbital motion
    let orbitRadius = 200 + sin(time * 0.5 + j) * 50;
    let orbitAngle = time * 0.3 + j * TWO_PI / jellyfish.length;
    jf.pos.x = cos(orbitAngle) * orbitRadius;
    jf.pos.z = sin(orbitAngle) * orbitRadius;
    
    push();
    translate(jf.pos.x, jf.pos.y, jf.pos.z);
    
    // Glow effect
    noStroke();
    fill(jf.hue, jf.saturation, jf.brightness, 0.7);
    sphere(jf.size * pulseSize);
    
    // Add inner core for bioluminescence
    fill(jf.hue, jf.saturation, jf.brightness + 20, 0.9);
    sphere(jf.size * 0.4 * pulseSize);
    
    pop();
  }

  // Draw origami structures with folded geometry
  for (let s = 0; s < structures.length; s++) {
    let st = structures[s];
    
    // Rotate structure gently
    st.rotation += st.rotationSpeed;
    
    push();
    translate(st.pos.x, st.pos.y, st.pos.z);
    rotateY(st.rotation);
    
    // Draw folded geometric shapes
    noStroke();
    fill(st.hue, st.saturation, st.brightness, 0.6);
    
    for (let i = 0; i < st.segments; i++) {
      let angle = TWO_PI * i / st.segments;
      
      push();
      rotateZ(angle);
      
      // Create folded effect with multiple planes
      beginShape(TRIANGLES);
      vertex(0, 0, 0);
      vertex(st.size * cos(st.foldAngle), st.size * sin(st.foldAngle), 0);
      vertex(st.size * cos(st.foldAngle + PI/3), st.size * sin(st.foldAngle + PI/3), 0);
      endShape();
      
      pop();
    }
    
    // Add subtle glow around structures
    for (let i = 0; i < 5; i++) {
      let alpha = map(i, 0, 4, 0.1, 0);
      fill(st.hue, st.saturation, st.brightness, alpha);
      sphere(st.size + i * 3);
    }
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
