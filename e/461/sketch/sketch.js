let marble;
let channel;

function setup() {
  createCanvas(600, 600, WEBGL);
  marble = {
    x: 0,
    y: -250,
    z: 0,
    radius: 8,
    speed: 0.5,
    direction: 1
  };
  
  channel = [];
  const segments = 200;
  for (let i = 0; i < segments; i++) {
    const t = map(i, 0, segments - 1, 0, TWO_PI);
    const radius = 50 + sin(t * 3) * 20 + cos(t * 2) * 15;
    const height = map(i, 0, segments - 1, -250, 250);
    const x = radius * cos(t);
    const z = radius * sin(t);
    channel.push({ x, y: height, z });
  }
}

function draw() {
  background(30);
  noStroke();
  ambientLight(60);
  pointLight(255, 255, 255, 0, -300, 0);
  
  // Camera
  const time = millis() * 0.001;
  camera(
    sin(time) * 400,
    200 + sin(time * 0.7) * 100,
    cos(time) * 400,
    0, 0, 0,
    0, 1, 0
  );
  
  // Draw channel
  push();
  stroke(100);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let i = 0; i < channel.length; i++) {
    const p = channel[i];
    vertex(p.x, p.y, p.z);
  }
  endShape(CLOSE);
  pop();
  
  // Draw marble
  push();
  translate(marble.x, marble.y, marble.z);
  ambientLight(100);
  pointLight(255, 255, 255, 0, -300, 0);
  noStroke();
  fill(255, 50, 50);
  sphere(marble.radius);
  pop();
  
  // Update marble
  const currentSegment = floor((marble.y + 250) / (500 / channel.length));
  if (currentSegment >= 0 && currentSegment < channel.length - 1) {
    const p1 = channel[currentSegment];
    const p2 = channel[currentSegment + 1];
    
    const t = map(marble.y, p1.y, p2.y, 0, 1);
    marble.x = lerp(p1.x, p2.x, t);
    marble.z = lerp(p1.z, p2.z, t);
    
    // Add some wobble for realism
    const wobble = sin(time * 5 + currentSegment) * 2;
    marble.x += wobble;
    
    marble.y += marble.speed;
    
    if (marble.y > 250) {
      marble.y = 250;
      marble.x = 0;
      marble.z = 0;
    }
  }
}
