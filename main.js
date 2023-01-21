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

/*DIBUJAR LINEA*/
let startCoords = null;
let points = "";

// get the viewbox values
let viewBox2 = floorplan.getAttribute("viewBox").split(" ");
let x = parseFloat(viewBox2[0]);
let y = parseFloat(viewBox2[1]);
let width = parseFloat(viewBox2[2]);
let height = parseFloat(viewBox2[3]);

floorplan.addEventListener("click", event => {
    if (!startCoords) {
        // calculate the point coordinates based on the viewbox
        let xCoord = event.offsetX * width / floorplan.clientWidth + x;
        let yCoord = event.offsetY * height / floorplan.clientHeight + y;
        startCoords = { x: xCoord, y: yCoord };
        points += `${xCoord},${yCoord}`;
        return;
    }

    if (startCoords.x === event.offsetX + event.target.getBoundingClientRect().x && startCoords.y === event.offsetY + event.target.getBoundingClientRect().y) {
        const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        polygon.setAttribute("points", points);
        floorplan.appendChild(polygon);
        startCoords = null;
        points = "";
        return;
    }

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("stroke", "black");
    line.setAttribute("stroke-width", "2");

    // calculate the point coordinates based on the viewbox
    let xCoord = (event.offsetX + event.target.getBoundingClientRect().x) * width / floorplan.clientWidth + x;
    let yCoord = (event.offsetY + event.target.getBoundingClientRect().y) * height / floorplan.clientHeight + y;
    line.setAttribute("x1", startCoords.x);
    line.setAttribute("y1", startCoords.y);
    line.setAttribute("x2", xCoord);
    line.setAttribute("y2", yCoord);
    floorplan.appendChild(line);

    startCoords = { x: xCoord, y: yCoord };
    points += `${xCoord},${yCoord} `;
});
