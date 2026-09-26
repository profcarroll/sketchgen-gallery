let fragments = [];
let isShattering = false;
let shatterTimer = 0;
let equilibrium = [];
let transitionProgress = 0;
let spiralPoints = [];

class Fragment {
  constructor(x, y, z, size) {
    this.pos = createVector(x, y, z);
    this.vel = p5.Vector.random3D().mult(random(0.5, 2));
    this.acc = createVector(0, 0, 0);
    this.size = size;
    this.color = color(random(100, 180), random(100, 180), random(100, 180), 200);
    this.rotation = createVector(random(TWO_PI), random(TWO_PI), random(TWO_PI));
    this.rotationSpeed = p5.Vector.random3D().mult(random(0.01, 0.05));
    this.originalPos = this.pos.copy();
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    this.rotation.add(this.rotationSpeed);
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    rotateX(this.rotation.x);
    rotateY(this.rotation.y);
    rotateZ(this.rotation.z);

    fill(this.color);
    noStroke();
    box(this.size);

    pop();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();

  // Create initial equilibrium structure
  for (let i = 0; i < 20; i++) {
    let x = random(-width/4, width/4);
    let y = random(-height/4, height/4);
    let z = random(-100, 100);
    equilibrium.push(new Fragment(x, y, z, random(20, 50)));
  }
  
  // Precompute spiral points
  for (let i = 0; i < 300; i++) {
    let t = i * 0.2;
    let r = map(i, 0, 300, 50, 200);
    let x = r * cos(t);
    let y = r * sin(t);
    let z = map(i, 0, 300, -200, 200);
    spiralPoints.push(createVector(x, y, z));
  }
}

function draw() {
  background(0);

  // Camera movement for better perspective
  let time = millis() / 2000;
  camera(0, 0, (height/2) / tan(PI/6), 0, 0, 0, 0, 1, 0);
  rotateY(time * 0.1);

  if (!isShattering) {
    // Normal equilibrium phase
    transitionProgress = lerp(transitionProgress, 0, 0.02);
    
    // Apply forces to keep structure together
    for (let i = 0; i < equilibrium.length; i++) {
      let frag = equilibrium[i];
      let target = createVector(0, 0, 0);
      let force = p5.Vector.sub(target, frag.pos);
      force.normalize();
      force.mult(0.01);
      
      // Add some gentle oscillation
      force.add(p5.Vector.random3D().mult(0.05));
      
      frag.applyForce(force);
    }

    if (frameCount % 120 === 0) {
      isShattering = true;
      shatterTimer = 0;
      fragments = [];
      
      // Create fragments from equilibrium
      for (let i = 0; i < equilibrium.length; i++) {
        let frag = equilibrium[i];
        fragments.push(new Fragment(frag.pos.x, frag.pos.y, frag.pos.z, frag.size));
      }
    }
  } else {
    // Shattering phase
    shatterTimer++;
    transitionProgress = lerp(transitionProgress, 1, 0.05);
    
    // Apply strong forces to fragments
    for (let i = 0; i < fragments.length; i++) {
      let frag = fragments[i];
      
      // Random explosion force
      let force = p5.Vector.random3D().mult(random(0.2, 0.8));
      frag.applyForce(force);
      
      // Add some gravity
      frag.applyForce(createVector(0, 0.1, 0));
    }
    
    if (shatterTimer > 60) {
      isShattering = false;
      // Rebuild equilibrium structure
      equilibrium = [];
      for (let i = 0; i < fragments.length; i++) {
        let x = random(-width/4, width/4);
        let y = random(-height/4, height/4);
        let z = random(-100, 100);
        equilibrium.push(new Fragment(x, y, z, fragments[i].size));
      }
    }
  }

  // Display fragments during shattering
  if (isShattering) {
    for (let i = 0; i < fragments.length; i++) {
      let frag = fragments[i];
      frag.update();
      frag.display();
    }
  } else {
    // Display equilibrium structure
    for (let i = 0; i < equilibrium.length; i++) {
      let frag = equilibrium[i];
      frag.update();
      frag.display();
    }

    // Draw connections between equilibrium fragments
    stroke(255, 10);
    noFill();
    
    beginShape(LINES);
    for (let i = 0; i < equilibrium.length; i++) {
      for (let j = i + 1; j < equilibrium.length; j++) {
        let d = dist(
          equilibrium[i].pos.x, equilibrium[i].pos.y, equilibrium[i].pos.z,
          equilibrium[j].pos.x, equilibrium[j].pos.y, equilibrium[j].pos.z
        );
        
        if (d < 150) {
          vertex(equilibrium[i].pos.x, equilibrium[i].pos.y, equilibrium[i].pos.z);
          vertex(equilibrium[j].pos.x, equilibrium[j].pos.y, equilibrium[j].pos.z);
        }
      }
    }
    endShape();
    
    // Draw helical spiral structure during transition
    if (transitionProgress > 0) {
      stroke(255, 100);
      noFill();
      
      beginShape(LINES);
      for (let i = 0; i < spiralPoints.length - 1; i++) {
        let p1 = spiralPoints[i];
        let p2 = spiralPoints[i + 1];
        
        // Interpolate between current structure and spiral
        let x1 = lerp(p1.x, equilibrium[i % equilibrium.length].pos.x, transitionProgress);
        let y1 = lerp(p1.y, equilibrium[i % equilibrium.length].pos.y, transitionProgress);
        let z1 = lerp(p1.z, equilibrium[i % equilibrium.length].pos.z, transitionProgress);
        
        let x2 = lerp(p2.x, equilibrium[(i + 1) % equilibrium.length].pos.x, transitionProgress);
        let y2 = lerp(p2.y, equilibrium[(i + 1) % equilibrium.length].pos.y, transitionProgress);
        let z2 = lerp(p2.z, equilibrium[(i + 1) % equilibrium.length].pos.z, transitionProgress);
        
        vertex(x1, y1, z1);
        vertex(x2, y2, z2);
      }
      endShape();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
