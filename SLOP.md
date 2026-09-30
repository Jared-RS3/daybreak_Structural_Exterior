# SLOP.md
## Anti-AI-Slop Web Design Rules

Use this file as a standing design and implementation constraint for all website and frontend work.

The goal is not to make designs "different for the sake of being different." The goal is to avoid the repetitive visual language, copy patterns, and layout habits that make AI-generated websites immediately recognizable.

---

# 1. CORE PRINCIPLE

Do not generate a website that looks like a default AI landing page.

Every design decision should feel intentional, brand-specific, and appropriate to the company, audience, product, and market.

Before implementing a section, ask:

- Why does this section exist?
- Why is it laid out this way?
- Does this visual treatment support the brand?
- Would a strong human designer make this exact choice?
- Is this pattern being used because it is appropriate, or because it is easy/default?

If the answer is "because this is the common SaaS/AI landing-page pattern," redesign it.

---

# 2. FORBIDDEN DEFAULT AI PATTERNS

Avoid these unless the project specifically calls for them.

## Layout

Do not default to:

- centered headline + centered paragraph + two CTA buttons
- hero section followed by three equal feature cards
- endless grids of rounded cards
- alternating left-text/right-image sections repeated down the page
- identical section spacing throughout the whole site
- every section contained inside a rounded rectangle
- generic Bento grids
- four-column icon feature grids with no hierarchy
- symmetrical layouts everywhere
- content that sits in the exact center of the viewport for every section
- dashboard-style UI patterns on non-dashboard websites
- excessive max-width containers that make every page feel identical
- predictable hero → logos → features → testimonials → pricing → FAQ → CTA structures unless genuinely appropriate

Prefer composition, rhythm, asymmetry, hierarchy, and variation.

---

# 3. CARD ABUSE

Cards are not the default container.

Do not place content inside a card unless the card communicates a meaningful grouping, interaction, item, product, record, or separate object.

Avoid:

- card inside card
- every testimonial in an identical card
- every service in an identical card
- every statistic in an identical card
- giant soft-shadow cards floating on pale backgrounds
- rows of equal-height rounded rectangles

Prefer:

- typography
- dividers
- whitespace
- editorial layouts
- columns
- lists
- image-led compositions
- strong alignment
- intentional borders
- full-bleed sections

---

# 4. BORDER RADIUS

Do not apply border-radius automatically.

Avoid defaulting to:

- 12px
- 16px
- 20px
- 24px
- `rounded-xl`
- `rounded-2xl`
- `rounded-3xl`

Choose radius based on brand language.

Premium/editorial brands may use:

- square corners
- subtle 2–6px radii
- selective curved elements
- one deliberately exaggerated radius

Do not round every image, button, section, input, and card.

---

# 5. GRADIENTS

Do not use gradients as a shortcut for visual interest.

Avoid:

- purple-to-blue AI gradients
- pink-purple-blue glow backgrounds
- random blurred gradient blobs
- gradient text on headings
- gradients behind every CTA
- neon atmospheric glows with no brand rationale

Use gradients only when they are part of the brand system or create meaningful depth.

A strong flat color is often better.

---

# 6. GLASSMORPHISM

Avoid generic glassmorphism.

Do not default to:

- `backdrop-blur`
- translucent white cards
- frosted navigation
- glowing glass panels
- transparent borders over gradients

Use glass effects only if the visual direction specifically requires them.

---

# 7. TYPOGRAPHY

Typography should carry the design.

Do not automatically use:

- Inter
- Poppins
- Roboto
- Arial
- generic system sans stacks

unless the project requires them.

Do not automatically pair:

- geometric sans heading
- neutral sans body

Explore typography appropriate to the brand.

Possible directions:

- editorial serif + clean grotesk
- neo-grotesk only
- humanist sans
- condensed display type
- high-contrast serif
- monospaced accents
- custom variable fonts
- strong typographic hierarchy using one family

Avoid excessive font-weight changes.

Do not make every heading:

`font-bold tracking-tight`

by default.

Use deliberate:

- scale
- line-height
- letter spacing
- width
- casing
- alignment
- contrast

---

# 8. TYPOGRAPHIC SCALE

Avoid generic Tailwind-style typography where every page uses:

- `text-5xl`
- `text-xl`
- `text-base`
- `text-sm`

Build a real hierarchy.

Hero text may be:

- unusually large
- narrow
- multiline
- cropped
- left aligned
- offset
- vertically stacked
- partially overlapping imagery

Section headings do not all need the same size.

---

# 9. COPYWRITING SLOP

Do not write generic AI marketing copy.

Avoid phrases such as:

- "Transform your..."
- "Elevate your..."
- "Unlock the power of..."
- "Revolutionize..."
- "Seamless solutions..."
- "Empowering businesses..."
- "Innovative solutions tailored to your needs"
- "Take your business to the next level"
- "Your trusted partner"
- "Where innovation meets..."
- "Built for the future"
- "We bring your vision to life"
- "Experience the difference"
- "Powerful. Simple. Seamless."
- "Designed to scale"
- "Everything you need, all in one place"

Avoid empty adjectives:

- innovative
- cutting-edge
- world-class
- next-generation
- powerful
- seamless
- modern
- premium
- bespoke

unless the following sentence proves the claim.

Write specific copy based on:

- what the company actually does
- the customer's problem
- measurable benefits
- process
- proof
- differentiation
- industry language

---

# 10. HEADING SLOP

Avoid headings that follow the same AI formula:

> One short phrase.  
> Another short phrase.

Do not overuse:

- em dashes
- forced sentence fragments
- three-word slogans
- "X, reimagined"
- "Built for X"
- "Made for X"
- "X without the Y"
- "More than just X"
- "Not just X. Y."

These patterns are allowed occasionally, not as the entire site's voice.

---

# 11. BUTTONS

Do not automatically add two hero buttons.

Only add a secondary CTA when there is a genuinely useful secondary action.

Avoid:

- pill buttons everywhere
- oversized rounded buttons
- icons in every button
- arrows after every CTA
- "Learn More" repeated throughout the site

Prefer specific CTA language:

- View Projects
- Request a Quote
- See the Menu
- Book a Consultation
- Explore Services
- Start a Project
- View Availability

Button shape, scale, and treatment should match the brand.

---

# 12. ICONS

Do not fill empty space with generic icons.

Avoid:

- icon inside colored circle
- icon inside rounded square
- icon + heading + paragraph repeated 3–6 times
- random Lucide icons used as decoration

Use icons when they improve comprehension or interaction.

A section may be stronger with typography alone.

---

# 13. STOCK ILLUSTRATION SLOP

Avoid generic:

- abstract 3D shapes
- floating spheres
- blob illustrations
- random dashboards
- generic laptop mockups
- people staring at screens
- fake app UI screenshots

Visuals should relate directly to:

- product
- service
- location
- process
- people
- craftsmanship
- proof
- outcome

---

# 14. IMAGE TREATMENT

Do not automatically place every image inside a rounded frame.

Consider:

- full bleed
- oversized crops
- editorial crops
- edge-to-edge media
- overlapping typography
- unconventional aspect ratios
- image sequences
- horizontal scrolling
- masks when conceptually justified

Use image treatment to create rhythm.

---

# 15. SPACING

Do not use identical vertical padding on every section.

Avoid repetitive:

`py-24`
`py-24`
`py-24`
`py-24`

Create pacing.

Some sections may be:

- dense
- expansive
- almost full-screen
- tightly connected
- intentionally separated

Spacing is part of storytelling.

---

# 16. COLOR

Do not automatically create:

- dark navy background
- white text
- electric blue accent

or:

- off-white background
- black text
- purple accent

Derive color from the brand.

Use a restrained palette.

A strong system may only need:

- background
- foreground
- secondary surface
- one accent
- one functional color

Do not create ten shades simply because a design token system allows it.

---

# 17. SHADOWS

Avoid generic soft shadows.

Do not use:

`box-shadow: 0 20px 60px rgba(...)`

on every card.

Prefer:

- contrast
- borders
- layering
- spacing
- background shifts

Use shadow only where physical elevation makes sense.

---

# 18. NAVIGATION

Avoid default AI navigation:

logo | Product | Solutions | Resources | Pricing | [Get Started]

Design the nav around the actual information architecture.

Do not add menu items merely to make the header look complete.

Navigation can be:

- minimal
- editorial
- overlay
- split
- compact
- full-width
- contextual

Mobile navigation must be intentionally designed, not treated as an afterthought.

---

# 19. TESTIMONIALS

Do not automatically create three testimonial cards.

Consider:

- one strong quote
- rotating quote
- editorial pull quote
- client logos with a single case-study statement
- case study metrics
- quotes integrated into project sections

Use real attribution when available.

Never invent testimonials.

---

# 20. METRICS

Do not fabricate metrics.

Do not add fake numbers such as:

- 10K+ customers
- 99.9% uptime
- 300% growth
- 4.9/5 rating
- 150+ projects

unless supplied by the user or source data.

If proof is unavailable, use qualitative credibility instead.

---

# 21. LOGO CLOUDS

Do not add "Trusted by leading companies" with fake logos.

Only create a logo strip if genuine client/partner logos exist.

---

# 22. FAQ SECTIONS

Do not add FAQ sections automatically.

FAQ should exist because users have meaningful objections or recurring questions.

Do not use FAQ as filler.

---

# 23. ANIMATION

Animation should enhance hierarchy, storytelling, or interaction.

Avoid:

- every element fading upward
- staggered reveal on every section
- excessive floating
- constant parallax
- cursor gimmicks with no purpose
- animated gradient blobs
- text that animates simply because GSAP is installed

Prefer:

- one strong hero interaction
- intentional scroll choreography
- subtle hover behavior
- meaningful transitions
- restrained micro-interactions

Respect:

`prefers-reduced-motion`

Animations should remain smooth on average consumer devices.

---

# 24. SCROLL EXPERIENCES

Do not turn every website into an animation demo.

Horizontal scrolling, pinned sections, masks, 3D scenes, scroll-linked video, or canvas effects should support the concept.

If they harm:

- readability
- accessibility
- mobile usability
- performance
- conversion

remove or simplify them.

---

# 25. RESPONSIVE DESIGN

Do not treat mobile as desktop stacked vertically.

Design mobile intentionally.

Check:

- type scale
- line breaks
- image crops
- CTA placement
- section order
- interactive areas
- horizontal overflow
- sticky elements
- menu behavior
- scroll animations
- touch targets

Some desktop effects should be disabled or redesigned on mobile.

---

# 26. UI COPY

Avoid filler labels such as:

- Discover More
- Explore Now
- Learn More
- Get Started
- Read More

when a specific label is possible.

The interface should tell users exactly what happens next.

---

# 27. FORMS

Avoid giant generic contact forms.

Only ask for information required for the next step.

Prefer clear labels over placeholder-only fields.

Use:

- obvious error states
- helpful validation
- accessible labels
- appropriate input types
- visible focus states

Do not sacrifice form usability for aesthetics.

---

# 28. ACCESSIBILITY

Design quality includes accessibility.

Maintain:

- semantic HTML
- keyboard navigation
- sufficient contrast
- visible focus states
- meaningful alt text
- appropriate ARIA usage
- proper heading order
- reduced motion support

Do not add accessibility attributes mechanically or incorrectly.

---

# 29. PERFORMANCE

Visual ambition must not destroy performance.

Avoid unnecessary:

- JavaScript
- animation libraries
- high-resolution videos
- unoptimized images
- giant WebGL scenes
- render-blocking fonts
- duplicate dependencies

Lazy-load appropriate media.

Use responsive images.

Compress assets.

Avoid shipping an animation engine for a single fade.

---

# 30. BRAND-SPECIFIC DESIGN

Before designing, identify:

1. Brand personality
2. Target audience
3. Primary conversion goal
4. Visual references
5. Industry conventions
6. Competitor conventions
7. Which conventions should be respected
8. Which conventions can be deliberately broken

The site should not look like it could belong to any company.

If replacing the logo and copy would make the design work equally well for twenty unrelated companies, the design is too generic.

---

# 31. DESIGN REFERENCES

When references are provided, study their principles rather than copying their exact layout.

Extract:

- composition
- spacing rhythm
- typography
- image treatment
- movement
- hierarchy
- density
- navigation behavior
- use of whitespace
- visual tension

Do not produce a Frankenstein combination of trendy components.

---

# 32. VISUAL HIERARCHY

Every screen should have a clear hierarchy.

Determine:

1. What should be noticed first?
2. What should be noticed second?
3. What action should the user understand?
4. What content can remain quiet?

Not everything should compete for attention.

Avoid giving:

- every heading maximum weight
- every card a border
- every button an accent color
- every section a visual gimmick

---

# 33. DESIGN RHYTHM

A good website should contain contrast between sections.

Examples:

- text-heavy → visual
- dense → spacious
- light → dark
- static → interactive
- narrow → full-width
- quiet → dramatic

Avoid repeating the same section grammar.

---

# 34. PREMIUM DESIGN RULE

Premium does not mean:

- more blur
- more glow
- more animations
- more gradients
- more rounded corners

Premium usually comes from:

- restraint
- excellent typography
- excellent imagery
- alignment
- proportion
- whitespace
- detail
- consistency
- confident hierarchy
- strong art direction

---

# 35. IMPLEMENTATION RULES

When writing frontend code:

- use semantic elements
- avoid unnecessary wrappers
- keep component abstractions meaningful
- do not create dozens of tiny components without benefit
- do not hardcode repeated design values randomly
- build reusable tokens where repetition genuinely exists
- keep page-specific composition flexible
- do not force every section into the same component abstraction

Do not overengineer a simple visual effect.

---

# 36. TAILWIND-SPECIFIC WARNING

When using Tailwind, avoid producing the stereotypical combination:

`rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl`

unless the design genuinely requires it.

Likewise avoid automatically repeating:

`max-w-7xl mx-auto px-6 lg:px-8`

for every section.

Tailwind is an implementation tool, not a design system.

Create deliberate values where necessary.

---

# 37. REACT / NEXT.JS WARNING

Do not let component architecture dictate visual sameness.

A reusable `Section` component should not force every section to have:

- identical width
- identical padding
- identical title placement
- identical background
- identical content alignment

Allow composition to vary.

---

# 38. FINAL ANTI-SLOP REVIEW

Before presenting a website as complete, inspect it for these symptoms.

Ask:

### Layout
- Does the site rely heavily on repetitive cards?
- Are most sections centered?
- Is the layout overly symmetrical?
- Does every section use identical spacing?

### Visual language
- Are there unnecessary gradients?
- Are there unnecessary glowing blobs?
- Are most elements heavily rounded?
- Is glassmorphism being used without reason?

### Typography
- Is the font selection generic?
- Does every heading look the same?
- Does typography create enough hierarchy?

### Copy
- Could the copy belong to almost any company?
- Are there vague AI marketing phrases?
- Are claims supported?

### Brand
- Could the logo be swapped for another company with no redesign?
- Does the site communicate a specific personality?

### UX
- Is mobile genuinely designed?
- Are CTAs specific?
- Are animations useful?
- Is the interface understandable without explanation?

If multiple answers indicate generic output, revise the design before considering it finished.

---

# 39. CLAUDE INSTRUCTION

When generating or modifying a website:

Do not immediately code the first obvious layout.

First infer the visual system and composition.

For every major page or section:

1. Understand the content hierarchy.
2. Decide the section's purpose.
3. Choose a composition appropriate to that purpose.
4. Check it against this anti-slop document.
5. Implement it.
6. Review the finished page for repetition and generic AI patterns.
7. Refactor anything that feels templated.

If given screenshots or references, prioritize their visual principles over generic framework defaults.

Do not add sections, copy, claims, metrics, testimonials, logos, or features that were not requested merely to make a page look complete.

When uncertain, choose restraint over decoration.

---

# 40. DEFAULT DESIGN PHILOSOPHY

Unless the user specifies another direction, favor:

- premium
- restrained
- editorial
- brand-led
- typography-first
- high-quality imagery
- intentional motion
- asymmetric composition where appropriate
- clean information hierarchy
- strong mobile design
- conversion-aware UX

Do not confuse minimalism with emptiness.

Do not confuse complexity with quality.

Make the site feel designed, not generated.
