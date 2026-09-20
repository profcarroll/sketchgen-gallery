let bricks = [];
let roots = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create bricks
  for (let i = 0; i < 50; i++) {
    bricks.push({
      x: random(-width/2, width/2),
      y: random(-height/4, height/4),
      z: random(-50, 50),
      w: random(60, 80),
      h: random(20, 30),
      d: random(10, 20),
      rotX: random(TWO_PI),
      rotY: random(TWO_PI),
      rotZ: random(TWO_PI),
      tilt: 0,
      spall: []
    });
  }
  
  // Create roots
  for (let i = 0; i < 15; i++) {
    roots.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-100, -50),
      length: random(100, 300),
      segments: [],
      growth: 0
    });
  }
}

function draw() {
  background(0);
  
  time += 0.005;
  
  // Lighting
  pointLight(255, 255, 255, 0, -height/2, 100);
  ambientLight(50);
  
  // Draw bricks
  for (let brick of bricks) {
    push();
    translate(brick.x, brick.y, brick.z);
    rotateX(brick.rotX);
    rotateY(brick.rotY);
    rotateZ(brick.rotZ);
    
    // Brick color
    let hue = map(brick.z, -50, 50, 10, 30); // warmer tones for depth
    let sat = random(10, 25);
    let bri = random(40, 60);
    
    fill(hue, sat, bri);
    stroke(0, 0, 0, 0.3);
    strokeWeight(1);
    
    // Brick shape
    box(brick.w, brick.h, brick.d);
    
    // Spalling effect
    if (brick.spall.length > 0) {
      for (let spall of brick.spall) {
        fill(spall.hue, spall.sat, spall.bri, 0.7);
        noStroke();
        sphere(spall.size);
      }
    }
    
    pop();
  }
  
  // Draw roots
  for (let root of roots) {
    push();
    translate(root.x, root.y, root.z);
    
    stroke(10, 40, 20, 0.8);
    strokeWeight(3);
    
    let growth = sin(time * 0.5 + root.x * 0.01) * 0.5 + 0.5;
    root.growth = min(root.growth + growth * 0.01, 1);
    
    // Root path
    beginShape();
    for (let i = 0; i < 30; i++) {
      let t = i / 29;
      let angle = t * TWO_PI * 3;
      let radius = 5 + sin(t * 10 + time) * 3;
      let x = cos(angle) * radius;
      let y = sin(angle) * radius;
      let z = t * root.length * root.growth;
      
      vertex(x, y, z);
    }
    endShape();
    
    // Root tendrils
    for (let i = 0; i < 5; i++) {
      let t = map(i, 0, 4, 0, root.growth);
      if (t > 0) {
        let angle = t * TWO_PI * 3;
        let radius = 5 + sin(t * 10 + time) * 3;
        let x = cos(angle) * radius;
        let y = sin(angle) * radius;
        let z = t * root.length;
        
        push();
        translate(x, y, z);
        rotateX(time * 2 + i);
        rotateY(time * 1.5 + i);
        
        stroke(0, 30, 10, 0.6);
        strokeWeight(1);
        
        beginShape();
        for (let j = 0; j < 10; j++) {
          let a = map(j, 0, 9, 0, TWO_PI * 2);
          let r = 3 + sin(a * 3 + time) * 2;
          vertex(cos(a) * r, sin(a) * r, 0);
        }
        endShape(CLOSE);
        
        pop();
      }
    }
    
    pop();
  }
  
  // Apply decay effects to bricks
  for (let brick of bricks) {
    if (random() < 0.01) {
      let spallSize = random(2, 6);
      let hue = map(brick.z, -50, 50, 0, 10);
      let sat = random(20, 40);
      let bri = random(30, 50);
      
      brick.spall.push({
        size: spallSize,
        hue: hue,
        sat: sat,
        bri: bri
      });
    }
    
    // Reduce spall over time
    if (brick.spall.length > 0) {
      for (let i = brick.spall.length - 1; i >= 0; i--) {
        if (random() < 0.02) {
          brick.spall.splice(i, 1);
        }
      }
    }
    
    // Apply tilt to bricks
    if (random() < 0.005) {
      brick.tilt = random(-0.02, 0.02);
    }
    
    brick.rotX += brick.tilt;
  }
}
