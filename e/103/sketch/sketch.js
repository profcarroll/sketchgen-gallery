let lavaParticles = [];
let ashClouds = [];
let rocks = [];

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create ground rocks
  for (let i = 0; i < 200; i++) {
    rocks.push({
      x: random(width),
      y: random(height * 0.7, height),
      size: random(10, 50),
      hue: random(20, 40)
    });
  }
  
  // Create initial lava particles
  for (let i = 0; i < 1000; i++) {
    lavaParticles.push({
      x: random(width),
      y: random(height * 0.3, height * 0.7),
      size: random(2, 8),
      speedX: random(-1, 1),
      speedY: random(0.5, 2),
      hue: random(10, 30), // yellow to orange
      alpha: random(0.7, 1)
    });
  }
  
  // Create ash particles
  for (let i = 0; i < 500; i++) {
    ashClouds.push({
      x: random(width),
      y: random(height * 0.2, height * 0.6),
      size: random(1, 5),
      speedX: random(-0.5, 0.5),
      speedY: random(-0.3, -0.1),
      alpha: random(0.2, 0.7)
    });
  }
}

function draw() {
  background(0, 0, 10); // Dark night sky
  
  // Draw ground
  fill(30, 30, 20);
  noStroke();
  rect(0, height * 0.7, width, height * 0.3);
  
  // Draw rocks
  for (let rock of rocks) {
    fill(rock.hue, 50, 30);
    noStroke();
    ellipse(rock.x, rock.y, rock.size);
  }
  
  // Update and draw lava particles
  for (let i = lavaParticles.length - 1; i >= 0; i--) {
    let p = lavaParticles[i];
    
    p.x += p.speedX;
    p.y += p.speedY;
    
    // Gravity effect
    p.speedY += 0.05;
    
    // Color change as it cools
    p.hue += 0.1;
    if (p.hue > 30) p.hue = 30; // Cap at orange
    
    fill(p.hue, 100, 100, p.alpha);
    noStroke();
    ellipse(p.x, p.y, p.size);
    
    // Remove particles that fall off screen
    if (p.y > height) {
      lavaParticles.splice(i, 1);
      // Add new one at top
      lavaParticles.push({
        x: random(width),
        y: random(height * 0.2, height * 0.4),
        size: random(2, 8),
        speedX: random(-1, 1),
        speedY: random(0.5, 2),
        hue: random(10, 30),
        alpha: random(0.7, 1)
      });
    }
  }
  
  // Update and draw ash particles
  for (let i = ashClouds.length - 1; i >= 0; i--) {
    let p = ashClouds[i];
    
    p.x += p.speedX;
    p.y += p.speedY;
    
    // Slow rise effect
    p.speedY *= 0.98;
    p.speedX *= 0.99;
    
    fill(0, 0, 0, p.alpha);
    noStroke();
    ellipse(p.x, p.y, p.size);
    
    // Remove particles that go off screen or fade out
    if (p.y < 0 || p.alpha < 0.05) {
      ashClouds.splice(i, 1);
      // Add new one at bottom
      ashClouds.push({
        x: random(width),
        y: height * 0.8,
        size: random(1, 5),
        speedX: random(-0.5, 0.5),
        speedY: random(-0.3, -0.1),
        alpha: random(0.2, 0.7)
      });
    }
  }
  
  // Add some smoke plume at top center
  if (frameCount % 5 === 0) {
    for (let i = 0; i < 5; i++) {
      ashClouds.push({
        x: width / 2 + random(-10, 10),
        y: height * 0.1,
        size: random(5, 20),
        speedX: random(-0.3, 0.3),
        speedY: random(-0.5, -0.1),
        alpha: random(0.3, 0.7)
      });
    }
  }
}
