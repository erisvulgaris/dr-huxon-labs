#!/bin/bash
# Generate each image in a separate bun process for robustness
cd /home/z/my-project

declare -A JOBS
# Format: "filename|prompt|size"
JOBS=(
  ["pre-workout.png"]="Premium product photography of a sleek graphite supplement tub with vibrant blood orange accent and gold metallic lid, minimalist label, citrus motifs, floating on dark charcoal background with warm orange + gold rim light, studio quality, hyper-detailed, pharmaceutical-grade|1024x1024"
  ["daily-greens.png"]="Premium product photography of a dark jade-green supplement tub with gold metallic lid, minimalist label, mint leaves and cucumber motifs, floating on dark charcoal background with jade + gold rim light, studio quality, hyper-detailed, pharmaceutical-grade, elegant|1024x1024"
  ["protein-bars.png"]="Premium product photography of stacked salted caramel protein bars wrapped in matte black kraft foil with gold foil accents, one bar unwrapped showing textured protein bar with caramel drizzle, floating on dark charcoal background with warm gold rim light, studio quality, hyper-detailed, pharmaceutical-grade|1024x1024"
  ["omega-plant.png"]="Premium product photography of a dark amber glass bottle of plant-based omega softgels with gold metallic cap and minimalist gold label, a few amber softgels spilling out, floating on dark charcoal background with warm golden rim light, studio quality, hyper-detailed, pharmaceutical-grade, elegant|1024x1024"
)

for key in pre-workout.png daily-greens.png protein-bars.png omega-plant.png; do
  OUT="/home/z/my-project/public/products/$key"
  if [ -f "$OUT" ] && [ $(stat -c%s "$OUT" 2>/dev/null || echo 0) -gt 5000 ]; then
    echo "SKIP $key (exists)"
    continue
  fi
  IFS='|' read -r PROMPT SIZE <<< "${JOBS[$key]}"
  echo "Generating $key..."
  timeout 120 bun -e "
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
const zai = await ZAI.create();
const res = await zai.images.generations.create({ prompt: process.argv[2], size: process.argv[3] });
fs.writeFileSync(process.argv[4], Buffer.from(res.data[0].base64, 'base64'));
console.log('OK', process.argv[4]);
" "$PROMPT" "$SIZE" "$OUT" 2>&1 | tail -3
done
echo "PRODUCTS DONE"
