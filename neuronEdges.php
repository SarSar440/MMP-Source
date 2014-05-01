<?php

	#Opens this database if it exists.
	$db = new SQLite3('NeuronDB.sqlite');
	
	
	//Default variables to be set with sql
	$region =  "M";
	$soma_region = "n.soma_region ='" . $region . "' ";
	$input = $soma_region;

	//Re-assigning variable values into the WHERE statement. 
	if(isset($_SERVER['QUERY_STRING']) && $_SERVER['QUERY_STRING'] != '')
	{
		
		$input = urldecode($_SERVER['QUERY_STRING']);
	}

	
	//Query-  selects neuron1 and neuron2 and gets its neurons that are in the M region , and the target node being in the inner select
	//The inner Select selects neuron2 for the target node which is in the M region
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