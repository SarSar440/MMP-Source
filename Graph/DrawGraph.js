/**
 * This JavaScript files contains all the functions used to set the nodes and edges, 
 * and also draw the graph on the html document.
 */


//Declare Global Variables
var graph = {
	nodes: [],
	nodeNums: {},
	edges: []
};

//.ready function when the DOM has been loaded
$(document).ready(function()
{
    /*Button functions*/
    $("#connections").click(function()
    {
        getNeuronData();
    });


    $('.HconnectionType').click(function()
    {
        var inputString = $(this).val();
        getNeuronData(inputString);
    });

      $('.Hneuronposition').click(function()
    {
        var inputString = $(this).val();
        getNeuronData(inputString);
    });

    
    $('.MconnectionType').click(function()
    {
        var inputString = $(this).val();
        getNeuronData(inputString);
    });

    $('.Mneuronposition').click(function()
    {
        var inputString = $(this).val();
        getNeuronData(inputString);
    });

    $('.TconnectionType').click(function()
    {
        var inputString = $(this).val();
        getNeuronData(inputString);
    });

      $('.Tneuronposition').click(function()
    {
        var inputString = $(this).val();
        getNeuronData(inputString);
    });

    $(".region").click(function()
    {
        
        var inputString = $(this).val();
        getNeuronData(inputString);
    });
    
    $(".connectionType").click(function()
    { 
        var inputString = $(this).val();
        getNeuronData(inputString);
        findNeurons(inputString);
    });

    $(".partition").click(function()
    { 
        
        var inputString = $(this).val();
        getNeuronData(inputString);
        findNeurons(inputString);
    });


    $('.tissue').click(function()
    {
        var inputString = $(this).val();
        getNeuronData(inputString);
        findNeurons(inputString);
    })
}); 

//Function to get the nodes data from specified PHP file.
function getNeuronData(inputString)
{
    $.ajax(
    {   
        url:"php/nodes.php",
        data: inputString,
        success:function(result) 
        {
            removeGraph(); 

            //Parse the JSON retrived from the PHP Script
            var decoded_neuron = JSON.parse(result);

            populateNodes(decoded_neuron);
            getConnectionData(inputString);
        }
    });
}

//When the node data has been parsed,
//Populate the nodes
function populateNodes(decoded_neuron)
{
    graph.nodes = [];
    graph.nodeNums = {};
    graph.edges = [];

    for(var i=0; i<decoded_neuron.length;i++) 
    {
        
        graph.nodes.push(decoded_neuron[i]);
        var name = decoded_neuron[i]['neuron_name'];

        graph.nodeNums[name] = {
            number: i,
            name: name
        };
    }
}

//function to get the edge JSON from specified PHP file.
function getConnectionData(inputString)
{
    $.ajax(
    {   
        url:"php/edges.php",
        data: inputString,
        success:function(result) 
        {
            var decoded_connections = JSON.parse(result);

            populateConnections(decoded_connections);
            drawGraph();
        }
    });
}

//function to populate edges
function populateConnections(decoded_connections) 
{
    //When the Edges have been parsed, loop through and add them to Edges.	
    for(var i=0; i<decoded_connections.length;i++) 
    {
        var source;
        var target;
        var neuron2 = decoded_connections[i]['neuron2_name'];
        var neuron1 = decoded_connections[i]['neuron1_name'];
        var nodeNums = graph.nodeNums;
        var edges = graph.edges;
        for(var name in nodeNums) 
        {
            var nodeNum = nodeNums[name];
            if(neuron2 == name)
            {
                target = nodeNum.number;
             }
             if(neuron1 == name)
             {
                source = nodeNum.number;
             }
        }
        edges.push({'source': source, 'target': target}); 
      }
}

//remove all contents of the graph.
function removeGraph()
{
    graph.nodes = [];
    graph.edges= [];
    d3.select("svg").remove();
}

/*Third-party code was used here to help render the graph.
I have made changes to the code in order to make the graph as my own.

D3.js is licenced under the BSD licence.
*/
function drawGraph()
{
    var data = 
    {
	'nodes': graph.nodes,
	'edges': graph.edges
    };

    var w = 850;
    var h = 750;

    //Initialize a default force layout, using the nodes and edges from data
    var force = d3.layout.force()
    .nodes(data.nodes)
    .links(data.edges)
    .size([w, h])
    .linkDistance(275)
    .gravity(.05)
    .charge([-70])
    .start();
    
    //Create SVG element
    var svg = d3.select("#graph").append("svg")
    .attr("width", w)
    .attr("height", h);

    //create a border to surround the graph
    var borderPath = svg.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("height", h)
    .attr("width", w)
    .style("stroke", "black")
    .style("fill", "none")
    .style("stroke-width", 1);


    //Create edges as lines
    var edges = svg.selectAll("line")
    .data(data.edges)
    .enter()
    .append("line")
    .style("stroke", "#9ecae1")
    .style("stroke-width", 1.5)
    .on("click", function() 
    {
    console.log(d3.select(this)[0][0].__data__);
    });


    //Create nodes as circles
    var nodes = svg.selectAll("circle")
    .data(data.nodes)
    .enter()
    .append("circle")
    .attr("r", 8)
    .call(force.drag)
    .style("fill", "#fd8d3c")
    .on("click", function() 
    {
	console.log(d3.select(this)[0][0].__data__);
    });

    var texts = svg.selectAll("text")
    .data(data.nodes)
    .enter()
    .append("text")
     .text(function(d) {  return d[0];  })
     .attr("text-anchor", "middle")
     .attr("font-family", "sans-serif")
     .attr("font-size", "9px");

    //This is called everytime the simulation ticks
    force.on("tick", function() 
    {
         texts.attr("transform", function(d) {  return "translate(" + d.x + "," + d.y + ")";  });

         edges.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

        nodes.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
    });
}