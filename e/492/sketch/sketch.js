let stars = [];
let nebulae = [];
let supernovas = [];
let milkyWay;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create Milky Way band
  milkyWay = createGraphics(width, height);
  milkyWay.colorMode(HSB, 360, 100, 100, 1);
  milkyWay.noStroke();
  for (let i = 0; i < 1000; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(200, 800);
    let alpha = random(30, 60);
    milkyWay.fill(240, 50, 20, alpha/100);
    milkyWay.ellipse(x, y, size, size*0.6);
  }
  
  // Create stars
  for (let i = 0; i < 3000; i++) {
    stars.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-1000, 1000),
      size: random(0.5, 3),
      brightness: random(0.5, 1),
      twinkleSpeed: random(0.01, 0.03),
      twinklePhase: random(TWO_PI)
    });
  }
  
  // Create nebulae
  for (let i = 0; i < 50; i++) {
    nebulae.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-1000, 1000),
      size: random(300, 800),
      hue: random(10, 40),
      saturation: random(50, 100),
      brightness: random(30, 70),
      alpha: random(20, 50)
    });
  }
}

function draw() {
  background(0);
  
  // Slow rotation for cosmic motion
  rotateY(frameCount * 0.0005);
  rotateX(sin(frameCount * 0.0003) * 0.1);
  
  // Draw Milky Way band
  texture(milkyWay);
  noStroke();
  sphere(800, 32, 32);
  
  // Draw stars
  beginShape(POINTS);
  for (let star of stars) {
    let x = star.x;
    let y = star.y;
    let z = star.z;
    
    // Apply perspective
    let persp = width / (width + z);
    let sx = x * persp;
    let sy = y * persp;
    
    // Twinkle effect
    let twinkle = sin(frameCount * star.twinkleSpeed + star.twinklePhase) * 0.5 + 0.5;
    let size = star.size * twinkle;
    
    fill(60, 100, 100, star.brightness * twinkle);
    vertex(sx, sy, z);
  }
  endShape();
  
  // Draw nebulae
  for (let neb of nebulae) {
    let x = neb.x;
    let y = neb.y;
    let z = neb.z;
    
    // Apply perspective
    let persp = width / (width + z);
    let sx = x * persp;
    let sy = y * persp;
    let size = neb.size * persp;
    
    fill(neb.hue, neb.saturation, neb.brightness, neb.alpha/100);
    noStroke();
    ellipse(sx, sy, size, size*0.6);
  }
  
  // Create occasional supernova
  if (frameCount % 300 === 0 && random() > 0.7) {
    supernovas.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-1000, 1000),
      size: 0,
      maxsize: random(100, 300),
      hue: random(0, 60),
      alpha: 1
    });
  }
  
  // Update and draw supernovas
  for (let i = supernovas.length - 1; i >= 0; i--) {
    let sn = supernovas[i];
    
    // Grow and fade
    sn.size += 2;
    sn.alpha -= 0.01;
    
    if (sn.alpha <= 0) {
      supernovas.splice(i, 1);
      continue;
    }
    
    let x = sn.x;
    let y = sn.y;
    let z = sn.z;
    
    // Apply perspective
    let persp = width / (width + z);
    let sx = x * persp;
    let sy = y * persp;
    let size = sn.size * persp;
    
    fill(sn.hue, 100, 100, sn.alpha);
    noStroke();
    ellipse(sx, sy, size, size*0.6);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
