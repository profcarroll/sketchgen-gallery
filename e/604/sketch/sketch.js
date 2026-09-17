let notes = [];
let staves = [];
let mic;
let audioContext;
let analyzer;
let isAudioReady = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize staves
  for (let i = 0; i < 5; i++) {
    staves.push({
      y: height * (0.2 + i * 0.15),
      speed: random(0.2, 0.8)
    });
  }
  
  // Create initial notes
  for (let i = 0; i < 50; i++) {
    notes.push(createNote());
  }
  
  // Setup audio
  mic = new p5.AudioIn();
  mic.start();
  isAudioReady = true;
}

function draw() {
  background(0, 0, 10, 0.8);
  
  // Draw staves
  drawStaves();
  
  // Update and draw notes
  updateNotes();
  
  // Audio reaction
  if (isAudioReady) {
    const vol = mic.getLevel();
    const speedFactor = map(vol, 0, 0.5, 1, 3);
    
    // Adjust note speeds based on volume
    for (let note of notes) {
      note.speed *= speedFactor;
    }
  }
}

function drawStaves() {
  noFill();
  stroke(200, 20, 80, 0.3);
  strokeWeight(1);
  
  for (let staff of staves) {
    // Draw staff lines
    for (let i = 0; i < 5; i++) {
      line(0, staff.y + i * 10, width, staff.y + i * 10);
    }
    
    // Animate staff movement
    staff.y += staff.speed;
    if (staff.y > height) staff.y = 0;
  }
}

function updateNotes() {
  // Update and draw notes
  for (let i = notes.length - 1; i >= 0; i--) {
    let note = notes[i];
    
    // Move note
    note.x += note.vx;
    note.y += note.vy;
    
    // Apply gravity
    note.vy += 0.05;
    
    // Fade out as it moves
    note.alpha -= 0.005;
    
    // Create glow effect
    const hue = (frameCount * 2 + note.id) % 360;
    fill(hue, 100, 100, note.alpha);
    noStroke();
    
    // Draw note
    ellipse(note.x, note.y, note.size, note.size);
    
    // Remove dead notes
    if (note.alpha <= 0) {
      notes.splice(i, 1);
    }
  }
  
  // Add new notes occasionally
  if (frameCount % 15 === 0 && notes.length < 80) {
    notes.push(createNote());
  }
}

function createNote() {
  return {
    x: random(width),
    y: random(height * 0.2),
    vx: random(-2, 2),
    vy: random(-3, -1),
    size: random(8, 16),
    alpha: 1,
    speed: random(0.5, 2),
    id: notes.length
  };
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
