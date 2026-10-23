let dominoes = [];
let gasParticles = [];
const dominoCount = 12;
const particleCount = 300;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize dominoes in a line
  for (let i = 0; i < dominoCount; i++) {
    dominoes.push({
      x: -width/3 + i * width/15,
      y: height/4,
      z: 0,
      fallen: false,
      fallTime: 0
    });
  }
  
  // Initialize gas particles
  for (let i = 0; i < particleCount; i++) {
    gasParticles.push({
      pos: createVector(0, 0, 0),
      vel: createVector(random(-1, 1), random(-1, 1), random(-1, 1)),
      size: random(2, 8),
      color: color(random(200, 260), 100, 100, 0.8),
      life: random(100, 300)
    });
  }
}

function draw() {
  background(0);
  
  // Rotate the scene slowly
  rotateY(frameCount * 0.001);
  rotateX(frameCount * 0.0005);
  
  // Trigger dominoes falling in sequence
  if (frameCount % 60 === 0 && frameCount < dominoCount * 60) {
    const index = floor(frameCount / 60);
    if (index < dominoes.length) {
      dominoes[index].fallen = true;
      dominoes[index].fallTime = frameCount;
    }
  }
  
  // Draw dominoes
  for (let domino of dominoes) {
    push();
    translate(domino.x, domino.y, domino.z);
    
    if (domino.fallen) {
      const fallProgress = (frameCount - domino.fallTime) / 30;
      rotateZ(-PI/2 * fallProgress);
    }
    
    fill(240, 20, 30);
    box(20, 5, 50);
    pop();
  }
  
  // Create energy waves from falling dominoes
  for (let domino of dominoes) {
    if (domino.fallen && frameCount - domino.fallTime < 60) {
      const waveAge = frameCount - domino.fallTime;
      const waveRadius = waveAge * 2;
      
      noStroke();
      fill(240, 100, 100, 0.1);
      push();
      translate(domino.x, domino.y, domino.z);
      sphere(waveRadius);
      pop();
    }
  }
  
  // Update and display gas particles
  for (let particle of gasParticles) {
    // Apply some physics to the particles
    particle.pos.add(particle.vel);
    
    // Slow down over time
    particle.vel.mult(0.95);
    
    // Reset if out of bounds or life expired
    if (particle.life <= 0 || 
        abs(particle.pos.x) > width/2 + 100 ||
        abs(particle.pos.y) > height/2 + 100) {
      particle.pos = createVector(0, 0, 0);
      particle.vel = createVector(random(-1, 1), random(-1, 1), random(-1, 1));
      particle.life = random(100, 300);
    }
    
    particle.life--;
    
    // Draw the particle
    fill(particle.color);
    noStroke();
    push();
    translate(particle.pos.x, particle.pos.y, particle.pos.z);
    sphere(particle.size + sin(frameCount * 0.05) * 1);
    pop();
  }
  
  // Add some initial movement to particles from domino impact
  if (frameCount % 60 === 0 && frameCount < dominoCount * 60) {
    const index = floor(frameCount / 60);
    if (index < dominoes.length) {
      for (let particle of gasParticles) {
        const dist = p5.Vector.dist(particle.pos, createVector(dominoes[index].x, dominoes[index].y, dominoes[index].z));
        if (dist < 200) {
          const force = p5.Vector.sub(particle.pos, createVector(dominoes[index].x, dominoes[index].y, dominoes[index].z));
          force.normalize();
          force.mult(0.5);
          particle.vel.add(force);
        }
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
