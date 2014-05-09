
//When the Dom has been loaded
//show and hide buttons.
//Call the functions when the buttons are pressed.
$(document).ready(function()
{	
	$('#HRegionSort').hide();
	$('#MRegionSort').hide();
	$('#TRegionSort').hide();
	$('#showRegion').hide();	
	$('#showRegion').show();

	
	
	$("#head").click(function()
	{
	   $('#MRegionSort').hide();
	   $('#TRegionSort').hide();

	   $('#HRegionSort').show();

	});

	$("#mid").click(function()
	{
	   $('#TRegionSort').hide();
	   $('#HRegionSort').hide();

	   $('#MRegionSort').show();
	});

	$("#tail").click(function()
	{
	   $('#HRegionSort').hide();
	   $('#MRegionSort').hide();

	   $('#TRegionSort').show();
	});

	/*Sensory Organs and Body Muscle html*/
	$('#soRegions').hide();
	$('#muscleRegions').hide();
	$('#byRegion').show();
	
	$("#sensory").click(function()
	{
	   $('#muscleRegions').hide();
	   $('#soRegions').show();
	 
	});

	$("#muscle").click(function()
	{
	   $('#soRegions').hide();
	   $('#muscleRegions').show();
	});

});