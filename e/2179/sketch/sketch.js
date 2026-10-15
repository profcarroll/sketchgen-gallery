let nodes = [];
let connections = [];
let time = 0;
let ripple = { active: false, x: 0, y: 0, radius: 0 };
const NODE_COUNT = 500;
const CONNECTION_THRESHOLD = 120;
const MAX_CONNECTIONS = 300;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize nodes with random positions and properties
  for (let i = 0; i < NODE_COUNT; i++) {
    nodes.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-300, 300),
      hue: random(360),
      sat: 80,
      bri: 90,
      size: random(2, 6),
      phase: random(TWO_PI),
      targetSize: random(2, 6),
      speed: random(0.005, 0.015)
    });
  }
}

function draw() {
  background(0);
  
  // Slowly rotate the entire scene
  rotateY(time * 0.0003);
  rotateX(time * 0.0002);
  
  // Center of the scene
  translate(0, 0, -500);
  
  // Update ripple effect
  if (ripple.active) {
    ripple.radius += 8;
    if (ripple.radius > 1000) {
      ripple.active = false;
      ripple.radius = 0;
    }
  }

  // Draw connections between nearby nodes using spatial hashing for efficiency
  beginShape(LINES);
  strokeWeight(0.5);
  
  let totalConnections = 0;
  
  for (let i = 0; i < nodes.length && totalConnections < MAX_CONNECTIONS; i++) {
    const nodeA = nodes[i];
    
    for (let j = i + 1; j < nodes.length && totalConnections < MAX_CONNECTIONS; j++) {
      const nodeB = nodes[j];
      
      // Calculate distance
      const dx = nodeA.x - nodeB.x;
      const dy = nodeA.y - nodeB.y;
      const dz = nodeA.z - nodeB.z;
      const distance = sqrt(dx * dx + dy * dy + dz * dz);
      
      // Check if nodes are within connection range
      if (distance < CONNECTION_THRESHOLD) {
        // Fade connections based on distance and ripple effect
        let alpha = map(distance, 0, CONNECTION_THRESHOLD, 0.8, 0.1);
        if (ripple.active) {
          const dxRipple = nodeA.x - ripple.x;
          const dyRipple = nodeA.y - ripple.y;
          const distToRipple = sqrt(dxRipple * dxRipple + dyRipple * dyRipple);
          if (distToRipple < ripple.radius && distToRipple > ripple.radius - 100) {
            alpha = map(distToRipple, ripple.radius - 100, ripple.radius, 0.1, 0.8);
          }
        }
        
        // Draw connection
        stroke(nodeA.hue, nodeA.sat, nodeA.bri, alpha);
        vertex(nodeA.x, nodeA.y, nodeA.z);
        vertex(nodeB.x, nodeB.y, nodeB.z);
        totalConnections++;
      }
    }
  }
  endShape();
  
  // Draw nodes with organic movement
  beginShape(POINTS);
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    
    // Organic movement
    let moveX = sin(time * node.speed + node.phase) * 2;
    let moveY = cos(time * node.speed * 0.7 + node.phase) * 2;
    let moveZ = sin(time * node.speed * 0.5 + node.phase) * 1.5;
    
    // Pulse effect
    let pulse = sin(time * 0.01 + node.phase) * 0.3 + 0.7;
    node.targetSize = (node.size * pulse);
    
    // Apply ripple influence if active
    if (ripple.active) {
      const dxRipple = node.x - ripple.x;
      const dyRipple = node.y - ripple.y;
      const distToRipple = sqrt(dxRipple * dxRipple + dyRipple * dyRipple);
      
      if (distToRipple < ripple.radius && distToRipple > ripple.radius - 200) {
        const influence = map(distToRipple, ripple.radius - 200, ripple.radius, 0.5, 0);
        moveX += random(-influence, influence) * 3;
        moveY += random(-influence, influence) * 3;
      }
    }
    
    // Glow effect
    let hue = (node.hue + time * 0.2) % 360;
    fill(hue, node.sat, node.bri, 1);
    vertex(node.x + moveX, node.y + moveY, node.z + moveZ);
  }
  endShape();
  
  time++;
}

function mousePressed() {
  // Trigger ripple effect at click position
  ripple.active = true;
  ripple.x = mouseX - width/2;
  ripple.y = mouseY - height/2;
  ripple.radius = 0;
}
