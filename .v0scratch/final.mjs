import sharp from 'sharp';
async function load(p){const{data,info}=await sharp(p).ensureAlpha().raw().toBuffer({resolveWithObject:true});return{data,w:info.width,h:info.height,ch:info.channels};}
const idx=(img,x,y)=>(y*img.w+x)*img.ch;
function smoothCol(img,x0,rad){const{w,h}=img;const out=new Array(h);for(let y=0;y<h;y++){let r=0,g=0,b=0,n=0;for(let dy=-rad;dy<=rad;dy++){const yy=y+dy;if(yy<0||yy>=h)continue;const i=idx(img,x0,yy);r+=img.data[i];g+=img.data[i+1];b+=img.data[i+2];n++;}out[y]=[r/n,g/n,b/n];}return out;}

const west=await load('public/odyssey/map-west.png');
const east=await load('public/odyssey/map-east.png');
const {w,h,ch}=west;

// EAST: remove thin left gold frame only (clamp smoothed clean ocean col 60 -> 0..51)
const eSmooth=smoothCol(east,60,40);
for(let y=0;y<h;y++){for(let x=0;x<=51;x++){const d=idx(east,x,y);const c=eSmooth[y];east.data[d]=c[0];east.data[d+1]=c[1];east.data[d+2]=c[2];}}

// WEST: fill frame gap with horizontal clamp of col 1289 (keeps frame at top/bottom, ocean in middle)
for(let y=0;y<h;y++){const s=idx(west,1289,y);for(let x=1290;x<w;x++){const d=idx(west,x,y);for(let c=0;c<3;c++)west.data[d+c]=west.data[s+c];}}

// converge west open ocean toward east tone, ocean rows only with taper
const yT=40,yB=725,ramp=34,B=340,xStart=w-B;
const strength=(y)=>{if(y<yT||y>yB)return 0;if(y<yT+ramp)return (y-yT)/ramp;if(y>yB-ramp)return (yB-y)/ramp;return 1;};
for(let y=0;y<h;y++){const s=strength(y);if(s<=0)continue;const T=eSmooth[y];
  for(let x=xStart;x<w;x++){const f=(x-xStart)/(w-1-xStart)*s;const d=idx(west,x,y);for(let c=0;c<3;c++)west.data[d+c]=Math.round(west.data[d+c]*(1-f)+T[c]*f);}}

await sharp(west.data,{raw:{width:w,height:h,channels:ch}}).png().toFile('/tmp/west_raw.png');

// light horizontal-ish blur over the west blend band to remove rhumb streaks, composite back
const band=await sharp('/tmp/west_raw.png').extract({left:xStart-10,top:yT,width:w-(xStart-10),height:yB-yT})
  .blur(4).png().toBuffer();
await sharp('/tmp/west_raw.png').composite([{input:band,left:xStart-10,top:yT}]).png().toFile('public/odyssey/map-west.png');
await sharp(east.data,{raw:{width:w,height:h,channels:ch}}).png().toFile('public/odyssey/map-east.png');

const wb=await sharp('public/odyssey/map-west.png').toBuffer();
const eb=await sharp('public/odyssey/map-east.png').toBuffer();
await sharp({create:{width:w*2,height:h,channels:4,background:{r:0,g:0,b:0,alpha:1}}})
 .composite([{input:wb,left:0,top:0},{input:eb,left:w,top:0}]).png().toFile('.v0scratch/stitched.png');
console.log('done');
