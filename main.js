// Create canvas and set up variables


// Create a canvas element and set its dimensions
const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;




// Get the canvas context for drawing
const ctx = canvas.getContext('2d');




// Variables to store the current drawing state
let isDrawing = false;
let currentLine = null;
let currentAnchorPoint = null;
let counter = 0;

// Variables to store existing lines and anchor points
const lines = [];
const anchorPoints = [];

const LINE_WIDTH = 2;
const ANCHOR_POINT_RADIUS = 5;
const ANCHOR_POINT_SNAP_DISTANCE = 10;

// Add event listeners to the canvas
canvas.addEventListener('mousedown', onMouseDown, false);
canvas.addEventListener('mousemove', onMouseMove, false);
canvas.addEventListener('mouseup', onMouseUp, false);




// FUNCTIONS ****************************************************************



// FUNCTION TO - See if a line is clicked




// FUNCTION TO - Find the closest anchor point within a certain distance and return
function findClosestAnchorPoint(x, y, maxDistance) {
    let closestPoint = null;
    let minDistance = maxDistance;
  
    anchorPoints.forEach(point => {
      const dx = x - point.x;
      const dy = y - point.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
  
      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = point;
      }
    });
  
    return closestPoint;
  }


// FUNCTION TO - Calculate the length of the line, write the text and offset from line
function drawLengthText(x1, y1, x2, y2, length) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const centerX = (x1 + x2) / 2;
  const centerY = (y1 + y2) / 2;

  // Calculate the slope of the line
  const slope = dy / dx;

  // Calculate the offset for the text based on the line's slope and the cursor position
  const offsetX = slope >= 0 ? -15 : 15;
  const offsetY = slope >= 0 ? -15 : 15;

  // Draw the length text with the offset
  ctx.font = '16px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText((length / 10).toFixed(2) + 'm', centerX + offsetX, centerY + offsetY);
}


// FUNCTION TO - Draw all existing lines and anchor points (THIS HAPPENS EVERYTIME A LINE IS DRAWN)
function drawExistingLinesAndAnchorPoints() {
    lines.forEach(line => {
      ctx.beginPath();
      ctx.moveTo(line.startX, line.startY);
      ctx.lineTo(line.endX, line.endY);
      setLineStyleAndColor(line.height, line.material); // Set the line style and color
      ctx.lineWidth = LINE_WIDTH;
      ctx.stroke();
      drawLengthText(line.startX, line.startY, line.endX, line.endY, line.length);
    });
  
    anchorPoints.forEach(point => {
      const RADIUS = 5;
      const SIDE_LENGTH = 10;
      setFillColor(point.height);
  
      if (point.type === 'end post') {
        // Draw a circle for end posts
        ctx.beginPath();
        ctx.arc(point.x, point.y, RADIUS, 0, 2 * Math.PI);
        ctx.fill();
      } else if (point.type === 'corner post') {
        // Draw a square for corner posts
        ctx.beginPath();
        ctx.rect(point.x - SIDE_LENGTH / 2, point.y - SIDE_LENGTH / 2, SIDE_LENGTH, SIDE_LENGTH);
        ctx.fill();
      }
    });
  }


// FUNCTION TO - Set the FILL COLOUR to be used by the ANCHOR POINTS. Colours match the lines.
//               CAN THIS BE COMBINED WITH THE LINE COLOURS TO SHORTEN THE CODE???

function setFillColor(height) {
  // Convert height to a string
  const heightStr = height.toFixed(1);
  // Set line color based on height
  switch (heightStr) {
    case '1.2':
      ctx.fillStyle = 'red';
      break;
    case '2.0':
      ctx.fillStyle = 'green';
      break;
    case '2.4':
      ctx.fillStyle = 'orange';
      break;
    case '3.0':
      ctx.fillStyle = 'blue';
      break;
    case '3.6':
      ctx.fillStyle = 'pink';
      break;
    case '4.0':
      ctx.fillStyle = 'purple';
      break;
    case '4.5':
      ctx.fillStyle = 'yellow';
      break;
    case '5.0':
      ctx.fillStyle = 'brown';
      break;
    case '6.0':
      ctx.fillStyle = 'grey';
      break;  
    default:
      ctx.fillStyle = 'black';
  }
}


// FUNCTION TO - Set the LINE COLOUR and style depending on material and height.
function setLineStyleAndColor(height, material) {
  // Convert height to a string
  const heightStr = height.toFixed(1);
  // Set line color based on height
  switch (heightStr) {
    case '1.2':
      ctx.strokeStyle = 'red';
      break;
    case '2.0':
      ctx.strokeStyle = 'green';
      break;
    case '2.4':
      ctx.strokeStyle = 'orange';
      break;
    case '3.0':
      ctx.strokeStyle = 'blue';
      break;
    case '3.6':
      ctx.strokeStyle = 'pink';
      break;
    case '4.0':
      ctx.strokeStyle = 'purple';
      break;
    case '4.5':
      ctx.strokeStyle = 'yellow';
      break;
    case '5.0':
      ctx.strokeStyle = 'brown';
      break;
    case '6.0':
      ctx.strokeStyle = 'grey';
      break;  
    default:
      ctx.strokeStyle = 'black';
  }

  // Set line style based on material
  if (material === 'Twin Bar') {
    ctx.setLineDash([]); // Solid line for Twin Bar
  } else if (material === 'Roll Form') {
    ctx.setLineDash([5, 5]); // Dashed line for Roll Form
  }
}


// FUNCTION TO - Snap line to x and y axis

function snapToAxis(x1, y1, x2, y2) {
  let snappedX = x2;
  let snappedY = y2;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  const snapThreshold = 5; // Degrees within which the line should snap

  if (Math.abs(angle) <= snapThreshold || Math.abs(angle - 180) <= snapThreshold || Math.abs(angle + 180) <= snapThreshold) {
    // Snap to horizontal
    snappedY = y1;
  } else if (Math.abs(angle - 90) <= snapThreshold || Math.abs(angle + 90) <= snapThreshold) {
    // Snap to vertical
    snappedX = x1;
  }

  return { x: snappedX, y: snappedY };
}


// FUNCTION TO - Get the relative position of the canvas to account for scrolling
function getRelativePosition(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.pageX - rect.left - window.scrollX;
  const y = event.pageY - rect.top - window.scrollY;
  return { x, y };
}




// FUNCTIONS FOR MOUSE OPERATIONS *******************************************


// FUNCTION FOR -  MOUSE DOWN event
function onMouseDown(event) {
  
  const { x, y } = getRelativePosition(event);
  drawExistingLinesAndAnchorPoints();

  const existingAnchorPoint = findClosestAnchorPoint(x, y, ANCHOR_POINT_SNAP_DISTANCE);
  if (existingAnchorPoint) {
    currentAnchorPoint = existingAnchorPoint;
  } else {
    currentAnchorPoint = new AnchorPoint(x, y);
  }

  isDrawing = true;
}


// FUNCTION FOR - MOUSE MOVE event
function onMouseMove(event) {
  if (event.buttons !== 1) return; // Ensure the left mouse button is pressed
  event.preventDefault();

  if (!isDrawing) return;

  const { x, y } = getRelativePosition(event);

  // Check if the cursor is close to an existing anchor point
  const existingAnchorPoint = findClosestAnchorPoint(x, y, ANCHOR_POINT_SNAP_DISTANCE);

  let snappedX = x;
  let snappedY = y;

  if (existingAnchorPoint) {
    // If close to an existing anchor point, use its position
    snappedX = existingAnchorPoint.x;
    snappedY = existingAnchorPoint.y;
  } else {
    // If not close to an existing anchor point, snap to the axis
    const snappedPosition = snapToAxis(currentAnchorPoint.x, currentAnchorPoint.y, x, y);
    snappedX = snappedPosition.x;
    snappedY = snappedPosition.y;
  }

  // Clear the canvas and redraw all lines and anchor points
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawExistingLinesAndAnchorPoints();

  // Draw the current line
  const currentHeight = parseFloat(document.getElementById('height').value);
  const currentMaterial = document.getElementById('material').value;
  setLineStyleAndColor(currentHeight, currentMaterial); // Set the current line style and color
  ctx.beginPath();
  ctx.moveTo(currentAnchorPoint.x, currentAnchorPoint.y);
  ctx.lineTo(snappedX, snappedY);
  ctx.lineWidth = LINE_WIDTH;
  ctx.stroke();

  // Draw the length text for the current line
  const currentLineLength = currentAnchorPoint.distanceTo(snappedX, snappedY);
  drawLengthText(currentAnchorPoint.x, currentAnchorPoint.y, snappedX, snappedY, currentLineLength);
}


canvas.addEventListener('mousemove', onMouseMove, false);


// FUNCTION FOR - MOUSE UP event
function onMouseUp(event) {

  if (!isDrawing) return;

  const { x, y } = getRelativePosition(event);

  const existingAnchorPoint = findClosestAnchorPoint(x, y, ANCHOR_POINT_SNAP_DISTANCE);

  // Call snapToAxis to get the snapped position
  const snappedPosition = snapToAxis(currentAnchorPoint.x, currentAnchorPoint.y, x, y);

  const endAnchorPoint = existingAnchorPoint || new AnchorPoint(snappedPosition.x, snappedPosition.y);

  // Create a new line and connect it to the anchor points
  const material = document.getElementById('material').value;
  const height = parseFloat(document.getElementById('height').value);
  const newLine = new Line(material, height, currentAnchorPoint.x, currentAnchorPoint.y, endAnchorPoint.x, endAnchorPoint.y);
  currentAnchorPoint.addConnectedLine(newLine);
  endAnchorPoint.addConnectedLine(newLine);

  lines.push(newLine);
  if (!existingAnchorPoint) {
    anchorPoints.push(currentAnchorPoint);
  }
  if (!existingAnchorPoint || existingAnchorPoint !== endAnchorPoint) {
    anchorPoints.push(endAnchorPoint);
  }

  if (!existingAnchorPoint) {
    anchorPoints.push(endAnchorPoint);
  }

  // Always add the starting anchor point to the array
  anchorPoints.push(currentAnchorPoint);

  drawExistingLinesAndAnchorPoints();

  updateTables();

  isDrawing = false;
  currentLine = null;
  currentAnchorPoint = null;
}





// FUNCTIONS FOR OUTPUT DATA FROM DRAWING ************************************


// FUNCTION to update the table with line and anchor point information
function updateTables() {
  const linesTableBody = document.getElementById('linesTableBody');
  const anchorPointsTableBody = document.getElementById('anchorPointsTableBody');

  // Clear existing rows
  linesTableBody.innerHTML = '';
  anchorPointsTableBody.innerHTML = '';

  // Populate the lines table
  lines.forEach((line, index) => {
    const row = linesTableBody.insertRow();
    row.insertCell().innerText = index + 1;
    row.insertCell().innerText = line.material;
    row.insertCell().innerText = line.height;
    row.insertCell().innerText = (line.length / 10).toFixed(2) + 'm';
  });

  // Populate the anchor points table
  const uniqueAnchorPoints = [...new Set(anchorPoints)];

  uniqueAnchorPoints.forEach((point, index) => {
    const row = anchorPointsTableBody.insertRow();

    const numberCell = row.insertCell(0);
    const typeCell = row.insertCell(1);
    const heightCell = row.insertCell(2);
    const materialCell = row.insertCell(3);

    numberCell.textContent = index + 1;
    typeCell.textContent = point.type;
    heightCell.textContent = point.height + " m";
    materialCell.textContent = point.material;
  });
}
