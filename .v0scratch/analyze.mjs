import sharp from 'sharp';

async function scan(path, side) {
  const img = sharp(path);
  const meta = await img.metadata();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  console.log(path, width+'x'+height, 'ch='+channels);
  // sample a mid vertical range to avoid title/compass; average over middle rows
  const y0 = Math.floor(height*0.35), y1 = Math.floor(height*0.65);
  const colColor = (x) => {
    let r=0,g=0,b=0,n=0;
    for(let y=y0;y<y1;y++){const i=(y*width+x)*channels; r+=data[i];g+=data[i+1];b+=data[i+2];n++;}
    return [Math.round(r/n),Math.round(g/n),Math.round(b/n)];
  };
  // scan from inner edge inward
  const range = side==='right'
    ? [...Array(120).keys()].map(k=>width-1-k)
    : [...Array(120).keys()];
  for(const x of range.filter((_,idx)=>idx%4===0)){
    const [r,g,b]=colColor(x);
    // gold border: r>140 && g>110 && b<140 && r>b
    const gold = r>130 && g>100 && r-b>30;
    console.log(side, 'x='+x, r,g,b, gold?'GOLD':'water');
  }
}
await scan('public/odyssey/map-west.png','right');
console.log('----');
await scan('public/odyssey/map-east.png','left');
