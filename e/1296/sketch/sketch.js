let shards = [];
let emeraldLight;
let fft;
let amplitude;

function setup() {
  createCanvas(400, 400, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create shards
  for (let i = 0; i < 200; i++) {
    shards.push({
      pos: createVector(random(-width/2, width/2), random(-height/2, height/2), random(-200, 200)),
      rot: createVector(random(TWO_PI), random(TWO_PI), random(TWO_PI)),
      rotSpeed: createVector(random(-0.01, 0.01), random(-0.01, 0.01), random(-0.01, 0.01)),
      size: random(5, 20),
      color: color(random(180, 240), 60, 30, 0.8),
      patina: random(0.3, 0.7)
    });
  }
  
  // Emerald light
  emeraldLight = color(120, 100, 50, 0.3);
  
  // Audio setup
  fft = new p5.FFT();
  amplitude = new p5.Amplitude();
}

function draw() {
  background(0);
  
  // Pulsating emerald light
  let pulse = sin(frameCount * 0.02) * 0.2 + 0.8;
  pointLight(emeraldLight, 0, 0, 0);
  
  // Ambient lighting
  ambientLight(30);
  
  // Draw shards
  for (let shard of shards) {
    push();
    
    translate(shard.pos.x, shard.pos.y, shard.pos.z);
    rotateX(shard.rot.x);
    rotateY(shard.rot.y);
    rotateZ(shard.rot.z);
    
    // Apply patina effect
    let patina = lerp(0.7, 0.9, shard.patina);
    
    // Draw the shard with chrome texture
    fill(shard.color);
    stroke(shard.color);
    strokeWeight(0.5);
    
    // Create jagged shard shape using multiple facets
    beginShape();
    for (let i = 0; i < 8; i++) {
      let angle = map(i, 0, 8, 0, TWO_PI);
      let x = cos(angle) * shard.size;
      let y = sin(angle) * shard.size;
      vertex(x, y, 0);
    }
    endShape(CLOSE);
    
    // Add some inner facets for depth
    fill(lerpColor(shard.color, color(0), 0.8));
    stroke(lerpColor(shard.color, color(0), 0.5));
    beginShape();
    for (let i = 0; i < 6; i++) {
      let angle = map(i, 0, 6, 0, TWO_PI);
      let x = cos(angle) * shard.size * 0.5;
      let y = sin(angle) * shard.size * 0.5;
      vertex(x, y, 0);
    }
    endShape(CLOSE);
    
    pop();
    
    // Update rotation
    shard.rot.add(shard.rotSpeed);
  }
  
  // Audio-reactive motion
  if (amplitude && fft) {
    let vol = amplitude.getLevel();
    let freqs = fft.analyze();
    let bass = fft.getEnergy('bass');
    
    for (let i = 0; i < shards.length; i++) {
      let s = shards[i];
      s.pos.x += sin(frameCount * 0.01 + i) * vol * 0.5;
      s.pos.y += cos(frameCount * 0.01 + i) * vol * 0.5;
      s.pos.z += sin(frameCount * 0.005 + i) * vol * 0.2;
    }
  }
}

function mousePressed() {
  userStartAudio();
}
