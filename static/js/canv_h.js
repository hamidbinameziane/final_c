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
    pointsNumber: 15,
    widthFactor: 1,
    spring: .3,
    friction: .55
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
canvas_h.addEventListener("pointermove", e => {
    mouseMoved = true;
    updateMousePosition(e.offsetX, e.offsetY)
});

function updateMousePosition(eX, eY) {
    pointer.x = eX;
    pointer.y = eY;
}

setupCanvas();
update(0);
canvas_h.addEventListener("resize", setupCanvas);
canvas_h.addEventListener("pointerout", () => mouseMoved = false);


function update(t) {

    // for intro motion
    if (!mouseMoved) {

            pointer.x = .8 * (.6 + .5 * Math.sin(t / 900) * Math.sin(t / 9000)) * window.innerWidth;
            pointer.y = .8 * (.6 + .25 * Math.sin(t / 100) * Math.cos(t / 1000)) * window.innerHeight;
   
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
        const xc = trail[i].x;
        const yc = trail[i].y;
        let opacity = ".1";
        let r = parseInt(clr_h.value.substring( 1, 3 ), 16)    
        let g = parseInt( clr_h.value.substring( 3, 5 ), 16 )
        let b = parseInt( clr_h.value.substring( 5, 7 ), 16 )
        let rgba_c  = 'rgba(' + r + ',' + g + ',' + b + ', 1)'
        let rgba_l  = 'rgba(' + r + ',' + g + ',' + b + ', .1)'
        ctx_h.shadowBlur = 40;
        ctx_h.shadowColor = rgba_c
        ctx_h.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
        ctx_h.lineWidth = params.widthFactor * (params.pointsNumber - i);
        ctx_h.strokeStyle = rgba_l;
        ctx_h.lineCap = 'round';
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
