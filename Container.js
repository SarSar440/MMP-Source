$(document).ready(function()
{	
	$(".region").hide();
	$(".connectionType").hide();
	$(".partition").hide();
	$("#Container").show();

	$("#Regionbtn").click(function()
	{

	    $(".region").show();
	    $(".connectionType").hide();
	    $(".partition").hide();	
	});


	$("#ConnectionType").click(function()
	{

	    $(".region").hide();
	    $(".connectionType").show();
	    $(".partition").hide();	
	});

	$("#NeuronPosition").click(function()
	{
	    $(".region").hide();
	    $(".connectionType").hide();
		$(".partition").show();	
	});

	


});