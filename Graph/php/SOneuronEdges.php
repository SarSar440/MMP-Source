<?php

	//Opens this database if it exists.
	$db = new SQLite3('NeuronDB.sqlite');
	
	
	//These variables are used to set the graph to the default view - by Mid-body region.
	$region =  "M";
	$soma_region = "n.soma_region ='" . $region . "' ";
	$input = $soma_region;

	//Reassigns the new value to the WHERE Clause in the query below. 
	if(isset($_SERVER['QUERY_STRING']) && $_SERVER['QUERY_STRING'] != '')
	{
		
		$input = urldecode($_SERVER['QUERY_STRING']);
	}
	
	// This query involves multiple joins on both Neuron and Connection tables.
	// These are needed in order to define the edges for this particular graph,
	// the edges must match on the conditions that the source and target nodes also match the neuron_name within NeuronOrganMuscle table.
	$connNeuron= $db->query("SELECT  c.neuron1_name, c.neuron2_name
					FROM NeuronOrganMuscle AS o
					JOIN Neuron AS n ON  n.neuron_name = o.neuron_name
					JOIN Connections AS c ON n.neuron_name =  c.neuron1_name
					WHERE $input AND c.neuron2_name 
					
					IN (SELECT c.neuron2_name 
					FROM NeuronOrganMuscle AS o
					JOIN Neuron AS n ON  n.neuron_name = o.neuron_name
					JOIN Connections AS c ON n.neuron_name =  c.neuron2_name 
					WHERE $input
     					)
				     ");
	//declare array for json
	$jsonArray = [];	

	//loop & populate the data into the array .
	while ($row = $connNeuron->fetchArray()) 
	{
		//push elements onto the end of the array..
		array_push($jsonArray, $row);
	}

	
	$db->close();

	//JSON encodes the added elements into JSON objects.
	echo json_encode($jsonArray);