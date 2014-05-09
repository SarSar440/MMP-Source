<?php

	//Opens this database if it exists.
	$db = new SQLite3('NeuronDB.sqlite');
	
	
	//These variables are used to set the graph to the default view - by Mid-body region.
	$region =  "M";
	$soma_region = "n.soma_region ='" . $region . "' ";
	$input = $soma_region;

	//reassigns the new value to the WHERE Clause in the query below. 
	//This was called using AJAX (i.e. the String value from the button on the webpage)
	if(isset($_SERVER['QUERY_STRING']) && $_SERVER['QUERY_STRING'] != '')
	{
		
		$input = urldecode($_SERVER['QUERY_STRING']);
	}
	
	//This Query is used to get the results for the edge's Source and Target nodes:
	//The first select is to obtain the source node, and the second for target node.
	$connNeuron= $db->query("SELECT c.neuron1_name, c.neuron2_name 
					FROM Neuron AS n JOIN Connections AS c 
					ON n.neuron_name = c.neuron1_name 
					WHERE $input AND c.neuron2_name 
					

					IN (SELECT c.neuron2_name 
					       FROM Neuron AS n 
					       JOIN Connections AS c ON n.neuron_name = c.neuron2_name 
					       WHERE $input
					    ) 
				     ");
	
	//declare a variable  for json
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