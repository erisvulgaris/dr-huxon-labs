import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
const OUT = '/home/z/my-project/public/ingredients';
const jobs = [
  { prompt: "Macro photography of golden yellow pea protein isolate powder, fine texture, scattered pea grains, dark charcoal background with warm golden side light, hyper-detailed, premium, scientific", out: `${OUT}/pea.png` },
  { prompt: "Macro photography of sprouted brown rice grains on dark charcoal slate with warm golden side light, premium, scientific, hyper-detailed", out: `${OUT}/rice.png` },
  { prompt: "Macro photography of vibrant turmeric curcumin powder and fresh turmeric root on dark charcoal slate with warm golden side light, premium, scientific, hyper-detailed", out: `${OUT}/curcumin.png` },
  { prompt: "Macro photography of dark red tart cherries on dark charcoal slate with warm crimson and golden side light, premium, scientific, hyper-detailed", out: `${OUT}/cherry.png` },
  { prompt: "Macro photography of deep emerald green spirulina powder with scattered spirulina flakes on dark charcoal slate with jade and golden side light, premium, scientific, hyper-detailed", out: `${OUT}/spirulina.png` },
  { prompt: "Macro photography of ashwagandha root and powder on dark charcoal slate with warm golden side light, premium, scientific, hyper-detailed", out: `${OUT}/ashwagandha.png` },
];
const zai = await ZAI.create();
for (const job of jobs) {
  if (fs.existsSync(job.out) && fs.statSync(job.out).size > 5000) { console.log(`SKIP ${job.out}`); continue; }
  for (let a = 1; a <= 3; a++) {
    try {
      console.log(`[${a}] ${job.out}`);
      const res = await zai.images.generations.create({ prompt: job.prompt, size: '1024x1024' as any });
      fs.writeFileSync(job.out, Buffer.from(res.data[0].base64, 'base64'));
      console.log(`  OK ${fs.statSync(job.out).size}b`);
      break;
    } catch (e: any) { console.error(`  FAIL ${e?.message?.slice(0,80)}`); await new Promise(r=>setTimeout(r,3000)); }
  }
}
console.log('INGREDIENTS DONE'); process.exit(0);
