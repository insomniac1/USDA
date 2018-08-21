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
  const countyKeys = Object.keys(countiesObj)

  const countyNames = countyKeys.forEach((key) => {
    const stringKey = key.toString();
    let sliceValue = 0;

    if (key < 10000) {
      sliceValue = 1
    } else {
      sliceValue = 2
    }

    const dataObj = {
      name: countiesObj[`${key}`].name,
      state: stringKey.slice(0, sliceValue),
      originalKey: key,
      countyId: (countiesObj[`${key}`].countyId)?countiesObj[`${key}`].countyId:0,
    }
    county_state.push(dataObj);
  });

  var searchCounty = $("#searchCounty");
  var searchOptions = [];
  for (let i = 0; i < county_state.length; i++) {
      searchOptions.push({
        // id: county_state[i].state + '-' + county_state[i].originalKey,
        id: county_state[i].originalKey+'-'+county_state[i].countyId,
        text: county_state[i].name,
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
