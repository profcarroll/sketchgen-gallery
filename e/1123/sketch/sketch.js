let peaks = [];
let rocks = [];
let dustParticles = [];
let waterPools = [];
let avalancheTriggered = false;
let cameraZ = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Generate peaks
  for (let i = 0; i < 20; i++) {
    peaks.push({
      x: random(-width/2, width/2),
      y: random(-height/4, height/4),
      z: random(-200, 100),
      size: random(50, 150)
    });
  }

  // Generate foreground rocks
  for (let i = 0; i < 30; i++) {
    rocks.push({
      x: random(-width/2, width/2),
      y: height/3,
      z: random(-100, 100),
      size: random(20, 60)
    });
  }

  // Initial camera position
  cameraZ = -height * 0.8;
}

function draw() {
  background(200, 10, 95); // Icy blue background

  // Camera setup
  camera(0, 0, cameraZ, 0, 0, 0, 0, 1, 0);

  // Draw peaks
  for (let peak of peaks) {
    push();
    translate(peak.x, peak.y, peak.z);
    rotateX(PI/6);
    noStroke();
    fill(200, 5, 98); // Light blue
    sphere(peak.size, 8, 6);
    pop();
  }

  // Draw rocks
  for (let rock of rocks) {
    push();
    translate(rock.x, rock.y, rock.z);
    noStroke();
    fill(190, 20, 40); // Muted gray
    sphere(rock.size, 6, 4);
    pop();
  }

  // Draw dust particles if avalanche occurred
  if (avalancheTriggered) {
    for (let i = 0; i < dustParticles.length; i++) {
      let p = dustParticles[i];
      push();
      translate(p.x, p.y, p.z);
      noStroke();
      fill(30, 10, 80); // Light brown
      sphere(2, 4, 3);
      pop();
    }

    // Draw water pools
    for (let pool of waterPools) {
      push();
      translate(pool.x, pool.y, pool.z);
      noStroke();
      fill(180, 50, 70, 0.6); // Blue with transparency
      sphere(pool.size, 8, 6);
      pop();
    }
  }

  // Draw refraction highlights (only if avalanche occurred)
  if (avalancheTriggered) {
    for (let i = 0; i < 20; i++) {
      let x = random(-width/2, width/2);
      let y = height/3 + random(-50, 50);
      let z = random(-100, 100);
      push();
      translate(x, y, z);
      noStroke();
      fill(random(180, 240), 70, 90, 0.3); // Jewel-toned highlight
      sphere(10, 6, 4);
      pop();
    }
  }
}

function mousePressed() {
  if (!avalancheTriggered) {
    avalancheTriggered = true;

    // Create dust particles
    for (let i = 0; i < 500; i++) {
      dustParticles.push({
        x: random(-width/4, width/4),
        y: height/3 + random(-20, 20),
        z: random(-100, 100),
        life: 1.0
      });
    }

    // Create water pools
    for (let i = 0; i < 5; i++) {
      waterPools.push({
        x: random(-width/4, width/4),
        y: height/3 + random(-20, 20),
        z: random(-100, 100),
        size: random(10, 30)
      });
    }

    // Animate dust settling
    for (let i = 0; i < dustParticles.length; i++) {
      let p = dustParticles[i];
      p.y += random(0.5, 2);
      p.life -= 0.01;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
