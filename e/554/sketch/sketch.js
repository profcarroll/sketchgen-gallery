let clouds = [];
let lights = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);

  // Create nebula clouds
  for (let i = 0; i < 200; i++) {
    clouds.push({
      x: random(width),
      y: random(height),
      size: random(50, 200),
      speed: random(0.001, 0.005),
      hue: random(240, 300)
    });
  }

  // Create glowing lights
  for (let i = 0; i < 15; i++) {
    lights.push({
      x: random(width),
      y: random(height),
      size: random(2, 6),
      hue: random(0, 360),
      pulseSpeed: random(0.02, 0.05),
      pulsePhase: random(TWO_PI)
    });
  }
}

function draw() {
  // Create gradient background
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(200, 50, 20), color(260, 70, 10), inter);
    stroke(c);
    line(0, y, width, y);
  }

  time += 0.01;

  // Update and draw clouds
  for (let cloud of clouds) {
    cloud.x += sin(time * cloud.speed) * 0.5;
    cloud.y += cos(time * cloud.speed) * 0.5;

    // Draw cloud with flowing lines
    push();
    translate(cloud.x, cloud.y);
    noFill();
    stroke(cloud.hue, 80, 90, 0.2);
    
    beginShape();
    for (let i = 0; i < 100; i++) {
      let angle = map(i, 0, 100, 0, TWO_PI);
      let radius = cloud.size * (0.8 + 0.2 * sin(time * 0.5 + i * 0.1));
      let x = radius * cos(angle);
      let y = radius * sin(angle);
      vertex(x, y);
    }
    endShape(CLOSE);

    // Add luminous lines
    stroke(cloud.hue, 80, 95, 0.3);
    for (let i = 0; i < 10; i++) {
      let angle = map(i, 0, 10, 0, TWO_PI);
      let x1 = cloud.size * 0.5 * cos(angle);
      let y1 = cloud.size * 0.5 * sin(angle);
      let x2 = (cloud.size * 0.8 + random(-10, 10)) * cos(angle + PI/4);
      let y2 = (cloud.size * 0.8 + random(-10, 10)) * sin(angle + PI/4);
      line(x1, y1, x2, y2);
    }
    pop();
  }

  // Update and draw lights
  for (let light of lights) {
    let pulse = sin(time * light.pulseSpeed + light.pulsePhase) * 0.5 + 0.5;
    let size = light.size * (1 + pulse * 0.5);
    
    // Draw main light
    fill(light.hue, 100, 100, 0.8);
    noStroke();
    ellipse(light.x, light.y, size);

    // Draw reflections on nearby clouds
    for (let cloud of clouds) {
      let d = dist(light.x, light.y, cloud.x, cloud.y);
      if (d < cloud.size * 2) {
        let intensity = map(d, 0, cloud.size * 2, 1, 0);
        fill(light.hue, 80, 90, intensity * 0.3);
        ellipse(cloud.x, cloud.y, cloud.size * 0.5);
      }
    }

    // Periodic flares
    if (frameCount % 120 === 0) {
      let flareSize = random(5, 15);
      fill(light.hue, 100, 100, 0.8);
      noStroke();
      ellipse(light.x, light.y, flareSize);
      
      // Create detached fragments
      for (let i = 0; i < 5; i++) {
        let angle = random(TWO_PI);
        let distFromLight = random(20, 60);
        let x = light.x + cos(angle) * distFromLight;
        let y = light.y + sin(angle) * distFromLight;
        fill(light.hue, 100, 100, 0.7);
        ellipse(x, y, random(2, 5));
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
