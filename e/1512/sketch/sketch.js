let cities = [];
let gradient;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Generate cities
  for (let i = 0; i < 5000; i++) {
    const lat = random(-PI/2, PI/2);
    const lon = random(TWO_PI);
    const x = cos(lat) * cos(lon);
    const y = sin(lat);
    const z = cos(lat) * sin(lon);
    cities.push({x, y, z});
  }
  
  // Create gradient texture
  gradient = createGraphics(1, 256);
  gradient.noStroke();
  for (let i = 0; i < 256; i++) {
    const inter = map(i, 0, 255, 0, 1);
    const c = lerpColor(color(0), color(255, 255, 200), inter);
    gradient.stroke(c);
    gradient.line(0, i, 1, i);
  }
}

function draw() {
  background(0);
  
  // Rotate planet
  rotateY(time * 0.0005);
  rotateX(sin(time * 0.0002) * 0.1);
  
  // Draw stars
  push();
  fill(255);
  for (let i = 0; i < 1000; i++) {
    const lat = random(-PI/2, PI/2);
    const lon = random(TWO_PI);
    const x = cos(lat) * cos(lon) * 200;
    const y = sin(lat) * 200;
    const z = cos(lat) * sin(lon) * 200;
    translate(x, y, z);
    sphere(1);
    translate(-x, -y, -z);
  }
  pop();
  
  // Draw planet
  push();
  noStroke();
  fill(30, 40, 60);
  sphere(100, 32, 32);
  pop();
  
  // Batch draw city lights
  beginShape(POINTS);
  for (let i = 0; i < cities.length; i++) {
    const c = cities[i];
    
    // Position city light
    const x = c.x * 100;
    const y = c.y * 100;
    const z = c.z * 100;
    
    // Calculate distance from sweep line (simplified)
    const angle = atan2(z, x);
    const sweepAngle = time * 0.002;
    const diff = abs(angle - sweepAngle);
    const dist = map(cos(diff), -1, 1, 0, 1);
    
    // Only show if within sweep area
    if (dist > 0.5) {
      // City light color based on distance from center
      const brightness = map(dist, 0.5, 1, 0.2, 1);
      
      // Use gradient to determine color
      const gY = map(dist, 0, 1, 0, 255);
      const cColor = gradient.get(0, gY);
      fill(cColor);
      
      vertex(x, y, z);
    }
  }
  endShape();
  
  time++;
}
