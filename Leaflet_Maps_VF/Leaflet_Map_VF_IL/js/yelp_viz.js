var map = new L.Map("map", {
  zoomSnap: 0.25,
  center: [40.12, -88.24],
  zoom: 11.5
})

foo_list = [];
var layer = new L.StamenTileLayer("terrain");
map.addLayer(layer);

L.AwesomeMarkers.Icon.prototype.options.prefix = 'ion';


function recommender(category) {
  category==$('input.typeahead.tt-input').val();
  $.getJSON("/data/il_grid_boxes_category_counts.json", function(boxdata){
    console.log(boxdata);
    console.log(category);

  function colorsorter(i, category) {
   if(boxdata[i].category_counts[String(category)]>0){return "green"}
   else if (boxdata[i].category_counts["no business found in this area"]==1) {return "#2262CC"}
   else {return "red"}
    }; 

    var bounds = [[0, 0],[0, 0]];
    var new_square;
    var squares_list=[];
    if (typeof SquaresLayerGroup !== 'undefined') {
    map.removeLayer(SquaresLayerGroup)};

    for (i=0; i<=boxdata.length; i++){
      if(boxdata[i]){
      bounds=[
        [boxdata[i].min_lat, boxdata[i].min_long],
        [boxdata[i].max_lat, boxdata[i].max_long]
        ];
      new_square=L.rectangle(bounds, 
        { color: colorsorter(i, category),
          weight: 0.1,
          opacity: 0.6,
          fillOpacity: 0.3,
          FillColor: colorsorter(i, category) 
        });
      squares_list.push(new_square)
      }};
    SquaresLayerGroup = L.layerGroup(squares_list).addTo(map);
    });
  };


var colorScale = d3.scaleLinear().domain([0,5]).range(["#000000", "#ffcc01"]);

function putPointsOnMap(category_list, data) {
  if (typeof MarkerLayerGroup !== 'undefined') {
    map.removeLayer(MarkerLayerGroup)
  }
  marker_list = []
  //console.log(data)
  var data_length = data.length;
  for (var i = 0; i <= data_length; i++) {
    //console.log(data[i])
    if (data[i]) {
      for (var j = 0; j <= category_list.length; j++) {
        if (category_list[j] === data[i]["categories"]) {

          var marker = L.marker([data[i]["latitude"],data[i]["longitude"]], {
            icon: L.AwesomeMarkers.icon({
              icon: "flag",
              iconColor: colorScale(data[i]["stars"])
              })
          });
          marker_list.push(marker);
        };
      };
    };
  };
  MarkerLayerGroup = L.layerGroup(marker_list).addTo(map);
 }

function clearMap() {
  map.removeLayer(MarkerLayerGroup);
  foo_list=[];
  $('#businesstypes').remove()
  $('#business').append('<tb id="businesstypes">'+'</tb>');
  $('.typeahead').typeahead('val','')
};

function clearMapRecommender() {
  map.removeLayer(SquaresLayerGroup);
  $('.typeahead').typeahead('val','')
};

var substringMatcher = function(strs) {
  return function findMatches(q, cb) {
    var matches, substringRegex;

    // an array that will be populated with substring matches
    matches = [];

    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');

    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
      if (substrRegex.test(str)) {
        matches.push(str);
      }
    });

    cb(matches);
  };
};


// textbox entry "typeahead"

var categories = ['accessories', 'active life', 'acupuncture', 'adult entertainment', 'african', 'air duct cleaning', 'airport shuttles', 'american (new)', 'american (traditional)', 'amusement parks', 'apartments', 'appliances', 'appliances & repair', 'arcades', 'art galleries', 'art schools', 'arts & crafts', 'arts & entertainment', 'asian fusion', 'auto detailing', 'auto glass services', 'auto insurance', 'auto parts & supplies', 'auto repair', 'automotive', 'bagels', 'bakeries', 'banks & credit unions', 'barbeque', 'barbers', 'bars', 'basque', 'beauty & spas', 'bed & breakfast', 'beer', 'beer bar', 'bike repair/maintenance', 'bikes', 'body shops', 'books', 'bookstores', 'bowling', 'breakfast & brunch', 'breweries', 'bridal', 'buffets', 'building supplies', 'burgers', 'buses', 'cafes', 'candy stores', 'car dealers', 'car rental', 'car wash', 'carpet cleaning', 'carpeting', 'caterers', 'cheese shops', 'chicken wings', 'childrens clothing', 'chimney sweeps', 'chinese', 'chiropractors', 'chocolatiers & shops', 'cinema', 'climbing', 'coffee & tea', 'coffee roasteries', 'colleges & universities', 'comfort food', 'comic books', 'commercial real estate', 'community service/non-profit', 'computers', 'contractors', 'convenience stores', 'cosmetic dentists', 'cosmetics & beauty supply', 'creperies', 'cupcakes', 'custom cakes', 'dance clubs', 'day spas', 'delis', 'dentists', 'department stores', 'desserts', 'dim sum', 'diners', 'discount store', 'dive bars', 'djs', 'doctors', 'dog walkers', 'donuts', 'drugstores', 'dry cleaning & laundry', 'education', 'electricians', 'electronics', 'elementary schools', 'embroidery & crochet', 'endodontists', 'environmental testing', 'event photography', 'event planning & services', 'eyelash service', 'eyewear & opticians', 'fabric stores', 'fashion', 'fast food', 'financial services', 'fish & chips', 'fishing', 'fitness & instruction', 'floral designers', 'florists', 'flowers & gifts', 'food', 'food delivery services', 'food trucks', 'formal wear', 'furniture stores', 'garage door services', 'gardeners', 'gas stations', 'general dentistry', 'gift shops', 'gluten-free', 'gold buyers', 'golf', 'grocery', 'guns & ammo', 'gyms', 'hair removal', 'hair salons', 'hair stylists', 'handyman', 'hardware stores', 'haunted houses', 'health & medical', 'heating & air conditioning/hvac', 'hobby shops', 'home & garden', 'home & rental insurance', 'home cleaning', 'home decor', 'home inspectors', 'home services', 'hospitals', 'hot dogs', 'hot pot', 'hotels', 'hotels & travel', 'ice cream & frozen yogurt', 'imported food', 'indian', 'insurance', 'internal medicine', 'irish', 'it services & computer repair', 'italian', 'japanese', 'jewelry', 'jewelry repair', 'juice bars & smoothies', 'junk removal & hauling', 'karaoke', 'keys & locksmiths', 'kids activities', 'korean', 'landscaping', 'laundry services', 'lawyers', 'lighting fixtures & equipment', 'limos', 'lingerie', 'local flavor', 'local services', 'lounges', 'machine & tool rental', 'makeup artists', 'martial arts', 'masonry/concrete', 'mass media', 'massage', 'massage therapy', 'mattresses', 'medical supplies', 'mediterranean', 'mexican', 'middle schools & high schools', 'mobile phone accessories', 'mobile phones', 'mongolian', 'motorcycle dealers', 'motorcycle repair', 'movers', 'museums', 'music venues', 'na', 'nail salons', 'naturopathic/holistic', 'nightlife', 'notaries', 'nurseries & gardening', 'nutritionists', 'obstetricians & gynecologists', 'occupational therapy', 'oil change stations', 'olive oil', 'optometrists', 'oral surgeons', 'orthodontists', 'outlet stores', 'paint stores', 'painters', 'pakistani', 'parks', 'party & event planning', 'party supplies', 'pasta shops', 'pediatric dentists', 'personal chefs', 'pet adoption', 'pet boarding', 'pet groomers', 'pet services', 'pet sitting', 'pet stores', 'pet training', 'pets', 'photographers', 'photography stores & services', 'physical therapy', 'piercing', 'pizza', 'planetarium', 'plumbing', 'post offices', 'print media', 'printing services', 'professional services', 'property management', 'public services & government', 'races & competitions', 'radio stations', 'radiologists', 'ramen', 'real estate', 'real estate agents', 'real estate services', 'recreation centers', 'recycling center', 'religious organizations', 'restaurants', 'roofing', 'salad', 'sandwiches', 'screen printing', 'seafood', 'security services', 'security systems', 'self storage', 'session photography', 'sewing & alterations', 'shipping centers', 'shoe repair', 'shoe stores', 'shopping', 'shopping centers', 'signmaking', 'skating rinks', 'skin care', 'snow removal', 'specialty food', 'sporting goods', 'sports bars', 'sports wear', 'steakhouses', 'szechuan', 'taiwanese', 'tanning', 'tattoo', 'taxis', 'television service providers', 'tex-mex', 'thai', 'thrift stores', 'tires', 'towing', 'trainers', 'transportation', 'tree services', 'university housing', 'used', 'vape shops', 'vegan', 'venues & event spaces', 'veterinarians', 'vietnamese', 'vinyl records', 'vitamins & supplements', 'watches', 'waxing', 'web design', 'wedding planning', 'window washing', 'windows installation', 'windshield installation & repair', 'wine bars', 'womens clothing', 'wraps', 'yoga', 'zoos']
$('#the-basics .typeahead').typeahead({
  hint: true,
  highlight: true,
  minLength: 1
}, {
  name: 'categories',
  source: substringMatcher(categories)
});


function addtoMap() {
  d3.csv("data/il_data.csv", function(error, data) {
    if (error) {console.log(error);} 
    else { 
      foo_list.push($('input.typeahead.tt-input').val());
      console.log(foo_list);
      layerholder = putPointsOnMap(foo_list, data);
      businesstype=foo_list[foo_list.length-1];
      $('#businesstypes').append('<tr><td>'+businesstype+'</td></tr>')
      };
    
  });
};


var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades =  [0, .5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
        labels = ["Stars"];
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colorScale(grades[i]) + '"></i> ' + grades[i]+'<br>';
    }
  return div;
};
legend.addTo(map);

var legend2 = L.control({position: 'topright'});
legend2.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend2'),
        grades = ["There is already a business of this type in the area", "This is not a commercial area", "This is a commerical area with no businesses of this type"],
        labels = ['#8dc487', '#6b8fc9', '#eeaea7'];
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + labels[i] + '"></i> ' + grades[i] +'<br>';
    }
  return div;
};
legend2.addTo(map);
