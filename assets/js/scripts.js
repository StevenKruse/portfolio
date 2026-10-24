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
    $('a[title]').tooltips();
    // Preloader://
    $('#pre-status').fadeOut();
    $('#tt-preloader').delay(350).fadeOut('slow');
    // Animated scrolling / Scroll Up: //
    (function () {
        $('a[href^="#"]').bind("click", function(e){
            var anchor = $(this);
            if (anchor.closest('#filter').length) return;
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
    // Play the decorative home video unless the visitor prefers reduced motion. //
    (function () {
        var video = document.querySelector('.home-background-video');
        if (!video) return;

        var motionPreference = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
        video.muted = true;

        function updatePlayback() {
            if (document.hidden || (motionPreference && motionPreference.matches)) {
                video.pause();
                return;
            }

            var playback = video.play();
            if (playback && playback.catch) {
                playback.catch(function () {
                    // Keep the poster visible if the browser cannot play the video.
                });
            }
        }

        document.addEventListener('visibilitychange', updatePlayback);
        if (motionPreference) {
            if (motionPreference.addEventListener) {
                motionPreference.addEventListener('change', updatePlayback);
            } else if (motionPreference.addListener) {
                motionPreference.addListener(updatePlayback);
            }
        }
        updatePlayback();
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
    // Skill bars, counters, and charts — once, as each block enters view.
    (function () {
        var motionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

        function reducedMotion() {
            return !!(motionQuery && motionQuery.matches);
        }

        function setBarWidths(root, animate) {
            var bars = (root || document).querySelectorAll('.progress-bar');
            Array.prototype.forEach.call(bars, function (bar, index) {
                var value = bar.getAttribute('aria-valuenow');
                if (!value || bar.getAttribute('data-bar-set') === '1') return;
                bar.setAttribute('data-bar-set', '1');
                var apply = function () {
                    bar.style.width = value + '%';
                };
                if (!animate || reducedMotion()) {
                    bar.style.transition = 'none';
                    apply();
                    return;
                }
                window.setTimeout(apply, Math.min(index, 9) * 70);
            });
        }

        function countUp(wrap) {
            $(wrap).find('.timer').each(function () {
                var $this = $(this);
                var target = $.trim($this.text());
                if ($this.data('counted')) return;
                $this.data('counted', true);
                if (reducedMotion()) return;
                $({ Counter: 0 }).animate({ Counter: target }, {
                    duration: 1600,
                    easing: 'swing',
                    step: function () {
                        $this.text(Math.ceil(this.Counter));
                    },
                    complete: function () {
                        $this.text(target);
                    }
                });
            });
        }

        function drawCharts(animate) {
            var $charts = $('.more-skill .chart');
            if (!$charts.length || $charts.data('drawn')) return;
            $charts.data('drawn', true);
            if (!animate || reducedMotion()) {
                $charts.each(function () {
                    var percent = parseFloat($(this).attr('data-percent'));
                    if (!isNaN(percent)) $(this).find('.percent').text(Math.round(percent));
                });
            }
            $charts.easyPieChart({
                easing: 'easeOut',
                delay: 3000,
                barColor:'#68c3a3',
                trackColor:'rgba(255,255,255,0.2)',
                scaleColor: false,
                lineWidth: 8,
                size: 140,
                animate: (!animate || reducedMotion()) ? false : 1600,
                onStep: function(from, to, percent) {
                    this.el.children[0].innerHTML = Math.round(percent);
                }
            });
        }

        function watch(selector, onEnter) {
            var nodes = document.querySelectorAll(selector);
            if (!nodes.length) return;
            if (window.IntersectionObserver) {
                var observer = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        if (!entry.isIntersecting) return;
                        onEnter(entry.target);
                        observer.unobserve(entry.target);
                    });
                }, { rootMargin: '0px 0px -8% 0px', threshold: 0.15 });
                Array.prototype.forEach.call(nodes, function (node) {
                    observer.observe(node);
                });
                return;
            }
            $(nodes).bind('inview', function (event, visible) {
                if (!visible) return;
                onEnter(this);
                $(this).unbind('inview');
            });
        }

        if (reducedMotion()) {
            setBarWidths(document, false);
            drawCharts(false);
        } else {
            watch('#skills', function () {
                setBarWidths(document.getElementById('skills'), true);
            });
            watch('.more-skill', function () {
                drawCharts(true);
            });
        }
        watch('.count-wrap', countUp);
    }());
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
    // Reveal cards once as they enter view, including during section navigation. //
    (function () {
        if (!$('body').hasClass('portfolio-page')) {
            if (typeof window.WOW === 'function') new WOW({ mobile: false }).init();
            return;
        }

        var motionPreference = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
        if (!window.IntersectionObserver || (motionPreference && motionPreference.matches)) return;

        // Observe the inner gallery frame, leaving Shuffle's item transforms alone.
        // A panel's children share its reveal instead of animating a second time.
        var $cards = $('.portfolio-page .glass-panel, .portfolio-page .portfolio-bg, .portfolio-page .section-title, .portfolio-page .resume-title').filter(function () {
            return !$(this).closest('#home, .modal').length && !$(this).parents('.glass-panel').length;
        });
        var observer = new IntersectionObserver(function (entries) {
            var visible = entries.filter(function (entry) {
                return entry.isIntersecting && !$(entry.target).closest('.portfolio-item.concealed').length;
            }).sort(function (first, second) {
                return first.boundingClientRect.top - second.boundingClientRect.top || first.boundingClientRect.left - second.boundingClientRect.left;
            });
            var rowTop = null;
            var rowIndex = 0;

            visible.forEach(function (entry) {
                if (rowTop === null || Math.abs(entry.boundingClientRect.top - rowTop) > 24) {
                    rowTop = entry.boundingClientRect.top;
                    rowIndex = 0;
                }
                entry.target.style.setProperty('--reveal-delay', Math.min(rowIndex++, 3) * 75 + 'ms');
                entry.target.classList.add('is-revealed');
                observer.unobserve(entry.target);
            });
        }, { rootMargin: '0px 0px -32px 0px', threshold: 0 });

        $cards.addClass('scroll-reveal').each(function () {
            observer.observe(this);
        });

        // Recheck unseen thumbnails when filtering moves them into the viewport.
        $('#grid').on('layout.shuffle.cardReveal filtered.shuffle.cardReveal', function () {
            $(this).find('.scroll-reveal:not(.is-revealed)').each(function () {
                observer.unobserve(this);
                observer.observe(this);
            });
        });

        // Keyboard focus should never land in a transparent card.
        $cards.on('focusin.cardReveal', function () {
            this.classList.remove('scroll-reveal');
            this.classList.add('is-revealed');
            observer.unobserve(this);
        });

        function stopRevealing(event) {
            if (!event.matches) return;
            observer.disconnect();
            $cards.removeClass('scroll-reveal').off('.cardReveal');
            $('#grid').off('.cardReveal');
        }

        if (motionPreference) {
            if (motionPreference.addEventListener) {
                motionPreference.addEventListener('change', stopRevealing);
            } else if (motionPreference.addListener) {
                motionPreference.addListener(stopRevealing);
            }
        }

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






