let rays = [];
let planes = [];
let lightSource;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 100);
  
  // Initialize light source at a fixed position above the scene
  lightSource = createVector(0, -300, 0);
  
  // Create architectural planes (walls/floors)
  for (let i = 0; i < 8; i++) {
    let plane = {};
    plane.position = createVector(
      random(-400, 400),
      random(-200, 200),
      random(-400, 400)
    );
    plane.normal = p5.Vector.random3D();
    plane.normal.normalize();
    plane.size = random(100, 300);
    planes.push(plane);
  }
  
  // Initialize rays from light source
  for (let i = 0; i < 200; i++) {
    let ray = {};
    ray.origin = lightSource.copy();
    ray.direction = p5.Vector.random3D();
    ray.direction.normalize();
    ray.color = color(random(30, 70), 100, 100, 80);
    rays.push(ray);
  }
}

function draw() {
  background(0);
  time += 0.01;
  
  // Rotate the entire scene slowly
  rotateY(time * 0.2);
  rotateX(sin(time * 0.3) * 0.1);
  
  // Draw architectural planes
  for (let plane of planes) {
    push();
    translate(plane.position.x, plane.position.y, plane.position.z);
    rotateX(PI / 2 + sin(time * 0.5 + plane.position.x * 0.01) * 0.2);
    rotateZ(PI / 4 + cos(time * 0.4 + plane.position.y * 0.01) * 0.3);
    
    // Draw each plane with a subtle animation
    noStroke();
    fill(plane.normal.x * 50 + 50, 30, 20, 60);
    plane.size = 150 + sin(time + plane.position.z * 0.01) * 50;
    
    box(plane.size);
    pop();
  }
  
  // Update and draw rays
  for (let i = 0; i < rays.length; i++) {
    let ray = rays[i];
    
    // Ray direction slightly changes over time to create fluid motion
    ray.direction.rotate(0.005, createVector(0, 1, 0));
    ray.direction.rotate(0.003, createVector(1, 0, 0));
    
    // Find intersection with planes
    let closestHit = Infinity;
    let hitPoint = null;
    let hitNormal = null;
    
    for (let plane of planes) {
      let denom = plane.normal.dot(ray.direction);
      
      if (abs(denom) > 0.001) {
        let t = (plane.position.dist(ray.origin)) / denom;
        
        if (t > 0 && t < closestHit) {
          closestHit = t;
          hitPoint = p5.Vector.add(ray.origin, ray.direction.copy().mult(t));
          hitNormal = plane.normal.copy();
        }
      }
    }
    
    // Draw ray from light source to intersection point
    if (hitPoint) {
      push();
      stroke(ray.color);
      strokeWeight(1);
      
      // Draw the ray path
      line(ray.origin.x, ray.origin.y, ray.origin.z, hitPoint.x, hitPoint.y, hitPoint.z);
      
      // Draw crystalline cluster at intersection point
      let clusterSize = 5 + sin(time * 3 + i) * 3;
      fill(ray.color);
      noStroke();
      
      push();
      translate(hitPoint.x, hitPoint.y, hitPoint.z);
      sphere(clusterSize);
      pop();
      
      pop();
    }
  }
  
  // Add some floating particles for extra energy
  for (let i = 0; i < 50; i++) {
    let x = sin(time * 0.5 + i) * 200;
    let y = cos(time * 0.3 + i) * 150;
    let z = sin(time * 0.4 + i) * 100;
    
    push();
    translate(x, y, z);
    fill(200, 100, 100, 80);
    noStroke();
    sphere(3);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
