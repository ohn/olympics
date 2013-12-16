$(function () {
    try {
        $('.section .sub div.swipe, #top, #logo').touchwipe({
            min_move_x: 40,
            min_move_y: 40,
            preventDefaultEvents: true,
            wipeLeft: wipeLeftAthlete,
            wipeRight: wipeRightAthlete,
            wipeUp: wipeUpSection,
            wipeDown: wipeDownSection
        });
	} catch (err) {
		console.log(err);
	}
});



function wipeRightAthlete(result) {
	var curAthlete = $('#top_nav a.active').index('#top_nav a');
	if ( curAthlete != -1) {
		prevAthlete = Math.max( 0, curAthlete-1);
		$('#top_nav a:eq('+prevAthlete+')').trigger('click');
	}
}

function wipeLeftAthlete(result) {
	var curAthlete = $('#top_nav a.active').index('#top_nav a');
	if ( curAthlete != -1) {
		nextAthlete = Math.min( 2, curAthlete+1);
		$('#top_nav a:eq('+nextAthlete+')').trigger('click');
	}
}

function wipeUpSection(result) {
	var curSection = $('#left_nav a.active').index('#left_nav a');
	if ( curSection != -1) {
		prevSection = Math.max( 0, curSection-1);
		$('#left_nav a:eq('+prevSection+')').trigger('click');
	}
}

function wipeDownSection(result) {
	var curSection = $('#left_nav a.active').index('#left_nav a');
	if ( curSection != -1) {
		nextSection = Math.min( $('#left_nav a').length-1, curSection+1);
		$('#left_nav a:eq('+nextSection+')').trigger('click');
	}
}