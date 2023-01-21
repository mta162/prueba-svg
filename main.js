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
let startCoords; // variable global para almacenar las coordenadas iniciales
let points = ""; // variable global para almacenar las coordenadas de los puntos del polígono

// evento click sobre el canvas
floorplan.addEventListener("click", function (event) {
    // si no existen coordenadas iniciales, las guardamos
    if (!startCoords) {
        startCoords = { x: event.offsetX, y: event.offsetY };
        points += `${event.offsetX},${event.offsetY} `;
        return;
    }

    // si el último punto es igual al primero
    if (startCoords.x === event.offsetX && startCoords.y === event.offsetY) {
        // creamos un elemento polígono
        const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        // asignamos las coordenadas de los puntos del polígono
        polygon.setAttribute("points", points);
        // agregamos el elemento polígono al canvas
        floorplan.appendChild(polygon);
        startCoords = null;
        points = "";
        return;
    }

    //creamos un elemento line
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    // agregamos el atributo stroke para dar color a las lineas
    line.setAttribute("stroke", "black");
    // agregamos el atributo stroke-width para dar grosor a las lineas
    line.setAttribute("stroke-width", "2");

    // asignamos las coordenadas iniciales y finales utilizando offsetX y offsetY
    line.setAttribute("x1", startCoords.x);
    line.setAttribute("y1", startCoords.y);
    line.setAttribute("x2", event.offsetX);
    line.setAttribute("y2", event.offsetY);

    // agregamos el elemento line al canvas
    floorplan.appendChild(line);

    // actualizamos las coordenadas iniciales
    startCoords = { x: event.offsetX, y: event.offsetY };
    points += `${event.offsetX},${event.offsetY}`;
});
