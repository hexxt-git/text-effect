const elasticity = 30;
const mouse_force = 10;
const friction = 0.9;
const X = 30;
const Y = 30;
// split every 50 word to a new line
const paragraph = `
    lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum.
`.split(' ').map((word, i) => word + ((i+1)%7==0 ? '\n' : '')).join(' ');

class Letter{ // letters are 17x30
    constructor(x, y, char){
        this.x0 = x;
        this.y0 = y;
        this.x = x;
        this.y = y;
        this.vx = Math.random()*50-25;
        this.vy = Math.random()*50-25;
        this.char = char;
    }
    update(){
        this.x += this.vx;
        this.y += this.vy;
        // force to go back to original position
        let dx = this.x-this.x0;
        let dy = this.y-this.y0;
        this.vx -= dx/elasticity;
        this.vy -= dy/elasticity;
        // friction
        this.vx *= friction;
        this.vy *= friction;
        // collision with walls
        if(this.x < 0){
            this.x = 1;
            this.vx = Math.abs(this.vx);
        }
        if(this.x > width-17){
            this.x = width-17;
            this.vx = -Math.abs(this.vx);
        }
        if(this.y < 0){
            this.y = 0;
            this.vy = Math.abs(this.vy);
        }
        if(this.y > height-30){
            this.y = height-30;
            this.vy = -Math.abs(this.vy);
        }
        // mouse force
        let dxm = this.x-mouse.x;
        let dym = this.y-mouse.y;
        let d2 = dxm*dxm+dym*dym+100;
        let d = Math.sqrt(d2);
        let f = mouse_force*1000/d2;
        this.vx += f*dxm/d;
        this.vy += f*dym/d;
    }
    draw(){
        ctx.fillStyle = 'white';
        ctx.font = '30px monospace';
        ctx.fillText(this.char, this.x, this.y+30);
    }
    debug(){
        ctx.strokeStyle = '#b46';
        ctx.beginPath();
        ctx.rect(this.x, this.y, 17, 30);
        ctx.stroke();
        ctx.strokeStyle = '#4b6';
        ctx.beginPath();
        ctx.moveTo(this.x+17/2, this.y+30/2);
        ctx.lineTo(this.x+17/2+this.vx*5, this.y+30/2+this.vy*5);
        ctx.stroke();
    }
}
let mouse = {x: -1000, y: -1000};
document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

let container = document.getElementById('container');
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let width = container.offsetWidth;
let height = container.offsetHeight-5;

canvas.width = width;
canvas.height = height;

let letters = paragraph.split('\n').map((line, i) => {
    return line.split('').map((char, j) => {
        return new Letter(j*17+X, i*30+Y, char);
    });
}).flat();

function anim(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let letter of letters){
        letter.update();
        //letter.debug();
        letter.draw();
    }
    
    requestAnimationFrame(anim);
}

anim();
