$(document).ready(function() {

    /*
    ** Range slider (last section)
     */

    // Accessible Water
    var slider_water = document.getElementById("slider-water");
    var rangeMaxVal_water = $(slider_water).prop('max');

    // Default value
    $(slider_water).siblings('.fill').css('width', $(slider_water).val() + '%');
    slider_water.oninput = function() {
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
    $(slider_carbon).siblings('.fill').css('width', $(slider_carbon).val() + '%');
    slider_carbon.oninput = function() {
        $(this).siblings('.count').text(this.value + ' g').css({
            'left': this.value * (100 / rangeMaxVal_carbon) + '%', 
            'transform': 'translateX(-' + this.value * (100 / rangeMaxVal_carbon) + '%)'
        });
        $(this).siblings('.fill').css('width', this.value * (100 / rangeMaxVal_carbon) + '%');
    }

    // Quality of Soil
    var slider_soil = document.getElementById("slider-soil");
    var soilValues = { "1": "Poor", "2": "Average", "3": "Good" };
    var rangeMaxVal_soil = $(slider_soil).prop('max');

    // Default value
    $(slider_soil).siblings('.fill').css('width', $(slider_soil).val() * (100 / rangeMaxVal_soil) + '%');
    slider_soil.oninput = function() {
        $(this).siblings('.count').text(soilValues[this.value]).css({
            'left': this.value * (100 / rangeMaxVal_soil) + '%', 
            'transform': 'translateX(-' + this.value * (100 / rangeMaxVal_soil) + '%)'
        });
        $(this).siblings('.fill').css('width', this.value * (100 / rangeMaxVal_soil) + '%');
    }

});