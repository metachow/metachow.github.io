---
title: "细菌怎样“数”分子：化学感受的物理"
date: 2026-11-08
tags: [biophysics, papers, interactive]
cover: ../../assets/posts/berg-purcell-1977/cover.png
description: 一个两微米长的大肠杆菌，怎么知道哪边的糖更多？跟着 Berg 与 Purcell 1977 年的经典论证，从扩散一路推到细菌感知能力的物理极限。文中的图都可以动手调。
---

<link rel="stylesheet" href="/posts/berg-purcell-1977/figures.css">

*English version: [How a bacterium counts molecules](/post/berg-purcell-1977/)*

想象你是一个大肠杆菌。

你大约两微米长，靠身后的几根鞭毛推着走，每秒能游 30 微米，相当于每秒十几个身长。你饿了。附近某处有糖，可你不知道它在哪边。

你没有眼睛，也没有鼻子。你有的，是分布在细胞表面的几千个受体。每个受体一次只能抓住一个糖分子，抓一会儿又放掉。你唯一能做的，就是**数**：这一刻有多少受体被占着，过一会儿又有多少。数字在变大，说明你正游向糖多的地方，那就接着游；数字在变小，就停下来翻个跟头，换个方向再试。

听起来不难。可是算一算就会发现，这件事难得惊人。

设糖的浓度是 1 µM（每升一微摩尔，细胞里很常见的浓度）。一个和你差不多大、半径 1 微米的小水球里，平均只有大约 **2500 个**糖分子。想分辨出浓度高了 1%，就得在 2500 个分子里看出 25 个分子的差别。可这些分子一刻不停地乱跑、进进出出，光是随机涨落就有 $\sqrt{2500} = 50$ 个左右，比你要找的信号还大一倍。

<figure class="mc-figure">
<div class="mc-figure-plot">
<div class="controls">
<div class="mc-slider"><label class="mc-slider-label" for="cn-n">取平均的独立计数次数 <span class="m">n</span></label><output class="mc-slider-value" id="cn-n-o"></output><input type="range" class="mc-range" id="cn-n" min="0" max="1000" step="1"></div>
</div>
<div id="cn-plot"></div>
<div class="readouts">
<div class="ro"><div class="k">平均后的涨落</div><div class="v" id="cn-sd">–</div><div class="t">50/√<span class="m">n</span></div></div>
<div class="ro"><div class="k">猜对哪个浓度更高的概率</div><div class="v" id="cn-ok">–</div></div>
<div class="ro"><div class="k">理想仪器需要的时间</div><div class="v" id="cn-t">–</div><div class="t">每次独立计数约 1 ms</div></div>
</div>
</div>
<figcaption class="mc-figure-cap">

<span class="mc-figure-num">图 1</span>　一个半径 1 微米的小球里，浓度为 1 µM 时平均有 2500 个分子（蓝色实线），浓度高 1% 时平均有 2525 个（赭黄虚线）。曲线是数 $n$ 次取平均得到的数的分布，灰色是两者重叠、会被弄混的部分。只数一次，你只有六成把握说对哪个浓度更高，比瞎猜好不了多少。拖动滑动条，看要数多少次两条曲线才分得开。时间按每 1 毫秒能做一次独立计数估算，第 4 节会解释这个数是怎么来的。

</figcaption>
</figure>

所以只数一次是不够的，你必须反复数、取平均。问题来了：

- 要数多久，才能把 1% 的差别数清楚？
- 要多少个受体？几千个够吗？该怎么排？
- 如果游得快一点，像拿网兜捞鱼一样，能不能多“捞”到一些分子？

1977 年，Howard Berg 和 Edward Purcell 合写了一篇论文，把这些问题一个一个算清楚了。Berg 是第一个用三维跟踪显微镜看清大肠杆菌怎么游泳的人；Purcell 是物理学家，因为核磁共振拿过诺贝尔奖。他们得到的答案出人意料地漂亮：

1. 受体只要覆盖细胞表面的**千分之一**，就能抓到最多可能抓到的分子的一半。
2. 游泳和搅动周围的水，几乎**帮不上忙**。
3. 测量的精度只取决于一个数：抓到过多少个**新**分子。
4. 真实的大肠杆菌，已经**接近物理定律允许的极限**。

下面我们一步步把这四个结论推出来。你只需要知道“扩散”就是分子在随机乱走，其余用到的数学都会在用到的地方讲清楚。文中的图都可以拖动、调参数，它们是按公式在你的浏览器里实时算出来的。

<p class="bp-cite">精读：H. C. Berg &amp; E. M. Purcell, Physics of chemoreception, <a href="https://doi.org/10.1016/S0006-3495(77)85544-6">Biophys. J. 20, 193–219</a> (1977)。公式编号与原文一致。</p>

## <span class="num">1</span>一个细胞每秒能吞下多少分子

先把问题简化到极致：忘掉受体，假设细胞是一个半径为 $a$ 的“黑洞”，任何碰到它表面的分子都会被吞掉。远处的浓度保持为 $c_\infty$。它每秒能吞下多少个分子？

先来猜一猜：把细胞的半径加倍，表面积变成 4 倍，吞下的分子是不是也变成 4 倍？

答案是：**只变成 2 倍**。

原因在于细胞周围的“耗尽区”。细胞不停地吞分子，紧贴表面的地方分子被吃光了，浓度接近零；离得越远，浓度越接近 $c_\infty$。稳定下来以后，浓度随到细胞中心的距离 $r$ 这样分布：

$$
c(r) = c_\infty\left(1 - \frac{a}{r}\right).
$$

注意它只依赖于比值 $r/a$。细胞大一倍，耗尽区也跟着大一倍，形状一模一样（在下面图 2 里拖动细胞半径，看比例尺怎么变）。

分子顺着浓度梯度扩散过来，流量正比于浓度变化有多陡。耗尽区被拉宽，同样的浓度落差就摊在更长的距离上，表面处的梯度变缓，正比于 $c_\infty/a$。乘上扩散系数 $D$ 和表面积 $4\pi a^2$：

$$
J = D\cdot\frac{c_\infty}{a}\cdot 4\pi a^2 = 4\pi a D c_\infty. \tag{2}
$$

表面积 $\propto a^2$，梯度 $\propto 1/a$，乘起来，分子流只 $\propto a$。

代入数字：$a = 1\ \mu\text{m}$，$D = 10^{-5}\ \text{cm}^2/\text{s}$（小分子在水里的典型值），$c_\infty = 1\ \mu\text{M}$，得到每秒约 $7\times10^{6}$ 个分子。这是一个细胞靠扩散能拿到的上限：不管表面装了什么，都不可能比这更多。

### 换个角度：一个分子被吞掉的概率

在离细胞中心 $r$ 处放一个分子，任它乱走。它最终撞上细胞的概率是多少？

答案简单得惊人：

$$
P_c = \frac{a}{r}. \tag{4}
$$

而且它不是另一个需要单独推导的结果。回头看浓度：$c(r)/c_\infty = 1 - a/r$，正好是 $1 - P_c$，也就是从 $r$ 出发**逃得掉**的概率。

这不是巧合。“$r$ 处的浓度”和“从 $r$ 出发最终逃走的概率”满足同一个方程（稳态扩散方程），边界条件也一样：贴着细胞表面都是 0（表面上的分子必然被吞），到无穷远都是 1。同一个方程、同样的边界条件，解只能是同一个函数。**浓度分布，其实就是一张“从这里出发能逃走的概率”的地图。**

<figure class="mc-figure">
<div class="mc-figure-plot">
<div class="controls">
<div class="mc-slider"><label class="mc-slider-label" for="dz-a">细胞半径 <span class="m">a</span></label><output class="mc-slider-value" id="dz-a-o"></output><input type="range" class="mc-range" id="dz-a" min="0" max="1000" step="1"></div>
<div class="mc-slider"><label class="mc-slider-label" for="dz-r">放出分子的位置 <span class="m">r</span></label><output class="mc-slider-value" id="dz-r-o"></output><input type="range" class="mc-range" id="dz-r" min="0" max="1000" step="1"></div>
</div>
<canvas id="dz-cv" height="300" aria-label="细胞周围的耗尽区，以及从 r 处放出的分子的轨迹"></canvas>
<div id="dz-plot" style="margin-top:16px"></div>
<div class="readouts">
<div class="ro"><div class="k">每秒吞下的分子（1 µM）</div><div class="v" id="dz-J">–</div></div>
<div class="ro"><div class="k">表面积，相对 1 µm</div><div class="v" id="dz-area">–</div><div class="t">∝ <span class="m">a</span>²</div></div>
<div class="ro"><div class="k">表面处的浓度梯度</div><div class="v" id="dz-grad">–</div><div class="t">∝ 1/<span class="m">a</span></div></div>
<div class="ro"><div class="k">分子流</div><div class="v" id="dz-cur">–</div><div class="t">∝ <span class="m">a</span></div></div>
<div class="ro"><div class="k">被捕获的概率 <span class="m">a</span>/<span class="m">r</span></div><div class="v" id="dz-p">–</div><div class="t">放出的分子里：<span id="dz-sim">–</span></div></div>
</div>
<div class="btns">
<button class="mc-btn mc-btn-md mc-btn-primary" id="dz-run">从 r 处放出 40 个分子</button>
<button class="mc-btn mc-btn-md" id="dz-clear">清空</button>
</div>
</div>
<figcaption class="mc-figure-cap">

<span class="mc-figure-num">图 2</span>　上：细胞的截面和它周围的耗尽区，蓝色越深浓度越高，虚线是浓度降到远处 50% 和 75% 的位置（$r = 2a$ 和 $4a$）。图中的长度以 $a$ 为单位，改变细胞半径时只有比例尺在变：耗尽区和细胞一起缩放。下：浓度 $c/c_\infty = 1 - a/r$ 与被捕获的概率 $a/r$，两条曲线相加处处为 1。点“放出分子”，看从 $r$ 出发的分子有多大比例最终撞上细胞（蓝点是撞上的位置）；结果作为方块记在下图里。分子在三维空间里一步步模拟，走到 $9a$ 以外时按精确的概率决定它是一去不回，还是终将回来被吞掉。

</figcaption>
</figure>

$a/r$ 有个反直觉的地方：它衰减得很慢。离细胞 10 个半径远的分子，仍然有 10% 的机会回来撞上它。再看一个刚刚碰过细胞、被弹开一点点的分子：它离表面只有 $s$，而 $s$ 远小于 $a$，它再撞回来的概率是 $a/(a+s)$，几乎就是 1。

**碰过细胞一次的分子，会一次又一次地回来**。这句话是下一节的钥匙。

## <span class="num">2</span>千分之一的表面就够了

真实的细胞不是黑洞。它只能靠受体抓分子，受体之间的表面只会把分子弹开。把每个受体想成一个半径为 $s$ 的小圆斑，碰到就被抓走；细胞上一共有 $N$ 个这样的斑。

要多少个斑，才能接近黑洞的速度？

直觉会说：只有斑能抓分子，那斑占多大比例的表面，就该抓到多大比例的分子。要抓到一半，就得盖住一半的表面。

实际上，取 $a = 1\ \mu\text{m}$、$s = 1\ \text{nm}$（结合位点的典型大小），只要大约 3000 个斑，覆盖**不到千分之一**的表面，就能抓到黑洞上限的一半。

### 为什么这么少就够

钥匙就是上一节最后那句话：碰过细胞的分子会反复回来。

把分子被弹开、离开表面超过 $s$、再落回表面，算作一次“尝试”。两次接触如果离得比 $s$ 还近，只算一次，因为它们几乎落在同一个地方，要么都在斑上，要么都不在。每次离开到 $s$ 远，分子回来的概率是 $a/(a+s)$，彻底逃走的概率是 $s/(a+s)$。这就像反复抛一枚极不公平的硬币，每次只有 $s/(a+s)$ 的机会“出局”，平均能抛

$$
\bar n = \frac{a}{s} \tag{10}
$$

次。对 $a = 1\ \mu\text{m}$、$s = 1\ \text{nm}$，这是大约**一千次**尝试。而且每次落回来的位置都不一样，会散布在细胞表面很大的一片区域上。

现在算账：每次尝试落在斑上的概率，约等于斑的覆盖率 $Ns^2/4a^2$。一千次尝试、每次千分之一的机会，被抓住的可能性就已经很大了。把账算清楚，被抓住的分子比例是

$$
\frac{J}{J_{\max}} = \frac{Ns}{Ns + 4a}, \tag{13}
$$

其中 $J_{\max} = 4\pi a D c_\infty$ 就是黑洞的上限。$N = 4a/s$ 时比例正好一半，这时覆盖率只有 $s/a$，也就是千分之一。

图 3 把这个过程直接演给你看。b 栏是整个细胞：分子一次次落到表面上，直到撞上某个受体，或者彻底逃走。拖动可以转动细胞，“缩放”可以一直放大到单个受体的尺度。

<figure class="mc-figure">
<div class="mc-figure-plot">
<p class="panel-title"><b>a</b>&ensp;什么算一次尝试</p>
<div id="sc-plot"></div>
<p class="panel-title"><b>b</b>&ensp;整个细胞上，一个接一个的分子</p>
<div class="controls">
<div class="field"><label>细胞半径与斑块半径之比 <span class="m">a/s</span></label><div class="seg" role="group" aria-label="细胞半径与斑块半径之比"><button data-as="30" aria-pressed="false">30</button><button data-as="100" aria-pressed="true">100</button><button data-as="300" aria-pressed="false">300</button><button data-as="1000" aria-pressed="false">1000</button></div></div>
<div class="mc-slider"><label class="mc-slider-label" for="sp-x">受体数 <span class="m">N</span>（刻度：<span class="m">N</span> = π<span class="m">a/s</span>）</label><output class="mc-slider-value" id="sp-x-o"></output><input type="range" class="mc-range" id="sp-x" min="0" max="1000" step="1"></div>
<div class="mc-slider"><label class="mc-slider-label" for="sp-rate">速度</label><output class="mc-slider-value" id="sp-rate-o"></output><input type="range" class="mc-range" id="sp-rate" min="0" max="5" step="1" value="1"></div>
<div class="mc-slider"><label class="mc-slider-label" for="sp-zoom">缩放</label><output class="mc-slider-value" id="sp-zoom-o"></output><input type="range" class="mc-range" id="sp-zoom" min="0" max="1000" step="1" value="0"></div>
</div>
<canvas id="sp-cv" height="360" aria-label="从外面看到的细胞，以及它的受体和一个分子碰到它的位置"></canvas>
<div class="status" id="sp-status" aria-live="polite"></div>
<div class="btns">
<button class="mc-btn mc-btn-md" id="sp-play" aria-pressed="true">暂停</button>
<button class="mc-btn mc-btn-md" id="sp-next">下一个分子</button>
<button class="mc-btn mc-btn-md" id="sp-follow" aria-pressed="true">跟随分子</button>
</div>
<p class="panel-title"><b>c</b>&ensp;被捕获的分子比例</p>
<div id="st-plot"></div>
<div class="readouts">
<div class="ro"><div class="k">覆盖率 <span class="m">Ns</span>²/4<span class="m">a</span>²</div><div class="v" id="st-cov">–</div></div>
<div class="ro"><div class="k">当前设置下的分子数</div><div class="v" id="st-n">0</div></div>
<div class="ro"><div class="k">每个分子的平均尝试次数</div><div class="v" id="st-tries">–</div><div class="t" id="st-tries-t"></div></div>
<div class="ro"><div class="k">被捕获比例（模拟）</div><div class="v" id="st-cap">–</div></div>
<div class="ro"><div class="k">公式 8（精确）</div><div class="v" id="st-eq8">–</div><div class="t">公式 13 <span id="st-eq13"></span></div></div>
</div>
<div class="btns">
<button class="mc-btn mc-btn-md mc-btn-primary" id="st-run">模拟 400 个分子</button>
<button class="mc-btn mc-btn-md" id="st-clear">清空</button>
<span class="note" id="st-note"></span>
</div>
</div>
<figcaption class="mc-figure-cap">

<span class="mc-figure-num">图 3</span>　**a** 什么算一次尝试（不按比例）。分子在 A 处碰到表面，走到距离 $s$ 之外，再在 B 处落回来，这是两次独立的尝试；C、D 相距不到 $s$，属于同一次。每次走到 $s$ 远，分子都有 $s/(a+s)$ 的概率一去不回。**b** 分子一个接一个地来到一个带有 $N$ 个受体的细胞。灰点是每次尝试的落点，按先后连成线；赭黄圆圈标出最终抓住它的受体。整个细胞的视图里受体比一个像素还小，只能画成小点；放大以后才按真实比例显示。**c** 到目前为止所有模拟分子中被抓住的比例，横轴是受体数相对 $\pi a/s$ 的倍数；实线是精确的公式 8，点线是计数估计公式 13。不同 $a/s$ 的点都落在同一条曲线上。模拟只在离表面 $s$ 以内一步步走（步长 $0.2\,s$）；走出这个范围后，分子按精确的概率逃走，或按球外布朗运动的精确分布落回表面。

</figcaption>
</figure>

### 精确的答案：借电学来算

上面的计数是近似的。要得到精确答案，物理学家有一个偷懒的好办法。

稳态扩散方程是 $\nabla^2 c = 0$，和静电学里电势满足的方程一模一样。于是每个扩散问题都有一个电学上的“双胞胎”：浓度对应电势，分子流对应电流，吞分子的表面对应一个接地的导体。在这个对应下，“一个东西每秒吞多少分子”就变成了“同样形状的导体电容有多大”：

$$
J = 4\pi C D c_\infty, \tag{3}
$$

$C$ 是这个形状的导体在 cgs 单位下的电容，它的量纲是长度。球的电容就是它的半径 $a$，代进去正是公式 2。各种形状的电容早就有人算好了，很多扩散问题因此可以直接查表。比如一个只有一面能吸收、半径为 $s$ 的小圆盘，吞分子的速度是 $J_1 = 4Dsc_\infty$，这就是单个受体斑的速度。

那么 $N$ 个斑散布在细胞上呢？答案可以这样理解：一个分子要被抓住，得先**找到细胞**，再**在细胞表面上找到一个斑**。这两步就像两个串联的电阻：

$$
\frac{1}{C} = \underbrace{\frac{1}{a}}_{\text{找到细胞}} + \underbrace{\frac{\pi}{Ns}}_{\text{找到斑}}
\quad\Longrightarrow\quad
\frac{J}{J_{\max}} = \frac{Ns}{Ns + \pi a}. \tag{8}
$$

和计数估计比，只是把 4 换成了 $\pi$。斑少的时候，“找到斑”这个电阻占主导，多加斑就多吞分子；斑多到 $N \gg \pi a/s$ 时，瓶颈变成了“找到细胞”，再加斑也没用。两个电阻相等的地方 $N = \pi a/s$，就是吞吃速度达到一半的点。

<figure class="mc-figure">
<div class="mc-figure-plot">
<div class="controls">
<div class="mc-slider"><label class="mc-slider-label" for="j-as"><span class="m">a/s</span></label><output class="mc-slider-value" id="j-as-o"></output><input type="range" class="mc-range" id="j-as" min="0" max="1000" step="1"></div>
<div class="mc-slider"><label class="mc-slider-label" for="j-n">受体数 <span class="m">N</span></label><output class="mc-slider-value" id="j-n-o"></output><input type="range" class="mc-range" id="j-n" min="0" max="1000" step="1"></div>
</div>
<div id="j-plot"></div>
<div class="readouts">
<div class="ro"><div class="k">覆盖率</div><div class="v" id="j-cov">–</div></div>
<div class="ro"><div class="k">受体间距</div><div class="v" id="j-sp">–</div></div>
<div class="ro"><div class="k"><span class="m">J/J</span><sub>max</sub>，分散</div><div class="v" id="j-d">–</div></div>
<div class="ro"><div class="k"><span class="m">J/J</span><sub>max</sub>，合成一片</div><div class="v" id="j-c">–</div></div>
</div>
<div class="btns">
<button class="mc-btn mc-btn-md" data-jpre="0">1 µm 的细胞</button>
<button class="mc-btn mc-btn-md" data-jpre="1"><span>大肠杆菌上的 λ 噬菌体受体</span></button>
</div>
</div>
<figcaption class="mc-figure-cap">

<span class="mc-figure-num">图 4</span>　带 $N$ 个受体斑的细胞，相对于黑洞的吞吃速度。实线是公式 8，点线是计数估计公式 13，虚线是把同样总面积的受体并成一个大斑的情形。分散远比总面积重要：$N = \pi a/s$ 时，分散的斑能拿到一半，并成一片却只能拿到 $1/\sqrt{N}$。

</figcaption>
</figure>

图 4 里的虚线说明了一件容易忽略的事：**斑必须分散**。把 3000 个斑的总面积并成一个大斑，吞吃速度只剩上限的 2% 左右。

由此还能推出几件有意思的事：

- 一个细胞能有效利用的受体数，大约就是 $a/s$ 这个量级，再多也没什么用。
- 每种受体只占表面极小的一部分，所以同一个细胞上可以同时容纳几百种不同的受体，每一种都几乎像整个表面专门为它服务一样有效。
- 最好的排布是尽量分散、不同种类彼此穿插。随便撒上去也差不多：只要 $N$ 超过 50 左右，随机排布和均匀排布的差别只有几个百分点。

<div class="mc-callout"><div class="mc-callout-inner">

<span class="mc-callout-title">现实中的验证：噬菌体</span>

噬菌体是专门感染细菌的病毒。它们吸附到细菌上的速度，接近黑洞的扩散上限，可它们的受体只占细菌表面很小一部分。这曾经让人费解，公式 8 正好解开了这个谜。Schwartz 在 1976 年培养出受体数不同的大肠杆菌，测量 λ 噬菌体的吸附速度，得到的正是公式 8 的形状。拟合出 $\pi a/s \approx 483$：不到 500 个受体、只占 0.5% 的表面，吸附速度就达到上限的一半（图 4 的第二个预设）。

</div></div>

顺带一提另一种策略：分子先松松地粘在细胞表面的任何地方，再沿着表面滑行，直到碰上受体。这叫“降维”，人们常说二维搜索比三维搜索容易。但 Berg 和 Purcell 指出，这个说法有点误导：分子能到达表面，三维搜索就已经完成了；而它一次次弹回表面，本身就是在用近乎二维的方式扫描表面。只有粘得足够牢（结合能大于约 3 kcal/mol），先粘再滑才真正划算。

## <span class="num">3</span>游得快，能多吃吗？

细菌会游泳。一个自然的想法是：游起来以后，迎面撞上的分子会更多，就像在雨里跑步，身上淋到的雨会更多。或者，细菌可以用鞭毛搅动周围的水，把远处浓度高的水搬过来。

这两个主意在细菌的世界里都行不通。因为细菌生活在一个和我们截然不同的流体世界里。

衡量这种差别的是**雷诺数** $R = Lv/\nu$，它比较的是惯性和黏性哪个更重要（$L$、$v$ 是物体的大小和速度，$\nu$ 是液体的运动黏度）。人在水里游泳，$R$ 大约是 $10^4$ 到 $10^6$；大肠杆菌只有 $10^{-5}$ 左右。在这样的世界里惯性几乎不存在：如果大肠杆菌突然停下鞭毛，它会在不到 $10^{-9}$ cm 的距离内停住，比一个原子还小。

**游泳。**“雨中跑步”的类比错在哪里？雨滴不会给你让路，但分子会。细胞往前游时要推开前方的水，分子就跟着水一起被推开了。而且细胞身边总裹着一层相对它几乎不动的水，每个分子最后都得靠扩散穿过这一层。

游泳有没有用，取决于一个无量纲数 $av_0/D$：在分子扩散过一个细胞大小所需的时间里，细胞能游过几个身长。对追逐小分子营养物的细菌，这个数只有 0.03 左右，游泳让吞吃速度提高约 2.5%。要翻倍，得游到每秒约 3 毫米，是它实际速度的一百倍。

情况在两头不太一样。速度很低时，球的前半部分多收约 $1.5\,av_0/D$，后半部分少收同样多，总量只按速度的平方增长：增量不能依赖运动方向，所以只能是 $v_0$ 的偶函数。速度很高时，吞吃速度按 $(av_0/D)^{1/3}$ 慢慢增长。前后不对称这一点，到第 5 节还会派上用场。

<figure class="mc-figure">
<div class="mc-figure-plot">
<div class="controls">
<div class="mc-slider"><label class="mc-slider-label" for="s-a">细胞半径 <span class="m">a</span></label><output class="mc-slider-value" id="s-a-o"></output><input type="range" class="mc-range" id="s-a" min="0" max="1000" step="1"></div>
<div class="mc-slider"><label class="mc-slider-label" for="s-v">游动速度 <span class="m">v</span>₀</label><output class="mc-slider-value" id="s-v-o"></output><input type="range" class="mc-range" id="s-v" min="0" max="1000" step="1"></div>
<div class="mc-slider"><label class="mc-slider-label" for="s-d">扩散系数 <span class="m">D</span></label><output class="mc-slider-value" id="s-d-o"></output><input type="range" class="mc-range" id="s-d" min="0" max="1000" step="1"></div>
</div>
<div id="s-plot"></div>
<div class="readouts">
<div class="ro"><div class="k"><span class="m">av</span>₀/<span class="m">D</span></div><div class="v" id="s-pe">–</div></div>
<div class="ro"><div class="k">吞吃速度的增量</div><div class="v" id="s-gain">–</div></div>
<div class="ro"><div class="k">翻倍所需速度</div><div class="v" id="s-dbl">–</div><div class="t">约 2.5 <span class="m">D/a</span></div></div>
<div class="ro"><div class="k">雷诺数 <span class="m">av</span>₀/ν</div><div class="v" id="s-re">–</div></div>
<div class="ro"><div class="k">单位体积游泳功率</div><div class="v" id="s-pw">–</div><div class="t">9ηv₀²/2a²</div></div>
<div class="ro"><div class="k">搅动所需功率下限</div><div class="v" id="s-st">–</div><div class="t">r₂ = 6a</div></div>
</div>
<div class="btns">
<button class="mc-btn mc-btn-md" data-swim="0">细菌，小分子营养物</button>
<button class="mc-btn mc-btn-md" data-swim="1">细菌，噬菌体大小的颗粒</button>
</div>
</div>
<figcaption class="mc-figure-cap">

<span class="mc-figure-num">图 5</span>　以速度 $v_0$ 游动的吸收球，吞吃速度相对静止时增加了多少。实线从原论文的数值解数字化而来（$0.02 \le av_0/D \le 10$），点线按两头的极限延长：低速时增量 $\propto v_0^2$，高速时 $J/J_0 \propto v_0^{1/3}$。标记点是滑动条设定的细胞。功率估计取水的黏度。

</figcaption>
</figure>

反过来，对扩散很慢的大颗粒，游泳就有用了。以 15 µm/s 游动的细菌，可以把扩散系数为 $5\times10^{-8}\ \text{cm}^2/\text{s}$ 的东西吞得快一倍，这差不多就是 λ 噬菌体的扩散系数（图 5 的第二个预设）。

**搅动**。用鞭毛搅水，要想比扩散更快地把分子搬过距离 $L$，搅动速度得超过 $D/L$。对 1 微米的距离，这是每秒约 1 毫米，比任何细菌的动作都快。更要命的是能量。搅动的水会因黏性耗散能量；Berg 和 Purcell 估算，要让吞吃速度翻倍，每单位细胞体积至少要消耗

$$
\frac{S}{(4\pi/3)a^3} \ \ge\ \frac{12\,\eta D^2}{a^4}\left(\frac{r_2+2a}{r_2-2a}\right)^3, \tag{26}
$$

$r_2$ 是被搅动区域的外沿。取 $r_2 = 6a$，对 1 微米的细胞约为 0.1 W/cm³，比游泳本身耗的能量大一万倍以上。这个下限按 $a^{-4}$ 急剧下降，所以只有大到几微米到几十微米的细胞，搅水才可能划算。

<figure class="mc-figure">
<div class="mc-figure-plot">
<div class="controls">
<div class="mc-slider"><label class="mc-slider-label" for="sk-d">被吞分子的扩散系数 <span class="m">D</span></label><output class="mc-slider-value" id="sk-d-o"></output><input type="range" class="mc-range" id="sk-d" min="0" max="1000" step="1"></div>
</div>
<div id="sk-plot"></div>
<div class="readouts">
<div class="ro"><div class="k">1 µm 的细胞搅动至少需要</div><div class="v" id="sk-1">–</div></div>
<div class="ro"><div class="k">是游泳功率的</div><div class="v" id="sk-r">–</div></div>
<div class="ro"><div class="k">两者一样贵的细胞半径</div><div class="v" id="sk-x">–</div></div>
</div>
</div>
<figcaption class="mc-figure-cap">

<span class="mc-figure-num">图 6</span>　搅动和游泳的代价，按单位细胞体积计。虚线是让吞吃速度翻倍所需的搅动功率下限（公式 26，取 $r_2 = 6a$），按 $a^{-4}$ 下降；实线是以 30 µm/s 游泳所需的功率，按 $a^{-2}$ 下降。对细菌大小的细胞，搅动要贵上万倍。把扩散系数调小（大分子、颗粒），搅动的代价会急剧下降。

</figcaption>
</figure>

结论是：在浓度均匀的环境里，运动几乎不能让细菌多吃一点。运动真正的价值在于浓度**不**均匀的时候：细菌可以朝更好的地方游。而要知道哪边更好，就得比较不同地方、不同时刻的浓度，也就是说，得会**测量**浓度。

## <span class="num">4</span>数分子：测量能有多准

现在回到开头的问题：细菌到底能把浓度测得多准？

### 一台理想仪器

先想象一台理想仪器：它能看见一个半径为 $a$ 的小球里的每一个分子，随时报出里面有多少个。

数一次，误差是泊松涨落 $\sqrt{m}$。开头算过，1 µM 时一个 1 微米的小球里约有 2500 个分子，单次误差约 2%。想更准，就得多数几次取平均。但是马上再数一次没有用，里面还是原来那批分子。要等它们走掉、换进一批新的，才算一次独立的计数。换一批大约需要 $a^2/D$ 的时间，对 1 微米大约是 1 毫秒。所以在时间 $T$ 里，大约能做 $TD/a^2$ 次独立计数，相对误差约为 $(TD\bar c a)^{-1/2}$。精确计算给出

$$
\frac{\Delta c_{\text{rms}}}{\bar c} = \left(\frac{5\pi}{3}\,T D \bar c a\right)^{-1/2}. \tag{41}
$$

注意精度取决于小球的半径 $a$，而不是体积。体积越大，里面的分子越多，但换一批也越慢，两个效应相抵，只剩下 $Da\bar c$，和决定扩散流 $J$ 的是同一个组合。对 1 微米、1 µM，这台理想仪器测到 1% 只需几毫秒。

### 一个受体

可细菌没有这样的仪器。它能“看到”的，只有受体是空着还是被占着。

一个受体的结合位点一次最多容纳一个分子。它的状态 $p(t)$ 在 0（空）和 1（被占）之间来回跳，像一个随机的电报信号（图 7）。被占时，分子以速率 $1/\tau_b$ 离开；空着时，以速率 $4Dsc$ 被新分子填上，这正是一个半径为 $s$ 的小吸收体吞分子的速度。浓度越高，受体被占的时间比例越大：

$$
\bar p = \frac{c}{c + c_{1/2}},
$$

$c_{1/2}$ 是让受体一半时间被占的浓度。细胞要做的，就是在时间 $T$ 内对 $p(t)$ 取平均，得到 $\bar p$，再反推出 $c$。结合时间 $\tau_b$ 通常很短：$c_{1/2} = 1\ \mu\text{M}$ 时不到一毫秒。所以在 $T$ 时间内，受体会被占上、放开很多次，每一次都是一个样本。计算给出

$$
\frac{\Delta c_{\text{rms}}}{\bar c} = \left(\frac{2\tau_b}{T\bar p}\right)^{1/2}. \tag{51}
$$

<figure class="mc-figure">
<div class="mc-figure-plot">
<div class="controls">
<div class="mc-slider"><label class="mc-slider-label" for="t-x">浓度 <span class="m">c</span>/<span class="m">c</span><sub>1/2</sub></label><output class="mc-slider-value" id="t-x-o"></output><input type="range" class="mc-range" id="t-x" min="0" max="1000" step="1"></div>
<div class="mc-slider"><label class="mc-slider-label" for="t-T">平均时间 <span class="m">T</span>/τ<sub>b</sub></label><output class="mc-slider-value" id="t-T-o"></output><input type="range" class="mc-range" id="t-T" min="0" max="1000" step="1"></div>
</div>
<canvas id="t-cv" height="190" aria-label="受体占据状态随时间的变化及其累积平均"></canvas>
<div class="cv-label">灰线是占据状态 <span class="m">p</span>(<span class="m">t</span>)，蓝线是累积平均，点线是真实的平均占据率。</div>
<div class="readouts">
<div class="ro"><div class="k">结合过的新分子数 ν</div><div class="v" id="t-nu">–</div><div class="t" id="t-nu-t"></div></div>
<div class="ro"><div class="k">时间平均占据率</div><div class="v" id="t-pT">–</div><div class="t" id="t-pbar"></div></div>
<div class="ro"><div class="k">估计出的 <span class="m">c</span>/<span class="m">c</span><sub>1/2</sub></div><div class="v" id="t-est">–</div></div>
<div class="ro"><div class="k">预期误差 (ν/2)<sup>−1/2</sup></div><div class="v" id="t-err">–</div></div>
</div>
<div class="btns">
<button class="mc-btn mc-btn-md mc-btn-primary" id="t-new">重新测一次</button>
</div>
</div>
<figcaption class="mc-figure-cap">

<span class="mc-figure-num">图 7</span>　一个受体被观察了时间 $T$。每一次向上的跳变，是一个新分子结合上来。数到的分子越多，累积平均收敛得越紧。多点几次“重新测一次”，看估计值怎么围着真实值跳动。

</figcaption>
</figure>

公式 51 看上去平平无奇，但把 $\tau_b$ 和 $\bar p$ 的关系代进去，它会变成一个出奇简单的形式：

$$
\frac{\Delta c_{\text{rms}}}{\bar c} = \left(\frac{\nu}{2}\right)^{-1/2}, \qquad \nu = 4Ds\bar c\,(1-\bar p)\,T. \tag{52, 53}
$$

$\nu$ 是什么？$4Ds\bar c$ 是新分子到来的速率，$(1-\bar p)$ 是受体空着、能接住它们的时间比例，再乘上 $T$：$\nu$ 就是在这段时间里，**先后结合过这个受体的不同分子的个数**。

<div class="mc-callout mc-callout-key"><span class="mc-seal" aria-hidden="true"></span><div class="mc-callout-inner">

<span class="mc-callout-title">只有新分子才算数</span>

测量精度只取决于数到过多少个**不同的**分子，与别的一切无关。一个分子刚离开受体又回来结合，不提供任何新信息：分子的扩散没有记忆，它下一步去哪儿只取决于它现在在哪儿，回来的分子告诉你的，你早就知道了。真正关于外面浓度的消息，只能由从外面新来的分子带来。

</div></div>

<figure class="mc-figure">
<div class="mc-figure-plot">
<div id="e-plot"></div>
<div class="btns">
<button class="mc-btn mc-btn-md mc-btn-primary" id="e-run">每个 T 测 300 次</button>
<span class="note" id="e-note">使用图 7 中设定的浓度。</span>
</div>
</div>
<figcaption class="mc-figure-cap">

<span class="mc-figure-num">图 8</span>　把图 7 的测量重复很多次，统计估计值的相对误差，并对数到的新分子数作图，平均时间从 10 到 3000 $\tau_b$。所有点都落在点线 $(\nu/2)^{-1/2}$ 上。

</figcaption>
</figure>

一个受体有多好？换算一下，它相当于一台只能看见受体本身那么大一点地方的理想仪器。取 $c_{1/2} = \bar c = 1\ \mu\text{M}$、$s = 1\ \text{nm}$，单个受体要把浓度测到 1%，大约需要 17 秒。太慢了。

### 几千个受体一起数

细胞有几千个受体，它们一起数，会快多少？

麻烦在于受体之间并不独立：一个受体刚放掉的分子，很容易游荡到旁边的受体上，所以相邻受体的状态是相关的，这种相关几乎没法直接算。

“只有新分子才算数”在这里帮了大忙。我们不必追踪每个受体，只需要问：从外面新来的、从没被这个细胞上任何受体抓过的分子，到来的速率是多少？这正是第 2 节算过的 $J$，再乘上受体空着的比例 $(1-\bar p)$。不同新分子的到来彼此独立，所以 $N$ 个受体看 $T$ 秒，相当于一个受体看 $NT$ 秒：

$$
\frac{\Delta c_{\text{rms}}}{\bar c} = \left[\tfrac12 TJ(1-\bar p)\right]^{-1/2} = \left[\frac{2\pi TD\bar c\,Nsa(1-\bar p)}{Ns+\pi a}\right]^{-1/2}. \tag{55}
$$

细胞并不需要分辨哪些分子是新的。上面只是说，它从受体状态里能得到的统计精度，和只记录新分子时一样。

当受体数 $N = \pi a/s$，也就是第 2 节里吞吃速度达到一半的那个数时，整个细胞相当于一台半径约为 $\tfrac35(1-\bar p)a$ 的理想仪器，几乎和细胞一样大。**几千个只覆盖千分之一表面的受体，测量能力差不多抵得上一台能看见细胞周围每一个分子的理想仪器。**

<figure class="mc-figure">
<div class="mc-figure-plot">
<div class="controls">
<div class="mc-slider"><label class="mc-slider-label" for="m-a">细胞半径 <span class="m">a</span></label><output class="mc-slider-value" id="m-a-o"></output><input type="range" class="mc-range" id="m-a" min="0" max="1000" step="1"></div>
<div class="mc-slider"><label class="mc-slider-label" for="m-n">受体数 <span class="m">N</span></label><output class="mc-slider-value" id="m-n-o"></output><input type="range" class="mc-range" id="m-n" min="0" max="1000" step="1"></div>
<div class="mc-slider"><label class="mc-slider-label" for="m-c">浓度 <span class="m">c̄</span></label><output class="mc-slider-value" id="m-c-o"></output><input type="range" class="mc-range" id="m-c" min="0" max="1000" step="1"></div>
<div class="mc-slider"><label class="mc-slider-label" for="m-k">解离常数 <span class="m">K</span></label><output class="mc-slider-value" id="m-k-o"></output><input type="range" class="mc-range" id="m-k" min="0" max="1000" step="1"></div>
</div>
<div id="m-plot"></div>
<p class="note">斑块半径 <span class="m">s</span> = 1 nm，<span class="m">D</span> = 10⁻⁵ cm² s⁻¹，1 M = 6 × 10²⁰ cm⁻³。平均占据率 <span id="m-p"></span>。</p>
</div>
<figcaption class="mc-figure-cap">

<span class="mc-figure-num">图 9</span>　把浓度测到 1% 需要多久：单个受体（公式 52）、带 $N$ 个受体的细胞（公式 55）、和细胞一样大的理想仪器（公式 41）。默认参数下，单个受体要 17 秒，3000 个受体的细胞只要约 0.01 秒，快了一千多倍。

</figcaption>
</figure>

## <span class="num">5</span>回到大肠杆菌

现在可以回答开头的问题了。

大肠杆菌找食物的方式很特别：它先沿直线平稳地游一段（“直游”），然后原地乱转一下（“翻滚”），朝一个随机的新方向再游。如果它感到浓度在变高，就把这一段直游拉长；感到在变低，就早点翻滚。直游通常只持续一秒左右。而且即使不翻滚，水分子的热运动也会在几秒内把它的方向撞乱。所以它必须在**一秒左右**的时间里完成一次判断，否则测到的信息就过时了。

它判断的方式是**时间比较**：先测一段 $T$，再测一段 $T$，看两次的差别是不是大过误差。用公式 55 的误差，能看出差别的最短时间是

$$
T > \left[\pi a D\left(\frac{Ns}{Ns+\pi a}\right)\left(\frac{\bar c\, c_{1/2}}{\bar c + c_{1/2}}\right)\left(\frac{1}{\bar c}\frac{\partial \bar c}{\partial t}\right)^2\right]^{-1/3}. \tag{58}
$$

细菌游过一个空间梯度时，看到的就是一个时间梯度：$(1/\bar c)\,\partial\bar c/\partial t = (v/\bar c)\,\partial\bar c/\partial x$。完成一次比较要两段，共 $2T$。

把几个经典趋化实验的条件代进去（图 11 的预设），得到的 $2T$ 分别是：谷氨酸 0.09 秒，丝氨酸 0.27 秒，α-甲基天冬氨酸和半乳糖的阈值实验 0.6 秒和 1.4 秒。都在一秒上下，正好是大肠杆菌能用的时间。

图 10 用一个简化的模型把这个“时间窗口”画了出来。测量太慢，等结果出来细菌早已换了方向，信息就过时了；测量太快，数到的分子太少，又会被涨落淹没。

<figure class="mc-figure">
<div class="mc-figure-plot">
<div class="controls">
<div class="mc-slider"><label class="mc-slider-label" for="rt-T">完成一次比较的时间 2<span class="m">T</span></label><output class="mc-slider-value" id="rt-T-o"></output><input type="range" class="mc-range" id="rt-T" min="0" max="1000" step="1"></div>
<div class="mc-slider"><label class="mc-slider-label" for="rt-g">梯度 (1/<span class="m">c</span>) ∂<span class="m">c</span>/∂<span class="m">x</span></label><output class="mc-slider-value" id="rt-g-o"></output><input type="range" class="mc-range" id="rt-g" min="0" max="1000" step="1"></div>
</div>
<canvas id="rt-cv" height="260" aria-label="24 个细菌在浓度梯度中 60 秒的轨迹"></canvas>
<div id="rt-plot" style="margin-top:16px"></div>
<div class="readouts">
<div class="ro"><div class="k">沿梯度的平均漂移</div><div class="v" id="rt-drift">–</div></div>
<div class="ro"><div class="k">噪声允许的最短 2<span class="m">T</span>（公式 58）</div><div class="v" id="rt-tmin">–</div></div>
<div class="ro"><div class="k">可用的时间窗口</div><div class="v" id="rt-win">–</div></div>
</div>
<div class="btns">
<button class="mc-btn mc-btn-md" id="rt-again">再跑一次</button>
</div>
</div>
<figcaption class="mc-figure-cap">

<span class="mc-figure-num">图 10</span>　一个玩具模型。细菌以 20 µm/s 游动，平均每秒翻滚一次，翻滚后方向完全随机，游的时候方向也会被热运动慢慢扰乱。它不停地比较最近一段 $T$ 和再往前一段 $T$ 里的平均浓度：变高了就少翻滚（约每秒 0.5 次），变低了就多翻滚（约每秒 2 次）。上：24 个细菌 60 秒内的轨迹，引诱剂越往右越多，蓝线是它们的平均终点。下：比较一次所用的时间 $2T$ 越长，信息越过时，向右的漂移越弱（每个点是 160 个细菌的平均）。灰色区域里 $2T$ 太短，按公式 58，一个大肠杆菌大小的细胞在 1 mM 的浓度下还分辨不出梯度。梯度越平缓，灰色区域越宽，留给细菌的窗口越窄。模型里的比较本身不含噪声，噪声的代价只体现在灰色区域里。

</figcaption>
</figure>

也就是说，**在细菌恰好能感觉到的梯度下，它的测量时间几乎就是物理允许的最短时间**。如果需要的时间再长几倍，它就根本没法趋化了。Berg 和 Purcell 由此推断：大肠杆菌的趋化系统接近最优。这意味着它的受体必然分散在整个表面，而不是聚在鞭毛根部；而且几乎每一个被抓住的分子，都对控制鞭毛的信号有贡献。

### 为什么不比较前后两端？

细菌也可以不比较先后，而比较身体的前半部分和后半部分，就像我们用两只耳朵判断声音的方向。这叫**空间比较**，所需时间是

$$
T > \left[\tfrac12\pi a^3 D\left(\frac{Ns}{Ns+\pi a}\right)\left(\frac{\bar c\, c_{1/2}}{\bar c + c_{1/2}}\right)\left(\frac{1}{\bar c}\frac{\partial \bar c}{\partial x}\right)^2\right]^{-1}. \tag{60}
$$

它按 $a^{-3}$ 随细胞变大而急剧缩短。对大肠杆菌的丝氨酸实验，它给出约 1.7 秒，单看时间并非不可行。

真正的障碍是第 3 节留下的伏笔：游动的细胞，前端本来就比后端收到更多分子。这种前后差别看起来就像一个梯度，相当于衰减长度为 $D/3v$ 的浓度梯度。在丝氨酸实验里，这个“假梯度”比真梯度陡 600 倍左右。细菌要从中分辨出真正的梯度，就像在一阵大风里听一声耳语。所以小小的细菌只能做时间比较。

<figure class="mc-figure">
<div class="mc-figure-plot">
<div class="formgrid">
<div class="field"><label for="c-preset">实验</label><select id="c-preset"></select></div>
<div class="field"><label>梯度的给法</label><div class="seg" role="group" aria-label="梯度类型"><button id="c-mode-x" aria-pressed="true">空间</button><button id="c-mode-t" aria-pressed="false">时间</button></div></div>
</div>
<div class="formgrid">
<div class="field"><label for="c-a">细胞半径 <span class="m">a</span> [µm]</label><input id="c-a" inputmode="decimal"></div>
<div class="field"><label for="c-D"><span class="m">D</span> [cm² s⁻¹]</label><input id="c-D" inputmode="decimal"></div>
<div class="field"><label for="c-c">平均浓度 <span class="m">c̄</span> [M]</label><input id="c-c" inputmode="decimal"></div>
<div class="field"><label for="c-h"><span class="m">c</span><sub>1/2</sub> [M]</label><input id="c-h" inputmode="decimal"></div>
<div class="field" id="c-gx-f"><label for="c-gx">(1/<span class="m">c̄</span>) ∂<span class="m">c̄</span>/∂<span class="m">x</span> [cm⁻¹]</label><input id="c-gx" inputmode="decimal"></div>
<div class="field" id="c-v-f"><label for="c-v">速度 <span class="m">v</span> [µm s⁻¹]</label><input id="c-v" inputmode="decimal"></div>
<div class="field" id="c-gt-f" hidden><label for="c-gt">(1/<span class="m">c̄</span>) ∂<span class="m">c̄</span>/∂<span class="m">t</span> [s⁻¹]</label><input id="c-gt" inputmode="decimal"></div>
<div class="field"><label for="c-f"><span class="m">Ns</span>/(<span class="m">Ns</span>+π<span class="m">a</span>)</label><input id="c-f" inputmode="decimal"></div>
</div>
<div class="readouts">
<div class="ro"><div class="k">时间比较，2<span class="m">T</span>（公式 58）</div><div class="v" id="c-tt">–</div></div>
<div class="ro"><div class="k">空间比较，<span class="m">T</span>（公式 60）</div><div class="v" id="c-ts">–</div></div>
<div class="ro"><div class="k">“假梯度”的长度 <span class="m">D</span>/3<span class="m">v</span></div><div class="v" id="c-la">–</div><div class="t" id="c-lr"></div></div>
<div class="ro wide"><div class="k">原论文的结果</div><div class="v small" id="c-paper">–</div></div>
</div>
<div id="c-plot" style="margin-top:16px"></div>
</div>
<figcaption class="mc-figure-cap">

<span class="mc-figure-num">图 11</span>　几个经典趋化实验所需的最短测量时间，以及其他条件不变时它们怎样随细胞大小变化。时间比较（实线）只按 $a^{-1/3}$ 缓慢下降，空间比较（虚线）按 $a^{-3}$ 急剧下降，所以大细胞更适合空间比较。可以直接修改参数，或者切换到“时间”直接给定时间梯度。丝氨酸实验没有给出平均浓度，这里取 $\bar c = c_{1/2}$，它能重现原论文的 0.27 秒。

</figcaption>
</figure>

对大得多的细胞，局面就反过来了。黏菌盘基网柄菌半径约 5 微米，爬得很慢（每秒约 0.2 微米），它在环腺苷酸梯度里做空间比较只需约 16 秒，做时间比较也差不多是 17 秒。光凭这个分析，没法判断它用的是哪一种。（这个例子里，原论文把两个梯度长度写成了 0.8 cm 和 1.2 cm；按它自己给的参数算，其实是 0.8 mm 和 1.2 mm。两者之比不变，结论也不受影响。）

但有一点对所有例子都成立，也是整篇论文最朴素、最深刻的结论：**不论用什么办法，测量浓度都需要时间**。这不是生物化学不够好，而是扩散和统计涨落本身设下的极限。

## 回顾

- 一个半径为 $a$ 的细胞靠扩散每秒最多吞下 $4\pi a D c_\infty$ 个分子，正比于半径而不是表面积，因为耗尽区和细胞一起变大。
- 碰过细胞的分子会回来约 $a/s$ 次，所以只覆盖千分之一表面的几千个受体，就能抓到一半的分子。前提是受体要分散。
- 对细菌这么小的东西，游泳和搅水都不能让它多吃。
- 测量精度只取决于数到过多少个新分子；几千个受体加在一起，几乎抵得上一台能看见细胞周围每个分子的理想仪器。
- 大肠杆菌在一秒左右完成一次浓度比较，几乎贴着物理极限。

## 后来的故事

“Berg–Purcell 极限”后来成了生物物理里最常被引用的结果之一。人们把它推广到考虑化学反应细节的受体，也发现了更聪明的读法：只统计受体空着的时间长短，可以把误差的平方再减小一半。从细菌趋化，到胚胎发育中细胞读取形态发生素的浓度梯度，人们一次次发现，生物系统的灵敏度离这个极限并不远。

<div class="bp-refs">

## 参考文献

<p>Berg, H. C. &amp; Purcell, E. M. (1977). Physics of chemoreception. <i>Biophysical Journal</i> 20, 193–219. <a href="https://doi.org/10.1016/S0006-3495(77)85544-6">doi:10.1016/S0006-3495(77)85544-6</a></p>
<p>Purcell, E. M. (1977). Life at low Reynolds number. <i>American Journal of Physics</i> 45, 3–11.</p>
<p>Bialek, W. &amp; Setayeshgar, S. (2005). Physical limits to biochemical signaling. <i>PNAS</i> 102, 10040–10045.</p>
<p>Endres, R. G. &amp; Wingreen, N. S. (2009). Maximum likelihood and the single receptor. <i>Physical Review Letters</i> 103, 158101.</p>
<p>文中用到的实验：Schwartz (1976), <i>J. Mol. Biol.</i> 103, 521–536（λ 噬菌体吸附）；Brown &amp; Berg (1974), <i>PNAS</i> 71, 1388–1392（谷氨酸）；Dahlquist, Elwell &amp; Lovely (1976), <i>J. Supramol. Struct.</i> 4, 329–342（丝氨酸）；Mesibov, Ordal &amp; Adler (1973), <i>J. Gen. Physiol.</i> 62, 203–223（α-甲基天冬氨酸、半乳糖）；Mato et al. (1975), <i>PNAS</i> 72, 4991–4993（环腺苷酸）。</p>
<p>图 5 的曲线从原论文图 4 数字化而来，其余各图都是在浏览器中按公式实时计算的。</p>

</div>

<script src="/posts/berg-purcell-1977/figures.js" data-lang="zh" defer></script>
