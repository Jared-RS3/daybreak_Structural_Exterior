# Estimator photo prompts

Image-generation prompts for photographic versions of the instant repair estimator's "look inside" frames ([RepairEstimator.tsx](../src/components/tools/RepairEstimator.tsx), data in [estimator.ts](../src/lib/estimator.ts)). The house-selection screen stays the vector cutaway; these photos are for what opens after a homeowner clicks Foundation, Basement, Crawl space and the rest.

There are two sets:

- **Problem photos (62), sections 1–6.** One problem per photo, made to work as a click target ("which of these looks like yours?"). Each one lists the repair it prices as: an `id` from `categories` in `estimator.ts`.
- **Area scenes (6), appendix.** One photo per area showing several problems at once, for the current hotspot layout (`sceneImages`). Drop-in for today's UI, but harder to generate: see the note there.

## Rules for the whole set

**Format.** 16:9 landscape, 2400 px wide or more, saved as `public/images/estimator/<image name>.jpg`. The estimator frame is 1000 × 560 and crops with `object-cover`, so nothing important should sit in the top or bottom 5%. If a model only offers 3:2, generate 3:2 and crop to 16:9 from the middle.

**Camera and light.** Every prompt ends with one of four fixed paragraphs: outdoors, basement, crawl space or living space. Don't edit them. They are what makes 62 separate generations look like one professional shoot.

**Consistency.** Generate one image per section first, pick the best, and give it to the rest of that section as a style reference (Midjourney `--sref`, or the reference-image input in other tools).

**Variety.** The house, region, brick, siding, colors, and block or poured walls change from prompt to prompt on purpose. Keep those details when you regenerate.

**Click targets.** The problem sits near the middle of the frame and is big enough to read at thumbnail size. Each prompt names one calm area for labels and overlays.

**Negative prompt**, for tools that take one:

> text, letters, numbers, watermark, logo, signage, people, hands, arrows, labels, measuring tape, illustration, 3D render, CGI, cartoon, painting, oversaturated, HDR, fisheye, vignette, tilt-shift, dramatic sky, horror lighting, rubble, disaster, collapse

**Midjourney:** append `--ar 16:9 --style raw`.

**Prices-as notes.** Several photos price as the same repair, which is expected. Four don't map exactly: `basement-mold` prices as `interior-drain` (the estimator has no mold item; the drain fixes the cause); `concrete-heaving` prices as `slab-lift`, though a heaved slab is usually ground down or replaced rather than lifted; and `crawl-encapsulated` and `framing-sistered-joists` show a finished repair rather than a problem, as "after" pictures.

---

## 1. Foundation

From outside the house, as a homeowner walking around it would see it. The one exception, `foundation-bowing-wall`, is a dug-out view, matching the cutaway drawing in the current foundation scene.

### foundation-vertical-crack

- **What to notice:** one thin vertical crack running from the top of the concrete foundation down into the soil, just below a basement window.
- **Prices as:** `foam-injection`

**Prompt**

> Exterior photograph of the side of a two-story colonial house in the US Midwest, pale yellow vinyl lap siding above a light-gray poured concrete foundation that shows about two feet above the ground. The foundation has the faint grid of round patched form-tie holes typical of poured walls. Directly below the corner of a small basement window with a galvanized window well, a single vertical crack runs from the top of the foundation straight down into the soil: a hairline at the bottom, about 1/8 inch wide at the top, with slightly darker, dirt-filled edges. A tidy bed of dark brown mulch and two hostas along the base. The camera faces the wall square-on from about 6 feet away at waist height, so the crack sits just left of center and fills most of the frame's height; keep the siding in the upper right plain and uncluttered for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 35mm lens, f/8, everything in sharp focus. Soft, even daylight under a light high overcast, no harsh shadows. Neutral, true-to-life color and natural contrast; no HDR look, no vignette, no dramatic sky, no color grading. Photorealistic, with real-world weathering and texture. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### foundation-horizontal-crack

- **What to notice:** a long horizontal crack along the foundation just above the ground, its two sides no longer lining up.
- **Prices as:** `wall-anchors`

**Prompt**

> Exterior photograph of the base of a split-level house with charcoal-gray vinyl siding, sitting on a concrete-block foundation finished with a smooth gray cement parging coat that shows about 20 inches above the ground. A long horizontal crack runs through the parging about 10 inches above the soil, crossing almost the full width of the frame; the two sides of the crack no longer line up, leaving a small visible ledge of about 1/4 inch, and a few flakes of parging have fallen onto the pea-gravel bed beneath. A trimmed boxwood at the far right edge. The camera is at knee height, about 5 feet from the wall and turned slightly along it, so the crack reads as one continuous line across the middle of the image; keep the siding in the upper third plain for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 35mm lens, f/8, everything in sharp focus. Soft, even daylight under a light high overcast, no harsh shadows. Neutral, true-to-life color and natural contrast; no HDR look, no vignette, no dramatic sky, no color grading. Photorealistic, with real-world weathering and texture. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### foundation-stair-step-brick

- **What to notice:** a crack that zigzags down through the mortar like a staircase, from a window corner toward the ground.
- **Prices as:** `push-piers`

**Prompt**

> Exterior photograph of a single-story red brick ranch house in the US South, warm red-brown brick with light gray mortar and white-painted wood window trim. From the lower corner of a double-hung window, a stair-step crack runs diagonally down and to the right through the mortar joints toward the ground, stepping one brick at a time: about 1/4 inch open near the window, narrowing to a hairline at the bottom, with two bricks along its path split cleanly through. Below, a short band of exposed concrete foundation and a strip of pine straw. The camera faces the wall square-on from about 7 feet away at chest height; the crack runs through the center of the frame, with the plain brick to its right kept clear for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 35mm lens, f/8, everything in sharp focus. Soft, even daylight under a light high overcast, no harsh shadows. Neutral, true-to-life color and natural contrast; no HDR look, no vignette, no dramatic sky, no color grading. Photorealistic, with real-world weathering and texture. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### foundation-bowing-wall

- **What to notice:** the outside of the foundation wall, dug out, curving inward, with a horizontal crack along the deepest part of the bend.
- **Prices as:** `wall-anchors`

**Prompt**

> Exterior photograph down into a neat excavation trench about 3 feet deep and 2 feet wide, dug along the side of a house with light gray vinyl siding, exposing the outer face of a concrete-block foundation wall below ground. The block is damp and darkened, with patches of old black tar damp-proofing. The wall visibly bows inward: its face curves away from the camera toward the middle of the trench, so the straight line of siding above overhangs it more and more, and a continuous horizontal crack runs along a mortar joint at the deepest point of the bow. Clean-cut soil sides, a tidy pile of excavated soil on a tarp on the lawn at the edge of the frame, no tools. The camera stands at one end of the trench at chest height looking along the wall, so the curve reads clearly against the straight siding line; keep the lawn in the upper right quiet for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 35mm lens, f/8, everything in sharp focus. Soft, even daylight under a light high overcast, no harsh shadows. Neutral, true-to-life color and natural contrast; no HDR look, no vignette, no dramatic sky, no color grading. Photorealistic, with real-world weathering and texture. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### foundation-settlement

- **What to notice:** a crack in the foundation that's wider at the top than the bottom, with one side sitting lower than the other.
- **Prices as:** `push-piers`

**Prompt**

> Exterior photograph of a craftsman bungalow with sage-green fiber-cement lap siding and white trim, on a warm-gray poured concrete foundation showing about 18 inches above the ground. A tapered vertical crack runs through the foundation near the middle of the wall: about 3/8 inch wide at the top, closing to a hairline where it meets the soil, and the concrete on its right side has dropped about 1/4 inch, leaving a visible step across the top edge of the foundation. The siding boards directly above dip very slightly toward the right. Dark mulch with low ornamental grasses. The camera faces the wall square-on from about 6 feet away at waist height; the crack sits in the center of the frame, with the plain siding above it kept clear for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 35mm lens, f/8, everything in sharp focus. Soft, even daylight under a light high overcast, no harsh shadows. Neutral, true-to-life color and natural contrast; no HDR look, no vignette, no dramatic sky, no color grading. Photorealistic, with real-world weathering and texture. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### foundation-sinking-corner

- **What to notice:** one corner of the house has dropped: cracks fan out from it, and the ground there has washed away under a downspout.
- **Prices as:** `helical-piers`

**Prompt**

> Exterior photograph of the front corner of a two-story house in Texas built of buff tan brick with cream mortar. The corner is visibly sinking: diagonal stair-step cracks fan up and away from the corner on both brick faces, a wedge-shaped gap wider at the top has opened in the mortar near the corner, and the bottom of the brick corner sits slightly below the line of the adjacent foundation. A downspout at the corner discharges straight onto bare, eroded soil, which has washed away into a shallow hollow against the foundation. Lawn and a crepe myrtle in the background. The camera looks at the corner from 45 degrees at chest height, about 10 feet away, with the corner just left of center; keep the plain brick face on the right calm for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 35mm lens, f/8, everything in sharp focus. Soft, even daylight under a light high overcast, no harsh shadows. Neutral, true-to-life color and natural contrast; no HDR look, no vignette, no dramatic sky, no color grading. Photorealistic, with real-world weathering and texture. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### foundation-wall-gap

- **What to notice:** a dark gap has opened between the bottom of the house and the top of the concrete foundation.
- **Prices as:** `push-piers`

**Prompt**

> Close exterior photograph of the base of a Cape Cod house with blue-gray lap siding and white trim, on a poured concrete foundation. A continuous dark horizontal gap has opened between the bottom of the siding, with the wood sill plate behind it, and the top of the foundation: about 3/4 inch wide at the left of the frame and narrowing to nothing at the right, deep enough that the edge of the wood sill plate and the corner of an anchor-bolt nut are just visible in the shadow. A few cobwebs and a little dirt in the gap, nothing dramatic. The camera is at knee height about 3 feet away, looking slightly along the wall so the taper reads clearly; the gap runs across the middle of the frame, with the siding above kept plain for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 35mm lens, f/8, everything in sharp focus. Soft, even daylight under a light high overcast, no harsh shadows. Neutral, true-to-life color and natural contrast; no HDR look, no vignette, no dramatic sky, no color grading. Photorealistic, with real-world weathering and texture. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### foundation-water-intrusion

- **What to notice:** rain water pooling against the foundation, soaking the concrete and running into a crack at ground level.
- **Prices as:** `interior-drain`

**Prompt**

> Exterior photograph just after rain at the side of a white-painted brick colonial house on a gray poured concrete foundation. A black downspout ends at the foundation with no extension, and the soil slopes toward the house, so a shallow puddle has formed against the wall. The foundation concrete is darkened with water to about 8 inches above the ground, and a short crack at ground level has a wet, dark halo where water is running in. A galvanized basement window well to the right holds a little standing water. Wet mulch and soil, everything glistening but calm, no storm. The camera is at waist height, 6 feet from the wall, with the puddle and the wet crack in the center of the frame; keep the white brick in the upper third plain for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 35mm lens, f/8, everything in sharp focus. Soft, even daylight under a light high overcast, no harsh shadows. Neutral, true-to-life color and natural contrast; no HDR look, no vignette, no dramatic sky, no color grading. Photorealistic, with real-world weathering and texture. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### foundation-cracked-footing

- **What to notice:** soil washed away from a corner exposes the concrete footing, and a crack runs down the wall and straight through the footing.
- **Prices as:** `push-piers`

**Prompt**

> Exterior photograph of the back corner of a white board-and-batten modern farmhouse on a sloping lot in Tennessee. Erosion has washed the soil away from the corner, exposing the gray concrete-block foundation wall and, at its base, the poured concrete footing as a rough ledge about 8 inches tall. A crack runs down through the block wall's mortar joints and continues straight through the footing below, where the footing has dropped slightly and a small dark void has opened in the soil beneath it. Exposed roots and red clay soil, a lawn running downhill. The camera is low, about 4 feet from the corner, looking slightly down so the footing and the crack through it fill the center of the frame; keep the white siding at the top calm for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 35mm lens, f/8, everything in sharp focus. Soft, even daylight under a light high overcast, no harsh shadows. Neutral, true-to-life color and natural contrast; no HDR look, no vignette, no dramatic sky, no color grading. Photorealistic, with real-world weathering and texture. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

---

## 2. Basement

Inside unfinished basements, mostly. Walls alternate between poured concrete, gray block, painted block and older block so the set doesn't repeat.

### basement-vertical-crack

- **What to notice:** a single vertical crack running down a poured concrete basement wall from the ceiling to the floor.
- **Prices as:** `foam-injection`

**Prompt**

> Interior photograph of an unfinished basement in a newer US suburban house: a light-gray poured concrete wall with the regular grid of small round form-tie marks, exposed wood floor joists and the sill plate along the top, a bare concrete floor. A single vertical crack runs from the top of the wall near the sill plate down to the floor: a hairline in places and up to about 1/16 inch wide, with faint darker edges but no active water. A small hopper window high on the wall to the left. The camera faces the wall square-on from about 8 feet away at chest height, the crack just right of center and running the full height of the frame; keep the plain concrete on the left calm for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 24mm lens, f/8, deep focus, no fisheye distortion. Light from a small basement window plus a neutral-white overhead LED shop light; evenly exposed with the problem well lit, neutral color with no green or yellow cast; no HDR look, no vignette, no dark horror mood. Photorealistic concrete, masonry and lumber textures. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### basement-horizontal-crack

- **What to notice:** a long horizontal crack along a mortar line across the block wall, about a third of the way down.
- **Prices as:** `wall-anchors`

**Prompt**

> Interior photograph of an unfinished basement with a gray concrete-block wall laid in running bond with gray mortar joints, wood joists above and a bare concrete floor. A long horizontal crack runs along one mortar joint four courses down from the top of the wall, crossing almost its full width; the wall is pushed very slightly inward at the crack, so it casts a thin shadow line along its length. A few crumbs of mortar on the floor at the base. The camera faces the wall from about 10 feet away at chest height, slightly angled along it, so the crack reads as one continuous line across the middle of the frame; keep the lower blocks plain for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 24mm lens, f/8, deep focus, no fisheye distortion. Light from a small basement window plus a neutral-white overhead LED shop light; evenly exposed with the problem well lit, neutral color with no green or yellow cast; no HDR look, no vignette, no dark horror mood. Photorealistic concrete, masonry and lumber textures. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### basement-stair-step-crack

- **What to notice:** a zigzag crack stepping down through the mortar of a painted block wall from a window corner.
- **Prices as:** `push-piers`

**Prompt**

> Interior photograph of an unfinished basement with a concrete-block wall painted bright white with masonry paint, slightly scuffed, and a small hopper window high in the wall. From the lower corner of the window, a stair-step crack runs diagonally down and to the left through the mortar joints, one block at a time, about 1/8 inch open and showing dark against the white paint, with a few paint flakes curling at its edges. Exposed joists above, a gray concrete floor below, a plastic storage tote at the far edge of the frame. The camera faces the wall from about 8 feet away at chest height, with the crack running through the center of the frame; keep the plain white blocks on the right calm for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 24mm lens, f/8, deep focus, no fisheye distortion. Light from a small basement window plus a neutral-white overhead LED shop light; evenly exposed with the problem well lit, neutral color with no green or yellow cast; no HDR look, no vignette, no dark horror mood. Photorealistic concrete, masonry and lumber textures. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### basement-efflorescence

- **What to notice:** white, powdery, crusty staining on the lower part of the basement wall.
- **Prices as:** `wall-liner`

**Prompt**

> Interior photograph of an older unfinished basement with a concrete-block wall once painted pale gray with waterproofing paint, now blistered and peeling. Across the lower three feet of the wall, white chalky efflorescence has bloomed out of the mortar joints and through the paint: fuzzy, powdery, crystalline white deposits, thickest along the joints and at the base, with a dusting of white powder on the concrete floor where it meets the wall. The upper wall is cleaner. The camera faces the wall from about 6 feet away at waist height, with the white staining filling the center and lower half of the frame; keep the upper wall calm for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 24mm lens, f/8, deep focus, no fisheye distortion. Light from a small basement window plus a neutral-white overhead LED shop light; evenly exposed with the problem well lit, neutral color with no green or yellow cast; no HDR look, no vignette, no dark horror mood. Photorealistic concrete, masonry and lumber textures. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### basement-damp-wall

- **What to notice:** the bottom of the wall is dark and wet, with an uneven water line about two feet up.
- **Prices as:** `wall-liner`

**Prompt**

> Interior photograph of an unfinished basement with a warm-gray poured concrete wall and a bare concrete floor. The lower part of the wall is visibly damp: a dark, slightly glistening band rises about two feet from the floor with an uneven, wavy upper edge and darker blotches within it, and the floor along the wall is darkened by moisture. Above the band the concrete is dry and pale. A metal utility shelf at the far edge of the frame. The camera faces the wall from about 8 feet away at waist height, angled slightly along it, so the damp band runs across the lower middle of the frame; keep the dry upper wall plain for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 24mm lens, f/8, deep focus, no fisheye distortion. Light from a small basement window plus a neutral-white overhead LED shop light; evenly exposed with the problem well lit, neutral color with no green or yellow cast; no HDR look, no vignette, no dark horror mood. Photorealistic concrete, masonry and lumber textures. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### basement-crack-seeping

- **What to notice:** water running out of a crack in the wall and down to a small puddle on the floor.
- **Prices as:** `foam-injection`

**Prompt**

> Interior photograph of an unfinished basement with a light-gray poured concrete wall and a concrete floor. A vertical crack runs down the wall from about head height, and water is actively seeping from its lower half: a thin, glistening trickle runs down the wall face, a dark wet streak spreads about 6 inches either side of the crack, and a small clear puddle spreads on the floor at its base. The rest of the wall is dry. The camera is at waist height about 5 feet away, with the wet crack slightly left of center and filling the frame's height; keep the dry wall to the right calm for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 24mm lens, f/8, deep focus, no fisheye distortion. Light from a small basement window plus a neutral-white overhead LED shop light; evenly exposed with the problem well lit, neutral color with no green or yellow cast; no HDR look, no vignette, no dark horror mood. Photorealistic concrete, masonry and lumber textures. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### basement-cove-joint-seepage

- **What to notice:** a wet line all along the bottom of the wall, where water is coming in between the wall and the floor.
- **Prices as:** `interior-drain`

**Prompt**

> Interior photograph of an unfinished basement with a tan concrete-block wall on a gray concrete floor. Along the joint where the wall meets the floor, water is seeping in: a continuous dark wet line runs the full length of the joint, and a thin glistening film of water spreads 1 to 2 feet out across the floor, reflecting the light, with faint silt marks at its edge. The wall above is dry. The camera is low, at about knee height, looking along the wall at a shallow angle so the wet joint runs from the foreground into the distance through the center of the frame; keep the upper wall calm for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 24mm lens, f/8, deep focus, no fisheye distortion. Light from a small basement window plus a neutral-white overhead LED shop light; evenly exposed with the problem well lit, neutral color with no green or yellow cast; no HDR look, no vignette, no dark horror mood. Photorealistic concrete, masonry and lumber textures. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### basement-small-puddle

- **What to notice:** a small puddle of standing water on the basement floor near the wall.
- **Prices as:** `sump-pump`

**Prompt**

> Interior photograph of an unfinished basement with a gray concrete-block wall and a smooth, slightly worn gray concrete floor. A small puddle of clear standing water, about 3 feet across with an irregular edge, sits on the floor near the base of the wall, reflecting a small hopper window above it; a faint dried water ring around it shows where it has been before. The rest of the floor is dry and clean. The camera is at waist height about 8 feet away, looking slightly down, with the puddle in the center of the frame; keep the wall in the upper third calm for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 24mm lens, f/8, deep focus, no fisheye distortion. Light from a small basement window plus a neutral-white overhead LED shop light; evenly exposed with the problem well lit, neutral color with no green or yellow cast; no HDR look, no vignette, no dark horror mood. Photorealistic concrete, masonry and lumber textures. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### basement-flooded-floor

- **What to notice:** the whole basement floor covered in a couple of inches of water.
- **Prices as:** `sump-pump`

**Prompt**

> Interior photograph of an unfinished basement with painted gray concrete-block walls, and a gas furnace and a water heater along the back wall. About 2 inches of clear, still water covers the entire concrete floor from wall to wall, reflecting the joists and the light; the bases of the furnace, the water heater and a metal shelving unit stand in it. The cardboard boxes on the shelf are dry; nothing is floating and nothing is destroyed. The camera is at chest height from the foot of the stairs, looking across the room, with the flooded floor filling the lower two-thirds of the frame; keep the upper wall calm for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 24mm lens, f/8, deep focus, no fisheye distortion. Light from a small basement window plus a neutral-white overhead LED shop light; evenly exposed with the problem well lit, neutral color with no green or yellow cast; no HDR look, no vignette, no dark horror mood. Photorealistic concrete, masonry and lumber textures. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### basement-sump-pit

- **What to notice:** an old sump pump in an open pit in the floor, water close to the top, and no backup.
- **Prices as:** `sump-pump` (also fits `battery-backup`)

**Prompt**

> Interior photograph of the corner of an unfinished basement with gray concrete-block walls. In the floor sits an open round sump pit with a black plastic liner, its lid set aside, with water standing about 4 inches below the rim. An older, rust-stained submersible pump with a float switch sits in the water; a white PVC discharge pipe with a check valve rises from it up the wall to the rim joist, and the pump's cord is plugged into a single wall outlet. The concrete around the pit is stained and slightly damp. The camera is at chest height about 5 feet away, looking down at 45 degrees, with the pit in the center of the frame; keep the wall above calm for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 24mm lens, f/8, deep focus, no fisheye distortion. Light from a small basement window plus a neutral-white overhead LED shop light; evenly exposed with the problem well lit, neutral color with no green or yellow cast; no HDR look, no vignette, no dark horror mood. Photorealistic concrete, masonry and lumber textures. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### basement-bowed-wall

- **What to notice:** the basement wall curving inward, with a long horizontal crack where it bends.
- **Prices as:** `wall-anchors`

**Prompt**

> Interior photograph of an unfinished basement with a long gray concrete-block wall. The wall visibly bows inward toward the room: a horizontal crack runs along a mortar joint at about mid-height for most of the wall's length, the blocks at the crack are pushed in about 2 inches at the center, and short diagonal stair-step cracks run from each end of the horizontal crack toward the corners. Soft light from a window at the far end rakes along the wall and shows the curve. The camera stands near one corner at chest height looking down the length of the wall, so the bow reads clearly as a curve against the straight floor and joist lines; keep the floor in the lower foreground calm for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 24mm lens, f/8, deep focus, no fisheye distortion. Light from a small basement window plus a neutral-white overhead LED shop light; evenly exposed with the problem well lit, neutral color with no green or yellow cast; no HDR look, no vignette, no dark horror mood. Photorealistic concrete, masonry and lumber textures. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### basement-mold

- **What to notice:** black and green mold spots and a brown water line along the bottom of a finished basement wall.
- **Prices as:** `interior-drain`

**Prompt**

> Interior photograph of a partly finished basement: a framed wall with painted off-white drywall and a white baseboard on a gray concrete floor. Along the bottom 18 inches of the drywall, black and dark green mold spots spread in clusters below a wavy brown water tide-line; the baseboard is swollen and slightly lifted, and the paper face of the drywall is stained and bubbled. The rest of the wall is clean. A wooden staircase is partly visible at the edge of the frame. The camera faces the wall from about 6 feet away at waist height, with the mold band across the center of the lower frame; keep the upper wall calm for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 24mm lens, f/8, deep focus, no fisheye distortion. Light from a small basement window plus a neutral-white overhead LED shop light; evenly exposed with the problem well lit, neutral color with no green or yellow cast; no HDR look, no vignette, no dark horror mood. Photorealistic concrete, masonry and lumber textures. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

---

## 3. Crawl space

Vented crawl spaces about 30 inches high, shot low, as an inspector would. Walls alternate between block and brick, and the floors between bare soil and old plastic.

### crawl-damp

- **What to notice:** everything under the house is damp: wet dark soil, water beads on the ductwork, insulation sagging from the floor.
- **Prices as:** `dehumidifier`

**Prompt**

> Interior photograph of a vented crawl space under a 1980s house in North Carolina, with about 30 inches of clearance: a dark, damp, compacted soil floor with no vapor barrier, concrete-block perimeter walls with a small open foundation vent letting in daylight, and wood floor joists overhead. Moisture is everywhere: beads of condensation along a round metal supply duct, fiberglass insulation batts sagging and hanging out from between the joists, faint white mineral staining on a block pier, dark moisture stains on the joists. The camera looks into the crawl space along the duct, which leads from the foreground toward the center of the frame; keep the soil in the lower left calm for interface overlays. Photographed as a professional crawl-space inspection photo on a full-frame camera with a 20mm lens held low, f/8, deep focus, no fisheye distortion. Lit by a neutral-white LED work light placed out of frame, bright and even on the problem and falling off naturally toward the far corners, with a little daylight from a foundation vent. Neutral color with no green or blue cast, no horror mood. Photorealistic soil, masonry and lumber textures. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### crawl-standing-water

- **What to notice:** a wide puddle of standing water on the ground under the house.
- **Prices as:** `crawl-drain`

**Prompt**

> Interior photograph of a vented crawl space with brick support piers, concrete-block perimeter walls and wood floor joists about 30 inches above the ground. A wide sheet of standing water about 6 feet across covers the dirt floor in a low area between two piers, still and slightly muddy, reflecting the joists and the light; the soil around its edge is dark and saturated. The camera is low, close to the ground, looking across the puddle, which fills the center and lower half of the frame; keep the joists in the upper third calm for interface overlays. Photographed as a professional crawl-space inspection photo on a full-frame camera with a 20mm lens held low, f/8, deep focus, no fisheye distortion. Lit by a neutral-white LED work light placed out of frame, bright and even on the problem and falling off naturally toward the far corners, with a little daylight from a foundation vent. Neutral color with no green or blue cast, no horror mood. Photorealistic soil, masonry and lumber textures. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### crawl-sagging-joists

- **What to notice:** several floor joists bending down in the middle.
- **Prices as:** `sister-joists`

**Prompt**

> Interior photograph of a crawl space with a dirt floor covered by old clear plastic, block perimeter walls and a run of 2x8 wood floor joists overhead. Four adjacent joists visibly sag: their bottom edges curve down by about an inch near mid-span between the perimeter wall and the main wood beam, clearly out of line with the straight top of the block wall in the background, and the subfloor above follows the dip. The wood is dry but aged and gray-brown. The camera is low, looking along the length of the joists so the curve of their bottom edges reads clearly through the center of the frame; keep the plastic-covered floor in the lower foreground calm for interface overlays. Photographed as a professional crawl-space inspection photo on a full-frame camera with a 20mm lens held low, f/8, deep focus, no fisheye distortion. Lit by a neutral-white LED work light placed out of frame, bright and even on the problem and falling off naturally toward the far corners, with a little daylight from a foundation vent. Neutral color with no green or blue cast, no horror mood. Photorealistic soil, masonry and lumber textures. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### crawl-damaged-joists

- **What to notice:** joists eaten away by termites, with mud tubes climbing the wall to them.
- **Prices as:** `sister-joists`

**Prompt**

> Interior photograph of a crawl space under an older house in Georgia: a dirt floor, a concrete-block perimeter wall, and wood joists resting on a wood sill plate on top of the wall. Termites have damaged the wood: two joist ends and the sill plate are hollowed out in layers, with tunnels following the grain and dried mud packed into them, and several pencil-thick brown mud tubes climb the block wall from the soil up to the wood. Crumbs of wood debris on the soil. No insects visible. The camera is low, about 3 feet from the wall, with the damaged joist ends and mud tubes in the center of the frame; keep the soil in the lower foreground calm for interface overlays. Photographed as a professional crawl-space inspection photo on a full-frame camera with a 20mm lens held low, f/8, deep focus, no fisheye distortion. Lit by a neutral-white LED work light placed out of frame, bright and even on the problem and falling off naturally toward the far corners, with a little daylight from a foundation vent. Neutral color with no green or blue cast, no horror mood. Photorealistic soil, masonry and lumber textures. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### crawl-rotting-wood

- **What to notice:** dark, crumbling, rotten wood where the house sits on its foundation, next to a vent.
- **Prices as:** `rim-joist`

**Prompt**

> Interior photograph of a crawl space under a 1960s house: a concrete-block perimeter wall with a small rusted metal foundation vent, and on top of the wall the wood sill plate and rim joist. Around the vent the wood has rotted: dark brown, split into small cube-shaped cracks, soft and crumbling at the edges, with patches of white fungal growth and wood crumbs fallen onto the damp soil below. The wood further from the vent is sound. The camera is low, about 4 feet from the wall, with the rotted section in the center of the frame; keep the soil below calm for interface overlays. Photographed as a professional crawl-space inspection photo on a full-frame camera with a 20mm lens held low, f/8, deep focus, no fisheye distortion. Lit by a neutral-white LED work light placed out of frame, bright and even on the problem and falling off naturally toward the far corners, with a little daylight from a foundation vent. Neutral color with no green or blue cast, no horror mood. Photorealistic soil, masonry and lumber textures. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### crawl-mold-joists

- **What to notice:** fuzzy white mold and black spots covering the wooden joists and the underside of the floor.
- **Prices as:** `encapsulation`

**Prompt**

> Interior photograph looking up and across the floor framing of a vented crawl space: rows of wood joists with the plywood subfloor between them. Across several joist bays, mold has spread: fuzzy white patches and dense black speckling on the sides of the joists and on the subfloor, thickest near the middle of the frame, with water-stain rings on the plywood. Fiberglass insulation has fallen out of these bays. The camera is low, angled upward at about 30 degrees, with the moldy joists filling the center of the frame; keep the cleaner bays on the right calm for interface overlays. Photographed as a professional crawl-space inspection photo on a full-frame camera with a 20mm lens held low, f/8, deep focus, no fisheye distortion. Lit by a neutral-white LED work light placed out of frame, bright and even on the problem and falling off naturally toward the far corners, with a little daylight from a foundation vent. Neutral color with no green or blue cast, no horror mood. Photorealistic soil, masonry and lumber textures. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### crawl-failing-pier

- **What to notice:** a support pier of stacked blocks, cracked and tilting, no longer holding the beam up properly.
- **Prices as:** `support-posts`

**Prompt**

> Interior photograph of a crawl space with a dirt floor and a wood main beam carried on piers of stacked concrete blocks. One pier in the center of the frame is failing: its blocks are stacked dry with no mortar, the middle block is cracked through, the stack leans a few degrees, the small concrete pad under it has sunk and cracked into the soil, and the crushed wood shims at the top leave a gap of about half an inch between the pier and the beam. A sound pier stands in the background for comparison. The camera is low, about 5 feet away, square-on to the failing pier; keep the soil in the lower left calm for interface overlays. Photographed as a professional crawl-space inspection photo on a full-frame camera with a 20mm lens held low, f/8, deep focus, no fisheye distortion. Lit by a neutral-white LED work light placed out of frame, bright and even on the problem and falling off naturally toward the far corners, with a little daylight from a foundation vent. Neutral color with no green or blue cast, no horror mood. Photorealistic soil, masonry and lumber textures. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### crawl-leaning-column

- **What to notice:** a metal support post standing on bare dirt, leaning badly under the beam.
- **Prices as:** `support-posts`

**Prompt**

> Interior photograph of a crawl space with a dirt floor, block perimeter walls in the background and a wood main beam overhead. In the center of the frame, a rusty adjustable steel jack post holds up the beam, but it stands on a single loose concrete paver set directly on soft soil, and it leans about 10 degrees out of plumb; the paver has tipped and sunk on one side, and the post's top plate has slid along the underside of the beam. The camera is low, about 5 feet away, square-on so the lean reads against the vertical lines of the block wall behind; keep the soil in the lower right calm for interface overlays. Photographed as a professional crawl-space inspection photo on a full-frame camera with a 20mm lens held low, f/8, deep focus, no fisheye distortion. Lit by a neutral-white LED work light placed out of frame, bright and even on the problem and falling off naturally toward the far corners, with a little daylight from a foundation vent. Neutral color with no green or blue cast, no horror mood. Photorealistic soil, masonry and lumber textures. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### crawl-damaged-vapor-barrier

- **What to notice:** the plastic sheet on the crawl space floor torn and bunched up, with bare dirt and puddles showing through.
- **Prices as:** `encapsulation`

**Prompt**

> Interior photograph of a vented crawl space with block perimeter walls and wood joists overhead. The floor is covered by an old, thin white plastic vapor barrier that has failed: it is torn in long rips, bunched and pushed aside, with wide patches of damp bare soil showing through, small puddles sitting on top of the plastic, and loose edges curled away from the walls. The camera is low, about knee height, looking across the floor toward the far wall, with the torn plastic filling the center and lower half of the frame; keep the joists in the upper third calm for interface overlays. Photographed as a professional crawl-space inspection photo on a full-frame camera with a 20mm lens held low, f/8, deep focus, no fisheye distortion. Lit by a neutral-white LED work light placed out of frame, bright and even on the problem and falling off naturally toward the far corners, with a little daylight from a foundation vent. Neutral color with no green or blue cast, no horror mood. Photorealistic soil, masonry and lumber textures. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### crawl-missing-vapor-barrier

- **What to notice:** bare, damp dirt across the whole crawl space floor, with nothing covering it.
- **Prices as:** `encapsulation`

**Prompt**

> Interior photograph of a vented crawl space under a brick ranch house: brick perimeter foundation walls, two brick support piers, and wood joists about 30 inches above the ground. The floor is entirely bare earth with no vapor barrier at all: damp, dark brown soil, uneven and slightly muddy in places, with a few scraps of old lumber and a darker damp ring around the base of each pier. The camera is low, looking across the full width of the crawl space, with the bare ground filling the lower two-thirds of the frame; keep the upper left calm for interface overlays. Photographed as a professional crawl-space inspection photo on a full-frame camera with a 20mm lens held low, f/8, deep focus, no fisheye distortion. Lit by a neutral-white LED work light placed out of frame, bright and even on the problem and falling off naturally toward the far corners, with a little daylight from a foundation vent. Neutral color with no green or blue cast, no horror mood. Photorealistic soil, masonry and lumber textures. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### crawl-drainage-issue

- **What to notice:** rain water coming in at the bottom of the foundation wall and running across the dirt to a muddy low corner.
- **Prices as:** `crawl-drain`

**Prompt**

> Interior photograph of a crawl space after rain: a concrete-block perimeter wall, a dirt floor, wood joists overhead. Water has been coming in at the base of the block wall: a muddy silt line stains the lower 3 inches of the blocks, a shallow channel has eroded across the soil from the wall toward a low corner, and a muddy pool of water has collected in that corner, with fan-shaped silt deposits along its edges. The camera is low, about 6 feet from the wall, with the eroded channel running diagonally through the center of the frame into the pooled corner; keep the joists in the upper third calm for interface overlays. Photographed as a professional crawl-space inspection photo on a full-frame camera with a 20mm lens held low, f/8, deep focus, no fisheye distortion. Lit by a neutral-white LED work light placed out of frame, bright and even on the problem and falling off naturally toward the far corners, with a little daylight from a foundation vent. Neutral color with no green or blue cast, no horror mood. Photorealistic soil, masonry and lumber textures. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### crawl-encapsulated

- **What to notice:** for comparison, a clean, dry crawl space sealed in white liner, with a dehumidifier.
- **Prices as:** `encapsulation` (the "after" picture)

**Prompt**

> Interior photograph of a professionally encapsulated crawl space: a thick white reinforced polyethylene liner covers the whole floor and runs up the block perimeter walls, with neatly taped seams and the liner wrapped tightly around the support piers. The foundation vents are sealed shut, the rim joists are covered with closed-cell spray foam, and a compact crawl-space dehumidifier sits on the liner with its drain line running along the floor. The wood joists overhead are clean, dry and pale. Bright and orderly. The camera is low, looking down the length of the crawl space, with the white liner leading toward the center of the frame; keep the liner in the lower foreground calm for interface overlays. Photographed as a professional crawl-space inspection photo on a full-frame camera with a 20mm lens held low, f/8, deep focus, no fisheye distortion. Lit by a neutral-white LED work light placed out of frame, bright and even on the problem and falling off naturally toward the far corners, with a little daylight from a foundation vent. Neutral color with no green or blue cast, no horror mood. Photorealistic soil, masonry and lumber textures. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

---

## 4. Floor & framing

Mostly the exposed ceiling of an unfinished basement. The two floor-movement photos are taken upstairs in the living space, because that's where homeowners notice it.

### framing-sagging-floor

- **What to notice:** the floor joists overhead dipping down in the middle of their span.
- **Prices as:** `sister-joists`

**Prompt**

> Interior photograph looking up at the exposed ceiling of an unfinished basement: a row of 2x10 wood floor joists running away from the camera, resting on a straight steel I-beam that crosses the foreground. Past the beam, the joists visibly sag: their bottom edges bow down about an inch toward mid-span and come back up at the far foundation wall, and the plywood subfloor above follows the dip, in clear contrast to the perfectly straight steel beam in the foreground. The camera is at chest height, angled up about 20 degrees and looking along the joists, so the sag reads through the center of the frame; keep the lower foreground calm for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 24mm lens, f/8, deep focus, no fisheye distortion. Light from a small basement window plus a neutral-white overhead LED shop light; evenly exposed with the problem well lit, neutral color with no green or yellow cast; no HDR look, no vignette, no dark horror mood. Photorealistic concrete, masonry and lumber textures. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### framing-cracked-joist

- **What to notice:** a long crack splitting one floor joist diagonally.
- **Prices as:** `sister-joists`

**Prompt**

> Close interior photograph of the exposed ceiling of an unfinished basement: wood 2x10 floor joists at 16-inch spacing with the plywood subfloor above. One joist in the center of the frame has a long diagonal crack running from a large knot at its bottom edge up through the wood for about 3 feet, opened to about 1/8 inch, with torn wood fibers along its edges; the joist has dropped very slightly below its neighbors at the crack. The neighboring joists are sound. The camera is at chest height about 4 feet away, square-on to the side of the cracked joist; keep the clean joists on the right calm for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 24mm lens, f/8, deep focus, no fisheye distortion. Light from a small basement window plus a neutral-white overhead LED shop light; evenly exposed with the problem well lit, neutral color with no green or yellow cast; no HDR look, no vignette, no dark horror mood. Photorealistic concrete, masonry and lumber textures. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### framing-damaged-joist

- **What to notice:** a joist with a big chunk cut out of it to fit a pipe, now splitting from the cut.
- **Prices as:** `sister-joists`

**Prompt**

> Interior photograph of the exposed ceiling of an unfinished basement: wood 2x10 floor joists and the plywood subfloor above. A white 4-inch PVC drain pipe runs across the joists, and to fit it, one joist has been notched halfway through its depth from the bottom edge with a ragged saw cut; a split has started at the inside corner of the notch and runs along the grain for about 2 feet. The next joist has a smaller, cleaner hole. The camera is at chest height about 5 feet away, angled up slightly, with the notched joist in the center of the frame; keep the plain joists on the left calm for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 24mm lens, f/8, deep focus, no fisheye distortion. Light from a small basement window plus a neutral-white overhead LED shop light; evenly exposed with the problem well lit, neutral color with no green or yellow cast; no HDR look, no vignette, no dark horror mood. Photorealistic concrete, masonry and lumber textures. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### framing-rotted-joist

- **What to notice:** dark, soft, rotten wood on the joists and floor beneath a bathroom.
- **Prices as:** `sister-joists`

**Prompt**

> Interior photograph of the exposed ceiling of an unfinished basement below a bathroom: wood floor joists, the plywood subfloor, and a cast-iron toilet drain coming through it. Around the drain, the subfloor and the two joists either side have rotted from a long-term leak: darkened, water-stained in rings, soft and crumbling along the bottom edges of the joists, with fibers flaking away and a few dark fungal patches. The joists further away are clean and sound. The camera is at chest height about 5 feet away, angled up about 25 degrees, with the rotted area in the center of the frame; keep the sound joists on the right calm for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 24mm lens, f/8, deep focus, no fisheye distortion. Light from a small basement window plus a neutral-white overhead LED shop light; evenly exposed with the problem well lit, neutral color with no green or yellow cast; no HDR look, no vignette, no dark horror mood. Photorealistic concrete, masonry and lumber textures. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### framing-improper-beam-support

- **What to notice:** the main beam held up by a pile of wood scraps and a cracked block instead of a proper post.
- **Prices as:** `support-posts`

**Prompt**

> Interior photograph of an unfinished basement with a built-up wood main beam, made of three 2x10s, running across the frame under the joists. In the center of the frame, the beam is held up by a makeshift support: a stack of mismatched wood blocks and shims on top of a cracked hollow concrete block set straight on the concrete floor, with a short telescoping screw jack left in place beside it. The beam sags slightly above it. A proper steel post stands in the background for comparison. The camera is at chest height about 6 feet away, square-on to the makeshift support; keep the floor in the lower foreground calm for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 24mm lens, f/8, deep focus, no fisheye distortion. Light from a small basement window plus a neutral-white overhead LED shop light; evenly exposed with the problem well lit, neutral color with no green or yellow cast; no HDR look, no vignette, no dark horror mood. Photorealistic concrete, masonry and lumber textures. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### framing-cracked-beam

- **What to notice:** the main wood beam that carries the floor, cracked through and sagging at the crack.
- **Prices as:** `girder`

**Prompt**

> Interior photograph of an unfinished basement with a built-up wood main beam, made of three nailed 2x10s, running across the full width of the frame under the floor joists, carried on steel posts at either side. Midway between the posts, the beam has cracked: a jagged split runs up from its bottom edge through all three boards, opened about 1/4 inch at the bottom with splintered fibers, and the beam sags visibly at the crack, so the joists above it dip with it. The posts stand straight. The camera is at chest height about 8 feet away, square-on to the side of the beam, with the crack in the center of the frame; keep the floor in the lower third calm for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 24mm lens, f/8, deep focus, no fisheye distortion. Light from a small basement window plus a neutral-white overhead LED shop light; evenly exposed with the problem well lit, neutral color with no green or yellow cast; no HDR look, no vignette, no dark horror mood. Photorealistic concrete, masonry and lumber textures. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### framing-failing-post

- **What to notice:** a wooden support post rotted and crushed where it stands on the damp floor.
- **Prices as:** `support-posts`

**Prompt**

> Interior photograph of an unfinished basement: a wood 6x6 support post stands on the concrete floor under the main beam. The bottom 10 inches of the post have rotted from sitting on damp concrete: dark, soft, mushroomed outward with splayed fibers, the post visibly crushed and shortened at its base, with a dark damp ring on the floor around it. The upper post is sound. The camera is at waist height about 4 feet away, with the rotted base just below the center of the frame and the post running up the frame; keep the plain wall behind it calm for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 24mm lens, f/8, deep focus, no fisheye distortion. Light from a small basement window plus a neutral-white overhead LED shop light; evenly exposed with the problem well lit, neutral color with no green or yellow cast; no HDR look, no vignette, no dark horror mood. Photorealistic concrete, masonry and lumber textures. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### framing-floor-settlement

- **What to notice:** the floor has dropped away from the wall, leaving a gap under the baseboard that widens along the room.
- **Prices as:** `support-posts`

**Prompt**

> Interior photograph of an empty dining room in an older US house: an oak hardwood floor, white-painted baseboard and pale gray walls, a doorway in the background. Along the wall, the floor has settled away from the baseboard: there is no gap at the left end, but by the right end a dark gap of about 3/4 inch has opened between the bottom of the baseboard and the floor, and the quarter-round molding has pulled away. The door frame in the background is visibly out of square, with a tapered gap at the top of the door. The camera is low, at knee height, looking along the baseboard so the widening gap runs through the center of the frame; keep the wall above calm for interface overlays. Photographed as a professional home-inspection photo on a full-frame camera with a 24mm lens, f/8, deep focus, verticals kept straight. Soft natural daylight from windows, neutral white balance; no HDR look, no staging clutter, no vignette. Photorealistic. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### framing-uneven-floor

- **What to notice:** a hallway floor with a visible dip, a marble that has rolled into it, and a door that no longer fits its frame.
- **Prices as:** `sister-joists`

**Prompt**

> Interior photograph of an empty hallway in a 1950s house with long oak floorboards and white walls. Light from a window at the far end runs low along the floor and reveals a clear dip in the middle of the hallway, the reflections on the boards bending as they pass through it; a single clear glass marble rests at the lowest point. At the end of the hallway, an interior door stands closed in a frame that is out of square, with a wedge-shaped gap at the top, wider at one corner. The camera is at knee height at one end of the hallway looking down its length, with the dip in the center of the frame; keep the walls calm for interface overlays. Photographed as a professional home-inspection photo on a full-frame camera with a 24mm lens, f/8, deep focus, verticals kept straight. Soft natural daylight from windows, neutral white balance; no HDR look, no staging clutter, no vignette. Photorealistic. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### framing-sistered-joists

- **What to notice:** a repair done right: new joists bolted alongside the old ones, and a new steel post on a fresh footing.
- **Prices as:** `sister-joists` (the "after" picture)

**Prompt**

> Interior photograph of the exposed ceiling of an unfinished basement after a professional structural repair: new, pale yellow 2x10 lumber joists fastened full-length alongside the older gray-brown joists with neat rows of structural screws and through-bolts, and under the main beam a new painted steel adjustable post standing on a fresh, square concrete footing pad set into the floor. Clean workmanship, sawdust swept up. The camera is at chest height about 6 feet away, angled up slightly, with the sistered joists and the new post in the center of the frame; keep the floor in the lower foreground calm for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 24mm lens, f/8, deep focus, no fisheye distortion. Light from a small basement window plus a neutral-white overhead LED shop light; evenly exposed with the problem well lit, neutral color with no green or yellow cast; no HDR look, no vignette, no dark horror mood. Photorealistic concrete, masonry and lumber textures. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

---

## 5. Driveway & concrete

Height differences only read from low down, so most of these put the camera at knee height or lower.

### concrete-driveway-crack

- **What to notice:** a crack running across a driveway panel.
- **Prices as:** `joint-seal`

**Prompt**

> Exterior photograph of a broom-finished light-gray concrete driveway in front of a two-car garage, the house behind it clad in stacked stone and beige siding and softly out of focus. Across one driveway panel, a single meandering crack runs from the corner of a cut control joint diagonally to the edge, about 1/8 to 1/4 inch wide, with dark dirt and a few blades of grass in it. The concrete is otherwise sound and level. The camera stands on the driveway at chest height, looking down at about 45 degrees, with the crack in the center of the frame; keep the garage doors in the upper third calm for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 35mm lens, f/8, everything in sharp focus. Soft, even daylight under a light high overcast, no harsh shadows. Neutral, true-to-life color and natural contrast; no HDR look, no vignette, no dramatic sky, no color grading. Photorealistic, with real-world weathering and texture. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### concrete-wide-crack

- **What to notice:** a wide, open crack with broken edges and weeds growing out of it.
- **Prices as:** `joint-seal`

**Prompt**

> Close exterior photograph of an older concrete driveway with a weathered, exposed-aggregate surface. A wide crack crosses the frame: about 3/4 inch open, its edges chipped and crumbling, weeds and grass growing out of it, and one side sitting about 1/4 inch lower than the other. Small pieces of broken concrete lie beside it. The camera is at knee height about 3 feet away, looking down at about 45 degrees, with the crack running through the center of the frame; keep the concrete in the upper right calm for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 35mm lens, f/8, everything in sharp focus. Soft, even daylight under a light high overcast, no harsh shadows. Neutral, true-to-life color and natural contrast; no HDR look, no vignette, no dramatic sky, no color grading. Photorealistic, with real-world weathering and texture. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### concrete-sunken-slab

- **What to notice:** one section of the driveway dropped about two inches below the rest, leaving a step.
- **Prices as:** `slab-lift`

**Prompt**

> Exterior photograph of a concrete driveway leading to a garage with dark bronze doors, a red brick house softly out of focus behind it. One full driveway section has sunk about 2 inches below the section next to it, so the joint between them has become a clear step with a shadowed vertical face of concrete, and a shallow puddle sits at the low end of the sunken section. The surrounding sections are level. The camera is low, at knee height, about 6 feet from the joint, looking across the step so the drop reads clearly in the center of the frame; keep the garage in the background calm for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 35mm lens, f/8, everything in sharp focus. Soft, even daylight under a light high overcast, no harsh shadows. Neutral, true-to-life color and natural contrast; no HDR look, no vignette, no dramatic sky, no color grading. Photorealistic, with real-world weathering and texture. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### concrete-uneven-sections

- **What to notice:** several driveway sections tilted at different angles, with puddles in the low spots.
- **Prices as:** `slab-lift`

**Prompt**

> Exterior photograph looking up a long concrete driveway toward a two-story white farmhouse-style house with a black roof, softly out of focus. The driveway sections have shifted: several are tilted at different angles, their joints offset by 1 to 2 inches, and shallow puddles from recent rain sit in the low corners of two sections. Lawn on both sides. The camera is at chest height at the bottom of the driveway looking up its length, with the uneven sections filling the center and lower two-thirds of the frame; keep the house and sky at the top calm for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 35mm lens, f/8, everything in sharp focus. Soft, even daylight under a light high overcast, no harsh shadows. Neutral, true-to-life color and natural contrast; no HDR look, no vignette, no dramatic sky, no color grading. Photorealistic, with real-world weathering and texture. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### concrete-trip-hazard

- **What to notice:** one sidewalk panel lifted above the next, leaving an edge people trip on.
- **Prices as:** `slab-lift`

**Prompt**

> Exterior photograph of a front sidewalk in a US suburban neighborhood, with a craftsman house and lawn softly out of focus behind it. At one joint, the next sidewalk panel has lifted about 1 1/2 inches above the one in front of it, leaving a raised concrete edge across the full width of the walk with a crisp shadow line beneath it. Grass edges on both sides. The camera is very low, about a foot above the ground and a few feet from the joint, looking along the sidewalk so the raised edge runs across the center of the frame; keep the lawn in the upper third calm for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 35mm lens, f/8, everything in sharp focus. Soft, even daylight under a light high overcast, no harsh shadows. Neutral, true-to-life color and natural contrast; no HDR look, no vignette, no dramatic sky, no color grading. Photorealistic, with real-world weathering and texture. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### concrete-sinking-walkway

- **What to notice:** the front walk sunk at the porch steps, leaving a gap and a drop at the bottom step.
- **Prices as:** `slab-lift`

**Prompt**

> Exterior photograph of the front walkway of a brick bungalow, leading to brick porch steps. The last two concrete walkway panels have sunk about 3 inches near the steps: they tilt down toward the house, leaving a dark gap of about 1 inch and a taller-than-normal drop at the bottom step, with a shallow puddle sitting in the low spot against the steps. The rest of the walk is level. The camera is at chest height about 10 feet back on the walkway, looking toward the steps, with the sunken panels in the center of the frame; keep the brick porch in the upper third calm for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 35mm lens, f/8, everything in sharp focus. Soft, even daylight under a light high overcast, no harsh shadows. Neutral, true-to-life color and natural contrast; no HDR look, no vignette, no dramatic sky, no color grading. Photorealistic, with real-world weathering and texture. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### concrete-cracked-patio

- **What to notice:** a backyard patio slab broken by cracks into several pieces.
- **Prices as:** `joint-seal`

**Prompt**

> Exterior photograph of a backyard concrete patio behind a house with gray vinyl siding, a sliding glass door at the edge of the frame. The patio slab is broken into three pieces by a long diagonal crack and a corner crack, each about 1/4 inch wide with grass and dark dirt in it; the slab is otherwise level and swept clean, with no furniture. Lawn at the edges. The camera is at chest height about 10 feet away, looking down at about 35 degrees, with the cracked slab filling the center of the frame; keep the house wall at the top calm for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 35mm lens, f/8, everything in sharp focus. Soft, even daylight under a light high overcast, no harsh shadows. Neutral, true-to-life color and natural contrast; no HDR look, no vignette, no dramatic sky, no color grading. Photorealistic, with real-world weathering and texture. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### concrete-heaving

- **What to notice:** a slab pushed up and tilted by the roots of a big tree beside it.
- **Prices as:** `slab-lift` (see the note at the top)

**Prompt**

> Exterior photograph of a concrete sidewalk in front of a house, beside a mature oak tree in the grass strip. The tree's roots have pushed one sidewalk panel up: it tilts upward by about 3 inches at its edge nearest the tree, with a thick root bulging out of the soil beneath the raised edge and a crack across the panel. The panels on either side are flat. Fallen leaves on the grass, the house softly out of focus. The camera is at waist height about 8 feet away, looking along the sidewalk, with the heaved panel in the center of the frame; keep the lawn on the left calm for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 35mm lens, f/8, everything in sharp focus. Soft, even daylight under a light high overcast, no harsh shadows. Neutral, true-to-life color and natural contrast; no HDR look, no vignette, no dramatic sky, no color grading. Photorealistic, with real-world weathering and texture. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### concrete-garage-gap

- **What to notice:** the driveway dropped away from the garage floor, leaving a gap and a ledge at the door.
- **Prices as:** `slab-lift`

**Prompt**

> Close exterior photograph at the threshold of a white two-car garage door. The concrete driveway apron has settled away from the garage floor slab: an open gap of about 1 inch runs the full width of the door, filled with dirt and old leaves, and the driveway sits about 1 1/2 inches lower than the garage floor, leaving a visible ledge under the door's rubber bottom seal. The camera is low, at knee height, about 4 feet back on the driveway and square-on to the door, with the gap running across the center of the frame; keep the white garage door in the upper half calm for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 35mm lens, f/8, everything in sharp focus. Soft, even daylight under a light high overcast, no harsh shadows. Neutral, true-to-life color and natural contrast; no HDR look, no vignette, no dramatic sky, no color grading. Photorealistic, with real-world weathering and texture. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

---

## 6. Siding & exterior

### siding-warped

- **What to notice:** siding boards rippling and waving instead of lying flat.
- **Prices as:** `siding-replace`

**Prompt**

> Exterior photograph of the side of a two-story house with almond-colored vinyl lap siding beside a double-hung window. Across about eight courses, the siding is visibly warped: the boards ripple in long waves, bulging out and in between their nails, so the shadow lines under each course wobble instead of running straight. Soft daylight from the side brings out the ripples, and the courses further away lie flat. The camera faces the wall at chest height from about 8 feet away, slightly angled along it, with the warped boards in the center of the frame; keep the flat siding on the left calm for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 35mm lens, f/8, everything in sharp focus. Soft, even daylight under a light high overcast, no harsh shadows. Neutral, true-to-life color and natural contrast; no HDR look, no vignette, no dramatic sky, no color grading. Photorealistic, with real-world weathering and texture. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### siding-cracked

- **What to notice:** one siding board cracked through, with a piece broken out.
- **Prices as:** `siding-repair`

**Prompt**

> Exterior photograph of a wall of light-gray fiber-cement lap siding with white corner trim, near an outdoor faucet at waist height. One board has a jagged crack running about 18 inches along it from a nail near its end, and a small triangular piece has broken out of its bottom edge, showing the dark housewrap behind it. The boards around it are sound. The camera faces the wall square-on at waist height from about 4 feet away, with the cracked board in the center of the frame; keep the siding in the upper right calm for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 35mm lens, f/8, everything in sharp focus. Soft, even daylight under a light high overcast, no harsh shadows. Neutral, true-to-life color and natural contrast; no HDR look, no vignette, no dramatic sky, no color grading. Photorealistic, with real-world weathering and texture. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### siding-loose

- **What to notice:** a siding panel come unclipped and hanging away from the wall.
- **Prices as:** `siding-repair`

**Prompt**

> Exterior photograph of a ranch house with clay-colored vinyl lap siding. One long siding panel has come unlocked from the course below it: its bottom edge hangs about 2 inches away from the wall and sags along its length, exposing the locking edge of the panel beneath and a strip of white housewrap, while its top is still nailed in place. A shadow runs along the gap. The camera faces the wall at chest height from about 6 feet away, slightly angled along it, with the loose panel across the center of the frame; keep the siding above calm for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 35mm lens, f/8, everything in sharp focus. Soft, even daylight under a light high overcast, no harsh shadows. Neutral, true-to-life color and natural contrast; no HDR look, no vignette, no dramatic sky, no color grading. Photorealistic, with real-world weathering and texture. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### siding-pulling-away

- **What to notice:** siding boards bowing out from the wall, with nails backing out and a gap behind them.
- **Prices as:** `siding-repair`

**Prompt**

> Exterior photograph of the side wall of a two-story house with navy-blue painted engineered-wood lap siding and white corner boards. Near the corner, four boards are pulling away from the wall: they bow outward in the middle with their nail heads backing out, leaving a dark gap of up to 1 inch between the boards and the wall, and one board's end has pulled out from behind the corner board. The camera stands close to the wall, about 3 feet out, looking along it at a shallow angle so the outward bow reads clearly against the flat boards beyond, in the center of the frame; keep the flat siding in the background calm for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 35mm lens, f/8, everything in sharp focus. Soft, even daylight under a light high overcast, no harsh shadows. Neutral, true-to-life color and natural contrast; no HDR look, no vignette, no dramatic sky, no color grading. Photorealistic, with real-world weathering and texture. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### siding-damaged-trim

- **What to notice:** the wood trim under a window rotted, split and peeling.
- **Prices as:** `trim-soffit`

**Prompt**

> Exterior photograph of a Cape Cod house with weathered gray cedar shingle siding and white painted wood window trim. Under a double-hung window, the trim has rotted: the sill and the bottoms of both side casings are soft and split, the white paint is peeling in strips, the bare wood is gray and dark where water sits, and the joint between sill and casing has opened about 1/4 inch. The rest of the trim is sound. The camera faces the window at chest height from about 5 feet away, with the rotted sill just below the center of the frame; keep the shingles to the right calm for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 35mm lens, f/8, everything in sharp focus. Soft, even daylight under a light high overcast, no harsh shadows. Neutral, true-to-life color and natural contrast; no HDR look, no vignette, no dramatic sky, no color grading. Photorealistic, with real-world weathering and texture. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### siding-exterior-wall-crack

- **What to notice:** a diagonal crack running up from the corner of a window across a stucco wall.
- **Prices as:** `push-piers` (a diagonal crack from a window corner is usually the house moving)

**Prompt**

> Exterior photograph of a single-story house in Arizona with a sand-colored stucco finish. From the upper corner of a window, a diagonal crack runs up and away toward the roofline: about 1/8 inch wide near the window, branching into finer hairline cracks as it rises, with a thin dirt line along it. The stucco around it is smooth and sound. A bed of desert gravel and a small agave at the base. The camera faces the wall square-on from about 8 feet away at chest height, with the window left of center and the crack crossing the center of the frame; keep the plain stucco to the right calm for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 35mm lens, f/8, everything in sharp focus. Soft, even daylight under a light high overcast, no harsh shadows. Neutral, true-to-life color and natural contrast; no HDR look, no vignette, no dramatic sky, no color grading. Photorealistic, with real-world weathering and texture. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### siding-water-staining

- **What to notice:** dark water streaks coming out from under the bottom of the siding and running down the foundation.
- **Prices as:** `flashing`

**Prompt**

> Exterior photograph of the base of a house with pale blue painted wood clapboard siding over a light-gray concrete foundation. Below a window, dark water stains and greenish mildew streaks run out from under the bottom course of siding and down the face of the foundation in long vertical drips about a foot wide, showing that water is getting behind the siding and draining out at the bottom; the bottom edge of the lowest board is darkened and its paint is lifting. The camera is at waist height about 5 feet away, square-on, with the stained area in the center of the frame; keep the siding above calm for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 35mm lens, f/8, everything in sharp focus. Soft, even daylight under a light high overcast, no harsh shadows. Neutral, true-to-life color and natural contrast; no HDR look, no vignette, no dramatic sky, no color grading. Photorealistic, with real-world weathering and texture. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### siding-fascia-damage

- **What to notice:** the board along the roof edge, behind the gutter, rotted and falling apart at the corner.
- **Prices as:** `trim-soffit`

**Prompt**

> Exterior photograph looking up at the roof edge of a two-story house with soft gray siding, a charcoal asphalt-shingle roof, a white aluminum gutter and white painted wood fascia. At a corner, the fascia behind the gutter has rotted: the paint has peeled away, the wood is dark, split and crumbling, a section is missing so the end of a rafter tail shows, and the gutter has pulled down slightly from the rotted wood. The rest of the fascia is sound. The camera is on the ground about 12 feet away, looking up at about 40 degrees, with the rotted corner in the center of the frame; keep the soffit and wall below it calm for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 35mm lens, f/8, everything in sharp focus. Soft, even daylight under a light high overcast, no harsh shadows. Neutral, true-to-life color and natural contrast; no HDR look, no vignette, no dramatic sky, no color grading. Photorealistic, with real-world weathering and texture. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### siding-soffit-damage

- **What to notice:** a section of the underside of the roof overhang sagging, stained and broken open.
- **Prices as:** `trim-soffit`

**Prompt**

> Exterior photograph looking up at the eave of a single-story ranch house with beige vinyl siding, showing the soffit under the roof overhang made of white vented vinyl panels. One section near the corner is damaged: two soffit panels sag down out of their channel, a ragged hole about 6 inches across has opened at one end, water-stain streaks mark the panels around it, and the dark wood of the rafters shows through the opening. The camera is on the ground about 8 feet away, looking up at about 50 degrees, with the damaged soffit in the center of the frame; keep the siding in the lower third calm for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 35mm lens, f/8, everything in sharp focus. Soft, even daylight under a light high overcast, no harsh shadows. Neutral, true-to-life color and natural contrast; no HDR look, no vignette, no dramatic sky, no color grading. Photorealistic, with real-world weathering and texture. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### siding-exterior-settlement

- **What to notice:** the brick chimney pulling away from the side of the house, with a gap that widens toward the top.
- **Prices as:** `push-piers`

**Prompt**

> Exterior photograph of the gable end of a single-story ranch house with gray lap siding and a red brick exterior chimney running up the wall. The chimney is pulling away from the house as its footing settles: a dark gap opens between the chimney and the siding, about 1/4 inch at the bottom and about 2 inches at the roofline, with old caulk torn along it, and stair-step cracks run through the brick near the chimney's base. The camera is on the ground about 15 feet away at chest height, angled slightly along the wall so the widening gap reads clearly, with the chimney just left of center; keep the siding on the right calm for interface overlays. Photographed as a professional property-inspection photo on a full-frame camera with a 35mm lens, f/8, everything in sharp focus. Soft, even daylight under a light high overcast, no harsh shadows. Neutral, true-to-life color and natural contrast; no HDR look, no vignette, no dramatic sky, no color grading. Photorealistic, with real-world weathering and texture. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

---

## Appendix: area scenes for the current hotspot layout

One photo per area, each with several problems placed roughly where today's hotspots sit, so they can go straight into `sceneImages` in `estimator.ts`. Image models are unreliable at putting four or five specific defects in specific places, so expect more retries than with the problem photos. Whatever comes out, move that area's `hotspots` onto what the photo actually shows; the drawing's positions won't line up exactly.

### Scene: foundation

- **What to notice:** one foundation wall with four problems: stair-step crack, leaking crack, horizontal crack, dropped footing.

**Prompt**

> Exterior photograph down into a wide excavation along the side of a house with light vinyl siding, exposing the outer face of a gray concrete-block foundation wall from the siding down to the footing, about 6 feet of wall, with clean-cut soil sides and no tools. The wall shows four separate problems spread across the frame: in the upper left, a stair-step crack through the mortar joints; in the upper right, a short vertical crack with a dark wet streak where water seeps through; across the middle, a long horizontal crack along a mortar joint with the wall bowed slightly inward at it; and at the lower right, the concrete footing has dropped about an inch under the corner and cracked where it bends. Each problem is clearly separated from the others and easy to see. The camera is at chest height at the edge of the excavation, facing the wall. Photographed as a professional property-inspection photo on a full-frame camera with a 35mm lens, f/8, everything in sharp focus. Soft, even daylight under a light high overcast, no harsh shadows. Neutral, true-to-life color and natural contrast; no HDR look, no vignette, no dramatic sky, no color grading. Photorealistic, with real-world weathering and texture. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### Scene: basement

- **What to notice:** one basement wall with a leaking crack, white staining, a wet floor joint, a puddle and the sump pump.

**Prompt**

> Interior photograph of one wall of an unfinished basement: a light-gray concrete-block wall, exposed wood joists along the top, a small hopper window in the upper left, a gray concrete floor. Five separate problems are spread across the frame: in the left third, a vertical crack running down the wall with a wet streak of water below it; right of center, white chalky efflorescence blooming out of the mortar joints; along the bottom of the wall, a dark wet line where water seeps in at the floor joint; on the floor left of center, a puddle of standing water about 4 feet across; and at the right, an open sump pit in the floor with a white PVC discharge pipe running up the wall and along under the joists. Each problem is clearly separated and easy to see. The camera faces the wall square-on from about 12 feet away at chest height. Photographed as a professional property-inspection photo on a full-frame camera with a 24mm lens, f/8, deep focus, no fisheye distortion. Light from a small basement window plus a neutral-white overhead LED shop light; evenly exposed with the problem well lit, neutral color with no green or yellow cast; no HDR look, no vignette, no dark horror mood. Photorealistic concrete, masonry and lumber textures. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### Scene: crawl

- **What to notice:** a crawl space with moldy joists, a sweating duct, a sagging joist, standing water and a torn vapor barrier.

**Prompt**

> Interior photograph of a vented crawl space about 30 inches high, with block perimeter walls at the left and right edges and wood floor joists overhead. Five separate problems are spread across the frame: on the joists in the upper left, patches of black and white mold; across the middle, a round metal duct beaded with condensation; in the upper right, one joist visibly sagging in a shallow curve; on the ground at the lower right, a wide puddle of standing water; and on the ground at the lower left, a torn, bunched white plastic vapor barrier with soil showing through. Each problem is clearly separated and easy to see. The camera is low and facing straight into the crawl space. Photographed as a professional crawl-space inspection photo on a full-frame camera with a 20mm lens held low, f/8, deep focus, no fisheye distortion. Lit by a neutral-white LED work light placed out of frame, bright and even on the problem and falling off naturally toward the far corners, with a little daylight from a foundation vent. Neutral color with no green or blue cast, no horror mood. Photorealistic soil, masonry and lumber textures. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### Scene: framing

- **What to notice:** the floor framing from below, with sagging joists, a cracked beam, a leaning post and a rotted rim joist.

**Prompt**

> Interior photograph of the floor framing seen from below in a low unfinished basement: wood joists overhead, a built-up wood main beam running across the full width of the frame under them, wood posts standing on the floor under the beam, and the foundation wall at the far left. Four separate problems: at the far left, the rim joist where the framing meets the foundation wall is dark and rotted; in the upper right, the joists and floor above dip in a visible sag; at the center, the main beam has a jagged crack through it; and just right of center, the post under the beam leans several degrees out of plumb while the other posts stand straight. Each problem is clearly separated and easy to see. The camera is at chest height, square-on to the beam. Photographed as a professional property-inspection photo on a full-frame camera with a 24mm lens, f/8, deep focus, no fisheye distortion. Light from a small basement window plus a neutral-white overhead LED shop light; evenly exposed with the problem well lit, neutral color with no green or yellow cast; no HDR look, no vignette, no dark horror mood. Photorealistic concrete, masonry and lumber textures. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### Scene: driveway

- **What to notice:** a driveway from low down, with an open crack, a sunken section and the trip ledge it leaves.

**Prompt**

> Exterior photograph of a concrete driveway seen from the side at knee height, running across the frame from a garage at the left edge, a lawn beyond it. Three separate problems along the driveway: in the left third, an open crack across one section; in the center, a full section sunk about 2 inches lower than its neighbors, tilting down; and right of center, the raised edge of the next section standing above the sunken one as a clear ledge with a shadowed face. Each problem is clearly separated and easy to see. Photographed as a professional property-inspection photo on a full-frame camera with a 35mm lens, f/8, everything in sharp focus. Soft, even daylight under a light high overcast, no harsh shadows. Neutral, true-to-life color and natural contrast; no HDR look, no vignette, no dramatic sky, no color grading. Photorealistic, with real-world weathering and texture. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.

### Scene: siding

- **What to notice:** a wall of lap siding with rotted fascia and soffit, warped boards, a cracked board, a stain under a window and a missing board.

**Prompt**

> Exterior photograph of one wall of a house with cream vinyl lap siding, the roof edge along the top of the frame and a strip of lawn along the bottom, a white double-hung window near the center. Five separate problems: at the upper right, the fascia and soffit along the roof edge are rotted and stained; on the right side of the wall, several boards are warped and faded; on the left, one board has a visible crack; below the window, dark water stains run down the siding from the sill; and at the lower right, one siding board is missing, showing white housewrap behind it. Each problem is clearly separated and easy to see. The camera faces the wall square-on from about 15 feet away at chest height. Photographed as a professional property-inspection photo on a full-frame camera with a 35mm lens, f/8, everything in sharp focus. Soft, even daylight under a light high overcast, no harsh shadows. Neutral, true-to-life color and natural contrast; no HDR look, no vignette, no dramatic sky, no color grading. Photorealistic, with real-world weathering and texture. No people, no text, labels, arrows, signs or logos anywhere in the image. 16:9 landscape.
