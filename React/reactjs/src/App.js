import React from 'react';
import logo from './logo.svg';
import './App.css';

//var img_list=["http://localhost:8000/images/roads.jpg/","http://localhost:8000/images/i3.png","http://i.imgur.com/c2wRzfD.jpg","roads.jpg", "logo512.png","i3.png","i4.png"]
var temp_img_id=0;
var ctx,canvas
var image_data
var imagedata_list=[]
var url="welcome.jpg"
let brush=false;
var sqr_start={x:"",y:""}
var sqr_end={x:"",y:""}
var brushpos_start={x:"",y:""}
var brushpos_end={x:"",y:""}
var brushpos_move={x:"",y:""}
var pic_square
var loadedimg_id
var freehand_x=[],freehand_y=[]
var token
var img_width,img_height
var annotate={
  "image_id" : "",
  "x_cor" : [],
  "y_cor" : [],
  "email"  : "",
  "label" : "",
  "shape" : "",
  "token" : ""
}

var User={
  "email":"",
  "password":""
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
  console.log(brushpos_start)
  sqr_start=brushpos_start
  image_data= canvas.toDataURL()
  imagedata_list.push(image_data)
}

function finishdraw(event)
{ 
  brush=false;
  brushpos_end=get_cordinates(event)
  console.log(brushpos_end)
  ctx.beginPath();
  
}

function freehand_draw()
{  if(brush)
  { console.log("Cord=",brushpos_move)
    ctx.drawWidth=5;
    ctx.lineCap="round"
    freehand_x.push(chng_x(brushpos_move.x))
    freehand_y.push(chng_y(brushpos_move.y))
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
  sqr_end=brushpos_move
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

var tem_img=""

async function get_url(){
  const api_str='http://localhost:8000/image?id='+temp_img_id +'&' + 'token=' +token
  const a=await fetch(api_str)
   
  const j=await a.json()
  console.log("json=",j)
  tem_img=j.image_id
  const image_url=j.image_source
  url= await'http://localhost:8000'+ image_url
  console.log("async_url=",url)

  
}


function getImage(){
    loadedimg_id=tem_img
    get_url()
    
    return url
  
}

function chng_x(x)
{
    const chng_x= x+((img_width-canvas.width)*x)/canvas.width
    return chng_x
}
function chng_y(y)
{
    const chng_y= y+((img_height-canvas.height)*y)/canvas.height
    return chng_y
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
      f:0,
      img_id:0,
      img_a:600,
      img:url,

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
  { var image = canvas.toDataURL();  
    var tmpLink = document.createElement( 'a' );  
    tmpLink.download = 'image.png';
    tmpLink.href = image; 
    document.body.appendChild( tmpLink ); 
    tmpLink.click(); 
    document.body.removeChild( tmpLink );  
    

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
      
      img_height=img.height
      img_width=img.width
      
      canvas.width=700
      canvas.height=500
      
      ctx.clearRect(0, 0,canvas.width,canvas.height)
      ctx.drawImage(img,0, 0,canvas.width,canvas.height)
      image_data= canvas.toDataURL()
      imagedata_list.push(image_data) 
      console.log(img_height,img_width,canvas.height,canvas.width)
    }
    
    img.src=img_id
    img.crossOrigin='Anonymous'
    
  }
  mySubmitHandler = (event) => {

    event.preventDefault();
    if(this.input.value==="")
    {
      alert("Please input some value");
    }
    else{
    if(this.tool.square)
    {
      annotate.x_cor =[chng_x(sqr_start.x),chng_x(sqr_end.x)]
      annotate.y_cor =[chng_y(sqr_start.y),chng_y(sqr_end.y)]
      annotate.shape="square"
    }
    else
    {
      annotate.x_cor=freehand_x
      annotate.y_cor=freehand_y
      freehand_y=[]
      freehand_x=[]
      annotate.shape="Freehand"
    }
    annotate.image_id=loadedimg_id
    annotate.label=this.input.value
    annotate.token=token
    
    alert("You have submitted " + this.input.value);
    fetch("http://localhost:8000/annotation/save",
    {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(annotate)
    })
    .then(function(res){ 
      //alert("You Have Submitted " + this.input.value);
      console.log(res)

    })
    .catch(function(res){ console.log(res) })
  }    
    document.getElementById("submit_annotation").reset();

  }

  componentDidUpdate() {
     if(this.state.f==1){
     canvas = this.refs.mycanvas
     ctx = canvas.getContext("2d")
     this.skip()
     window.addEventListener("mouseup",finishdraw)
     canvas.addEventListener("mousedown",startdraw)
    
     canvas.addEventListener("mousemove",this.draw.bind(this)) 
  
      
    }


    
  }

  Login_Submit = async (event) => {
    event.preventDefault();
    User.email=this.username.value
    User.password=this.password.value
    
    const t=await fetch("http://localhost:8080/api/login/",
    {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(User)
    })
    const j=await t.json()
    if(j["status code"]==200)
    {
      token=j.token
      this.setState({f:1})
    }
    else
    { token=""
      alert("Invalid Username Password")
    }
    
    document.getElementById("submit_annotation").reset();
  }



  

  log_out()
  {
    this.setState({f:0})
  }

  
  render(){
    if(this.state.f==1)
    {
        
    return (
      <div className="editor">
    
      <div class ="header">
        CROWD/\NN

      <button class="logout" onClick={()=>{this.log_out()}}>Log Out </button>
      </div>
      <div className='Buttons'>
      <button class="Buttons b1" onClick={()=>{this.set_tool('freehand')}}>Free Hand</button>
      <button class="Buttons b2" onClick={()=>{this.set_tool('square')}}>Square</button>
      
      <button class="Buttons b6" onClick={()=>back()}>Undo</button>
      <button class="Buttons b7" onClick={()=>this.ZoomIn()}>Zoom In</button>
      <button class="Buttons b8" onClick={()=>this.ZoomOut()}>Zoom Out</button>
      <button class="Buttons b4" onClick={()=>{this.skip()}}>Next</button>
      <button class="Buttons b5"onClick={()=>{this.submit()}}>Save</button>
      
      </div>
      <form onSubmit={this.mySubmitHandler} id="submit_annotation" class="annotation">
        <input
          type='text' class="labelbox"
          ref={(input) => this.input = input}
          
        />
        <input
          type='submit' class="submit"
        />
      </form>
      
      <div className='Canvas'>
        <canvas width={0} height={0} ref="mycanvas">My canvas</canvas>
      </div>
    </div>
    
    )
  }
  else
  {
    return(
      <form method="post">
      <div class ="header">
        CROWD/\NN </div>
      <div className="Login" align="center">
       
        <h1 class="log" >Login</h1>
        <form onSubmit={this.Login_Submit} id="submit_annotation">
        <label>Username </label>
        <input
          type='text' class="user" 
          ref={(input) => this.username = input }
          
        />
        <br></br>
        <label>Password .</label>
        <input
          type='password' class="pass"
          ref={(input) => this.password = input}
          
        />
        <br></br>
        <input
          type='submit' class="submit"
        />
      </form>
    </div>
    </form>
    )
  }

} 
}

export default App;
