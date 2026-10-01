let drops = [];
let cityscape;
let puddles = [];
let crystalCity;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create a tiny cityscape to be shown in each raindrop
  cityscape = createGraphics(100, 100);
  cityscape.background(200);
  cityscape.stroke(0);
  for (let i = 0; i < 50; i++) {
    let x = random(cityscape.width);
    let y = random(cityscape.height);
    let w = random(5, 15);
    let h = random(5, 20);
    cityscape.rect(x, y, w, h);
  }

  // Create a crystalline version of the cityscape
  crystalCity = createGraphics(100, 100);
  crystalCity.background(200);
  crystalCity.stroke(0);
  crystalCity.strokeWeight(2);
  for (let i = 0; i < 50; i++) {
    let x = random(crystalCity.width);
    let y = random(crystalCity.height);
    let w = random(5, 15);
    let h = random(5, 20);
    crystalCity.rect(x, y, w, h);
  }

  // Initialize raindrops
  for (let i = 0; i < 300; i++) {
    drops.push({
      x: random(width),
      y: random(-height, 0),
      speed: random(3, 8),
      size: random(1, 3),
      angle: random(TWO_PI),
      sway: random(-0.5, 0.5),
      swaySpeed: random(0.02, 0.05),
      distortion: 0,
      cityOffsetX: random(-10, 10),
      cityOffsetY: random(-10, 10),
      pulse: random(TWO_PI),
      pulseSpeed: random(0.01, 0.03),
      collected: false,
      collectTimer: 0,
      crystalMode: false,
      crystalTransition: 0
    });
  }
}

function draw() {
  // Draw a dark window pane
  background(30, 40, 60);
  
  // Update and draw puddles
  for (let i = puddles.length - 1; i >= 0; i--) {
    let p = puddles[i];
    p.radius += 0.2;
    p.alpha -= 0.5;
    
    if (p.alpha <= 0) {
      puddles.splice(i, 1);
      continue;
    }
    
    noStroke();
    fill(100, 150, 200, p.alpha);
    ellipse(p.x, p.y, p.radius * 2, p.radius * 2);
    
    // Draw cityscape inside puddle
    push();
    translate(p.x, p.y);
    scale(0.3);
    
    // Determine if this puddle should show crystal cityscape
    let timeSinceCreation = millis() - p.creationTime;
    let crystalThreshold = 1000; // 1 second to transition
    
    if (timeSinceCreation > crystalThreshold) {
      tint(255, 150);
      image(crystalCity, -crystalCity.width/2, -crystalCity.height/2);
    } else {
      let alpha = map(timeSinceCreation, 0, crystalThreshold, 0, 150);
      tint(255, alpha);
      image(cityscape, -cityscape.width/2, -cityscape.height/2);
      
      // Overlay the crystal cityscape with blending
      blendMode(MULTIPLY);
      tint(255, 150);
      image(crystalCity, -crystalCity.width/2, -crystalCity.height/2);
      blendMode(BLEND);
    }
    
    pop();
  }

  // Update and draw raindrops
  for (let drop of drops) {
    // Update position with sway effect
    drop.y += drop.speed;
    drop.angle += drop.swaySpeed;
    drop.x += sin(drop.angle) * drop.sway;

    // Check if drop has collected into a puddle
    if (!drop.collected && drop.y > height * 0.7) {
      let closestPuddle = null;
      let minDist = Infinity;
      
      for (let p of puddles) {
        let d = dist(drop.x, drop.y, p.x, p.y);
        if (d < minDist && d < 30) {
          minDist = d;
          closestPuddle = p;
        }
      }
      
      if (closestPuddle) {
        drop.collected = true;
        drop.collectTimer = 0;
        // Mark puddle as having a crystal cityscape
        closestPuddle.crystalMode = true;
        closestPuddle.creationTime = millis();
      } else if (minDist < 30) {
        // Add to existing puddle
        closestPuddle.radius += 2;
        drop.collected = true;
        drop.collectTimer = 0;
        closestPuddle.crystalMode = true;
        closestPuddle.creationTime = millis();
      } else {
        // Create new puddle
        puddles.push({
          x: drop.x,
          y: drop.y,
          radius: 10,
          alpha: 150,
          crystalMode: false,
          creationTime: millis()
        });
        drop.collected = true;
        drop.collectTimer = 0;
      }
    }

    if (drop.collected) {
      drop.collectTimer++;
      if (drop.collectTimer > 20) {
        // Drop has settled into puddle, reset for next cycle
        drop.y = random(-20, -5);
        drop.x = random(width);
        drop.collected = false;
        drop.distortion = 0;
        drop.crystalMode = false;
        drop.crystalTransition = 0;
      }
    }

    // Reset drop if it goes off screen
    if (drop.y > height + 20 && !drop.collected) {
      drop.y = random(-20, -5);
      drop.x = random(width);
      drop.distortion = 0;
    }

    // Update pulse for cityscape glow
    drop.pulse += drop.pulseSpeed;

    // Draw the raindrop with a slight glow effect
    noStroke();
    fill(180, 220, 255, 180);
    ellipse(drop.x, drop.y, drop.size * 4, drop.size * 6);

    // Draw inner lens effect
    fill(100, 150, 200, 100);
    ellipse(drop.x, drop.y, drop.size * 2, drop.size * 3);

    // Draw the cityscape inside the raindrop
    if (!drop.collected) {
      push();
      translate(drop.x, drop.y);
      scale(0.3); // Scale down the cityscape to fit in the drop

      // Apply gentle pulsing glow to cityscape
      let pulseValue = sin(drop.pulse) * 0.2 + 0.8;
      tint(255, 150 * pulseValue);
      image(cityscape, drop.cityOffsetX, drop.cityOffsetY);
      pop();
    }
  }

  // Add some random drops for more visual interest
  if (random() < 0.05) {
    drops.push({
      x: random(width),
      y: -10,
      speed: random(3, 8),
      size: random(1, 3),
      angle: random(TWO_PI),
      sway: random(-0.5, 0.5),
      swaySpeed: random(0.02, 0.05),
      distortion: 0,
      cityOffsetX: random(-10, 10),
      cityOffsetY: random(-10, 10),
      pulse: random(TWO_PI),
      pulseSpeed: random(0.01, 0.03),
      collected: false,
      collectTimer: 0,
      crystalMode: false,
      crystalTransition: 0
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
