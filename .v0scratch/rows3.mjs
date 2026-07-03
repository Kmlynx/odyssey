import sharp from 'sharp';
async function load(p){const{data,info}=await sharp(p).ensureAlpha().raw().toBuffer({resolveWithObject:true});return{data,w:info.width,h:info.height,ch:info.channels};}
const at=(img,x,y)=>{const i=(y*img.w+x)*img.ch;return[img.data[i],img.data[i+1],img.data[i+2]];};
const img=await load('public/odyssey/map-west.png');
const sx=1230;
const gold=(r,g,b)=>r>140&&g>110&&r-b>30;
// top boundary
let yT=0;for(let y=0;y<200;y++){const[r,g,b]=at(img,sx,y);if(!gold(r,g,b)){yT=y;break;}}
let yB=img.h-1;for(let y=img.h-1;y>img.h-200;y--){const[r,g,b]=at(img,sx,y);if(!gold(r,g,b)){yB=y;break;}}
console.log('west ocean rows at x='+sx,'yT='+yT,'yB='+yB);
// print around boundaries
for(let y=yT-8;y<yT+8;y++){const[r,g,b]=at(img,sx,y);console.log('T y='+y,r,g,b,gold(r,g,b)?'F':'o');}
for(let y=yB-8;y<yB+8;y++){const[r,g,b]=at(img,sx,y);console.log('B y='+y,r,g,b,gold(r,g,b)?'F':'o');}
