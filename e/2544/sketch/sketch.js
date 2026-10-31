let branches = [];
let backgroundTexture;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  
  // Create background texture resembling newsprint
  backgroundTexture = createGraphics(width, height);
  backgroundTexture.loadPixels();
  for (let i = 0; i < width * height * 0.3; i++) {
    const x = floor(random(width));
    const y = floor(random(height));
    const bright = random(10) > 7 ? 255 : 0;
    backgroundTexture.set(x, y, bright);
  }
  backgroundTexture.updatePixels();
  
  // Start with a few central points
  branches.push({
    x: width/2,
    y: height/2,
    direction: random(TWO_PI),
    length: 0,
    speed: random(0.5, 1.5),
    segments: [],
    age: 0,
    maxAge: random(200, 500)
  });
}

function draw() {
  // Draw background with newsprint texture
  image(backgroundTexture, 0, 0);
  
  // Add some subtle noise to the background
  loadPixels();
  for (let i = 0; i < pixels.length; i += 4) {
    if (random() > 0.98) {
      pixels[i] = min(255, pixels[i] + random(-10, 10));
      pixels[i+1] = min(255, pixels[i+1] + random(-10, 10));
      pixels[i+2] = min(255, pixels[i+2] + random(-10, 10));
    }
  }
  updatePixels();
  
  // Update and draw branches
  for (let i = branches.length - 1; i >= 0; i--) {
    const branch = branches[i];
    
    // Age the branch
    branch.age++;
    
    // Branch out randomly
    if (random() < 0.02 && branch.segments.length > 10) {
      const newBranch = {
        x: branch.x,
        y: branch.y,
        direction: branch.direction + random(-0.5, 0.5),
        length: 0,
        speed: random(0.5, 1.5),
        segments: [],
        age: 0,
        maxAge: random(200, 500)
      };
      branches.push(newBranch);
    }
    
    // Move the branch
    branch.x += cos(branch.direction) * branch.speed;
    branch.y += sin(branch.direction) * branch.speed;
    
    // Add to segment list
    branch.segments.push({x: branch.x, y: branch.y});
    
    // Occasionally change direction
    if (random() < 0.1) {
      branch.direction += random(-0.3, 0.3);
    }
    
    // Draw the branch
    stroke(30, 25, 20);
    strokeWeight(1.5);
    noFill();
    
    beginShape();
    for (let j = 0; j < branch.segments.length; j++) {
      const seg = branch.segments[j];
      curveVertex(seg.x, seg.y);
    }
    endShape();
    
    // Remove old segments to keep it manageable
    if (branch.segments.length > 200) {
      branch.segments.shift();
    }
    
    // Remove dead branches
    if (branch.age > branch.maxAge || 
        branch.x < -50 || branch.x > width + 50 ||
        branch.y < -50 || branch.y > height + 50) {
      branches.splice(i, 1);
    }
  }
  
  // Occasionally add new central points
  if (random() < 0.01 && branches.length < 20) {
    branches.push({
      x: width/2 + random(-100, 100),
      y: height/2 + random(-100, 100),
      direction: random(TWO_PI),
      length: 0,
      speed: random(0.5, 1.5),
      segments: [],
      age: 0,
      maxAge: random(200, 500)
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
