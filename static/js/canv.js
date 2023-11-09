const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
var image = document.getElementById('file')
var sze = document.getElementById('size')
var clr = document.getElementById('color')
var und = document.getElementById('undo')
var rdo = document.getElementById('redo')
var clear = document.getElementById('clear')
var bg = document.getElementById('bg')
var bg2 = document.getElementById('bg2')
var bg3 = document.getElementById('bg3')
var bg4 = document.getElementById('bg4')
var bg5 = document.getElementById('bg5')



canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let save_array = [];
let redo_array = [];
let index = -1;
let r_index = -1;


ctx.lineJoin = 'round';
ctx.lineCap = 'round';

let isDrawing = false;
let lastX = 0;
let lastY = 0;


function end() {
    isDrawing = false;
    save_array.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    index++;
    console.log(save_array)
}

function undo() {
    if (index > 0) {
        index--;
        redo_array.push(save_array[index + 1]);
        r_index++;
        save_array.pop();
        ctx.putImageData(save_array[index],0 ,0);
    }
    else if (index == 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        redo_array.push(save_array[index]);
        r_index++;
        redo_array.push(save_array[index - 1]);
        r_index++;
        save_array = [];
        index = -1;
    }
}

function redo() {
    if(r_index > 0) {
        r_index--;
        save_array.push(redo_array[r_index + 1]);
        index++;
        redo_array.pop();
        ctx.putImageData(redo_array[redo_array.length - 1],0 ,0);
    }
    else if (r_index == 0) {
        ctx.putImageData(redo_array[0],0 ,0);
        save_array.push(redo_array[r_index]);
        index++;
        save_array.push(redo_array[r_index - 1]);
        index++;
        redo_array = [];
        r_index = -1;
    }

}
    



function size()
{
    if (sze.value > 100)
    {
        sze.value = 100
    }
    else if (sze.value < 1)
    {
        sze.value = 1
    }
    ctx.lineWidth = sze.value
}

function draw_img() {
    var img = new Image()
    var f = image.files[0]
    var url = window.URL || window.webkitURL
    var src = url.createObjectURL(f); 
    img.src = src;
    img.onload = function(){
        var scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        var x = (canvas.width / 2) - (img.width / 2) * scale;
        var y = (canvas.height / 2) - (img.height / 2) * scale;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    }
  }

function draw(e) {
// stop the function if they are not mouse down
if(!isDrawing) return;
//listen for mouse move event
console.log(e);
ctx.beginPath();
ctx.moveTo(lastX, lastY);
ctx.lineTo(e.offsetX, e.offsetY);
ctx.stroke();
[lastX, lastY] = [e.offsetX, e.offsetY];
}

    
canvas.addEventListener('pointermove', draw);
canvas.addEventListener('pointerup', end);
canvas.addEventListener('pointerout', () => isDrawing = false);
canvas.addEventListener('pointerdown', (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
    });

image.addEventListener('change', draw_img)
sze.addEventListener('input', size)
clr.addEventListener('input', () => ctx.strokeStyle = clr.value)
und.addEventListener('pointerdown', undo)
rdo.addEventListener('pointerdown', redo)
clear.addEventListener('pointerdown', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    save_array = [];
    index = -1;
    redo_array = [];
    r_index = -1;
})
bg.addEventListener('pointerdown', () => document.getElementById('canvas').style.backgroundImage="url('static/image/bg.jpg')")
bg2.addEventListener('pointerdown', () => document.getElementById('canvas').style.backgroundImage="url('static/image/bg2.jpg')")
bg3.addEventListener('pointerdown', () => document.getElementById('canvas').style.backgroundImage="url('static/image/bg3.jpg')")
bg4.addEventListener('pointerdown', () => document.getElementById('canvas').style.backgroundImage="url('static/image/bg4.jpg')")
bg5.addEventListener('pointerdown', () => document.getElementById('canvas').style.backgroundImage="")

