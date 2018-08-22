// Extend Select2: Added placeholder to Select2 input

(function($) {
    var Defaults = $.fn.select2.amd.require('select2/defaults');
    $.extend(Defaults.defaults, {
        searchInputPlaceholder: ''
    });
    var SearchDropdown = $.fn.select2.amd.require('select2/dropdown/search');
    var _renderSearchDropdown = SearchDropdown.prototype.render;
    SearchDropdown.prototype.render = function(decorated) {
        // invoke parent method
        var $rendered = _renderSearchDropdown.apply(this, Array.prototype.slice.apply(arguments));
        this.$search.attr('placeholder', this.options.get('searchInputPlaceholder'));
        return $rendered;
    };
})(window.jQuery);

d3.json("/js/us-data-show.json", function(error, data) {

  //Autofill function
  const county_state = [];

  const countiesObj = data.county;
  const stateObj = data.state;
  
  // console.log(data.county);

  const countyKeys = Object.keys(countiesObj)

  const countyNames = countyKeys.forEach((key) => {
    const stringKey = key.toString();
    let sliceValue = 0;

    if (key < 10000) {
      sliceValue = 1
    } else {
      sliceValue = 2
    }

    var stateID = stringKey.slice(0, sliceValue);
    if(stateObj[stateID]){

        var stateName = stateObj[stateID].name.toUpperCase().replace(' ', '_');
        const dataObj = {
          name: countiesObj[`${key}`].name,
          state: stateID,
          stateName: stateName,
          originalKey: key,
          countyID: (countiesObj[`${key}`].countyID)?countiesObj[`${key}`].countyID:0,
        }
        county_state.push(dataObj);
    }

  });

  var searchCounty = $("#searchCounty");
  var searchOptions = [];
  for (let i = 0; i < county_state.length; i++) {
      var new_name = county_state[i].name;
      searchOptions.push({
        // id: county_state[i].state + '-' + county_state[i].originalKey,
        id: county_state[i].originalKey + '-' + county_state[i].countyID + '-' + county_state[i].stateName,
        text: new_name.substring(0, new_name.length - 2),
        originalKey: county_state[i].originalKey,
      });
  }

  // console.log(searchOptions);

  searchCounty.select2({
    placeholder: "Search for a county…",
    searchInputPlaceholder: 'Search for a county…',
    width: '100%',
    data: searchOptions,
  });
})
