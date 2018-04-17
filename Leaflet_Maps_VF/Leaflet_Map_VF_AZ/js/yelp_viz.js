var map = new L.Map("map", {
  zoomSnap: 0.25,
  center: [33.5, -112],
  zoom: 9.75
})

foo_list = [];
var layer = new L.StamenTileLayer("terrain");
map.addLayer(layer);

L.AwesomeMarkers.Icon.prototype.options.prefix = 'ion';


function recommender(category) {
  category==$('input.typeahead.tt-input').val();
  $.getJSON("/data/az_grid_boxes_category_counts.json", function(boxdata){
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
var categories = ['3d printing', 'atv rentals/tours', 'acai bowls', 'accessories', 'accountants', 'active life', 'acupuncture', 'addiction medicine', 'adult', 'adult education', 'adult entertainment', 'advertising', 'aerial tours', 'afghan', 'african', 'air duct cleaning', 'airlines', 'airport lounges', 'airport shuttles', 'airport terminals', 'airports', 'airsoft', 'allergists', 'alternative medicine', 'amateur sports teams', 'american (new)', 'american (traditional)', 'amusement parks', 'anesthesiologists', 'animal shelters', 'antiques', 'apartments', 'appliances', 'appliances & repair', 'appraisal services', 'aquarium services', 'aquariums', 'arcades', 'archery', 'architects', 'argentine', 'art classes', 'art galleries', 'art museums', 'art restoration', 'art schools', 'art supplies', 'artificial turf', 'arts & crafts', 'arts & entertainment', 'asian fusion', 'assisted living facilities', 'auction houses', 'audiologist', 'auto customization', 'auto detailing', 'auto glass services', 'auto insurance', 'auto loan providers', 'auto parts & supplies', 'auto repair', 'auto security', 'auto upholstery', 'automotive', 'awnings', 'ayurveda', 'baby gear & furniture', 'bagels', 'bail bondsmen', 'bakeries', 'balloon services', 'bankruptcy law', 'banks & credit unions', 'barbeque', 'barbers', 'barre classes', 'bars', 'bartenders', 'bartending schools', 'baseball fields', 'basketball courts', 'battery stores', 'batting cages', 'beauty & spas', 'bed & breakfast', 'beer', 'beer bar', 'beer gardens', 'beer tours', 'belgian', 'bespoke clothing', 'beverage store', 'bike rentals', 'bike repair/maintenance', 'bike sharing', 'bikes', 'bingo halls', 'blood & plasma donation centers', 'blow dry/out services', 'boat charters', 'boat dealers', 'boat repair', 'boating', 'body shops', 'bookbinding', 'bookkeepers', 'books', 'bookstores', 'boot camps', 'botanical gardens', 'boudoir photography', 'bounce house rentals', 'bowling', 'boxing', 'brazilian', 'brazilian jiu-jitsu', 'breakfast & brunch', 'breweries', 'brewing supplies', 'brewpubs', 'bridal', 'british', 'bubble tea', 'buddhist temples', 'buffets', 'building supplies', 'burgers', 'bus tours', 'buses', 'business consulting', 'business financing', 'business law', 'butcher', 'cpr classes', 'csa', 'cabaret', 'cabinetry', 'cafes', 'cafeteria', 'cajun/creole', 'campgrounds', 'candle stores', 'candy stores', 'cannabis clinics', 'cannabis dispensaries', 'cantonese', 'car auctions', 'car brokers', 'car buyers', 'car dealers', 'car inspectors', 'car rental', 'car stereo installation', 'car wash', 'car window tinting', 'cardio classes', 'cardiologists', 'cards & stationery', 'career counseling', 'caribbean', 'caricatures', 'carpenters', 'carpet cleaning', 'carpet dyeing', 'carpet installation', 'carpeting', 'casinos', 'caterers', 'challenge courses', 'champagne bars', 'check cashing/pay-day loans', 'cheese shops', 'cheesesteaks', 'chicken shop', 'chicken wings', 'child care & day care', 'childproofing', 'childrens clothing', 'chimney sweeps', 'chinese', 'chiropractors', 'chocolatiers & shops', 'christmas trees', 'churches', 'cideries', 'cinema', 'circuit training gyms', 'civic center', 'climbing', 'clowns', 'cocktail bars', 'coffee & tea', 'coffee & tea supplies', 'coffee roasteries', 'coffeeshops', 'colleges & universities', 'colonics', 'comedy clubs', 'comfort food', 'comic books', 'commercial real estate', 'commercial truck dealers', 'commercial truck repair', 'commissioned artists', 'community centers', 'community service/non-profit', 'computers', 'concept shops', 'concierge medicine', 'condominiums', 'contract law', 'contractors', 'convenience stores', 'cooking classes', 'cooking schools', 'cosmetic dentists', 'cosmetic surgeons', 'cosmetics & beauty supply', 'cosmetology schools', 'costumes', 'counseling & mental health', 'countertop installation', 'country clubs', 'country dance halls', 'couriers & delivery services', 'courthouses', 'cremation services', 'creperies', 'criminal defense law', 'cryotherapy', 'cuban', 'cultural center', 'cupcakes', 'custom cakes', 'customized merchandise', 'cycling classes', 'djs', 'dui law', 'damage restoration', 'dance clubs', 'dance schools', 'dance studios', 'data recovery', 'day camps', 'day spas', 'debt relief services', 'decks & railing', 'delis', 'demolition services', 'dental hygienists', 'dentists', 'department stores', 'departments of motor vehicles', 'dermatologists', 'desserts', 'diagnostic imaging', 'diagnostic services', 'dialysis clinics', 'dietitians', 'dim sum', 'diners', 'dinner theater', 'disc golf', 'discount store', 'dive bars', 'diving', 'divorce & family law', 'do-it-yourself food', 'doctors', 'dog parks', 'dog walkers', 'dominican', 'donuts', 'door sales/installation', 'doulas', 'drive-in theater', 'driving schools', 'drugstores', 'dry cleaning', 'dry cleaning & laundry', 'drywall installation & repair', 'ear nose & throat', 'editorial services', 'education', 'educational services', 'electricians', 'electronics', 'electronics repair', 'elementary schools', 'embroidery & crochet', 'emergency pet hospital', 'emergency rooms', 'empanadas', 'employment agencies', 'employment law', 'endocrinologists', 'endodontists', 'engraving', 'environmental abatement', 'escape games', 'estate liquidation', 'estate planning law', 'ethiopian', 'ethnic food', 'event photography', 'event planning & services', 'excavation services', 'eyebrow services', 'eyelash service', 'eyewear & opticians', 'fabric stores', 'face painting', 'falafel', 'family practice', 'farm equipment repair', 'farmers market', 'farming equipment', 'farms', 'fashion', 'fast food', 'fences & gates', 'fertility', 'festivals', 'filipino', 'financial advising', 'financial services', 'fingerprinting', 'fire departments', 'fire protection services', 'firearm training', 'fireplace services', 'firewood', 'first aid classes', 'fish & chips', 'fishing', 'fitness & instruction', 'fitness/exercise equipment', 'flea markets', 'flight instruction', 'float spa', 'flooring', 'floral designers', 'florists', 'flowers', 'flowers & gifts', 'fondue', 'food', 'food court', 'food delivery services', 'food stands', 'food tours', 'food trucks', 'formal wear', 'foundation repair', 'framing', 'french', 'fruits & veggies', 'funeral services & cemeteries', 'furniture assembly', 'furniture rental', 'furniture repair', 'furniture reupholstery', 'furniture stores', 'garage door services', 'gardeners', 'gas stations', 'gastroenterologist', 'gastropubs', 'gay bars', 'gelato', 'general dentistry', 'general litigation', 'generator installation/repair', 'german', 'gerontologists', 'gift shops', 'glass & mirrors', 'gluten-free', 'go karts', 'gold buyers', 'golf', 'golf cart dealers', 'golf equipment', 'golf lessons', 'graphic design', 'greek', 'grilling equipment', 'grocery', 'grout services', 'guitar stores', 'gun/rifle ranges', 'guns & ammo', 'gunsmith', 'gutter services', 'gymnastics', 'gyms', 'hair extensions', 'hair loss centers', 'hair removal', 'hair salons', 'hair stylists', 'halal', 'handyman', 'hardware stores', 'hats', 'haunted houses', 'hawaiian', 'head shops', 'health & medical', 'health coach', 'health insurance offices', 'health markets', 'health retreats', 'hearing aid providers', 'heating & air conditioning/hvac', 'hepatologists', 'herbal shops', 'herbs & spices', 'high fidelity audio equipment', 'hiking', 'hindu temples', 'hobby shops', 'holiday decorating services', 'holiday decorations', 'home & garden', 'home & rental insurance', 'home automation', 'home cleaning', 'home decor', 'home energy auditors', 'home health care', 'home inspectors', 'home network installation', 'home organization', 'home services', 'home staging', 'home theatre installation', 'home window tinting', 'homeless shelters', 'homeowner association', 'hookah bars', 'horse boarding', 'horse equipment shops', 'horse racing', 'horseback riding', 'hospice', 'hospitals', 'hot air balloons', 'hot dogs', 'hot pot', 'hot tub & pool', 'hotels', 'hotels & travel', 'hunting & fishing supplies', 'hydro-jetting', 'hydroponics', 'hypnosis/hypnotherapy', 'it services & computer repair', 'iv hydration', 'ice cream & frozen yogurt', 'immigration law', 'imported food', 'indian', 'insulation installation', 'insurance', 'interior design', 'internal medicine', 'international grocery', 'internet cafes', 'internet service providers', 'interval training gyms', 'investing', 'irish', 'irish pub', 'irrigation', 'italian', 'izakaya', 'japanese', 'jazz & blues', 'jet skis', 'jewelry', 'jewelry repair', 'juice bars & smoothies', 'junk removal & hauling', 'junkyards', 'karaoke', 'karate', 'keys & locksmiths', 'kickboxing', 'kids activities', 'kitchen & bath', 'knife sharpening', 'knitting supplies', 'korean', 'kosher', 'laboratory testing', 'lactation services', 'lakes', 'landmarks & historical buildings', 'landscape architects', 'landscaping', 'language schools', 'laotian', 'laser eye surgery/lasik', 'laser hair removal', 'laser tag', 'latin american', 'laundromat', 'laundry services', 'lawn services', 'lawyers', 'leather goods', 'legal services', 'leisure centers', 'libraries', 'lice services', 'life coach', 'life insurance', 'lighting fixtures & equipment', 'limos', 'lingerie', 'live/raw food', 'livestock feed & supply', 'local fish stores', 'local flavor', 'local services', 'lounges', 'luggage', 'macarons', 'machine shops', 'magicians', 'mailbox centers', 'makeup artists', 'marinas', 'marketing', 'martial arts', 'masonry/concrete', 'mass media', 'massage', 'massage therapy', 'matchmakers', 'maternity wear', 'mattresses', 'meat shops', 'mediators', 'medical centers', 'medical law', 'medical spas', 'medical supplies', 'medical transportation', 'meditation centers', 'mediterranean', 'mens clothing', 'mens hair salons', 'metal fabricators', 'mexican', 'middle eastern', 'middle schools & high schools', 'midwives', 'mini golf', 'misting system services', 'mobile dent repair', 'mobile home parks', 'mobile phone accessories', 'mobile phone repair', 'mobile phones', 'modern european', 'mongolian', 'montessori schools', 'moroccan', 'mortgage brokers', 'mortgage lenders', 'mortuary services', 'motorcycle dealers', 'motorcycle gear', 'motorcycle rental', 'motorcycle repair', 'motorsport vehicle dealers', 'motorsport vehicle repairs', 'mountain biking', 'movers', 'muay thai', 'museums', 'music & dvds', 'music venues', 'musical instrument services', 'musical instruments & teachers', 'musicians', 'na', 'nail salons', 'nail technicians', 'nanny services', 'naturopathic/holistic', 'neurologist', 'neurotologists', 'new mexican cuisine', 'newspapers & magazines', 'nightlife', 'noodles', 'notaries', 'nurseries & gardening', 'nursing schools', 'nutritionists', 'obstetricians & gynecologists', 'occupational therapy', 'office cleaning', 'office equipment', 'officiants', 'oil change stations', 'olive oil', 'oncologist', 'opera & ballet', 'ophthalmologists', 'optometrists', 'oral surgeons', 'organic stores', 'orthodontists', 'orthopedists', 'orthotics', 'osteopathic physicians', 'osteopaths', 'outdoor furniture stores', 'outdoor gear', 'outlet stores', 'oxygen bars', 'packing services', 'packing supplies', 'paddleboarding', 'pain management', 'paint & sip', 'paint stores', 'paint-your-own pottery', 'paintball', 'painters', 'pakistani', 'parking', 'parks', 'party & event planning', 'party bus rentals', 'party characters', 'party equipment rentals', 'party supplies', 'patio coverings', 'patisserie/cake shop', 'pawn shops', 'payroll services', 'pediatric dentists', 'pediatricians', 'performing arts', 'periodontists', 'permanent makeup', 'persian/iranian', 'personal assistants', 'personal care services', 'personal chefs', 'personal injury law', 'personal shopping', 'peruvian', 'pest control', 'pet adoption', 'pet boarding', 'pet breeders', 'pet cremation services', 'pet groomers', 'pet hospice', 'pet photography', 'pet services', 'pet sitting', 'pet stores', 'pet training', 'pet transportation', 'pets', 'petting zoos', 'pharmacy', 'photo booth rentals', 'photographers', 'photography stores & services', 'physical therapy', 'piano bars', 'piano services', 'piano stores', 'pick your own farms', 'piercing', 'pilates', 'pita', 'pizza', 'planetarium', 'plastic surgeons', 'playgrounds', 'plumbing', 'plus size fashion', 'podiatrists', 'poke', 'pole dancing classes', 'police departments', 'polish', 'pool & billiards', 'pool & hot tub service', 'pool cleaners', 'pool halls', 'popcorn shops', 'post offices', 'poutineries', 'powder coating', 'prenatal/perinatal care', 'preschools', 'pressure washers', 'pretzels', 'print media', 'printing services', 'private investigation', 'private tutors', 'professional services', 'professional sports teams', 'propane', 'property management', 'prosthetics', 'prosthodontists', 'psychiatrists', 'psychic mediums', 'psychics', 'psychologists', 'public adjusters', 'public relations', 'public services & government', 'public transportation', 'pubs', 'pulmonologist', 'qi gong', 'rv dealers', 'rv parks', 'rv rental', 'rv repair', 'races & competitions', 'radio stations', 'radiologists', 'rafting/kayaking', 'ramen', 'real estate', 'real estate agents', 'real estate law', 'real estate photography', 'real estate services', 'recording & rehearsal studios', 'recreation centers', 'recycling center', 'refinishing services', 'reflexology', 'registration services', 'rehabilitation center', 'reiki', 'religious organizations', 'religious schools', 'resorts', 'restaurant supplies', 'restaurants', 'retina specialists', 'retirement homes', 'rheumatologists', 'roadside assistance', 'roof inspectors', 'roofing', 'rugs', 'safe stores', 'salad', 'salvadoran', 'sandwiches', 'saunas', 'screen printing', 'screen printing/t-shirt printing', 'scuba diving', 'seafood', 'seafood markets', 'security services', 'security systems', 'self storage', 'self-defense classes', 'septic services', 'session photography', 'sewing & alterations', 'sex therapists', 'shades & blinds', 'shared office spaces', 'shaved ice', 'shipping centers', 'shoe repair', 'shoe shine', 'shoe stores', 'shopping', 'shopping centers', 'shredding services', 'shutters', 'signmaking', 'skate parks', 'skate shops', 'skating rinks', 'skilled nursing', 'skin care', 'sleep specialists', 'smog check stations', 'soccer', 'social clubs', 'software development', 'solar installation', 'solar panel cleaning', 'soul food', 'soup', 'southern', 'spanish', 'special education', 'specialty food', 'specialty schools', 'speech therapists', 'spin classes', 'spine surgeons', 'spiritual shop', 'sporting goods', 'sports bars', 'sports clubs', 'sports medicine', 'sports wear', 'spray tanning', 'stadiums & arenas', 'steakhouses', 'street vendors', 'stucco services', 'sugaring', 'summer camps', 'supernatural readings', 'surgeons', 'sushi bars', 'swimming lessons/schools', 'swimming pools', 'swimwear', 'synagogues', 'szechuan', 'tv mounting', 'tabletop games', 'tacos', 'taekwondo', 'tai chi', 'taiwanese', 'talent agencies', 'tanning', 'tanning beds', 'tapas/small plates', 'tattoo', 'tattoo removal', 'tax services', 'taxidermy', 'taxis', 'tea rooms', 'team building activities', 'teeth whitening', 'telecommunications', 'television service providers', 'television stations', 'tennis', 'teppanyaki', 'test preparation', 'tex-mex', 'thai', 'threading services', 'thrift stores', 'ticket sales', 'tiling', 'tires', 'title loans', 'tobacco shops', 'tours', 'towing', 'town car service', 'toy stores', 'traditional chinese medicine', 'traffic schools', 'trailer rental', 'trailer repair', 'train stations', 'trainers', 'trampoline parks', 'translation services', 'transmission repair', 'transportation', 'travel agents', 'travel services', 'tree services', 'trinidadian', 'trivia hosts', 'trophy shops', 'truck rental', 'tutoring centers', 'undersea/hyperbaric medicine', 'uniforms', 'university housing', 'urgent care', 'urologists', 'used', 'used bookstore', 'used car dealers', 'utilities', 'vacation rental agents', 'vacation rentals', 'valet services', 'vape shops', 'vascular medicine', 'vegan', 'vegetarian', 'vehicle shipping', 'vehicle wraps', 'venues & event spaces', 'veterinarians', 'video game stores', 'video/film production', 'videographers', 'videos & video game rental', 'vietnamese', 'vinyl records', 'vitamins & supplements', 'vocational & technical school', 'waffles', 'waldorf schools', 'walk-in clinics', 'wallpapering', 'watch repair', 'watches', 'water delivery', 'water heater installation/repair', 'water purification services', 'water stores', 'waterproofing', 'waxing', 'web design', 'wedding chapels', 'wedding planning', 'weight loss centers', 'wheel & rim repair', 'whiskey bars', 'wholesale stores', 'wholesalers', 'wigs', 'wildlife control', 'wills', 'window washing', 'windows installation', 'windshield installation & repair', 'wine bars', 'wine tours', 'wineries', 'womens clothing', 'workers compensation law', 'wraps', 'yelp events', 'yoga', 'zoos'];

$('#the-basics .typeahead').typeahead({
  hint: true,
  highlight: true,
  minLength: 1
}, {
  name: 'categories',
  source: substringMatcher(categories)
});


function addtoMap() {
  d3.csv("data/az_data.csv", function(error, data) {
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
