var map = new L.Map("map", {
  zoomSnap: 0.25,
  center: [41.35, -81.7],
  zoom: 9.75
})

foo_list = [];
var layer = new L.StamenTileLayer("terrain");
map.addLayer(layer);

L.AwesomeMarkers.Icon.prototype.options.prefix = 'ion';


function recommender(category) {
  category==$('input.typeahead.tt-input').val();
  $.getJSON("/data/oh_grid_boxes_category_counts.json", function(boxdata){
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

var categories = ['accessories', 'accountants', 'active life', 'acupuncture', 'adult', 'adult education', 'adult entertainment', 'african', 'air duct cleaning', 'airlines', 'airport shuttles', 'airports', 'american (new)', 'american (traditional)', 'amusement parks', 'animal shelters', 'antiques', 'apartments', 'appliances', 'appliances & repair', 'arcades', 'archery', 'art classes', 'art schools', 'art supplies', 'arts & crafts', 'arts & entertainment', 'asian fusion', 'auction houses', 'auto customization', 'auto detailing', 'auto glass services', 'auto loan providers', 'auto parts & supplies', 'auto repair', 'auto upholstery', 'automotive', 'baby gear & furniture', 'bagels', 'bakeries', 'banks & credit unions', 'barbeque', 'barbers', 'barre classes', 'bars', 'bartenders', 'bartending schools', 'battery stores', 'batting cages', 'beaches', 'beauty & spas', 'bed & breakfast', 'beer', 'beer bar', 'beer tours', 'bike rentals', 'bike repair/maintenance', 'bikes', 'blow dry/out services', 'boat charters', 'boating', 'body shops', 'books', 'bookstores', 'boot camps', 'botanical gardens', 'bowling', 'boxing', 'breakfast & brunch', 'breweries', 'brewpubs', 'bridal', 'bubble tea', 'buffets', 'building supplies', 'burgers', 'business law', 'butcher', 'cabinetry', 'cafes', 'cafeteria', 'cajun/creole', 'cambodian', 'campgrounds', 'candle stores', 'candy stores', 'cantonese', 'car buyers', 'car dealers', 'car rental', 'car stereo installation', 'car wash', 'car window tinting', 'cards & stationery', 'caribbean', 'carpenters', 'carpet cleaning', 'carpet installation', 'carpeting', 'caterers', 'challenge courses', 'cheese shops', 'cheesesteaks', 'chicken shop', 'chicken wings', 'child care & day care', 'childrens clothing', 'chimney sweeps', 'chinese', 'chiropractors', 'chocolatiers & shops', 'christmas trees', 'churches', 'cinema', 'cocktail bars', 'coffee & tea', 'coffee roasteries', 'colleges & universities', 'colombian', 'comedy clubs', 'comfort food', 'comic books', 'community centers', 'community service/non-profit', 'computers', 'concept shops', 'contractors', 'convenience stores', 'cooking classes', 'cooking schools', 'cosmetic dentists', 'cosmetic surgeons', 'cosmetics & beauty supply', 'cosmetology schools', 'counseling & mental health', 'countertop installation', 'country clubs', 'couriers & delivery services', 'cremation services', 'creperies', 'cultural center', 'cupcakes', 'custom cakes', 'cycling classes', 'damage restoration', 'dance clubs', 'data recovery', 'day spas', 'decks & railing', 'delis', 'demolition services', 'dentists', 'department stores', 'departments of motor vehicles', 'dermatologists', 'desserts', 'diagnostic services', 'diners', 'disc golf', 'discount store', 'dive bars', 'djs', 'do-it-yourself food', 'doctors', 'dog parks', 'dog walkers', 'donation center', 'donuts', 'door sales/installation', 'drugstores', 'dry cleaning', 'dry cleaning & laundry', 'drywall installation & repair', 'education', 'educational services', 'elder care planning', 'electricians', 'electronics', 'electronics repair', 'elementary schools', 'embroidery & crochet', 'emergency pet hospital', 'emergency rooms', 'endodontists', 'escape games', 'ethnic food', 'event photography', 'event planning & services', 'eyebrow services', 'eyelash service', 'eyewear & opticians', 'fabric stores', 'family practice', 'farmers market', 'farming equipment', 'fashion', 'fast food', 'festivals', 'filipino', 'financial services', 'firearm training', 'fireplace services', 'fish & chips', 'fishing', 'fitness & instruction', 'fitness/exercise equipment', 'flea markets', 'flight instruction', 'flooring', 'floral designers', 'florists', 'flowers', 'flowers & gifts', 'food', 'food court', 'food delivery services', 'food stands', 'food trucks', 'framing', 'fruits & veggies', 'funeral services & cemeteries', 'fur clothing', 'furniture assembly', 'furniture reupholstery', 'furniture stores', 'game truck rental', 'garage door services', 'gardeners', 'gas stations', 'gastroenterologist', 'gastropubs', 'gay bars', 'gelato', 'general dentistry', 'german', 'gift shops', 'gluten-free', 'gold buyers', 'golf', 'golf lessons', 'graphic design', 'greek', 'grocery', 'gun/rifle ranges', 'guns & ammo', 'gymnastics', 'gyms', 'hair extensions', 'hair loss centers', 'hair removal', 'hair salons', 'hair stylists', 'halal', 'handyman', 'hardware stores', 'hats', 'haunted houses', 'head shops', 'health & medical', 'health markets', 'heating & air conditioning/hvac', 'high fidelity audio equipment', 'hiking', 'himalayan/nepalese', 'hobby shops', 'holiday decorations', 'home & garden', 'home & rental insurance', 'home automation', 'home cleaning', 'home decor', 'home health care', 'home inspectors', 'home organization', 'home services', 'home theatre installation', 'hookah bars', 'horse boarding', 'horseback riding', 'hospice', 'hospitals', 'hot dogs', 'hot pot', 'hot tub & pool', 'hotels', 'hotels & travel', 'hunting & fishing supplies', 'ice cream & frozen yogurt', 'imported food', 'indian', 'indonesian', 'insurance', 'interior design', 'international grocery', 'internet service providers', 'interval training gyms', 'investing', 'irish', 'irish pub', 'it services & computer repair', 'italian', 'japanese', 'jazz & blues', 'jewelry', 'jewelry repair', 'juice bars & smoothies', 'junk removal & hauling', 'karaoke', 'kebab', 'keys & locksmiths', 'kids activities', 'kitchen & bath', 'kitchen incubators', 'knitting supplies', 'korean', 'kosher', 'laboratory testing', 'lactation services', 'lakes', 'landmarks & historical buildings', 'landscape architects', 'landscaping', 'laser eye surgery/lasik', 'laser hair removal', 'latin american', 'laundromat', 'laundry services', 'lawyers', 'leather goods', 'lebanese', 'leisure centers', 'libraries', 'life coach', 'life insurance', 'lighting fixtures & equipment', 'limos', 'lingerie', 'local fish stores', 'local flavor', 'local services', 'lounges', 'luggage', 'macarons', 'makeup artists', 'marinas', 'marketing', 'martial arts', 'masonry/concrete', 'mass media', 'massage', 'massage schools', 'massage therapy', 'maternity wear', 'mattresses', 'meat shops', 'medical centers', 'medical law', 'medical spas', 'medical supplies', 'meditation centers', 'mediterranean', 'mens clothing', 'mens hair salons', 'metal fabricators', 'mexican', 'middle eastern', 'middle schools & high schools', 'mini golf', 'mobile phone accessories', 'mobile phone repair', 'mobile phones', 'modern european', 'moroccan', 'mortgage brokers', 'motorcycle dealers', 'movers', 'museums', 'music & dvds', 'music venues', 'musical instrument services', 'musical instruments & teachers', 'na', 'nail salons', 'nail technicians', 'naturopathic/holistic', 'new mexican cuisine', 'newspapers & magazines', 'nightlife', 'noodles', 'notaries', 'nurseries & gardening', 'nutritionists', 'obstetricians & gynecologists', 'occupational therapy', 'office cleaning', 'office equipment', 'oil change stations', 'olive oil', 'ophthalmologists', 'optometrists', 'oral surgeons', 'organic stores', 'orthodontists', 'orthopedists', 'outdoor furniture stores', 'outdoor gear', 'outlet stores', 'packing services', 'paddleboarding', 'paint & sip', 'painters', 'pakistani', 'parking', 'parks', 'party & event planning', 'party bike rentals', 'party bus rentals', 'party equipment rentals', 'party supplies', 'pasta shops', 'patisserie/cake shop', 'pawn shops', 'pediatric dentists', 'performing arts', 'periodontists', 'permanent makeup', 'pest control', 'pet adoption', 'pet boarding', 'pet groomers', 'pet insurance', 'pet services', 'pet sitting', 'pet stores', 'pet training', 'pets', 'pharmacy', 'photographers', 'photography stores & services', 'physical therapy', 'piano stores', 'pick your own farms', 'piercing', 'pilates', 'pizza', 'plastic surgeons', 'playgrounds', 'plumbing', 'plus size fashion', 'podiatrists', 'police departments', 'polish', 'pool & billiards', 'pool halls', 'popcorn shops', 'post offices', 'preschools', 'pretzels', 'print media', 'printing services', 'private tutors', 'professional services', 'propane', 'property management', 'psychologists', 'public services & government', 'public transportation', 'pubs', 'puerto rican', 'race tracks', 'radio stations', 'rafting/kayaking', 'ramen', 'real estate', 'real estate agents', 'real estate services', 'recreation centers', 'refinishing services', 'reflexology', 'rehabilitation center', 'reiki', 'religious items', 'religious organizations', 'resorts', 'restaurants', 'retirement homes', 'rock climbing', 'roofing', 'rugs', 'rv dealers', 'rv repair', 'salad', 'salvadoran', 'sandwiches', 'screen printing/t-shirt printing', 'seafood', 'seafood markets', 'security services', 'security systems', 'self storage', 'septic services', 'session photography', 'sewing & alterations', 'shades & blinds', 'shanghainese', 'shared office spaces', 'shaved ice', 'shipping centers', 'shoe repair', 'shoe stores', 'shopping', 'shopping centers', 'siding', 'signmaking', 'skating rinks', 'ski & snowboard shops', 'skin care', 'sledding', 'smog check stations', 'smokehouse', 'soccer', 'social clubs', 'soul food', 'soup', 'southern', 'spanish', 'specialty food', 'specialty schools', 'sporting goods', 'sports bars', 'sports clubs', 'sports medicine', 'sports wear', 'spray tanning', 'stadiums & arenas', 'steakhouses', 'street vendors', 'sugaring', 'summer camps', 'supernatural readings', 'sushi bars', 'swimming lessons/schools', 'swimming pools', 'szechuan', 'tacos', 'tanning', 'tapas bars', 'tapas/small plates', 'tasting classes', 'tattoo', 'tattoo removal', 'tax services', 'taxis', 'tea rooms', 'teeth whitening', 'telecommunications', 'television service providers', 'tennis', 'tex-mex', 'thai', 'threading services', 'thrift stores', 'ticket sales', 'tiki bars', 'tires', 'tobacco shops', 'tours', 'towing', 'toy stores', 'traditional chinese medicine', 'trainers', 'trampoline parks', 'transmission repair', 'transportation', 'travel services', 'tree services', 'truck rental', 'turkish', 'ukrainian', 'university housing', 'urgent care', 'used', 'used car dealers', 'utilities', 'vacation rentals', 'valet services', 'vape shops', 'vegan', 'vegetarian', 'vehicle shipping', 'venues & event spaces', 'veterinarians', 'video game stores', 'video/film production', 'videographers', 'videos & video game rental', 'vietnamese', 'vinyl records', 'vitamins & supplements', 'waffles', 'watch repair', 'watches', 'water heater installation/repair', 'waterproofing', 'waxing', 'wedding chapels', 'wedding planning', 'weight loss centers', 'wheel & rim repair', 'wholesale stores', 'wildlife control', 'windows installation', 'windshield installation & repair', 'wine bars', 'wine tasting room', 'womens clothing', 'wraps', 'yelp events', 'yoga', 'ziplining', 'zoos']
$('#the-basics .typeahead').typeahead({
  hint: true,
  highlight: true,
  minLength: 1
}, {
  name: 'categories',
  source: substringMatcher(categories)
});


function addtoMap() {
  d3.csv("data/oh_data.csv", function(error, data) {
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
