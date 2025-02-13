
$(document).ready(function() {
    // Banner Slider
      $('.banner-slider').owlCarousel({
        items: 1,
        loop: true,
        margin: 10,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
        animateOut: 'fadeOut',
      });
    // Location Slider
      $('#content-slider').owlCarousel({
        items: 5,
        loop: true,
        margin: 16,
        nav : true,
        navText:[
              "<i class='fa fa-angle-left   owl__nav-icon'>",
              "<i class='fa fa-angle-right  owl__nav-icon'>"
              ],
        responsive:{
            0:{
                items:2
            },
            600:{
              items:3
            },
            768:{
                items:3
            },
            1024:{
              items:4         
            },
            1239:{
                items:5
            }
        }
      });
    // Promotion Slider  
    $('#promotion-slider').owlCarousel({
      items:1,
      margin:10,
      autoHeight:true,
      responsive:{
        0:{
            items:1
        },
        600:{
          items:1
        },
        768:{
            items:1
        },
        1024:{
          items:3      
        },
      }
    });
    // Suggest Slider 
    $('#suggest-slider').owlCarousel({
      items: 1,
      loop: true,
      margin: 16,
      nav : true,
      autoplay: true,
      animateIn : 'animate__slideInLeft',
      animateOut : 'animate__slideOutRight',
      autoplayTimeout: 4000,
      autoplayHoverPause: true,
      navText:[
            "<i class='fa fa-angle-left   owl__nav-icon'>",
            "<i class='fa fa-angle-right  owl__nav-icon'>"
            ],
      responsive:{
          0:{
              items:1
          },
          600:{
            items:1
          },
          768:{
              items:1
          },
          1024:{
            items:1        
          },
          1239:{
              items:1
          }
      }
    });
    //Row Slider
    $('.row-three-banner').owlCarousel({
      center: true,
      items:3,
      loop:true,
      margin:10,
      responsive:{
        0:{
            items:1.5
        },
        600:{
          items:2
        },
        768:{
            items:2
        },
        1024:{
          items:3
        },
        1239:{
            items:3
        }
    }
  });
    //NEWS SLIDER
    $('.News-Content').owlCarousel({

      items:4,
      loop:true,
      nav:true,
      margin:15,
      responsive:{
        0:{
            items:1
        },
        600:{
          items:2
        },
        768:{
            items:2
        },
        1024:{
          items:3
        },
        1239:{
            items:4
        }
    }
  });
  // product slider
    $('.slider').owlCarousel({
      items:1,
      loop:true,
      margin:30,
      animateIn : 'animate__slideInLeft',
      animateOut : 'animate__slideOutRight',
      nav:true,
      autoplayTimeout:20000,
      autoplayHoverPause:true,
      responsive:{
        0:{
            items:2
        },
        600:{
          items:2
        },
        768:{
            items:3
        },
        1024:{
          items:4     
        },
        1239:{
            items:5
        }
    }
  });

  // product slider
  $('.product-other').owlCarousel({
    items:1,
    loop:true,
    margin:30,
    animateIn : 'animate__slideInLeft',
    animateOut : 'animate__slideOutRight',
    nav:true,
    autoplayTimeout:20000,
    autoplayHoverPause:true,
    responsive:{
      0:{
          items:1
      },
      600:{
        items:2
      },
      768:{
          items:3
      },
      1024:{
        items:4        
      },
      1239:{
          items:5
      }
  }
});

    // Suggest Slider 
    $('#suggest-slider-2').owlCarousel({
      items: 1,
      loop: true,
      margin: 16,
      nav : true,
      autoplay: true,

      autoplayTimeout: 3000,
      autoplayHoverPause: true,
      navText:[
            "<i class='bx bx-chevron-left   owl__nav-icon'>",
            "<i class='bx bx-chevron-right  owl__nav-icon'>"
            ],
      responsive:{
          0:{
              items:1
          },
          600:{
            items:1
          },
          768:{
              items:1
          },
          1024:{
            items:1        
          },
          1239:{
              items:1
          }
      }
    });
    // Explore Slider
    $('#explore-slider').owlCarousel({
      items: 3,
      loop: true,
      margin: 16,
      nav: true,
      navText:[
            "<i class='fa fa-angle-left   owl__nav-icon'>",
            "<i class='fa fa-angle-right  owl__nav-icon'>"
            ],
      responsive:{
          0:{
              items:1
          },
          600:{
            items:1
          },
          768:{
              items:2
          },
          1024:{
            items:3        
          },
          1239:{
              items:3
          }
      }
    });
    // Tutorial Slider  
    $('#tutorial-slider').owlCarousel({
      items: 3,
      loop: true,
      margin: 16,
      nav: true,
      navText:[
        "<i class='fa fa-angle-left   owl__nav-icon'>",
        "<i class='fa fa-angle-right  owl__nav-icon'>"
        ],
      responsive:{
        0:{
            items:1
        },
        600:{
          items:1
        },
        768:{
            items:2
        },
        1024:{
          items:3      
        },
      }
    });
    // 
    });
    
    // Move on Top
    $(window).scroll(function() {
        if ($(this).scrollTop() >= 300) {
          $('.move-on-top-btn').fadeIn();
        }
        else{
          $('.move-on-top-btn').fadeOut();
        }
    });
    
    $('.move-on-top-btn').click(function() {
      $('html, body').animate({scrollTop: 0}, 1500);
    });
      