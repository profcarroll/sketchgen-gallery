let roots = [];
let particles = [];
let time = 0;

function setup() {
  createCanvas(800, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create a network of submerged roots
  for (let i = 0; i < 200; i++) {
    let x = random(-width/2, width/2);
    let y = random(height/4, height/2);
    let z = random(-300, -100);
    let length = random(50, 150);
    let angle = random(TWO_PI);
    roots.push({
      x,
      y,
      z,
      length,
      angle,
      hue: random(180, 240),
      saturation: random(60, 90),
      brightness: random(70, 90),
      segments: floor(random(3, 8)),
      pulseSpeed: random(0.02, 0.05)
    });
  }

  // Create bioluminescent particles
  for (let i = 0; i < 1000; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: random(height/4, height/2),
      z: random(-300, -100),
      size: random(0.5, 3),
      speed: random(0.01, 0.05),
      offset: random(TWO_PI),
      hue: random(180, 240)
    });
  }
}

function draw() {
  background(220, 10, 10); // Deep blue-black

  time += 0.01;

  // Draw the root network
  for (let root of roots) {
    push();
    translate(root.x, root.y, root.z);
    rotateZ(root.angle);

    // Create a ceramic tile-like pattern with pulsing light
    let pulse = sin(time * root.pulseSpeed + root.x * 0.01) * 0.5 + 0.5;
    let brightness = root.brightness * (0.7 + pulse * 0.3);

    // Draw root segments with ceramic-like pattern
    stroke(root.hue, root.saturation, brightness);
    strokeWeight(2);

    beginShape(LINES);
    for (let i = 0; i < root.segments; i++) {
      let segmentLength = root.length / root.segments;
      let segmentX = i * segmentLength;
      let segmentY = sin(i * 0.5 + time) * 10;

      vertex(segmentX, 0, 0);
      vertex(segmentX + segmentLength, segmentY, 0);
    }
    endShape();

    // Draw tile-like connections
    beginShape(LINES);
    for (let i = 0; i < root.segments - 1; i++) {
      let segmentX1 = i * root.length / root.segments;
      let segmentX2 = (i + 1) * root.length / root.segments;

      let y1 = sin(i * 0.5 + time) * 10;
      let y2 = sin((i + 1) * 0.5 + time) * 10;

      vertex(segmentX1, y1, 0);
      vertex(segmentX2, y2, 0);
    }
    endShape();
    
    pop();
  }

  // Draw bioluminescent particles
  noStroke();
  for (let particle of particles) {
    let pulse = sin(time * particle.speed + particle.offset) * 0.5 + 0.5;
    fill(particle.hue, 80, 100 * pulse);
    ellipse(particle.x, particle.y, particle.size);
  }
}
