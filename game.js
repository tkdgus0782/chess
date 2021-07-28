
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
		this.cnt = 0;
	}
	
	move(x, y){
		board[y][x] = board[this.y][this.x];
		board[this.y][this.x] = 0;
		this.y = y;
		this.x = x;
	}
}

class king extends piece{
	constructor(color, x, y){
		super(color, 'king', y, x);
	}
	
	check(){
		let result = [];
		
		for(let i=-1; i<2; i++){
			for(let j=-1; j<2; j++){
				
				if(0 <= this.x+i && this.x+i <= 7 && 0 <= this.y+j && this.y+j <= 7 && !(i==0 && j==0)){
					
					if(board[this.y+j][this.x+i] == 0){
						result.push([this.x+i, this.y+j]);
					}
					else if(board[this.y+j][this.x+i].color != this.color){
						console.log(this.color + '!=' + board[this.y+j][this.x+i].color);
						result.push([this.x+i, this.y+j]);	
					}
				}
			}
		}
		
		return result;
	}//갈수있는 좌표(x,y)로 구성된 배열을 리턴
}

class queen extends piece{
	constructor(color, x, y){
		super(color, 'queen', y, x);
	}
	
	check(){
		let result = [];		
		return result;
	}//갈수있는 좌표(y,x)로 구성된 배열을 리턴
}

class rook extends piece{
	constructor(color, x, y){
		super(color, 'rook', y, x);
	}
	
	check(){
		let result = [];		
		return result;
	}//갈수있는 좌표(y,x)로 구성된 배열을 리턴
}

class bishop extends piece{
	constructor(color, x, y){
		super(color, 'bishop', y, x);
	}
	
	check(){
		let result = [];		
		return result;
	}//갈수있는 좌표(y,x)로 구성된 배열을 리턴
}

class knight extends piece{
	constructor(color, x, y){
		super(color, 'knight', y, x);
	}
	
	check(){
		let result = [];		
		return result;
	}//갈수있는 좌표(y,x)로 구성된 배열을 리턴
}

class pawn extends piece{
	constructor(color, x, y){
		super(color, 'pawn', y, x);
	}
	
	check(){
		let result = [];
		
		if(this.color == "black"){
			if(this.cnt == 0){
				if(this.y  <= 6 && board[this.y + 1][this.x] == 0){
					result.push([this.x, this.y + 1]);
				}
				if(this.y  <= 5 && board[this.y + 1][this.x] == 0 && board[this.y + 2][this.x] == 0 && this.cnt==0){
					result.push([this.x, this.y + 2]);
				}
				if(this.y <= 6 && this.x >= 1 && board[this.y + 1][this.x - 1].color == "white"){
					result.push([this.x -1, this.y + 1]);
				}
				if(this.y <= 6 && this.x <= 6 && board[this.y + 1][this.x + 1].color == "white"){
					result.push([this.x + 1, this.y + 1]);
				}
			}
		}
		else{
			if(this.cnt == 0){
				if(this.y  >= 1 && board[this.y - 1][this.x] == 0){
					result.push([this.x, this.y - 1]);
				}
				if(this.y  >= 2 && board[this.y - 1][this.x] == 0 && board[this.y - 2][this.x] == 0 && this.cnt==0){
					result.push([this.x, this.y - 2]);
				}
				if(this.y >= 1 && this.x >= 1 && board[this.y - 1][this.x - 1].color == "black"){
					result.push([this.x -1, this.y - 1]);
				}
				if(this.y <= 6 && this.x <= 6 && board[this.y - 1][this.x + 1].color == "black"){
					result.push([this.x + 1, this.y - 1]);
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
	window.pFlag = false;//선택된 칸에 움직일수 있는 말이 있는지?
	window.possible = [];//현재 선택된 움직일수 있는 말의 이동 가능 좌표
	
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

function checkIn(origin, find){
	for(let i=0; i<origin.length; i++){
		if(JSON.stringify(origin[i]) == JSON.stringify(find)){
			return true;
		}
	}
	return false;
}

function select(location){
	if(location.path[0].id == 'screen'){
		let x = location.offsetX - space;
		let y = location.offsetY;
	
		if(x >= 0 && x < 8*blockL && y >= 0 && y < 8*blockL){
			x = Math.floor(x/blockL);
			y = Math.floor(y/blockL);
			console.log(possible , [x,y], checkIn(possible, [x, y]));
			if(pFlag && checkIn(possible, [x, y])){
				board[selected[1]][selected[0]].move(x, y);
				selected = [-1, -1];
				pFlag = false;
			}
			else{
				selected = [x, y];
				pFlag = true;
			}
			return;
		}
	}
	selected =  [-1, -1];
	pFlag = false;
}

function initBoard(){
	window.board = [];
	for(let i=0; i<8; i++){
		board.push([0, 0, 0, 0, 0, 0, 0, 0]);
	}
	board[0][0] = new rook('black', 0, 0);
	board[0][1] = new knight('black', 0, 1);
	board[0][2] = new bishop('black', 0, 2);
	board[0][3] = new queen('black', 0, 3);
	board[0][4] = new king('black', 0, 4);
	board[0][5] = new bishop('black', 0, 5);
	board[0][6] = new knight('black', 0, 6);
	board[0][7] = new rook('black', 0, 7);
	for(let i=0; i<8; i++){
		board[1][i] = new pawn('black', 1, i);
	}
	
	board[7][0] = new rook('white', 7, 0);
	board[7][1] = new knight('white', 7, 1);
	board[7][2] = new bishop('white', 7, 2);
	board[7][3] = new queen('white', 7, 3);
	board[7][4] = new king('white', 7, 4);
	board[7][5] = new bishop('white', 7, 5);
	board[7][6] = new knight('white', 7, 6);
	board[7][7] = new rook('white', 7, 7);
	for(let i=0; i<8; i++){
		board[6][i] = new pawn('white', 6, i);
	}
	
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
		}
	}
	
	if(pFlag){
		drawPath(selected[0], selected[1]);
	}
}

function drawPiece(x, y){
	if(board[y][x] != 0){
		scr.drawImage(board[y][x].img, space + blockL*(x + 0.1), blockL*(y + 0.1), blockL*(0.8), blockL*(0.8));
	}
}

function drawPath(x, y){
	if(board[y][x] != 0){
		possible = board[y][x].check();
		
		for(let k=0; k<possible.length; k++){
			scr.fillStyle = 'yellow';//'rgba(60, 60, 60, 0.5)';
			scr.fillRect(space + blockL*(possible[k][0] + 0.3), (possible[k][1] + 0.3)*blockL, blockL*(0.4), blockL*(0.4));
		}
	}
}