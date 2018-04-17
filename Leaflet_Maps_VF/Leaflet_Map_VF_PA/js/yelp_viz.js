var map = new L.Map("map", {
  zoomSnap: 0.25,
  center: [40.44, -79.99],
  zoom: 11
})

foo_list = [];
var layer = new L.StamenTileLayer("terrain");
map.addLayer(layer);

L.AwesomeMarkers.Icon.prototype.options.prefix = 'ion';


function recommender(category) {
  category==$('input.typeahead.tt-input').val();
  $.getJSON("/data/pa_grid_boxes_category_counts.json", function(boxdata){
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

var categories = ['accessories', 'accountants', 'active life', 'acupuncture', 'adult', 'adult entertainment', 'advertising', 'air duct cleaning', 'airlines', 'airport shuttles', 'airports', 'amateur sports teams', 'american (new)', 'american (traditional)', 'amusement parks', 'animal shelters', 'antiques', 'apartments', 'appliances', 'appliances & repair', 'appraisal services', 'aquarium services', 'arcades', 'architectural tours', 'argentine', 'art classes', 'art galleries', 'art museums', 'art schools', 'art supplies', 'arts & crafts', 'arts & entertainment', 'asian fusion', 'auto customization', 'auto detailing', 'auto glass services', 'auto insurance', 'auto parts & supplies', 'auto repair', 'automotive', 'awnings', 'ayurveda', 'baby gear & furniture', 'bagels', 'bakeries', 'banks & credit unions', 'barbeque', 'barbers', 'barre classes', 'bars', 'bartenders', 'basque', 'battery stores', 'batting cages', 'beaches', 'beauty & spas', 'bed & breakfast', 'beer', 'beer bar', 'beer tours', 'belgian', 'bike rentals', 'bike repair/maintenance', 'bikes', 'blood & plasma donation centers', 'blow dry/out services', 'boat charters', 'boat repair', 'boating', 'body shops', 'books', 'bookstores', 'boot camps', 'botanical gardens', 'bowling', 'boxing', 'brasseries', 'breakfast & brunch', 'breweries', 'bridal', 'bubble tea', 'buffets', 'building supplies', 'burgers', 'business consulting', 'business law', 'butcher', 'cabinetry', 'cafes', 'cafeteria', 'cajun/creole', 'cambodian', 'candy stores', 'cantonese', 'car buyers', 'car dealers', 'car rental', 'car stereo installation', 'car wash', 'cards & stationery', 'caribbean', 'carpenters', 'carpet cleaning', 'carpet installation', 'carpeting', 'caterers', 'cheesesteaks', 'chicken wings', 'child care & day care', 'childrens clothing', 'chimney sweeps', 'chinese', 'chinese martial arts', 'chiropractors', 'chocolatiers & shops', 'christmas trees', 'churches', 'cinema', 'clock repair', 'cocktail bars', 'coffee & tea', 'coffee roasteries', 'coffeeshops', 'colleges & universities', 'comedy clubs', 'comfort food', 'comic books', 'community service/non-profit', 'computers', 'contractors', 'convenience stores', 'cooking schools', 'cosmetic dentists', 'cosmetic surgeons', 'cosmetics & beauty supply', 'cosmetology schools', 'costumes', 'country clubs', 'couriers & delivery services', 'courthouses', 'cremation services', 'creperies', 'cryotherapy', 'cupcakes', 'custom cakes', 'cycling classes', 'damage restoration', 'dance clubs', 'dance schools', 'dance studios', 'data recovery', 'day spas', 'delis', 'dentists', 'department stores', 'departments of motor vehicles', 'dermatologists', 'desserts', 'diagnostic imaging', 'diagnostic services', 'dim sum', 'diners', 'discount store', 'distilleries', 'dive bars', 'diving', 'divorce & family law', 'djs', 'do-it-yourself food', 'doctors', 'dog parks', 'dog walkers', 'donuts', 'door sales/installation', 'doulas', 'drive-in theater', 'driving schools', 'drugstores', 'dry cleaning', 'dry cleaning & laundry', 'education', 'electricians', 'electronics', 'electronics repair', 'elementary schools', 'embroidery & crochet', 'emergency pet hospital', 'employment agencies', 'employment law', 'endodontists', 'escape games', 'estate liquidation', 'ethnic food', 'ethnic grocery', 'event photography', 'event planning & services', 'eyebrow services', 'eyelash service', 'eyewear & opticians', 'fabric stores', 'family practice', 'farmers market', 'farming equipment', 'farms', 'fashion', 'fast food', 'fences & gates', 'festivals', 'financial services', 'fireplace services', 'fish & chips', 'fitness & instruction', 'fitness/exercise equipment', 'flooring', 'florists', 'flowers & gifts', 'food', 'food court', 'food delivery services', 'food trucks', 'formal wear', 'french', 'fruits & veggies', 'funeral services & cemeteries', 'furniture repair', 'furniture reupholstery', 'furniture stores', 'garage door services', 'gardeners', 'gas stations', 'gastropubs', 'gay bars', 'general dentistry', 'german', 'gift shops', 'glass & mirrors', 'gluten-free', 'gold buyers', 'golf', 'golf lessons', 'graphic design', 'greek', 'grilling equipment', 'grocery', 'guest houses', 'guitar stores', 'guns & ammo', 'gutter services', 'gymnastics', 'gyms', 'hair extensions', 'hair removal', 'hair salons', 'hair stylists', 'halal', 'handyman', 'hardware stores', 'health & medical', 'health markets', 'hearing aid providers', 'heating & air conditioning/hvac', 'henna artists', 'herbs & spices', 'hiking', 'himalayan/nepalese', 'hindu temples', 'hobby shops', 'home & garden', 'home cleaning', 'home decor', 'home health care', 'home inspectors', 'home organization', 'home services', 'home staging', 'home window tinting', 'hookah bars', 'horse equipment shops', 'horseback riding', 'hospice', 'hospitals', 'hot dogs', 'hotels', 'hotels & travel', 'hungarian', 'ice cream & frozen yogurt', 'imported food', 'indian', 'insurance', 'interior design', 'internal medicine', 'international grocery', 'internet service providers', 'interval training gyms', 'irish', 'it services & computer repair', 'italian', 'japanese', 'jazz & blues', 'jewelry', 'jewelry repair', 'juice bars & smoothies', 'junk removal & hauling', 'karaoke', 'keys & locksmiths', 'kids activities', 'kitchen & bath', 'knitting supplies', 'kombucha', 'korean', 'laboratory testing', 'lan centers', 'landmarks & historical buildings', 'landscape architects', 'landscaping', 'laser eye surgery/lasik', 'laser hair removal', 'laser tag', 'latin american', 'laundromat', 'laundry services', 'lawyers', 'leather goods', 'lebanese', 'legal services', 'libraries', 'life coach', 'lighting fixtures & equipment', 'limos', 'lingerie', 'local flavor', 'local services', 'lounges', 'luggage', 'makeup artists', 'malaysian', 'marketing', 'martial arts', 'masonry/concrete', 'mass media', 'massage', 'massage therapy', 'maternity wear', 'mattresses', 'meat shops', 'medical centers', 'medical spas', 'meditation centers', 'mediterranean', 'mens clothing', 'mens hair salons', 'mexican', 'middle eastern', 'mini golf', 'mobile phone accessories', 'mobile phone repair', 'mobile phones', 'modern european', 'moroccan', 'mortgage brokers', 'motorcycle dealers', 'motorcycle gear', 'motorcycle rental', 'motorcycle repair', 'movers', 'museums', 'music & dvds', 'music venues', 'musical instrument services', 'musical instruments & teachers', 'na', 'nail salons', 'naturopathic/holistic', 'new mexican cuisine', 'newspapers & magazines', 'nightlife', 'noodles', 'notaries', 'nurseries & gardening', 'nutritionists', 'obstetricians & gynecologists', 'office cleaning', 'office equipment', 'oil change stations', 'ophthalmologists', 'optometrists', 'oral surgeons', 'organic stores', 'orthodontists', 'outdoor gear', 'outlet stores', 'packing services', 'paddleboarding', 'paint & sip', 'paintball', 'painters', 'pan asian', 'parking', 'parks', 'party & event planning', 'party equipment rentals', 'party supplies', 'pasta shops', 'pawn shops', 'pediatric dentists', 'pediatricians', 'performing arts', 'periodontists', 'permanent makeup', 'personal assistants', 'personal shopping', 'peruvian', 'pest control', 'pet adoption', 'pet breeders', 'pet groomers', 'pet services', 'pet sitting', 'pet stores', 'pet training', 'pets', 'photographers', 'photography stores & services', 'physical therapy', 'piercing', 'pilates', 'pizza', 'plumbing', 'plus size fashion', 'pool & hot tub service', 'pool cleaners', 'pool halls', 'popcorn shops', 'post offices', 'poutineries', 'preschools', 'pretzels', 'print media', 'printing services', 'professional services', 'property management', 'prosthodontists', 'public art', 'public services & government', 'public transportation', 'pubs', 'races & competitions', 'radio stations', 'rafting/kayaking', 'ramen', 'real estate', 'real estate agents', 'real estate law', 'real estate services', 'recording & rehearsal studios', 'recreation centers', 'reflexology', 'registration services', 'rehabilitation center', 'reiki', 'religious organizations', 'resorts', 'restaurants', 'retirement homes', 'roadside assistance', 'rock climbing', 'roofing', 'rugs', 'russian', 'salad', 'sandwiches', 'seafood', 'seafood markets', 'security systems', 'self storage', 'septic services', 'session photography', 'sewing & alterations', 'shaved ice', 'shipping centers', 'shoe repair', 'shoe shine', 'shoe stores', 'shopping', 'shopping centers', 'siding', 'skate parks', 'skating rinks', 'ski & snowboard shops', 'skin care', 'smog check stations', 'smokehouse', 'snow removal', 'soccer', 'social clubs', 'soul food', 'soup', 'southern', 'speakeasies', 'special education', 'specialty food', 'specialty schools', 'spin classes', 'sporting goods', 'sports bars', 'sports clubs', 'sports medicine', 'sports wear', 'spray tanning', 'stadiums & arenas', 'steakhouses', 'street vendors', 'summer camps', 'supernatural readings', 'sushi bars', 'swimming lessons/schools', 'swimming pools', 'synagogues', 'szechuan', 'tacos', 'taiwanese', 'tanning', 'tanning beds', 'tapas bars', 'tapas/small plates', 'tattoo', 'tattoo removal', 'tax services', 'taxis', 'tea rooms', 'telecommunications', 'television service providers', 'television stations', 'tennis', 'test preparation', 'tex-mex', 'thai', 'threading services', 'thrift stores', 'ticket sales', 'tiki bars', 'tiling', 'tires', 'tobacco shops', 'tours', 'towing', 'town car service', 'toy stores', 'traditional chinese medicine', 'trailer repair', 'trainers', 'trampoline parks', 'transmission repair', 'transportation', 'travel services', 'tree services', 'truck rental', 'turkish', 'urgent care', 'used', 'used car dealers', 'vape shops', 'vegan', 'vegetarian', 'vehicle shipping', 'venues & event spaces', 'veterinarians', 'video game stores', 'video/film production', 'videos & video game rental', 'vietnamese', 'vinyl records', 'vitamins & supplements', 'vocational & technical school', 'walking tours', 'watch repair', 'watches', 'water heater installation/repair', 'waterproofing', 'waxing', 'wedding planning', 'weight loss centers', 'wheel & rim repair', 'whiskey bars', 'wholesale stores', 'wills', 'window washing', 'windows installation', 'windshield installation & repair', 'wine bars', 'wine tasting room', 'wine tours', 'wineries', 'womens clothing', 'yelp events', 'yoga']
$('#the-basics .typeahead').typeahead({
  hint: true,
  highlight: true,
  minLength: 1
}, {
  name: 'categories',
  source: substringMatcher(categories)
});


function addtoMap() {
  d3.csv("data/pa_data.csv", function(error, data) {
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
