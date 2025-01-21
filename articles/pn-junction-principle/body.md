
I have studied PN junctions, transistors, and MOSFETs many times, but I always felt there were some aspects I hadn’t fully understood. This time, I delved deeper and gained a clearer understanding, so here’s a summary.

### No Power Applied

A typical PN junction is illustrated as follows, with the P-type semiconductor on the left and the N-type semiconductor on the right.

When no external power is applied, the free electrons in the N-type semiconductor near the junction diffuse into the P-type region. Consequently, the N region loses electrons and becomes positively charged (represented in pink), while the P region gains electrons and becomes negatively charged (represented in light blue).

<img src="1.svg" style="width:100%">

The electrons that diffuse into the P region essentially do not continue diffusing further to the left because they are attracted by the positive charges in the pink region. Eventually, the diffusion force and the attractive force reach equilibrium.

The first question arises: Will the electrons in the region to the right of the pink area be attracted to it and accumulate there?

The answer is no. Since the right region contains free electrons and is overall conductive, the electric potential remains uniform. A more accurate depiction is as follows, making it easier to understand:

<img src="2.svg" style="width:100%">

### Forward Conduction

When a PN junction conducts in the forward direction, the positive terminal of an external power source is connected to the P-type semiconductor, and the negative terminal is connected to the N-type semiconductor. This neutralizes the static potential difference of the PN junction (approximately 0.7V), allowing electrons to continue diffusing to the left. The diffusion force now combines with the electric field force from the external power source, minus the 0.7V junction potential.

There is a subtle detail about this continued diffusion: it does not mean that electrons sequentially fill all the holes from the middle region to the left. Imagine if all the holes in a standalone P-type semiconductor were filled with electrons—it would carry a massive negative static charge amounting to thousands of volts.

Alternatively, consider the thin depletion layer formed in an unpowered PN junction. In this layer, most of the holes in the P-type region are filled with electrons, corresponding to a -0.7V charge. If the region where holes are filled were 1,000 times thicker, it would correspond to a -700V charge.

Thus, during continued diffusion, the excess electrons in the P-type semiconductor remain a very small proportion compared to the holes, which still dominate. As these minority electrons gradually diffuse to the leftmost metal lead, a continuous current is formed (even then, holes still constitute the majority in the P-type semiconductor).

Regarding metal leads, it’s worth mentioning Schottky diodes. A Schottky diode is formed by a metal and an N-type semiconductor, where the metal replaces the P-type semiconductor. Its principle is similar to that of a PN junction, but we won’t go into detail here.

What’s worth noting is this: the leads of regular diodes, transistors, MOSFETs, and chips are all connections between semiconductors and metal. Wouldn’t that mean each lead also forms a Schottky diode? Or, since the core of a Schottky diode is the interface between metal and an N-type semiconductor, and the lead of an N-type semiconductor is also metal, wouldn’t this be a metal–semiconductor–metal structure, behaving the same in both directions?

The answer lies in the distinction between ohmic contacts and Schottky contacts in chip manufacturing. Regular leads use ohmic contacts, which are achieved through specific fabrication processes that eliminate the Schottky diode effect caused by direct metal–semiconductor contact. Without going into detail, this means we don’t have to consider Schottky diode effects when analyzing the leads of diodes, transistors, MOSFETs, and other devices.

So, when we later analyze these components, we can safely disregard the issue of metal leads.


### Reverse Bias (Cutoff)

The reverse bias of a PN junction is relatively harder to understand. In this case, the positive terminal of the external power source is connected to the N-type semiconductor, and the negative terminal is connected to the P-type semiconductor.

The external power source injects a small number of electrons into the P-type semiconductor (the quantity is proportional to the source voltage). These electrons move to the right (due to diffusion and the electric field) and fill the holes in the outer P-type semiconductor region of the PN junction, thereby thickening the depletion layer. Similarly, the external power source removes the same number of electrons from the N-type semiconductor, further thickening the depletion layer.

However, here’s the puzzling part: given the strong electric field formed by the external power source plus the existing PN junction electric field, why doesn’t the field pull the electrons from the holes in the P region of the PN junction into the N region, thus creating a current?
Without external voltage, the PN junction’s built-in electric field (around 0.7V) balances the electron diffusion force. So with a reverse voltage far exceeding 0.7V, shouldn’t the reverse voltage force the electrons to diffuse backward?

Here’s my understanding: as mentioned earlier, the regions outside the PN junction are conductive, while the center of the junction is in a high-resistance state. However, this high-resistance region is not entirely non-conductive, as there is a small reverse leakage current. Essentially, the resistance gradually increases from the outer regions toward the junction center.

As a result, even though the reverse voltage applied by the external power source is much greater than 0.7V, the voltage drop across the high-resistance core region of the PN junction is relatively small. This situation is somewhat analogous to the advice for avoiding electric shocks when a high-voltage power line falls to the ground: the voltage spreads over a wide area, so the voltage difference over a small distance is minimal.

In other words, the reverse voltage from the external power source is distributed across the PN junction’s depletion layer. The voltage in the core region of the junction does not exceed 0.7V, so the reverse voltage cannot entirely counteract the diffusion force of the electrons to make them move rightward.

Additionally, as the reverse bias increases, the depletion layer widens, which further reduces the voltage drop per unit distance in the high-resistance region.

However, at an extremely high reverse breakdown voltage, the electric field in the core region of the PN junction exceeds the electron diffusion force, allowing electrons to move massively to the right, resulting in breakdown.

### Transistors / MOSFETs

Now let's talk about transistors and MOSFETs. Only by truly understanding the nature of the PN junction can we fully understand transistors and MOSFETs.

The core idea of both transistors and MOSFETs is to enable a reverse-biased and cutoff PN junction to conduct.

The key to making a reverse-biased PN junction conduct, I believe, is to reduce the electron diffusion force field, so that electrons can move from the P region to the N region under the existing supply voltage.

The way to reduce the electron diffusion force field is to decrease the potential concentration difference of electrons on both sides of the PN junction. For example, by filling the holes in the P region of the PN junction with electrons and ensuring there are additional free electrons, the P region becomes highly electron-rich.


For an NPN transistor, when the base (b) is left floating, and a positive voltage is applied between the collector (c) and emitter (e), the PN(c) junction is reverse-biased by default.
When a positive voltage is applied between the base (b) and emitter (e), the PN(e) junction becomes forward-biased, allowing electrons to flow from the emitter (e) into the base (b).

Since the base is very thin, the electrons entering the base are very close to the edge of the PN(c) junction. This increases the electron concentration in the P region of the PN(c) junction, reducing the diffusion force field and allowing electrons to move from the P region to the N region, thus enabling the PN(c) junction to conduct.

<img src="npn.svg" height=400px>

For a MOSFET, the gate terminal acts as a capacitor. When a voltage is applied between the gate and the P-type semiconductor, and the gate is positively charged, the external power source injects a small number of electrons into the P-type semiconductor (proportional to the source voltage).

These electrons are attracted by the electric field of the gate and accumulate in the P-type semiconductor near the gate. This accumulation increases the electron concentration in the P region of the reverse-biased PN junction, reducing the diffusion force field and allowing electrons to move from the P region to the N region, thus enabling the PN junction to conduct.

<img src="mos.svg" height=400px>


### More Ideas

<img src="d1.svg" height=300px>

Can we simplify the MOSFET like this? By applying the control voltage between the gate and the source, we make the reverse-biased drain-source (d-s) junction conduct.


<img src="d2.svg" height=300px>

Or, can we simplify the transistor like this? By controlling the current through the `a`-`e`, while the `a` is close to the PN junction, we make the reverse-biased collector-emitter (c-e) junction conduct.

I believe this is feasible, but such devices would not be as flexible in application as standard transistors and MOSFETs, so this design approach is not typically used. It is more likely that the manufacturing process for non-simplified devices is actually simpler.

In fact, typically the MOSFET substrate is connected to the source terminal, which is equivalent to the simplified version.

<br>
<a rel="license" href="http://creativecommons.org/licenses/by/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>.
