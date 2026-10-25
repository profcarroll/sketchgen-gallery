let textFragments = [];
let inkBlobs = [];
let newsprintBackground;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(15);
  
  // Create newsprint background
  newsprintBackground = createGraphics(width, height);
  newsprintBackground.colorMode(HSB, 360, 100, 100, 1);
  newsprintBackground.background(30, 10, 95); // cream-colored base
  
  // Add subtle texture to background
  for (let i = 0; i < 1000; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(0.5, 2);
    let brightness = random(85, 95);
    newsprintBackground.noStroke();
    newsprintBackground.fill(30, 10, brightness);
    newsprintBackground.ellipse(x, y, size, size);
  }
  
  // Initialize text fragments
  for (let i = 0; i < 2000; i++) {
    textFragments.push({
      x: random(width),
      y: random(height),
      text: random(['THE', 'NEWS', 'WAS', 'REPORTED', 'IN', 'TODAY', 'SPECIAL', 'STORY', 'UPDATE', 'BREAKING']),
      size: random(4, 12),
      opacity: random(0.3, 0.8),
      rotation: random(TWO_PI),
      speedX: random(-0.5, 0.5),
      speedY: random(-0.5, 0.5),
      age: 0,
      dissolved: false
    });
  }
  
  // Initialize ink blobs
  for (let i = 0; i < 100; i++) {
    inkBlobs.push({
      x: random(width),
      y: random(height),
      size: random(20, 100),
      maxRadius: random(30, 150),
      age: 0,
      growthRate: random(0.1, 0.5),
      color: color(random(10, 40), random(40, 70), random(10, 30)),
      spreading: false
    });
  }
  
  noStroke();
}

function draw() {
  // Draw the newsprint background
  image(newsprintBackground, 0, 0);
  
  time += 0.01;
  
  // Update and draw text fragments
  for (let i = 0; i < textFragments.length; i++) {
    let fragment = textFragments[i];
    
    if (!fragment.dissolved) {
      // Move the fragment
      fragment.x += fragment.speedX;
      fragment.y += fragment.speedY;
      
      // Occasionally make fragments fade or dissolve
      if (random() < 0.001) {
        fragment.dissolved = true;
      }
      
      // Keep fragments on canvas
      if (fragment.x < -20 || fragment.x > width + 20 || 
          fragment.y < -20 || fragment.y > height + 20) {
        fragment.x = random(width);
        fragment.y = random(height);
        fragment.dissolved = false;
      }
      
      // Draw the fragment
      fill(0, 0, 0, fragment.opacity);
      textSize(fragment.size);
      textAlign(CENTER, CENTER);
      textFont('Courier New');
      push();
      translate(fragment.x, fragment.y);
      rotate(fragment.rotation);
      text(fragment.text, 0, 0);
      pop();
    } else {
      // Draw dissolving fragment as a small blob
      fill(0, 0, 0, 0.2);
      ellipse(fragment.x, fragment.y, random(2, 5));
    }
    
    fragment.age++;
  }
  
  // Update and draw ink blobs
  for (let i = 0; i < inkBlobs.length; i++) {
    let blob = inkBlobs[i];
    
    if (!blob.spreading) {
      // Start spreading occasionally
      if (random() < 0.002) {
        blob.spreading = true;
        blob.age = 0;
      }
    } else {
      // Grow the blob
      blob.size += blob.growthRate;
      blob.age++;
      
      // Fade out as it spreads
      let alpha = map(blob.age, 0, 150, 255, 0);
      
      // Draw the spreading ink
      fill(red(blob.color), green(blob.color), blue(blob.color), alpha);
      noStroke();
      ellipse(blob.x, blob.y, blob.size, blob.size);
      
      // Stop spreading after a while
      if (blob.age > 150) {
        blob.spreading = false;
        blob.size = random(20, 100);
        blob.x = random(width);
        blob.y = random(height);
      }
    }
    
    // Occasionally create new blobs
    if (random() < 0.0005 && !blob.spreading) {
      blob.spreading = true;
      blob.age = 0;
    }
  }
  
  // Occasionally add new text fragments
  if (random() < 0.1) {
    textFragments.push({
      x: random(width),
      y: random(height),
      text: random(['THE', 'NEWS', 'WAS', 'REPORTED', 'IN', 'TODAY', 'SPECIAL', 'STORY', 'UPDATE', 'BREAKING']),
      size: random(4, 12),
      opacity: random(0.3, 0.8),
      rotation: random(TWO_PI),
      speedX: random(-0.5, 0.5),
      speedY: random(-0.5, 0.5),
      age: 0,
      dissolved: false
    });
    
    // Keep array size manageable
    if (textFragments.length > 2500) {
      textFragments.shift();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
