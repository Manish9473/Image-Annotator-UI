import React from 'react';
import logo from './logo.svg';
import './App.css';

var img_list=["roads.JPG", "logo512.png"]
var ctx,canvas
var image_data
var imagedata_list=[]


let brush=false;
var brushpos_start={x:"",y:""}
var brushpos_end={x:"",y:""}
var brushpos_move={x:"",y:""}

function get_cordinates(event)
{
  var xc=event.clientX - canvas.getBoundingClientRect().left;
  var yc=event.clientY - canvas.getBoundingClientRect().top;
 
return {x:xc,y:yc};
}

function startdraw(event)
{ image_data= ctx.getImageData(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
  brush=true;
  brushpos_start=get_cordinates(event)
  imagedata_list.push(image_data)
}

function finishdraw(event)
{
  brush=false;
  brushpos_end=get_cordinates(event)
  ctx.beginPath();
  //ctx.clearRect(0,0,600,600) 
}

function freehand_draw()
{  if(brush)
  {
    ctx.drawWidth=5;
    ctx.lineCap="round"

    ctx.lineTo(brushpos_move.x,brushpos_move.y)
    ctx.stroke();
    ctx.fill();
    //ctx.beginPath();
    ctx.moveTo(brushpos_move.x,brushpos_move.y)
    
  }
}


function square_draw()
{
  const width=brushpos_move.x-brushpos_start.x
  const height=brushpos_move.y-brushpos_start.y
  ctx.putImageData(image_data, 0, 0);
  ctx.save();
  ctx.fillStyle="rgba(255, 255, 255, 0.5)";
  ctx.strokeRect(brushpos_start.x,brushpos_start.y,width,height)
  ctx.fillRect(brushpos_start.x,brushpos_start.y,width,height)
}

function back()
{ const img_data=imagedata_list[imagedata_list.length-1]
  ctx.putImageData(img_data, 0, 0);
  ctx.save();
  imagedata_list.pop()
}


function getImage(id){
    
  //  canva=this.refs.mycanvas;
  //  ctx = canva.getContext("2d");
  //  ctx.drawImage(img,0,0)
  // var img=new Image()
  // console.log("hi",id)
  // //console.log(this.state.img_id,"hi")
  // img.src=img_list[id]
  return img_list[id]
}




class App extends React.Component {

  constructor(props){
    super(props)
    this.tool={

      point:false,
      freehand:false,
      square:false

    }
    
    this.state={
      img_id:0,
      img_a:600,
      img:getImage(0)

      }

    

  }

  



  set_tool(tool_id){
    //console.log(this.tool)
    this.tool.point=false
    this.tool.square=false
    this.tool.freehand=false
    this.tool[tool_id]=true
    console.log(this.tool)


  }

  draw(event)
  {  brushpos_move=get_cordinates(event)

     if(this.tool.freehand&&brush)
     {
        freehand_draw(event)
     }
     if(this.tool.square&&brush)
     {
        square_draw(event)
     }


  }

  skip(event)
  {
    this.state.img_id=1
    this.state.img=getImage(1)
    console.log(this.state)
    this.load_img(52)
  }

  load_img(n)
  { console.log("temp",n)
    const img_id=this.state.img
    const img=new Image();
    
    //const temp=new Image()
    //ctx.drawImage(temp,0, 0,canvas.width,canvas.height) 
    img.src=img_id 
    img.onload= () =>{
      console.log(img,"hi")
      ctx.clearRect(0, 0,canvas.width,canvas.height)
      ctx.drawImage(img,0, 0,canvas.width,canvas.height)
    }
     
     
  }

  componentDidMount() {
     canvas = this.refs.mycanvas
     ctx = canvas.getContext("2d")
     this.load_img(15)
     window.addEventListener("mouseup",finishdraw)
     canvas.addEventListener("mousedown",startdraw)
    
     canvas.addEventListener("mousemove",this.draw.bind(this)) 
  
     



    
  }

  
  render(){
    console.log("render",this.state)
    return (
    <div className="editor">
      <div className='Canvas'>
        <canvas width={600} height={600} ref="mycanvas">My canvas</canvas>
        
      </div>
      <button onClick={()=>{this.set_tool('freehand')}}>Free Hand</button>
      <button onClick={()=>{this.set_tool('square')}}>Square</button>
      <button onClick={()=>{this.set_tool('point')}}>Point</button>
      <button onClick={()=>{this.skip()}}>Skip</button>
      <button onClick={()=>{this.set_tool('freehand')}}>Submit</button>
      <button onClick={()=>back()}>back</button>

    </div>
  );}
}

export default App;
