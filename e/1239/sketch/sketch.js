let shards = [];
let emeraldLight;
let pulse = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create emerald light at center
  emeraldLight = color(120, 80, 60, 1);
  
  // Create shards
  for (let i = 0; i < 150; i++) {
    shards.push({
      pos: createVector(
        random(-width/2, width/2),
        random(-height/2, height/2),
        random(-200, 200)
      ),
      rot: createVector(random(TWO_PI), random(TWO_PI), random(TWO_PI)),
      rotSpeed: createVector(
        random(-0.005, 0.005),
        random(-0.005, 0.005),
        random(-0.005, 0.005)
      ),
      size: random(10, 40),
      color: color(random(200, 260), 70, 80, 0.9),
      points: []
    });
  }
  
  // Generate jagged shard geometry
  for (let s of shards) {
    const pointCount = floor(random(8, 15));
    s.points = [];
    for (let i = 0; i < pointCount; i++) {
      const angle = map(i, 0, pointCount, 0, TWO_PI);
      const radius = s.size * random(0.7, 1.3);
      const x = cos(angle) * radius;
      const y = sin(angle) * radius;
      s.points.push({x, y});
    }
  }
}

function draw() {
  background(0);
  
  // Pulsing emerald light
  pulse += 0.02;
  let pulseIntensity = map(sin(pulse), -1, 1, 0.8, 1.2);
  
  // Ambient lighting
  ambientLight(emeraldLight, pulseIntensity);
  
  // Directional light from center
  pointLight(emeraldLight, 0, 0, 0);
  
  // Draw each shard
  for (let s of shards) {
    push();
    
    // Position and rotate
    translate(s.pos.x, s.pos.y, s.pos.z);
    rotateX(s.rot.x);
    rotateY(s.rot.y);
    rotateZ(s.rot.z);
    
    // Apply chrome texture effect with dynamic lighting
    fill(s.color);
    stroke(255, 0.3);
    strokeWeight(0.5);
    
    // Draw jagged shard
    beginShape();
    for (let p of s.points) {
      vertex(p.x, p.y, 0);
    }
    endShape(CLOSE);
    
    pop();
    
    // Update rotation
    s.rot.add(s.rotSpeed);
    
    // Slow floating motion
    s.pos.x += random(-0.1, 0.1);
    s.pos.y += random(-0.1, 0.1);
    s.pos.z += random(-0.1, 0.1);
    
    // Wrap around screen
    if (s.pos.x > width/2 + 50) s.pos.x = -width/2 - 50;
    if (s.pos.x < -width/2 - 50) s.pos.x = width/2 + 50;
    if (s.pos.y > height/2 + 50) s.pos.y = -height/2 - 50;
    if (s.pos.y < -height/2 - 50) s.pos.y = height/2 + 50;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
