let switches = [];
let windscreen;
let button;
let hyperspaceActive = false;
let hyperspaceTimer = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create switches
  for (let i = 0; i < 12; i++) {
    switches.push({
      x: width * 0.2 + (i % 4) * (width * 0.15),
      y: height * 0.3 + floor(i / 4) * (height * 0.15),
      on: false,
      glow: 0
    });
  }
  
  // Create main button
  button = {
    x: width * 0.5,
    y: height * 0.7,
    w: width * 0.15,
    h: height * 0.08,
    pressed: false
  };
  
  // Create windscreen
  windscreen = createGraphics(width, height * 0.4);
  windscreen.colorMode(HSB, 360, 100, 100, 1);
  windscreen.background(0, 0, 5);
}

function draw() {
  background(0, 0, 10); // Dark metallic background
  
  // Draw control panel frame
  fill(20, 20, 20);
  noStroke();
  rect(0, 0, width, height * 0.2);
  rect(0, height * 0.8, width, height * 0.2);
  
  // Draw main display area
  fill(10, 10, 15);
  rect(0, height * 0.2, width, height * 0.6);
  
  // Draw switches
  for (let s of switches) {
    // Switch base
    fill(30, 10, 30);
    stroke(0, 0, 70);
    strokeWeight(1);
    rect(s.x - 15, s.y - 15, 30, 30, 5);
    
    // Switch glow when inactive
    if (!s.on) {
      s.glow = (s.glow + 0.02) % TWO_PI;
      let alpha = sin(s.glow) * 0.3 + 0.3;
      fill(180, 100, 100, alpha);
      noStroke();
      ellipse(s.x, s.y, 25, 25);
    }
    
    // Switch handle
    fill(40, 30, 60);
    stroke(0, 0, 80);
    strokeWeight(1);
    rect(s.x - 10, s.y - 20, 20, 10, 2);
    
    // Switch indicator
    if (s.on) {
      fill(180, 100, 100);
      noStroke();
      ellipse(s.x, s.y, 10, 10);
    }
  }
  
  // Draw main button
  if (button.pressed) {
    fill(180, 100, 80);
  } else {
    fill(20, 20, 30);
    stroke(0, 0, 80);
    strokeWeight(2);
  }
  rect(button.x - button.w/2, button.y - button.h/2, button.w, button.h, 10);
  
  // Draw button text
  fill(180, 100, 100);
  noStroke();
  textSize(20);
  textAlign(CENTER, CENTER);
  text("HYPERDRIVE", button.x, button.y);
  
  // Draw windscreen
  image(windscreen, 0, height * 0.3);
  
  // Animate hyperspace if active
  if (hyperspaceActive) {
    hyperspaceTimer++;
    
    // Update windscreen with hyperspace effect
    windscreen.loadPixels();
    for (let i = 0; i < windscreen.width * windscreen.height; i++) {
      let x = i % windscreen.width;
      let y = floor(i / windscreen.width);
      
      // Create moving hyperlane effect
      let time = millis() * 0.001 + hyperspaceTimer * 0.05;
      let v = sin(x * 0.02 + time) * cos(y * 0.03 + time) * 0.5 + 0.5;
      
      // Create dynamic color based on position and time
      let hue = (frameCount * 2 + x * 0.1 + y * 0.1) % 360;
      let sat = v * 80 + 20;
      let bri = v * 80 + 20;
      
      // Add some noise for texture
      let noiseVal = noise(x * 0.01, y * 0.01, time * 0.5) * 0.3;
      bri += noiseVal * 40;
      
      windscreen.pixels[i * 4] = hue;     // H
      windscreen.pixels[i * 4 + 1] = sat; // S
      windscreen.pixels[i * 4 + 2] = bri; // B
      windscreen.pixels[i * 4 + 3] = 255; // A
    }
    windscreen.updatePixels();
    
    // Create a bright flash at the center
    if (hyperspaceTimer < 10) {
      fill(180, 100, 100, 0.5);
      noStroke();
      ellipse(width/2, height * 0.45, width * 0.3, height * 0.1);
    }
    
    // Reset after a few seconds
    if (hyperspaceTimer > 180) {
      hyperspaceActive = false;
      hyperspaceTimer = 0;
    }
  } else {
    // Draw static windscreen elements
    windscreen.loadPixels();
    for (let i = 0; i < windscreen.width * windscreen.height; i++) {
      let x = i % windscreen.width;
      let y = floor(i / windscreen.width);
      
      // Static background
      let hue = (x + y) % 360;
      let sat = 20;
      let bri = 10;
      
      windscreen.pixels[i * 4] = hue;     // H
      windscreen.pixels[i * 4 + 1] = sat; // S
      windscreen.pixels[i * 4 + 2] = bri; // B
      windscreen.pixels[i * 4 + 3] = 255; // A
    }
    windscreen.updatePixels();
  }
}

function mousePressed() {
  // Check if button was pressed
  let d = dist(mouseX, mouseY, button.x, button.y);
  if (d < button.w/2) {
    button.pressed = true;
    hyperspaceActive = true;
    hyperspaceTimer = 0;
    
    // Turn on all switches
    for (let s of switches) {
      s.on = true;
    }
  }
}
