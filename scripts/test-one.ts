import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

const zai = await ZAI.create();
const res = await zai.images.generations.create({
  prompt: "Premium matte black protein powder tub with brushed gold lid, minimalist gold foil label, floating on dark charcoal background with warm golden rim light, studio quality, pharmaceutical-grade, elegant",
  size: "1024x1024"
});
fs.writeFileSync("/home/z/my-project/public/products/gold-isolate.png", Buffer.from(res.data[0].base64, "base64"));
console.log("OK saved gold-isolate.png", fs.statSync("/home/z/my-project/public/products/gold-isolate.png").size, "bytes");
