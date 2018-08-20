$(document).ready(function() {

  /*
   ** Range slider (last section)
   */

  // Accessible Water
  var slider_water = document.getElementById("slider-water");
  var rangeMaxVal_water = $(slider_water).prop('max');

  

  // Default value
  $(slider_water).siblings('.count').text($(slider_water).val() + ' mm').css({
    'left': $(slider_water).val() * (100 / rangeMaxVal_water) + '%',
    'transform': 'translateX(-' + $(slider_water).val() * (100 / rangeMaxVal_water) + '%)'
  });
  $(slider_water).siblings('.fill').css('width', $(slider_water).val() * (100 / rangeMaxVal_water) + '%');

  slider_water.oninput = function() {
    $(this).siblings('.count').text(this.value + ' mm').css({
      'left': this.value * (100 / rangeMaxVal_water) + '%',
      'transform': 'translateX(-' + this.value * (100 / rangeMaxVal_water) + '%)'
    });
    $(this).siblings('.fill').css('width', this.value * (100 / rangeMaxVal_water) + '%');
    console.log(this.value);
  }

  // Carbon Level
  var slider_carbon = document.getElementById("slider-carbon");
  var rangeMaxVal_carbon = $(slider_carbon).prop('max');

  // Default value
  $(slider_carbon).siblings('.count').text($(slider_carbon).val() + ' g').css({
    'left': $(slider_carbon).val() * (100 / rangeMaxVal_carbon) + '%',
    'transform': 'translateX(-' + $(slider_carbon).val() * (100 / rangeMaxVal_carbon) + '%)'
  });
  $(slider_carbon).siblings('.fill').css('width', $(slider_carbon).val() * (100 / rangeMaxVal_carbon) + '%');

  slider_carbon.oninput = function() {
    $(this).siblings('.count').text(this.value + ' g').css({
      'left': this.value * (100 / rangeMaxVal_carbon) + '%',
      'transform': 'translateX(-' + this.value * (100 / rangeMaxVal_carbon) + '%)'
    });
    $(this).siblings('.fill').css('width', this.value * (100 / rangeMaxVal_carbon) + '%');
  }

  // Quality of Soil
  var slider_soil = document.getElementById("slider-soil");
  var soilValues = {
    "1": "Poor",
    "2": "Average",
    "3": "Good"
  };
  var rangeMaxVal_soil = $(slider_soil).prop('max');

  // Default value
  $(slider_soil).siblings('.count').text(soilValues[$(slider_soil).val()]).css({
    'left': $(slider_soil).val() * (100 / rangeMaxVal_soil) + '%',
    'transform': 'translateX(-' + $(slider_soil).val() * (100 / rangeMaxVal_soil) + '%)'
  });
  $(slider_soil).siblings('.fill').css('width', $(slider_soil).val() * (100 / rangeMaxVal_soil) + '%');

  slider_soil.oninput = function() {
    $(this).siblings('.count').text(soilValues[this.value]).css({
      'left': this.value * (100 / rangeMaxVal_soil) + '%',
      'transform': 'translateX(-' + this.value * (100 / rangeMaxVal_soil) + '%)'
    });
    $(this).siblings('.fill').css('width', this.value * (100 / rangeMaxVal_soil) + '%');
  }


  /*
   ** Round slider
   */
  $("#round-temperature").roundSlider({
    radius: 150,
    width: 40,
    circleShape: "half-top",
    sliderType: "min-range",
    value: 50,
    min: 0,
    max: 100,
    editableTooltip: false,
    tooltipFormat: "temperatureTooltip"
  });
  $("#round-vegetation").roundSlider({
    radius: 150,
    width: 40,
    circleShape: "half-top",
    sliderType: "min-range",
    value: 75,
    min: -100,
    max: 100,
    editableTooltip: false,
    tooltipFormat: "vegetationTooltip",
  });

  $('.map-tab-btn').on('click', function(){
      var itm = $(this);
      $('.map-tab-btn').each(function(){
        $(this).removeClass('active');
      });
      itm.addClass('active');
  });

  $('button').on('click', function(){
    var btn = $(this);
    if(btn.hasClass('btn-active')) {
      btn.removeClass('btn-active');
    } else {
      btn.parents('.btn-js-group').find('.btn-active').removeClass('btn-active');
      btn.addClass('btn-active');
    }
  });
});

function temperatureTooltip(args) {
  return args.value + ' <span class="tooltip-parameter">°F</span><div class="tooltip-label">Temperature</div>';
}

function vegetationTooltip(args) {
  return args.value / 100 + '<div class="tooltip-label">Vegetation Level</div>';
}
