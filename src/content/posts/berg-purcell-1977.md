---
title: "How a bacterium counts molecules: the physics of chemoreception"
date: 2026-11-08
tags: [biophysics, papers, interactive]
cover: ../../assets/posts/berg-purcell-1977/cover.png
description: How does a two-micrometre E. coli know which way the sugar is? Follow Berg and Purcell's classic 1977 argument from diffusion all the way to the physical limit on what a cell can sense. Every figure can be played with.
---

<link rel="stylesheet" href="/posts/berg-purcell-1977/figures.css">

*中文版：[细菌怎样“数”分子](/post/berg-purcell-1977-zh/)*

Imagine you are an *E. coli*.

You are about two micrometres long and pushed along by a few flagella behind you, at 30 micrometres a second, a dozen or so body lengths every second. You are hungry. There is sugar somewhere nearby, but you don't know which way.

You have no eyes and no nose. What you have is a few thousand receptors scattered over your surface. Each can hold one sugar molecule at a time, for a moment, before letting it go. The only thing you can do is **count**: how many receptors are occupied now, and how many a little later. If the number is rising you are swimming towards more sugar, so keep going. If it is falling, stop, tumble, and try a new direction.

That sounds easy. Do the arithmetic and it turns out to be astonishingly hard.

Take a sugar concentration of 1 µM (one micromole per litre, a common concentration inside living things). A ball of water your size, one micrometre in radius, holds on average only about **2,500** sugar molecules. To tell that the concentration is 1% higher, you have to see a difference of 25 molecules out of 2,500. But those molecules never stop moving in and out, and their random fluctuation alone is about $\sqrt{2500} = 50$, twice the signal you are looking for.

<figure class="mc-figure">
<div class="mc-figure-plot">
<div class="controls">
<div class="mc-slider"><label class="mc-slider-label" for="cn-n">Independent counts averaged, <span class="m">n</span></label><output class="mc-slider-value" id="cn-n-o"></output><input type="range" class="mc-range" id="cn-n" min="0" max="1000" step="1"></div>
</div>
<div id="cn-plot"></div>
<div class="readouts">
<div class="ro"><div class="k">Fluctuation of the average</div><div class="v" id="cn-sd">–</div><div class="t">50/√<span class="m">n</span></div></div>
<div class="ro"><div class="k">Chance of guessing which is higher</div><div class="v" id="cn-ok">–</div></div>
<div class="ro"><div class="k">Time for an ideal counter</div><div class="v" id="cn-t">–</div><div class="t">about 1 ms per independent count</div></div>
</div>
</div>
<figcaption class="mc-figure-cap">

<span class="mc-figure-num">Fig. 1</span> A ball one micrometre in radius holds on average 2,500 molecules at 1 µM (blue, solid) and 2,525 at a concentration 1% higher (ochre, dashed). The curves are the distributions of the number you get by averaging $n$ counts; the grey area is where the two can be mistaken for each other. Count once and you will say which concentration is higher only six times in ten, barely better than a guess. Drag the slider to see how many counts it takes to pull the curves apart. The time assumes one independent count per millisecond, a number explained in section 4.

</figcaption>
</figure>

So counting once is not enough; you have to count again and again and average. Which raises the questions:

- How long do you have to count to see a 1% difference?
- How many receptors do you need? Are a few thousand enough? How should they be arranged?
- If you swim faster, sweeping through the water like a net, can you catch more molecules?

In 1977 Howard Berg and Edward Purcell wrote a paper that works through these questions one by one. Berg was the first to watch *E. coli* swim in three dimensions, with a tracking microscope he built; Purcell was a physicist with a Nobel Prize for nuclear magnetic resonance. Their answers are unexpectedly elegant:

1. Receptors covering just **a thousandth** of the cell surface catch half of everything the cell could possibly catch.
2. Swimming, or stirring the water around you, **hardly helps at all**.
3. The precision of a measurement depends on one number only: how many **new** molecules you have caught.
4. Real *E. coli* operate **close to the limit that physics allows**.

Let's derive these four results step by step. All you need to know is that diffusion means molecules wandering at random; any other mathematics is explained where it comes up. Every figure can be dragged and adjusted; they are computed live in your browser from the formulas.

<p class="bp-cite">Reading: H. C. Berg &amp; E. M. Purcell, Physics of chemoreception, <a href="https://doi.org/10.1016/S0006-3495(77)85544-6">Biophys. J. 20, 193–219</a> (1977). Equation numbers follow the original.</p>

## <span class="num">1</span>How many molecules can a cell swallow per second?

Start with the simplest possible version. Forget the receptors and treat the cell as a "black hole" of radius $a$ that swallows every molecule touching its surface. Far away, the concentration stays at $c_\infty$. How many molecules does it swallow each second?

First, a guess. Double the cell's radius and its surface area goes up four times. Does it swallow four times as many molecules?

No. **Only twice as many.**

The reason is the depletion zone around the cell. The cell keeps eating, so right at its surface the molecules are used up and the concentration is close to zero; further out it climbs back towards $c_\infty$. Once things settle, the concentration at distance $r$ from the centre is

$$
c(r) = c_\infty\left(1 - \frac{a}{r}\right).
$$

Notice that it depends only on $r/a$. Make the cell twice as big and its depletion zone becomes twice as big too, with exactly the same shape (drag the cell radius in Fig. 2 below and watch the scale bar change).

Molecules diffuse in down the concentration gradient, at a rate proportional to how steep the gradient is. A wider depletion zone spreads the same drop in concentration over a longer distance, so the gradient at the surface is gentler, proportional to $c_\infty/a$. Multiply by the diffusion constant $D$ and the surface area $4\pi a^2$:

$$
J = D\cdot\frac{c_\infty}{a}\cdot 4\pi a^2 = 4\pi a D c_\infty. \tag{2}
$$

Area goes as $a^2$, the gradient as $1/a$; the current goes only as $a$.

With numbers: $a = 1\ \mu\text{m}$, $D = 10^{-5}\ \text{cm}^2/\text{s}$ (typical for a small molecule in water) and $c_\infty = 1\ \mu\text{M}$ give about $7\times10^{6}$ molecules a second. That is the most any cell of this size can get by diffusion, whatever it has on its surface.

### Another angle: the chance of being swallowed

Put a molecule at distance $r$ from the centre of the cell and let it wander. What is the chance that it eventually hits the cell?

The answer is startlingly simple:

$$
P_c = \frac{a}{r}. \tag{4}
$$

And it is not a separate result needing its own derivation. Look back at the concentration: $c(r)/c_\infty = 1 - a/r$ is exactly $1 - P_c$, the probability that a molecule starting at $r$ **gets away**.

That is no coincidence. "The concentration at $r$" and "the probability of escaping from $r$" obey the same equation (the steady diffusion equation) with the same boundary conditions: both are 0 at the cell surface (a molecule there is certainly swallowed) and both are 1 far away. Same equation, same boundaries, so the same function. **The concentration profile is really a map of the probability of escaping from each point.**

<figure class="mc-figure">
<div class="mc-figure-plot">
<div class="controls">
<div class="mc-slider"><label class="mc-slider-label" for="dz-a">Cell radius <span class="m">a</span></label><output class="mc-slider-value" id="dz-a-o"></output><input type="range" class="mc-range" id="dz-a" min="0" max="1000" step="1"></div>
<div class="mc-slider"><label class="mc-slider-label" for="dz-r">Where molecules are released, <span class="m">r</span></label><output class="mc-slider-value" id="dz-r-o"></output><input type="range" class="mc-range" id="dz-r" min="0" max="1000" step="1"></div>
</div>
<canvas id="dz-cv" height="300" aria-label="The depletion zone around a cell, and the paths of molecules released at r"></canvas>
<div id="dz-plot" style="margin-top:16px"></div>
<div class="readouts">
<div class="ro"><div class="k">Molecules swallowed per second (1 µM)</div><div class="v" id="dz-J">–</div></div>
<div class="ro"><div class="k">Surface area, relative to 1 µm</div><div class="v" id="dz-area">–</div><div class="t">∝ <span class="m">a</span>²</div></div>
<div class="ro"><div class="k">Gradient at the surface</div><div class="v" id="dz-grad">–</div><div class="t">∝ 1/<span class="m">a</span></div></div>
<div class="ro"><div class="k">Current</div><div class="v" id="dz-cur">–</div><div class="t">∝ <span class="m">a</span></div></div>
<div class="ro"><div class="k">Chance of capture <span class="m">a</span>/<span class="m">r</span></div><div class="v" id="dz-p">–</div><div class="t">of those released: <span id="dz-sim">–</span></div></div>
</div>
<div class="btns">
<button class="mc-btn mc-btn-md mc-btn-primary" id="dz-run">Release 40 molecules at r</button>
<button class="mc-btn mc-btn-md" id="dz-clear">Clear</button>
</div>
</div>
<figcaption class="mc-figure-cap">

<span class="mc-figure-num">Fig. 2</span> Top: a section through the cell and its depletion zone; deeper blue means higher concentration, and the dashed circles are where the concentration is back to 50% and 75% of its far-away value ($r = 2a$ and $4a$). Lengths are drawn in units of $a$, so changing the cell radius changes only the scale bar: the zone grows with the cell. Bottom: the concentration $c/c_\infty = 1 - a/r$ and the capture probability $a/r$, which add up to 1 everywhere. Release molecules to see what fraction of those starting at $r$ end up hitting the cell (blue dots mark where); the result is added below as a square. The molecules are stepped in three dimensions; once one wanders beyond $9a$, the exact probabilities decide whether it is gone for good or will come back and be swallowed.

</figcaption>
</figure>

There is something counter-intuitive about $a/r$: it falls off slowly. A molecule ten cell radii away still has a 10% chance of coming back to hit the cell. Now take a molecule that has just touched the cell and bounced a tiny distance $s$ off it, with $s$ much smaller than $a$. Its chance of hitting again is $a/(a+s)$, practically 1.

**A molecule that has touched the cell once comes back again, and again, and again.** That sentence is the key to the next section.

## <span class="num">2</span>A thousandth of the surface is enough

Real cells are not black holes. They catch molecules only with receptors, and the surface in between just bounces molecules off. Picture each receptor as a small circular patch of radius $s$ that catches anything touching it, with $N$ such patches on the cell.

How many patches does it take to come close to the black hole?

Intuition says: only the patches catch molecules, so the fraction of molecules caught should be the fraction of the surface they cover. To catch half, cover half.

In fact, with $a = 1\ \mu\text{m}$ and $s = 1\ \text{nm}$ (the typical size of a binding site), about 3,000 patches, covering **less than a thousandth** of the surface, already catch half of the black hole's limit.

### Why so few are enough

The key is that last sentence of section 1: a molecule that has touched the cell keeps coming back.

Call it one "try" when a molecule bounces off, gets further than $s$ from the surface, and lands on it again. Two contacts closer together than $s$ count as one, because they land in practically the same place: either both on a patch or neither. Each time it is $s$ away, the molecule comes back with probability $a/(a+s)$ and escapes for good with probability $s/(a+s)$. It is like tossing a very unfair coin that sends you out only $s/(a+s)$ of the time, and on average you get

$$
\bar n = \frac{a}{s} \tag{10}
$$

tosses. For $a = 1\ \mu\text{m}$ and $s = 1\ \text{nm}$ that is about **a thousand tries**. And every landing is somewhere else, so the tries spread over a large part of the cell surface.

Now do the accounting. The chance that a try lands on a patch is about the covered fraction $Ns^2/4a^2$. A thousand tries at a thousandth each already make capture likely. Done carefully, the fraction of molecules that are caught is

$$
\frac{J}{J_{\max}} = \frac{Ns}{Ns + 4a}, \tag{13}
$$

where $J_{\max} = 4\pi a D c_\infty$ is the black-hole limit. At $N = 4a/s$ the fraction is one half, while the covered fraction is only $s/a$: one thousandth.

Fig. 3 shows this happening. Panel b is a whole cell: molecules land on it again and again until one hits a receptor or escapes for good. Drag to turn the cell, and use the zoom to go all the way down to single receptors.

<figure class="mc-figure">
<div class="mc-figure-plot">
<p class="panel-title"><b>a</b>&ensp;What counts as a try</p>
<div id="sc-plot"></div>
<p class="panel-title"><b>b</b>&ensp;One molecule after another on a whole cell</p>
<div class="controls">
<div class="field"><label>Cell radius in patch radii, <span class="m">a/s</span></label><div class="seg" role="group" aria-label="Cell radius in patch radii"><button data-as="30" aria-pressed="false">30</button><button data-as="100" aria-pressed="true">100</button><button data-as="300" aria-pressed="false">300</button><button data-as="1000" aria-pressed="false">1000</button></div></div>
<div class="mc-slider"><label class="mc-slider-label" for="sp-x">Receptors <span class="m">N</span> (tick: <span class="m">N</span> = π<span class="m">a/s</span>)</label><output class="mc-slider-value" id="sp-x-o"></output><input type="range" class="mc-range" id="sp-x" min="0" max="1000" step="1"></div>
<div class="mc-slider"><label class="mc-slider-label" for="sp-rate">Speed</label><output class="mc-slider-value" id="sp-rate-o"></output><input type="range" class="mc-range" id="sp-rate" min="0" max="5" step="1" value="1"></div>
<div class="mc-slider"><label class="mc-slider-label" for="sp-zoom">Zoom</label><output class="mc-slider-value" id="sp-zoom-o"></output><input type="range" class="mc-range" id="sp-zoom" min="0" max="1000" step="1" value="0"></div>
</div>
<canvas id="sp-cv" height="360" aria-label="A cell seen from outside, with its receptors and the points where one molecule touches it"></canvas>
<div class="status" id="sp-status" aria-live="polite"></div>
<div class="btns">
<button class="mc-btn mc-btn-md" id="sp-play" aria-pressed="true">Pause</button>
<button class="mc-btn mc-btn-md" id="sp-next">Next molecule</button>
<button class="mc-btn mc-btn-md" id="sp-follow" aria-pressed="true">Follow the molecule</button>
</div>
<p class="panel-title"><b>c</b>&ensp;Fraction of molecules captured</p>
<div id="st-plot"></div>
<div class="readouts">
<div class="ro"><div class="k">Covered fraction <span class="m">Ns</span>²/4<span class="m">a</span>²</div><div class="v" id="st-cov">–</div></div>
<div class="ro"><div class="k">Molecules at this setting</div><div class="v" id="st-n">0</div></div>
<div class="ro"><div class="k">Mean tries per molecule</div><div class="v" id="st-tries">–</div><div class="t" id="st-tries-t"></div></div>
<div class="ro"><div class="k">Captured, simulation</div><div class="v" id="st-cap">–</div></div>
<div class="ro"><div class="k">Eq. 8 (exact)</div><div class="v" id="st-eq8">–</div><div class="t">Eq. 13 <span id="st-eq13"></span></div></div>
</div>
<div class="btns">
<button class="mc-btn mc-btn-md mc-btn-primary" id="st-run">Simulate 400 molecules</button>
<button class="mc-btn mc-btn-md" id="st-clear">Clear</button>
<span class="note" id="st-note"></span>
</div>
</div>
<figcaption class="mc-figure-cap">

<span class="mc-figure-num">Fig. 3</span> **a** What counts as a try (not to scale). A molecule that touches the surface at A, gets further than $s$ away and lands again at B has made two independent tries; C and D, closer together than $s$, belong to the same one. Each time it is $s$ away, it escapes for good with probability $s/(a+s)$. **b** Molecules arriving one at a time at a cell carrying $N$ receptors. Grey dots are where each try lands, joined in order; the ochre ring marks the receptor that finally catches the molecule. Seen whole, the receptors are smaller than a pixel and drawn as dots; zoom in to see them to scale. **c** The fraction of all molecules simulated so far that were caught, against the number of receptors in units of $\pi a/s$; the solid line is the exact Eq. 8, the dotted line the counting estimate Eq. 13. Points for every $a/s$ fall on one curve. The walk is stepped only within $s$ of the surface (steps of $0.2\,s$); beyond that, the molecule escapes or lands back on the surface according to the exact probabilities for Brownian motion outside a sphere.

</figcaption>
</figure>

### The exact answer: borrow from electricity

The counting above is an estimate. For the exact answer, physicists have a lovely shortcut.

The steady diffusion equation is $\nabla^2 c = 0$, the same equation the electric potential obeys in electrostatics. So every diffusion problem has an electrical twin: concentration plays the potential, the flow of molecules plays the current, and a surface that swallows molecules is an earthed conductor. In this dictionary, "how many molecules does this object swallow per second" becomes "what is the capacitance of a conductor of this shape":

$$
J = 4\pi C D c_\infty, \tag{3}
$$

with $C$ the capacitance in cgs units, which is a length. For a sphere $C$ is just its radius $a$, which gives back Eq. 2. Capacitances of all sorts of shapes have long been worked out, so many diffusion problems can simply be looked up. A small disk of radius $s$ that absorbs on one face, for example, swallows $J_1 = 4Dsc_\infty$: that is the rate for a single receptor patch.

What about $N$ patches spread over the cell? Here is a way to see the answer. To be caught, a molecule first has to **find the cell**, then **find a patch on it**. The two steps act like two resistors in series:

$$
\frac{1}{C} = \underbrace{\frac{1}{a}}_{\text{find the cell}} + \underbrace{\frac{\pi}{Ns}}_{\text{find a patch}}
\quad\Longrightarrow\quad
\frac{J}{J_{\max}} = \frac{Ns}{Ns + \pi a}. \tag{8}
$$

Compared with the counting estimate, 4 has become $\pi$. With few patches, the "find a patch" resistor dominates and every extra patch helps; once $N \gg \pi a/s$ the bottleneck is finding the cell at all, and more patches do nothing. The two resistors are equal at $N = \pi a/s$, where intake reaches half its maximum.

<figure class="mc-figure">
<div class="mc-figure-plot">
<div class="controls">
<div class="mc-slider"><label class="mc-slider-label" for="j-as"><span class="m">a/s</span></label><output class="mc-slider-value" id="j-as-o"></output><input type="range" class="mc-range" id="j-as" min="0" max="1000" step="1"></div>
<div class="mc-slider"><label class="mc-slider-label" for="j-n">Number of receptors <span class="m">N</span></label><output class="mc-slider-value" id="j-n-o"></output><input type="range" class="mc-range" id="j-n" min="0" max="1000" step="1"></div>
</div>
<div id="j-plot"></div>
<div class="readouts">
<div class="ro"><div class="k">Covered fraction</div><div class="v" id="j-cov">–</div></div>
<div class="ro"><div class="k">Patch spacing</div><div class="v" id="j-sp">–</div></div>
<div class="ro"><div class="k"><span class="m">J/J</span><sub>max</sub> dispersed</div><div class="v" id="j-d">–</div></div>
<div class="ro"><div class="k"><span class="m">J/J</span><sub>max</sub> in one patch</div><div class="v" id="j-c">–</div></div>
</div>
<div class="btns">
<button class="mc-btn mc-btn-md" data-jpre="0">A 1 µm cell</button>
<button class="mc-btn mc-btn-md" data-jpre="1"><span>Phage λ receptors on <i>E. coli</i></span></button>
</div>
</div>
<figcaption class="mc-figure-cap">

<span class="mc-figure-num">Fig. 4</span> Intake of a cell with $N$ receptor patches, relative to the black hole. The solid line is Eq. 8, the dotted line the counting estimate Eq. 13, and the dashed line what happens if the same total receptor area is gathered into one big patch. Spreading out matters far more than total area: at $N = \pi a/s$ the dispersed patches get half, one big patch only $1/\sqrt{N}$.

</figcaption>
</figure>

The dashed line in Fig. 4 makes a point that is easy to miss: **the patches have to be spread out**. Gather the area of 3,000 patches into one big patch and the intake drops to about 2% of the limit.

A few more consequences follow:

- A cell cannot usefully use many more than about $a/s$ receptors of one kind; beyond that, extra receptors barely help.
- Each kind of receptor covers only a tiny fraction of the surface, so one cell can carry hundreds of different kinds, each nearly as effective as if the whole surface were devoted to it.
- The best arrangement is maximal dispersal, with different kinds interleaved. Scattering them at random is almost as good: once $N$ is above about 50, random and uniform arrangements differ by only a few percent.

<div class="mc-callout"><div class="mc-callout-inner">

<span class="mc-callout-title">A real-world check: bacteriophages</span>

Bacteriophages are viruses that infect bacteria. They stick to bacteria at close to the diffusion limit of a black hole, even though their receptors cover only a small part of the bacterial surface. That used to be puzzling, and Eq. 8 explains it. In 1976 Schwartz grew *E. coli* carrying different numbers of receptors for phage λ and measured how fast the phage stuck to them; the data follow the shape of Eq. 8. The fit gives $\pi a/s \approx 483$: fewer than 500 receptors, covering 0.5% of the surface, bring adsorption to half its maximum (the second preset in Fig. 4).

</div></div>

A word on another strategy: let molecules stick loosely anywhere on the surface and slide along it until they meet a receptor. This is often called "reduction of dimensionality", the idea being that searching in two dimensions is easier than in three. Berg and Purcell point out that this is a little misleading. A molecule that reaches the surface has already finished the three-dimensional search, and its repeated bounces back onto the surface already scan it in a nearly two-dimensional way. Sticking and sliding only pays off when the molecule sticks firmly enough, with a binding energy above about 3 kcal/mol.

## <span class="num">3</span>Does swimming faster mean eating more?

Bacteria swim. A natural idea is that swimming brings them into contact with more molecules, the way running through rain gets you wetter. Or a bacterium could use its flagella to stir the water, bringing in water from further away where the concentration is higher.

Neither idea works in a bacterium's world, because that world is a completely different kind of fluid from ours.

The measure of the difference is the **Reynolds number** $R = Lv/\nu$, which compares the importance of inertia with that of viscosity ($L$ and $v$ are the size and speed of the object, $\nu$ the kinematic viscosity of the liquid). A swimming human has $R$ of about $10^4$ to $10^6$; *E. coli* has about $10^{-5}$. At that scale inertia hardly exists: if an *E. coli* stopped its flagella it would come to rest within $10^{-9}$ cm, less than the width of an atom.

**Swimming.** What is wrong with the rain analogy? Raindrops don't get out of your way, but molecules do. To move forward the cell must push the water ahead of it aside, and the molecules go aside with the water. On top of that, the cell carries with it a layer of water that is nearly still in its own frame, and every molecule must still cross that layer by diffusion.

Whether swimming helps depends on a dimensionless number, $av_0/D$: how many body lengths the cell swims in the time a molecule takes to diffuse across one. For a bacterium after a small nutrient molecule, it is only about 0.03, and swimming raises the intake by about 2.5%. To double it, the cell would have to swim at about 3 mm/s, a hundred times faster than it does.

The two ends of the range behave differently. At low speed the front half of the sphere gains about $1.5\,av_0/D$ and the back half loses the same, so the total rises only as the square of the speed: the gain cannot depend on the direction of motion, so it must be an even function of $v_0$. At high speed the intake grows slowly, as $(av_0/D)^{1/3}$. That front–back asymmetry will be useful again in section 5.

<figure class="mc-figure">
<div class="mc-figure-plot">
<div class="controls">
<div class="mc-slider"><label class="mc-slider-label" for="s-a">Cell radius <span class="m">a</span></label><output class="mc-slider-value" id="s-a-o"></output><input type="range" class="mc-range" id="s-a" min="0" max="1000" step="1"></div>
<div class="mc-slider"><label class="mc-slider-label" for="s-v">Swimming speed <span class="m">v</span>₀</label><output class="mc-slider-value" id="s-v-o"></output><input type="range" class="mc-range" id="s-v" min="0" max="1000" step="1"></div>
<div class="mc-slider"><label class="mc-slider-label" for="s-d">Diffusion constant <span class="m">D</span></label><output class="mc-slider-value" id="s-d-o"></output><input type="range" class="mc-range" id="s-d" min="0" max="1000" step="1"></div>
</div>
<div id="s-plot"></div>
<div class="readouts">
<div class="ro"><div class="k"><span class="m">av</span>₀/<span class="m">D</span></div><div class="v" id="s-pe">–</div></div>
<div class="ro"><div class="k">Gain in intake</div><div class="v" id="s-gain">–</div></div>
<div class="ro"><div class="k">Speed to double intake</div><div class="v" id="s-dbl">–</div><div class="t">about 2.5 <span class="m">D/a</span></div></div>
<div class="ro"><div class="k">Reynolds number <span class="m">av</span>₀/ν</div><div class="v" id="s-re">–</div></div>
<div class="ro"><div class="k">Power to swim, per volume</div><div class="v" id="s-pw">–</div><div class="t">9ηv₀²/2a²</div></div>
<div class="ro"><div class="k">Least power to stir</div><div class="v" id="s-st">–</div><div class="t">r₂ = 6a</div></div>
</div>
<div class="btns">
<button class="mc-btn mc-btn-md" data-swim="0">Bacterium, small nutrient</button>
<button class="mc-btn mc-btn-md" data-swim="1">Bacterium, phage-sized particle</button>
</div>
</div>
<figcaption class="mc-figure-cap">

<span class="mc-figure-num">Fig. 5</span> How much more an absorbing sphere swimming at speed $v_0$ collects than a stationary one. The solid curve is digitized from the numerical solution in the original paper ($0.02 \le av_0/D \le 10$); the dotted extensions follow its limits, a gain $\propto v_0^2$ at low speed and $J/J_0 \propto v_0^{1/3}$ at high speed. The marker is the cell set by the sliders. The power estimates assume the viscosity of water.

</figcaption>
</figure>

For large particles that diffuse slowly, though, swimming does help. A bacterium swimming at 15 µm/s doubles its uptake of something with a diffusion constant of $5\times10^{-8}\ \text{cm}^2/\text{s}$, roughly that of phage λ (the second preset in Fig. 5).

**Stirring.** To move molecules over a distance $L$ faster than diffusion does, stirring must be faster than $D/L$. Over one micrometre that is about a millimetre a second, faster than anything a bacterium does. Worse is the energy. Stirred water dissipates energy through viscosity, and Berg and Purcell estimated that doubling the intake costs, per unit volume of cell, at least

$$
\frac{S}{(4\pi/3)a^3} \ \ge\ \frac{12\,\eta D^2}{a^4}\left(\frac{r_2+2a}{r_2-2a}\right)^3, \tag{26}
$$

where $r_2$ is the outer edge of the stirred region. With $r_2 = 6a$, for a one-micrometre cell, that is about 0.1 W/cm³, more than ten thousand times the power it takes to swim. The bound falls steeply, as $a^{-4}$, so stirring can pay only for cells several to tens of micrometres across.

<figure class="mc-figure">
<div class="mc-figure-plot">
<div class="controls">
<div class="mc-slider"><label class="mc-slider-label" for="sk-d">Diffusion constant of the molecules, <span class="m">D</span></label><output class="mc-slider-value" id="sk-d-o"></output><input type="range" class="mc-range" id="sk-d" min="0" max="1000" step="1"></div>
</div>
<div id="sk-plot"></div>
<div class="readouts">
<div class="ro"><div class="k">Least power to stir, 1 µm cell</div><div class="v" id="sk-1">–</div></div>
<div class="ro"><div class="k">Relative to swimming</div><div class="v" id="sk-r">–</div></div>
<div class="ro"><div class="k">Radius where both cost the same</div><div class="v" id="sk-x">–</div></div>
</div>
</div>
<figcaption class="mc-figure-cap">

<span class="mc-figure-num">Fig. 6</span> The cost of stirring and of swimming, per unit volume of cell. The dashed line is the least power needed to double the intake by stirring (Eq. 26 with $r_2 = 6a$), falling as $a^{-4}$; the solid line is the power to swim at 30 µm/s, falling as $a^{-2}$. For a cell the size of a bacterium, stirring is tens of thousands of times more expensive. Lower the diffusion constant (large molecules, particles) and the cost of stirring drops sharply.

</figcaption>
</figure>

The conclusion: in a uniform environment, moving around barely lets a bacterium eat any more. The real value of motion is when the environment is **not** uniform: the cell can head for better places. And to know which way is better, it has to compare concentrations in different places or at different times. In other words, it has to **measure** concentration.

## <span class="num">4</span>Counting molecules: how good can a measurement be?

Back to the opening question: how accurately can a bacterium measure a concentration?

### An ideal instrument

First imagine an ideal instrument that can see every molecule inside a ball of radius $a$ and tell you, at any moment, how many there are.

A single count has the Poisson error $\sqrt{m}$. As we saw, a one-micrometre ball at 1 µM holds about 2,500 molecules, so one count is good to about 2%. To do better you count several times and average. But counting again right away is useless: it is the same molecules. You have to wait until they have left and a new set has come in, which takes about $a^2/D$, roughly a millisecond for one micrometre. So in a time $T$ you get about $TD/a^2$ independent counts, and the relative error is of order $(TD\bar c a)^{-1/2}$. The exact calculation gives

$$
\frac{\Delta c_{\text{rms}}}{\bar c} = \left(\frac{5\pi}{3}\,T D \bar c a\right)^{-1/2}. \tag{41}
$$

Notice that the precision depends on the radius $a$, not the volume. A bigger volume holds more molecules but takes longer to refresh; the two effects cancel down to $Da\bar c$, the same combination that set the diffusive current $J$. For one micrometre at 1 µM, this ideal instrument reaches 1% in a few milliseconds.

### One receptor

A bacterium has no such instrument. All it can "see" is whether its receptors are empty or occupied.

A receptor's binding site holds at most one molecule. Its state $p(t)$ jumps between 0 (empty) and 1 (occupied), like a random telegraph signal (Fig. 7). When occupied, the molecule leaves at rate $1/\tau_b$; when empty, it is filled at rate $4Dsc$, which is exactly how fast a small absorber of radius $s$ swallows molecules. The higher the concentration, the larger the fraction of time the receptor is occupied:

$$
\bar p = \frac{c}{c + c_{1/2}},
$$

where $c_{1/2}$ is the concentration that keeps the receptor occupied half the time. The cell averages $p(t)$ over a time $T$ to estimate $\bar p$, and works back to $c$. The binding time $\tau_b$ is usually short, under a millisecond for $c_{1/2} = 1\ \mu\text{M}$, so during $T$ the receptor fills and empties many times, each one a sample. The calculation gives

$$
\frac{\Delta c_{\text{rms}}}{\bar c} = \left(\frac{2\tau_b}{T\bar p}\right)^{1/2}. \tag{51}
$$

<figure class="mc-figure">
<div class="mc-figure-plot">
<div class="controls">
<div class="mc-slider"><label class="mc-slider-label" for="t-x">Concentration <span class="m">c</span>/<span class="m">c</span><sub>1/2</sub></label><output class="mc-slider-value" id="t-x-o"></output><input type="range" class="mc-range" id="t-x" min="0" max="1000" step="1"></div>
<div class="mc-slider"><label class="mc-slider-label" for="t-T">Averaging time <span class="m">T</span>/τ<sub>b</sub></label><output class="mc-slider-value" id="t-T-o"></output><input type="range" class="mc-range" id="t-T" min="0" max="1000" step="1"></div>
</div>
<canvas id="t-cv" height="190" aria-label="Receptor occupancy over time with its running average"></canvas>
<div class="cv-label">Occupancy <span class="m">p</span>(<span class="m">t</span>) in grey, running average in blue, true mean occupancy dotted.</div>
<div class="readouts">
<div class="ro"><div class="k">New molecules bound, ν</div><div class="v" id="t-nu">–</div><div class="t" id="t-nu-t"></div></div>
<div class="ro"><div class="k">Time-averaged occupancy</div><div class="v" id="t-pT">–</div><div class="t" id="t-pbar"></div></div>
<div class="ro"><div class="k">Estimated <span class="m">c</span>/<span class="m">c</span><sub>1/2</sub></div><div class="v" id="t-est">–</div></div>
<div class="ro"><div class="k">Expected error (ν/2)<sup>−1/2</sup></div><div class="v" id="t-err">–</div></div>
</div>
<div class="btns">
<button class="mc-btn mc-btn-md mc-btn-primary" id="t-new">Measure again</button>
</div>
</div>
<figcaption class="mc-figure-cap">

<span class="mc-figure-num">Fig. 7</span> One receptor watched for a time $T$. Each upward step is a new molecule binding. The more molecules are counted, the more tightly the running average settles. Press "Measure again" a few times and watch the estimate jump around the true value.

</figcaption>
</figure>

Eq. 51 looks unremarkable, but substitute the relation between $\tau_b$ and $\bar p$ and it turns into something surprisingly simple:

$$
\frac{\Delta c_{\text{rms}}}{\bar c} = \left(\frac{\nu}{2}\right)^{-1/2}, \qquad \nu = 4Ds\bar c\,(1-\bar p)\,T. \tag{52, 53}
$$

What is $\nu$? $4Ds\bar c$ is the rate at which new molecules arrive, $(1-\bar p)$ the fraction of time the receptor is free to take them, times $T$: $\nu$ is **the number of different molecules that have bound to the receptor** during the measurement.

<div class="mc-callout mc-callout-key"><span class="mc-seal" aria-hidden="true"></span><div class="mc-callout-inner">

<span class="mc-callout-title">Only new molecules count</span>

The precision depends on how many **different** molecules were counted, and on nothing else. A molecule that leaves the receptor and comes straight back brings no new information. Diffusion has no memory: where a molecule goes next depends only on where it is now, so a returning molecule tells you nothing you didn't already know. News about the concentration outside can only come from molecules that are new arrivals from outside.

</div></div>

<figure class="mc-figure">
<div class="mc-figure-plot">
<div id="e-plot"></div>
<div class="btns">
<button class="mc-btn mc-btn-md mc-btn-primary" id="e-run">Run 300 measurements at each T</button>
<span class="note" id="e-note">Uses the concentration set in Fig. 7.</span>
</div>
</div>
<figcaption class="mc-figure-cap">

<span class="mc-figure-num">Fig. 8</span> Repeat the measurement of Fig. 7 many times, take the relative error of the estimates, and plot it against the number of new molecules counted, for averaging times from 10 to 3,000 $\tau_b$. Every point lands on the dotted line $(\nu/2)^{-1/2}$.

</figcaption>
</figure>

How good is one receptor? It is equivalent to an ideal instrument that can see only a region about as big as the receptor itself. With $c_{1/2} = \bar c = 1\ \mu\text{M}$ and $s = 1\ \text{nm}$, a single receptor needs about 17 seconds to measure the concentration to 1%. Far too slow.

### Thousands of receptors counting together

A cell has thousands of receptors. How much faster are they together?

The catch is that receptors are not independent: a molecule just released by one is well placed to wander into its neighbour, so neighbouring receptors are correlated, in a way that is almost impossible to calculate directly.

"Only new molecules count" comes to the rescue. We don't need to follow each receptor; we only need to ask how fast new molecules, ones that have never been caught by any receptor on this cell, arrive. That is the $J$ of section 2, times the fraction of time receptors are free, $(1-\bar p)$. Arrivals of different new molecules are independent, so $N$ receptors watched for $T$ seconds are equivalent to one receptor watched for $NT$:

$$
\frac{\Delta c_{\text{rms}}}{\bar c} = \left[\tfrac12 TJ(1-\bar p)\right]^{-1/2} = \left[\frac{2\pi TD\bar c\,Nsa(1-\bar p)}{Ns+\pi a}\right]^{-1/2}. \tag{55}
$$

The cell doesn't need to know which molecules are new. The statement is only that the statistical precision it can extract from its receptors is the same as if it recorded new molecules alone.

With $N = \pi a/s$ receptors, the number at which intake reached half in section 2, the whole cell is equivalent to an ideal instrument of radius about $\tfrac35(1-\bar p)a$, nearly as big as the cell. **A few thousand receptors covering a thousandth of the surface measure almost as well as an ideal instrument that could see every molecule around the cell.**

<figure class="mc-figure">
<div class="mc-figure-plot">
<div class="controls">
<div class="mc-slider"><label class="mc-slider-label" for="m-a">Cell radius <span class="m">a</span></label><output class="mc-slider-value" id="m-a-o"></output><input type="range" class="mc-range" id="m-a" min="0" max="1000" step="1"></div>
<div class="mc-slider"><label class="mc-slider-label" for="m-n">Receptors <span class="m">N</span></label><output class="mc-slider-value" id="m-n-o"></output><input type="range" class="mc-range" id="m-n" min="0" max="1000" step="1"></div>
<div class="mc-slider"><label class="mc-slider-label" for="m-c">Concentration <span class="m">c̄</span></label><output class="mc-slider-value" id="m-c-o"></output><input type="range" class="mc-range" id="m-c" min="0" max="1000" step="1"></div>
<div class="mc-slider"><label class="mc-slider-label" for="m-k">Dissociation constant <span class="m">K</span></label><output class="mc-slider-value" id="m-k-o"></output><input type="range" class="mc-range" id="m-k" min="0" max="1000" step="1"></div>
</div>
<div id="m-plot"></div>
<p class="note">Patch radius <span class="m">s</span> = 1 nm, <span class="m">D</span> = 10⁻⁵ cm² s⁻¹, 1 M = 6 × 10²⁰ cm⁻³. Mean occupancy <span id="m-p"></span>.</p>
</div>
<figcaption class="mc-figure-cap">

<span class="mc-figure-num">Fig. 9</span> How long it takes to measure a concentration to 1%: one receptor (Eq. 52), a cell with $N$ receptors (Eq. 55), and an ideal instrument the size of the cell (Eq. 41). At the default values one receptor needs 17 seconds; a cell with 3,000 receptors needs about 0.01 s, more than a thousand times faster.

</figcaption>
</figure>

## <span class="num">5</span>Back to *E. coli*

Now we can answer the opening question.

*E. coli* forages in a peculiar way. It swims smoothly in a straight line for a while (a "run"), then spins in place for a moment (a "tumble") and sets off in a new, random direction. If it senses the concentration rising, it extends the run; if falling, it tumbles sooner. A run usually lasts about a second. And even without tumbling, the thermal jostling of water molecules scrambles its heading within a few seconds. So it has to reach each decision within **about a second**, or the information is out of date.

It decides by **temporal comparison**: measure for a time $T$, measure for another $T$, and check whether the difference beats the error. With the error from Eq. 55, the shortest $T$ at which a difference shows is

$$
T > \left[\pi a D\left(\frac{Ns}{Ns+\pi a}\right)\left(\frac{\bar c\, c_{1/2}}{\bar c + c_{1/2}}\right)\left(\frac{1}{\bar c}\frac{\partial \bar c}{\partial t}\right)^2\right]^{-1/3}. \tag{58}
$$

A bacterium swimming through a gradient in space sees a gradient in time, $(1/\bar c)\,\partial\bar c/\partial t = (v/\bar c)\,\partial\bar c/\partial x$, and one comparison takes two measurements, $2T$ in all.

Put in the conditions of a few classic chemotaxis experiments (the presets of Fig. 11) and $2T$ comes out at 0.09 s for glutamate, 0.27 s for serine, and 0.6 s and 1.4 s for the threshold experiments with α-methylaspartate and galactose. All around a second, just the time *E. coli* has.

Fig. 10 draws this "time window" with a simple model. Measure too slowly and the cell has changed direction before the answer is in: the information is stale. Measure too fast and too few molecules are counted: the answer is drowned in noise.

<figure class="mc-figure">
<div class="mc-figure-plot">
<div class="controls">
<div class="mc-slider"><label class="mc-slider-label" for="rt-T">Time for one comparison, 2<span class="m">T</span></label><output class="mc-slider-value" id="rt-T-o"></output><input type="range" class="mc-range" id="rt-T" min="0" max="1000" step="1"></div>
<div class="mc-slider"><label class="mc-slider-label" for="rt-g">Gradient (1/<span class="m">c</span>) ∂<span class="m">c</span>/∂<span class="m">x</span></label><output class="mc-slider-value" id="rt-g-o"></output><input type="range" class="mc-range" id="rt-g" min="0" max="1000" step="1"></div>
</div>
<canvas id="rt-cv" height="260" aria-label="Tracks of 24 bacteria in a concentration gradient over 60 seconds"></canvas>
<div id="rt-plot" style="margin-top:16px"></div>
<div class="readouts">
<div class="ro"><div class="k">Mean drift up the gradient</div><div class="v" id="rt-drift">–</div></div>
<div class="ro"><div class="k">Shortest 2<span class="m">T</span> allowed by noise (Eq. 58)</div><div class="v" id="rt-tmin">–</div></div>
<div class="ro"><div class="k">Usable window</div><div class="v" id="rt-win">–</div></div>
</div>
<div class="btns">
<button class="mc-btn mc-btn-md" id="rt-again">Run again</button>
</div>
</div>
<figcaption class="mc-figure-cap">

<span class="mc-figure-num">Fig. 10</span> A toy model. Bacteria swim at 20 µm/s and tumble about once a second into a completely random new direction; while swimming, their heading also drifts slowly through thermal motion. Each keeps comparing the average concentration over the last $T$ with the $T$ before: if it went up, it tumbles less (about 0.5 times a second), if down, more (about twice a second). Top: tracks of 24 bacteria over 60 s, with more attractant to the right; the blue line is their mean end point. Bottom: the longer one comparison takes ($2T$), the staler the information and the weaker the drift to the right (each point averages 160 bacteria). In the grey region $2T$ is too short: by Eq. 58, a cell the size of *E. coli* at a concentration of 1 mM cannot yet tell the gradient from noise. The shallower the gradient, the wider the grey region and the narrower the window left. The comparison itself is noise-free in this model; the cost of noise appears only as the grey region.

</figcaption>
</figure>

In other words, **at the faintest gradients a bacterium can follow, its measurement time is almost the shortest that physics allows.** If it needed a few times longer, it could not do chemotaxis at all. Berg and Purcell concluded that the chemotaxis machinery of *E. coli* is close to optimal. That implies its receptors must be spread over the whole surface rather than clustered at the base of the flagella, and that nearly every molecule caught contributes to the signal that steers the flagella.

### Why not compare front and back?

Instead of comparing before and after, a bacterium could compare its front half with its back half, as we use two ears to locate a sound. This **spatial comparison** needs a time

$$
T > \left[\tfrac12\pi a^3 D\left(\frac{Ns}{Ns+\pi a}\right)\left(\frac{\bar c\, c_{1/2}}{\bar c + c_{1/2}}\right)\left(\frac{1}{\bar c}\frac{\partial \bar c}{\partial x}\right)^2\right]^{-1}, \tag{60}
$$

which shrinks rapidly with cell size, as $a^{-3}$. For *E. coli* in the serine experiment it comes to about 1.7 seconds; on timing alone, not out of the question.

The real obstacle is the loose end from section 3: a swimming cell collects more molecules at its front than at its back anyway. That front–back difference looks just like a gradient, one with a decay length of $D/3v$. In the serine experiment this "fake gradient" is about 600 times steeper than the real one. Picking out the real gradient would be like hearing a whisper in a gale. So small bacteria can only compare over time.

<figure class="mc-figure">
<div class="mc-figure-plot">
<div class="formgrid">
<div class="field"><label for="c-preset">Experiment</label><select id="c-preset"></select></div>
<div class="field"><label>Gradient given as</label><div class="seg" role="group" aria-label="Gradient type"><button id="c-mode-x" aria-pressed="true">spatial</button><button id="c-mode-t" aria-pressed="false">temporal</button></div></div>
</div>
<div class="formgrid">
<div class="field"><label for="c-a">Cell radius <span class="m">a</span> [µm]</label><input id="c-a" inputmode="decimal"></div>
<div class="field"><label for="c-D"><span class="m">D</span> [cm² s⁻¹]</label><input id="c-D" inputmode="decimal"></div>
<div class="field"><label for="c-c">Mean concentration <span class="m">c̄</span> [M]</label><input id="c-c" inputmode="decimal"></div>
<div class="field"><label for="c-h"><span class="m">c</span><sub>1/2</sub> [M]</label><input id="c-h" inputmode="decimal"></div>
<div class="field" id="c-gx-f"><label for="c-gx">(1/<span class="m">c̄</span>) ∂<span class="m">c̄</span>/∂<span class="m">x</span> [cm⁻¹]</label><input id="c-gx" inputmode="decimal"></div>
<div class="field" id="c-v-f"><label for="c-v">Speed <span class="m">v</span> [µm s⁻¹]</label><input id="c-v" inputmode="decimal"></div>
<div class="field" id="c-gt-f" hidden><label for="c-gt">(1/<span class="m">c̄</span>) ∂<span class="m">c̄</span>/∂<span class="m">t</span> [s⁻¹]</label><input id="c-gt" inputmode="decimal"></div>
<div class="field"><label for="c-f"><span class="m">Ns</span>/(<span class="m">Ns</span>+π<span class="m">a</span>)</label><input id="c-f" inputmode="decimal"></div>
</div>
<div class="readouts">
<div class="ro"><div class="k">Temporal, 2<span class="m">T</span> (Eq. 58)</div><div class="v" id="c-tt">–</div></div>
<div class="ro"><div class="k">Spatial, <span class="m">T</span> (Eq. 60)</div><div class="v" id="c-ts">–</div></div>
<div class="ro"><div class="k">"Fake gradient" length <span class="m">D</span>/3<span class="m">v</span></div><div class="v" id="c-la">–</div><div class="t" id="c-lr"></div></div>
<div class="ro wide"><div class="k">The original paper reports</div><div class="v small" id="c-paper">–</div></div>
</div>
<div id="c-plot" style="margin-top:16px"></div>
</div>
<figcaption class="mc-figure-cap">

<span class="mc-figure-num">Fig. 11</span> The shortest measurement times for several classic chemotaxis experiments, and how they change with cell size when everything else is fixed. Temporal comparison (solid) falls only as $a^{-1/3}$, spatial comparison (dashed) as $a^{-3}$, which is why big cells are better at spatial comparison. Edit the numbers directly, or switch to "temporal" to give a gradient in time. The serine experiment gives no mean concentration; $\bar c = c_{1/2}$ is used here because it reproduces the paper's 0.27 s.

</figcaption>
</figure>

For much larger cells the balance tips the other way. The slime mould *Dictyostelium* is about 5 micrometres in radius and crawls slowly (about 0.2 µm/s). In a gradient of cyclic AMP, spatial comparison needs about 16 seconds, and temporal comparison about 17. This analysis alone cannot tell which one it uses. (In this example the original paper gives the two gradient lengths as 0.8 cm and 1.2 cm; with its own inputs they come out as 0.8 mm and 1.2 mm. The ratio and the conclusion are unchanged.)

One thing holds for every case, and it is the plainest and deepest conclusion of the paper: **however it is done, measuring a concentration takes time.** That is not a failing of biochemistry; it is a limit set by diffusion and statistical fluctuation themselves.

## Recap

- A cell of radius $a$ can swallow at most $4\pi a D c_\infty$ molecules a second by diffusion, proportional to its radius, not its area, because the depletion zone grows with the cell.
- A molecule that touches the cell comes back about $a/s$ times, so a few thousand receptors covering a thousandth of the surface catch half the molecules, provided they are spread out.
- For something as small as a bacterium, neither swimming nor stirring brings in more food.
- Precision depends only on how many new molecules are counted; a few thousand receptors together nearly match an ideal instrument that sees every molecule around the cell.
- *E. coli* makes a comparison in about a second, right up against the physical limit.

## What came later

The "Berg–Purcell limit" became one of the most quoted results in biophysics. It has been extended to receptors with detailed chemical kinetics, and cleverer read-outs were found: counting only how long the receptor stays empty halves the square of the error. From bacterial chemotaxis to embryos reading the concentration of morphogens during development, biological systems keep turning out to work not far from this limit.

<div class="bp-refs">

## References

<p>Berg, H. C. &amp; Purcell, E. M. (1977). Physics of chemoreception. <i>Biophysical Journal</i> 20, 193–219. <a href="https://doi.org/10.1016/S0006-3495(77)85544-6">doi:10.1016/S0006-3495(77)85544-6</a></p>
<p>Purcell, E. M. (1977). Life at low Reynolds number. <i>American Journal of Physics</i> 45, 3–11.</p>
<p>Bialek, W. &amp; Setayeshgar, S. (2005). Physical limits to biochemical signaling. <i>PNAS</i> 102, 10040–10045.</p>
<p>Endres, R. G. &amp; Wingreen, N. S. (2009). Maximum likelihood and the single receptor. <i>Physical Review Letters</i> 103, 158101.</p>
<p>Experiments used in the text: Schwartz (1976), <i>J. Mol. Biol.</i> 103, 521–536 (phage λ adsorption); Brown &amp; Berg (1974), <i>PNAS</i> 71, 1388–1392 (glutamate); Dahlquist, Elwell &amp; Lovely (1976), <i>J. Supramol. Struct.</i> 4, 329–342 (serine); Mesibov, Ordal &amp; Adler (1973), <i>J. Gen. Physiol.</i> 62, 203–223 (α-methylaspartate, galactose); Mato et al. (1975), <i>PNAS</i> 72, 4991–4993 (cyclic AMP).</p>
<p>The curve in Fig. 5 is digitized from Fig. 4 of the original paper; all other figures are computed live in the browser from the formulas.</p>

</div>

<script src="/posts/berg-purcell-1977/figures.js" defer></script>
