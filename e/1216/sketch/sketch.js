let sun, mountains, foreground;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create sun
  sun = {
    x: width * 0.8,
    y: height * 0.2,
    radius: 50
  };
  
  // Create mountain range
  mountains = [];
  for (let i = 0; i < 10; i++) {
    mountains.push({
      x: i * width / 10,
      height: random(100, 200),
      width: width / 10
    });
  }
  
  // Create foreground details
  foreground = [];
  for (let i = 0; i < 500; i++) {
    foreground.push({
      x: random(width),
      y: height * 0.7 + random(-20, 20),
      size: random(1, 3),
      hue: random(80, 100), // green range
      saturation: random(40, 60)
    });
  }
}

function draw() {
  // Background gradient (sky)
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(28, 100, 100), color(30, 50, 40), inter);
    stroke(c);
    line(0, y, width, y);
  }
  
  // Draw sun
  noStroke();
  fill(30, 100, 100);
  ellipse(sun.x, sun.y, sun.radius * 2);
  
  // Draw sun glow
  drawingContext.shadowColor = color(30, 100, 100, 50);
  drawingContext.shadowBlur = 30;
  fill(30, 100, 100, 50);
  ellipse(sun.x, sun.y, sun.radius * 3);
  drawingContext.shadowBlur = 0;
  
  // Draw mountains
  noStroke();
  for (let mountain of mountains) {
    fill(24, 60, 30); // dark green
    triangle(
      mountain.x - mountain.width/2,
      height,
      mountain.x + mountain.width/2,
      height,
      mountain.x,
      height - mountain.height
    );
    
    // Add some texture to mountains
    fill(24, 50, 25);
    for (let i = 0; i < 5; i++) {
      let x = mountain.x + random(-mountain.width/3, mountain.width/3);
      let h = random(mountain.height * 0.2, mountain.height * 0.5);
      triangle(
        x - 10,
        height,
        x + 10,
        height,
        x,
        height - h
      );
    }
  }
  
  // Draw atmospheric mist in distance
  for (let i = 0; i < 5; i++) {
    let alpha = map(i, 0, 4, 20, 5);
    fill(30, 20, 20, alpha/100);
    noStroke();
    rect(0, height * (0.7 - i * 0.05), width, height * 0.05);
  }
  
  // Draw foreground details
  for (let plant of foreground) {
    fill(plant.hue, plant.saturation, 30);
    noStroke();
    ellipse(plant.x, plant.y, plant.size);
    
    // Add some variation in the foreground
    if (random() > 0.7) {
      fill(plant.hue + 5, plant.saturation + 10, 25);
      ellipse(plant.x + random(-2, 2), plant.y + random(-2, 2), plant.size * 0.7);
    }
  }
  
  // Draw shadows
  for (let i = 0; i < 100; i++) {
    let x = random(width);
    let y = height * 0.7;
    let len = random(30, 100);
    let angle = PI + random(-0.2, 0.2); // angled towards sun
    stroke(0, 0, 0, 30);
    line(x, y, x + cos(angle) * len, y + sin(angle) * len);
  }
  
  noLoop();
}
