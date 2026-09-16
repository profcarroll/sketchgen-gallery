let forms = [];
let tails = [];
let bgColor = 0;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 255);
  
  // Initialize bioluminescent forms
  for (let i = 0; i < 150; i++) {
    forms.push({
      x: random(width),
      y: random(height),
      size: random(20, 80),
      speed: random(0.5, 2),
      hue: random(180, 255), // Electric blue to deep purple
      pulse: random(TWO_PI),
      tail: []
    });
  }
  
  // Initialize tails
  for (let i = 0; i < 300; i++) {
    tails.push({
      x: random(width),
      y: random(height),
      size: random(1, 5),
      opacity: random(50, 200),
      life: random(50, 150)
    });
  }
}

function draw() {
  // Gradually shift background darkness
  bgColor = map(noise(time * 0.001), 0, 1, 10, 30);
  background(bgColor);
  
  time++;
  
  // Update and display forms
  for (let i = 0; i < forms.length; i++) {
    let form = forms[i];
    
    // Move form
    form.x += sin(time * 0.002 + i) * form.speed;
    form.y += cos(time * 0.002 + i) * form.speed;
    
    // Keep in bounds
    if (form.x < 0 || form.x > width) form.speed *= -1;
    if (form.y < 0 || form.y > height) form.speed *= -1;
    
    // Pulsate and ripple effect
    form.pulse += 0.05;
    let pulseSize = sin(form.pulse) * 5 + form.size;
    
    // Draw glowing form
    noStroke();
    fill(form.hue, 255, 255, 100);
    ellipse(form.x, form.y, pulseSize);
    
    // Add ripple effect
    stroke(form.hue, 255, 255, 50);
    noFill();
    ellipse(form.x, form.y, pulseSize * 1.5);
    
    // Update tail
    form.tail.push({x: form.x, y: form.y, life: 100});
    if (form.tail.length > 20) {
      form.tail.shift();
    }
    
    // Draw tail segments with dynamic thickness and intensity
    beginShape(LINES);
    for (let j = 0; j < form.tail.length - 1; j++) {
      let t1 = form.tail[j];
      let t2 = form.tail[j + 1];
      
      if (t1 && t2) {
        let alpha = map(j, 0, form.tail.length, 0, 150);
        stroke(form.hue, 255, 255, alpha);
        strokeWeight(map(j, 0, form.tail.length, 0.5, 3));
        line(t1.x, t1.y, t2.x, t2.y);
      }
    }
    endShape();
    
    // Occasionally cluster tails
    if (random() < 0.005 && form.tail.length > 10) {
      let cluster = [];
      for (let j = 0; j < 5; j++) {
        cluster.push({
          x: form.x + random(-20, 20),
          y: form.y + random(-20, 20),
          size: random(1, 3),
          opacity: random(100, 200),
          life: random(20, 50)
        });
      }
      // Draw cluster
      for (let c of cluster) {
        noStroke();
        fill(form.hue, 255, 255, c.opacity);
        ellipse(c.x, c.y, c.size);
      }
    }
  }
  
  // Update and display smoke tails
  for (let i = 0; i < tails.length; i++) {
    let tail = tails[i];
    
    tail.x += random(-1, 1);
    tail.y += random(-1, 1);
    tail.life--;
    
    if (tail.life <= 0) {
      tail.x = random(width);
      tail.y = random(height);
      tail.life = random(50, 150);
      tail.size = random(1, 5);
      tail.opacity = random(50, 200);
    }
    
    // Draw tail
    noStroke();
    fill(200, 200, 255, tail.opacity);
    ellipse(tail.x, tail.y, tail.size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
