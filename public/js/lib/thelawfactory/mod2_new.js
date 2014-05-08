var orderedByStatus = true;
var sortByStat;
var sortByParty;
var draw;
var drawMerged;
var grouped=null;
var api_root;


(function(){

  var thelawfactory = window.thelawfactory || (window.thelawfactory = {});

  thelawfactory.mod2 = function(){

    function get_status_img(e){
        if(e.sort==="adopté") return "img/ok.png";
        else if(e.sort==="rejeté") return "img/ko.png";
        else if(e.sort==="non-voté") return "img/nd.png";
    }

  	function vis(selection){
    	
		var groups,articles;
		
	selection.each(function(d,i){
		groups=d.groupes;
		articles=d.sujets;
		api_root=d.api_root_url;
	})


        selectRow = function(art,pos) {

            if(d3.event) d3.event.stopPropagation();

            var sel = d3.select("."+art);

            if(!sel.empty()) {

                d3.selectAll("g").style("opacity", 0.2);

                sel.style("opacity", 1);

                if(pos) $("#viz").animate({ scrollTop: sel.attr("data-offset") })
            }
        };

        deselectRow = function() {
            d3.selectAll("g").style("opacity",1);
        };


	
	artArray=d3.values(articles).sort(function(a,b){return a.order-b.order})
		
		var w = $("#viz").width()-30,
		    rw = $("#viz").width(),
		    lineh = 30,
		    h = lineh*artArray.length+40,
		    z = 20,
		    x = Math.round((w-40) / z),
		    y = h / z;
	    var jumpLines = 0
		var offset = 0
		var svg = d3.select("#viz").append("svg")
		    .attr("width", rw)
		    .attr("height", h)
            .on("click",deselectRow);

        drawMerged = function() {
            $("svg").empty();
            if(!grouped) {
                grouped = {titre:'all articles',key: 'all articles', amendements:[]}
                artArray.forEach(function(d,i) {
                    grouped.amendements=grouped.amendements.concat(d.amendements)
                })
            }
            jumpLines=0
            drawLines(grouped,0)
        }

        function chk_scroll(e)
        {
            e.stopPropagation();
            var elem = $(e.currentTarget);
            if (elem[0].scrollHeight - elem.scrollTop() == elem.outerHeight())
            {
                $(".end-tip").fadeOut(200);
            }
            else {
                if(!$(".end-tip").is(":visible")) $(".end-tip").fadeIn(200);

            }

        }

        var compare_partys = function(a,b){
                if (groups[a].order < groups[b].order) return -1;
                if (groups[a].order > groups[b].order) return 1;
            },
            statsorder = {"adopté": 0, "rejeté": 1, "non-voté": 2},
            compare_stats = function(a,b){
                if (statsorder[a] < statsorder[b]) return -1;
                if (statsorder[a] > statsorder[b]) return 1;
            },
            compare_by_party = function(a,b){
                if (a.groupe != b.groupe) return compare_partys(a.groupe, b.groupe);
                if (a.sort != b.sort) return compare_stats(a.sort, b.sort);
                return a.numero - b.numero;
            },
            compare_by_stat = function(a,b){
                if (a.sort != b.sort) return compare_stats(a.sort, b.sort);
                if (a.groupe != b.groupe) return compare_partys(a.groupe, b.groupe);
                return a.numero - b.numero;
            };

        sortByStat = function() {
            $("svg").empty();
            $(".text-container").empty();
            if (grouped) {
                grouped['amendements'].sort(compare_by_stat);
                drawMerged();
            } else {
                artArray.forEach(function(d,i) {
                    d['amendements'].sort(compare_by_stat);
                });
                draw();
            }
        };

        sortByParty = function() {
            $("svg").empty();
            $(".text-container").empty();
            if (grouped) {
                grouped['amendements'].sort(compare_by_party);
                drawMerged();
            } else {
                artArray.forEach(function(d,i) {
                    d['amendements'].sort(compare_by_party);
                });
                draw();
            }
        };

        draw = function() {
            jumpLines=0
            $("svg").empty();
            artArray.forEach(function(d,i) {
                drawLines(d,i)
            })
            
            grouped=null;
        }
		
        function drawLines(d,i) {
          len = d.amendements.length;
		  lines = Math.ceil(len/x);
		
		  d.offset = offset
		  
		  var curRow = svg.append("g")
		  .attr("class",d.titre.replace(/ |'/g, '_').toLowerCase())
		  .attr("transform","translate("+10+","+(i*20+i*lineh+10+jumpLines*(lineh-10))+")")
		  .attr("data-offset", (i*20+i*lineh+10+jumpLines*(lineh-10)))
		  .call(function(){	
		  	n=d.amendements.length;
		  	offset = Math.floor(n/x)
		  	jumpLines = jumpLines + Math.floor(n/x);
		  })

		  
		  var bg = curRow
		  .selectAll(".bg")
		  .data(d3.range(x*lines))
		  .enter()
		
		  bg.append("rect")
		  .attr("x", function(f){ return (f % x) * z +21 })
		  .attr("y", function(f){ return Math.floor(f / x) * z + 21 })
		  .attr("width", z-2)
		  .attr("height", z-2)
		  .attr("rx",2)
		  .attr("ry",2)
		  .attr("class","bg")
		  .style("fill", "#E6E6E6")
		
		
		  var margin = d.offset == 0 ? 'style="margin-top : 10px"' : 'style="margin-top : '+(10+20*d.offset)+'px "';
		  console.log("key",d.key)
          var subj = d.titre
		
		
		curRow.append("text")
		.attr("x",20)
        .attr("class","row-txt")
		.attr("y",15)
		.style("fill","#333")
		.attr("font-size","0.85em")
		.text(d.titre)
        .on("click",function(){selectRow(d.titre.toLowerCase().replace(/ |'/g, '_'),false)});
		
        var popover = function(d){
          var titre = d.numero,
              date = d.date,
              gr = d.groupe,
              status = d.sort,
              div = d3.select(document.createElement("div"))
                .style("height", "120px")
                .style("width", "100%")
                .attr("class","popup-mod2");
          div.append("p").html("<b>Date :</b> " + date+"<br/><br/>");
          div.append("p").html("<b>Groupe politique :</b> " + gr+"<br/><br/>");
          div.append("p").html("<b>Sort :</b> " + status+"<br/><br/>")
          return {        
              title: "Amendement " + titre,
              content: div ,
              placement: "mouse",
              gravity: "right",
              displacement: [10, -90],          
              mousemove: true
          };
        }
		
		var amds = curRow
		  .selectAll(".amd")
		  .data(d.amendements)
		  .enter();
		amds.append("rect")
		  .attr("x", function(f,i){ return (i % x) * z +21 })
		  .attr("y", function(f,i){ return Math.floor(i / x) * z + 21 })
		  .attr("width", z-2)
		  .attr("height", z-2)
		  .attr("rx",2)
		  .attr("ry",2)
		  .attr("class","amd")
		  .style("fill", color)
  		  .popover(popover)
          .on("click",select);
            
        var imgs = curRow
          .selectAll("image")
          .data(d.amendements)
          .enter();
        imgs.append("svg:image")
            .attr("x", function(f,i){ return (i % x) * z +25 })
		    .attr("y", function(f,i){ return Math.floor(i / x) * z + 25 })
		    .attr("width", z-10)
		    .attr("height", z-10)
		    .attr("xlink:href",get_status_img)
		    .popover(popover)
            .on("click",select);
            
        var a = d3.select("svg").select("g:last-child").attr("data-offset")
		var ah = d3.select("svg").select("g:last-child").node().getBBox().height;
		svg.attr("height",parseInt(a)+ah+20)

        }

		function select(d) {

            d3.event.stopPropagation()
			$(".text-container").show();
			d3.selectAll(".actv-amd")
			.style("fill",color)
			.style("stroke","none" )
			.classed("actv-amd",false);

			d3.json(api_root+d.id_api+'/json',function(error,json){
				var currAmd = json.amendement,
                    source_am = '.fr</a> &mdash; <a href="'+currAmd.source+'">',
                    statico = get_status_img(d),
                    col = color(d);
                if (currAmd.url_nosdeputes) source_am = '<a href="'+currAmd.url_nosdeputes+'">NosDéputés'+source_am+'Assemblée nationale</a>';
                else if(currAmd.url_nossenateurs) source_am = '<a href="'+currAmd.url_nossenateurs+'">NosSénateurs'+source_am+'Sénat</a>';
                $(".text-container").html(
                    "<p><b>Date :</b> " + d3.time.format("%d/%m/%Y")(d3.time.format("%Y-%m-%d").parse(d.date)) + "</p>" +
                    "<p><b>Objet :</b> " + currAmd.sujet+"</p>" +
                    "<p><b>Signataires :</b> " + currAmd.signataires+"</p>" + 
                    "<p><b>Statut :</b> " + currAmd.sort + " <span class='amd-txt-status' style='background-color:"+col+"'><img style='margin:0; padding:4px;' src='"+statico+"'/></span> </p>" +
                    "<p><b>Exposé des motifs :</b> " + currAmd.expose+"</p>" +
                    "<p><b>Texte :</b> " + currAmd.texte +
                    "<p><small><b>Source :</b> " + source_am + "</small></p>"
                );
			})
		console.log(this);	
			d3.select(this)
			.attr("class","actv-amd")
			//.style("fill","#fff")
			.style("stroke","#D80053" )
			.style("stroke-width","2" )
			$("#text-title").text("Amendement "+d.numero)
			$('.text-container').scrollTop(0);
			if(!$(".end-tip").is(":visible")) $(".end-tip").fadeIn(200);
		}
		
	    function adjust_color(c){
            var col = d3.hsl(c);
            if (col.s>0.5) col.s = 0.5;
            if (col.l<0.7) col.l = 0.7;
            return col;
        }

		function color(d) { 
			if(groups[d.groupe]) {
				return adjust_color(groups[d.groupe].color).toString();
			} else return "#E6E6E6";
        }

		function legend(t) {
			d3.entries(groups).forEach(function(e,i){
                var col = adjust_color(e.value.color);
				$(".colors").append('<div class="leg-item"><div class="leg-value" style="background-color:'+col+'"></div><div class="leg-key">'+e.key+'</div></div>')
			})
		}

        $(document).ready(function() {
            legend();
            $('.text-container').bind('scroll',chk_scroll);
            if (orderedByStatus) sortByStat();
            else sortByParty();
        });


    }; //end function vis

	
    return vis;
  };

})();
