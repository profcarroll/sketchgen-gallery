let pods = [];
let blooms = [];
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  // Create pods
  for (let i = 0; i < 8; i++) {
    pods.push({
      x: random(width),
      y: random(height),
      r: random(30, 60),
      color: color(random(100, 255), random(50, 150), random(100, 200)),
      particles: [],
      full: false
    });
  }

  // Create blooms
  for (let i = 0; i < 12; i++) {
    blooms.push({
      x: random(width),
      y: random(height),
      r: random(40, 80),
      color: color(random(200, 255), random(100, 200), random(100, 200)),
      particles: [],
      full: false
    });
  }

  // Create initial particles
  for (let i = 0; i < 200; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      speed: random(0.5, 2),
      angle: random(TWO_PI),
      target: null,
      arrived: false
    });
  }
}

function draw() {
  background(20, 30, 40);

  // Update and display pods
  for (let pod of pods) {
    fill(pod.color);
    ellipse(pod.x, pod.y, pod.r * 2, pod.r * 2);
    
    // Draw inner structure
    noFill();
    stroke(255, 100);
    strokeWeight(1);
    ellipse(pod.x, pod.y, pod.r * 1.5, pod.r * 1.5);
    
    if (pod.particles.length > 0) {
      // Draw accumulated particles
      fill(255, 200);
      for (let p of pod.particles) {
        ellipse(p.x, p.y, 3, 3);
      }
      
      // Animate accumulation
      if (!pod.full && pod.particles.length < 50) {
        pod.full = pod.particles.length >= 50;
      }
    }
  }

  // Update and display blooms
  for (let bloom of blooms) {
    fill(bloom.color);
    ellipse(bloom.x, bloom.y, bloom.r * 2, bloom.r * 2);
    
    // Draw inner structure
    noFill();
    stroke(255, 100);
    strokeWeight(1);
    ellipse(bloom.x, bloom.y, bloom.r * 1.2, bloom.r * 1.2);
    
    if (bloom.particles.length > 0) {
      // Draw accumulated particles
      fill(255, 200);
      for (let p of bloom.particles) {
        ellipse(p.x, p.y, 3, 3);
      }
      
      // Animate accumulation
      if (!bloom.full && bloom.particles.length < 40) {
        bloom.full = bloom.particles.length >= 40;
      }
    }
  }

  // Update and display particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    
    if (!p.arrived) {
      // Spiral movement toward target
      p.angle += 0.05;
      p.x += cos(p.angle) * p.speed;
      p.y += sin(p.angle) * p.speed;
      
      // Find nearest unfull pod or bloom
      let closest = null;
      let minDist = Infinity;
      
      for (let pod of pods) {
        if (!pod.full) {
          let d = dist(p.x, p.y, pod.x, pod.y);
          if (d < minDist && d < pod.r * 1.5) {
            minDist = d;
            closest = {type: 'pod', obj: pod};
          }
        }
      }
      
      for (let bloom of blooms) {
        if (!bloom.full) {
          let d = dist(p.x, p.y, bloom.x, bloom.y);
          if (d < minDist && d < bloom.r * 1.2) {
            minDist = d;
            closest = {type: 'bloom', obj: bloom};
          }
        }
      }
      
      // Set target if found
      if (closest) {
        p.target = closest.obj;
        p.arrived = true;
        
        // Add to target's particles
        if (closest.type === 'pod') {
          closest.obj.particles.push({x: p.x, y: p.y});
        } else {
          closest.obj.particles.push({x: p.x, y: p.y});
        }
      }
    } else {
      // Move toward target
      let target = p.target;
      if (target) {
        let dx = target.x - p.x;
        let dy = target.y - p.y;
        let d = dist(p.x, p.y, target.x, target.y);
        
        if (d > 5) {
          p.x += dx * 0.05;
          p.y += dy * 0.05;
        } else {
          // Add to target's particles
          if (target.particles.length < 100) {
            target.particles.push({x: p.x, y: p.y});
          }
          particles.splice(i, 1); // Remove particle
        }
      }
    }
    
    // Draw particle
    fill(255, 200);
    ellipse(p.x, p.y, p.size, p.size);
  }

  // Occasionally add new particles to keep it dynamic
  if (frameCount % 30 === 0 && particles.length < 300) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      speed: random(0.5, 2),
      angle: random(TWO_PI),
      target: null,
      arrived: false
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
