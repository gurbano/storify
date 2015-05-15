module.exports = {
	modal: true,
	width: 800,
	height : 200,
	div: '<input type="text" id="__start"></input> <input type="text" id="__end"></input> <input type="button" id="__button" value="Import"></input><div id="drop_target">&nbsp;</div>',
	init: function() {
		$( "#__start" ).datepicker({ 
			showOtherMonths: true,
      		selectOtherMonths: true});
		$( "#__end" ).datepicker({ 
			showOtherMonths: true,
      		selectOtherMonths: true});
		$( "#__button" ).click(function(){
			var url = "https://maps.google.com/locationhistory/b/0/kml?startTime="+ new Date($( "#__start" ).val()).getTime()+"&endTime="+ new Date($( "#__end" ).val()).getTime();
			window.open(url,'_blank');
		});		
	}
};