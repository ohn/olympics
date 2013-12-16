(function ($) {
    var imgList = [];
    $.extend({
        preload: function (imgArr, option) {
            var setting = $.extend({
                init: function (nLoaded, total) { },
                loaded: function (nLoaded, total) { },
                loaded_all: function (nLoaded, total) { }
            }, option);
            var total = imgArr.length;
            var numLoaded = 0;

            setting.init(0, total);
            for (var i in imgArr) {
                imgList.push($("<img />")
					.attr("src", imgArr[i])
					.load(function () {
					    numLoaded++;
					    setting.loaded(numLoaded, total);
					    if (numLoaded == total) {
					        setting.loaded_all(numLoaded, total);
					    }
					})
				);
            }

        }
    });
})(jQuery);


$(function () {
    // don't list any images here refereced by the css files on index.html as it will cause a problem with IE
    $.preload([
		"img/marlen/marlen_qa_bg.jpg",
		"img/jennifer/jen_bio_bg.jpg",
		"img/jennifer/jen_look_bg_vertical.jpg",
		"img/jennifer/jen_look_bg.jpg",
		"img/jennifer/jen_workout_bg.jpg",
		"img/jennifer/jen_recipe_bg.jpg",
		"img/jennifer/jen_recipe_bg_vertical.jpg",
		"img/jennifer/jen_sport_bg.jpg",
		"img/jennifer/jen_sport_bg_vertical.jpg",
		"img/jennifer/jen_watch_bg.jpg",
		"img/jennifer/jen_qa_bg.jpg",
		"img/mary/mary_bio_bg.jpg",
		"img/mary/mary_look_bg_vertical.jpg",
		"img/mary/mary_look_bg.jpg",
		"img/mary/mary_workout_bg.jpg",
		"img/mary/mary_recipe_bg.jpg",
		"img/mary/mary_recipe_bg_vertical.jpg",
		"img/mary/mary_sport_bg.jpg",
		"img/mary/mary_sport_bg_vertical.jpg",
		"img/mary/mary_watch_bg.jpg",
		"img/marlen/marlen_bio_bg.jpg",
		"img/marlen/marlen_look_bg.jpg",
		"img/marlen/marlen_look_bg_vertical.jpg",
		"img/marlen/marlen_workout_bg.jpg",
		"img/marlen/marlen_recipe_bg.jpg",
		"img/marlen/marlen_recipe_bg_vertical.jpg",
		"img/marlen/marlen_sport_bg.jpg",
		"img/marlen/marlen_sport_bg_vertical.jpg",
		"img/marlen/marlen_watch_bg.jpg",
		"img/mary/mary_qa_bg.jpg"
		], {
		    init: function (nLoaded, total) {
		        $('#wrapper').css('overflow','hidden')
		       // $("#loadingtext").html("Loading...");
		    },
		    loaded: function (nLoaded, total) {
		        var loader = 245 - ((nLoaded / total) * 245);
		        var prozent = Math.round(nLoaded / total * 100);
		        $("#loadingtext").html("Loading: " + prozent + "%");
		    },
		    loaded_all: function (nLoaded, total) {
                $("#preloader").animate({ 'marginLeft': '-=356px' }, 500, function () {
                    $(this).delay(500).fadeOut(function () { $('#wrapper').css('overflow','') });
		            rotateBg(1);
		        })
		    }
		});

});