let rays = [];
let structure;
let lightSource;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(30);
  
  // Initialize structure with planes
  structure = [
    { type: 'plane', normal: [0, 1, 0], point: [0, -200, 0] }, // floor
    { type: 'plane', normal: [0, -1, 0], point: [0, 200, 0] }, // ceiling
    { type: 'plane', normal: [1, 0, 0], point: [-200, 0, 0] }, // left wall
    { type: 'plane', normal: [-1, 0, 0], point: [200, 0, 0] }, // right wall
    { type: 'plane', normal: [0, 0, 1], point: [0, 0, -200] }, // back wall
    { type: 'plane', normal: [0, 0, -1], point: [0, 0, 200] }, // front wall
    { type: 'plane', normal: [0, 0, 1], point: [0, 0, -100] }, // glass panel
  ];
  
  // Initialize light source
  lightSource = {
    x: 0,
    y: 0,
    z: 0,
    radius: 300,
    angle: 0
  };
  
  // Pre-generate rays
  for (let i = 0; i < 200; i++) {
    rays.push({
      start: [0, 0, 0],
      end: [0, 0, 0],
      intersection: null,
      color: color(random(100, 255), random(100, 255), random(100, 255))
    });
  }
}

function draw() {
  background(0);
  
  // Update light source position
  lightSource.angle += 0.005;
  lightSource.x = cos(lightSource.angle) * lightSource.radius;
  lightSource.z = sin(lightSource.angle) * lightSource.radius;
  
  // Draw structure
  fill(100, 100, 150, 100);
  noStroke();
  for (let plane of structure) {
    push();
    if (plane.type === 'plane') {
      translate(plane.point[0], plane.point[1], plane.point[2]);
      rotateX(PI / 2);
      rotateZ(atan2(plane.normal[0], plane.normal[2]));
      planeDraw(plane.normal[1] > 0 ? 1 : -1); // flip for front/back
    }
    pop();
  }
  
  // Draw rays and intersections
  strokeWeight(1);
  beginShape(LINES);
  for (let i = 0; i < rays.length; i++) {
    let ray = rays[i];
    
    // Calculate ray direction from light source to a point on the structure
    let targetPoint = [random(-150, 150), random(-150, 150), random(-150, 150)];
    
    // Ray from light source to target
    let rayDir = [
      targetPoint[0] - lightSource.x,
      targetPoint[1] - lightSource.y,
      targetPoint[2] - lightSource.z
    ];
    
    // Normalize
    let length = dist(0, 0, 0, ...rayDir);
    if (length > 0) {
      rayDir = [
        rayDir[0] / length,
        rayDir[1] / length,
        rayDir[2] / length
      ];
    }
    
    // Ray start and end
    ray.start = [lightSource.x, lightSource.y, lightSource.z];
    ray.end = [
      lightSource.x + rayDir[0] * 1000,
      lightSource.y + rayDir[1] * 1000,
      lightSource.z + rayDir[2] * 1000
    ];
    
    // Find intersection with structure
    ray.intersection = findIntersection(ray.start, ray.end, structure);
    
    if (ray.intersection) {
      stroke(ray.color);
      vertex(ray.start[0], ray.start[1], ray.start[2]);
      vertex(ray.intersection.x, ray.intersection.y, ray.intersection.z);
    }
  }
  endShape();
  
  // Draw light source
  push();
  translate(lightSource.x, lightSource.y, lightSource.z);
  noStroke();
  fill(255, 200, 100);
  sphere(10);
  pop();
}

function findIntersection(start, end, planes) {
  let closest = null;
  let minDistance = Infinity;
  
  for (let plane of planes) {
    if (plane.type === 'plane') {
      // Plane equation: normal.x * x + normal.y * y + normal.z * z + d = 0
      let d = -(plane.normal[0] * plane.point[0] +
                plane.normal[1] * plane.point[1] +
                plane.normal[2] * plane.point[2]);
      
      // Ray direction and start
      let rayDir = [
        end[0] - start[0],
        end[1] - start[1],
        end[2] - start[2]
      ];
      
      let denom = dot(plane.normal, rayDir);
      
      if (abs(denom) > 0.0001) { // Not parallel
        let t = -(dot(plane.normal, start) + d) / denom;
        
        if (t >= 0 && t <= 1) { // Intersection in segment
          let intersection = [
            start[0] + t * rayDir[0],
            start[1] + t * rayDir[1],
            start[2] + t * rayDir[2]
          ];
          
          let distance = dist(start[0], start[1], start[2], ...intersection);
          
          if (distance < minDistance) {
            minDistance = distance;
            closest = { x: intersection[0], y: intersection[1], z: intersection[2] };
          }
        }
      }
    }
  }
  
  return closest;
}

function dot(a, b) {
  return a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
}

function planeDraw(flip) {
  let size = 400;
  plane(size, size);
}
