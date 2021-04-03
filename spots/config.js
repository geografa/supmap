var config = {
    style: 'mapbox://styles/grafa/ckdhx8rpo01b61ip8o9e8fth3',
    accessToken: 'pk.eyJ1IjoiZ3JhZmEiLCJhIjoiY2tkb3ZoNzZrMDZyMzMxbGo0YTF3ZHk2ZyJ9.u6m6_Sxxu5ITBuomsTyA3g',
    showMarkers: true,
    theme: 'light',
    alignment: 'left',
    title: 'Best Portland SUP Spots',
    subtitle: 'A short guide to great paddle places within one hour of Portland, Oregon',
    byline: 'by Rafa Gutierrez',
    footer: 'Source: Rafa Gutierrez, newb paddler, Portland OR. Opinions my own. Always wear a PFD, leash, and something fabulous. Copyright © 2021.',
    chapters: [
        {
            id: 'id-start',
            title: 'Let\'s Go!',
            image: './images/spots/ross-island-2.jpg',
            staticMap: false,
            description: 'New to SUP? Or maybe tired of the same old paddling spots? Here\'s a biased guide of places to SUP that are within an hour or so from Portland, Oregon USA. These are mainly my opinions and experience so your mileage may vary. Always paddle at your own risk, always wear a PFD & leash, and check conditions before you head out. <p>Just keep scrolling down to see some fine paddling places in and around the City of Roses. <img src="./images/spots/suppmap.gif"></p>If you want more map detail and directions, just click the map 👉 ',
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
            image: './images/spots/ross-island.jpg',
            staticMap: true,
            description: 'If you\'re in Portland proper, then Ross Island is a must-visit. Getting to Ross Island is pretty straightforward and very accessible from either Willamette Park or Sellwood Riverfront Park. There\'s lots of beach along Sellwood that you can hug for a while and if you\'re adventurous you can make it to the southern tip of Ross Island. <img src="./images/spots/ross-island-3.jpg">Experienced paddlers will loop around the island for the 6 to 7 km trip or just hang out in the lagoon. This area gets really busy in the summer and lots of boats and jet skis will pass by. Be sure to stay out of the middle of the river and closer to shore (but watch out for remnant pilings as they will catch your fin and you\'ll be taking a dip).',
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
            image: './images/spots/merwin-2.jpg',
            staticMap: true,
            description: 'Merwin is fave spot of mine. Just one hour away from Portland, you\'ll find yourself in a lush PNW forest, replete with fuzzy ferns and forest fairies. The parking is sparse at Yale Bridge so get there early. The staircase down to the launch is long and steep, guaranteed to scuff your board. <img src="./images/spots/merwin.jpg">But once you\'re in, it\'s a smooth ride to the picturesque cascades awaiting your IG stories. And there\'s a rope swing under the bridge for the swinger in you.',
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
            description: 'Also within the 1 hour radius of Portland is Estacada Lake (aka Timber Park, Milo McIver SP). Estacada is approachable from either Milo or Timber Park. Just depends on if you want to pay the park fee. Timber Park has rentals from <a href="https://clackamasriveroutfitters.com/paddle-board-kayak-rentals/">Clackamas River Outfitters</a> if you need a board. Estacada is also quite beautiful like Merwin with steep cliffs and a few cascades along the way. ',
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
            description: 'Like it says on the tin, Willamette Narrows is a tricky paddle with mean and pointy rocks. Parking is at Willamette Park, the WP south of West Linn. From the beach closer to the mouth of the Tualatin River, head south and hug the shore till you get to the rocky stuff. Longer fins should watch for rocks. <img src="./images/spots/narrows-2.jpg"> Once you\'re in there, poke around the little inlets for a snack or yoga break.',
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
            description: 'Winter time paddling at Smith & Bybee Lakes is a must for birders and nutria spotters. The grasses and underwater shrubbery are way too thick in the spring and summer when Metro drains it to swamp status but the winter levels are great for quick tour. The shrubs and trees above the water will make a maze-like setting so be sure you make a plan and know how to get back before you head out. S&B is tucked in the industrial part of North Portland just off Marine Drive. Park at the kayak and canoe launch and watch for bikers on the trail. <video width="100%" controls><source src="./images/spots/s&b2.mp4" type="video/mp4">Your browser does not support the video tag.</video>',
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
            staticMap: true,
            description: 'Scappoose was a treat this summer. The Bay has ample parking and Next Adventure is right there if you\'ve forgotten something like, oh...your board. Like Smith & Bybee, be sure to track where you\'re going because it can get a little maze-y out there.',
            location: {
                center: [-122.83608, 45.82762],
                zoom: 13.90,
                pitch: 60.00,
                bearing: 175.20
            },
            onChapterEnter: [],
            onChapterExit: []
        }
    ]
};
