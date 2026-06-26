import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

const OUT_PRODUCTS = '/home/z/my-project/public/products';
const OUT_INGREDIENTS = '/home/z/my-project/public/ingredients';
const OUT_BRAND = '/home/z/my-project/public/brand';

const jobs: { prompt: string; out: string; size: string }[] = [
  {
    prompt: "Premium product photography of a sleek graphite supplement tub with vibrant blood orange accent and gold metallic lid, minimalist label, citrus motifs, floating on dark charcoal background with warm orange and gold rim light, studio quality, hyper-detailed, pharmaceutical-grade",
    out: `${OUT_PRODUCTS}/pre-workout.png`,
    size: '1024x1024',
  },
  {
    prompt: "Premium product photography of a dark jade-green supplement tub with gold metallic lid, minimalist label, mint leaves and cucumber motifs, floating on dark charcoal background with jade and gold rim light, studio quality, hyper-detailed, pharmaceutical-grade, elegant",
    out: `${OUT_PRODUCTS}/daily-greens.png`,
    size: '1024x1024',
  },
  {
    prompt: "Premium product photography of stacked salted caramel protein bars wrapped in matte black kraft foil with gold foil accents, one bar unwrapped showing textured protein bar with caramel drizzle, floating on dark charcoal background with warm gold rim light, studio quality, hyper-detailed, pharmaceutical-grade",
    out: `${OUT_PRODUCTS}/protein-bars.png`,
    size: '1024x1024',
  },
  {
    prompt: "Premium product photography of a dark amber glass bottle of plant-based omega softgels with gold metallic cap and minimalist gold label, a few amber softgels spilling out, floating on dark charcoal background with warm golden rim light, studio quality, hyper-detailed, pharmaceutical-grade, elegant",
    out: `${OUT_PRODUCTS}/omega-plant.png`,
    size: '1024x1024',
  },
  {
    prompt: "Macro photography of golden yellow pea protein isolate powder, fine texture, scattered pea grains, dark charcoal background with warm golden side light, hyper-detailed, premium, scientific",
    out: `${OUT_INGREDIENTS}/pea.png`,
    size: '1024x1024',
  },
  {
    prompt: "Macro photography of sprouted brown rice grains on dark charcoal slate with warm golden side light, premium, scientific, hyper-detailed",
    out: `${OUT_INGREDIENTS}/rice.png`,
    size: '1024x1024',
  },
  {
    prompt: "Macro photography of vibrant turmeric curcumin powder and fresh turmeric root on dark charcoal slate with warm golden side light, premium, scientific, hyper-detailed",
    out: `${OUT_INGREDIENTS}/curcumin.png`,
    size: '1024x1024',
  },
  {
    prompt: "Macro photography of dark red tart cherries on dark charcoal slate with warm crimson and golden side light, premium, scientific, hyper-detailed",
    out: `${OUT_INGREDIENTS}/cherry.png`,
    size: '1024x1024',
  },
  {
    prompt: "Macro photography of deep emerald green spirulina powder with scattered spirulina flakes on dark charcoal slate with jade and golden side light, premium, scientific, hyper-detailed",
    out: `${OUT_INGREDIENTS}/spirulina.png`,
    size: '1024x1024',
  },
  {
    prompt: "Macro photography of ashwagandha root and powder on dark charcoal slate with warm golden side light, premium, scientific, hyper-detailed",
    out: `${OUT_INGREDIENTS}/ashwagandha.png`,
    size: '1024x1024',
  },
];

async function main() {
  const zai = await ZAI.create();
  for (const job of jobs) {
    if (fs.existsSync(job.out) && fs.statSync(job.out).size > 5000) {
      console.log(`SKIP ${job.out}`);
      continue;
    }
    let done = false;
    for (let attempt = 1; attempt <= 3 && !done; attempt++) {
      try {
        console.log(`[${attempt}] ${job.out}`);
        const res = await zai.images.generations.create({ prompt: job.prompt, size: job.size as any });
        fs.writeFileSync(job.out, Buffer.from(res.data[0].base64, 'base64'));
        console.log(`  OK ${fs.statSync(job.out).size}b`);
        done = true;
      } catch (e: any) {
        console.error(`  FAIL: ${e?.message || String(e).slice(0, 100)}`);
        await new Promise((r) => setTimeout(r, 3000));
      }
    }
  }
  console.log('ALL DONE');
  process.exit(0);
}
main().catch((e) => { console.error('FATAL', e); process.exit(1); });
