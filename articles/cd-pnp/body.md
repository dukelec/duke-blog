DIY a small SMT machine for scattered components, aimed for engineers, to solve the pain of daily prototyping.
Here is a video of the initial run, the video shows the 0402 material (my target is 0201).
It will be continuously optimised in the future.

The core architecture is:
One small servo board per motor, one camera, actuator, etc.,
using only one CDBUS (RS485) bus, the current baudrate is 10Mbps, currently only using less than 30% of the bandwidth,
and can continue to increase the number of cameras in the future.
One of the axes is driven by two motors together, which requires high synchronisation.
The CDBUS multicast mechanism is used here to achieve perfect synchronisation.
The stepper servo and jpeg bus camera have been open source projects for a long time.

<p>
  <div class="embed-responsive embed-responsive-16by9">
    <video class="embed-responsive-item" controls>
      <source src="cd-pnp.mp4" type="video/mp4">
    </video>
  </div>
</p>


This machine can also be used for PCB cutting:

<p>
  <div class="embed-responsive embed-responsive-16by9">
    <video class="embed-responsive-item" controls>
      <source src="cnc-cut.mp4" type="video/mp4">
    </video>
  </div>
</p>
