var rotateBg = function (counter) {
    var targetOut = '#background-image-' + (counter + 1);
    var targetIn = '#background-image-' + (((counter + 1) % 3) + 1);
    var out$ = $(targetOut);
    var in$ = $(targetIn);
    in$.css('z-index', 2996).show()
    out$.css('z-index', 2997).fadeOut(450)
    setTimeout(function () {
        rotateBg((counter + 1) % 3);
    }, 4000);
}