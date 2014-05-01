<?php

	//Opens this database if it exists.
	$db = new SQLite3('NeuronDB.sqlite');
	
	//These are default values
	$region = "M";
	$soma_region = "n.soma_region = '" . $region . "' ";
	$input = $soma_region;

	//Re-assigning input statement. 
	if(isset($_SERVER['QUERY_STRING']) && $_SERVER['QUERY_STRING'] != '')
	{
	    $input = urldecode($_SERVER['QUERY_STRING']);
	}

	//Query for displaying neurons, and removing the duplicates by joining the Connection table
	//and then checking all neurons that belong in the Midbody by default
	//
	//This query is for obtaining neurons that exist in the connection neuron_1
	//Neuron1 in Connections is the source node.
	//
	//The joining of the two tables neuron and connections on the condition that neuron name matched neuron1 name
	//
	$neuronNames= $db->query("SELECT  DISTINCT n.neuron_name 
						FROM NeuronOrganMuscle AS o
						JOIN Neuron AS n ON  n.neuron_name = o.neuron_name
						JOIN Connections AS c ON n.neuron_name =  c.neuron1_name
						WHERE $input
					");
	
	//declare an Array variable
	$jsonArray = [];	

	#loop & populate data.
	while ($row = $neuronNames->fetchArray()) 
	{
		#push elements onto the end of the array..
		array_push($jsonArray, $row);
	}

	#terminate connection
	$db->close();

	#JSON encodes the added elements into JSON objects.
	echo json_encode($jsonArray);