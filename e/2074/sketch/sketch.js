let clusters = [];
let time = 0;
const numClusters = 80;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  for (let i = 0; i < numClusters; i++) {
    clusters.push({
      pos: p5.Vector.random3D().mult(random(200, 400)),
      size: random(15, 40),
      color: color(random(360), 80, 90),
      pulse: random(TWO_PI),
      pulseSpeed: random(0.02, 0.05),
      tension: 0,
      tensionSpeed: random(0.01, 0.03),
      trail: [],
    });
  }
}

function draw() {
  background(0, 0, 0, 0.05);
  
  time += 0.02;
  
  // Update and display clusters
  for (let i = 0; i < clusters.length; i++) {
    let c = clusters[i];
    
    // Apply pulsation
    c.pulse += c.pulseSpeed;
    let pulseFactor = sin(c.pulse) * 0.3 + 0.7;
    
    // Apply tension effect (spring under tension)
    c.tension += c.tensionSpeed;
    let tensionFactor = sin(c.tension) * 0.5 + 0.5;
    
    // Update position with spring-like motion
    let target = p5.Vector.random3D().mult(random(100, 200));
    c.pos.lerp(target, 0.01 * (1 - tensionFactor));
    
    // Add to trail
    c.trail.push(c.pos.copy());
    if (c.trail.length > 30) {
      c.trail.shift();
    }
    
    push();
    translate(c.pos.x, c.pos.y, c.pos.z);
    
    // Color shifts over time
    let hueShift = (time + i * 0.1) % 360;
    fill(hueShift, 80, 90, 0.8);
    noStroke();
    
    // Draw pulsating cluster
    sphere(c.size * pulseFactor, 6, 4);
    
    pop();
    
    // Draw trail
    if (c.trail.length > 1) {
      stroke(hueShift, 80, 90, 0.3);
      noFill();
      beginShape(LINES);
      for (let j = 0; j < c.trail.length - 1; j++) {
        let alpha = map(j, 0, c.trail.length - 1, 0, 0.5);
        stroke(hueShift, 80, 90, alpha);
        vertex(c.trail[j].x, c.trail[j].y, c.trail[j].z);
        vertex(c.trail[j + 1].x, c.trail[j + 1].y, c.trail[j + 1].z);
      }
      endShape();
    }
  }
  
  // Connect nearby clusters
  stroke(255, 0.1);
  noFill();
  beginShape(LINES);
  
  for (let i = 0; i < clusters.length; i++) {
    for (let j = i + 1; j < clusters.length; j++) {
      let d = p5.Vector.dist(clusters[i].pos, clusters[j].pos);
      if (d < 200) {
        vertex(clusters[i].pos.x, clusters[i].pos.y, clusters[i].pos.z);
        vertex(clusters[j].pos.x, clusters[j].pos.y, clusters[j].pos.z);
      }
    }
  }
  
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
