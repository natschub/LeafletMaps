var map = new L.Map("map", {
  zoomSnap: 0.25,
  center: [43.07, -89.40],
  zoom: 11
})

foo_list = [];
var layer = new L.StamenTileLayer("terrain");
map.addLayer(layer);

L.AwesomeMarkers.Icon.prototype.options.prefix = 'ion';


function recommender(category) {
  category==$('input.typeahead.tt-input').val();
  $.getJSON("/data/wi_grid_boxes_category_counts.json", function(boxdata){
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

var categories = ['accessories', 'accountants', 'active life', 'acupuncture', 'adult', 'adult education', 'afghan', 'airport shuttles', 'amateur sports teams', 'american (new)', 'american (traditional)', 'amusement parks', 'animal shelters', 'antiques', 'apartments', 'appliances', 'appliances & repair', 'arcades', 'art classes', 'art galleries', 'art museums', 'art supplies', 'arts & crafts', 'arts & entertainment', 'asian fusion', 'attraction farms', 'auto customization', 'auto detailing', 'auto glass services', 'auto insurance', 'auto loan providers', 'auto parts & supplies', 'auto repair', 'automotive', 'ayurveda', 'baby gear & furniture', 'bagels', 'bakeries', 'banks & credit unions', 'barbeque', 'barbers', 'bars', 'bartenders', 'basque', 'beaches', 'beauty & spas', 'bed & breakfast', 'beer', 'beer bar', 'bike rentals', 'bike repair/maintenance', 'bikes', 'bistros', 'blow dry/out services', 'boating', 'body shops', 'books', 'bookstores', 'boot camps', 'botanical gardens', 'bowling', 'boxing', 'brasseries', 'breakfast & brunch', 'breweries', 'bridal', 'buffets', 'building supplies', 'burgers', 'business consulting', 'butcher', 'cafes', 'cajun/creole', 'candy stores', 'cantonese', 'car buyers', 'car dealers', 'car rental', 'car stereo installation', 'car wash', 'cards & stationery', 'caribbean', 'carpet cleaning', 'carpeting', 'caterers', 'challenge courses', 'cheese shops', 'chicken shop', 'chicken wings', 'child care & day care', 'childrens clothing', 'childrens museums', 'chinese', 'chiropractors', 'chocolatiers & shops', 'churches', 'cinema', 'clock repair', 'cocktail bars', 'coffee & tea', 'colleges & universities', 'colombian', 'comedy clubs', 'comfort food', 'comic books', 'community centers', 'community service/non-profit', 'computers', 'contractors', 'convenience stores', 'cosmetic dentists', 'cosmetic surgeons', 'cosmetics & beauty supply', 'cosmetology schools', 'counseling & mental health', 'couriers & delivery services', 'csa', 'cupcakes', 'cycling classes', 'dance clubs', 'dance schools', 'dance studios', 'data recovery', 'day spas', 'delis', 'dentists', 'department stores', 'departments of motor vehicles', 'desserts', 'diagnostic imaging', 'diagnostic services', 'diners', 'discount store', 'distilleries', 'dive bars', 'do-it-yourself food', 'doctors', 'dog parks', 'dog walkers', 'donuts', 'driving schools', 'drugstores', 'dry cleaning & laundry', 'education', 'electricians', 'electronics', 'electronics repair', 'elementary schools', 'emergency pet hospital', 'empanadas', 'employment agencies', 'endodontists', 'estate planning law', 'ethnic food', 'event photography', 'event planning & services', 'eyebrow services', 'eyelash service', 'eyewear & opticians', 'fabric stores', 'family practice', 'farmers market', 'farming equipment', 'fashion', 'fast food', 'fertility', 'festivals', 'financial services', 'fish & chips', 'fishing', 'fitness & instruction', 'flight instruction', 'float spa', 'flooring', 'floral designers', 'florists', 'flowers & gifts', 'food', 'food delivery services', 'food stands', 'food trucks', 'framing', 'french', 'fruits & veggies', 'furniture stores', 'garage door services', 'gardeners', 'gas stations', 'gastropubs', 'gay bars', 'general dentistry', 'gift shops', 'glass & mirrors', 'gluten-free', 'gold buyers', 'golf', 'graphic design', 'greek', 'grocery', 'guest houses', 'gun/rifle ranges', 'gutter services', 'gymnastics', 'gyms', 'hair extensions', 'hair removal', 'hair salons', 'hair stylists', 'handyman', 'hardware stores', 'haunted houses', 'hawaiian', 'head shops', 'health & medical', 'health markets', 'heating & air conditioning/hvac', 'high fidelity audio equipment', 'hiking', 'himalayan/nepalese', 'hobby shops', 'home & garden', 'home cleaning', 'home decor', 'home inspectors', 'home services', 'home theatre installation', 'horseback riding', 'hospitals', 'hot tub & pool', 'hotels', 'hotels & travel', 'hunting & fishing supplies', 'ice cream & frozen yogurt', 'indian', 'insurance', 'interior design', 'international grocery', 'internet cafes', 'interval training gyms', 'investing', 'irish pub', 'it services & computer repair', 'italian', 'japanese', 'jewelry', 'jewelry repair', 'juice bars & smoothies', 'keys & locksmiths', 'kids activities', 'kitchen & bath', 'knitting supplies', 'korean', 'landmarks & historical buildings', 'landscape architects', 'landscaping', 'laotian', 'laser eye surgery/lasik', 'laundry services', 'lawyers', 'libraries', 'life coach', 'lighting fixtures & equipment', 'limos', 'lingerie', 'local flavor', 'local services', 'lounges', 'makeup artists', 'malaysian', 'marketing', 'martial arts', 'masonry/concrete', 'mass media', 'massage', 'massage therapy', 'mattresses', 'meat shops', 'medical centers', 'medical supplies', 'meditation centers', 'mediterranean', 'mens clothing', 'mens hair salons', 'mexican', 'mini golf', 'mobile dent repair', 'mobile phone repair', 'mobile phones', 'mortgage brokers', 'motorcycle dealers', 'motorcycle repair', 'movers', 'museums', 'music & dvds', 'music venues', 'musical instrument services', 'musical instruments & teachers', 'na', 'nail salons', 'nail technicians', 'naturopathic/holistic', 'neurologist', 'nightlife', 'noodles', 'notaries', 'nurseries & gardening', 'nutritionists', 'obstetricians & gynecologists', 'office cleaning', 'office equipment', 'oil change stations', 'ophthalmologists', 'optometrists', 'oral surgeons', 'organic stores', 'orthodontists', 'outdoor gear', 'packing services', 'paddleboarding', 'paint & sip', 'painters', 'pakistani', 'parenting classes', 'parking', 'parks', 'party & event planning', 'party bus rentals', 'party equipment rentals', 'party supplies', 'pediatric dentists', 'performing arts', 'periodontists', 'permanent makeup', 'personal assistants', 'peruvian', 'pest control', 'pet adoption', 'pet breeders', 'pet groomers', 'pet services', 'pet sitting', 'pet stores', 'pet training', 'pets', 'pharmacy', 'photographers', 'photography stores & services', 'physical therapy', 'pick your own farms', 'piercing', 'pilates', 'pizza', 'playgrounds', 'plumbing', 'podiatrists', 'poke', 'pool & hot tub service', 'popcorn shops', 'post offices', 'poutineries', 'preschools', 'print media', 'printing services', 'professional services', 'property management', 'public services & government', 'pubs', 'races & competitions', 'radiologists', 'ramen', 'real estate', 'real estate agents', 'real estate services', 'recreation centers', 'recycling center', 'reflexology', 'rehabilitation center', 'reiki', 'religious organizations', 'restaurants', 'roadside assistance', 'rolfing', 'roofing', 'russian', 'rv dealers', 'rv repair', 'salad', 'sandwiches', 'scuba diving', 'seafood', 'security systems', 'self storage', 'session photography', 'sewing & alterations', 'shades & blinds', 'shipping centers', 'shoe repair', 'shoe stores', 'shopping', 'shopping centers', 'siding', 'signmaking', 'skate shops', 'skating rinks', 'ski & snowboard shops', 'skin care', 'smokehouse', 'snow removal', 'social clubs', 'solar installation', 'soup', 'southern', 'spanish', 'specialty food', 'specialty schools', 'sporting goods', 'sports bars', 'sports wear', 'spray tanning', 'sri lankan', 'stadiums & arenas', 'steakhouses', 'street vendors', 'supernatural readings', 'supper clubs', 'sushi bars', 'swimming pools', 'synagogues', 'tacos', 'taiwanese', 'talent agencies', 'tanning', 'tanning beds', 'tapas bars', 'tasting classes', 'tattoo', 'tax services', 'taxis', 'tea rooms', 'telecommunications', 'television service providers', 'test preparation', 'tex-mex', 'thai', 'threading services', 'thrift stores', 'tiling', 'tires', 'tobacco shops', 'tours', 'towing', 'toy stores', 'traditional chinese medicine', 'trainers', 'trampoline parks', 'transmission repair', 'transportation', 'travel services', 'tree services', 'truck rental', 'tv mounting', 'used', 'used bookstore', 'used car dealers', 'utilities', 'vape shops', 'vegan', 'vegetarian', 'venues & event spaces', 'veterinarians', 'video game stores', 'videos & video game rental', 'vietnamese', 'vinyl records', 'vitamins & supplements', 'watch repair', 'watches', 'water heater installation/repair', 'waxing', 'web design', 'wedding planning', 'weight loss centers', 'wheel & rim repair', 'wholesale stores', 'window washing', 'windows installation', 'wine bars', 'wine tasting classes', 'wine tasting room', 'wineries', 'womens clothing', 'wraps', 'yelp events', 'yoga', 'zoos']
$('#the-basics .typeahead').typeahead({
  hint: true,
  highlight: true,
  minLength: 1
}, {
  name: 'categories',
  source: substringMatcher(categories)
});


function addtoMap() {
  d3.csv("data/wi_data.csv", function(error, data) {
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
