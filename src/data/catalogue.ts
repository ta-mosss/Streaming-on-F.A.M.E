export type ContentKind = 'Original' | 'Series' | 'Movie' | 'Documentary' | 'Kids' | 'Reality' | 'Learning';

export interface Title {
  id: string;
  title: string;
  kind: ContentKind;
  genre: string;
  year: number;
  rating: string;
  duration: string;
  artwork: string;
  synopsis: string;
  tags: string[];
  featured?: boolean;
}

const root = '/assets/content/';

export const catalogue: Title[] = [
  { id:'city-of-dreams', title:'City of Dreams', kind:'Series', genre:'Drama', year:2027, rating:'16', duration:'8 episodes', artwork:root+'city-of-dreams.svg', synopsis:'A young creative returns to Johannesburg determined to build a future on her own terms — and discovers that ambition has a price.', tags:['series','drama','originals'], featured:true },
  { id:'roots-and-rhythm', title:'Roots & Rhythm', kind:'Original', genre:'Music', year:2027, rating:'PG', duration:'6 episodes', artwork:root+'roots-and-rhythm.svg', synopsis:'Artists, producers and cultural voices trace the sounds shaping a new generation across Southern Africa.', tags:['originals','music','culture'] },
  { id:'the-next-move', title:'The Next Move', kind:'Reality', genre:'Reality', year:2027, rating:'13', duration:'10 episodes', artwork:root+'the-next-move.svg', synopsis:'Big ideas meet real-world pressure as ambitious young entrepreneurs compete to turn their next move into a business.', tags:['reality','business','originals'] },
  { id:'after-the-rain', title:'After the Rain', kind:'Movie', genre:'Drama', year:2027, rating:'13', duration:'1h 48m', artwork:root+'after-the-rain.svg', synopsis:'A family rebuilding after a storm finds that the hardest part of starting again is deciding what to leave behind.', tags:['movies','drama','originals'] },
  { id:'future-africa', title:'Future Africa', kind:'Documentary', genre:'Documentary', year:2027, rating:'PG', duration:'4 episodes', artwork:root+'future-africa.svg', synopsis:'A hopeful documentary journey through the people, technology and ideas shaping Africa’s next decade.', tags:['docs','documentaries','africa'] },
  { id:'street-kings', title:'Street Kings', kind:'Series', genre:'Action', year:2027, rating:'16', duration:'10 episodes', artwork:root+'street-kings.svg', synopsis:'A crew of friends navigate loyalty, ambition and survival while chasing a chance to change their lives.', tags:['series','action','drama'] },
  { id:'little-legends', title:'Little Legends', kind:'Kids', genre:'Family', year:2027, rating:'G', duration:'12 episodes', artwork:root+'little-legends.svg', synopsis:'Big curiosity, big imagination and little legends learning about the world one adventure at a time.', tags:['kids','family','learning'] },
  { id:'voices-of-home', title:'Voices of Home', kind:'Original', genre:'Culture', year:2027, rating:'PG', duration:'5 episodes', artwork:root+'voices-of-home.svg', synopsis:'Stories from communities across the region, told by the people who live them.', tags:['originals','culture','documentaries'] },
  { id:'makers-of-tomorrow', title:'Makers of Tomorrow', kind:'Learning', genre:'Business', year:2027, rating:'PG', duration:'8 episodes', artwork:root+'makers-of-tomorrow.svg', synopsis:'Practical conversations with builders, founders and creators turning local problems into opportunities.', tags:['learning','business','empower'] },
  { id:'the-last-dance', title:'The Last Dance', kind:'Movie', genre:'Romance', year:2027, rating:'13', duration:'1h 36m', artwork:root+'the-last-dance.svg', synopsis:'Two old friends get one last chance to choose between the lives they planned and the lives they want.', tags:['movies','romance','drama'] },
  { id:'village-to-vision', title:'Village to Vision', kind:'Documentary', genre:'Business', year:2027, rating:'PG', duration:'1h 12m', artwork:root+'village-to-vision.svg', synopsis:'A grounded look at entrepreneurs building meaningful businesses from overlooked places and overlooked ideas.', tags:['docs','business','africa'] },
  { id:'midnight-radio', title:'Midnight Radio', kind:'Series', genre:'Thriller', year:2027, rating:'16', duration:'6 episodes', artwork:root+'midnight-radio.svg', synopsis:'A late-night radio host receives a call that turns an ordinary broadcast into a dangerous investigation.', tags:['series','thriller','originals'] }
];

export const categories = [
  { id:'all', label:'All' },
  { id:'originals', label:'African Originals' },
  { id:'series', label:'Series' },
  { id:'movies', label:'Movies' },
  { id:'docs', label:'Documentaries' },
  { id:'kids', label:'Kids & Family' },
  { id:'learning', label:'Learning' }
];
