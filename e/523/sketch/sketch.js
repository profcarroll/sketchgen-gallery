let structures = [];
let flora = [];
let trails = [];
let liquids = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create city structures
  for (let i = 0; i < 50; i++) {
    structures.push({
      x: random(-width/2, width/2),
      y: 0,
      z: random(-height/2, height/2),
      h: random(100, 300),
      w: random(20, 60),
      d: random(20, 60),
      rot: random(TWO_PI)
    });
  }
  
  // Create bioluminescent flora
  for (let i = 0; i < 200; i++) {
    flora.push({
      x: random(-width/2, width/2),
      y: 0,
      z: random(-height/2, height/2),
      size: random(5, 20),
      speed: random(0.01, 0.03),
      hue: random(180, 240)
    });
  }
  
  // Create liquid pools
  for (let i = 0; i < 10; i++) {
    liquids.push({
      x: random(-width/2, width/2),
      z: random(-height/2, height/2),
      r: random(50, 150),
      hue: random(200, 260)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;
  
  // Camera movement
  let camX = sin(time * 0.1) * width/4;
  let camZ = cos(time * 0.1) * height/4;
  camera(width/2, height/2, (height/2) / tan(PI/6), width/2, height/2, 0, 0, 1, 0);
  
  // Draw structures
  for (let s of structures) {
    push();
    translate(s.x, s.y - s.h/2, s.z);
    rotateY(s.rot);
    
    // City block with reflective surfaces
    fill(200, 10, 30, 0.8);
    stroke(200, 10, 50);
    strokeWeight(0.5);
    box(s.w, s.h, s.d);
    
    // Reflective top
    fill(200, 5, 80, 0.7);
    noStroke();
    translate(0, s.h/2 - 1, 0);
    box(s.w * 0.9, 2, s.d * 0.9);
    
    pop();
  }
  
  // Draw bioluminescent flora
  for (let f of flora) {
    f.y = sin(time * f.speed + f.x * 0.01) * 30;
    let pulse = sin(time * 2 + f.x * 0.01) * 0.5 + 0.5;
    let size = f.size * pulse;
    
    push();
    translate(f.x, f.y, f.z);
    noStroke();
    fill(f.hue, 100, 100 * pulse, 0.8);
    sphere(size);
    pop();
  }
  
  // Draw liquid pools
  for (let l of liquids) {
    push();
    translate(l.x, 0, l.z);
    noStroke();
    fill(l.hue, 50, 70, 0.3);
    sphere(l.r);
    
    // Fractal patterns on liquid surface
    stroke(l.hue, 80, 90, 0.6);
    noFill();
    beginShape();
    for (let i = 0; i < 12; i++) {
      let angle = map(i, 0, 12, 0, TWO_PI);
      let r = l.r * (0.8 + sin(time * 3 + angle) * 0.2);
      let x = r * cos(angle);
      let z = r * sin(angle);
      vertex(x, 0, z);
    }
    endShape(CLOSE);
    
    pop();
  }
  
  // Draw crystalline trails
  if (frameCount % 3 === 0) {
    trails.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-height/2, height/2),
      size: random(1, 5),
      life: 1.0,
      hue: random(300, 360)
    });
  }
  
  for (let i = trails.length - 1; i >= 0; i--) {
    let t = trails[i];
    t.life -= 0.02;
    t.y += sin(time * 2 + t.x) * 0.5;
    
    if (t.life <= 0) {
      trails.splice(i, 1);
      continue;
    }
    
    push();
    translate(t.x, t.y, t.z);
    noStroke();
    fill(t.hue, 100, 100, t.life * 0.8);
    sphere(t.size);
    pop();
  }
  
  // Metallic deposits
  if (frameCount % 5 === 0) {
    let deposit = {
      x: random(-width/2, width/2),
      z: random(-height/2, height/2),
      size: random(3, 10),
      hue: random(40, 80),
      life: 1.0
    };
    liquids.push(deposit);
  }
  
  // Draw metallic deposits
  for (let i = liquids.length - 1; i >= 0; i--) {
    let l = liquids[i];
    if (l.size && l.hue < 90) { // Metallic deposits
      l.life -= 0.005;
      
      if (l.life <= 0) {
        liquids.splice(i, 1);
        continue;
      }
      
      push();
      translate(l.x, 0, l.z);
      noStroke();
      fill(l.hue, 80, 90, l.life * 0.6);
      sphere(l.size);
      pop();
    }
  }
  
  // Fractal lighting effects
  let lightIntensity = sin(time) * 0.5 + 0.5;
  ambientLight(20 * lightIntensity);
  pointLight(255, 255, 255, width/4, height/4, 100);
}
