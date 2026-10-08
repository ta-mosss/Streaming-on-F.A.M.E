export type ContentKind = 'Original' | 'Series' | 'Movie' | 'Documentary' | 'Kids' | 'Reality' | 'Learning';

export interface Title {
  id: string;
  title: string;
  kind: ContentKind;
  genre: string;
  year: number;
  rating: string;
  duration: string;
  /** 2:3 portrait key art */
  artwork: string;
  /** 16:9 cinematic key art */
  backdrop: string;
  tagline: string;
  synopsis: string;
  tags: string[];
  /** Brand accent used for glows behind the title */
  accent: string;
  badge?: 'New' | 'Original' | 'Coming soon';
  featured?: boolean;
  /** Appears in the hero carousel */
  hero?: boolean;
}

const root = '/assets/content/';
const art = (id: string) => ({ artwork: `${root}${id}.svg`, backdrop: `${root}${id}-wide.svg` });

export const catalogue: Title[] = [
  { id:'city-of-dreams', title:'City of Dreams', kind:'Series', genre:'Drama', year:2027, rating:'16', duration:'8 episodes', ...art('city-of-dreams'), tagline:'Ambition has a price.', accent:'#e5007e', synopsis:'A young creative returns to Johannesburg determined to build a future on her own terms — and discovers that ambition has a price.', tags:['series','drama','originals'], badge:'Original', featured:true, hero:true },
  { id:'street-kings', title:'Street Kings', kind:'Series', genre:'Action', year:2027, rating:'16', duration:'10 episodes', ...art('street-kings'), tagline:'Loyalty. Survival. One chance.', accent:'#ff2a6d', synopsis:'A crew of friends navigate loyalty, ambition and survival while chasing a chance to change their lives.', tags:['series','action','drama'], badge:'New', hero:true },
  { id:'roots-and-rhythm', title:'Roots & Rhythm', kind:'Original', genre:'Music', year:2027, rating:'PG', duration:'6 episodes', ...art('roots-and-rhythm'), tagline:'The sound of a new generation.', accent:'#ff8a3d', synopsis:'Artists, producers and cultural voices trace the sounds shaping a new generation across Southern Africa.', tags:['originals','music','culture'], badge:'Original', hero:true },
  { id:'midnight-radio', title:'Midnight Radio', kind:'Series', genre:'Thriller', year:2027, rating:'16', duration:'6 episodes', ...art('midnight-radio'), tagline:'Don’t pick up.', accent:'#ff3fa8', synopsis:'A late-night radio host receives a call that turns an ordinary broadcast into a dangerous investigation.', tags:['series','thriller','originals'], badge:'New', hero:true },
  { id:'future-africa', title:'Future Africa', kind:'Documentary', genre:'Documentary', year:2027, rating:'PG', duration:'4 episodes', ...art('future-africa'), tagline:'The next decade starts here.', accent:'#3fffd6', synopsis:'A hopeful documentary journey through the people, technology and ideas shaping Africa’s next decade.', tags:['docs','documentaries','africa'], badge:'Original', hero:true },
  { id:'after-the-rain', title:'After the Rain', kind:'Movie', genre:'Drama', year:2027, rating:'13', duration:'1h 48m', ...art('after-the-rain'), tagline:'Starting again is the hard part.', accent:'#8aa0ff', synopsis:'A family rebuilding after a storm finds that the hardest part of starting again is deciding what to leave behind.', tags:['movies','drama','originals'], badge:'Original' },
  { id:'the-next-move', title:'The Next Move', kind:'Reality', genre:'Reality', year:2027, rating:'13', duration:'10 episodes', ...art('the-next-move'), tagline:'Big ideas. Real pressure.', accent:'#3de0ff', synopsis:'Big ideas meet real-world pressure as ambitious young entrepreneurs compete to turn their next move into a business.', tags:['reality','business','originals'], badge:'New' },
  { id:'the-last-dance', title:'The Last Dance', kind:'Movie', genre:'Romance', year:2027, rating:'13', duration:'1h 36m', ...art('the-last-dance'), tagline:'One more song.', accent:'#ffb27a', synopsis:'Two old friends get one last chance to choose between the lives they planned and the lives they want.', tags:['movies','romance','drama'] },
  { id:'voices-of-home', title:'Voices of Home', kind:'Original', genre:'Culture', year:2027, rating:'PG', duration:'5 episodes', ...art('voices-of-home'), tagline:'Told by the people who live it.', accent:'#ffa34a', synopsis:'Stories from communities across the region, told by the people who live them.', tags:['originals','culture','documentaries'], badge:'Original' },
  { id:'village-to-vision', title:'Village to Vision', kind:'Documentary', genre:'Business', year:2027, rating:'PG', duration:'1h 12m', ...art('village-to-vision'), tagline:'Big businesses start small.', accent:'#ff6a8a', synopsis:'A grounded look at entrepreneurs building meaningful businesses from overlooked places and overlooked ideas.', tags:['docs','business','africa'] },
  { id:'makers-of-tomorrow', title:'Makers of Tomorrow', kind:'Learning', genre:'Business', year:2027, rating:'PG', duration:'8 episodes', ...art('makers-of-tomorrow'), tagline:'Local problems. Global ideas.', accent:'#ffc84a', synopsis:'Practical conversations with builders, founders and creators turning local problems into opportunities.', tags:['learning','business','empower'] },
  { id:'little-legends', title:'Little Legends', kind:'Kids', genre:'Family', year:2027, rating:'G', duration:'12 episodes', ...art('little-legends'), tagline:'Big curiosity. Little legends.', accent:'#ffd23f', synopsis:'Big curiosity, big imagination and little legends learning about the world one adventure at a time.', tags:['kids','family','learning'], badge:'New' }
];

export const byId = (id: string) => catalogue.find(item => item.id === id);
export const byTag = (tag: string) => catalogue.filter(item => item.tags.includes(tag));

export const categories = [
  { id:'all', label:'All' },
  { id:'originals', label:'African Originals' },
  { id:'series', label:'Series' },
  { id:'movies', label:'Movies' },
  { id:'docs', label:'Documentaries' },
  { id:'kids', label:'Kids & Family' },
  { id:'learning', label:'Learning' }
];
