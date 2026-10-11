let dominoes = [];
let crystals = [];
let crystalSeeds = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Setup dominoes in a row
  for (let i = 0; i < 12; i++) {
    dominoes.push({
      x: -width/2 + i * width/15,
      y: height/4,
      z: 0,
      fallen: false,
      fallTime: 0,
      size: 30
    });
  }

  // Create initial crystal seeds
  for (let i = 0; i < 100; i++) {
    crystalSeeds.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-100, 100),
      size: random(1, 3),
      hue: random(200, 260),
      speed: random(0.1, 0.5),
      targetX: 0,
      targetY: 0,
      targetZ: 0,
      active: false
    });
  }
}

function draw() {
  background(20, 30, 10); // Obsidian dark background

  // Update dominoes - trigger falling in sequence
  let now = millis();
  for (let i = 0; i < dominoes.length; i++) {
    let d = dominoes[i];
    
    if (!d.fallen && i > 0 && dominoes[i-1].fallen) {
      d.fallTime = now;
      d.fallen = true;
    }
    
    // Draw domino
    push();
    translate(d.x, d.y, d.z);
    
    if (d.fallen) {
      let fallProgress = (now - d.fallTime) / 1000; // Fall over 1 second
      if (fallProgress < 1) {
        rotateX(-PI/2 * fallProgress);
      } else {
        rotateX(-PI/2);
      }
    }
    
    fill(30, 50, 80);
    noStroke();
    box(d.size, d.size/4, d.size/4);
    pop();
    
    // Trigger crystallization at domino locations
    if (d.fallen && now - d.fallTime < 1000) {
      let t = map(now - d.fallTime, 0, 1000, 0, 1);
      let spawnRate = map(t, 0, 1, 0, 5); // Gradually increase spawning
      
      for (let j = 0; j < spawnRate; j++) {
        if (random() < 0.3) {
          crystals.push({
            x: d.x + random(-20, 20),
            y: d.y - 10,
            z: d.z,
            size: random(5, 15),
            hue: random(200, 260),
            growth: 0,
            maxGrowth: random(0.5, 1.5),
            state: 'growing',
            age: 0
          });
        }
      }
    }
  }

  // Update crystals
  for (let i = crystals.length - 1; i >= 0; i--) {
    let c = crystals[i];
    c.age++;
    
    if (c.state === 'growing') {
      c.growth += 0.02 * c.maxGrowth;
      
      if (c.growth > 1) {
        c.state = 'stable';
        c.growth = 1;
      }
    }
    
    // Draw crystal
    push();
    translate(c.x, c.y, c.z);
    fill(c.hue, 80, 90);
    noStroke();
    
    // Create a simple geometric crystal shape (pyramid with base)
    beginShape();
    vertex(0, -c.size * c.growth, 0);
    vertex(-c.size * c.growth/2, c.size * c.growth/2, -c.size * c.growth/2);
    vertex(c.size * c.growth/2, c.size * c.growth/2, -c.size * c.growth/2);
    vertex(0, c.size * c.growth/2, c.size * c.growth/2);
    endShape(CLOSE);
    
    pop();
  }
  
  // Update and draw crystal seeds
  for (let i = crystalSeeds.length - 1; i >= 0; i--) {
    let s = crystalSeeds[i];
    
    if (!s.active) {
      // Randomly activate some seeds to start growth
      if (random() < 0.001) {
        s.active = true;
        // Set target near a domino that has fallen
        let activeDominoes = dominoes.filter(d => d.fallen && millis() - d.fallTime < 1500);
        if (activeDominoes.length > 0) {
          let target = activeDominoes[floor(random(activeDominoes.length))];
          s.targetX = target.x + random(-30, 30);
          s.targetY = target.y;
          s.targetZ = target.z + random(-30, 30);
        }
      }
    } else {
      // Move towards target
      let dx = s.targetX - s.x;
      let dy = s.targetY - s.y;
      let dz = s.targetZ - s.z;
      
      let dist = sqrt(dx*dx + dy*dy + dz*dz);
      if (dist > 1) {
        s.x += dx * 0.05;
        s.y += dy * 0.05;
        s.z += dz * 0.05;
      } else {
        // Reached target, create crystal
        crystals.push({
          x: s.x,
          y: s.y,
          z: s.z,
          size: s.size * 2,
          hue: s.hue,
          growth: 0,
          maxGrowth: random(0.8, 1.5),
          state: 'growing',
          age: 0
        });
        crystalSeeds.splice(i, 1);
      }
    }
    
    // Draw seed particle
    push();
    translate(s.x, s.y, s.z);
    fill(s.hue, 80, 90);
    noStroke();
    sphere(s.size);
    pop();
  }

  // Remove old crystals to keep performance
  if (crystals.length > 500) {
    crystals.splice(0, crystals.length - 500);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
