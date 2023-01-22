const floorplan = document.getElementById("floorplan");

let startCoords = null;
let points = [];
let tempLine = null;

// get the transformation matrix of the SVG element
const matrix = floorplan.getScreenCTM().inverse();

floorplan.addEventListener("click", event => {
    // get the coordinates of the mouse pointer in the SVG element's coordinate system
    let svgCoords = floorplan.createSVGPoint();
    svgCoords.x = event.clientX;
    svgCoords.y = event.clientY;
    svgCoords = svgCoords.matrixTransform(matrix);

    if (!startCoords) {
        // set the starting coordinates
        startCoords = { x: svgCoords.x, y: svgCoords.y };
        // add the point to the points string
        points.push(`${svgCoords.x},${svgCoords.y}`);
        // create the temporary line to preview the line while drawing
        tempLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        tempLine.setAttribute("x1", svgCoords.x);
        tempLine.setAttribute("y1", svgCoords.y);
        tempLine.setAttribute("x2", svgCoords.x);
        tempLine.setAttribute("y2", svgCoords.y);
        tempLine.setAttribute("stroke", "black");
        tempLine.setAttribute("stroke-width", "2");
        tempLine.setAttribute("stroke-dasharray", "5,5");
        floorplan.appendChild(tempLine);
    } else {
        // create the final line and add it to the SVG
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", startCoords.x);
        line.setAttribute("y1", startCoords.y);
        line.setAttribute("x2", svgCoords.x);
        line.setAttribute("y2", svgCoords.y);
        line.setAttribute("stroke", "black");
        line.setAttribute("stroke-width", "2");
        floorplan.appendChild(line);
        // add the point to the points string
        points.push(`${svgCoords.x},${svgCoords.y}`);
        // update the starting coordinates
        startCoords = { x: svgCoords.x, y: svgCoords.y };
        // remove the temporary line
        if (tempLine) {
            tempLine.remove();
            tempLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
            tempLine.setAttribute("x1", svgCoords.x);
            tempLine.setAttribute("y1", svgCoords.y);
            tempLine.setAttribute("x2", svgCoords.x);
            tempLine.setAttribute("y2", svgCoords.y);
            tempLine.setAttribute("stroke", "black");
            tempLine.setAttribute("stroke-width", "2");
            tempLine.setAttribute("stroke-dasharray", "5,5");
            floorplan.appendChild(tempLine);
        }
    }
});

floorplan.addEventListener("mousemove", event => {
    if (tempLine) {
        // get the coordinates of the mouse pointer in the SVG element's coordinate system
        let svgCoords = floorplan.createSVGPoint();
        svgCoords.x = event.clientX;
        svgCoords.y = event.clientY;
        svgCoords = svgCoords.matrixTransform(matrix);
        // update the ending coordinates of the temporary line
        tempLine.setAttribute("x2", svgCoords.x);
        tempLine.setAttribute("y2", svgCoords.y);
    }
});

floorplan.addEventListener("dblclick", event => {
    // get the coordinates of the mouse pointer in the SVG element's coordinate system
    let svgCoords = floorplan.createSVGPoint();
    svgCoords.x = event.clientX;
    svgCoords.y = event.clientY;
    svgCoords = svgCoords.matrixTransform(matrix);
    // check if the final point is close to the starting point to close the shape
    const tolerance = 10;
    if (Math.abs(svgCoords.x - startCoords.x) < tolerance && Math.abs(svgCoords.y - startCoords.y) < tolerance) {
        // create the final polygon and add it to the SVG
        const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        polygon.setAttribute("points", points.join(" "));
        polygon.setAttribute("stroke", "black");
        polygon.setAttribute("stroke-width", "2");
        polygon.setAttribute("fill", "none");
        floorplan.appendChild(polygon);
    }
    // reset the starting coordinates and points string
    startCoords = null;
    points = [];
    // remove the temporary line
    if (tempLine) {
        tempLine.remove();
        tempLine = null;
    }
});
