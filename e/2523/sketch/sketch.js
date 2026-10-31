let shards = [];
let field;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Initialize shards
  for (let i = 0; i < 800; i++) {
    shards.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-1000, 1000),
      size: random(2, 8),
      rotation: random(TWO_PI),
      rotSpeed: random(-0.02, 0.02),
      color: color(random(20, 40), random(60, 80), random(30, 60), 0.8),
      speed: random(0.1, 0.5),
      stress: 0,
      maxStress: random(0.7, 1.0)
    });
  }
  
  // Create field for interaction
  field = new Array(width * height).fill(0);
}

function draw() {
  background(25);
  
  // Camera movement
  let time = millis() * 0.0001;
  camera(
    sin(time) * width/4, 
    cos(time * 0.7) * height/6, 
    cos(time) * width/3,
    0, 0, 0,
    0, 1, 0
  );
  
  // Update and display shards
  for (let i = 0; i < shards.length; i++) {
    let shard = shards[i];
    
    // Apply stress-based movement
    let dx = noise(shard.x * 0.001, shard.y * 0.001, time * 0.5) - 0.5;
    let dy = noise(shard.y * 0.001, shard.z * 0.001, time * 0.3) - 0.5;
    let dz = noise(shard.x * 0.001, shard.z * 0.001, time * 0.7) - 0.5;
    
    shard.x += dx * shard.speed;
    shard.y += dy * shard.speed;
    shard.z += dz * shard.speed;
    
    // Apply rotation
    shard.rotation += shard.rotSpeed;
    
    // Wrap around screen
    if (shard.x < -width/2) shard.x = width/2;
    if (shard.x > width/2) shard.x = -width/2;
    if (shard.y < -height/2) shard.y = height/2;
    if (shard.y > height/2) shard.y = -height/2;
    
    // Build stress
    shard.stress += 0.001;
    
    // Check for fracture and reformation
    if (shard.stress > shard.maxStress) {
      // Create temporary shock effect
      let shock = {
        x: shard.x,
        y: shard.y,
        z: shard.z,
        size: random(5, 15),
        life: 30
      };
      
      // Reset shard properties
      shard.x = random(-width/2, width/2);
      shard.y = random(-height/2, height/2);
      shard.z = random(-1000, 1000);
      shard.stress = 0;
      shard.size = random(2, 8);
      shard.color = color(random(20, 40), random(60, 80), random(30, 60), 0.8);
    }
    
    // Draw shard
    push();
    translate(shard.x, shard.y, shard.z);
    rotateZ(shard.rotation);
    
    // Apply stress highlight
    if (shard.stress > 0.8) {
      fill(180, 100, 100, 0.9);
    } else {
      fill(shard.color);
    }
    
    // Draw geometric shard shape (tetrahedron)
    beginShape(TRIANGLES);
    vertex(0, -shard.size, 0);
    vertex(shard.size, shard.size, 0);
    vertex(-shard.size, shard.size, 0);
    
    vertex(0, -shard.size, 0);
    vertex(0, shard.size, shard.size);
    vertex(shard.size, shard.size, 0);
    
    vertex(0, -shard.size, 0);
    vertex(-shard.size, shard.size, 0);
    vertex(0, shard.size, shard.size);
    
    vertex(shard.size, shard.size, 0);
    vertex(-shard.size, shard.size, 0);
    vertex(0, shard.size, shard.size);
    endShape();
    
    pop();
  }
  
  // Add occasional collision effects
  if (frameCount % 150 === 0) {
    let i = floor(random(shards.length));
    let j = floor(random(shards.length));
    if (i !== j) {
      let d = dist(shards[i].x, shards[i].y, shards[j].x, shards[j].y);
      if (d < 50) {
        shards[i].stress += 0.3;
        shards[j].stress += 0.3;
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
