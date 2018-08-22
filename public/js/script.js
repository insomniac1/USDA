import { updateDataMap } from './map-counties';

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

    var predictedData = JSON.parse($("#predicted-data").val());
    predictedData.wateravailability = this.value;
    var textObject = JSON.stringify(predictedData);
    $("#predicted-data").text(textObject);

    $(this).siblings('.count').text(this.value + ' mm').css({
      'left': this.value * (100 / rangeMaxVal_water) + '%',
      'transform': 'translateX(-' + this.value * (100 / rangeMaxVal_water) + '%)'
    });
    $(this).siblings('.fill').css('width', this.value * (100 / rangeMaxVal_water) + '%');
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
    var predictedData = JSON.parse($("#predicted-data").val());
    predictedData.soilcarbon = this.value;
    var textObject = JSON.stringify(predictedData);
    $("#predicted-data").text(textObject);

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
    "3": "Good",
    "4": "Great",
  };
  var rangeMaxVal_soil = $(slider_soil).prop('max');

  // Default value
  $(slider_soil).siblings('.count').text(soilValues[$(slider_soil).val()]).css({
    'left': $(slider_soil).val() * (100 / rangeMaxVal_soil) + '%',
    'transform': 'translateX(-' + $(slider_soil).val() * (100 / rangeMaxVal_soil) + '%)'
  });
  $(slider_soil).siblings('.fill').css('width', $(slider_soil).val() * (100 / rangeMaxVal_soil) + '%');

  slider_soil.oninput = function() {
    var predictedData = JSON.parse($("#predicted-data").val());
    predictedData.soilquality = this.value;
    var textObject = JSON.stringify(predictedData);
    $("#predicted-data").text(textObject);

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
    tooltipFormat: temperatureTooltip
  });
  $("#round-vegetation").roundSlider({
    radius: 150,
    width: 40,
    circleShape: "half-top",
    sliderType: "min-range",
    value: 0,
    min: -100,
    max: 100,
    editableTooltip: false,
    tooltipFormat: vegetationTooltip,
  });

  $("#round-temperature").on('change', function() {
    var predictedData = JSON.parse($("#predicted-data").val());
    predictedData.temperature = $(this).find('input').val();
    var textObject = JSON.stringify(predictedData);
    $("#predicted-data").text(textObject);
  });
   $("#round-vegetation").on('change', function() {
    var predictedData = JSON.parse($("#predicted-data").val());
    predictedData.vegetation = $(this).find('input').val() / 100;
    var textObject = JSON.stringify(predictedData);
    $("#predicted-data").text(textObject);
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


  $('.map-btn-data').on('click', function(){
    var btn = $(this);
    var type = btn.attr('data-type');

    updateDataMap(type);
 
  });
  


  // Temporary solution in order to show county on first page load
  setTimeout(function() {
     $('#searchCounty').val('19023-IA023-IOWA').trigger('change.select2');
   }, 3000);

});

function temperatureTooltip(args) {
  return args.value + ' <span class="tooltip-parameter">°F</span><div class="tooltip-label">Temperature</div>';
}

function vegetationTooltip(args) {
  return args.value / 100 + '<div class="tooltip-label">Vegetation Level</div>';
}

$("#slider-water").mouseup(function() {
  updatePredictedData();
});
$("#slider-carbon").mouseup(function() {
  updatePredictedData();
});
$("#slider-soil").mouseup(function() {
  updatePredictedData();
});
$("#round-temperature").on('change', function() {
  updatePredictedData();
});
$("#round-vegetation").on('change', function() {
  updatePredictedData();
});

function updatePredictedData() {

    var predictedData = $("#predicted-data").val();

    $.ajax({
      type: 'POST',
      url: '/api/updateData',
      data: predictedData, // TO DO: make id dinamic
      headers: {
        "Content-Type" : "application/json",
      },
      success: function(data) {
        console.log('predicted data updated');
        $("#predicted-yield").text(data);
      }
    });
};
