<?php


/*
The purpose of this script is to:
	1. Connect to the database
	2. Use a query to get the Results so that Nodes can be set for the graph.
	3. The query results are turned into JSON Object for it to be used within the JavaScript file.

 */
	//Opens the database if it exists.
	$db = new SQLite3('NeuronDB.sqlite');
	
	//These variables are used to set the graph to the default view - by Mid-body region.
	$region = "M";
	$soma_region = "n.soma_region = '" . $region . "' ";
	$input = $soma_region;

	//reassigns the new value to the WHERE Clause in the query below. 
	//This was called using AJAX (i.e. the String value from the button on the webpage)
	if(isset($_SERVER['QUERY_STRING']) && $_SERVER['QUERY_STRING'] != '')
	{
	    $input = urldecode($_SERVER['QUERY_STRING']);
	}
	
	//This select statement query selects the distinct values for nodes when neuron1_name from 
	//Connections matches the Neuron name within the Neuron table in order for it to set the nodes
	//on the graph.	
	$neuronNames= $db->query("SELECT DISTINCT n.neuron_name 
					FROM Neuron AS n JOIN Connections AS c 
					ON n.neuron_name = c.neuron1_name 
					WHERE $input
				          ");
	
	//declare an Array variable
	$jsonArray = [];	

	//loop through all the rows and add the results onto the Array.
	while ($row = $neuronNames->fetchArray()) 
	{
		//push elements onto the Array Object.
		array_push($jsonArray, $row);
	}

	//terminate connection
	$db->close();

	//SON encodes the added elements into JSON objects.
	echo json_encode($jsonArray);