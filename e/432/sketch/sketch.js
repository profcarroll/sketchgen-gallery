let icons = [];
let windows = [];
let draggedIcon = null;
let dragOffset = { x: 0, y: 0 };
let windowCounter = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create desktop icons with positions and states
  icons.push({
    x: 100,
    y: 100,
    width: 40,
    height: 40,
    iconType: 'folder',
    open: false,
    windowId: null
  });
  
  icons.push({
    x: 200,
    y: 150,
    width: 40,
    height: 40,
    iconType: 'document',
    open: false,
    windowId: null
  });
  
  icons.push({
    x: 300,
    y: 100,
    width: 40,
    height: 40,
    iconType: 'settings',
    open: false,
    windowId: null
  });
  
  // Create windows with initial positions and states
  windows.push({
    id: 0,
    x: 200,
    y: 200,
    width: 300,
    height: 200,
    content: 'Folder Contents',
    visible: false
  });
  
  windows.push({
    id: 1,
    x: 400,
    y: 150,
    width: 250,
    height: 180,
    content: 'Document Editor',
    visible: false
  });
  
  windows.push({
    id: 2,
    x: 300,
    y: 250,
    width: 200,
    height: 150,
    content: 'System Settings',
    visible: false
  });
}

function draw() {
  background(50);
  
  // Draw desktop background
  fill(40);
  rect(0, 0, width, height);
  
  // Draw desktop elements
  drawDesktopElements();
  
  // Draw windows (if visible)
  for (let window of windows) {
    if (window.visible) {
      drawWindow(window);
    }
  }
  
  // Draw icons
  for (let icon of icons) {
    drawIcon(icon);
  }
}

function drawDesktopElements() {
  // Draw desktop grid pattern
  stroke(70);
  strokeWeight(1);
  for (let x = 0; x < width; x += 20) {
    line(x, 0, x, height);
  }
  for (let y = 0; y < height; y += 20) {
    line(0, y, width, y);
  }
  
  // Draw desktop title bar
  fill(30);
  rect(0, 0, width, 30);
  fill(200);
  textSize(14);
  textAlign(LEFT, CENTER);
  text('Retro Desktop Environment', 10, 15);
}

function drawWindow(window) {
  // Draw window frame
  fill(60);
  stroke(80);
  rect(window.x - 5, window.y - 25, window.width + 10, window.height + 30);
  
  // Draw window content
  fill(70);
  noStroke();
  rect(window.x, window.y, window.width, window.height);
  
  // Draw window title bar
  fill(50);
  rect(window.x, window.y - 25, window.width, 25);
  
  // Draw window title text
  fill(220);
  textSize(12);
  textAlign(LEFT, CENTER);
  text(window.content, window.x + 10, window.y - 10);
  
  // Draw window close button
  fill(180, 60, 60);
  rect(window.x + window.width - 25, window.y - 23, 15, 15);
  fill(255);
  textSize(10);
  textAlign(CENTER, CENTER);
  text('×', window.x + window.width - 17.5, window.y - 15);
}

function drawIcon(icon) {
  // Draw icon background
  if (icon.open) {
    fill(80);
  } else {
    fill(60);
  }
  stroke(100);
  rect(icon.x, icon.y, icon.width, icon.height, 5);
  
  // Draw icon content based on type
  fill(200);
  textAlign(CENTER, CENTER);
  
  switch (icon.iconType) {
    case 'folder':
      textSize(24);
      text('📁', icon.x + icon.width/2, icon.y + icon.height/2);
      break;
    case 'document':
      textSize(20);
      text('📄', icon.x + icon.width/2, icon.y + icon.height/2);
      break;
    case 'settings':
      textSize(20);
      text('⚙️', icon.x + icon.width/2, icon.y + icon.height/2);
      break;
  }
}

function mousePressed() {
  // Check if clicked on a window close button
  for (let window of windows) {
    if (window.visible) {
      if (mouseX > window.x + window.width - 25 && 
          mouseX < window.x + window.width &&
          mouseY > window.y - 23 && 
          mouseY < window.y - 8) {
        // Close the window
        window.visible = false;
        return;
      }
    }
  }
  
  // Check if clicked on an icon
  for (let i = icons.length - 1; i >= 0; i--) {
    let icon = icons[i];
    if (mouseX > icon.x && mouseX < icon.x + icon.width &&
        mouseY > icon.y && mouseY < icon.y + icon.height) {
      
      // Toggle window visibility or drag
      if (mouseButton === LEFT) {
        if (icon.open && icon.windowId !== null) {
          // Close the associated window
          for (let win of windows) {
            if (win.id === icon.windowId) {
              win.visible = false;
              break;
            }
          }
          icon.open = false;
        } else {
          // Open the associated window
          if (icon.windowId !== null) {
            for (let win of windows) {
              if (win.id === icon.windowId) {
                win.visible = true;
                break;
              }
            }
            icon.open = true;
          } else {
            // Create new window for this icon
            let windowId = windowCounter++;
            icon.windowId = windowId;
            
            // Find the next available window
            for (let win of windows) {
              if (win.id === windowId) {
                win.visible = true;
                break;
              }
            }
            icon.open = true;
          }
        }
        return;
      } else if (mouseButton === LEFT) {
        // Start dragging
        draggedIcon = icon;
        dragOffset.x = icon.x - mouseX;
        dragOffset.y = icon.y - mouseY;
        return;
      }
    }
  }
}

function mouseDragged() {
  if (draggedIcon !== null) {
    draggedIcon.x = mouseX + dragOffset.x;
    draggedIcon.y = mouseY + dragOffset.y;
    
    // Keep icons within canvas bounds
    draggedIcon.x = constrain(draggedIcon.x, 0, width - draggedIcon.width);
    draggedIcon.y = constrain(draggedIcon.y, 0, height - draggedIcon.height);
  }
}

function mouseReleased() {
  draggedIcon = null;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
