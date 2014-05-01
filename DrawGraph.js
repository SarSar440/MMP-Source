var graph = {
	nodes: [],
	nodeNums: {},
	edges: []
};

$(document).ready(function()
{
    
    $("#connections").click(function()
    {
        getNeuronData();
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

    });

    $(".partition").click(function()
    { 
        
        var inputString = $(this).val();
        getNeuronData(inputString);

    });


    $('.tissue').click(function()
    {
        var inputString = $(this).val();
        getNeuronData(inputString);
    })
}); 

//using custom WHERE 
function getNeuronData(inputString)
{
    //console.log(inputString);
    $.ajax(
    {   
        url:"nodes.php",
        data: inputString,
        success:function(result) 
        {
            removeGraph(); 
            var decoded_neuron = JSON.parse(result);

            populateNodes(decoded_neuron);
            getConnectionData(inputString);
        }
    });
}

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



function getConnectionData(inputString)
{
    $.ajax(
    {   
        url:"edges.php",
        data: inputString,
        success:function(result) 
        {
            var decoded_connections = JSON.parse(result);

            populateConnections(decoded_connections);
            drawGraph();
        }
    });
}



function populateConnections(decoded_connections) 
{
	
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

function removeGraph()
{
    graph.nodes = [];
    graph.edges= [];
    d3.select("svg").remove();
}

function drawGraph()
{
    var data = 
    {
	'nodes': graph.nodes,
	'edges': graph.edges
    };

    var w = 900;
    var h = 800;

    //Initialize a default force layout, using the nodes and edges from data
    var force = d3.layout.force()
    .nodes(data.nodes)
    .links(data.edges)
    .size([w, h])
    .linkDistance(100)
    .gravity(.05)
    .charge([-120])
    .start();
    

  
    //Create SVG element
    var svg = d3.select("#graph").append("svg")
    .attr("width", w)
    .attr("height", h);


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




    //Every time the simulation "ticks", this will be called
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
}//end of drawGraph function