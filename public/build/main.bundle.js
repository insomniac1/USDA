! function(t) {
  var e = {};

  function a(r) {
    if (e[r]) return e[r].exports;
    var n = e[r] = {
      i: r,
      l: !1,
      exports: {}
    };
    return t[r].call(n.exports, n, n.exports, a), n.l = !0, n.exports
  }
  a.m = t, a.c = e, a.d = function(t, e, r) {
    a.o(t, e) || Object.defineProperty(t, e, {
      enumerable: !0,
      get: r
    })
  }, a.r = function(t) {
    "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
      value: "Module"
    }), Object.defineProperty(t, "__esModule", {
      value: !0
    })
  }, a.t = function(t, e) {
    if (1 & e && (t = a(t)), 8 & e) return t;
    if (4 & e && "object" == typeof t && t && t.__esModule) return t;
    var r = Object.create(null);
    if (a.r(r), Object.defineProperty(r, "default", {
        enumerable: !0,
        value: t
      }), 2 & e && "string" != typeof t)
      for (var n in t) a.d(r, n, function(e) {
        return t[e]
      }.bind(null, n));
    return r
  }, a.n = function(t) {
    var e = t && t.__esModule ? function() {
      return t.default
    } : function() {
      return t
    };
    return a.d(e, "a", e), e
  }, a.o = function(t, e) {
    return Object.prototype.hasOwnProperty.call(t, e)
  }, a.p = "", a(a.s = 4)
}([function(t, e, a) {
  "use strict";
  Object.defineProperty(e, "__esModule", {
    value: !0
  }), e.drawBarZoomMap = function(t) {
    console.log(t);
    var e = {
        top: 20,
        right: 0,
        bottom: 30,
        left: 0
      },
      a = $("#zoom-bar-chart").width() - e.left - e.right,
      r = 120 - e.top - e.bottom,
      n = d3.scale.ordinal().rangeRoundBands([0, a], .1),
      i = d3.scale.ordinal(),
      s = d3.scale.linear().range([r, 0]),
      o = d3.svg.axis().scale(n).tickSize(0).orient("bottom"),
      l = (d3.svg.axis().scale(s).orient("left"), d3.scale.ordinal().range(["#76c6cc", "#e8b251", "#44a484"])),
      c = d3.select("#zoom-bar-chart").append("svg").attr("width", a + e.left + e.right).attr("height", r + e.top + e.bottom).append("g").attr("transform", "translate(" + e.left + "," + e.top + ")"),
      d = t.map(function(t) {
        return t.categorie
      }),
      u = t[0].values.map(function(t) {
        return t.rate
      });
    n.domain(d), i.domain(u).rangeRoundBands([0, n.rangeBand()]), s.domain([0, d3.max(t, function(t) {
      return d3.max(t.values, function(t) {
        return t.value
      })
    })]), c.append("g").attr("class", "x axis").attr("transform", "translate(0," + r + ")").call(o), c.select(".y").transition().duration(500).delay(1300).style("opacity", "1");
    var p = c.selectAll(".slice").data(t).enter().append("g").attr("class", "g").attr("transform", function(t) {
      return "translate(" + n(t.categorie) + ",0)"
    });
    p.selectAll("rect").data(function(t) {
      return t.values
    }).enter().append("rect").attr("width", i.rangeBand()).attr("x", function(t) {
      return i(t.rate)
    }).style("fill", function(t) {
      return l(t.rate)
    }).attr("y", function(t) {
      return s(0)
    }).attr("height", function(t) {
      return r - s(0)
    }).on("mouseover", function(t) {}).attr("rx", 2).attr("ry", 2).on("mouseout", function(t) {}), p.selectAll("rect").transition().delay(function(t) {
      return 1e3 * Math.random()
    }).duration(1e3).attr("y", function(t) {
      return s(t.value)
    }).attr("height", function(t) {
      return r - s(t.value)
    });
    var f = d3.svg.brush().x(n).on("brush", function() {
      var t = n.domain(),
        e = a / t.length,
        r = f.empty() ? [0, a] : f.extent();
      t[Math.floor(r[0] / e)], t[Math.floor(r[1] / e)]
    });
    c.append("g").attr("class", "x brush").call(f).selectAll("rect").attr("y", 0).attr("height", r), f.extent([10, a - 10]), f(c.select(".brush").transition()), f.event(c.select(".brush").transition().delay(1e3))
  }
}, function(t, e, a) {
  "use strict";
  Object.defineProperty(e, "__esModule", {
    value: !0
  }), e.drawTemperatureVegetation = function(t) {
    n = {
      top: 0,
      right: 0,
      bottom: 30,
      left: 0
    };
    var e = ["yield", "temperature", "vegetation"];
    y.domain(e);
    var a = [],
      i = {};
    e.forEach(function(t) {
      i[t] = {
        name: t,
        values: []
      }, a.push(i[t])
    }), t.forEach(function(t, a) {
      t.years.forEach(function(t) {
        e.map(function(e) {
          i[e].values.push({
            name: e,
            year: parseInt(t.year),
            value: +t[e]
          })
        })
      })
    }), t.forEach(function(t, e) {
      c.domain(t.years.map(function(t) {
        return parseInt(t.year)
      }))
    }), v(a), d.domain([0, d3.max(a, function(t) {
      return d3.max(t.values, function(t) {
        return t.y + .1 * t.y
      })
    })]), h.append("g").attr("class", "y axis").call(p), h.append("g").attr("class", "x axis").attr("transform", "translate(0," + s + ")").call(u);
    var o = h.selectAll(".series").data(a).enter().append("g").attr("class", function(t, e) {
        return "series series-" + e
      }),
      b = $(r).find("svg")[0];
    g(b, "temperature-gradient-0", [{
      offset: "0%",
      "stop-color": "#44A484 ",
      "stop-opacity": "0.45"
    }, {
      offset: "75%",
      "stop-color": "#44A484",
      "stop-opacity": "0.05"
    }]), g(b, "temperature-gradient-1", [{
      offset: "0%",
      "stop-color": "#76C6CC",
      "stop-opacity": "0.45"
    }, {
      offset: "75%",
      "stop-color": "#76C6CC",
      "stop-opacity": "0.05"
    }]), g(b, "temperature-gradient-2", [{
      offset: "0%",
      "stop-color": "#E8B251 ",
      "stop-opacity": "0.45"
    }, {
      offset: "75%",
      "stop-color": "#E8B251",
      "stop-opacity": "0.05"
    }]), o.append("path").attr("d", function(t) {
      return m(t.values)
    }).attr("class", "streamPath").style("fill", function(t, e) {
      return "url(#temperature-gradient-" + e + ")"
    }), h.selectAll(".seriesPoints").data(a).enter().append("g").attr("class", "seriesPoints").selectAll(".point").data(function(t) {
      return t.values
    }).enter().append("circle").attr("class", function(t, e) {
      return "point point-itm-" + t.name + "-" + e
    }).attr("cx", function(t) {
      return c(t.year) + c.rangeBand() / 2
    }).attr("cy", function(t) {
      return d(t.y)
    }).attr("r", "5px").style("opacity", 0).style("fill", function(t) {
      return y(t.name)
    }), h.selectAll(".seriesPointsHover").data(a).enter().append("g").attr("class", function(t, e) {
      return "seriesPointsHover seriesPointsHover-" + e
    }).selectAll(".point-hover").data(function(t) {
      return t.values
    }).enter().append("circle").attr("class", "point-hover").attr("cx", function(t) {
      return c(t.year) + c.rangeBand() / 2
    }).attr("cy", function(t) {
      return d(t.y)
    }).attr("r", "25px").style("opacity", 0).style("fill", function(t) {
      return y(t.name)
    }).on("mouseover", function(t, e) {
      (function(t, e) {
        var a = [];
        a.clientX = d3.mouse(this)[0], a.clientY = d3.mouse(this)[1];
        var r = '<div id="area-tooltip" style="left: ' + (a.clientX + 25) + "px; top: " + (a.clientY - 50) + 'px;">';
        r += "<span><strong>" + l[t.name] + "</strong></br>" + t.value + "</span>", r += "<span><strong>Year</strong></br>" + t.year + "</span>", r += "</div>", $(".point-itm-" + t.name + "-" + e).css("opacity", 1), $("#chart-gradient").append(r)
      }).call(this, t, e)
    }).on("mouseout", function(t, e) {
      (function(t, e) {
        $(".point-itm-" + t.name + "-" + e).css("opacity", 0), $("#area-tooltip").remove()
      }).call(this, t, e)
    }), a.forEach(function(t, e) {
      h.select(".series-" + e).append("path").data([a[e].values]).attr("class", "border-line line" + e).attr("d", f).attr("transform", "translate(" + c.rangeBand() / 2 + ", 0)")
    })
  };
  var r = "#chart-gradient",
    n = {
      top: 0,
      right: 15,
      bottom: 30,
      left: 15
    },
    i = $(".gradient-wrapper").width() - n.left - n.right,
    s = .6 * i - n.top - n.bottom,
    o = !1;
  i <= 500 && (o = !0);
  var l = {
      yield: "Corn Yield",
      temperature: "Temperature",
      vegetation: "Vegetation"
    },
    c = d3.scale.ordinal().rangeRoundBands([0, i], -1.1),
    d = (d3.scale.ordinal().rangeRoundBands([0, i], -.7), d3.scale.linear().rangeRound([s, 0])),
    u = d3.svg.axis().scale(c).orient("bottom").tickPadding(12).tickSize(1).tickFormat(function(t) {
      return o ? t % 3 == 0 ? t : void 0 : t
    });
  o && u.ticks(1e3);
  var p = d3.svg.axis().scale(d).orient("left").innerTickSize(-i).outerTickSize(0).tickPadding(10).ticks(5).tickFormat(function(t) {
      return ""
    }),
    f = d3.svg.line().x(function(t, e) {
      return c(t.year)
    }).y(function(t) {
      return d(t.value)
    }),
    y = d3.scale.ordinal().range(["#2D9280", "#5BABB1", "#E5B156"]).domain(["yield", "temperature", "vegetation"]),
    h = d3.select(r).append("svg").attr("width", i + n.left + n.right).attr("height", s + n.top + n.bottom).append("g").attr("transform", "translate(" + n.left + "," + n.top + ")"),
    v = d3.layout.stack().values(function(t) {
      return t.values
    }).x(function(t) {
      return c(t.year) + c.rangeBand() / 2
    }).y(function(t) {
      return t.value
    }),
    m = d3.svg.area().x(function(t) {
      return c(t.year) + c.rangeBand() / 2
    }).y0(function(t) {
      return d(0)
    }).y1(function(t) {
      return d(t.y)
    });

  function g(t, e, a) {
    var r = t.namespaceURI,
      n = document.createElementNS(r, "linearGradient");
    n.setAttribute("id", e), n.setAttribute("x2", "0%"), n.setAttribute("y2", "100%");
    for (var i = 0; i < a.length; i++) {
      var s = a[i],
        o = document.createElementNS(r, "stop");
      for (var l in s) s.hasOwnProperty(l) && o.setAttribute(l, s[l]);
      n.appendChild(o)
    }
    return (t.querySelector("defs") || t.insertBefore(document.createElementNS(r, "defs"), t.firstChild)).appendChild(n)
  }
  $(".temp-veget-btn").on("click", function() {
    var t = $(this);
    t.hasClass("active") ? (t.removeClass("active"), t.hasClass("btn-icon--corn") && (d3.selectAll(".series-0").attr("visibility", "hidden"), $(".seriesPointsHover-0").css("display", "none")), t.hasClass("btn-icon--temperature") && (d3.selectAll(".series-1").attr("visibility", "hidden"), $(".seriesPointsHover-1").css("display", "none")), t.hasClass("btn-icon--vegetation") && (d3.selectAll(".series-2").attr("visibility", "hidden"), $(".seriesPointsHover-2").css("display", "none"))) : (t.addClass("active"), t.hasClass("btn-icon--corn") && (d3.selectAll(".series-0").attr("visibility", "visible"), $(".seriesPointsHover-0").css("display", "initial")), t.hasClass("btn-icon--temperature") && (d3.selectAll(".series-1").attr("visibility", "visible"), $(".seriesPointsHover-1").css("display", "initial")), t.hasClass("btn-icon--vegetation") && (d3.selectAll(".series-2").attr("visibility", "visible"), $(".seriesPointsHover-2").css("display", "initial")))
  })
}, function(t, e, a) {
  "use strict";
  Object.defineProperty(e, "__esModule", {
    value: !0
  }), e.drawSoilChemistry = function(t) {
    $("#chart-circle").html("");
    var e = document.getElementById("chart-circle-wrapper").offsetWidth < 550,
      a = {
        left: 30,
        top: 20,
        right: 20,
        bottom: 30
      },
      r = $("#chart-circle-wrapper").width() - a.left - a.right,
      n = 2 * r / 3,
      i = d3.select("#chart-circle").append("svg").attr("width", r + a.left + a.right).attr("height", n + a.top + a.bottom).append("g").attr("class", "chordWrapper").attr("transform", "translate(" + a.left + "," + a.top + ")"),
      s = .7,
      o = d3.scale.ordinal().range(["#2e8bc2", "#209481", "#B6334F"]).domain(["water", "carbon", "soil_quality"]),
      l = d3.scale.log().range([0, r]).domain([d3.min(t, function(t) {
        return .9 * t.yield
      }), d3.max(t, function(t) {
        return 1.1 * t.yield
      })]),
      c = d3.svg.axis().orient("bottom").ticks(2).tickFormat(function(t) {
        return l.tickFormat(e ? 4 : 8, function(t) {
          var e = d3.formatPrefix(t);
          return e.scale(t) + e.symbol
        })(t)
      }).scale(l);
    i.append("g").attr("class", "x axis").attr("transform", "translate(0," + n + ")").call(c);
    var d = d3.scale.linear().range([n, 0]).domain([d3.min(t, function(t) {
        return .9 * t.value
      }), d3.max(t, function(t) {
        return 1.1 * t.value
      })]).nice(),
      u = (d3.svg.axis().orient("left").ticks(6).scale(d), d3.scale.sqrt().range([e ? 1 : 2, e ? 10 : 16]).domain(d3.extent(t, function(t) {
        return t.yield
      })), d3.geom.voronoi().x(function(t) {
        return l(t.yield)
      }).y(function(t) {
        return d(t.value)
      }).clipExtent([
        [0, 0],
        [r, n]
      ])(t));
    i.append("defs").attr("class", "clipWrapper").selectAll(".clip").data(u).enter().append("clipPath").attr("class", "clip").attr("id", function(t) {
      if (t) return "clip-" + t.point.code
    }).append("path").attr("class", "clip-path-circle").attr("d", function(t) {
      if (t) return "M" + t.join(",") + "Z"
    });
    i.append("g").attr("class", "circleClipWrapper").selectAll(".circle-wrapper").data(t.sort(function(t, e) {
      return e.yield > t.yield
    })).enter().append("circle").attr("class", function(t, e) {
      return "circle-wrapper circle-type-" + t.type + " " + t.code + " " + ("water" != t.type ? "hidden" : "")
    }).attr("visibility", function(t, e) {
      return "water" == t.type ? "visible" : "hidden"
    }).attr("clip-path", function(t) {
      return "url(#clip-" + t.code + ")"
    }).style("clip-path", function(t) {
      return "url(#clip-" + t.code + ")"
    }).attr("cx", function(t) {
      return l(t.yield)
    }).attr("cy", function(t) {
      return d(t.value)
    }).attr("r", 50).on("mouseover", function(t, e) {
      var a = [];
      a.clientX = d3.mouse(this)[0], a.clientY = d3.mouse(this)[1];
      var r = '<div id="circle-tooltip" style="left: ' + (a.clientX + 50) + "px; top: " + (a.clientY - 20) + 'px;">';
      switch (r += '<span class="soil-chemistry-county"><strong>County</strong></br>' + t.county + "</span>", t.type) {
        case "water":
          r += '<span class="soil-chemistry-water"><strong>Accessible Water</strong></br>' + Number.parseFloat(t.value).toFixed(1) + "mm</span>";
          break;
        case "carbon":
          r += '<span class="soil-chemistry-carbon""><strong>Carbon</strong></br>' + Number.parseFloat(t.value).toFixed(1) + "</span>";
          break;
        case "soil_quality":
          r += '<span class="soil-chemistry-soil"><strong>Soil</strong></br>' + Number.parseFloat(t.value).toFixed(1) + "</span>"
      }
      r += '<span class="soil-chemistry-yield"><strong>Corn Yield</strong></br>' + Number.parseFloat(t.yield).toFixed(1) + "</span>", r += "</div>", $("#chart-circle-wrapper").append(r);
      var n = d3.selectAll("#chart-circle .countries." + t.code);
      n.style("fill", function(t) {
        return o(t.type)
      }), n.style("opacity", 1);
      var i = d3.selectAll("#chart-circle .countries-shadow." + t.code);
      i.style("fill", function(t) {
        return o(t.type)
      }), i.style("opacity", .3)
    }).on("mouseout", function(t, e) {
      $("#circle-tooltip").remove();
      var a = d3.selectAll("#chart-circle .countries." + t.code);
      a.style("opacity", s), a.style("fill", function(t) {
        return o(t.type)
      }), d3.selectAll("#chart-circle .countries-shadow." + t.code).style("opacity", 0)
    });
    i.append("g").attr("class", "circleWrapper").selectAll("countries").data(t.sort(function(t, e) {
      return e.yield > t.yield
    })).enter().append("circle").attr("class", function(t, e) {
      return "countries circle-type-" + t.type + " " + t.code + " " + ("water" != t.type ? "hidden" : "")
    }).attr("cx", function(t) {
      return l(t.yield)
    }).attr("cy", function(t) {
      return d(t.value)
    }).attr("r", function(t) {
      return 5
    }).style("pointer-events", "none").style("opacity", s).style("fill", function(t) {
      return o(t.type)
    }), i.append("g").attr("class", "circleWrapperShadow").selectAll("countries").data(t.sort(function(t, e) {
      return e.yield > t.yield
    })).enter().append("circle").attr("class", function(t, e) {
      return "countries-shadow circle-type-" + t.type + " " + t.code + " " + ("water" != t.type ? "hidden" : "")
    }).attr("cx", function(t) {
      return l(t.yield)
    }).attr("cy", function(t) {
      return d(t.value)
    }).attr("r", function(t) {
      return 20
    }).style("pointer-events", "none").style("opacity", 0).style("fill", function(t) {
      return o(t.type)
    })
  }, $(".soil-chemistry-btn").on("click", function() {
    var t = $(this);
    $(".soil-chemistry-btn").each(function() {
      $(this).removeClass("active")
    }), t.addClass("active"), $(".circleClipWrapper circle.circle-wrapper").addClass("hidden"), $(".circleWrapper circle.countries").addClass("hidden"), $(".circleWrapperShadow circle.countries-shadow").addClass("hidden"), $(".circleClipWrapper circle.circle-wrapper.circle-type-" + t.attr("data-type")).removeClass("hidden"), $(".circleWrapper circle.countries.circle-type-" + t.attr("data-type")).removeClass("hidden"), $(".circleWrapperShadow circle.countries-shadow.circle-type-" + t.attr("data-type")).removeClass("hidden")
  })
}, function(t, e, a) {
  "use strict";
  Object.defineProperty(e, "__esModule", {
    value: !0
  }), e.drawCurveLine = function(t) {
    $("#curve-line").html("");
    var e = $("#curve-line-sp"),
      a = {
        top: 20,
        right: 15,
        bottom: 30,
        left: 15
      },
      r = e.width() - a.left - a.right,
      n = e.height() - a.top - a.bottom,
      i = d3.scale.linear().domain([d3.min(t, function(t) {
        return t.year
      }), d3.max(t, function(t) {
        return t.year
      })]).range([0, r]),
      s = d3.scale.linear().domain([0, d3.max(t, function(t) {
        return t.yield
      })]).range([n, 0]),
      o = d3.svg.axis().scale(i).orient("bottom").innerTickSize(-n).outerTickSize(0).ticks(5).tickPadding(10).tickFormat(function(t) {
        return t
      }),
      l = d3.svg.axis().scale(s).orient("left").innerTickSize(-r).outerTickSize(100).tickPadding(10).ticks(5).tickFormat(function(t) {
        return t
      }).tickFormat(function(t) {
        return ""
      }),
      c = d3.svg.line().x(function(t) {
        return i(t.year)
      }).y(function(t) {
        return s(t.yield)
      }).interpolate("bundle"),
      d = d3.select("#curve-line").append("svg").attr("width", r + a.left + a.right).attr("height", n + a.top + a.bottom).append("g").attr("transform", "translate(" + a.left + "," + a.top + ")");
    d.append("g").attr("class", "x axis").attr("transform", "translate(0," + n + ")").call(o), d.append("g").attr("class", "y axis").call(l), d.append("path").data([t]).attr("class", "line").attr("d", c)
  }
}, function(t, e, a) {
  "use strict";
  a(5), a(6), a(0), a(2), a(1), a(3), a(7)
}, function(t, e, a) {
  "use strict";
  ! function(t) {
    var e = t.fn.select2.amd.require("select2/defaults");
    t.extend(e.defaults, {
      searchInputPlaceholder: ""
    });
    var a = t.fn.select2.amd.require("select2/dropdown/search"),
      r = a.prototype.render;
    a.prototype.render = function(t) {
      var e = r.apply(this, Array.prototype.slice.apply(arguments));
      return this.$search.attr("placeholder", this.options.get("searchInputPlaceholder")), e
    }
  }(window.jQuery), d3.json("/js/us-data-show.json", function(t, e) {
    for (var a = [], r = e.county, n = (Object.keys(r).forEach(function(t) {
        var e = t.toString(),
          n = 0;
        n = t < 1e4 ? 1 : 2;
        var i = {
          name: r["" + t].name,
          state: e.slice(0, n),
          originalKey: t
        };
        a.push(i)
      }), $("#searchCounty")), i = [], s = 0; s < a.length; s++) i.push({
      id: a[s].originalKey,
      text: a[s].name,
      originalKey: a[s].originalKey
    });
    n.select2({
      placeholder: "Search for a county…",
      searchInputPlaceholder: "Search for a county…",
      width: "100%",
      data: i
    })
  })
}, function(t, e, a) {
  "use strict";
  var r = a(0),
    n = a(1),
    i = a(2),
    s = a(3);
  ! function() {
    var t, e, a, o, l, c, d, u, p, f, y, h, v, m, g = d3.select(".tooltip"),
      b = (g.select("#tooltip-state"), 0),
      x = {},
      w = void 0,
      A = $(".map-counties-sp").width(),
      C = .6 * A,
      S = {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
      },
      k = (d3.scale.sqrt().range([2, 40]), d3.scale.threshold().range(["#FBF0DE", "#F7E2BC", "#F2CC89", "#E9BF77", "#DBAB58", "#A5E7D1", "#8EDAC1", "#64C2A2", "#3FA885", "#20906A"])),
      P = (d3.format("0,000"), d3.format("3g"), d3.format(".1f"), !1),
      O = !1,
      T = {
        year: void 0,
        zoom: d3.select(null),
        mode: "NATIONAL",
        state: void 0,
        county: void 0
      };
    var j = d3.select(".timeseries"),
      B = 10,
      N = 50,
      E = A - N - 20;

    function F() {
      T.zoom = d3.select(null), o.selectAll("*").remove(), w.transition().duration(500).ease("exp-out").attr("data-zoom", !1).attr("transform", "translate(" + S.left + "," + S.top + ")"), setTimeout(function() {
        a.selectAll("*").style("visibility", "visible"), e.selectAll(".county").style("visibility", "visible").style("stroke-width", "0.5px")
      }, 500), T.mode = "NATIONAL", _(void 0)
    }

    function z(t, r) {
      if ("select" != r && d3.event.stopPropagation(), T.zoom.node() !== this) {
        var n = A - S.left - S.right,
          i = C - S.top - S.bottom;
        T.zoom = d3.select(this);
        var s = c.bounds(t),
          l = s[1][0] - s[0][0],
          d = s[1][1] - s[0][1],
          u = (s[0][0] + s[1][0]) / 2,
          p = (s[0][1] + s[1][1]) / 2,
          f = .8 / Math.max(l / n, d / i),
          y = [n / 2 - f * u, i / 2 - f * p];
        T.zoomScale = f, w.transition().duration(500).attr("data-zoom", !0).attr("transform", "translate(" + y + ")scale(" + f + ")"), o.selectAll("*").remove(), a.selectAll("*").style("visibility", "hidden"), e.selectAll(".county").style("visibility", function(e) {
          return Math.floor(e.id / 1e3) === t.id ? "visible" : "hidden"
        }).style("stroke-width", 1 / f + "px"), T.mode = "STATE"
      } else F()
    }

    function _(t) {
      T.state = t, R(), void 0 === T.state ? x.region.html("United States") : m && x.region.html(m.state[t].name), W(t)
    }

    function M(t) {
      T.year = t, J(), R(), x.year.html(t), W()
    }

    function I(t) {
      T.county = t, R(), T.county, W()
    }

    function W(t) {
      t && m && $("#tooltip-state").html(m.state[t].name)
    }

    function J() {
      P && O && e.selectAll(".county").style("fill", function(t) {
        return m.county.hasOwnProperty(t.id) && m.county[t.id].data.hasOwnProperty(T.year) ? k(m.county[t.id].data[T.year]) : "#fff"
      })
    }

    function R() {
      var t;
      if (P && O && ("NATIONAL" === T.mode ? t = T.state ? m.state[T.state] : m.national : "STATE" === T.mode && (t = T.county ? m.county[T.county] : m.state[T.state]), void 0 !== t)) {
        var e = Object.keys(t.data).map(function(e) {
          return {
            x: +e,
            y: t.data[e]
          }
        });
        f.domain(t.yRange), u.select("g.y.axis").call(h), u.selectAll(".line").remove(), u.append("path").attr("class", "line").attr("d", v(e)), u.selectAll(".point").remove(), t.data.hasOwnProperty(T.year) && u.append("circle").attr("class", "point selected").attr("r", 4).attr("cx", p(T.year)).attr("cy", f(t.data[T.year]))
      }
    }
    p = d3.scale.linear().range([5, E - 5]).clamp(!0), f = d3.scale.linear().domain([0, 100]).range([59, 5]), d = j.append("svg").attr("width", A).attr("height", 140).append("g").attr("transform", "translate(" + N + "," + B + ")"), (u = d.append("g")).append("rect").attr("class", "background").attr("width", E).attr("height", 64), h = d3.svg.axis().scale(f).orient("left").ticks(4).tickSize(-E).tickPadding(12).tickFormat(d3.format("s")), u.append("g").attr("class", "y axis").call(h), y = d3.svg.axis().scale(p).orient("bottom").tickFormat(function(t) {
        return t
      }).tickSize(-64).ticks(12).tickPadding(12), u.append("g").attr("class", "x axis").attr("transform", "translate(0,64)").call(y), v = d3.svg.line().x(function(t) {
        return p(t.x)
      }).y(function(t) {
        return f(t.y)
      }), $("#searchCounty").on("select2:select", function(t) {
        var e = $(this).val(),
          a = Math.floor(e / 1e3),
          o = $(this).find('option[value="' + e + '"]').html();
        $(".selectedCountyName").each(function() {
          $(this).text(o)
        }), $.ajax({
          type: "GET",
          data: {
            id: "WI027"
          },
          dataType: "json",
          contentType: "application/json; charset=utf-8",
          url: "/api/data/",
          success: function(t) {
            console.log("data updated"), (0, r.drawBarZoomMap)(t[0].bar_map), (0, i.drawSoilChemistry)(t[0].soil_chemistry), (0, n.drawTemperatureVegetation)(t), (0, s.drawCurveLine)(t[0].years);
            var e = JSON.parse($("#predicted-data").val());
            e.date = 2018, e.longitude = t[0].years[0].longitude, e.latitude = t[0].years[0].latitude, e.cropquality = t[0].years[0].cropquality, e.wateravailability = $("#slider-water").val(), e.temperature = $("#round-temperature").find("input").val(), e.vegetation = $("#round-vegetation").find("input").val() / 100, e.soilcarbon = $("#slider-carbon").val(), e.soilquality = $("#slider-soil").val();
            var a = JSON.stringify(e);
            $("#predicted-data").text(a)
          }
        }), F();
        var l = 600;
        $('[data-zoom="true"]').length > 0 && (l = 1e3), setTimeout(function() {
          w.selectAll(".state-id-" + a).attr("data-id", function(t) {
            return z(t, "select"), t.id
          })
        }, l)
      }), x.number = d3.select("#label-number"), x.unit = d3.select("#label-unit"), x.region = d3.select("#label-region"), x.year = d3.select("#label-year"), t = d3.select(".loading"),
      function() {
        var t = d3.select(".map-counties-sp")[0][0];
        b = [t.offsetLeft, t.offsetTop];
        var r = A - S.left - S.right,
          n = C - S.top - S.bottom,
          i = d3.select("#map-counties");
        w = i.append("svg").attr("class", "map-background").attr("width", A).attr("height", C).on("click", F).append("g").attr("transform", "translate(" + S.left + "," + S.top + ")"), e = w.append("g").attr("class", "counties"), a = w.append("g").attr("class", "states"), o = w.append("g").attr("class", "highlight"), l = d3.geo.albersUsa().scale(A).translate([r / 2, n / 2]), c = d3.geo.path().projection(l), d3.json("/js/us.json", function(t, r) {
          if (t) throw t;
          e.selectAll(".county").data(topojson.feature(r, r.objects.counties).features).enter().append("path").attr("class", "county").attr("data-county-id", function(t) {
            return t.id
          }).attr("d", c).on("mouseout", function() {
            o.selectAll("*").remove(), "STATE" === T.mode && I(void 0)
          }).on("mouseover", function(t) {
            m.county.hasOwnProperty(t.id) ? (d3.select(this).style("cursor", "pointer"), o.append("path").datum(t).attr("class", "highlight-outer").attr("d", c).style("stroke-width", 4.5 / T.zoomScale + "px"), o.append("path").datum(t).attr("class", "highlight-inner").attr("d", c).style("stroke-width", 1 / T.zoomScale + "px"), I(t.id)) : d3.select(this).style("cursor", "not-allowed")
          }), a.selectAll(".state").data(topojson.feature(r, r.objects.states).features).enter().append("path").attr("class", function(t) {
            return "state state-id-" + t.id
          }).attr("d", c).on("mouseout", function() {
            o.selectAll("*").remove(), "NATIONAL" === T.mode && _(void 0), g.style("opacity", 0)
          }).on("mouseover", function(t) {
            ! function(t) {
              if (O) {
                var e = [0, 0],
                  a = (e = d3.mouse(d3.event.currentTarget))[0],
                  r = e[1];
                g.style("visibility", "visible").style("opacity", 1).style("margin-top", "-50px").style("left", a - b[0] + "px").style("top", r + "px")
              }
            }(t.id), m && m.length > 0 && m.state.length > 0 && !m.state.hasOwnProperty(t.id) ? d3.select(this).style("cursor", "not-allowed") : (d3.select(this).style("cursor", "pointer"), o.append("path").datum(t).attr("class", "highlight-outer").attr("d", c), o.append("path").datum(t).attr("class", "highlight-inner").attr("d", c), _(t.id))
          }).on("click", function(t) {
            d3.event.stopPropagation(), m.state.hasOwnProperty(t.id) && z(t)
          }), P = !0
        })
      }(), window.setTimeout(function() {
        O = !1, t.select(".spinner").classed("hidden_elem", !1), t.select(".error").classed("hidden_elem", !0), t.classed("hidden_elem", !1), d3.json("/js/us-data-show.json", function(e, a) {
          if (e) throw e;
          m = a, k.range(m.metadata.colorRange), k.domain(m.metadata.colorQuantiles), p.domain(m.metadata.yearRange), u.select("g.x.axis").call(y), x.unit.html(m.metadata.unit.toLowerCase()), "STATE" !== T.mode || m.state.hasOwnProperty(T.state) ? _(T.state) : F(), T.year && T.year <= m.metadata.yearRange[1] && T.year >= m.metadata.yearRange[0] ? M(T.year) : M(m.metadata.yearRange[1]), O = !0, J(), R(), W(), t.classed("hidden_elem", !0)
        })
      }, 1500)
  }()
}, function(t, e, a) {
  "use strict";

  function r(t) {
    return t.value + ' <span class="tooltip-parameter">°F</span><div class="tooltip-label">Temperature</div>'
  }

  function n(t) {
    return t.value / 100 + '<div class="tooltip-label">Vegetation Level</div>'
  }
  $(document).ready(function() {
    var t = document.getElementById("slider-water"),
      e = $(t).prop("max");
    $(t).siblings(".count").text($(t).val() + " mm").css({
      left: $(t).val() * (100 / e) + "%",
      transform: "translateX(-" + $(t).val() * (100 / e) + "%)"
    }), $(t).siblings(".fill").css("width", $(t).val() * (100 / e) + "%"), t.oninput = function() {
      var t = JSON.parse($("#predicted-data").val());
      t.wateravailability = this.value;
      var a = JSON.stringify(t);
      $("#predicted-data").text(a), $(this).siblings(".count").text(this.value + " mm").css({
        left: this.value * (100 / e) + "%",
        transform: "translateX(-" + this.value * (100 / e) + "%)"
      }), $(this).siblings(".fill").css("width", this.value * (100 / e) + "%"), console.log(this.value)
    };
    var a = document.getElementById("slider-carbon"),
      i = $(a).prop("max");
    $(a).siblings(".count").text($(a).val() + " g").css({
      left: $(a).val() * (100 / i) + "%",
      transform: "translateX(-" + $(a).val() * (100 / i) + "%)"
    }), $(a).siblings(".fill").css("width", $(a).val() * (100 / i) + "%"), a.oninput = function() {
      var t = JSON.parse($("#predicted-data").val());
      t.soilcarbon = this.value;
      var e = JSON.stringify(t);
      $("#predicted-data").text(e), $(this).siblings(".count").text(this.value + " g").css({
        left: this.value * (100 / i) + "%",
        transform: "translateX(-" + this.value * (100 / i) + "%)"
      }), $(this).siblings(".fill").css("width", this.value * (100 / i) + "%")
    };
    var s = document.getElementById("slider-soil"),
      o = {
        1: "Poor",
        2: "Average",
        3: "Good",
        4: "Great"
      },
      l = $(s).prop("max");
    $(s).siblings(".count").text(o[$(s).val()]).css({
      left: $(s).val() * (100 / l) + "%",
      transform: "translateX(-" + $(s).val() * (100 / l) + "%)"
    }), $(s).siblings(".fill").css("width", $(s).val() * (100 / l) + "%"), s.oninput = function() {
      var t = JSON.parse($("#predicted-data").val());
      t.soilquality = this.value;
      var e = JSON.stringify(t);
      $("#predicted-data").text(e), $(this).siblings(".count").text(o[this.value]).css({
        left: this.value * (100 / l) + "%",
        transform: "translateX(-" + this.value * (100 / l) + "%)"
      }), $(this).siblings(".fill").css("width", this.value * (100 / l) + "%")
    }, $("#round-temperature").roundSlider({
      radius: 150,
      width: 40,
      circleShape: "half-top",
      sliderType: "min-range",
      value: 50,
      min: 0,
      max: 100,
      editableTooltip: !1,
      tooltipFormat: r
    }), $("#round-vegetation").roundSlider({
      radius: 150,
      width: 40,
      circleShape: "half-top",
      sliderType: "min-range",
      value: 0,
      min: -100,
      max: 100,
      editableTooltip: !1,
      tooltipFormat: n
    }), $("#round-temperature").on("change", function() {
      var t = JSON.parse($("#predicted-data").val());
      t.temperature = $(this).find("input").val();
      var e = JSON.stringify(t);
      $("#predicted-data").text(e)
    }), $("#round-vegetation").on("change", function() {
      var t = JSON.parse($("#predicted-data").val());
      t.vegetation = $(this).find("input").val() / 100;
      var e = JSON.stringify(t);
      $("#predicted-data").text(e)
    }), $(".map-tab-btn").on("click", function() {
      var t = $(this);
      $(".map-tab-btn").each(function() {
        $(this).removeClass("active")
      }), t.addClass("active")
    }), $("button").on("click", function() {
      var t = $(this);
      t.hasClass("btn-active") ? t.removeClass("btn-active") : (t.parents(".btn-js-group").find(".btn-active").removeClass("btn-active"), t.addClass("btn-active"))
    })
  }), $("#slider-water").focusout(function() {
    ! function() {
      var t = $("#predicted-data").val();
      $.ajax({
        url: "/api/updateData/",
        type: "POST",
        data: t,
        headers: {
          "Content-Type": "application/json"
        },
        success: function(t) {
          console.log("predicted data updated"), $("#predicted-yield").text(t)
        }
      })
    }()
  })
}]);
//# sourceMappingURL=main.bundle.js.map
