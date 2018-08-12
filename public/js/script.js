$(document).ready(function(){
    // Range slider (last section)
    var slider_water = document.getElementById("slider-water");
    slider_water.oninput = function() {
        $(this).siblings('.count').text(this.value).css({
            'left': this.value + '%', 
            'transform': 'translateX(-' + this.value + '%)'
        });
        $(this).siblings('.fill').css('width', this.value + '%');
    }

    var slider_carbon = document.getElementById("slider-carbon");
    slider_carbon.oninput = function() {
        $(this).siblings('.count').text(this.value).css({
            'left': this.value + '%', 
            'transform': 'translateX(-' + this.value + '%)'
        });
        $(this).siblings('.fill').css('width', this.value + '%');
    }

    var slider_soil = document.getElementById("slider-soil");
    slider_soil.oninput = function() {
        $(this).siblings('.count').text(this.value).css({
            'left': this.value + '%', 
            'transform': 'translateX(-' + this.value + '%)'
        });
        $(this).siblings('.fill').css('width', this.value + '%');
    }
});