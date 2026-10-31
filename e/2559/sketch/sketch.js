let lattice = [];
let shards = [];
let dominoes = [];
let time = 0;
let triggered = false;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create a lattice of crystalline clockwork structures
  const gridCount = 20;
  const strandLength = 250;
  
  for (let i = 0; i < gridCount; i++) {
    for (let j = 0; j < gridCount; j++) {
      // Create vertical crystallized strands
      let x1 = map(i, 0, gridCount - 1, -width/3, width/3);
      let y1 = -height/4;
      let z1 = map(j, 0, gridCount - 1, -200, 200);
      
      let x2 = x1;
      let y2 = height/4;
      let z2 = z1;
      
      lattice.push({
        type: 'strand',
        x1: x1,
        y1: y1,
        z1: z1,
        x2: x2,
        y2: y2,
        z2: z2,
        baseAngle: random(TWO_PI),
        timeOffset: random(1000),
        broken: false,
        breakTime: 0
      });
    }
  }
  
  // Add horizontal connections
  for (let i = 0; i < gridCount; i++) {
    let y = map(i, 0, gridCount - 1, -height/4, height/4);
    
    for (let j = 0; j < gridCount - 1; j++) {
      let x1 = map(j, 0, gridCount - 2, -width/3, width/3);
      let z1 = map(i, 0, gridCount - 1, -200, 200);
      
      let x2 = map(j + 1, 0, gridCount - 2, -width/3, width/3);
      let z2 = z1;
      
      lattice.push({
        type: 'connection',
        x1: x1,
        y1: y,
        z1: z1,
        x2: x2,
        y2: y,
        z2: z2,
        baseAngle: random(TWO_PI),
        timeOffset: random(1000),
        broken: false,
        breakTime: 0
      });
    }
  }
  
  // Create jade dominoes
  for (let i = 0; i < 5; i++) {
    dominoes.push({
      x: random(-width/4, width/4),
      y: -height/2,
      z: random(-100, 100),
      size: random(10, 20),
      fallTime: random(500),
      fallen: false
    });
  }
}

function draw() {
  background(220, 30, 5); // Deep dark background
  
  // Slow rotation of the entire lattice
  rotateY(time * 0.001);
  rotateX(sin(time * 0.0005) * 0.1);
  
  time += 0.5;
  
  // Trigger chain reaction after a delay
  if (time > 300 && !triggered) {
    triggered = true;
    for (let i = 0; i < dominoes.length; i++) {
      dominoes[i].fallen = true;
    }
  }
  
  // Draw the lattice with breakage effect
  beginShape(LINES);
  for (let i = 0; i < lattice.length; i++) {
    let strand = lattice[i];
    
    // Apply oscillation and breaking effects
    let t = time + strand.timeOffset;
    let oscillation1 = sin(t * 0.03 + strand.baseAngle) * 2;
    let oscillation2 = cos(t * 0.025 + strand.baseAngle) * 2;
    
    let x1 = strand.x1 + oscillation1;
    let y1 = strand.y1 + oscillation2;
    let z1 = strand.z1;
    
    let x2 = strand.x2 + oscillation1;
    let y2 = strand.y2 + oscillation2;
    let z2 = strand.z2;
    
    // Break strands if triggered
    if (triggered && !strand.broken) {
      if (random() < 0.01) {
        strand.broken = true;
        strand.breakTime = time;
      }
    }
    
    if (strand.broken) {
      let breakProgress = (time - strand.breakTime) / 30;
      if (breakProgress < 1) {
        // Break the strand
        let breakX = x1 + (x2 - x1) * breakProgress;
        let breakY = y1 + (y2 - y1) * breakProgress;
        let breakZ = z1 + (z2 - z1) * breakProgress;
        
        // Create shard particles at break point
        for (let j = 0; j < 5; j++) {
          shards.push({
            x: breakX,
            y: breakY,
            z: breakZ,
            vx: random(-1, 1),
            vy: random(-1, 1),
            vz: random(-1, 1),
            life: 255
          });
        }
      } else {
        // Fade out broken strands
        let fade = max(0, 1 - (time - strand.breakTime) / 100);
        stroke(240, 70, 80, fade * 0.6);
        strokeWeight(0.5);
        vertex(x1, y1, z1);
        vertex(x2, y2, z2);
        continue;
      }
    } else {
      // Normal strand
      let hue = 200 + sin(t * 0.005) * 10; // Blueish tones for crystal
      let sat = 30 + sin(t * 0.007) * 5;
      let bright = 60 + sin(t * 0.01) * 10;
      
      stroke(hue, sat, bright, 0.8);
      strokeWeight(1.2);
    }
    
    vertex(x1, y1, z1);
    vertex(x2, y2, z2);
  }
  endShape();
  
  // Draw dominoes
  for (let i = 0; i < dominoes.length; i++) {
    let domino = dominoes[i];
    
    if (!domino.fallen) {
      // Dominees falling animation
      if (time > domino.fallTime + 200) {
        domino.fallen = true;
      }
      
      push();
      translate(domino.x, domino.y, domino.z);
      rotateX(PI/2);
      fill(120, 80, 90);
      stroke(100, 70, 85);
      strokeWeight(0.5);
      rect(-domino.size/2, -domino.size/4, domino.size, domino.size/2);
      pop();
    } else {
      // Falling domino
      push();
      translate(domino.x, domino.y, domino.z);
      rotateX(PI/2);
      fill(120, 80, 90);
      stroke(100, 70, 85);
      strokeWeight(0.5);
      
      // Animate falling
      let fallProgress = (time - domino.fallTime) / 50;
      if (fallProgress < 1) {
        rotateZ(fallProgress * PI/2);
      }
      
      rect(-domino.size/2, -domino.size/4, domino.size, domino.size/2);
      pop();
    }
  }
  
  // Draw shards
  beginShape(POINTS);
  for (let i = shards.length - 1; i >= 0; i--) {
    let shard = shards[i];
    
    // Update shard position and life
    shard.x += shard.vx;
    shard.y += shard.vy;
    shard.z += shard.vz;
    shard.life -= 3;
    
    if (shard.life <= 0) {
      shards.splice(i, 1);
      continue;
    }
    
    // Shards are glittering, colorful
    let hue = (time * 2 + shard.x + shard.y) % 360;
    stroke(hue, 100, 100, shard.life/255);
    strokeWeight(0.8);
    vertex(shard.x, shard.y, shard.z);
  }
  endShape();
  
  // Add subtle light particles for sparkle
  beginShape(POINTS);
  for (let i = 0; i < 100; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-300, 300);
    
    // Soft glow effect
    let glow = sin(time * 1.5 + i) * 0.3 + 0.7;
    
    stroke(200, 50, 95, glow * 0.3);
    strokeWeight(glow * 0.3);
    
    vertex(x, y, z);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
