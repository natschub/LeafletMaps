var map = new L.Map("map", {
  zoomSnap: 0.25,
  center: [35.22, -80.84],
  zoom: 10.5
})

foo_list = [];
var layer = new L.StamenTileLayer("terrain");
map.addLayer(layer);

L.AwesomeMarkers.Icon.prototype.options.prefix = 'ion';


function recommender(category) {
  category==$('input.typeahead.tt-input').val();
  $.getJSON("/data/nc_grid_boxes_category_counts.json", function(boxdata){
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

var categories= ['acai bowls', 'accessories', 'accountants', 'active life', 'acupuncture', 'adult', 'adult entertainment', 'advertising', 'aerial fitness', 'african', 'air duct cleaning', 'airlines', 'airport shuttles', 'airport terminals', 'airports', 'allergists', 'amateur sports teams', 'american (new)', 'american (traditional)', 'amusement parks', 'antiques', 'apartments', 'appliances', 'appliances & repair', 'arcades', 'archery', 'art classes', 'art galleries', 'art museums', 'art schools', 'art supplies', 'arts & crafts', 'arts & entertainment', 'asian fusion', 'assisted living facilities', 'attraction farms', 'auction houses', 'auto customization', 'auto detailing', 'auto glass services', 'auto insurance', 'auto parts & supplies', 'auto repair', 'automotive', 'baby gear & furniture', 'bagels', 'bakeries', 'bankruptcy law', 'banks & credit unions', 'barbeque', 'barbers', 'barre classes', 'bars', 'battery stores', 'beauty & spas', 'bed & breakfast', 'beer', 'beer bar', 'beer gardens', 'beverage store', 'bike parking', 'bike repair/maintenance', 'bikes', 'blood & plasma donation centers', 'blow dry/out services', 'boat dealers', 'boat repair', 'boating', 'body shops', 'bookkeepers', 'books', 'bookstores', 'boot camps', 'botanical gardens', 'bowling', 'boxing', 'brazilian jiu-jitsu', 'breakfast & brunch', 'breweries', 'brewing supplies', 'bridal', 'british', 'bubble tea', 'buddhist temples', 'buffets', 'building supplies', 'burgers', 'business consulting', 'business law', 'butcher', 'cabinetry', 'cafes', 'cafeteria', 'cajun/creole', 'candy stores', 'cantonese', 'car dealers', 'car inspectors', 'car rental', 'car stereo installation', 'car wash', 'cardio classes', 'cards & stationery', 'career counseling', 'caribbean', 'carpenters', 'carpet cleaning', 'carpet installation', 'carpeting', 'caterers', 'challenge courses', 'cheesesteaks', 'chicken shop', 'chicken wings', 'child care & day care', 'childproofing', 'childrens clothing', 'childrens museums', 'chinese', 'chiropractors', 'chocolatiers & shops', 'churches', 'cideries', 'cinema', 'cocktail bars', 'coffee & tea', 'coffee roasteries', 'colleges & universities', 'colombian', 'comedy clubs', 'comfort food', 'community centers', 'community service/non-profit', 'computers', 'contractors', 'convenience stores', 'cooking classes', 'cosmetic dentists', 'cosmetic surgeons', 'cosmetics & beauty supply', 'cosmetology schools', 'counseling & mental health', 'couriers & delivery services', 'courthouses', 'cremation services', 'creperies', 'criminal defense law', 'cryotherapy', 'cuban', 'cultural center', 'cupcakes', 'custom cakes', 'cycling classes', 'damage restoration', 'dance clubs', 'dance schools', 'dance studios', 'data recovery', 'day camps', 'day spas', 'decks & railing', 'delis', 'demolition services', 'dentists', 'department stores', 'departments of motor vehicles', 'dermatologists', 'desserts', 'diagnostic imaging', 'diagnostic services', 'diners', 'disc golf', 'discount store', 'distilleries', 'dive bars', 'divorce & family law', 'djs', 'do-it-yourself food', 'doctors', 'dog parks', 'dog walkers', 'dominican', 'donuts', 'door sales/installation', 'driving schools', 'drugstores', 'dry cleaning', 'dry cleaning & laundry', 'drywall installation & repair', 'dui law', 'ear nose & throat', 'education', 'educational services', 'electricians', 'electronics', 'electronics repair', 'embassy', 'embroidery & crochet', 'employment agencies', 'employment law', 'endocrinologists', 'endodontists', 'escape games', 'estate liquidation', 'ethiopian', 'ethnic food', 'ethnic grocery', 'event photography', 'event planning & services', 'eyebrow services', 'eyelash service', 'eyewear & opticians', 'fabric stores', 'face painting', 'family practice', 'farmers market', 'farming equipment', 'farms', 'fashion', 'fast food', 'fences & gates', 'festivals', 'financial advising', 'financial services', 'fish & chips', 'fitness & instruction', 'fitness/exercise equipment', 'float spa', 'flooring', 'floral designers', 'florists', 'flowers & gifts', 'food', 'food court', 'food delivery services', 'food stands', 'food trucks', 'formal wear', 'foundation repair', 'framing', 'french', 'fruits & veggies', 'funeral services & cemeteries', 'furniture reupholstery', 'furniture stores', 'garage door services', 'gardeners', 'gas stations', 'gastropubs', 'gay bars', 'gelato', 'general dentistry', 'general festivals', 'general litigation', 'generator installation/repair', 'german', 'gift shops', 'glass & mirrors', 'gluten-free', 'go karts', 'gold buyers', 'golf', 'golf lessons', 'graphic design', 'greek', 'grilling equipment', 'grocery', 'guitar stores', 'gun/rifle ranges', 'guns & ammo', 'gutter services', 'gymnastics', 'gyms', 'hair extensions', 'hair loss centers', 'hair removal', 'hair salons', 'hair stylists', 'halal', 'handyman', 'hardware stores', 'haunted houses', 'hawaiian', 'head shops', 'health & medical', 'health markets', 'hearing aid providers', 'heating & air conditioning/hvac', 'henna artists', 'hepatologists', 'herbs & spices', 'hiking', 'historical tours', 'hobby shops', 'holistic animal care', 'home & garden', 'home & rental insurance', 'home automation', 'home cleaning', 'home decor', 'home energy auditors', 'home inspectors', 'home network installation', 'home organization', 'home services', 'home theatre installation', 'home window tinting', 'hookah bars', 'horseback riding', 'hospitals', 'hot dogs', 'hot tub & pool', 'hotels', 'hotels & travel', 'house sitters', 'hunting & fishing supplies', 'ice cream & frozen yogurt', 'imported food', 'indian', 'insurance', 'interior design', 'internal medicine', 'internet service providers', 'interval training gyms', 'investing', 'irish pub', 'irrigation', 'it services & computer repair', 'italian', 'japanese', 'jazz & blues', 'jewelry', 'jewelry repair', 'juice bars & smoothies', 'junk removal & hauling', 'karaoke', 'keys & locksmiths', 'kids activities', 'kitchen & bath', 'knitting supplies', 'korean', 'laboratory testing', 'landmarks & historical buildings', 'landscape architects', 'landscaping', 'laser eye surgery/lasik', 'laser hair removal', 'laser tag', 'latin american', 'laundry services', 'lawyers', 'leather goods', 'lebanese', 'libraries', 'lice services', 'life coach', 'life insurance', 'lighting fixtures & equipment', 'limos', 'lingerie', 'live/raw food', 'local fish stores', 'local flavor', 'local services', 'lounges', 'makeup artists', 'marinas', 'marketing', 'martial arts', 'masonry/concrete', 'mass media', 'massage', 'massage schools', 'massage therapy', 'matchmakers', 'maternity wear', 'mattresses', 'meat shops', 'medical centers', 'medical spas', 'mediterranean', 'mens clothing', 'mens hair salons', 'mexican', 'middle eastern', 'middle schools & high schools', 'mini golf', 'mobile dent repair', 'mobile phone accessories', 'mobile phone repair', 'mobile phones', 'modern european', 'mongolian', 'mortgage brokers', 'motorcycle dealers', 'motorcycle gear', 'motorcycle repair', 'mountain biking', 'movers', 'museums', 'music venues', 'musical instrument services', 'musical instruments & teachers', 'na', 'nail salons', 'nail technicians', 'nanny services', 'naturopathic/holistic', 'neurologist', 'new mexican cuisine', 'newspapers & magazines', 'nightlife', 'noodles', 'notaries', 'nurseries & gardening', 'nutritionists', 'obstetricians & gynecologists', 'occupational therapy', 'office cleaning', 'office equipment', 'oil change stations', 'ophthalmologists', 'optometrists', 'oral surgeons', 'organic stores', 'orthodontists', 'orthopedists', 'osteopathic physicians', 'outdoor gear', 'outlet stores', 'packing services', 'pain management', 'paint & sip', 'paint stores', 'painters', 'pakistani', 'parking', 'parks', 'party & event planning', 'party bus rentals', 'party equipment rentals', 'party supplies', 'pediatric dentists', 'pediatricians', 'performing arts', 'periodontists', 'permanent makeup', 'personal assistants', 'personal injury law', 'personal shopping', 'peruvian', 'pest control', 'pet adoption', 'pet cremation services', 'pet groomers', 'pet services', 'pet sitting', 'pet stores', 'pet training', 'pet transportation', 'pets', 'photo booth rentals', 'photographers', 'photography classes', 'photography stores & services', 'physical therapy', 'piano services', 'pick your own farms', 'piercing', 'pilates', 'pizza', 'plastic surgeons', 'playgrounds', 'plumbing', 'plus size fashion', 'podiatrists', 'police departments', 'pool & hot tub service', 'pool halls', 'pop-up shops', 'popcorn shops', 'post offices', 'powder coating', 'prenatal/perinatal care', 'preschools', 'pressure washers', 'pretzels', 'print media', 'printing services', 'private jet charter', 'professional services', 'professional sports teams', 'property management', 'prosthetics', 'prosthodontists', 'psychiatrists', 'public markets', 'public relations', 'public services & government', 'public transportation', 'pubs', 'puerto rican', 'race tracks', 'races & competitions', 'radio stations', 'rafting/kayaking', 'ramen', 'real estate', 'real estate agents', 'real estate law', 'real estate services', 'recycling center', 'refinishing services', 'reflexology', 'registration services', 'rehabilitation center', 'religious items', 'religious organizations', 'rest stops', 'restaurants', 'retirement homes', 'roadside assistance', 'roof inspectors', 'roofing', 'rugs', 'rv rental', 'salad', 'salvadoran', 'sandwiches', 'screen printing/t-shirt printing', 'scuba diving', 'seafood', 'seafood markets', 'security systems', 'self storage', 'septic services', 'session photography', 'sewing & alterations', 'shared office spaces', 'shaved ice', 'shipping centers', 'shoe repair', 'shoe stores', 'shopping', 'shopping centers', 'shutters', 'siding', 'signmaking', 'skating rinks', 'skin care', 'sleep specialists', 'smog check stations', 'smokehouse', 'soul food', 'soup', 'southern', 'spanish', 'speakeasies', 'special education', 'specialty food', 'specialty schools', 'sporting goods', 'sports bars', 'sports clubs', 'sports medicine', 'sports wear', 'spray tanning', 'stadiums & arenas', 'steakhouses', 'street vendors', 'summer camps', 'surf shop', 'sushi bars', 'swimming lessons/schools', 'swimming pools', 'swimwear', 'szechuan', 'tacos', 'tai chi', 'taiwanese', 'tanning', 'tanning beds', 'tapas bars', 'tattoo', 'tattoo removal', 'tax services', 'taxis', 'telecommunications', 'television service providers', 'television stations', 'tennis', 'test preparation', 'tex-mex', 'thai', 'threading services', 'thrift stores', 'tickets', 'tiling', 'tires', 'tobacco shops', 'tours', 'towing', 'toy stores', 'traditional chinese medicine', 'trailer dealers', 'train stations', 'trainers', 'trampoline parks', 'transmission repair', 'transportation', 'travel services', 'tree services', 'trivia hosts', 'trophy shops', 'truck rental', 'tutoring centers', 'uniforms', 'university housing', 'urgent care', 'urologists', 'used', 'used car dealers', 'vacation rentals', 'valet services', 'vape shops', 'vegan', 'vegetarian', 'vehicle shipping', 'venues & event spaces', 'veterinarians', 'video game stores', 'video/film production', 'videographers', 'videos & video game rental', 'vietnamese', 'vinyl records', 'vitamins & supplements', 'vocational & technical school', 'waffles', 'watch repair', 'watches', 'water heater installation/repair', 'water purification services', 'waterproofing', 'waxing', 'web design', 'wedding planning', 'weight loss centers', 'well drilling', 'wheel & rim repair', 'wholesale stores', 'wildlife control', 'window washing', 'windows installation', 'windshield installation & repair', 'wine bars', 'wine tasting room', 'wine tours', 'wineries', 'womens clothing', 'wraps', 'yelp events', 'yoga']
$('#the-basics .typeahead').typeahead({
  hint: true,
  highlight: true,
  minLength: 1
}, {
  name: 'categories',
  source: substringMatcher(categories)
});


function addtoMap() {
  d3.csv("data/nc_data.csv", function(error, data) {
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
