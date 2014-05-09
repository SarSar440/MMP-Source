
//Global variables
var c;
var ctx;

var background=new Image()
background.src="img/ground.png";


// Draw the background everytime the page loads
$(document).ready(function() 
{

    //setting up the Canvas
    var c=document.getElementById("canvas");
    var ctx=c.getContext("2d");

    //setting the width and height of the canvas
    c.width = 600;
    c.height = 400;


    background.onload = function() 
    { 
        ctx.drawImage(background,0,0);
    };

    //when the behaviour button is pressed, animate the spritesheet.  
    $('#behaviour1').click(function()
    {

        var position = 0;
        var wormWidth = 209;
        var wormHeight = 85;
        var count = 10;
        var playCount = 0;
        var maxSpritePlays = 5;

        var sheet = new Image();
        sheet.onload = function () 
        {
            animate();
        }
        sheet.src = "img/spritefinal.png";

        var fps = 9;

        
       function animate() 
        {
           setTimeout(function () 
           {

                if (playCount < maxSpritePlays) 
                {
                    requestAnimationFrame(animate);
                }

                //Clear contents, and redraw sprites
               ctx.clearRect(0, 0, canvas.width, canvas.height);
               ctx.drawImage(background,0,0);
                ctx.drawImage(sheet,  position * wormWidth, 0, wormWidth, wormHeight, 200, 100, wormWidth, wormHeight);

                position++;
                if (position > count - 1) 
                {
                    position = 0;
                    playCount++;
                }
            }, 1000/ fps);
        }
        
    });


});


