*Warning: This project cannot be used for illegal purposes and is for learning purposes only.*

Years ago, I want to learn how to use the BLE chip NRF51822, but I don't know which project should I make, when I looked at the keyboard I was hitting, I thought of an idea.

I use a CPLD device (EPM240Z, for now, I'd like to use 10M02DCV36 instead) attached to the USB wires directy through two normal GPIO, the CPLD analysis the USB and the HID protocol, then send the origin HID data to NRF51822 through serial port.

NRF51822 cache the data comes from CPLD, then wait for another PC or phone to connect and download the data.

When writing the verilog codes, first I use a `Saleae Logic 16` to capture USB data from a real keyboard, then export them to a text file, after that I could feeding those data to my codes through a test bench for simulation.

Waveforms (zoom in for details):
<img src="timing.png" width="100%">

<img src="pcb.jpg" width="100%">

<img src="assembled.jpg" width="100%">

Resources:
 - The HID protocol: https://docs.mbed.com/docs/ble-hid/en/latest/api/md_doc_HID.html
 - Key value table: http://www.mindrunway.ru/IgorPlHex/USBKeyScan.pdf
 - Verilog source code: [keylog_src.tar.bz2](keylog_src.tar.bz2)

<br>
<a rel="license" href="http://creativecommons.org/licenses/by/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>.
