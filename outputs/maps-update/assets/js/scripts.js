/*
Author: Steven Kruse
*/

/*
    = Preloader
    = Animated scrolling / Scroll Up
    = Full Screen Slider
    = Sticky Menu
    = Back To Top
    = Countup
    = Progress Bar
    = More skill
    = Shuffle
    = Magnific Popup
    = Vidio auto play
    = Fit Vids

*/

jQuery(function ($) {

    'use strict';
    // Preloader://
    $('#pre-status').fadeOut();
    $('#tt-preloader').delay(350).fadeOut('slow');
    // Animated scrolling / Scroll Up: //
    (function () {
        $('a[href^="#"]').bind("click", function(e){
            var anchor = $(this);
            var target = document.getElementById(anchor.attr('href').slice(1));
            if (!target) return;

            $('html, body').stop().animate({
                scrollTop: $(target).offset().top
            }, 1000);
            e.preventDefault();
        });
    }());
    // Full Screen Slider: //
    (function () {
        $(".tt-fullHeight").height($(window).height());

        $(window).resize(function(){
            $(".tt-fullHeight").height($(window).height());
        });

    }());
    // Sticky Menu: //
    (function () {
        $('.header').sticky({
            topSpacing: 0
        });

        $('body').scrollspy({
            target: '.navbar-custom',
            offset: 70
        })
    }());
    // Back To Top: //
    (function () {
        $(window).scroll(function() {
            if ($(this).scrollTop() > 100) {
                $('.scroll-up').fadeIn();
            } else {
                $('.scroll-up').fadeOut();
            }
        });
    }());
    // Countup: //
    $('.count-wrap').bind('inview', function(event, visible, visiblePartX, visiblePartY) {
        if (visible) {
            $(this).find('.timer').each(function () {
                var $this = $(this);
                $({ Counter: 0 }).animate({ Counter: $this.text() }, {
                    duration: 2000,
                    easing: 'swing',
                    step: function () {
                        $this.text(Math.ceil(this.Counter));
                    }
                });
            });
            $(this).unbind('inview');
        }
    });
    // Progress Bar: //
    $('.skill-progress').bind('inview', function(event, visible, visiblePartX, visiblePartY) {
        if (visible) {
            $.each($('div.progress-bar'),function(){
                $(this).css('width', $(this).attr('aria-valuenow')+'%');
            });
            $(this).unbind('inview');
        }
    });
    // More Skill: //
    $('.more-skill').bind('inview', function(event, visible, visiblePartX, visiblePartY) {
        if (visible) {
            $('.chart').easyPieChart({
                easing: 'easeOut',
                delay: 3000,
                barColor:'#68c3a3',
                trackColor:'rgba(255,255,255,0.2)',
                scaleColor: false,
                lineWidth: 8,
                size: 140,
                animate: 2000,
                onStep: function(from, to, percent) {
                    this.el.children[0].innerHTML = Math.round(percent);
                }

            });
            $(this).unbind('inview');
        }
    });
    // Shuffle: //
    (function () {

        var $grid = $('#grid');

        $grid.shuffle({
            itemSelector: '.portfolio-item'
        });

        $('#filter a').click(function (e) {
            e.preventDefault();

            $('#filter a').removeClass('active');
            $(this).addClass('active');

            var groupName = $(this).attr('data-group');

            $grid.shuffle('shuffle', groupName );
        });


    }());
    // Magnific Popup: //
    $('.ux-process-link').magnificPopup({
        type: 'iframe',
        mainClass: 'ux-process-popup',
        fixedContentPos: true,
        focus: '.mfp-close',
        closeMarkup: '<button type="button" class="mfp-close" title="%title%" aria-label="Close UX Process">&#215;</button>',
        iframe: {
            markup: '<div class="mfp-iframe-scaler">' +
                '<div class="ux-process-dialog-header"><h2>My UX Process</h2><div class="mfp-close"></div></div>' +
                '<iframe class="mfp-iframe" src="about:blank" title="My UX Design Process" frameborder="0"></iframe>' +
                '</div>'
        },
        callbacks: {
            open: function () {
                this.wrap.attr({
                    role: 'dialog',
                    'aria-modal': 'true',
                    'aria-label': 'My UX Process'
                });
                // Escape also closes the dialog while focus is inside its page.
                this.content.find('iframe').on('load', function () {
                    this.contentDocument.addEventListener('keydown', function (event) {
                        if (event.key === 'Escape' || event.keyCode === 27) {
                            event.preventDefault();
                            $.magnificPopup.close();
                        }
                    });
                });
            },
            close: function () {
                this.wrap.removeAttr('role aria-modal aria-label');
            }
        }
    });

   (function () {
      $('.image-link').magnificPopup({

        gallery: {
          enabled: true
        },
        removalDelay: 300, 
        mainClass: 'mfp-with-zoom',
        type:'image'
      });

    }());



    (function () {
        $('.popup-video').magnificPopup({
            disableOn: 700,
            type: 'iframe',
            mainClass: 'mfp-with-zoom',
            removalDelay: 300,
            preloader: false,
            fixedContentPos: false
        });
    }());
    // Fit Vids: //
    (function () {
        $(".video-container").fitVids();
    }());
    // Vidio auto play: //
    (function () {
    
    /* Vimeo API: http://developer.vimeo.com/player/js-api */
    
        var iframe = document.getElementById('nofocusvideo');
        if (!iframe || typeof window.$f !== 'function') return;

        var player = window.$f(iframe);

        $('.modal').on('hidden.bs.modal', function () {
        player.api('pause');
        })

        $('.modal').on('shown.bs.modal', function () {
        player.api('play');
        })
    }());
    // STELLAR FOR BACKGROUND SCROLLING: //
    $(window).load(function() {

        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
         
        }else {
            $.stellar({
                horizontalScrolling: false,
                responsive: true
            });
        }

    });
    // WOW JS: //
    (function () {

        new WOW({

            mobile:  false

        }).init();

    }());
    // Contact Form: //
    $('#contactForm').on('submit',function(e){

        e.preventDefault();

        var $action = $(this).prop('action');
        var $data = $(this).serialize();
        var $this = $(this);

        $this.prevAll('.alert').remove();

        $.post( $action, $data, function( data ) {

            if( data.response=='error' ){

                $this.before( '<div class="alert alert-danger">'+data.message+'</div>' );
            }

            if( data.response=='success' ){

                $this.before( '<div class="alert alert-success">'+data.message+'</div>' );
                $this.find('input, textarea').val('');
            }

        }, "json");

    });
});






