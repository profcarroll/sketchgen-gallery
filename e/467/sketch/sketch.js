let rays = [];
let surfaces = [];
let lightSource;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create light source at center
  lightSource = createVector(0, 0, 0);
  
  // Create architectural surfaces (planes)
  for (let i = 0; i < 8; i++) {
    const angle = TWO_PI * i / 8;
    const x = cos(angle) * 200;
    const z = sin(angle) * 200;
    surfaces.push(createVector(x, 0, z));
  }
  
  // Create rays that will interact with surfaces
  for (let i = 0; i < 500; i++) {
    rays.push({
      pos: createVector(0, 0, 0),
      dir: p5.Vector.random3D().normalize(),
      age: 0,
      maxAge: 100 + random(100)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;
  
  // Move light source in a circular pattern
  lightSource.x = cos(time) * 300;
  lightSource.z = sin(time) * 300;
  
  // Set up lighting
  pointLight(255, 255, 255, lightSource.x, lightSource.y, lightSource.z);
  ambientLight(50);
  
  // Draw architectural surfaces
  push();
  for (let i = 0; i < surfaces.length; i++) {
    const surface = surfaces[i];
    const angle = atan2(surface.z, surface.x);
    
    // Create a rotating plane
    translate(surface.x, surface.y, surface.z);
    rotateY(angle);
    rotateX(PI/2);
    fill(200, 50, 80, 0.6);
    noStroke();
    plane(300, 100);
    
    // Draw some geometric details
    stroke(255, 50);
    noFill();
    beginShape();
    for (let j = 0; j < 12; j++) {
      const a = TWO_PI * j / 12;
      const x = cos(a) * 140;
      const y = sin(a) * 140;
      vertex(x, y, 0);
    }
    endShape(CLOSE);
    
    pop();
    push();
  }
  pop();
  
  // Draw rays and their interactions
  beginShape(POINTS);
  for (let i = 0; i < rays.length; i++) {
    const ray = rays[i];
    
    // Update ray position
    ray.pos.add(ray.dir);
    ray.age++;
    
    // Reset ray if it's too old or has hit a surface
    if (ray.age > ray.maxAge || ray.pos.mag() > 500) {
      ray.pos.set(0, 0, 0);
      ray.dir = p5.Vector.random3D().normalize();
      ray.age = 0;
      ray.maxAge = 100 + random(100);
    }
    
    // Calculate distance to surfaces
    let closestDist = Infinity;
    for (let j = 0; j < surfaces.length; j++) {
      const surface = surfaces[j];
      const dist = p5.Vector.dist(ray.pos, surface);
      if (dist < closestDist) closestDist = dist;
    }
    
    // Glow effect based on proximity to surfaces
    const brightness = map(closestDist, 0, 300, 1, 0.2);
    const hue = (time * 50 + closestDist * 0.5) % 360;
    
    // Draw ray point with glow effect
    fill(hue, 80, 100 * brightness, 0.8);
    noStroke();
    vertex(ray.pos.x, ray.pos.y, ray.pos.z);
  }
  endShape();
  
  // Draw light paths from source to surfaces
  stroke(255, 30);
  noFill();
  for (let i = 0; i < rays.length; i++) {
    const ray = rays[i];
    if (ray.age > 5) {
      line(lightSource.x, lightSource.y, lightSource.z, ray.pos.x, ray.pos.y, ray.pos.z);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
