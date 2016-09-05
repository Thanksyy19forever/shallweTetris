"use strict";
var tetris={
	OFFSET:15,//定义格子区域相对于背景图片的偏移量
	CSIZE:26,//每个格子的大小
	shape:null,//保存主角图形对象
	nextShape:null,//保存备胎图形
	pg:null,//保存游戏主界面div
	timer:null,//保存定时器序号
	interval:1000,//下落速度（时间间隔）
	RN:20,//总行数
	CN:10,//总列数
	wall:[],//方块墙：保存所有停止下落的图形
	score:0,//保存当前游戏得分
	lines:0,//删除的总行数
	SCORES:[0,10,30,70,150],//删除行数和对应的得分
	  //删除0  1  2  3  4行
	state:1,//当前游戏状态
	RUNNING:1,
	GAMEOVER:0,
	PAUSE:2,
	LEVEL:1,//保存游戏等级
	start:function(){
		this.state=this.RUNNING;
		this.LEVEL=1;
		//wall置为[]，score=0，lines=0
		//r从0开始，到小于RN结束
			//将wall中r行赋值为一个CN个空元素的新数组
		this.wall=[];
		this.score=0;
		this.lines=0;
		for(var r=0;r<this.RN;r++){
			this.wall[r]=new Array(this.CN);
		}
		//找到.playground的div，保存在pg中
		//实例化一个T图形，保存在shape中
		//调用paintShape，绘制主角图形
		this.pg=document.getElementsByClassName("playground")[0];
		this.shape=this.randomShape();
		this.nextShape=this.randomShape();
		this.paint();
		//启动周期性定时器
			//任务：moveDown，时间间隔
		this.timer=setInterval(this.moveDown.bind(this),this.interval);
		//为document绑定按键事件
			//判断键盘号
				//37：向左，39：向右，40；向下，32：hard drop
		document.onkeydown=function(e){
			switch(e.keyCode){
				case 37:this.state==this.RUNNING&&this.moveLeft();
				break;
				case 38:this.state==this.RUNNING&&this.rotateR();
				break;
				case 39:this.state==this.RUNNING&&this.moveRight();
				break;
				case 40:this.state==this.RUNNING&&this.moveDown();
				break;
				case 32:this.state==this.RUNNING&&this.hardDrop();
				break;
				case 90:this.state==this.RUNNING&&this.rotateL();
				break;
				case 83:this.state==this.GAMEOVER&&this.start();
				break;
				case 80:this.state==this.RUNNING&&this.pause();
				break;
				case 67:this.state==this.PAUSE&&this.myContinue();
			}
		}.bind(this);
	},
	//游戏暂停
	pause:function(){
		this.state=this.PAUSE;
		this.paint();
	},
	//游戏继续
	myContinue:function(){
		this.state=this.RUNNING;
		this.paint();
	},
	canRotate:function(){
		//遍历shape中每个cell
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			//如果cell的r<0或者>=RN  或  c<0或者>=CN  或  wall中和cell相同位置有格，返回false
			if(cell.r<0||cell.r>=this.RN||cell.c<0||cell.c>=this.CN||this.wall[cell.r][cell.c]){return false;}
		}
		//返回true
		return true;
	},
	rotateR:function(){
		//调用shape的rotateR
		this.shape.rotateR();
		//如果不能旋转，左转回来
		if(!this.canRotate()){this.shape.rotateL();}
		//重绘一切
		this.paint();
	},
	rotateL:function(){
		//调用shape的rotateL
		this.shape.rotateL();
		//如果不能旋转，左转回来
		if(!this.canRotate()){this.shape.rotateR();}
		//重绘一切
		this.paint();
	},
	//判断是否可以下落
		//遍历shape中每个cell
			//如果当前cell的r=RN-1且wall中和当前cell相同位置的下方有格
				//返回false
		//返回true
	canDown:function(){
		for(var i=0;i<this.shape.cells.length;i++){
			if(this.shape.cells[i].r==this.RN-1||this.wall[this.shape.cells[i].r+1][this.shape.cells[i].c]){return false;}
		}
		return true;
	},
	//判断当前游戏是否结束
	isGameOver:function(){
		//遍历nextShape中的cell
		for(var i=0;i<this.nextShape.cells.length;i++){
			var cell=this.nextShape.cells[i];
			//如果wall中和当前cell相同位置有格，返回true
			if(this.wall[cell.r][cell.c]){return true}
		}
		//返回false
		return false;
	},
	//让主角图形下落一步
		//如果可以下落，调用shape的moveDown
		//否则，让shape中的格子落到墙里，
			//判断并删除满格行，返回ln
			//将ln累加到lines上，从SCORES中ln位置获取相应得分累加到score
			//重新实例化一个主角图形，保存在shape中
		//调用paint，重绘主角图形
	moveDown:function(){
		if(this.state==this.RUNNING){
			if(this.canDown()){
				this.shape.moveDown();
			}else{
				this.landIntoWall();
				var ln=this.deleteRows();
				this.lines+=ln;
				this.score+=this.SCORES[ln];
				var l=parseInt(this.lines/10)+1;
				if(l>this.LEVEL){
					this.LEVEL=l;
					if(this.interval>100){
					  this.interval-=(this.LEVEL-1)*100;
					  clearInterval(this.timer);
					  this.timer=setInterval(this.moveDown.bind(this),this.interval);
					}
				}
				//如果游戏没有结束
				if(!this.isGameOver()){
					this.shape=this.nextShape;
					this.nextShape=this.randomShape();
				}else{//否则，停止定时器，清空timer，修改游戏状态为gameover
					clearInterval(this.timer);
					this.timer=null;
					this.state=this.GAMEOVER;
				}
			}
			this.paint();
		}
	},
	//判断是否可以左移
	canLeft:function(){
		for(var i=0;i<this.shape.cells.length;i++){
			if(this.shape.cells[i].c==0||this.wall[this.shape.cells[i].r][this.shape.cells[i].c-1]){return false;}
		}
		return true;
	},
	//左移
	moveLeft:function(){
		this.canLeft()&&this.shape.moveLeft();
		this.paint();
	},
	//判断是否可以右移
	canRight:function(){
		for(var i=0;i<this.shape.cells.length;i++){
			if(this.shape.cells[i].c==this.CN-1||this.wall[this.shape.cells[i].r][this.shape.cells[i].c+1]){return false;}
		}
		return true;
	},
	//右移
	moveRight:function(){
		this.canRight()&&this.shape.moveRight();
		this.paint();
	},
	//在0~7之间生成随机整数r
		//如果是0：返回 O
		//1: I
		//2: T
	randomShape:function(){
		var r=parseInt(Math.random()*7);
		switch(r){
			case 0:return new T();
			case 1:return new O();
			case 2:return new I();
			case 3:return new L();
			case 4:return new J();
			case 5:return new S();
			case 6:return new Z();
		}
	},
	//直接下落
	hardDrop:function(){
		while(this.canDown()){this.shape.moveDown();}
	},
	//遍历并删除所有满格行
		//自下向上遍历wall中每一行，同时声明ln=0
			//如果wall中r行为空，退出循环
			//如果r行为满格
				//删除r行
				//r留在原地(r++)
				//ln+1
				//如果ln为4，退出循环
		//返回ln
	deleteRows:function(){
		for(var r=this.RN-1,ln=0;r>=0;r--){
			if(this.wall[r].join("")==""){break;}
			if(this.isFull(r)){
				this.deleteRow(r);
				r++;
				ln++;
				if(ln==4){break;}
			}
		}
		return ln;		
	},
	//删除第r行
		//i从r开始，自下向上遍历wall中每一行
			//将wall中i-1行赋值给第i行
			//遍历wall中第i行的每个cell
				//如果wall中i行c列有格将当前cell的r+1
			//创建CN个空元素的新数组赋值给wall中i-1行
			//如果wall中i-2行为空
				//退出循环
	deleteRow:function(r){
		for(var i=r;i>=0;i--)
		{
			this.wall[i]=this.wall[i-1];
			for(var c=0;c<this.CN;c++){
				if(this.wall[i][c]){this.wall[i][c].r++;}
			}
			this.wall[i-1]=new Array(this.CN);
			if(this.wall[i-2].join("")==""){break;}
		}
	},
	//判断满格行
	isFull:function(r){
		//将wall行拍照后，检查是否包含 ，开头 或 ，， 或 ，结尾，转为！，返回结果
		return !/^,|,$|,,/.test(String(this.wall[r]));
	},
	//将主角图形的格子落到墙里
		//遍历shape中每个cell
			//将wall中和当前cell相同r，c位置的元素赋值为cell
	landIntoWall:function(){
		for (var i=0;i<this.shape.cells.length;i++)
		{
			this.wall[this.shape.cells[i].r][this.shape.cells[i].c]=this.shape.cells[i];
		}
	}, 
	//重绘一切
	paint:function(){
		this.pg.innerHTML=this.pg.innerHTML.replace(/<img\s+[^>]*>/ig,"");//删除pg下所有img元素
		this.paintShape();//重绘主角图形
		this.paintWall();
		this.paintScore();
		this.paintNext();
		this.paintState();
	},
	//绘制备胎图形
		//创建frag
		//遍历nextShape中每个cell
			//将当前cell保存在变量cell中
			//创建img
			//设置img的src为cell的src
			//top为cell的r+1  *CSIZE +OFFSET
			//left为cell的c+11  *CSIZE +OFFSET
			//将img追加到frag中
		//将frag追加到pg中
	paintNext:function(){
		var frag=document.createDocumentFragment();
		var cell=this.nextShape.cells;
		for(var i=0;i<cell.length;i++){
			var img=new Image();
			img.src=cell[i].src;
			img.style.top=(cell[i].r+1)*this.CSIZE+this.OFFSET+"px";
			img.style.left=(cell[i].c+10)*this.CSIZE+this.OFFSET+"px";
			frag.appendChild(img);
		}
		this.pg.appendChild(frag);
	},
	//绘制分数
		//在pg下找第一个p，设置内容为score
		//在pg下找第二个p，设置内容为lines
	paintScore:function(){
		this.pg.querySelector("p:first-child>span").innerHTML=this.score;
		this.pg.querySelector("p:nth-child(2)>span").innerHTML=this.lines;
		this.pg.querySelector("p:nth-child(3)>span").innerHTML=this.LEVEL;
	},
	//绘制墙
		//创建文档片段
		//r从RN-1开始，到大于等于0结束，
			//如果r行join“”等于空时，退出循环
			//否则，c从0开始，到小于CN结束
				//当前格有效的时候，绘制当前格，
		//将frag追加到pg中
	paintWall:function(){
		var frag=document.createDocumentFragment();
		for(var r=this.RN-1;r>=0;r--){
			if(this.wall[r].join("")==""){break;}
			else{
				for(var c=0;c<this.CN;c++){
					this.wall[r][c]&&this.paintCell(this.wall[r][c],frag);
				}
			}
		}
		this.pg.appendChild(frag);
	},
	//绘制cell
		//将当前图形临时存储在变量cell中
		//创建img元素，设置src为cell的src
		//设置top：r*CSIZE+OFFSET
		//设置left：c*CSIZE+OFFSET
		//将img追加到frag中
	paintCell:function(cell,frag){
		var img=new Image();
		img.src=cell.src;
		img.style.top=cell.r*this.CSIZE+this.OFFSET+"px";
		img.style.left=cell.c*this.CSIZE+this.OFFSET+"px";
		frag.appendChild(img);
	},
	//负责绘制主角图形
		//创建文档片段
		//遍历shape中cells中的每个图形
		//将frag放入pg中
	paintShape:function(){
		var frag=document.createDocumentFragment();
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			this.paintCell(cell,frag);
		}
		this.pg.appendChild(frag);
	},
	//根据游戏状态绘制图片
	paintState:function(){
		//创建img
		var img=new Image();
		//如果游戏状态为GAMEOVER
		if(this.state==this.GAMEOVER){
			//设置src为img/game-over.png
			img.src="img/game-over.png";
		}else if(this.state==this.PAUSE){//否则如果游戏状态为PAUSE
			//设置src为img/pause.png
			img.src="img/pause.png";
		}
		//将img追击到pg下
		this.pg.appendChild(img);
	}
}
tetris.start();