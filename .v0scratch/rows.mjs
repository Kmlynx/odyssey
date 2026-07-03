import sharp from 'sharp';
async function load(p){const{data,info}=await sharp(p).ensureAlpha().raw().toBuffer({resolveWithObject:true});return{data,w:info.width,h:info.height,ch:info.channels};}
function rowColorNear(img,edgeX,y,span){let r=0,g=0,b=0,n=0;for(let dx=0;dx<span;dx++){const x=edgeX<0?img.w-1-dx:edgeX+dx;const i=(y*img.w+x)*img.ch;r+=img.data[i];g+=img.data[i+1];b+=img.data[i+2];n++;}return[r/n,g/n,b/n];}
for(const [name,edgeX] of [['west',-1],['east',0]]){
  const img=await load(`public/odyssey/map-${name}.png`);
  console.log('==',name,img.w+'x'+img.h);
  for(let y=0;y<img.h;y+=8){
    const [r,g,b]=rowColorNear(img,edgeX,y,40);
    const gold=r>130&&g>100&&r-b>28;
    if(y<120||y>img.h-120) console.log('y='+y, Math.round(r),Math.round(g),Math.round(b), gold?'FRAME':'ocean');
  }
}
