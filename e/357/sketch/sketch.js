let pods = [];
let seeds = [];
let seedCount = 0;
const maxSeeds = 300;
const podCount = 5;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create central pods
  for (let i = 0; i < podCount; i++) {
    pods.push({
      x: random(width * 0.2, width * 0.8),
      y: random(height * 0.2, height * 0.8),
      radius: random(40, 80),
      hue: random(120, 240),
      saturation: random(60, 90),
      brightness: random(70, 90),
      seedCount: 0,
      maxSeeds: int(random(30, 80)),
      growthRate: random(0.001, 0.005)
    });
  }
  
  // Create background greenery
  background(200, 30, 90);
}

function draw() {
  // Fade out the background slightly to create motion trail effect
  fill(200, 30, 90, 10);
  noStroke();
  rect(0, 0, width, height);
  
  // Update and display pods
  for (let pod of pods) {
    // Grow seeds inside the pod
    if (pod.seedCount < pod.maxSeeds && random() < 0.3) {
      pod.seedCount++;
      seedCount++;
      
      // Create a new seed
      seeds.push({
        x: pod.x,
        y: pod.y,
        size: random(2, 5),
        hue: pod.hue,
        saturation: pod.saturation,
        brightness: pod.brightness + random(-10, 10),
        targetX: pod.x + random(-pod.radius * 0.8, pod.radius * 0.8),
        targetY: pod.y + random(-pod.radius * 0.8, pod.radius * 0.8),
        speed: random(0.5, 2),
        life: 1,
        decay: random(0.001, 0.003)
      });
    }
    
    // Display the pod
    noFill();
    stroke(pod.hue, pod.saturation, pod.brightness, 0.8);
    strokeWeight(2);
    ellipse(pod.x, pod.y, pod.radius * 2);
    
    // Draw seed container
    fill(pod.hue, pod.saturation, pod.brightness, 0.3);
    noStroke();
    ellipse(pod.x, pod.y, pod.radius * 1.5);
  }
  
  // Update and display seeds
  for (let i = seeds.length - 1; i >= 0; i--) {
    let seed = seeds[i];
    
    // Move towards target position (center of pod)
    if (dist(seed.x, seed.y, seed.targetX, seed.targetY) > 2) {
      let dx = seed.targetX - seed.x;
      let dy = seed.targetY - seed.y;
      seed.x += dx * seed.speed * 0.05;
      seed.y += dy * seed.speed * 0.05;
    } else {
      // Once reached target, start dispersing
      seed.targetX += random(-2, 2);
      seed.targetY += random(-2, 2);
    }
    
    // Update life and decay
    seed.life -= seed.decay;
    
    // Draw the seed
    fill(seed.hue, seed.saturation, seed.brightness, seed.life);
    noStroke();
    ellipse(seed.x, seed.y, seed.size * seed.life);
    
    // Remove dead seeds
    if (seed.life <= 0) {
      seeds.splice(i, 1);
    }
  }
  
  // Occasionally add more seeds to pods for continuous growth
  if (random() < 0.05 && seedCount < maxSeeds) {
    let pod = random(pods);
    if (pod.seedCount < pod.maxSeeds) {
      pod.seedCount++;
      seedCount++;
      
      // Add a new seed
      seeds.push({
        x: pod.x,
        y: pod.y,
        size: random(2, 5),
        hue: pod.hue,
        saturation: pod.saturation,
        brightness: pod.brightness + random(-10, 10),
        targetX: pod.x + random(-pod.radius * 0.8, pod.radius * 0.8),
        targetY: pod.y + random(-pod.radius * 0.8, pod.radius * 0.8),
        speed: random(0.5, 2),
        life: 1,
        decay: random(0.001, 0.003)
      });
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
