
///////////////////////////////////////////////////////////클래스 및 전역 상수.

const brown = 'rgba(111, 79, 40, 1)';
const banana = 'rgba(251, 231, 178)';

class piece{
	constructor(color, type, x, y){
		this.img = new Image();
		this.img.src = `image/${type}_${color}.png`;
		this.color = color;
		this.type = type;
		this.x = x;
		this.y = y;
	}
}

class king extends piece{
	constructor(color, x, y){
		super(color, 'king', x, y);
	}
	
	check(){
		let result = [];
		
		for(let i=-1; i<2; i++){
			for(let j=-1; j<2; j++){
				
				if(0 <= this.x+i && this.x+i <= 7 && 0 <= this.y+j && this.y+j <= 7 && !(i==0 && j==0)){
					
					if(board[this.y+j][this.x+i] == 0){
						result.push([this.y+j, this.x+i]);
					}
					else if(pieces[board[this.y+j][this.x+i]].color != this.color){
					   result.push([this.y+j, this.x+i]);
					}
				}
			}
		}
		
		return result;
	}//갈수있는 좌표(y,x)로 구성된 배열을 리턴
}

///////////////////////////////////////////////////////////기본 로직 함수.

function init(){
	window.canvas = document.getElementById('screen');
	window.scr = canvas.getContext('2d');
	
	window.addEventListener('resize', updateSize);
	window.addEventListener('click', (e) => {select(e);});
	
	window.selected = [-1, -1];//현재 선택된 칸.
	
	initBoard();
	updateSize();
	
	return new Promise(function(resolve, reject){
		console.log("loading complete!")
		resolve();
	})
}		

function updateSize(){
	window.canvas.height = document.body.clientHeight;
	window.canvas.width = canvas.height;
	window.space = canvas.width/8;
	window.blockL = canvas.width/10;
}

function play(){
	init().then(loop);
}

function loop(){
	window.playing = setInterval(draw, 10);
}

function gameover(){
	clearInterval(playing);
	scr.clearRect(0,0,canvas.width,canvas.height);
	scr.fillStyle = 'black';
	scr.font = '60px consolas';
	scr.fillText('GAME OVER!!', canvas.width/3, canvas.height/2);
}

///////////////////////////////////////////////////////////user-define 함수.

function select(location){
	if(location.path[0].id == 'screen'){
		let x = location.offsetX - space;
		let y = location.offsetY;
	
		if(x >= 0 && x < 8*blockL && y >= 0 && y < 8*blockL){
			x = Math.floor(x/blockL);
			y = Math.floor(y/blockL);
			selected = [x, y];
			return;
		}
	}
	selected =  [-1, -1];
}

function initBoard(){
	window.board = [];
	for(let i=0; i<8; i++){
		board.push([0, 0, 0, 0, 0, 0, 0, 0]);
	}
	board[0][0] = new king('black', 0, 0);
	board[7][7] = new king('white', 7, 7);
	
}

///////////////////////////////////////////////////////////draw 계열 함수.

function draw(){
	scr.clearRect(0,0,canvas.width,canvas.height);
	//drawBackground();
	drawField();
}

function drawBackground(){
	scr.fillStyle = 'rgba(100, 100, 100, 0.7)';
	scr.fillRect(0,0,canvas.width,canvas.height);
}

function drawField(){
	scr.fillStyle = brown;
	scr.fillRect(space, 0, blockL * 8, blockL * 8);
	
	scr.fillStyle = banana;
	for(let i=0; i<4; i++){
		for(let j=0; j<4; j++){
			scr.fillRect(space + blockL*(1 + 2*j), 2*i*blockL, blockL, blockL);
		}
		for(let j=0; j<4; j++){
			scr.fillRect(space + blockL*(2*j), (2*i+1)*blockL, blockL, blockL);
		}
	}
	
	for(let i=0; i<8; i++){
		for(let j=0; j<8; j++){
			drawPiece(j, i);
			if(selected[0] != -1 && selected[1] != -1){
				drawPath(selected[0], selected[1]);
			}
		}
	}
}

function drawPiece(x, y){
	if(board[y][x] != 0){
		scr.drawImage(board[y][x].img, space + blockL*(x + 0.1), blockL*(y + 0.1), blockL*(0.8), blockL*(0.8));
	}
}

function drawPath(x, y){
	if(board[y][x] != 0){
		let possible = board[y][x].check();
		
		for(let k=0; k<possible.length; k++){
			scr.fillStyle = 'yellow';//'rgba(60, 60, 60, 0.5)';
			scr.fillRect(space + blockL*(possible[k][1]), (possible[k][0])*blockL, blockL, blockL);
		}
	}
}