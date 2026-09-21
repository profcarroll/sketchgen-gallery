let shards = [];
const NUM_SHARDS = 150;
let light;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create shards with jagged, chrome-like appearance
  for (let i = 0; i < NUM_SHARDS; i++) {
    shards.push({
      pos: createVector(random(-width/2, width/2), random(-height/2, height/2), random(-200, 200)),
      rot: createVector(random(TWO_PI), random(TWO_PI), random(TWO_PI)),
      rotSpeed: createVector(random(-0.005, 0.005), random(-0.005, 0.005), random(-0.005, 0.005)),
      size: random(20, 60),
      color: color(random(180, 240), 80, 90, 0.9),
      points: []
    });
    
    // Generate jagged points for each shard
    const numPoints = floor(random(8, 15));
    for (let j = 0; j < numPoints; j++) {
      const angle = map(j, 0, numPoints, 0, TWO_PI);
      const radius = random(0.7, 1) * shards[i].size;
      shards[i].points.push({
        x: cos(angle) * radius,
        y: sin(angle) * radius,
        z: random(-shards[i].size/4, shards[i].size/4)
      });
    }
  }
  
  // Deep emerald light at center
  light = color(120, 90, 80);
}

function draw() {
  background(0);
  
  // Ambient lighting
  ambientLight(30);
  
  // Directional light from the center (emerald glow)
  pointLight(light, 0, 0, 0);
  
  // Rotate entire scene slowly
  rotateY(frameCount * 0.001);
  rotateX(sin(frameCount * 0.0005) * 0.2);
  
  for (let shard of shards) {
    push();
    
    translate(shard.pos.x, shard.pos.y, shard.pos.z);
    rotateX(shard.rot.x);
    rotateY(shard.rot.y);
    rotateZ(shard.rot.z);
    
    // Update rotation
    shard.rot.add(shard.rotSpeed);
    
    // Draw jagged shard
    fill(shard.color);
    noStroke();
    
    beginShape();
    for (let point of shard.points) {
      vertex(point.x, point.y, point.z);
    }
    endShape(CLOSE);
    
    // Add some metallic highlights
    fill(255, 30);
    beginShape();
    for (let i = 0; i < shard.points.length; i++) {
      const p1 = shard.points[i];
      const p2 = shard.points[(i + 1) % shard.points.length];
      
      // Add some highlights to edges
      if (random() > 0.7) {
        vertex(p1.x, p1.y, p1.z);
        vertex(p2.x, p2.y, p2.z);
      }
    }
    endShape();
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
