import sharp from 'sharp';

async function load(path){
  const { data, info } = await sharp(path).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  return { data, w: info.width, h: info.height, ch: info.channels };
}
function px(img,x,y){ return (y*img.w+x)*img.ch; }

async function fixWest(){
  const img = await load('public/odyssey/map-west.png');
  const {w,h,ch} = img;
  // border region x in [1286 .. w-1]; reflect about x=1285.5
  const start=1286;
  for(let y=0;y<h;y++){
    for(let x=start;x<w;x++){
      const src = (2*1285 - x + 1); // reflection about 1285.5
      const s = px(img, Math.max(0,src), y);
      const d = px(img, x, y);
      for(let c=0;c<ch;c++) img.data[d+c]=img.data[s+c];
    }
  }
  await sharp(img.data,{raw:{width:w,height:h,channels:ch}}).png().toFile('public/odyssey/map-west.png');
  console.log('west done');
}
async function fixEast(){
  const img = await load('public/odyssey/map-east.png');
  const {w,h,ch} = img;
  // border region x in [0 .. 51]; reflect about x=51.5
  for(let y=0;y<h;y++){
    for(let x=0;x<=51;x++){
      const src = (103 - x); // reflection about 51.5
      const s = px(img, src, y);
      const d = px(img, x, y);
      for(let c=0;c<ch;c++) img.data[d+c]=img.data[s+c];
    }
  }
  await sharp(img.data,{raw:{width:w,height:h,channels:ch}}).png().toFile('public/odyssey/map-east.png');
  console.log('east done');
}
await fixWest();
await fixEast();
