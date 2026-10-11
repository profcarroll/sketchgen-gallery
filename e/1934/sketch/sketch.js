let groutParticles = [];
let fissureClusters = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 255);
  
  // Create grout texture particles
  for (let i = 0; i < 1000; i++) {
    groutParticles.push({
      x: random(width),
      y: random(height),
      size: random(0.5, 2),
      hue: random(20, 40), // Earthy browns and grays
      saturation: random(10, 30),
      brightness: random(10, 50)
    });
  }
  
  // Create initial fissure clusters
  for (let i = 0; i < 20; i++) {
    fissureClusters.push({
      x: random(width),
      y: random(height),
      size: random(30, 100),
      pulse: random(TWO_PI),
      hue: random(180, 255), // Deep blues to purples
      saturation: random(100, 200)
    });
  }
}

function draw() {
  background(0);
  
  time++;
  
  // Draw grout texture
  for (let p of groutParticles) {
    fill(p.hue, p.saturation, p.brightness);
    noStroke();
    ellipse(p.x, p.y, p.size);
  }
  
  // Update and draw fissure clusters
  for (let i = 0; i < fissureClusters.length; i++) {
    let cluster = fissureClusters[i];
    
    // Pulsate
    cluster.pulse += 0.02;
    let pulseSize = sin(cluster.pulse) * 10 + cluster.size;
    
    // Draw central glow
    noStroke();
    fill(cluster.hue, cluster.saturation, 255, 100);
    ellipse(cluster.x, cluster.y, pulseSize);
    
    // Draw ripple effect
    stroke(cluster.hue, cluster.saturation, 255, 50);
    noFill();
    ellipse(cluster.x, cluster.y, pulseSize * 1.5);
    
    // Occasionally spawn new bioluminescent forms in fissures
    if (random() < 0.005) {
      let angle = random(TWO_PI);
      let distance = random(5, cluster.size/2);
      let x = cluster.x + cos(angle) * distance;
      let y = cluster.y + sin(angle) * distance;
      
      // Create a small glowing form
      fill(cluster.hue, cluster.saturation, 255, 150);
      noStroke();
      ellipse(x, y, random(3, 8));
    }
    
    // Occasionally create new fissure clusters
    if (random() < 0.0005) {
      fissureClusters.push({
        x: random(width),
        y: random(height),
        size: random(30, 100),
        pulse: random(TWO_PI),
        hue: random(180, 255),
        saturation: random(100, 200)
      });
      
      // Limit total clusters
      if (fissureClusters.length > 50) {
        fissureClusters.shift();
      }
    }
  }
  
  // Occasionally add new grout particles for texture variation
  if (random() < 0.1) {
    groutParticles.push({
      x: random(width),
      y: random(height),
      size: random(0.5, 2),
      hue: random(20, 40),
      saturation: random(10, 30),
      brightness: random(10, 50)
    });
    
    // Limit total particles
    if (groutParticles.length > 1500) {
      groutParticles.shift();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
