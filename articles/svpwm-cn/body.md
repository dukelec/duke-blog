SVPWM 和 SPWM 的波形不太一样，譬如下图，标准的正弦波是 SPWM，而有两个山峰的是 SVPWM.

使用 SVPWM 的主要目的是让电压利用率更高，譬如电机 KV 值是固定的，电压越高转速越快。同等 DC 输入电压的情况下，SVPWM 的电压输出相比 SPWM 可以提高 15%.

原理很简单，根本不用按照网上很多分六个扇区，判断当前角度在哪个扇区然后调用不同公式计算输出电压那么麻烦。

如下图，最大输出限制为 ±100%, 我们先把原本的 SPWM 输出增加 15% 幅度，这样三相电波形就超出最大输出范围。

此时，把三路 pwm 值整体上下平移，让三路 pwm 值都在 ±100% 范围内即可，对于电机而言，在乎的是三路相电的彼此差值，整体平移对电机没有任何影响。

如果是按照中位来平移（算出最高和最低值，得出中值，然后整体偏移此中值），那么输出的就是标准的 SVPWM 波形了。


<img src="1.avif" style="max-width:100%" alt="Your browser may not support avif images!">

两个波形重叠的效果图：

<img src="2.avif" style="max-width:100%">


生成该波形的脚本源码：

[svpwm_wave.py](svpwm_wave.py)

更多电机相关感悟，参见 CDFOC 开源电机控制器 Wiki 页面文章：

https://github.com/dukelec/cdfoc/wiki

