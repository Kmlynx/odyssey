import sharp from 'sharp';
async function load(p){const{data,info}=await sharp(p).ensureAlpha().raw().toBuffer({resolveWithObject:true});return{data,w:info.width,h:info.height,ch:info.channels};}
const idx=(img,x,y)=>(y*img.w+x)*img.ch;
// vertically smoothed column: returns [r,g,b] per y averaged over +-rad rows at column x0
function smoothCol(img,x0,rad){
  const {w,h,ch}=img; const out=new Array(h);
  for(let y=0;y<h;y++){let r=0,g=0,b=0,n=0;for(let dy=-rad;dy<=rad;dy++){const yy=y+dy;if(yy<0||yy>=h)continue;const i=idx(img,x0,yy);r+=img.data[i];g+=img.data[i+1];b+=img.data[i+2];n++;}out[y]=[r/n,g/n,b/n];}
  return out;
}

const west=await load('public/odyssey/map-west.png');
const east=await load('public/odyssey/map-east.png');
const {w,h,ch}=west;

// ---- EAST: remove thin left gold frame only (clamp from clean col 60), keep everything else ----
const eSmooth=smoothCol(east,60,30);          // east left ocean reference (smoothed)
for(let y=0;y<h;y++){
  for(let x=0;x<=51;x++){const d=idx(east,x,y);const c=eSmooth[y];east.data[d]=c[0];east.data[d+1]=c[1];east.data[d+2]=c[2];}
}

// ---- WEST: remove right frame + wide converge of open ocean toward east edge tone ----
const wFill=smoothCol(west,1280,30);          // west ocean fill (smoothed), for frame gap
// fill removed frame gap 1290..1407 with west ocean first
for(let y=0;y<h;y++){
  for(let x=1290;x<w;x++){const d=idx(west,x,y);const c=wFill[y];west.data[d]=c[0];west.data[d+1]=c[1];west.data[d+2]=c[2];}
}
// wide converge toward east's left-edge tone
const B=340, xStart=w-B; // 1068..1407
for(let y=0;y<h;y++){
  const T=eSmooth[y];
  for(let x=xStart;x<w;x++){
    const f=(x-xStart)/(w-1-xStart); // 0..1, 1 at seam
    const d=idx(west,x,y);
    for(let c=0;c<3;c++) west.data[d+c]=Math.round(west.data[d+c]*(1-f)+T[c]*f);
  }
}

await sharp(west.data,{raw:{width:w,height:h,channels:ch}}).png().toFile('public/odyssey/map-west.png');
await sharp(east.data,{raw:{width:w,height:h,channels:ch}}).png().toFile('public/odyssey/map-east.png');
const wb=await sharp('public/odyssey/map-west.png').toBuffer();
const eb=await sharp('public/odyssey/map-east.png').toBuffer();
await sharp({create:{width:w*2,height:h,channels:4,background:{r:0,g:0,b:0,alpha:1}}})
 .composite([{input:wb,left:0,top:0},{input:eb,left:w,top:0}]).png().toFile('.v0scratch/stitched.png');
console.log('done');
