let peaks = [];
let rocks = [];
let snowParticles = [];
let avalancheActive = false;
let avalancheTime = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);

  // Create alpine peaks
  for (let i = 0; i < 8; i++) {
    peaks.push({
      x: random(width),
      y: height * 0.7,
      w: random(100, 300),
      h: random(200, 400),
      hue: random(200, 240)
    });
  }

  // Create rock formations
  for (let i = 0; i < 15; i++) {
    rocks.push({
      x: random(width * 0.3, width * 0.7),
      y: height * 0.8,
      w: random(20, 60),
      h: random(30, 80),
      hue: random(25, 45)
    });
  }

  // Create initial snow particles
  for (let i = 0; i < 1000; i++) {
    snowParticles.push({
      x: random(width),
      y: random(height * 0.6, height),
      size: random(1, 3),
      speed: random(0.5, 2)
    });
  }
}

function draw() {
  background(200, 10, 95); // Cold sky

  // Draw peaks
  for (let peak of peaks) {
    fill(peak.hue, 10, 80);
    noStroke();
    beginShape();
    vertex(peak.x - peak.w/2, peak.y);
    vertex(peak.x + peak.w/2, peak.y);
    vertex(peak.x, peak.y - peak.h);
    endShape(CLOSE);
  }

  // Draw rocks
  for (let rock of rocks) {
    fill(rock.hue, 30, 50);
    noStroke();
    rect(rock.x, rock.y, rock.w, rock.h, 10);
  }

  // Draw snow on peaks and rocks
  drawSnow();

  // Draw avalanche if active
  if (avalancheActive) {
    updateAvalanche();
  }
}

function drawSnow() {
  // Snow on peaks
  for (let peak of peaks) {
    fill(30, 5, 95);
    noStroke();
    beginShape();
    vertex(peak.x - peak.w/2, peak.y);
    vertex(peak.x + peak.w/2, peak.y);
    vertex(peak.x + peak.w/4, peak.y - peak.h * 0.6);
    vertex(peak.x - peak.w/4, peak.y - peak.h * 0.6);
    endShape(CLOSE);
  }

  // Snow on rocks
  for (let rock of rocks) {
    fill(30, 5, 95);
    noStroke();
    rect(rock.x, rock.y, rock.w, rock.h * 0.3, 10);
  }

  // Draw snow particles
  for (let p of snowParticles) {
    fill(30, 5, 95);
    noStroke();
    ellipse(p.x, p.y, p.size);
  }
}

function updateAvalanche() {
  avalancheTime++;
  
  // Create avalanche particles
  let avalancheParticles = [];
  for (let i = 0; i < 200; i++) {
    avalancheParticles.push({
      x: width/2,
      y: height * 0.6,
      vx: random(-2, 2),
      vy: random(-1, 1),
      size: random(3, 8),
      life: 255
    });
  }

  // Draw avalanche particles
  for (let p of avalancheParticles) {
    fill(0, 0, 90);
    noStroke();
    ellipse(p.x, p.y, p.size);
    
    // Update position
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.1; // Gravity
    p.life -= 3;
  }

  // Scatter snow particles
  for (let p of snowParticles) {
    if (dist(p.x, p.y, width/2, height * 0.6) < 150) {
      p.x += random(-1, 1);
      p.y += random(-1, 1);
    }
  }

  // Stop avalanche after some time
  if (avalancheTime > 100) {
    avalancheActive = false;
    avalancheTime = 0;
  }
}

function mousePressed() {
  avalancheActive = true;
  avalancheTime = 0;
}
