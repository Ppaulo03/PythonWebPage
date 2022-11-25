//#region Setup
const OBJECT_TYPE = {
    BLANK: 'blank',
    WALL: 'wall',
    DOT: 'dot',
    BLINKY: 'blinky',
    PINKY: 'pinky',
    INKY: 'inky',
    CLYDE: 'clyde',
    PILL: 'pill',
    PACMAN: 'pacman',
    GHOST: 'ghost',
    SCARED: 'scared',
    GHOSTLAIR: 'lair',
    NAME: 'name'
};

const LEVEL = [
    [1, 1, 1, 1, 1,    1,  1,  1, 1,  1,  1,  1, 0,  1,  1,  1,  1, 1,  1,  0,  0,  1, 1,  1,    1, 1, 1, 1, 1],  
    [1, 2, 2, 2, 2,    2,  2,  2, 2,  2,  2,  1, 0,  1,  2,  2,  2, 2,  1,  0,  0,  1, 2,  2,    2, 2, 2, 2, 1],
    [1, 7, 1, 1, 2,    1,  1,  1, 1,  1,  2,  1, 0,  1,  2,  1,  1, 2,  1,  0,  0,  1, 2,  1,    2, 1, 1, 2, 1], 
    [1, 2, 1, 1, 2,    1,  1,  1, 1,  1,  2,  1, 1,  1,  2,  1,  1, 2,  1,  1,  1,  1, 2,  1,    2, 1, 1, 7, 1],
    [1, 2, 2, 2, 2,    2,  2,  2, 2,  2,  2,  2, 2,  2,  2,  1,  1, 2,  2,  2,  2,  2, 2,  2,    2, 2, 2, 2, 1], 
    [1, 1, 1, 1, 2,    2,  2,  2, 2,  2,  2,  2, 2,  2,  2,  2,  2, 2,  2,  2,  2,  2, 2,  2,    2, 1, 1, 1, 1],      
    [0, 0, 0, 1, 2,   10, 10, 10, 2, 10, 10, 10, 2, 10,  9,  9, 10, 2, 10,  2,  2, 10, 2, 10,    2, 1, 0, 0, 0],
    [1, 1, 1, 1, 2,   10,  0, 10, 2, 10,  2,  2, 2, 10,  0,  0, 10, 2, 10,  2,  2, 10, 2, 10,    2, 1, 1, 1, 1],
    [0, 0, 0, 0, 2,   10, 10, 10, 2, 10, 10, 10, 2, 10,  0,  0, 10, 2, 10,  2,  2, 10, 2, 10,    2, 0, 0, 0, 0],
    [1, 1, 1, 1, 2,   10,  2,  2, 2, 10,  2,  2, 2, 10,  0,  0, 10, 2, 10,  2,  2, 10, 2, 10,    2, 1, 1, 1, 1],
    [0, 0, 0, 1, 2,   10,  2,  2, 2, 10, 10, 10, 2, 10, 10, 10, 10, 2, 10, 10, 10, 10, 2, 10,    2, 1, 0, 0, 0],
    [1, 1, 1, 1, 2,    2,  2,  2, 2,  2,  2,  2, 2,  2,  2, 10,  2, 2,  2,  2,  2,  2, 2,  2,    2, 1, 1, 1, 1],
    [1, 2, 2, 2, 2,    2,  1,  1, 2,  2,  1,  1, 1,  2,  2,  2,  2, 2,  2,  2,  1,  1, 2,  2,    2, 2, 2, 2, 1],
    [1, 2, 1, 1, 2,    1,  1,  1, 1,  2,  1,  0, 1,  2,  1,  1,  1, 1,  1,  2,  1,  1, 1,  1,    2, 1, 1, 7, 1],
    [1, 7, 1, 1, 2,    2,  1,  1, 2,  2,  1,  0, 1,  2,  1,  1,  1, 1,  1,  2,  1,  1, 2,  2,    2, 1, 1, 2, 1],
    [1, 2, 2, 2, 2,    2,  2,  2, 2,  2,  1,  0, 1,  2,  2,  2,  2, 2,  2,  2,  2,  2, 2,  2,    2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1,    1,  1,  1, 1,  1,  1,  0, 1,  1,  1,  1,  1, 1,  1,  1,  1,  1, 1,  1,    1, 1, 1, 1, 1]
];

const GRID_SIZE = LEVEL[0].length;
const HEIGHT = 20, WIDTH = 20;

const GHOSTCOLORS = {
    'blinky': 'red' ,
    'pinky' : 'pink',
    'inky'  : 'cyan ',
    'clyde' : 'orange'
}

const GHOSTMOVES = {
    'blinky': BlinkyMove,
    'pinky': PinkyMove,
    'inky': InkyMove,
    'clyde': ClydeMove
}

const FAVORITETILES = 
{
    'blinky': {x: 0, y: 0, key: 0},
    'pinky': {x: (GRID_SIZE - 1)* WIDTH, y: 0, key: GRID_SIZE - 1},
    'clyde': {x: 0, y: (LEVEL.length-1)*HEIGHT, key: (LEVEL.length + 1)*GRID_SIZE - 1},
    'inky': {
        x: (GRID_SIZE - 1)* WIDTH, 
        y: (LEVEL.length-1)*HEIGHT, 
        key : (LEVEL.length - 1)*GRID_SIZE
    }
}

const POWER_PILL_TIME = 3000;
var FPS = 32;

function createImage(src)
{
    const img = new Image();
    img.src = src;
    return img;
}
function DegToRad(deg)  
{   
    return (deg*Math.PI)/180;  
} 

function play_audio(audio)
{
    const soundEffect = new Audio(audio);
    soundEffect.play();
}

const soundDot = './static/assets/Sounds/munch.wav'
const soundPill = './static/assets/Sounds/pill.wav'
const soundStart = './static/assets/Sounds/game_start.wav'
const soundGameOver = './static/assets/Sounds/death.wav'
const soundGhost = './static/assets/Sounds/eat_ghost.wav'

//#endregion

//#region Board

const canvas = document.querySelector('canvas');
const game_status = document.querySelector('#game-status');
const ctx = canvas.getContext('2d');
const dotRadius = 1.5, powerPillRadius = 4, ghostsSize = 16;
const map = {};
let dotCount = 0;

class Boundary{
    constructor({position, color, type})
    {
        this.position = position;
        this.color = color;
        this.type = type;
        this.width = WIDTH;
        this.height = HEIGHT;
    }
    draw()
    {
        ctx.strokeStyle = this.color;
        ctx.strokeRect(this.position.x, this.position.y, this.width, this.height);

        if(this.type === OBJECT_TYPE.WALL || this.type === OBJECT_TYPE.GHOSTLAIR)
        {
            const directions = [1,GRID_SIZE,-GRID_SIZE];
            if(this.position.x>0)
            {
                const neighbours = map[this.position.key-1];
                neighbours.forEach((component) =>
                {
                    if(component.type ===  OBJECT_TYPE.WALL || component.type ===  OBJECT_TYPE.GHOSTLAIR)
                    {
                        ctx.clearRect(this.position.x-1, this.position.y+1, 2, this.height-1);
                    }
                });
            }
            if(this.position.y>0)
            {
                const neighbours = map[this.position.key-GRID_SIZE];
                neighbours.forEach((component) =>
                {
                    if(component.type === this.type)
                    {
                        ctx.clearRect(this.position.x, this.position.y-1, this.width, 2);
                    }
                });
            }
        }
    }
}

class Dot{
    constructor({position, type, radius})
    {
        this.position = position;
        this.type = type;
        this.radius = radius;
    }
    draw()
    {
        ctx.beginPath();
        ctx.arc(this.position.x + WIDTH/2, this.position.y + HEIGHT/2, 
                this.radius, 0, Math.PI*2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
    }
}

function showStatus(gameWin)
{
    const div = document.createElement('div');
    div.classList.add('game-status');
    div.innerHTML = `${gameWin ? 'WIN' : 'GAME OVER!'}`;
    game_status.appendChild(div);
}

function setGrid()
{
    dorCount = 0;
    LEVEL.forEach((row, i) => {
        row.forEach((cell, j) =>{
            const position = { x: WIDTH  * j, y: HEIGHT * i, key: GRID_SIZE*i + j}
            switch(cell){
                case 1:  
                    map[position.key] = [new Boundary({
                        position:position,
                        color:'blue',
                        type:OBJECT_TYPE.WALL
                    })];
                break;
                case 10:
                    map[position.key] = [new Boundary({
                        position:position,
                        color:'rgb(255, 200, 64)',
                        type:OBJECT_TYPE.WALL
                    })];
                break;
                case 9:
                    map[position.key] = [new Boundary({
                        position:position,
                        color:'rgb(141, 99, 105)',
                        type:OBJECT_TYPE.GHOSTLAIR
                    })];
                break;
                case 2:
                    map[position.key] = [new Dot({
                        position:position,
                        type:OBJECT_TYPE.DOT,
                        radius:dotRadius
                    })];
                    dotCount ++;
                break;
                case 7:
                    map[position.key] = [new Dot({
                        position:position,
                        type:OBJECT_TYPE.PILL,
                        radius:powerPillRadius
                    })];
                break;
                default:
                    map[position.key] = [];
            }
        });
    });
    Object.values(map).forEach((cell) => cell.forEach((component) => component.draw()));
}
setGrid();

function animate()
{
    ctx.clearRect(0,0,canvas.width, canvas.height);
    Object.values(map).forEach((cell) => cell.forEach((component) => component.draw()));
}

//#endregion

//#region Characters

class Character
{
    constructor({startPos, type, speed})
    {
        this.position = startPos;
        this.type = type;
        this.speed = speed;
        this.powerPill = true;
        this.direction = null;
        this.timer = 0;
    }

    shouldMove()
    {
        if(!this.direction) return false;
        if(this.timer === this.speed)
        {
            this.timer = 0;
            return true;
        }
        this.timer++;
        return false;
    }

    nextMove()
    {
        return{newPosition:this.position, direction:this.direction};
    }

    move()
    {
        if(!this.shouldMove()) return;
        const {newPosition, direction} = this.nextMove();
        
        const index = map[this.position.key].indexOf(this);
        if(index > -1)map[this.position.key].splice(index, 1);
        map[newPosition.key].push(this);
        
        this.position = newPosition;
        this.direction = direction;
    }
}

class Pacman extends Character
{
    constructor({startPos, speed})
    {
        super({startPos:startPos, type:OBJECT_TYPE.PACMAN, speed:speed});
        this.images = [createImage('static/assets/images/pequiman/Pequi1.png'), 
                createImage('static/assets/images/pequiman/Pequi2.png'), createImage('static/assets/images/pequiman/Pequi3.png')]
        this.index = 0;
        this.img =this.images[0];
        this.flip = 1;
        this. angle = 0;
        document.addEventListener('keydown', ({key}) => this.handleKeyInput(key));
        setInterval(() =>  this.animate(),1000/(FPS/6));
    }
    
    checkWall(key)
    {
        let wall = false;
        map[key].forEach((component) =>{
            if(component.type === OBJECT_TYPE.WALL || component.type === OBJECT_TYPE.GHOSTLAIR)
                wall = true;
        })
        return wall;
    }

    nextMove() 
    {
        let newPosition = {
            x: this.position.x + this.direction.x,
            y: this.position.y + this.direction.y,
            key: this.position.key + this.direction.key
        };
        if(newPosition.x < 0)
        {
            newPosition.x = newPosition.x + GRID_SIZE*WIDTH 
            newPosition.key = newPosition.key + GRID_SIZE;
        }
        else if (newPosition.x >= GRID_SIZE*WIDTH)
        {
            newPosition.x = newPosition.x - GRID_SIZE*WIDTH 
            newPosition.key = newPosition.key - GRID_SIZE;
        } 
        
        if (this.checkWall(newPosition.key)) newPosition = this.position;
        return { newPosition, direction: this.direction };
    }

    handleKeyInput(key)
    {
        let direction = null, flip = this.flip, angle = 0;
        switch(key.toLowerCase())
        {
            case 'w':
            case 'arrowup':
                direction = {x:0, y:-HEIGHT, key:-GRID_SIZE};
                angle = -90;
                if(this.direction != null && this.direction.key === GRID_SIZE) flip = -flip;
            break;
            case 's':
            case 'arrowdown':
                direction = {x:0, y:HEIGHT, key:GRID_SIZE};
                angle = 90;
                if(this.direction != null && this.direction.key === -GRID_SIZE)flip = -flip;
            break;
            case 'a':
            case 'arrowleft':
                direction = {x:-WIDTH, y:0, key:-1};
                flip = -1;
                angle = 0;
            break;
            case 'd':
            case 'arrowright':
                direction = {x:WIDTH, y:0, key:1};
                flip =  1;
                angle = 0;
            break; 
            case ' ':
                pause = !pause;
            default:
                console.log(key.toLowerCase())
                return;   
        }
        if(this.checkWall(this.position.key + direction.key)) return;
        this.direction = direction;
        this.flip = flip;
        this.angle = angle;
    }
    animate()
    {
        
        this.index++;
        if(this.index >= this.images.length) this.index = 0;
        this.img = this.images[this.index];
    }
    draw()
    {
        
        const midPoint = {x:this.position.x + WIDTH/2, y:this.position.y + HEIGHT/2};
        ctx.save();
        ctx.translate(midPoint.x, midPoint.y);
        ctx.scale(this.flip,1);
        ctx.rotate(DegToRad(this.angle));
        ctx.drawImage(this.img, -WIDTH/2, -HEIGHT/2,WIDTH, HEIGHT);
        ctx.restore();

    }
}

class Ghost extends Character
{
    constructor({startPos, speed, name, pacman})
    {
        super({startPos:startPos, type:OBJECT_TYPE.GHOST, speed:speed});
        this.name = name;
        this.startPos = startPos
        
        this.movement = GHOSTMOVES[name];
        this.favorite_tile = FAVORITETILES[name];
        this.originalColor = GHOSTCOLORS[name];
        this.color = this.originalColor;
        
        this.pacman = pacman;
        this.dead = false;
        this.dethPath = []

        this.onHouse = true;

        this.scatter = false;
        this.direction = {x: 0, y: -HEIGHT, key: -GRID_SIZE};
    }
    exitHouse()
    {
        const house = [{x:14*WIDTH, y:6*HEIGHT, key:GRID_SIZE*6+14}, 
            {x:15*WIDTH, y:6*HEIGHT, key:GRID_SIZE*6+15}];
        
        if(this.position.key === house[0].key || this.position.key === house[1].key)
        {
            this.onHouse = false;
            return {newPosition: this.position, direction: this.direction};
        }
        const index = Math.floor(Math.random()*2);
        const { newPosition, direction } = chooseTile(this.position,this.direction, house[index]);
        return {newPosition, direction};
        
    }

    deadMove()
    {
        if (this.position.key == this.startPos.key) 
        {
            this.dead = false;
            this.dethPath = [];
            this.onHouse = true;
            return {newPosition: this.position, direction: this.direction};
        }
        else if(this.dethPath.length == 0) 
            this.dethPath = smallerPath(this.position, this.startPos.key);
        
        let movement = this.dethPath.shift();
        const newPosition = {x:movement[0]%GRID_SIZE*WIDTH, 
            y:parseInt(movement[0]/GRID_SIZE)*HEIGHT, key:movement[0]};
        let direction;
        switch(movement[1])
        {
            case -GRID_SIZE:
                direction = {x:0, y:-HEIGHT, key:-GRID_SIZE};
            break;
            case GRID_SIZE:
                direction = {x:0, y:HEIGHT, key:GRID_SIZE};
            break;
            case -1:
                direction = {x:-WIDTH, y:0, key:-1};
            break;
            case 1:
                direction = {x:WIDTH, y:0, key:1};
            break; 
        }
        return {newPosition, direction};
    }
    scaredMove()
    {
        const {newPosition, direction } = chooseRandomTile(this.position,this.direction);
        return {newPosition, direction};
    }
    scatterMove()
    {
        const { newPosition, direction } = chooseTile(this.position,this.direction, this.favorite_tile);
        return {newPosition, direction};
    }
    chaseMove()
    {
        const { newPosition, direction } = this.movement(this.position,this.direction, this.pacman);
        return {newPosition, direction};
    }   
    nextMove()
    { 
        if(this.dead) return this.deadMove();   
        else if(this.onHouse) return this.exitHouse();     
        else if(powerPillActive) return this.scaredMove();
        else if(this.scatter) return this.scatterMove();
        else return this.chaseMove();
    }

    draw()
    {
        let midPoint = {x:this.position.x + WIDTH/2, y:this.position.y + HEIGHT/2};
        
        if(!this.dead)
        {
            ctx.fillStyle = this.color;
            ctx.fillRect(midPoint.x - ghostsSize/2, midPoint.y, ghostsSize, ghostsSize/2);
            ctx.beginPath();
            ctx.arc(midPoint.x, midPoint.y, ghostsSize/2, 0, Math.PI*2);
            ctx.fill();
            ctx.closePath();
        }
        
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.arc(midPoint.x-ghostsSize/5, midPoint.y-ghostsSize/6, ghostsSize/6, 0, Math.PI*2);
        ctx.arc(midPoint.x+ghostsSize/5, midPoint.y-ghostsSize/6, ghostsSize/6, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();       
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.arc(midPoint.x-ghostsSize/5, midPoint.y-ghostsSize/6, ghostsSize/12, 0, Math.PI*2);
        ctx.arc(midPoint.x+ghostsSize/5, midPoint.y-ghostsSize/6, ghostsSize/12, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();
    }
}

class Blinky extends Ghost
{
    constructor({startPos, speed, pacman, blinky})
    {
        super({startPos:startPos, speed:speed, name:'blinky', pacman:pacman});
        this.maxDots = dotCount;
        this.numDots = 0;
        this.velocidy_base = speed
    }
    nextMove()
    {
        this.numDots = this.maxDots - dotCount;
        this.speed = this.velocidy_base - parseInt((this.numDots/(this.maxDots/3)));
        return super.nextMove();
    }
}

class Inky extends Ghost
{
    constructor({startPos, speed, pacman, blinky})
    {
        super({startPos:startPos, speed:speed, name:'inky', pacman:pacman});
        this.blinky = blinky;
    }
    chaseMove()
    {
        const { newPosition, direction } = this.movement(this.position,this.direction, this.pacman, this.blinky);
        return {newPosition, direction};
    }
}

//#endregion

//#region GhostMoves

function chooseTile(position, direction, target)
{
    const tilesDirections = [{x: 0, y: -HEIGHT, key: -GRID_SIZE}, {x: -WIDTH, y: 0, key: -1},
                   {x: 0, y:  HEIGHT, key:  GRID_SIZE}, {x:  WIDTH, y: 0, key:  1}];
    let nextMovePosHash = {};
    tilesDirections.forEach((tileDirection, index) =>
    {
        let TilePos = {
            x: position.x + tileDirection.x,
            y: position.y + tileDirection.y,
            key: position.key + tileDirection.key
        };
        if(TilePos.x < 0)
        {
            TilePos.x = TilePos.x + GRID_SIZE*WIDTH 
            TilePos.key = TilePos.key + GRID_SIZE;
        }
        else if (TilePos.x >= GRID_SIZE*WIDTH)
        {
            TilePos.x = TilePos.x - GRID_SIZE*WIDTH 
            TilePos.key = TilePos.key - GRID_SIZE;
        } 
        
        if(direction.key + tileDirection.key === 0) return;

        let wall = false;
        map[TilePos.key].forEach((component) =>{
            if(component.type === OBJECT_TYPE.WALL || 
                (component.type === OBJECT_TYPE.GHOSTLAIR && tileDirection.key != -GRID_SIZE))
                wall = true;
        });
        if(!wall)
        {
                const dist = Math.pow((TilePos.x - target.x),2) + Math.pow((TilePos.y - target.y),2);
                nextMovePosHash[index] = [dist];
        }
    });
    
    let newPosition = position;
    let dir = direction;
    if (Object.keys(nextMovePosHash).length > 0)
    {   
        let minHash = Object.entries(nextMovePosHash).sort((a, b) => a[1] - b[1])[0][0];
        dir = tilesDirections[parseInt(minHash)]
        newPosition = {
            x: position.x + dir.x,
            y: position.y + dir.y,
            key: position.key + dir.key
        };
    }
    else
    {
        dir = {x: -direction.x, y:-direction.y, key: -direction.key}
        newPosition = {
            x: position.x + dir.x,
            y: position.y + dir.y,
            key: position.key + dir.key
        };
    }
    if(newPosition.x < 0)
    {
        newPosition.x = newPosition.x + GRID_SIZE*WIDTH 
        newPosition.key = newPosition.key + GRID_SIZE;
    }
    else if (newPosition.x >= GRID_SIZE*WIDTH)
    {
        newPosition.x = newPosition.x - GRID_SIZE*WIDTH 
        newPosition.key = newPosition.key - GRID_SIZE;
    }
    return {newPosition, direction: dir};
}

function chooseRandomTile(position, direction)
{
    const tilesDirections = [{x: 0, y: -HEIGHT, key: -GRID_SIZE}, {x: -WIDTH, y: 0, key: -1},
        {x: 0, y:  HEIGHT, key:  GRID_SIZE}, {x:  WIDTH, y: 0, key:  1}];
    let nextMovePosList = [];
    tilesDirections.forEach((tileDirection, index) =>
    {
        let TilePos = {
            x: position.x + tileDirection.x,
            y: position.y + tileDirection.y,
            key: position.key + tileDirection.key
        };
        if(TilePos.x < 0)
        {
            TilePos.x = TilePos.x + GRID_SIZE*WIDTH 
            TilePos.key = TilePos.key + GRID_SIZE;
        }
        else if (TilePos.x >= GRID_SIZE*WIDTH)
        {
            TilePos.x = TilePos.x - GRID_SIZE*WIDTH 
            TilePos.key = TilePos.key - GRID_SIZE;
        }

        if(direction.key + tileDirection.key === 0) return;
        let wall = false;
        map[TilePos.key].forEach((component) =>{
            if(component.type === OBJECT_TYPE.WALL ||
                 (component.type === OBJECT_TYPE.GHOSTLAIR && tileDirection.key != -GRID_SIZE))
                wall = true;
        });
        if(!wall) nextMovePosList.push(index);
        
    });

    let newPosition = position;
    let dir = direction;
    if(nextMovePosList.length > 0)
    {
        let random_tile = nextMovePosList[Math.floor(Math.random()*nextMovePosList.length)];
        dir = tilesDirections[random_tile];
        newPosition = {
            x: position.x + dir.x,
            y: position.y + dir.y,
            key: position.key + dir.key
        };
    }
    else
    {
        dir = {x: -direction.x, y:-direction.y, key: -direction.key}
        newPosition = {
            x: position.x + dir.x,
            y: position.y + dir.y,
            key: position.key + dir.key
        };
    }
    
    if(newPosition.x < 0)
    {
        newPosition.x = newPosition.x + GRID_SIZE*WIDTH 
        newPosition.key = newPosition.key + GRID_SIZE;
    }
    else if (newPosition.x >= GRID_SIZE*WIDTH)
    {
        newPosition.x = newPosition.x - GRID_SIZE*WIDTH 
        newPosition.key = newPosition.key - GRID_SIZE;
    }
    return {newPosition, direction: dir};
}

function BlinkyMove(position, direction, pacman)
{
    const {newPosition, direction: dir} = chooseTile(position, direction, pacman.position);    
    return {newPosition, direction: dir};
}

function PinkyMove(position, direction, pacman)
{   
    let target;
    if(pacman.direction == null)  target = pacman.position;
    else
    {
        target = {
            x: pacman.position.x + 2*pacman.direction.x,
            y: pacman.position.y + 2*pacman.direction.y,
            key: pacman.position.key + 2*pacman.direction.key,
        };
        if(pacman.direction.key === -GRID_SIZE) 
        {
            target.x -= 2*HEIGHT;
            target.key -= 2;
        }
    }
    const {newPosition, direction: dir} = chooseTile(position, direction, target);    
    return {newPosition, direction: dir}
}

function InkyMove(position, direction, pacman, blinky)
{   
    let target;
    if(pacman.direction == null) target = pacman.position;
    else
    {
        target = {
            x: pacman.position.x + 2*pacman.direction.x,
            y: pacman.position.y + 2*pacman.direction.y,
            key: pacman.position.key + 2*pacman.direction.key,
        };
        if(pacman.direction.key === -GRID_SIZE) 
        {
            target.x -= - 2*HEIGHT;
            target.key -= 2;
        }

        let midPoint = {x:target.x + WIDTH/2, y:target.y + HEIGHT/2};
        ctx.fillStyle = 'green';
        ctx.fillRect(midPoint.x, midPoint.y, 400, 4000);
        
        let key = 
        {
            x: 2*target.x - blinky.position.x,
            y: 2*target.y - blinky.position.y,
        };
        if(key.x < 0) key.x = 0;
        else if(key.x <= WIDTH*GRID_SIZE) key.x =  WIDTH*(GRID_SIZE-1);

        if(key.y < 0) key.y = 0;
        else if(key.y >= HEIGHT*LEVEL.length) key.y = HEIGHT*(LEVEL.length - 1);

        target = {
            x: key.x, 
            y: key.y, 
            key:(GRID_SIZE*key.y/HEIGHT) +  (key.x/WIDTH)
        };
        
    }
    const {newPosition, direction: dir} = chooseTile(position, direction, target);    
    return {newPosition, direction: dir}
}

function ClydeMove(position, direction, pacman)
{
    const dist = Math.abs((pacman.position.x - position.x)/WIDTH) + 
                 Math.abs((pacman.position.y - position.y)/HEIGHT);

    let target = 0;
    if(dist > 8) target = pacman.position;
    else target = FAVORITETILES['clyde'];
    const {newPosition, direction: dir} = chooseTile(position, direction, target); 
    return {newPosition, direction: dir};
}

function smallerPath(position, target)
{
    class Cell
    {
        constructor(pos, gCost, hCost, parent, direction)
        {
            this.position = pos;
            this.direction = direction;
            this.gCost = gCost
            this.hCost = hCost
            this.cost = gCost + hCost;
            this.parent = parent;
        }
    }

    const directions = [-1, 1, -GRID_SIZE, GRID_SIZE];
    let open_list = {}, closed_list = {};
    open_list[position.key] = new Cell(position.key, 0,0, null, null);
    
    let cont = 0
    while(Object.keys(open_list).length > 0)
    {
        let min_cost = Object.entries(open_list).sort((a, b) => a[1].cost - b[1].cost)[0][0]
        let cell = open_list[min_cost]
        closed_list[min_cost] = open_list[min_cost]
        delete open_list[min_cost]
    
        directions.forEach(dir =>{
            const pos = parseInt(min_cost) + dir;
            
            let wall = false;
            map[pos].forEach((component) =>
            {
                if(component.type === OBJECT_TYPE.WALL) wall = true;
            })
            if(wall || pos in closed_list) return;
            const gCost = 10 + cell.cost;
            if(pos in open_list && open_list[pos].gCost < gCost) return;

            const gridPos = [parseInt(pos/GRID_SIZE), pos%GRID_SIZE];
            const target_gridpos = [parseInt(target/GRID_SIZE), target%GRID_SIZE];
            const hCost = (Math.abs(target_gridpos[0] - gridPos[0]) +
                            Math.abs(target_gridpos[1] - gridPos[1])) *10;
            
            open_list[pos] = new Cell(pos, gCost, hCost, cell, dir);
            
            return;     
        });
        
        if (cont > 1000) break;
        cont++;
    }
    let path = []; 
    let cell = closed_list[target];
    while (cell.parent != null) 
    {
        path.unshift([cell.position, cell.direction]);
        cell = cell.parent;
    }

    return path;

}

//#endregion

//#region Main

const scoreTable = document.querySelector('#score');
const startButton = document.querySelector('#start-button');

const slowButton = document.querySelector('#Slow');
const normalButton = document.querySelector('#Normal');
const mediumButton = document.querySelector('#Medium');
const fastButton = document.querySelector('#Fast');
const crazyButton = document.querySelector('#Crazy');

var score = 0;
var timer = null;
var gameWin = false;
var powerPillActive = false;
var powerPillTimer = null;
var pause = false;

let scatterTimes = 0;
let scatterTimer = null;
let scaredTimer = null;
let canScatter = true;


function gameOver(pacman)
{
    if(!gameWin) play_audio(soundGameOver);
    document.removeEventListener('keydown', e => pacman.handleKeyInput(e, board.objectExists));
    showStatus(gameWin);
    clearInterval(timer);
    startButton.classList.remove('hide');
}

function checkCollision(pacman, ghosts)
{
    const collidedGhost = ghosts.filter(ghost => pacman.position.key === ghost.position.key);

    collidedGhost.forEach((ghost) =>
    {
        if(!ghost.dead)
        {
            if(powerPillActive)
            {
                play_audio(soundGhost);
                ghost.dead = true;
                score += 100;
            }
            else gameOver(pacman)
        }
    });
}

function gameLoop(pacman, ghosts)
{  
    if(pause) return
    pacman.move();
    checkCollision(pacman, ghosts);
    ghosts.forEach((ghost)=>ghost.move());
    checkCollision(pacman, ghosts);

    map[pacman.position.key].forEach((component, index) =>{
        if(component.type === OBJECT_TYPE.DOT)
        {
            play_audio(soundDot);
            map[pacman.position.key].splice(index,1);
            dotCount --;
            score += 10;
        }
    });
 
    map[pacman.position.key].forEach((component, index) =>{
        if(component.type === OBJECT_TYPE.PILL)
        {
            play_audio(soundPill);
            powerPillActive = true

            if(powerPillTimer) clearTimeout(powerPillTimer)
            if(scaredTimer) clearInterval(scaredTimer)

            ghosts.forEach(ghost => 
            {
                ghost.color = 'blue';
                ghost.direction ={
                    x: -ghost.direction.x, 
                    y: -ghost.direction.movement, 
                    key:-ghost.direction.key};
            });
            map[pacman.position.key].splice(index,1);
            score += 50;
            powerPillTimer = setTimeout(() => 
            {
                clearInterval(scaredTimer)
                ghosts.forEach((ghost) => ghost.color = ghost.originalColor);
                powerPillActive = false;
            }, POWER_PILL_TIME);
            setTimeout(() => scaredTimer = setInterval(() => 
            {
                ghosts.forEach((ghost) => 
                {
                    if(ghost.color == 'blue') ghost.color = 'white';
                    else ghost.color = 'blue';
                });
            }, (1000/FPS)*8), POWER_PILL_TIME/2);
        }
    })
  

    if (dotCount === 0)
    {
        gameWin = true;
        gameOver(pacman);
    }
    scoreTable.innerHTML = score;

    if(canScatter && Math.floor(Math.random() * 1000 === 1000))
    {
        canScatter = false;
        ghosts.forEach(ghost => 
        {
            ghost.scatter = true
            ghost.direction ={
                x: -ghost.direction.x, 
                y: -ghost.direction.movement, 
                key:-ghost.direction.key};
        });
        scatterTimer = setTimeout(() => 
        {
            scatterTimes ++;
            if(scatterTimes < 5) canScatter = true;
            ghosts.forEach(ghost => 
            {
                ghost.scatter = false
                ghost.direction ={
                    x: -ghost.direction.x, 
                    y: -ghost.direction.movement, 
                    key:-ghost.direction.key};
            });
        }, ((Math.random() * (5000 - 2000)) + 2000));
    } 
    animate();
}

function startGame()
{
    slowButton.classList.add('hide');
    normalButton.classList.add('hide');
    mediumButton.classList.add('hide');
    fastButton.classList.add('hide');
    crazyButton.classList.add('hide');

    play_audio(soundStart)
    
    score = 0;
    timer = null;
    gameWin = false;
    powerPillActive = false;
    powerPillTimer = null;
    scatterTimes = 0;

    game_status.innerHTML = '';
    setGrid();

    const pacman = new Pacman({
            startPos:{x:14*WIDTH, y:12*HEIGHT, key:GRID_SIZE*12+ 14}, 
            speed:8});
    const ghosts = [
        new Blinky({
            startPos:{x:14*WIDTH, y:8*HEIGHT, key:GRID_SIZE*8+14}, 
            speed:10, pacman:pacman}),
            
        new Ghost({
            startPos:{x:15*WIDTH, y:8*HEIGHT, key:GRID_SIZE*8+15}, 
        speed:10, name:'pinky', pacman:pacman }),
        new Ghost({
            startPos:{x:14*WIDTH, y:9*HEIGHT, key:GRID_SIZE*9+14}, 
        speed:10, name:'clyde', pacman:pacman }),
    ];
    ghosts.push(new Inky({
        startPos:{x:15*WIDTH, y:9*HEIGHT, key:GRID_SIZE*9+15}, 
        speed:10, pacman:pacman, blinky:ghosts[0]}));

    map[pacman.position.key].push(pacman);
    ghosts.forEach((ghost) => map[ghost.position.key].push(ghost));
    animate();
    setTimeout(() => timer = setInterval(() => gameLoop(pacman, ghosts), 1000/FPS), 100);
    
}

startButton.addEventListener('click', ()=>
{
    slowButton.classList.remove('hide');
    normalButton.classList.remove('hide');
    mediumButton.classList.remove('hide');
    fastButton.classList.remove('hide');
    crazyButton.classList.remove('hide');
    startButton.classList.add('hide')
});

slowButton.addEventListener('click', ()=>
{
    startButton.classList.add('hide');
    FPS = 16;
    startGame();
});
normalButton.addEventListener('click', ()=>
{
    startButton.classList.add('hide');
    FPS = 32;
    startGame();
});
mediumButton.addEventListener('click', ()=>
{
    startButton.classList.add('hide');
    FPS = 64;
    startGame();
});
fastButton.addEventListener('click', ()=>
{
    startButton.classList.add('hide');
    FPS = 100;
    startGame();
});
crazyButton.addEventListener('click', ()=>
{
    startButton.classList.add('hide');
    FPS = 128;
    startGame();
});
//#endregion
