let planes = [];
let connections = [];
const numPlanes = 8;
const connectionThreshold = 150;
const pulseDuration = 30;

class Plane {
  constructor() {
    this.position = createVector(random(-width/2, width/2), random(-height/2, height/2), random(-200, 200));
    this.size = random(100, 200);
    this.rotation = createVector(random(TWO_PI), random(TWO_PI), random(TWO_PI));
    this.rotationSpeed = createVector(random(-0.005, 0.005), random(-0.005, 0.005), random(-0.005, 0.005));
    this.color = color(random(100, 255), random(100, 255), random(200, 255), 180);
    this.pulse = 0;
  }

  update() {
    this.rotation.add(this.rotationSpeed);
    this.position.x += sin(frameCount * 0.001) * 0.5;
    this.position.y += cos(frameCount * 0.001) * 0.5;
    this.position.z += sin(frameCount * 0.002) * 0.3;
    if (this.pulse > 0) this.pulse--;
  }

  display() {
    push();
    translate(this.position.x, this.position.y, this.position.z);
    rotateX(this.rotation.x);
    rotateY(this.rotation.y);
    rotateZ(this.rotation.z);
    
    fill(this.color);
    noStroke();
    plane(this.size, this.size);
    
    // Glow effect
    if (this.pulse > 0) {
      const pulseSize = this.size * (1 + this.pulse / pulseDuration * 0.5);
      fill(red(this.color), green(this.color), blue(this.color), 30);
      plane(pulseSize, pulseSize);
    }
    
    pop();
  }

  getVertices() {
    // Return the 4 corner vertices of the plane
    const half = this.size / 2;
    const vertices = [];
    push();
    translate(this.position.x, this.position.y, this.position.z);
    rotateX(this.rotation.x);
    rotateY(this.rotation.y);
    rotateZ(this.rotation.z);
    
    for (let i = 0; i < 4; i++) {
      let x, y, z;
      switch(i) {
        case 0: x = -half; y = -half; z = 0; break;
        case 1: x = half; y = -half; z = 0; break;
        case 2: x = half; y = half; z = 0; break;
        case 3: x = -half; y = half; z = 0; break;
      }
      const vertex = createVector(x, y, z);
      vertices.push(vertex);
    }
    
    pop();
    return vertices;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(30);
  
  for (let i = 0; i < numPlanes; i++) {
    planes.push(new Plane());
  }
}

function draw() {
  background(10, 10, 20);
  ambientLight(50);
  pointLight(255, 255, 255, 0, 0, 500);

  // Update and display planes
  for (let i = 0; i < planes.length; i++) {
    planes[i].update();
    planes[i].display();
  }

  // Check connections between planes
  connections = [];
  
  for (let i = 0; i < planes.length; i++) {
    for (let j = i + 1; j < planes.length; j++) {
      const d = p5.Vector.dist(planes[i].position, planes[j].position);
      
      if (d < connectionThreshold) {
        // Trigger pulse
        planes[i].pulse = pulseDuration;
        planes[j].pulse = pulseDuration;
        
        // Get vertices for connecting lines
        const v1 = planes[i].getVertices();
        const v2 = planes[j].getVertices();
        
        // Connect each vertex of plane 1 to each vertex of plane 2
        for (let vi = 0; vi < v1.length; vi++) {
          for (let vj = 0; vj < v2.length; vj++) {
            connections.push({
              start: v1[vi],
              end: v2[vj],
              intensity: map(d, 0, connectionThreshold, 1, 0.2)
            });
          }
        }
      }
    }
  }

  // Draw all connections
  stroke(255, 200);
  strokeWeight(1);
  beginShape(LINES);
  
  for (let i = 0; i < connections.length && i < 1000; i++) {
    const conn = connections[i];
    vertex(conn.start.x, conn.start.y, conn.start.z);
    vertex(conn.end.x, conn.end.y, conn.end.z);
  }
  
  endShape();
}
