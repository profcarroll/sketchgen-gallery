let particles = [];
const numParticles = 150;
const center = { x: 400, y: 300 };
const orbitRadius = 150;
const trailLength = 100;
const rotationSpeed = 0.005;

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();

  for (let i = 0; i < numParticles; i++) {
    particles.push({
      angle: random(TWO_PI),
      speed: random(0.005, 0.015),
      radius: random(orbitRadius * 0.7, orbitRadius * 1.3),
      hue: random(360),
      trail: []
    });
  }
}

function draw() {
  background(0, 0, 0, 0.1);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    // Update angle
    p.angle += p.speed;

    // Calculate position
    const x = center.x + cos(p.angle) * p.radius;
    const y = center.y + sin(p.angle) * p.radius;

    // Add to trail
    p.trail.push({ x, y, hue: p.hue });

    if (p.trail.length > trailLength) {
      p.trail.shift();
    }

    // Draw trail
    for (let j = 0; j < p.trail.length - 1; j++) {
      const point = p.trail[j];
      const nextPoint = p.trail[j + 1];

      if (point && nextPoint) {
        const alpha = map(j, 0, p.trail.length - 1, 0, 1);
        fill(point.hue, 80, 90, alpha * 0.5);
        ellipse(point.x, point.y, 3, 3);
      }
    }

    // Draw particle
    fill(p.hue, 80, 90);
    ellipse(x, y, 6, 6);
  }
}
