// Curated facts from MusicBrainz release credits. Dates are original release years.
const tracks=[
 {id:'cola',title:'Cola Bottle Baby',artist:'Edwin Birdsong',year:1979,genre:'Funk',color:'#dc8f48'},
 {id:'harder',title:'Harder, Better, Faster, Stronger',artist:'Daft Punk',year:2001,genre:'Electronic',color:'#343e79'},
 {id:'stronger',title:'Stronger',artist:'Kanye West',year:2007,genre:'Hip-hop',color:'#8f537d'},
 {id:'fire',title:'Through the Fire',artist:'Chaka Khan',year:1984,genre:'R&B',color:'#bc4c63'},
 {id:'wire',title:'Through the Wire',artist:'Kanye West',year:2003,genre:'Hip-hop',color:'#bb773d'},
 {id:'chi',title:'Are You My Woman? (Tell Me So)',artist:'The Chi-Lites',year:1970,genre:'Soul',color:'#7b623e'},
 {id:'crazy',title:'Crazy in Love',artist:'Beyoncé feat. Jay-Z',year:2003,genre:'R&B',color:'#396c86'},
 {id:'charm',title:'As Long as I’ve Got You',artist:'The Charmels',year:1967,genre:'Soul',color:'#626f4a'},
 {id:'cream',title:'C.R.E.A.M.',artist:'Wu-Tang Clan',year:1993,genre:'Hip-hop',color:'#b79b40'},
 {id:'fruit',title:'Juicy Fruit',artist:'Mtume',year:1983,genre:'Funk',color:'#a3375e'},
 {id:'juicy',title:'Juicy',artist:'The Notorious B.I.G.',year:1994,genre:'Hip-hop',color:'#386351'},
 {id:'tomato',title:'Sliced Tomatoes',artist:'Just Brothers',year:1972,genre:'Soul',color:'#9e5d33'},
 {id:'rock',title:'The Rockafeller Skank',artist:'Fatboy Slim',year:1998,genre:'Electronic',color:'#687a91'},
];
const edges=[
 ['cola','harder','92102aaf-ed3b-49eb-bf3a-af0563a72933'],['harder','stronger','c443971e-532a-46d9-8a38-39b65d7ad07e'],['fire','wire','55a33f0e-eebb-4426-9b87-30bb90d55d11'],['chi','crazy','6b46a008-f795-4a6e-a3b8-49818c439d35'],['charm','cream','cb87d313-ae6e-4f8c-b625-fd45c7d1b4f2'],['fruit','juicy','2709b271-05f3-43d1-b0bb-bd6f757cd7ea'],['tomato','rock','d0dc2e14-69e3-314f-8637-f4ce4abbb426']
].map(([from,to,source])=>({from,to,type:'sample',source:'https://musicbrainz.org/release/'+source}));
