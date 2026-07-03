import sharp from 'sharp';

async function load(path){
  const { data, info } = await sharp(path).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  return { data, w: info.width, h: info.height, ch: info.channels };
}
const idx=(img,x,y)=>(y*img.w+x)*img.ch;

// 1) edge-clamp to remove frames
const west = await load('public/odyssey/map-west.png');
const east = await load('public/odyssey/map-east.png');
const {w,h,ch}=west;

// west: clamp column 1285 into 1286..w-1
for(let y=0;y<h;y++){
  const s=idx(west,1285,y);
  for(let x=1286;x<w;x++){const d=idx(west,x,y);for(let c=0;c<ch;c++)west.data[d+c]=west.data[s+c];}
}
// east: clamp column 52 into 0..51
for(let y=0;y<h;y++){
  const s=idx(east,52,y);
  for(let x=0;x<=51;x++){const d=idx(east,x,y);for(let c=0;c<ch;c++)east.data[d+c]=east.data[s+c];}
}

// 2) converge inner edges to shared per-row midColor over blend width B
const B=240;
for(let y=0;y<h;y++){
  const we=idx(west,w-1,y);   // west inner edge (right)
  const ee=idx(east,0,y);     // east inner edge (left)
  const mid=[0,1,2].map(c=>(west.data[we+c]+east.data[ee+c])/2);
  for(let k=0;k<B;k++){
    const f=(k+1)/B; // 0 far -> 1 at edge
    // west x from w-B .. w-1
    const wx=w-B+k; const dW=idx(west,wx,y);
    for(let c=0;c<3;c++) west.data[dW+c]=Math.round(west.data[dW+c]*(1-f)+mid[c]*f);
    // east x from B-1 .. 0
    const ex=B-1-k; const dE=idx(east,ex,y);
    for(let c=0;c<3;c++) east.data[dE+c]=Math.round(east.data[dE+c]*(1-f)+mid[c]*f);
  }
}

await sharp(west.data,{raw:{width:w,height:h,channels:ch}}).png().toFile('public/odyssey/map-west.png');
await sharp(east.data,{raw:{width:w,height:h,channels:ch}}).png().toFile('public/odyssey/map-east.png');

// stitch preview
const wb=await sharp('public/odyssey/map-west.png').toBuffer();
const eb=await sharp('public/odyssey/map-east.png').toBuffer();
await sharp({create:{width:w*2,height:h,channels:4,background:{r:0,g:0,b:0,alpha:1}}})
 .composite([{input:wb,left:0,top:0},{input:eb,left:w,top:0}]).png().toFile('.v0scratch/stitched.png');
console.log('done');
