import fs from 'fs';
import path from 'path';

const ROOT = process.argv[2];
const SITE = 'https://pilk.ai';
const MS='<!-- PILK-SEO-START -->', ME='<!-- PILK-SEO-END -->';
const GS='<!-- PILK-TAGS-START -->', GE='<!-- PILK-TAGS-END -->';
const LS='<!-- PILK-LD-START -->', LE='<!-- PILK-LD-END -->';

const MORTGAGE = new Set(['mortgage-broker','rate-ready','home-first','trust-lending','clear-mortgage','summit-loans','keystone-lending','velocity-mortgage','harbor-lending','prime-rate','legacy-mortgage','metro-lending','golden-oak','north-star','swift-approve']);

const BRANDS = {
 'mortgage-broker':'Beacon Lending','rate-ready':'RateReady','home-first':'HomeFirst Lending',
 'trust-lending':'TrustPoint Lending','clear-mortgage':'ClearPath Mortgage','summit-loans':'Summit Loans',
 'keystone-lending':'Keystone Capital','velocity-mortgage':'Velocity Home Loans','harbor-lending':'Harbor Home Loans',
 'prime-rate':'PrimeRate Financial','legacy-mortgage':'Legacy Mortgage Co.','metro-lending':'Metro Lending Group',
 'golden-oak':'Golden Oak Lending','north-star':'NorthStar Mortgage','swift-approve':'SwiftApprove',
 'brokerage-command':'Meridian Group','coastal-luxe':'Shoreline & Co.','modern-agent':'Avery Stone',
 'signature-estate':'Maison Laurent','single-property':'The Bayfront Residence','urban-loft':'LOFT52',
 'rental-management':'Keystone Property Management'
};

const bizType = (slug)=> MORTGAGE.has(slug) ? 'FinancialService' : 'RealEstateAgent';

const stripTags = (s)=> s.replace(/<[^>]*>/g,' ').replace(/&nbsp;/gi,' ').replace(/&amp;/gi,'&').replace(/&#\d+;/g,'').replace(/&[a-z]+;/gi,' ').replace(/\s+/g,' ').trim();
const esc = (s)=> s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

function firstParagraph(html){
  const nav=/\b(Home|Programs?|Calculator|About|Reviews|Apply|Contact|Listings|Residences?|Amenities)\b/g;
  const ps=[...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)];
  for(const p of ps){ const t=stripTags(p[1]); if(t.length<50||t.length>320||/pilk\.ai/i.test(t))continue; if((t.match(nav)||[]).length>=3)continue; return t; }
  for(const p of ps){ const t=stripTags(p[1]); if(t.length>=50&&t.length<=320&&!/pilk\.ai/i.test(t)) return t; }
  return '';
}

function firstAsset(html){
  const m=html.match(/\/template-previews\/_assets\/[A-Za-z0-9_\-]+\.(?:jpg|jpeg|png|webp)/i);
  return m ? SITE+m[0] : SITE+'/Pilk.AI%20Logo%20PNG.png';
}
const PN={index:'Home',programs:'Loan Programs',calculator:'Mortgage Calculator',reviews:'Reviews',about:'About',apply:'Apply',contact:'Contact',listings:'Listings',listing:'Listing',agents:'Our Agents',recruiting:'Careers',lifestyle:'Lifestyle',home:'Home',property:'Property',sales:'Recent Sales',residence:'Residence',residences:'Residences',amenities:'Amenities',story:'Our Story',gallery:'Gallery',neighborhood:'Neighborhood',features:'Features',owners:'Owner Services',tenants:'Tenant Services',rental:'Rental',rentals:'Rentals'};
const pageName=(f)=>{ const b=path.basename(f,'.html'); return PN[b]||(b.charAt(0).toUpperCase()+b.slice(1)); };

function clean(html){
  const rm=(s,a,b)=>{let i;while((i=s.indexOf(a))!==-1){const j=s.indexOf(b,i);if(j===-1)break;s=s.slice(0,i)+s.slice(j+b.length);}return s;};
  html=rm(html,GS,GE); html=rm(html,MS,ME); html=rm(html,LS,LE);
  return html.replace(/\n{3,}/g,'\n\n');
}

function processFile(file, slug){
  let html=fs.readFileSync(file,'utf8');
  html=clean(html);
  const base=path.basename(file);
  const brand=BRANDS[slug]|| (html.match(/<title>([^<—|·-]+)/i)||[])[1]?.trim() || 'Our Company';
  const type=bizType(slug);
  const root=`${SITE}/template-previews/${slug}/`;
  const canonical=`${SITE}/template-previews/${slug}/${base}`;
  const title=((html.match(/<title>([^<]*)<\/title>/i)||[])[1]||brand).trim();
  let desc=firstParagraph(html)||`${brand} — ${pageName(file)}.`;
  desc=desc.replace(/\s+/g," ").trim(); if(desc.length>155){desc=desc.slice(0,155); const k=desc.lastIndexOf(" "); if(k>60)desc=desc.slice(0,k); desc=desc.replace(/[ ,;:\-]+$/,"")+"…";}
  const img=firstAsset(html);

  const seo=`${MS}
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="noindex, follow">
<meta name="author" content="${esc(brand)}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(brand)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${img}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${img}">
${ME}`;

  const tags=`${GS}
<!-- Google tag (gtag.js) - replace G-XXXXXXXXXX with the client's GA4 Measurement ID -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-XXXXXXXXXX');</script>
<!-- Meta Pixel - replace 000000000000000 with the client's Pixel ID -->
<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','000000000000000');fbq('track','PageView');</script>
<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=000000000000000&ev=PageView&noscript=1"/></noscript>
${GE}`;

  const ld=[];
  const biz={"@context":"https://schema.org","@type":type,"@id":root+"#business","name":brand,"url":root,"description":desc,"image":img,"areaServed":"United States","telephone":"+1-000-000-0000","priceRange":"$$"};
  if(type==='FinancialService') biz.serviceType='Mortgage lending';
  // No aggregateRating: these are demo businesses and their reviews are sample
  // copy. Rating markup for reviews that don't exist breaks Google's structured
  // data policy and can earn a manual action for all of pilk.ai.
  ld.push(biz);
  if(base==='index.html') ld.push({"@context":"https://schema.org","@type":"WebSite","name":brand,"url":root});
  if(base!=='index.html') ld.push({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":root},{"@type":"ListItem","position":2,"name":pageName(file),"item":canonical}]});
  if(base==='programs.html'){
    const h3=[...html.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)].map(m=>stripTags(m[1])).filter(t=>t&&t.length<42).slice(0,8);
    if(h3.length) ld.push({"@context":"https://schema.org","@type":"Service","serviceType":"Mortgage lending","provider":{"@type":type,"name":brand,"url":root},"areaServed":"United States","hasOfferCatalog":{"@type":"OfferCatalog","name":"Loan Programs","itemListElement":h3.map(n=>({"@type":"Offer","itemOffered":{"@type":"Service","name":n}}))}});
  }
  const ldBlock=LS+"\n"+ld.map(o=>`<script type="application/ld+json">${JSON.stringify(o)}</script>`).join("\n")+"\n"+LE;

  if(/<meta\s+charset[^>]*>/i.test(html)) html=html.replace(/<meta\s+charset[^>]*>/i, m=>m+"\n"+tags);
  else html=html.replace(/<head[^>]*>/i, m=>m+"\n"+tags);
  if(/<\/title>/i.test(html)) html=html.replace(/<\/title>/i, m=>m+"\n"+seo);
  else html=html.replace(/<head[^>]*>/i, m=>m+"\n"+seo);
  html=html.replace(/<\/head>/i, m=>ldBlock+"\n"+m);

  fs.writeFileSync(file,html);
  return {slug,base,brand,agg:!!biz.aggregateRating,desc};
}

const slugs=fs.readdirSync(ROOT).filter(d=>{try{return fs.statSync(path.join(ROOT,d)).isDirectory()&&d!=='_assets';}catch{return false;}});
let n=0; const per={}; let aggCount=0;
for(const slug of slugs){
  const dir=path.join(ROOT,slug);
  for(const f of fs.readdirSync(dir).filter(x=>x.endsWith('.html'))){
    const r=processFile(path.join(dir,f),slug); n++; per[slug]=(per[slug]||0)+1; if(r.agg)aggCount++;
  }
}
console.log('DONE: injected SEO into '+n+' pages across '+slugs.length+' template sites; '+aggCount+' pages got AggregateRating');
