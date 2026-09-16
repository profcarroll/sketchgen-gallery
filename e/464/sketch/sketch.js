let pods = [];
let particles = [];
let seedParticles = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create initial pods
  for (let i = 0; i < 8; i++) {
    pods.push({
      x: random(-width/2, width/2),
      y: random(-height/4, height/4),
      z: random(-50, 50),
      size: random(30, 60),
      color: color(random(100, 200), 80, 90),
      state: 'blooming', // 'blooming', 'hardening', 'mature'
      bloomProgress: 0,
      hardenProgress: 0,
      seedCount: floor(random(3, 7)),
      seeds: []
    });
  }

  // Initialize particles
  for (let i = 0; i < 200; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-100, 100),
      size: random(1, 3),
      speed: random(0.5, 1.5),
      hue: random(200, 260)
    });
  }

  // Initialize seed particles
  for (let i = 0; i < 500; i++) {
    seedParticles.push({
      x: 0,
      y: 0,
      z: 0,
      size: random(0.5, 1.5),
      speed: random(0.2, 0.8),
      hue: random(300, 360),
      targetPod: null,
      inPod: false
    });
  }
}

function draw() {
  background(200, 100, 90); // Sky blue

  // Move particles
  for (let p of particles) {
    p.y += p.speed;
    if (p.y > height/2) {
      p.y = -height/2;
      p.x = random(-width/2, width/2);
    }
  }

  // Update pods and seed particles
  for (let pod of pods) {
    if (pod.state === 'blooming') {
      pod.bloomProgress += 0.01;
      if (pod.bloomProgress > 1) {
        pod.state = 'hardening';
        pod.bloomProgress = 1;
        // Initialize seeds
        for (let i = 0; i < pod.seedCount; i++) {
          let seed = {
            x: 0,
            y: 0,
            z: 0,
            size: random(2, 4),
            hue: random(300, 360),
            inPod: true
          };
          pod.seeds.push(seed);
        }
      }
    } else if (pod.state === 'hardening') {
      pod.hardenProgress += 0.01;
      if (pod.hardenProgress > 1) {
        pod.state = 'mature';
        pod.hardenProgress = 1;
      }

      // Move seeds towards center
      for (let seed of pod.seeds) {
        let dx = 0 - seed.x;
        let dy = 0 - seed.y;
        let dz = 0 - seed.z;
        let dist = sqrt(dx*dx + dy*dy + dz*dz);
        if (dist > 0.1) {
          seed.x += dx * 0.02;
          seed.y += dy * 0.02;
          seed.z += dz * 0.02;
        }
      }
    }

    // Draw pod
    push();
    translate(pod.x, pod.y, pod.z);
    noStroke();

    if (pod.state === 'blooming') {
      fill(pod.color);
      sphere(pod.size * pod.bloomProgress);
    } else if (pod.state === 'hardening') {
      // Soft to hard transition
      let softness = 1 - pod.hardenProgress;
      fill(pod.color);
      sphere(pod.size * softness);
      fill(200, 50, 80, 0.7);
      sphere(pod.size * 0.7 * pod.hardenProgress);
    } else if (pod.state === 'mature') {
      // Solid seed casing
      fill(200, 50, 80);
      sphere(pod.size * 0.8);
      stroke(180, 60, 90);
      noFill();
      sphere(pod.size * 0.9);
    }

    pop();

    // Draw seeds
    if (pod.state === 'hardening' || pod.state === 'mature') {
      for (let seed of pod.seeds) {
        push();
        translate(pod.x + seed.x, pod.y + seed.y, pod.z + seed.z);
        fill(seed.hue, 80, 90);
        noStroke();
        sphere(seed.size);
        pop();
      }
    }
  }

  // Draw background particles
  beginShape(POINTS);
  for (let p of particles) {
    fill(p.hue, 80, 90, 0.8);
    vertex(p.x, p.y, p.z);
  }
  endShape();

  // Update and draw seed particles
  let activeSeedParticles = [];
  for (let sp of seedParticles) {
    if (!sp.inPod) {
      // Move towards a pod
      if (pods.length > 0) {
        let targetPod = pods[floor(random(pods.length))];
        let dx = targetPod.x - sp.x;
        let dy = targetPod.y - sp.y;
        let dz = targetPod.z - sp.z;
        let dist = sqrt(dx*dx + dy*dy + dz*dz);
        if (dist > 5) {
          sp.x += dx * 0.02;
          sp.y += dy * 0.02;
          sp.z += dz * 0.02;
        } else {
          sp.inPod = true;
          // Add to pod's seeds
          if (targetPod.seeds.length < targetPod.seedCount * 3) {
            targetPod.seeds.push({
              x: sp.x - targetPod.x,
              y: sp.y - targetPod.y,
              z: sp.z - targetPod.z,
              size: sp.size,
              hue: sp.hue,
              inPod: true
            });
          }
        }
      }
    } else {
      // Inside pod, move towards center
      if (sp.targetPod) {
        let dx = 0 - sp.x;
        let dy = 0 - sp.y;
        let dz = 0 - sp.z;
        let dist = sqrt(dx*dx + dy*dy + dz*dz);
        if (dist > 0.1) {
          sp.x += dx * 0.02;
          sp.y += dy * 0.02;
          sp.z += dz * 0.02;
        }
      }
    }

    // Only draw visible particles
    if (abs(sp.x) < width/2 + 100 && abs(sp.y) < height/2 + 100) {
      activeSeedParticles.push(sp);
    }
  }

  seedParticles = activeSeedParticles;

  // Draw seed particles
  beginShape(POINTS);
  for (let sp of seedParticles) {
    fill(sp.hue, 80, 90, 0.7);
    vertex(sp.x, sp.y, sp.z);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
