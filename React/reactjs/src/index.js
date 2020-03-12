import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
var canvas,
    context;




function getcordinates(event){
  
      var xc=event.clientX - canvas.getBoundingClientRect().left;
      var yc=event.clientY - canvas.getBoundingClientRect().top;
     
    return [xc,yc];

}

function dragStart(event) {
    //console.clear();
    var cor=getcordinates(event);
    context.beginPath();
    context.moveTo(cor[0],cor[1]);

    console.log('dragStart Cordinates:',getcordinates(event));
}

function drag(event) {
   console.log("dragging")
    //console.log('Mouse Cordinates:',getcordinates(event));

}

function dragStop(event) {
    var cor=getcordinates(event);
    context.rectTo(cor[0],cor[1]);
    context.stroke();
    console.log('dragStop Cordinates:',getcordinates(event));
    

}

function init() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext('2d');
     var image=new Image()
     image.src="roads.JPG"
     context.drawImage(image,0,0,canvas.width,canvas.height);
    context.strokeStyle = 'red';
    context.lineWidth = 6;
    context.lineCap = 'round';
    // context.beginPath();
    // context.moveTo(0,0);
    // context.lineTo(100,100);
    // context.stroke();

    canvas.addEventListener('mousedown', dragStart, false);
    canvas.addEventListener('mousemove', drag, false);
    canvas.addEventListener('mouseup', dragStop, false);
}

window.addEventListener('load', init, false);

