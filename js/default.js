var Covergirl = {
    selectors: {
        content: '#content',
        topnav_link: '#top_nav a',
        leftnav_link: '#left_nav a'
    },
    config: {
        minH: 640,
        maxH: 803,
        footH: $('div#bottom').height(),
        touch: Modernizr.touch
    },
    initScroll: function (firstClass) {
        $.localScroll.defaults.axis = 'xy';
        $.localScroll.hash({
            target: '#content', 
            queue: true,
            duration: 0
        });

        $.localScroll({
            target: '#content', 
            queue: true,
            duration: 1000,
            hash: true,
            onBefore: function (e, anchor, $target) {
                // The 'this' is the settings object, can be modified
				// The 'this' contains the scrolled element (#content)				
            },
            onAfter: function (anchor, settings) {
               
            }
        });
        $('.section .sub').css({ 'background-position': ' 0 0' })
    },
    topnavOnClick: function () {
        $(Covergirl.selectors.topnav_link).live('click', function (e) {
            e.preventDefault();
			
            // high-light the nav
            $(Covergirl.selectors.topnav_link).removeClass('active');
            $(this).addClass('active');

            // pass the href value to left nav
            var sectionID = $(this).attr('href');
            Covergirl.updateLeftnavURL(sectionID);	
			
			var athlete = sectionID.split('_')[0];
			athlete = athlete.substring(1);
			
			if ($.browser.msie  && parseInt($.browser.version, 10) === 7) {				
				$('.video-player iframe').remove();
				Covergirl.loadVideos(athlete);
			}	
			else {
				Covergirl.stopVideos();	
				$('#'+ athlete+'_watch #videos #vid1 span').click();
			}
			
			
        });
    },
    updateLeftnavURL: function (section) {
        var SectionName = section.split('_')[0]; //grab the section name before _

        $(Covergirl.selectors.leftnav_link).each(function (i) {//for each left nav link			
            var href = $(this).attr('href').split('_')[1]; //grab the sub-section name after _
            $(this).attr("href", SectionName + '_' + href); //new href = current section + sub section
        });
    },
    leftnavOnClick: function () {
        $(Covergirl.selectors.leftnav_link).live('click', function (e) {
            e.preventDefault();					
			
            $(Covergirl.selectors.leftnav_link).removeClass('active');
            $(this).addClass('active');

            /* pass the href value to top nav */
            var sectionID = $(this).attr('href');
            Covergirl.updateTopnavURL(sectionID);
			
			var athlete = sectionID.split('_')[0];
			athlete = athlete.substring(1);
			
			if ($.browser.msie  && parseInt($.browser.version, 10) === 7) {				
				$('.video-player iframe').remove();
				Covergirl.loadVideos(athlete);
			}	
			else {
				Covergirl.stopVideos();
				$('#'+ athlete+'_watch #videos #vid1 span').click();
			}			
			
        });
    },
    updateTopnavURL: function (section) {
        var subSection = section.split('_')[1]; //grab the sub section name after _

        $(Covergirl.selectors.topnav_link).each(function (i) {//for each top nav link			
            var href = $(this).attr('href').split('_')[0]; //grab the section name before _
            $(this).attr("href", href + '_' + subSection); //new href = current section + sub section
        });
    },
    activateNav: function () {
        if (window.location.hash) {
            var hash = window.location.hash.substring(1); //Puts hash in variable, and removes the # character
            var section = hash.split('_')[0]; //grab the section name before _
            var subsection = hash.split('_')[1]; //grab the sub-section name after _

            $('#main_nav li a').removeClass('active'); //remove the active class from all links first
            $('#main_nav li#' + section + ' a').addClass('active'); //set active to the active section

            $('#subsection_nav li a').removeClass('active'); //remove the active class from all links first
            $('#subsection_nav li#' + subsection + ' a').addClass('active'); //set active to the active section

            $(Covergirl.selectors.leftnav_link).each(function (i) {//for each left nav link			
                var href = $(this).attr('href').split('_')[1]; //grab the sub-section name after _
                $(this).attr("href", '#' + section + '_' + href); //new href = current section + sub section
            });

            $(Covergirl.selectors.topnav_link).each(function (i) {//for each top nav link			
                var href = $(this).attr('href').split('_')[0]; //grab the section name before _
                $(this).attr("href", href + '_' + subsection); //new href = current section + sub section
            });

            //load ajax content on page load            
			var target = "#" + hash;
            var filename = section + '.html';			

            Covergirl.loadContent(target, filename, subsection);
        }
		else {
			//if there's no hash value, load the first content by default
			Covergirl.loadContent('#marlen_story', 'marlen.html', 'story');				
		}
    },
    loadContent: function (target, filename, section) {
        if($(target).hasClass('loaded')) return;
        $(target + ' .info').load(filename + ' .' + section, function (response, status, xhr) {
            if (status == 'error') {
				try {
					console.log('Error loading ', athlete, section, xhr.status, xhr.statusText);
				} catch(e) { };
                
            } else {
				$(target).addClass('loaded');
               	
				var sectionID = filename.substring(0,filename.length-5)+'_'+section;
				var athlete = sectionID.split('_').slice(0, 1);
				
				//set up flexible scroll
				fleXenv.initByClass("flexcroll");
												
				//set up tabs for Watch 														
				Covergirl.initTabs(sectionID);
				
				//set up photo gallery - if not initialized already			
				if(!$('#' + athlete + '-gallery').hasClass('initialized')) {					
					Covergirl.initCycleWithThumbs(athlete + '-gallery', athlete + '-gallery-prev', athlete + '-gallery-next');
				}
				
				//set up videos - if not initialized already	
				if(!$('#' + athlete + '-video').hasClass('called')) {
					Covergirl.loadVideos(athlete);
				}
								
				//set up overlay for the Look
				$('.jqModal').click( function(e) {
					e.preventDefault();
					$('body').append($('.jqmWindow'));
					$("#look-modal").jqm({
					  modal:false, 
					  onHide: function(e) { 
						e.w.hide(); // Hide window
						e.o.remove(); // Remove overlay
					  }
					}).jqmShow();
				});
				
				//set up workout photo gallery - if not initialized already			
				if(!$('#' + athlete + '-workout').hasClass('initialized')) {					
					Covergirl.initCycleWithControls(athlete + '-workout', athlete + '-prev', athlete + '-next', athlete + '-nav');
				}	
            }
        });
		
		//add banner for story pages
		if($(target).hasClass('story')) $(target).append('<div class="banner" />');
    },	
	loadVideos: function(athlete) {		
		$('#'+ athlete+'-video').addClass('called');
		var vids = {};
		
		switch($.trim(athlete))
		{
			case "marlen":		  
			  vids = {
			      vid1: "YUx-8bjB0c4",
			      vid2: "xHezYzYiVcE",
			      vid3: "7UVqUVXnMsQ",
			      vid4: "7DIGLIG6xkw"
				}
			  break;
			case "jennifer":		  
			  vids = {
			      vid1: "hxHGztSjlsA",	
			      vid2: "7UVqUVXnMsQ",
			      vid3: "7DIGLIG6xkw"				
				} 
			  break;
			case "mary":		  
			  vids = {
			      vid1: "RpmN74tTQ1E",
			      vid2: "7UVqUVXnMsQ",
			      vid3: "7DIGLIG6xkw"
				} 
			  break;
		}		
		
		var iframe = $("<iframe>").attr("src", "http://www.youtube.com/embed/" +vids[this.id]).attr("id", "vid");
		iframe.appendTo($('#'+ athlete+'-video:eq(0)'));		
		
		$('#'+ athlete+'_watch #videos .thumb-nav li').click(function(e) {			
			$('#'+ athlete+'_watch #videos .thumb-nav li').removeClass('activeSlide');
			$(this).addClass('activeSlide');			
			$('#'+ athlete+'-video #vid').attr("src","http://www.youtube.com/embed/" +vids[this.id]);
		});  
		$('#'+ athlete+'_watch #videos #vid1 span').click();	
	},
	stopVideos: function() {		
		$('#videos iframe').attr("src","about:blank");
	},
	initCycleWithThumbs: function(selector, prev, next) {
		$('#' + selector).addClass('initialized').after('<div id="'+selector+'-thumbs" class="thumb-nav-container"><ul class="thumb-nav">').cycle({
			fx:     'scrollHorz',
			prev:   $('#' + prev),
			next:   $('#' + next),
			speed:  500,
			before: Covergirl.onAfter,
			after:   Covergirl.onAfter,
			timeout: 0,
			pager:  '#'+selector+'-thumbs .thumb-nav',
			pagerAnchorBuilder: function(idx, slide) {				
				//if gallery
				if (selector.toLowerCase().indexOf("gallery") >= 0) {
					var imgsource=slide.src;
										
				}
				//if video
				else if(selector.toLowerCase().indexOf("video") >= 0)
				{
					var athlete = selector.split('-').slice(0, 1);
					var vid = slide.id;					
					var imgsource='img/'+ athlete +'/video/'+ vid +'.jpg';			
				}
				
				var new_src = imgsource.substring(0,imgsource.length-4);				
				new_src += "_thumb";				
				new_src += imgsource.substring(imgsource.length-4,imgsource.length);								  				
				return '<li><a href="#"><img src="' + new_src + '" width="107" height="45" /></a><span class="overlay"></span></li>';
			},
			fit: 1
		});	
		//set up thumb carousel for page load
		Covergirl.thumbCarousel(selector, prev, next);
		
		
		//call it again on ipad orientation change - to load the corret number of thumbs
		$(window).bind('orientationchange', function(event) {			
			Covergirl.thumbCarousel(selector, prev, next);
		});
	},
	onAfter: function (curr, next, opts) {			
		//add slide count
		var caption = (opts.currSlide + 1) + ' of ' + opts.slideCount;	
		opts.next.parent().parent().find('.caption').html(caption);						
		
		//disable/enable prev/next buttons - I'm applying to ALL prev/next controls
		var index = opts.currSlide;
		$('.prev-control')[index == 0 ? 'hide' : 'show']();
		$('.next-control')[index == opts.slideCount - 1 ? 'hide' : 'show']();
	},
	thumbCarousel: function(selector, prev, next) {						
		var step = 1; 
		var current = 0; 
		var maximum = $('#'+ selector +'-thumbs.thumb-nav-container ul li').size(); 
		var visible; 
		var windowWidth = $(window).width();
		if(windowWidth <= 768) {
			visible = 4;
		} else {
			visible = 5;
		}
		var speed = 200; 
		var liSize = 116;
		var carousel_height = 45;
		var ulSize = liSize * maximum;   
		var divSize = liSize * visible;  
		
		$('#'+ selector +'-thumbs.thumb-nav-container ul').css("width", ulSize+"px").css("left", -(current * liSize)).css("position", "absolute");

		$('#'+ selector +'-thumbs.thumb-nav-container').css("width", divSize+"px").css("height", carousel_height+"px").css("visibility", "visible").css("overflow", "hidden").css("position", "relative"); 
		
		$('#' + next).click(function() { 			
			if(current + step < 0 || current + step > maximum - visible) {return; }
			else {
				current = current + step;
				$('#'+ selector +'-thumbs.thumb-nav-container ul').animate({left: -(liSize * current)}, speed, null);
			}
			return false;
		});
		
		$('#' + prev).click(function() { 									
			if(current - step < 0 || current - step > maximum - visible) {return; }
			else {				
				current = current - step;
				$('#'+ selector +'-thumbs.thumb-nav-container ul').animate({left: -(liSize * current)}, speed, null);
			}
			return false;
		});
	},
	initCycleWithControls: function(selector, prev, next, nav) {
		$('#' + selector).addClass('initialized').cycle({
					fx:      'scrollHorz',
					timeout:  0,
					speed:  500,
					prev:    $('#' + prev),
					next:    $('#' + next),
					pager:   $('#' + nav),
					pagerAnchorBuilder: Covergirl.pagerFactory
				});	
	},
	pagerFactory: function(idx, slide) {			
			return '<li><a href="#">'+(idx+1)+'</a></li>';
		},	
	flexCrollInit: function (id) {		
		fleXenv.fleXcrollMain(id);								
		var myDiv=$('#' + id);
		if(myDiv!=null && myDiv.scrollUpdate) myDiv.scrollUpdate();	
	},
	initTabs: function(sectionID) {							
			$('#'+ sectionID +' .tab-nav').find('a:eq(0)').addClass('active');
			$('#'+ sectionID +' #tab-container').find('> div:eq(0)').nextAll().hide();
			$('#'+ sectionID +' #tab-container > div:eq(0)').show();	
			
			$('#'+ sectionID +' .tab-nav a').each(	
				function( intIndex ){			 
					$(this).bind (
					"click",
					function(event){
						event.preventDefault();	 									
						$('#'+ sectionID +' .tab-nav a').removeClass();
						$('#'+ sectionID +' #tab-container > div').hide();
						$(this).addClass('active');
						var index = $('#'+ sectionID +' .tab-nav a').index(this);	 
						$('#'+ sectionID +' #tab-container > div:eq('+index+')').show();						
						var activeTab = $(this).text();					
						$(this).parent().parent().find('h2 span.satellite-pink').text(activeTab);
						
						var athlete = sectionID.split('_')[0];	
						
						//stop and reload videos
						Covergirl.stopVideos();
						$('#'+ athlete+'_watch #videos #vid1 span').click();
					});			 
				}			 
			);				
	},
    updateLayout: function () {
        var height = $(window).height(), width = $(window).width(), footH = Covergirl.config.footH
        if (height < Covergirl.config.minH) {            
			//$('#bottom').css('top', Covergirl.config.minH - footH);			
			$('#bottom').css('top', Covergirl.config.minH);
        } else if (height > Covergirl.config.maxH) {            
			$('#bottom').css('top', Covergirl.config.maxH - footH);
        } else {			
            $('#bottom').css('top', height - footH)
        }

        $("#logo, #top, #content, #bottom, #call-outs, .home-caption").delay(500).fadeIn("slow");
    }
}

var CGLoader = {
	selectors: {
		topnav_link: '#top_nav a',
		leftnav_link: '#left_nav a'
	},
	navOnClick: function() {
	
		$(CGLoader.selectors.leftnav_link + ', '  + CGLoader.selectors.topnav_link).bind('click', function(e) { 
			//console.log('attaching click event', $(this));			e.preventDefault();
			var target =  $(this).attr('href');
			var aInfo = target.split('_');
			var filename = aInfo[0].substring(1, aInfo[0].length) + '.html'
			var section = aInfo[1];
						
			Covergirl.loadContent(target, filename, section);
			
		});
	}
}
if (Covergirl.config.touch) {
    $('.section .sub').append('<div class="swipe" />')
    $.getScript("js/touchWipeSetup.js", function (data, textStatus, jqxhr) {
		try {
			console.log(data); //data returned
			console.log(textStatus); //success
			console.log(jqxhr.status); //200
			console.log('Load was performed.');
		} catch(e) {}
        
    });
}



/* DOM ready calls */
$(function () {
	$('.section .sub').append('<div class="info" />');
	
	Covergirl.initScroll();
	Covergirl.topnavOnClick();
	Covergirl.leftnavOnClick();
	Covergirl.activateNav();
	
	CGLoader.navOnClick();
	
	setInterval("Covergirl.updateLayout()", 400);
	//  Add 'touch' class to body for ipad specific styles - ':hover'
	    if (Covergirl.config.touch) {
	        window.onorientationchange = function () {	       
			if (window.location.hash) {
				//if you are NOT on the landing page, need to prevent scrolling when you click on the tab on orientation change
				$('.tab-nav a').each(	
					function( intIndex ){			 
						$(this).bind (
						"click",
						function(event){							
							event.stopImmediatePropagation();
						});			 
					}			 
				);
			}
			Covergirl.initScroll();			
	    }
        $('body').addClass('touch')
    }
	
	
	
	
});



    











