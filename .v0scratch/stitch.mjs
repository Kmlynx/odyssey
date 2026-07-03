import sharp from 'sharp';
const w=await sharp('public/odyssey/map-west.png').toBuffer();
const e=await sharp('public/odyssey/map-east.png').toBuffer();
const meta=await sharp(w).metadata();
await sharp({create:{width:meta.width*2,height:meta.height,channels:4,background:{r:0,g:0,b:0,alpha:1}}})
 .composite([{input:w,left:0,top:0},{input:e,left:meta.width,top:0}])
 .png().toFile('.v0scratch/stitched.png');
console.log('ok');
