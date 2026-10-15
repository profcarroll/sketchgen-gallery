let peaks = [];
let rocks = [];
let snowParticles = [];
let avalancheEffect = null;
let dustParticles = [];
let rockChannels = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create alpine peaks
  for (let i = 0; i < 8; i++) {
    let x = random(-width/2, width/2);
    let z = random(-height/2, height/2);
    let heightVal = random(100, 300);
    let widthVal = random(150, 400);
    
    peaks.push({
      x: x,
      y: heightVal/2,
      z: z,
      height: heightVal,
      width: widthVal,
      color: {
        h: random(190, 210),
        s: random(60, 80),
        b: random(70, 90)
      }
    });
  }

  // Create rock formations
  for (let i = 0; i < 20; i++) {
    let x = random(-width/3, width/3);
    let z = random(-height/3, height/3);
    let size = random(20, 80);
    
    rocks.push({
      x: x,
      y: 0,
      z: z,
      size: size,
      color: {
        h: random(10, 30),
        s: random(10, 30),
        b: random(20, 40)
      }
    });
  }

  // Create snow particles
  for (let i = 0; i < 1500; i++) {
    snowParticles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-300, 300),
      size: random(1, 3),
      speed: random(0.1, 0.5),
      opacity: random(0.3, 0.8)
    });
  }

  // Create dust particles
  for (let i = 0; i < 500; i++) {
    dustParticles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-300, 300),
      size: random(0.5, 1.5),
      speed: random(0.05, 0.2),
      opacity: random(0.1, 0.4)
    });
  }

  // Create channels in rocks
  for (let i = 0; i < 30; i++) {
    let rock = random(rocks);
    rockChannels.push({
      x: rock.x,
      z: rock.z,
      width: random(5, 15),
      depth: random(20, 60)
    });
  }
}

function draw() {
  background(200, 10, 95); // Icy blue background
  let time = millis() * 0.001;

  // Camera movement for slow internal shifts
  let camX = sin(time * 0.05) * 30;
  let camY = cos(time * 0.03) * 20;
  camera(camX, camY, height * 0.8, 0, 0, 0, 0, 1, 0);

  // Draw peaks
  for (let peak of peaks) {
    push();
    translate(peak.x, peak.y, peak.z);
    noStroke();
    fill(peak.color.h, peak.color.s, peak.color.b, 0.9);
    
    // Draw pyramid shape for peak
    beginShape(TRIANGLES);
    vertex(0, -peak.height/2, 0);
    vertex(-peak.width/2, peak.height/2, -peak.width/2);
    vertex(peak.width/2, peak.height/2, -peak.width/2);
    
    vertex(0, -peak.height/2, 0);
    vertex(peak.width/2, peak.height/2, -peak.width/2);
    vertex(peak.width/2, peak.height/2, peak.width/2);
    
    vertex(0, -peak.height/2, 0);
    vertex(peak.width/2, peak.height/2, peak.width/2);
    vertex(-peak.width/2, peak.height/2, peak.width/2);
    
    vertex(0, -peak.height/2, 0);
    vertex(-peak.width/2, peak.height/2, peak.width/2);
    vertex(-peak.width/2, peak.height/2, -peak.width/2);
    endShape();
    
    pop();
  }

  // Draw rock formations
  for (let rock of rocks) {
    push();
    translate(rock.x, rock.y, rock.z);
    noStroke();
    fill(rock.color.h, rock.color.s, rock.color.b, 0.8);
    
    // Draw irregular rock shape using sphere with noise displacement
    sphere(rock.size, 6, 4);
    pop();
  }

  // Draw snow particles
  for (let p of snowParticles) {
    push();
    translate(p.x, p.y, p.z);
    noStroke();
    fill(200, 15, 100, p.opacity);
    sphere(p.size, 3, 2);
    pop();
  }

  // Draw dust particles
  for (let p of dustParticles) {
    push();
    translate(p.x, p.y, p.z);
    noStroke();
    fill(30, 20, 60, p.opacity);
    sphere(p.size, 2, 2);
    pop();
  }

  // Animate snow particles
  for (let p of snowParticles) {
    p.y += p.speed * 0.3;
    p.x += sin(time * 0.1 + p.z * 0.01) * 0.2;
    p.z += cos(time * 0.08 + p.x * 0.01) * 0.15;
    
    if (p.y > height/2) {
      p.y = -height/2;
    }
  }

  // Animate dust particles
  for (let p of dustParticles) {
    p.y += p.speed * 0.3;
    p.x += sin(time * 0.1 + p.z * 0.01) * 0.1;
    p.z += cos(time * 0.08 + p.x * 0.01) * 0.05;
    
    if (p.y > height/2) {
      p.y = -height/2;
    }
  }

  // Apply avalanche effect
  if (avalancheEffect) {
    let t = millis() - avalancheEffect.startTime;
    let radius = t * 0.1;
    
    if (radius < 300) {
      // Draw wave of debris
      for (let i = 0; i < 50; i++) {
        let angle = TWO_PI * i / 50;
        let x = avalancheEffect.x + cos(angle) * radius;
        let z = avalancheEffect.z + sin(angle) * radius;
        
        push();
        translate(x, 0, z);
        noStroke();
        fill(200, 10, 80, 0.5);
        sphere(5, 4, 3);
        pop();
      }
    } else {
      avalancheEffect = null;
    }
  }

  // Draw channels in rocks
  for (let channel of rockChannels) {
    push();
    translate(channel.x, 0, channel.z);
    noStroke();
    fill(200, 10, 70, 0.6);
    rectMode(CENTER);
    rect(0, 0, channel.width, channel.depth);
    pop();
  }
}

function mousePressed() {
  // Create avalanche effect at center
  avalancheEffect = {
    x: 0,
    y: 0,
    z: 0,
    startTime: millis()
  };
  
  // Modify rocks to show erosion
  for (let rock of rocks) {
    let d = dist(0, 0, 0, rock.x, 0, rock.z);
    if (d < 200) {
      rock.color.b *= 0.9;
      rock.size *= 0.98;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
