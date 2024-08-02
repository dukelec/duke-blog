The waveforms of SVPWM and SPWM differ slightly. For example, in the figure below, the standard sine wave represents SPWM, while the one with two peaks represents SVPWM.

The main purpose of using SVPWM is to achieve higher voltage utilization. For instance, with a fixed motor KV value, the higher the voltage, the faster the speed. With the same DC input voltage, SVPWM can increase the voltage output by 15% compared to SPWM.

The principle is straightforward and doesn’t require following the complex process often described online, which involves dividing into six sectors and determining the current angle to calculate the output voltage.

As shown in the figure, with a maximum output limit of ±100%, we first increase the original SPWM output by 15%, causing the three-phase waveforms to exceed the maximum output range.

At this point, we simply shift the three PWM values up or down so that all three values fall within the ±100% range. For the motor, what matters is the relative difference between the three-phase voltages, and the overall shift does not affect the motor.

If we shift based on the midpoint (calculating the highest and lowest values to find the median, then shifting accordingly), the output will be a standard SVPWM waveform.


<img src="1.avif" style="max-width:100%" alt="Your browser may not support avif images!">

Overlay of the two waveforms:

<img src="2.avif" style="max-width:100%">


Script source code for generating the waveform:

[svpwm_wave.py](svpwm_wave.py)

For more information, please refer to the CDFOC open-source motor controller project:

https://github.com/dukelec/cdfoc

