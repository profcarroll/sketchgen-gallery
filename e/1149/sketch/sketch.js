let shards = [];
let fft;
let amplitude;

function setup() {
  createCanvas(400, 400, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create jagged shards
  for (let i = 0; i < 20; i++) {
    shards.push({
      pos: createVector(random(-width/2, width/2), random(-height/2, height/2), random(-100, 100)),
      rot: createVector(random(TWO_PI), random(TWO_PI), random(TWO_PI)),
      rotSpeed: createVector(random(-0.005, 0.005), random(-0.005, 0.005), random(-0.005, 0.005)),
      size: random(20, 60),
      color: color(random(120, 180), 80, 90),
      points: generateJaggedPoints(random(8, 12))
    });
  }
  
  // Setup audio
  fft = new p5.FFT();
  amplitude = new p5.Amplitude();
}

function draw() {
  background(0);
  
  // Ambient emerald light
  pointLight(100, 255, 100, 0, 0, 300);
  ambientLight(50, 150, 50);
  
  // Rotate the whole scene slowly
  rotateY(frameCount * 0.001);
  
  for (let shard of shards) {
    push();
    
    // Move and rotate each shard
    translate(shard.pos.x, shard.pos.y, shard.pos.z);
    rotateX(shard.rot.x);
    rotateY(shard.rot.y);
    rotateZ(shard.rot.z);
    
    // Update rotation
    shard.rot.add(shard.rotSpeed);
    
    // Draw the jagged shard
    fill(shard.color);
    noStroke();
    beginShape();
    for (let i = 0; i < shard.points.length; i++) {
      let p = shard.points[i];
      vertex(p.x, p.y, p.z);
    }
    endShape(CLOSE);
    
    pop();
  }
  
  // Analyze audio for motion
  let spectrum = fft.analyze();
  let vol = amplitude.getLevel();
  
  // Use audio to affect motion
  if (vol > 0.01) {
    for (let shard of shards) {
      shard.pos.x += random(-0.5, 0.5);
      shard.pos.y += random(-0.5, 0.5);
      shard.rotSpeed.mult(1 + vol * 0.1);
    }
  }
}

function generateJaggedPoints(numPoints) {
  let points = [];
  for (let i = 0; i < numPoints; i++) {
    let angle = map(i, 0, numPoints, 0, TWO_PI);
    let radius = random(0.7, 1.0);
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    let z = random(-0.3, 0.3);
    points.push(createVector(x, y, z));
  }
  return points;
}

function mousePressed() {
  userStartAudio();
}
