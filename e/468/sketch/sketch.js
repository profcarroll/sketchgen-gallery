let fragments = [];
let connections = [];
let isShattering = false;
let shatterTime = 0;
let reorganizeTime = 0;

function setup() {
  createCanvas(600, 600);
  noStroke();
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create initial structure
  for (let i = 0; i < 200; i++) {
    fragments.push({
      x: random(width),
      y: random(height),
      vx: 0,
      vy: 0,
      size: random(5, 15),
      hue: random(360),
      sat: random(40, 80),
      bri: random(60, 90),
      alpha: random(0.7, 1)
    });
  }
  
  // Create connections
  for (let i = 0; i < fragments.length; i++) {
    for (let j = i + 1; j < fragments.length; j++) {
      let d = dist(fragments[i].x, fragments[i].y, fragments[j].x, fragments[j].y);
      if (d < 80) {
        connections.push({
          a: i,
          b: j,
          length: d
        });
      }
    }
  }
}

function draw() {
  background(220, 10, 5);
  
  if (isShattering) {
    shatterTime++;
    if (shatterTime > 30) {
      reorganizeTime++;
      
      // Reorganize fragments
      for (let i = 0; i < fragments.length; i++) {
        let f = fragments[i];
        let targetX = width/2;
        let targetY = height/2;
        
        let dx = targetX - f.x;
        let dy = targetY - f.y;
        
        f.vx += dx * 0.005;
        f.vy += dy * 0.005;
        
        // Apply velocity
        f.x += f.vx;
        f.y += f.vy;
        
        // Damping
        f.vx *= 0.9;
        f.vy *= 0.9;
      }
      
      // Reconnect
      if (reorganizeTime > 60) {
        isShattering = false;
        shatterTime = 0;
        reorganizeTime = 0;
        
        // Reset connections
        connections = [];
        for (let i = 0; i < fragments.length; i++) {
          for (let j = i + 1; j < fragments.length; j++) {
            let d = dist(fragments[i].x, fragments[i].y, fragments[j].x, fragments[j].y);
            if (d < 80) {
              connections.push({
                a: i,
                b: j,
                length: d
              });
            }
          }
        }
      }
    } else {
      // Shatter phase
      for (let i = 0; i < fragments.length; i++) {
        let f = fragments[i];
        
        // Random velocity
        f.vx += random(-2, 2);
        f.vy += random(-2, 2);
        
        // Apply velocity
        f.x += f.vx;
        f.y += f.vy;
        
        // Damping
        f.vx *= 0.95;
        f.vy *= 0.95;
      }
    }
  } else {
    // Normal phase - maintain structure with slight motion
    for (let i = 0; i < fragments.length; i++) {
      let f = fragments[i];
      
      // Gentle oscillation
      f.x += sin(frameCount * 0.01 + i) * 0.2;
      f.y += cos(frameCount * 0.01 + i) * 0.2;
    }
    
    // Reconnect if needed
    if (frameCount % 30 === 0) {
      connections = [];
      for (let i = 0; i < fragments.length; i++) {
        for (let j = i + 1; j < fragments.length; j++) {
          let d = dist(fragments[i].x, fragments[i].y, fragments[j].x, fragments[j].y);
          if (d < 80) {
            connections.push({
              a: i,
              b: j,
              length: d
            });
          }
        }
      }
    }
  }
  
  // Draw connections
  stroke(220, 30, 90, 0.3);
  strokeWeight(1);
  noFill();
  
  for (let c of connections) {
    let a = fragments[c.a];
    let b = fragments[c.b];
    line(a.x, a.y, b.x, b.y);
  }
  
  // Draw fragments
  for (let f of fragments) {
    fill(f.hue, f.sat, f.bri, f.alpha);
    noStroke();
    
    if (isShattering && shatterTime > 30) {
      // Glowing fragments during reorganization
      fill(f.hue, f.sat, 100, f.alpha * 0.8);
      ellipse(f.x, f.y, f.size * 2);
    } else {
      ellipse(f.x, f.y, f.size);
    }
  }
}

function mousePressed() {
  if (!isShattering) {
    isShattering = true;
    shatterTime = 0;
    reorganizeTime = 0;
    
    // Add initial velocity to fragments
    for (let i = 0; i < fragments.length; i++) {
      let f = fragments[i];
      let angle = random(TWO_PI);
      let speed = random(2, 8);
      
      f.vx += cos(angle) * speed;
      f.vy += sin(angle) * speed;
    }
  }
}
