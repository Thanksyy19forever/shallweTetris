"use strict";
//定义Cell类型，描述一个格子
//三个属性，r，c，src
function Cell(r,c,src){
	this.r=r;
	this.c=c;
	this.src=src;
}
//定义Shape类型，描述一个图形
//两个属性，cells，src
	//为当前对象添加cells属性,值为cells
	//遍历当前对象的cells属性中每个cell
		//设置当前cell的src为src
function Shape(cells,src,states,orgi){
	this.cells=cells;
	for(var i=0;i<this.cells.length;i++){
		this.cells[i].src=src;
	}
	this.states=states;
	this.orgi=orgi;
	this.statei=0;
}
//在shape的原型对象中添加IMGS属性{T:"img/T.png"...}
Shape.prototype.IMGS={
	T:"img/T.png",
	O:"img/O.png",
	I:"img/I.png",
	J:"img/J.png",
	L:"img/L.png",
	S:"img/S.png",
	Z:"img/Z.png",
}
//在shape的原型对象中添加moveDown
Shape.prototype.moveDown=function(){
	//遍历cells
	for(var i=0;i<this.cells.length;i++){
		this.cells[i].r+=1;//r+1
	}
}
//在shape的原型对象中添加moveLeft
	//遍历cells
		//c-1
Shape.prototype.moveLeft=function(){
	for(var i=0;i<this.cells.length;i++){
		this.cells[i].c-=1;
	}
}
//在shape的原型对象中添加moveRight
	//遍历cells
		//c+1
Shape.prototype.moveRight=function(){
	for(var i=0;i<this.cells.length;i++){
		this.cells[i].c+=1;
	}
}
//在shape的原型对象中添加rotateR方法
	//将当前对象的statei+1
	//如果statei等于states的length就归零
	//调用当前图形的rotate方法
Shape.prototype.rotateR=function(){
	this.statei+=1;
	if(this.statei==this.states.length){this.statei=0;}
	this.rotate();
}
//在shape的原型对象中添加rotateL方法
	//将当前对象的statei-1
	//如果statei等于-1就改为states的length-1
	//调用当前图形的rotate方法
Shape.prototype.rotateL=function(){
	this.statei-=1;
	if(this.statei==-1){this.statei=this.states.length-1;}
	this.rotate();
}
//在shape的原型对象中添加rotate方法
//获得states中statei位置的对象state
	//获得当前对象cells中orgi位置的格，保存在orgCell
	//遍历当前对象的每个cell
		//当前cell的r=orgCell.r+state中ri属性的值
		//当前cell的c=orgCell.c+		
Shape.prototype.rotate=function(){
	var state=this.states[this.statei];
	var orgCell=this.cells[this.orgi];
	for(var i=0;i<this.cells.length;i++){
		this.cells[i].r=orgCell.r+state["r"+i];
		this.cells[i].c=orgCell.c+state["c"+i];
	}
}
//定义T类型，描述T图形
	//借用Shape类型构造函数
		//参数1：[new Cell(0,3),new Cell(0,4),new Cell(0,5),new Cell(1,4)]
		//参数2：this.IMGS.T
function T(){
	Shape.call(this,[new Cell(0,3),new Cell(0,4),new Cell(0,5),new Cell(1,4)],this.IMGS.T,[
		new state(0,-1,0,0,0,1,1,0),
		new state(-1,0,0,0,1,0,0,-1),
		new state(0,1,0,0,0,-1,-1,0),
		new state(1,0,0,0,-1,0,0,1)
	],
	1);
}
//让T类型原型对象继承Shape类型原型对象
Object.setPrototypeOf(T.prototype,Shape.prototype);
//定义O类型，描述O图形
	//借用Shape类型构造函数
		//参数1：[new Cell(0,4),new Cell(0,5),new Cell(1,4),new Cell(1,5)]
		//参数2：this.IMGS.O
function O(){
	Shape.call(this,[new Cell(0,4),new Cell(0,5),new Cell(1,4),new Cell(1,5)],this.IMGS.O,[
		new state(0,-1,0,0,1,-1,1,0)
	],
	1);
}
//让O类型原型对象继承Shape类型原型对象
Object.setPrototypeOf(O.prototype,Shape.prototype);
//定义I类型，描述I图形
	//借用Shape类型构造函数
		//参数1：[new Cell(0,3),new Cell(0,4),new Cell(0,5),new Cell(0,6)]
		//参数2：this.IMGS.I
function I(){
	Shape.call(this,[new Cell(0,3),new Cell(0,4),new Cell(0,5),new Cell(0,6)],this.IMGS.I,[
		new state(-1,0,0,0,1,0,2,0),
		new state(0,-1,0,0,0,1,0,2)
	],
	1);
}
//让I类型原型对象继承Shape类型原型对象
Object.setPrototypeOf(I.prototype,Shape.prototype);
//定义L类型，描述L图形
	//借用Shape类型构造函数
		//参数1：[new Cell(0,4),new Cell(1,4),new Cell(2,4),new Cell(2,5)]
		//参数2：this.IMGS.L
function L(){
	Shape.call(this,[new Cell(0,4),new Cell(1,4),new Cell(2,4),new Cell(2,5)],this.IMGS.L,[
		new state(-1,0,0,0,1,0,1,1),
		new state(0,1,0,0,0,-1,1,-1),
		new state(1,0,0,0,-1,0,-1,-1),
		new state(0,-1,0,0,0,1,-1,1)
	],
	1);
}
//让L类型原型对象继承Shape类型原型对象
Object.setPrototypeOf(L.prototype,Shape.prototype);
//定义J类型，描述J图形
	//借用Shape类型构造函数
		//参数1：[new Cell(0,5),new Cell(1,5),new Cell(2,5),new Cell(2,4)]
		//参数2：this.IMGS.J
function J(){
	Shape.call(this,[new Cell(0,5),new Cell(1,5),new Cell(2,5),new Cell(2,4)],this.IMGS.J,[
		new state(-1,0,0,0,1,0,1,-1),
		new state(0,1,0,0,0,-1,-1,-1),
		new state(1,0,0,0,-1,0,-1,1),
		new state(0,-1,0,0,0,1,1,1)
	],
	1);
}
//让J类型原型对象继承Shape类型原型对象
Object.setPrototypeOf(J.prototype,Shape.prototype);
//定义S类型，描述S图形
	//借用Shape类型构造函数
		//参数1：[new Cell(0,5),new Cell(1,5),new Cell(2,5),new Cell(2,4)]
		//参数2：this.IMGS.S
function S(){
	Shape.call(this,[new Cell(0,4),new Cell(0,5),new Cell(1,3),new Cell(1,4)],this.IMGS.S,[
		new state(-1,0,-1,1,0,-1,0,0),
		new state(0,-1,-1,-1,1,0,0,0)
	],
	3);
}
//让S类型原型对象继承Shape类型原型对象
Object.setPrototypeOf(S.prototype,Shape.prototype);
//定义Z类型，描述Z图形
	//借用Shape类型构造函数
		//参数1：[new Cell(0,5),new Cell(1,5),new Cell(2,5),new Cell(2,4)]
		//参数2：this.IMGS.Z
function Z(){
	Shape.call(this,[new Cell(0,3),new Cell(0,4),new Cell(1,4),new Cell(1,5)],this.IMGS.Z,[
		new state(-1,-1,-1,0,0,0,0,1),
		new state(-1,1,0,1,0,0,1,0)
	],
	2);
}
//让Z类型原型对象继承Shape类型原型对象
Object.setPrototypeOf(Z.prototype,Shape.prototype);
//定义state类型，描述一种图形的某个旋转状态
//属性：r0 c0 r1 c1 r2 c2 r3 c3
function state(r0,c0,r1,c1,r2,c2,r3,c3){
	for(var i=0;i<4;i++){
		this["r"+i]=arguments[i*2];
		this["c"+i]=arguments[i*2+1];
	}
}
