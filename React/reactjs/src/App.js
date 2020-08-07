import React from 'react';
import logo from './logo.svg';
import './App.css';

var img_list=["http://localhost:8000/images/roads.jpg/","http://localhost:8000/images/i3.png","http://i.imgur.com/c2wRzfD.jpg","roads.jpg", "logo512.png","i3.png","i4.png"]
var temp_img_id=0;
var ctx,canvas
var image_data
var imagedata_list=[]
var f=1
var url
let brush=false;
var brushpos_start={x:"",y:""}
var brushpos_end={x:"",y:""}
var brushpos_move={x:"",y:""}
var pic_square
var annotate={
  "image_id" : "5236fda4-05cf-4a2f-ae1e-a94e6749e6cf",
  "x_cor" : [1,2,3],
  "y_cor" : [1,2,3],
  "canvas_size" : [[0,0], [5,0], [0,5]],
  "label" : "SUCCESS"
}

function get_cordinates(event)
{
  var xc=event.clientX - canvas.getBoundingClientRect().left;
  var yc=event.clientY - canvas.getBoundingClientRect().top;
 
return {x:xc,y:yc};
}

function startdraw(event)
{ 
  pic_square=ctx.getImageData(0,0,canvas.width,canvas.height)
  brush=true;
  brushpos_start=get_cordinates(event)
  image_data= canvas.toDataURL()
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
  { console.log("Cord=",brushpos_move)
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
  ctx.putImageData(pic_square, 0, 0);
  ctx.save();
  ctx.fillStyle="rgba(255, 255, 255, 0.5)";
  ctx.strokeRect(brushpos_start.x,brushpos_start.y,width,height)
  ctx.fillRect(brushpos_start.x,brushpos_start.y,width,height)
}

function back()
{ 
  
  const img_data=imagedata_list[imagedata_list.length-1]
  const t=new Image()
    
    
    
    
    t.onload= () =>{
      
      ctx.drawImage(t,0, 0,canvas.width,canvas.height)
    }
    
    t.src=img_data
  imagedata_list.pop()
}


async function get_url(){
  const api_str='http://localhost:8000/image?id='+temp_img_id
  const a=await fetch(api_str)
    
  const j=await a.json()
  console.log(j)
  const image_url=j.image_source
  url=await 'http://localhost:8000'+ image_url

}


function getImage(){
    
     
    //  get_url()

     return img_list[temp_img_id]
  
  
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
      f:1,
      img_id:0,
      img_a:600,
      img:getImage()

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
    temp_img_id=(temp_img_id+1)%6
    this.state.img=getImage()
    
    console.log("img=",this.state.img)
    this.load_img(52)
  }

  submit()
   { //var image = canvas.toDataURL();  
  //   var tmpLink = document.createElement( 'a' );  
  //   tmpLink.download = 'image.png';
  //   tmpLink.href = image; 
  //   document.body.appendChild( tmpLink ); 
  //   tmpLink.click(); 
  //   document.body.removeChild( tmpLink );  
    //const t=fetch('http://localhost:8000/annotation/save',{method : 'POST'})
    fetch("http://localhost:8000/annotation/save",
{
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify(annotate)
})
.then(function(res){ console.log(res) })
.catch(function(res){ console.log(res) })
    this.skip()
  }

  ZoomIn()
  { const t=new Image()
    
    
    
    
    t.onload= () =>{
      canvas.width+=100
      canvas.height+=100
      
      ctx.drawImage(t,0, 0,canvas.width,canvas.height)
    }
    // ctx.putImageData(img_data, 0, 0)
    // ctx.save()
    t.src=canvas.toDataURL()
  }


  ZoomOut()
  {
    const t=new Image()
    
    
    
    
    t.onload= () =>{
      canvas.width-=100
      canvas.height-=100
      ctx.clearRect(0, 0,canvas.width,canvas.height)
      ctx.drawImage(t,0, 0,canvas.width,canvas.height)
    }
    // ctx.putImageData(img_data, 0, 0)
    // ctx.save()
    t.src=canvas.toDataURL()
    
    
  }

  load_img()
  { 
    const img_id=this.state.img
    const img=new Image();
    
    //const temp=new Image()
    //ctx.drawImage(temp,0, 0,canvas.width,canvas.height) 
    console.log("load=",img_id)
    img.onload= () =>{
      
      
      canvas.width=img.width
      canvas.height=img.height
      ctx.clearRect(0, 0,canvas.width,canvas.height)
      ctx.drawImage(img,0, 0,img.width,img.height)
      image_data= canvas.toDataURL()
      imagedata_list.push(image_data) 
    }
    
    img.src=img_id
    img.crossOrigin='Anonymous'
    
  }

  componentDidMount() {
     if(this.state.f==1){
     canvas = this.refs.mycanvas
     ctx = canvas.getContext("2d")
     this.load_img()
     window.addEventListener("mouseup",finishdraw)
     canvas.addEventListener("mousedown",startdraw)
    
     canvas.addEventListener("mousemove",this.draw.bind(this)) 
  
      
    }


    
  }

  submit2()
  {
    this.setState({f:1})
    
  }

  
  render(){
    if(this.state.f==1)
    {
    return (
    <div className="editor">
      <div className='Canvas'>
        <canvas width={0} height={0} ref="mycanvas">My canvas</canvas>
        
      </div>
      <div className='Buttoos'>
      <button onClick={()=>{this.set_tool('freehand')}}>Free Hand</button>
      <button onClick={()=>{this.set_tool('square')}}>Square</button>
      <button onClick={()=>{this.set_tool('point')}}>Point</button>
      <button onClick={()=>{this.skip()}}>Skip</button>
      <button onClick={()=>{this.submit()}}>Submit</button>
      <button onClick={()=>back()}>back</button>
      <button onClick={()=>this.ZoomIn()}>Zoom In</button>
      <button onClick={()=>this.ZoomOut()}>Zoom Out</button>
    </div>
    </div>
  )}
  else
  {
    return(
      
      <div className="login">
        
        <button onClick={()=>{this.submit2()}}>submit2</button>
      </div>
    )
  }

} 
}

export default App;
