let shards = [];
let pulse = 0;
let lightPos;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create shards
  for (let i = 0; i < 200; i++) {
    shards.push({
      pos: p5.Vector.random3D().mult(random(200, 400)),
      rot: p5.Vector.random3D(),
      size: random(10, 40),
      spin: p5.Vector.random3D().mult(random(0.005, 0.02)),
      color: color(random(180, 220), 70, 90, 0.8)
    });
  }
  
  lightPos = createVector(0, 0, 0);
}

function draw() {
  background(0);
  
  // Pulsating emerald light
  pulse += 0.01;
  let pulseValue = sin(pulse) * 0.2 + 0.8;
  let lightColor = color(120, 100, 70 * pulseValue, 1);
  
  // Move light center slowly
  lightPos.x = sin(frameCount * 0.001) * 100;
  lightPos.y = cos(frameCount * 0.001) * 100;
  
  // Ambient light
  ambientLight(20);
  
  // Main pulsating light
  pointLight(lightColor, lightPos);
  
  // Draw shards
  for (let shard of shards) {
    push();
    
    translate(shard.pos.x, shard.pos.y, shard.pos.z);
    
    // Rotate
    rotateX(shard.rot.x);
    rotateY(shard.rot.y);
    rotateZ(shard.rot.z);
    
    // Update rotation
    shard.rot.add(shard.spin);
    
    // Draw shard with chrome texture effect
    fill(shard.color);
    noStroke();
    
    // Create jagged shard shape
    beginShape();
    for (let i = 0; i < 12; i++) {
      let angle = map(i, 0, 12, 0, TWO_PI);
      let r = shard.size * (0.8 + noise(frameCount * 0.01 + i) * 0.4);
      let x = r * cos(angle);
      let y = r * sin(angle);
      vertex(x, y, 0);
    }
    endShape(CLOSE);
    
    // Add some reflective highlights
    fill(255, 50);
    beginShape();
    for (let i = 0; i < 6; i++) {
      let angle = map(i, 0, 6, 0, TWO_PI);
      let r = shard.size * 0.3;
      let x = r * cos(angle);
      let y = r * sin(angle);
      vertex(x, y, 0);
    }
    endShape(CLOSE);
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
