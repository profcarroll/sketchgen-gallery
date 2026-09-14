let hexagons = [];
let time = 0;
let audioContext;
let oscillator;
let gainNode;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize hexagons
  for (let i = 0; i < 200; i++) {
    hexagons.push({
      x: random(width),
      y: random(height),
      size: random(20, 80),
      rotation: random(TWO_PI),
      speed: random(0.001, 0.005),
      hue: random(360),
      saturation: random(30, 100)
    });
  }
  
  // Setup audio
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  oscillator = audioContext.createOscillator();
  gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  
  oscillator.start();
}

function draw() {
  background(0, 0, 10);
  
  time += 0.01;
  
  // Draw hexagonal lattice
  for (let i = 0; i < hexagons.length; i++) {
    let h = hexagons[i];
    
    push();
    translate(h.x, h.y);
    rotate(h.rotation + time * h.speed);
    
    // Randomly fragment some hexagons
    if (random() < 0.01) {
      // Fragment into triangles
      fill(h.hue, h.saturation, 80);
      noStroke();
      beginShape();
      for (let j = 0; j < 6; j++) {
        let angle = TWO_PI / 6 * j;
        let x = cos(angle) * h.size;
        let y = sin(angle) * h.size;
        vertex(x, y);
      }
      endShape(CLOSE);
      
      // Draw fragments
      for (let j = 0; j < 3; j++) {
        push();
        translate(cos(time * 2 + j * TWO_PI/3) * h.size/2, sin(time * 2 + j * TWO_PI/3) * h.size/2);
        rotate(time * 0.5 + j * TWO_PI/3);
        fill(h.hue + random(-10, 10), h.saturation + random(-20, 20), 80 + random(-20, 20));
        triangle(0, 0, -h.size/3, h.size/2, h.size/3, h.size/2);
        pop();
      }
    } else {
      // Normal hexagon
      fill(h.hue, h.saturation, 80);
      noStroke();
      beginShape();
      for (let j = 0; j < 6; j++) {
        let angle = TWO_PI / 6 * j;
        let x = cos(angle) * h.size;
        let y = sin(angle) * h.size;
        vertex(x, y);
      }
      endShape(CLOSE);
      
      // Add inner hexagon for tessellation effect
      fill(h.hue + 30, h.saturation + 20, 60);
      beginShape();
      for (let j = 0; j < 6; j++) {
        let angle = TWO_PI / 6 * j;
        let x = cos(angle) * h.size * 0.5;
        let y = sin(angle) * h.size * 0.5;
        vertex(x, y);
      }
      endShape(CLOSE);
    }
    
    pop();
    
    // Update hexagon properties
    h.rotation += h.speed;
    h.hue = (h.hue + 0.2) % 360;
    if (random() < 0.001) {
      h.saturation = random(30, 100);
    }
  }
  
  // Add some visual noise
  for (let i = 0; i < 50; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(2, 8);
    fill(random(360), random(50, 100), 80, 0.1);
    noStroke();
    ellipse(x, y, size);
  }
  
  // Update audio based on canvas activity
  let avgBrightness = getAverageBrightness();
  gainNode.gain.setValueAtTime(map(avgBrightness, 0, 255, 0.05, 0.3), audioContext.currentTime);
}

function getAverageBrightness() {
  let total = 0;
  let count = 0;
  
  for (let x = 0; x < width; x += 10) {
    for (let y = 0; y < height; y += 10) {
      let c = get(x, y);
      total += brightness(c);
      count++;
    }
  }
  
  return total / count;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
