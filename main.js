const WALLS = [];
const HISTORY = [];

function init() {
    //Solo se utiliza para inicializar el plano
}

const floorplan = document.getElementById("floorplan");

/*MOVERSE POR EL PLANO - INICIO*/
const offset = {
    x: 0,
    y: 0
}
const viewBox = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
};

floorplan.addEventListener("mousedown", (event) => {
    offset.x = event.clientX;
    offset.y = event.clientY;

    viewBox.x = floorplan.viewBox.baseVal.x;
    viewBox.y = floorplan.viewBox.baseVal.y;
    viewBox.width = floorplan.viewBox.baseVal.width;
    viewBox.height = floorplan.viewBox.baseVal.height;

    document.addEventListener("mousemove", moveFloorplan);
    document.addEventListener("mouseup", stopMovingFloorplan);
});

function moveFloorplan(event) {
    floorplan.viewBox.baseVal.x = viewBox.x - (event.clientX - offset.x);
    floorplan.viewBox.baseVal.y = viewBox.y - (event.clientY - offset.y);
}

function stopMovingFloorplan() {
    document.removeEventListener("mousemove", moveFloorplan);
    document.removeEventListener("mouseup", stopMovingFloorplan);
}
/*MOVERSE POR EL PLANO - FIN*/

/*MIRAR LA FUNCION ZOOM_MAKER DEL ARCHIVO FUNC.JS*/
/*HACER ZOOM IN Y ZOOM OUT EN EL PLANO - INICIO*/
let zoom = 1;

let zoomInBtn = document.getElementById("zoom-in");
let zoomOutBtn = document.getElementById("zoom-out");

zoomInBtn.addEventListener("click", function () {
    zoom += 0.1;
    floorplan.viewBox.baseVal.width = floorplan.viewBox.baseVal.width * 0.9;
    floorplan.viewBox.baseVal.height = floorplan.viewBox.baseVal.height * 0.9;
});

zoomOutBtn.addEventListener("click", function () {
    zoom -= 0.1;
    floorplan.viewBox.baseVal.width = floorplan.viewBox.baseVal.width * 1.1;
    floorplan.viewBox.baseVal.height = floorplan.viewBox.baseVal.height * 1.1;
});

/*HACER ZOOM IN Y ZOOM OUT EN EL PLANO - FIN*/

let startCoords = null;
let nextCoord = null;
let points = [];
let tempLine = null;

// get the transformation matrix of the SVG element

let matrix = null
floorplan.addEventListener("click", event => {
    matrix = document.getElementById("floorplan").getScreenCTM().inverse();
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
        line.setAttribute("x2", nextCoord.x);
        line.setAttribute("y2", nextCoord.y);
        line.setAttribute("stroke", "black");
        line.setAttribute("stroke-width", "2");
        floorplan.appendChild(line);
        // add the point to the points string
        points.push(`${nextCoord.x},${nextCoord.y}`);
        // update the starting coordinates
        startCoords = { x: nextCoord.x, y: nextCoord.y };
        // remove the temporary line
        if (tempLine) {
            tempLine.remove();
            tempLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
            tempLine.setAttribute("x1", nextCoord.x);
            tempLine.setAttribute("y1", nextCoord.y);
            tempLine.setAttribute("x2", nextCoord.x);
            tempLine.setAttribute("y2", nextCoord.y);
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

        let angle = Math.atan2(svgCoords.y - startCoords.y, svgCoords.x - startCoords.x);
        angle = angle * (180 / Math.PI);
        let x2 = svgCoords.x, y2 = svgCoords.y;

        const tolerance = 10;
        console.log(angle, Math.abs(angle % 90)) //
        if (Math.abs(angle % 90) < tolerance || Math.abs(angle % 90) >= 90 - tolerance) {
            angle = Math.round(angle / 90) * 90;
            // update the ending coordinates of the temporary line accordingly
            if (angle === 0) {
                x2 = svgCoords.x;
                y2 = startCoords.y;
            } else if (angle === 90) {
                x2 = startCoords.x;
                y2 = svgCoords.y;
            } else if (angle === 180 || angle === -180) {
                x2 = svgCoords.x;
                y2 = startCoords.y;
            } else if (angle === -90) {
                x2 = startCoords.x;
                y2 = svgCoords.y;
            }
            tempLine.setAttribute("stroke", "orange");
        } else {
            tempLine.setAttribute("stroke", "black");
        }

        // update the ending coordinates of the temporary line
        nextCoord = { x: x2, y: y2 };
        tempLine.setAttribute("x2", x2);
        tempLine.setAttribute("y2", y2);
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

