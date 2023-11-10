const canvas_h = document.querySelector('#canvas_h');
const ctx_h = canvas_h.getContext('2d');

var clr_h = document.getElementById('color_h')






// for intro motion
let mouseMoved = false;

const pointer = {
    x: .5 * window.innerWidth,
    y: .5 * window.innerHeight,
}
const params = {
    pointsNumber: 40,
    widthFactor: .3,
    mouseThreshold: .6,
    spring: .4,
    friction: .5
};

const trail = new Array(params.pointsNumber);
for (let i = 0; i < params.pointsNumber; i++) {
    trail[i] = {
        x: pointer.x,
        y: pointer.y,
        dx: 0,
        dy: 0,
    }
}

canvas_h.addEventListener("pointerdown", e => {
    updateMousePosition(e.pageX, e.pageY);
});
canvas_h.addEventListener("pointermove", e => {
    mouseMoved = true;
    updateMousePosition(e.pageX, e.pageY);
});

function updateMousePosition(eX, eY) {
    pointer.x = eX;
    pointer.y = eY;
}

setupCanvas();
update(0);
canvas_h.addEventListener("resize", setupCanvas);


function update(t) {

    // for intro motion
    if (!mouseMoved) {
        pointer.x = (.5 + .3 * Math.cos(.002 * t) * (Math.sin(.005 * t))) * window.innerWidth;
        pointer.y = (.5 + .2 * (Math.cos(.005 * t)) + .1 * Math.cos(.01 * t)) * window.innerHeight;
    }

    ctx_h.clearRect(0, 0, canvas_h.width, canvas_h.height);
    trail.forEach((p, pIdx) => {
        const prev = pIdx === 0 ? pointer : trail[pIdx - 1];
        const spring = pIdx === 0 ? .4 * params.spring : params.spring;
        p.dx += (prev.x - p.x) * spring;
        p.dy += (prev.y - p.y) * spring;
        p.dx *= params.friction;
        p.dy *= params.friction;
        p.x += p.dx;
        p.y += p.dy;
    });

    ctx_h.beginPath();
    ctx_h.moveTo(trail[0].x, trail[0].y);

    for (let i = 1; i < trail.length - 1; i++) {
        const xc = .5 * (trail[i].x + trail[i + 1].x);
        const yc = .5 * (trail[i].y + trail[i + 1].y);
        ctx_h.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
        ctx_h.lineWidth = params.widthFactor * (params.pointsNumber - i);
        ctx_h.strokeStyle = clr_h.value;
        ctx_h.lineCap = 'round';
        ctx_h.stroke();
    }
    ctx_h.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y);
    ctx_h.stroke();
    
    window.requestAnimationFrame(update);
}

function setupCanvas() {
    canvas_h.width = window.innerWidth;
    canvas_h.height = window.innerHeight;
}

clr_h.addEventListener('input', () => ctx_h.strokeStyle = clr_h.value)