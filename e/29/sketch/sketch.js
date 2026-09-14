let objects = [];

function setup() {
  createCanvas(800, 600, WEBGL);
  noStroke();
  
  // Create a table
  objects.push({
    type: 'table',
    x: 0,
    y: 200,
    z: 0,
    width: 600,
    height: 20,
    depth: 400,
    color: [100, 80, 60]
  });
  
  // Create a bowl
  objects.push({
    type: 'bowl',
    x: -150,
    y: 170,
    z: 50,
    radius: 60,
    color: [220, 220, 220]
  });
  
  // Create a book
  objects.push({
    type: 'book',
    x: 100,
    y: 180,
    z: -50,
    width: 80,
    height: 100,
    depth: 20,
    color: [180, 140, 100]
  });
  
  // Create a glass
  objects.push({
    type: 'glass',
    x: 0,
    y: 160,
    z: 0,
    radius: 30,
    height: 120,
    color: [200, 240, 255]
  });
  
  // Create a fruit
  objects.push({
    type: 'fruit',
    x: 200,
    y: 180,
    z: 50,
    radius: 30,
    color: [255, 100, 50]
  });
  
  // Create a candle
  objects.push({
    type: 'candle',
    x: -200,
    y: 170,
    z: 0,
    width: 10,
    height: 80,
    color: [255, 255, 200]
  });
}

function draw() {
  background(30);
  
  // Lighting
  pointLight(255, 255, 255, -300, -400, 500);
  pointLight(255, 255, 255, 300, 400, -500);
  
  // Ambient light
  ambientLight(50);
  
  // Rotate the whole scene slowly for better viewing
  rotateY(frameCount * 0.005);
  
  // Draw objects
  for (let obj of objects) {
    push();
    
    translate(obj.x, obj.y, obj.z);
    
    if (obj.type === 'table') {
      fill(obj.color);
      box(obj.width, obj.height, obj.depth);
    } else if (obj.type === 'bowl') {
      fill(obj.color);
      noStroke();
      sphere(obj.radius);
    } else if (obj.type === 'book') {
      fill(obj.color);
      box(obj.width, obj.height, obj.depth);
    } else if (obj.type === 'glass') {
      fill(obj.color);
      noStroke();
      cylinder(obj.radius, obj.height, 16, 1, true);
      
      // Add a highlight
      fill(255, 255, 255, 100);
      sphere(obj.radius * 0.3);
    } else if (obj.type === 'fruit') {
      fill(obj.color);
      noStroke();
      sphere(obj.radius);
      
      // Add a stem
      fill(100, 80, 40);
      push();
      translate(0, -obj.radius * 0.7, 0);
      rotateX(PI / 2);
      cylinder(3, 15);
      pop();
    } else if (obj.type === 'candle') {
      fill(obj.color);
      box(obj.width, obj.height, obj.width);
      
      // Add a flame
      fill(255, 150, 0);
      noStroke();
      sphere(8);
    }
    
    pop();
  }
}
