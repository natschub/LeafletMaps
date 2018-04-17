var map = new L.Map("map", {
  zoomSnap: 0.25,
  center: [36.17, -115.14],
  zoom: 11
})

foo_list = [];
var layer = new L.StamenTileLayer("terrain");
map.addLayer(layer);

L.AwesomeMarkers.Icon.prototype.options.prefix = 'ion';


function recommender(category) {
  category==$('input.typeahead.tt-input').val();
  $.getJSON("/data/nv_grid_boxes_category_counts.json", function(boxdata){
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

var categories= ['3d printing', 'acai bowls', 'accessories', 'accountants', 'active life', 'acupuncture', 'addiction medicine', 'adult', 'adult education', 'adult entertainment', 'advertising', 'aerial fitness', 'aerial tours', 'african', 'air duct cleaning', 'airlines', 'airport lounges', 'airport shuttles', 'airport terminals', 'airports', 'allergists', 'amateur sports teams', 'american (new)', 'american (traditional)', 'amusement parks', 'anesthesiologists', 'animal physical therapy', 'animal shelters', 'antiques', 'apartments', 'appliances', 'appliances & repair', 'appraisal services', 'aquarium services', 'aquariums', 'arabian', 'arcades', 'argentine', 'art classes', 'art galleries', 'art restoration', 'art schools', 'art supplies', 'artificial turf', 'arts & crafts', 'arts & entertainment', 'asian fusion', 'assisted living facilities', 'atv rentals/tours', 'auction houses', 'audiologist', 'auto customization', 'auto detailing', 'auto glass services', 'auto insurance', 'auto loan providers', 'auto parts & supplies', 'auto repair', 'auto security', 'auto upholstery', 'automotive', 'awnings', 'baby gear & furniture', 'bagels', 'bail bondsmen', 'bakeries', 'balloon services', 'bankruptcy law', 'banks & credit unions', 'barbeque', 'barbers', 'barre classes', 'bars', 'bartenders', 'bartending schools', 'baseball fields', 'basketball courts', 'battery stores', 'batting cages', 'beaches', 'beauty & spas', 'beer', 'beer bar', 'behavior analysts', 'bespoke clothing', 'beverage store', 'bike rentals', 'bike repair/maintenance', 'bikes', 'bingo halls', 'bird shops', 'blood & plasma donation centers', 'blow dry/out services', 'boat charters', 'boat dealers', 'boat repair', 'boating', 'body shops', 'bookkeepers', 'books', 'bookstores', 'boot camps', 'botanical gardens', 'boudoir photography', 'bowling', 'boxing', 'brasseries', 'brazilian jiu-jitsu', 'breakfast & brunch', 'breweries', 'bridal', 'bubble tea', 'buddhist temples', 'buffets', 'building supplies', 'burgers', 'bus tours', 'buses', 'business consulting', 'business financing', 'business law', 'butcher', 'cabaret', 'cabinetry', 'cafes', 'cafeteria', 'cajun/creole', 'campgrounds', 'candy stores', 'cannabis clinics', 'cannabis dispensaries', 'cantonese', 'car auctions', 'car buyers', 'car dealers', 'car rental', 'car stereo installation', 'car wash', 'car window tinting', 'cardio classes', 'cardiologists', 'cards & stationery', 'career counseling', 'caribbean', 'caricatures', 'carpenters', 'carpet cleaning', 'carpet installation', 'carpeting', 'casinos', 'caterers', 'check cashing/pay-day loans', 'cheesesteaks', 'chicken shop', 'chicken wings', 'child care & day care', 'childproofing', 'childrens clothing', 'chimney sweeps', 'chinese', 'chinese martial arts', 'chiropractors', 'chocolatiers & shops', 'christmas trees', 'churches', 'cinema', 'circuit training gyms', 'climbing', 'clothing rental', 'clowns', 'club crawl', 'cocktail bars', 'coffee & tea', 'coffee roasteries', 'coffeeshops', 'college counseling', 'colleges & universities', 'colonics', 'comedy clubs', 'comfort food', 'comic books', 'commercial real estate', 'commercial truck dealers', 'commercial truck repair', 'community centers', 'community service/non-profit', 'computers', 'concierge medicine', 'condominiums', 'contractors', 'convenience stores', 'cooking classes', 'cosmetic dentists', 'cosmetic surgeons', 'cosmetics & beauty supply', 'costumes', 'counseling & mental health', 'countertop installation', 'couriers & delivery services', 'courthouses', 'cpr classes', 'crane services', 'cremation services', 'creperies', 'criminal defense law', 'cryotherapy', 'csa', 'cuban', 'cultural center', 'cupcakes', 'currency exchange', 'custom cakes', 'customized merchandise', 'cycling classes', 'damage restoration', 'dance clubs', 'dance schools', 'dance studios', 'dance wear', 'data recovery', 'day camps', 'day spas', 'debt relief services', 'decks & railing', 'delis', 'demolition services', 'dental hygienists', 'dentists', 'department stores', 'departments of motor vehicles', 'dermatologists', 'desserts', 'diagnostic imaging', 'diagnostic services', 'digitizing services', 'dim sum', 'diners', 'disc golf', 'discount store', 'distilleries', 'dive bars', 'diving', 'divorce & family law', 'diy auto shop', 'djs', 'do-it-yourself food', 'doctors', 'dog parks', 'dog walkers', 'donation center', 'donuts', 'door sales/installation', 'doulas', 'driving schools', 'drugstores', 'dry cleaning', 'dry cleaning & laundry', 'drywall installation & repair', 'dui law', 'ear nose & throat', 'education', 'educational services', 'electricians', 'electronics', 'electronics repair', 'elementary schools', 'embroidery & crochet', 'emergency pet hospital', 'emergency rooms', 'employment agencies', 'employment law', 'endocrinologists', 'endodontists', 'environmental testing', 'escape games', 'estate liquidation', 'estate planning law', 'ethiopian', 'ethnic food', 'ev charging stations', 'event photography', 'event planning & services', 'eyebrow services', 'eyelash service', 'eyewear & opticians', 'fabric stores', 'face painting', 'falafel', 'family practice', 'farmers market', 'fashion', 'fast food', 'fences & gates', 'fencing clubs', 'fertility', 'festivals', 'filipino', 'financial advising', 'financial services', 'fingerprinting', 'fire departments', 'fire protection services', 'firearm training', 'fireplace services', 'firewood', 'fireworks', 'first aid classes', 'fish & chips', 'fitness & instruction', 'fitness/exercise equipment', 'flea markets', 'flight instruction', 'float spa', 'flooring', 'floral designers', 'florists', 'flowers & gifts', 'fondue', 'food', 'food court', 'food delivery services', 'food stands', 'food tours', 'food trucks', 'formal wear', 'framing', 'french', 'fruits & veggies', 'funeral services & cemeteries', 'furniture assembly', 'furniture rental', 'furniture repair', 'furniture reupholstery', 'furniture stores', 'garage door services', 'gardeners', 'gas stations', 'gastroenterologist', 'gastropubs', 'gay bars', 'gelato', 'general dentistry', 'general litigation', 'german', 'gerontologists', 'gift shops', 'glass & mirrors', 'glass blowing', 'gluten-free', 'go karts', 'gold buyers', 'golf', 'golf equipment shops', 'graphic design', 'greek', 'grilling equipment', 'grocery', 'grout services', 'guest houses', 'guitar stores', 'gun/rifle ranges', 'guns & ammo', 'gutter services', 'gymnastics', 'gyms', 'hair extensions', 'hair loss centers', 'hair removal', 'hair salons', 'hair stylists', 'halal', 'halotherapy', 'handyman', 'hardware stores', 'hats', 'haunted houses', 'hawaiian', 'hazardous waste disposal', 'head shops', 'health & medical', 'health insurance offices', 'health markets', 'hearing aid providers', 'heating & air conditioning/hvac', 'henna artists', 'herbs & spices', 'high fidelity audio equipment', 'hiking', 'hindu temples', 'historical tours', 'hobby shops', 'holistic animal care', 'home & garden', 'home & rental insurance', 'home automation', 'home cleaning', 'home decor', 'home developers', 'home energy auditors', 'home health care', 'home inspectors', 'home network installation', 'home organization', 'home services', 'home staging', 'home theatre installation', 'home window tinting', 'homeowner association', 'honduran', 'honey', 'hookah bars', 'horse boarding', 'horse equipment shops', 'horseback riding', 'hospice', 'hospitals', 'hostels', 'hot air balloons', 'hot dogs', 'hot pot', 'hot tub & pool', 'hotels', 'hotels & travel', 'hydro-jetting', 'hydroponics', 'hydrotherapy', 'hypnosis/hypnotherapy', 'ice cream & frozen yogurt', 'ice delivery', 'immigration law', 'immunodermatologists', 'imported food', 'indian', 'infectious disease specialists', 'installment loans', 'insurance', 'interior design', 'internal medicine', 'international grocery', 'internet cafes', 'internet service providers', 'interval training gyms', 'investing', 'irish', 'irish pub', 'irrigation', 'it services & computer repair', 'italian', 'iv hydration', 'japanese', 'japanese curry', 'jazz & blues', 'jet skis', 'jewelry', 'jewelry repair', 'juice bars & smoothies', 'junk removal & hauling', 'junkyards', 'karaoke', 'karate', 'keys & locksmiths', 'kickboxing', 'kids activities', 'kitchen & bath', 'knife sharpening', 'knitting supplies', 'korean', 'kosher', 'laboratory testing', 'lactation services', 'lakes', 'lan centers', 'landmarks & historical buildings', 'landscape architects', 'landscaping', 'language schools', 'laser eye surgery/lasik', 'laser hair removal', 'latin american', 'laundromat', 'laundry services', 'lawyers', 'leather goods', 'lebanese', 'legal services', 'leisure centers', 'libraries', 'life coach', 'life insurance', 'lighting fixtures & equipment', 'limos', 'lingerie', 'live/raw food', 'local fish stores', 'local flavor', 'local services', 'lounges', 'luggage', 'machine shops', 'magicians', 'makeup artists', 'malaysian', 'marketing', 'martial arts', 'masonry/concrete', 'mass media', 'massage', 'massage schools', 'massage therapy', 'matchmakers', 'maternity wear', 'mattresses', 'meat shops', 'mediators', 'medical cannabis referrals', 'medical centers', 'medical spas', 'medical supplies', 'medical transportation', 'meditation centers', 'mediterranean', 'mens clothing', 'mens hair salons', 'metal fabricators', 'mexican', 'middle eastern', 'middle schools & high schools', 'midwives', 'military surplus', 'mini golf', 'misting system services', 'mobile dent repair', 'mobile home parks', 'mobile phone accessories', 'mobile phone repair', 'mobile phones', 'mobility equipment sales & services', 'mongolian', 'montessori schools', 'moroccan', 'mortgage brokers', 'mortgage lenders', 'mortuary services', 'motorcycle dealers', 'motorcycle gear', 'motorcycle rental', 'motorcycle repair', 'mountain biking', 'movers', 'muay thai', 'museums', 'music & dvds', 'music production services', 'music venues', 'musical instrument services', 'musical instruments & teachers', 'musicians', 'na', 'nail salons', 'nail technicians', 'nanny services', 'naturopathic/holistic', 'neurologist', 'new mexican cuisine', 'nightlife', 'noodles', 'notaries', 'nurse practitioner', 'nurseries & gardening', 'nutritionists', 'obstetricians & gynecologists', 'occupational therapy', 'office cleaning', 'office equipment', 'officiants', 'oil change stations', 'olive oil', 'oncologist', 'ophthalmologists', 'optometrists', 'oral surgeons', 'organic stores', 'orthodontists', 'orthopedists', 'orthotics', 'osteopathic physicians', 'outdoor furniture stores', 'outdoor gear', 'outlet stores', 'packing services', 'packing supplies', 'pain management', 'paint & sip', 'paint stores', 'paint-your-own pottery', 'paintball', 'painters', 'pakistani', 'pan asian', 'parking', 'parks', 'party & event planning', 'party bus rentals', 'party characters', 'party equipment rentals', 'party supplies', 'passport & visa services', 'pasta shops', 'pathologists', 'patio coverings', 'patisserie/cake shop', 'pawn shops', 'payroll services', 'pediatric dentists', 'pediatricians', 'performing arts', 'periodontists', 'permanent makeup', 'persian/iranian', 'personal assistants', 'personal care services', 'personal chefs', 'personal injury law', 'personal shopping', 'peruvian', 'pest control', 'pet adoption', 'pet boarding', 'pet breeders', 'pet groomers', 'pet hospice', 'pet photography', 'pet services', 'pet sitting', 'pet stores', 'pet training', 'pet transportation', 'pets', 'pharmacy', 'photo booth rentals', 'photographers', 'photography stores & services', 'physical therapy', 'piano bars', 'piano services', 'piano stores', 'piercing', 'pilates', 'pizza', 'plastic surgeons', 'playgrounds', 'plumbing', 'plus size fashion', 'podiatrists', 'poke', 'police departments', 'pool & billiards', 'pool & hot tub service', 'pool cleaners', 'pool halls', 'pop-up shops', 'popcorn shops', 'post offices', 'preschools', 'pressure washers', 'pretzels', 'print media', 'printing services', 'private investigation', 'private tutors', 'product design', 'professional services', 'professional sports teams', 'propane', 'property management', 'prosthetics', 'prosthodontists', 'psychiatrists', 'psychic mediums', 'psychics', 'psychologists', 'public art', 'public relations', 'public services & government', 'public transportation', 'pubs', 'race tracks', 'races & competitions', 'racing experience', 'radio stations', 'radiologists', 'rafting/kayaking', 'ramen', 'real estate', 'real estate agents', 'real estate law', 'real estate services', 'recording & rehearsal studios', 'recreation centers', 'recycling center', 'refinishing services', 'reflexology', 'registration services', 'rehabilitation center', 'reiki', 'religious items', 'religious organizations', 'religious schools', 'reptile shops', 'resorts', 'restaurant supplies', 'restaurants', 'retina specialists', 'retirement homes', 'roadside assistance', 'rock climbing', 'roofing', 'rugs', 'rv dealers', 'rv parks', 'rv rental', 'rv repair', 'safe stores', 'sailing', 'salad', 'salvadoran', 'sandwiches', 'saunas', 'scandinavian', 'scavenger hunts', 'scooter tours', 'screen printing', 'screen printing/t-shirt printing', 'scuba diving', 'seafood', 'seafood markets', 'security services', 'security systems', 'self storage', 'self-defense classes', 'septic services', 'session photography', 'sewing & alterations', 'sex therapists', 'shades & blinds', 'shared office spaces', 'shaved ice', 'shaved snow', 'shipping centers', 'shoe repair', 'shoe shine', 'shoe stores', 'shopping', 'shopping centers', 'shredding services', 'shutters', 'siding', 'signmaking', 'skate parks', 'skate shops', 'skating rinks', 'skilled nursing', 'skin care', 'sleep specialists', 'smog check stations', 'smokehouse', 'soccer', 'social clubs', 'social security law', 'software development', 'solar installation', 'soul food', 'soup', 'south african', 'southern', 'souvenir shops', 'spanish', 'speakeasies', 'special education', 'specialty food', 'specialty schools', 'speech therapists', 'spine surgeons', 'sporting goods', 'sports bars', 'sports clubs', 'sports medicine', 'sports wear', 'spray tanning', 'stadiums & arenas', 'steakhouses', 'street vendors', 'striptease dancers', 'stucco services', 'sugaring', 'summer camps', 'supernatural readings', 'surgeons', 'sushi bars', 'swimming lessons/schools', 'swimming pools', 'swimwear', 'synagogues', 'szechuan', 'tabletop games', 'tacos', 'taekwondo', 'taiwanese', 'talent agencies', 'tanning', 'tanning beds', 'tapas bars', 'tapas/small plates', 'tasting classes', 'tattoo', 'tattoo removal', 'tax law', 'tax services', 'taxis', 'tea rooms', 'team building activities', 'teeth whitening', 'telecommunications', 'television service providers', 'television stations', 'tenant and eviction law', 'tennis', 'teppanyaki', 'test preparation', 'tex-mex', 'thai', 'threading services', 'thrift stores', 'ticket sales', 'tiki bars', 'tiling', 'tires', 'title loans', 'tobacco shops', 'tours', 'towing', 'toy stores', 'traditional chinese medicine', 'trailer rental', 'trailer repair', 'trainers', 'trampoline parks', 'transmission repair', 'transportation', 'travel agents', 'travel services', 'tree services', 'trophy shops', 'truck rental', 'turkish', 'tutoring centers', 'uniforms', 'unofficial yelp events', 'urgent care', 'urologists', 'used', 'used car dealers', 'utilities', 'vacation rental agents', 'vacation rentals', 'vape shops', 'vascular medicine', 'vegan', 'vegetarian', 'vehicle shipping', 'vehicle wraps', 'venezuelan', 'venues & event spaces', 'veterinarians', 'video game stores', 'video/film production', 'videographers', 'videos & video game rental', 'vietnamese', 'vinyl records', 'visitor centers', 'vitamins & supplements', 'vocational & technical school', 'waffles', 'walk-in clinics', 'walking tours', 'watch repair', 'watches', 'water delivery', 'water heater installation/repair', 'water parks', 'water purification services', 'water stores', 'waterproofing', 'waxing', 'web design', 'wedding chapels', 'wedding planning', 'weight loss centers', 'wheel & rim repair', 'wholesale stores', 'wholesalers', 'wigs', 'wildlife control', 'wills', 'window washing', 'windows installation', 'windshield installation & repair', 'wine bars', 'wineries', 'womens clothing', 'workers compensation law', 'wraps', 'yelp events', 'yoga', 'ziplining']

$('#the-basics .typeahead').typeahead({
  hint: true,
  highlight: true,
  minLength: 1
}, {
  name: 'categories',
  source: substringMatcher(categories)
});


function addtoMap() {
  d3.csv("data/nv_data.csv", function(error, data) {
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