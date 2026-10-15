let onyx = [];
let streams = [];
const onyxCount = 100;
const streamCount = 80;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create geological striated onyx formation
  for (let i = 0; i < onyxCount; i++) {
    const pos = createVector(
      random(-width/2, width/2),
      random(-height/2, height/2),
      random(-300, 300)
    );
    
    const size = random(20, 80);
    const angle = random(TWO_PI);
    
    onyx.push({
      pos,
      size,
      angle,
      color: color(random(240, 270), 20, 30, 0.8)
    });
  }
  
  // Initialize streams
  for (let i = 0; i < streamCount; i++) {
    const onyxIndex = floor(random(onyx.length));
    const t = random();
    
    streams.push({
      onyxIndex,
      t: t,
      speed: random(0.003, 0.01),
      size: random(2, 5),
      color: color(random(200, 260), 100, 100, 0.9)
    });
  }
}

function draw() {
  background(0);
  
  // Rotate the scene slowly
  rotateY(frameCount * 0.001);
  rotateX(frameCount * 0.0005);
  
  // Draw onyx formation
  for (let o of onyx) {
    fill(o.color);
    push();
    translate(o.pos.x, o.pos.y, o.pos.z);
    rotateZ(o.angle);
    box(o.size, o.size * 0.2, o.size * 0.1);
    pop();
  }
  
  // Draw streams
  noStroke();
  for (let stream of streams) {
    const o = onyx[stream.onyxIndex];
    
    // Update position along the onyx structure
    stream.t += stream.speed;
    if (stream.t > 1) {
      stream.t = 0;
      stream.onyxIndex = floor(random(onyx.length));
    }
    
    const pos = p5.Vector.lerp(
      o.pos,
      p5.Vector.add(o.pos, createVector(cos(o.angle) * o.size, sin(o.angle) * o.size, 0)),
      stream.t
    );
    
    // Draw glowing pulse
    fill(stream.color);
    push();
    translate(pos.x, pos.y, pos.z);
    sphere(stream.size + sin(frameCount * 0.1 + stream.t) * 1.5);
    pop();
  }
  
  // Handle intersections with enhanced glow
  for (let i = 0; i < streams.length; i++) {
    for (let j = i + 1; j < streams.length; j++) {
      const s1 = streams[i];
      const s2 = streams[j];
      
      if (s1.onyxIndex === s2.onyxIndex) continue;
      
      const o1 = onyx[s1.onyxIndex];
      const o2 = onyx[s2.onyxIndex];
      
      // Simple intersection check
      const p1 = p5.Vector.lerp(
        o1.pos,
        p5.Vector.add(o1.pos, createVector(cos(o1.angle) * o1.size, sin(o1.angle) * o1.size, 0)),
        s1.t
      );
      
      const p2 = p5.Vector.lerp(
        o2.pos,
        p5.Vector.add(o2.pos, createVector(cos(o2.angle) * o2.size, sin(o2.angle) * o2.size, 0)),
        s2.t
      );
      
      const distance = p5.Vector.dist(p1, p2);
      if (distance < 20) {
        // Create a bright intersection point
        fill(240, 100, 100, 0.9);
        push();
        translate((p1.x + p2.x) / 2, (p1.y + p2.y) / 2, (p1.z + p2.z) / 2);
        sphere(5 + sin(frameCount * 0.2) * 2);
        pop();
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
