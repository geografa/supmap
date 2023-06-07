var config = {
    style: 'mapbox://styles/grafa/ckdhx8rpo01b61ip8o9e8fth3',
    accessToken: 'pk.eyJ1IjoiZ3JhZmEiLCJhIjoiY2tkb3ZoNzZrMDZyMzMxbGo0YTF3ZHk2ZyJ9.u6m6_Sxxu5ITBuomsTyA3g',
    showMarkers: true,
    chapterTheme: 'light',
    headerTheme: 'hero',
    alignment: 'left',
    logo: '../assets/img/logo.png',
    title: 'Best SUP Spots',
    title2: 'of the Pacific NW',
    subtitle: 'Your guide to the great paddle places of Oregon and Southwest WA <br /><button><a href="#id-start">LET\'S GO!</a></button>',
    byline: 'by Rafa Gutierrez',
    footer: 'Source: Rafa Gutierrez, Portland OR. Opinions my own. Always wear a PFD, leash, and something fabulous. Like the content? <a href="https://www.buymeacoffee.com/supr">You can buy me a bevie ☕️ 🍺</a>. Copyright © 2023.',
    chapters: [
        {
            id: 'id-start',
            title: 'Let\'s Go!',
            image: './images/spots/lets-go.jpg',
            staticMap: false,
            description: 'New to SUP? Or maybe tired of the same old paddling spots? Here\'s a quick guide of places to SUP that are within an hour or three from Portland, Oregon USA. These are mainly my opinions and experience so your mileage may vary. Always paddle at your own risk, always wear a PFD & leash, and check conditions before you head out. <p>Just keep scrolling down to see some fine paddling places. <img src="./images/spots/suppmap.gif"></p>If you want more map detail and directions, just click the map 👉 ',
            location: {
                center: [-122.66440, 45.47991],
                zoom: 9.68,
                pitch: 0.00,
                bearing: -0.16       },
            onChapterEnter: [
                // {
                //     layer: 'layer-name',
                //     opacity: 1
                // }
            ],
            onChapterExit: [
                // {
                //     layer: 'layer-name',
                //     opacity: 0
                // }
            ]
        },
        {
            id: 'id-ri',
            title: '1. Ross Island',
            image: './images/spots/ross-island-1.jpg',
            staticMap: true,
            description: 'If you\'re in Portland proper, then Ross Island is a must-visit. Getting to Ross Island is pretty straightforward and very accessible from either Willamette Park or Sellwood Riverfront Park. There\'s lots of beach along Sellwood that you can hug for a while and if you\'re adventurous you can make it to the southern tip of Ross Island (aka "Newb Beach"). <img src="./images/spots/ross-island-3.jpg">Experienced paddlers will loop around the island for the 6 to 7 km trip or just hang out in the lagoon. This area gets really busy in the summer and lots of boats and jet skis will pass by. Be sure to stay out of the middle of the river and closer to shore (but watch out for remnant pilings as they will catch your fin and you\'ll be taking a dip).',
            location: {
                center: [ -122.66577,45.47073],
                zoom: 13.18,
                pitch: 60.00,
                bearing: -41.60
        },
            onChapterEnter: [
                // {
                //     layer: 'layer-name',
                //     opacity: 1
                // }
            ],
            onChapterExit: [
                // {
                //     layer: 'layer-name',
                //     opacity: 0
                // }
            ]
        },
        {
            id: 'id-merwin',
            title: '2. Merwin Lake (Yale Bridge)',
            image: './images/spots/merwin-solo.jpg',
            staticMap: true,
            description: 'Merwin is a crowd fave. Just one hour away from Portland, you\'ll find yourself in a lush PNW forest, replete with fuzzy ferns and forest fairies. The parking is sparse at Yale Bridge so get there early (there\'s more parking at Cresap Bay). The staircase down to the launch is long and steep, guaranteed to scuff your board. <img src="./images/spots/merwin.jpg"> Once you\'re in, it\'s a smooth ride to the picturesque cascades awaiting your IG stories. <img src="./images/spots/merwin-2.jpg">And there\'s a rope under the bridge for a swingin good time.',
            location: {
                center: [-122.37150, 45.96015],
                zoom: 14.08,
                pitch: 45.00,
                bearing: 0.00
        },
            onChapterEnter: [
                // {
                //     layer: 'layer-name',
                //     opacity: 1
                // }
            ],
            onChapterExit: [
                // {
                //     layer: 'layer-name',
                //     opacity: 0
                // }
            ]
        },
        {
            id: 'id-estacada',
            title: '3. Estacada Lake',
            image: './images/spots/estacada-lake.jpg',
            staticMap: true,
            description: 'Also within an hour drive from Portland is Estacada Lake (aka Timber Park, Milo McIver SP). Estacada is approachable from either Milo or Timber Park. Just depends on if you want to pay the park fee. Timber Park has rentals from <a href="https://clackamasriveroutfitters.com/paddle-board-kayak-rentals/">Clackamas River Outfitters</a> if you need a board. Estacada is also quite beautiful like Merwin with steep cliffs and a few cascades along the way. ',
            location: {
                center: [-122.34706,45.29564],
                zoom: 12.92,
                pitch: 0.00,
                bearing: 0.00
            },
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'id-narrows',
            title: '4. Willamette Narrows',
            image: './images/spots/narrows.jpg',
            staticMap: true,
            description: 'Like it says on the tin, Willamette Narrows can be a tricky paddle with mean and pointy rocks. Parking is at Willamette Park, the WP south of West Linn. From the beach closer to the mouth of the Tualatin River, head south and hug the shore till you get to the rocky stuff. Longer fins should watch for rocks. <img src="./images/spots/narrows-2.jpg"> Once you\'re in there, poke around the little inlets for a snack or yoga break.',
            location: {
                center: [-122.65148, 45.33848],
                zoom: 13.67,
                pitch: 0.00,
                bearing: 0.00
        },
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'id-vancouver-lake',
            title: '5. Vancouver Lake, WA',
            image: './images/spots/vancouver-lake.jpg',
            staticMap: true,
            description: 'Vancouver Lake is probably one of the best paddles for beginners (and kids!). When it\'s not too windy, you can move around the shallow beach with ease. With such a large fetch, the wind can turn and it will be a tough paddle back if you get unlucky with the weather. Just be sure to check conditions before you go (as with all places, really).',
            location: {
                center: [-122.74192, 45.68148],
                zoom: 12.11,
                pitch: 0.00,
                bearing: 0.00
            },
            onChapterEnter: [],
            onChapterExit: []
        }, 
        {
            id: 'id-hagg-lake',
            title: '6. Hagg Lake',
            image: './images/spots/hagg-lake.jpg',
            staticMap: true,
            description: 'Hagg is fun. Hagg is muddy. But Hagg is also really chill even for the kiddos. <video width="100%" controls><source src="./images/spots/hagg.mp4" type="video/mp4">Your browser does not support the video tag.</video> Park at Boat Launch C and head north in the no-wake zone to explore the tributaries.',
            location: {
                center: [-123.22922, 45.48977],
                zoom: 12.93,
                pitch: 52.50,
                bearing: -119.20
            },
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'id-willamette-falls',
            title: '7. Willamette Falls',
            image: './images/spots/willamette-falls-2.jpg',
            staticMap: true,
            description: 'Just south of Portland in the heart of Oregon City lie the dramatic views of Willamette Falls. While it\'s lined by derelict buildings ready for the next zombie film, the area is slated for a mix-use development by the <a href="https://pamplinmedia.com/pt/9-news/502927-403018-grand-ronde-plans-mixed-use-development-at-willamette-falls">Confederated Tribes of Grand Ronde</a>. As exciting as that news is, it\'s still a treat to get that close to the falls and hear its roar. <img src="./images/spots/willamette-falls-1.jpg">Careful of the swirlies and faster-than-you-think-current. Put in at Jon Storm Park under the I-205 bridge just off McLoughlin and head south to the mills.',
            location: {
                center: [-122.61548, 45.35443],
                zoom: 14.59,
                pitch: 43.00,
                bearing: 0.00
        },
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'id-smith-bybee',
            title: '8. Smith & Bybee',
            image: './images/spots/s&b.jpg',
            staticMap: true,
            description: 'Winter time paddling at Smith & Bybee Lakes is a must for birders and nutria spotters. The grasses and underwater shrubbery are way too thick in the spring and summer when Metro drains it to swamp status but the winter levels are great for a quick tour. The shrubs and trees above the water will make a maze-like setting so be sure you make a plan and know how to get back before you head out. S&B is tucked in the industrial part of North Portland just off Marine Drive. Park at the kayak and canoe launch and watch for bikers on the trail. Two things to note: Dogs are not allowed in the park and parking can be sketchy so don\'t leave any valuables in plain view. <video width="100%" controls><source src="./images/spots/s&b2.mp4" type="video/mp4">Your browser does not support the video tag.</video>',
            location: {
                center: [-122.71857, 45.61553],
                zoom: 14,
                pitch: 59.50,
                bearing: 68.00
            },
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'id-lacamas',
            title: '9. Lacamas Lake',
            image: './images/spots/lacamas.jpg',
            staticMap: true,
            description: 'Another Washington favorite is Lacamas Lake. Long and lush, you can get a decent paddle in at Lacamas by launching from the boat ramp near the Camas Heritage Park on the west side. For an even shorter paddle, skirt under the bridge into Round Lake.',
            location: {
                center: [-122.41044, 45.60443],
                zoom: 12.49,
                pitch: 0.00,
                bearing: 0.00
            },
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'id-scappoose',
            title: '10. Scappoose Bay',
            image: './images/spots/scappoose.jpg',
            description: 'Scappoose is a treat. The Bay has ample parking and Next Adventure is right there if you\'ve forgotten something like, oh...your board. Follow the bay south along the west side of the shore until it opens up to the east. There you will find the tributary to South Scapoose Creek. Like Smith & Bybee, be sure to track where you\'re going because it can get a little maze-y out there.',
            staticMap: true,
            location: {
                center: [-122.83608, 45.82762],
                zoom: 13.90,
                pitch: 60.00,
                bearing: 175.20
            },
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'id-crescent-lake', // fix locations from here on 
            title: '11. Crescent Lake',
            image: './images/spots/crescent-lake.jpg',
            description: 'Once you\'re willing to make the drive further out, you\'ll be rewarded with the amazing Crescent Lake. The lake is nestled in the Cascades and is a popular for fishing and camping, too. <img src="./images/spots/crescent-1.jpg"> Plan this in advance to get a sweet camp spot right by the beach.',
            staticMap: true,
            location: {
                center: [-122.01369, 43.46228],
                zoom: 12,
                pitch: 60.00,
                bearing: -56
            },
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'id-waldo-lake',
            title: '12. Waldo Lake',
            image: './images/spots/waldo-lake.jpg',
            description: 'Waldo Lake is a must-visit. It\'s a natural alpine lake and second deepest in Oregon next to Crater Lake. <img src="./images/spots/waldo-1.jpg"> The water super clear and cold. 📸 Evan Le.',
            staticMap: true,
            location: {
                center: [-122.04215, 43.69170],
                zoom: 12,
                pitch: 60.00,
                bearing: -26.54
            },
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'id-paulina-lake',
            title: '13. Paulina Lake',
            image: './images/spots/paulina-lake.jpg',
            description: 'Paulina Lake is a twin crater lake in the Newberry Crater National Monument. <img src="./images/spots/paulina-1.jpg"> Lots of great spots to paddle to, especially the hot springs. 📸 Evan Le.',
            staticMap: true,
            location: {
                center: [-121.27598, 43.71228],
                zoom: 13.90,
                pitch: 60.00,
                bearing: 48
            },
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'id-deschutes',
            title: '14. Deschutes River',
            image: './images/spots/deschutes.jpg', // see annette for image
            description: 'If you\'re in downtown Bend, be sure to pop into the Deschutes river for a float. You can also rent a board from <a href="https://tumalocreek.com/">Tumalo Creek</a>. <img src="./images/spots/deschutes-1.jpg"> There are a number of put-ins along the downtown stretch but parking is always a little scarce. 📸 Evan Le.',
            staticMap: true,
            location: {
                center: [-121.31480, 44.04383],
                zoom: 13,
                pitch: 0,
                bearing: 0 
            },
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'id-paradise',
            title: '15. Paradise Point',
            image: './images/spots/paradise.jpg',
            description: 'Just north of Portland off I-5 is Paradise Point State Park. <img src="./images/spots/paradise-1.jpg"> It\'s a small park with a small beach but it\'s a great spot to make a quick launch from. 📸 Evan Le.',
            staticMap: true,
            location: {
                center: [-122.70259, 45.86581],
                zoom: 14.20,
                pitch: 60.00,
                bearing: -24.80
            },
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'id-cedar',
            title: '16. Cedar Oak',
            image: './images/spots/cedaroak.jpg',
            description: 'Cedar Oak is a beginner-friendly spot. <img src="./images/spots/cedaroak-1.jpg"> Poke around in the lagoon or head south to Meldrum Bar where you can watch the locals get their vehicles stuck in the sand. 📸 Evan Le.',
            staticMap: true,
            location: {
                center: [-122.62930, 45.38941],
                zoom: 14.8,
                pitch: 37.00,
                bearing: 30.4
            },
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'id-elk-rock',
            title: '17. Elk Rock Island',
            image: './images/spots/elk-rock.jpg',
            description: 'If you\'re short on time, Elk Rock Island is an easy jaunt from Milwaukie Bay Park (parking very limited). <img src="./images/spots/elk-rock-1.jpg"> It\'s a small island with a small beach but it\'s a great spot to make a quick tour. If you\'re looking for a longer workout, head north from George Rogers Park. 📸 Evan Le.',
            staticMap: true,
            location: {
                center: [-122.64948, 45.43583],
                zoom: 15.2,
                pitch: 43.00,
                bearing: 43
            },
            onChapterEnter: [],
            onChapterExit: []
        }
    ]
};
