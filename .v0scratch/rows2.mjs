import sharp from 'sharp';
async function load(p){const{data,info}=await sharp(p).ensureAlpha().raw().toBuffer({resolveWithObject:true});return{data,w:info.width,h:info.height,ch:info.channels};}
const at=(img,x,y)=>{const i=(y*img.w+x)*img.ch;return[img.data[i],img.data[i+1],img.data[i+2]];};
for(const [name,sx] of [['west',1265],['east',150]]){
  const img=await load(`public/odyssey/map-${name}.png`);
  console.log('==',name,'sampleX='+sx);
  const scan=(ys,ye,step)=>{for(let y=ys;y!=ye;y+=step){const[r,g,b]=at(img,sx,y);const gold=r>135&&g>105&&r-b>28;console.log('y='+y,r,g,b,gold?'FRAME':'ocean');}};
  console.log('-- top --'); scan(0,90,4);
  console.log('-- bottom --'); scan(767,680,-4);
}
