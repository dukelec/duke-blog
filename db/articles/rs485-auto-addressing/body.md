My previous company's seven-axis robot arm use RS485 communication. Each joint was an RS485 node. At that time, there was a command to modify the device address. At the same time, the command with the target address of 255 was a broadcast command, and all nodes would respond.
Then, I inadvertently sent a broadcast command to change the address. As a result, all joint addresses are the same, and there is no way to modify the joints' addresses individually through commands. At the end, each joint must be disassembled and reconfigured.
Almost destroyed the arm, because after the joint was disassembled, the calibration of the encoder also failed, very regret, after that, I will add the function of automatic address allocation for all device.

Traditionally, many devices use hardware dip switches to set the address. However, many products, such as the joint space of the robot arm, are small and there is no place to place the dial switch.
And the shell processing will be very troublesome for many products after add dial switch. Therefore, it is more flexible with software configuration.

<br>
In order to achieve automatic address allocation, we must first select the basic RS485 communication protocol. When multiple nodes communicate, it is recommended that each communication command include the source address and the destination address. This is not easy to make mistakes, and it is also relatively simple and uniform.

It is recommended to use the CDBUS format. You may not have heard of this name, but you may have used or are using a similar protocol. Its composition consists of 3 parts:
 - 3-byte header: [source address, destination address, user data length]
 - 0~255 bytes of user data (because the data length is represented by 1 byte)
 - The 2-byte CRC checksum covers the entire packet and the checksum algorithm is the same as ModBus.

There should be a certain amount of idle time between data packets and data packets. For details, see the protocol definition of CDBUS:
https://github.com/dukelec/cdbus_ip (The biggest benefit of CDBUS is support for hardware controller enhancements, avoid conflicts like the CAN bus, support for concurrent read and write, multi-host, peer-to-peer communications, and active data reporting.)

For example, if address 0x00 is the master and 0x01 is slave 1, then the host sends two bytes of data 0x10 0x11 to slave 1 and the complete data is:  
[<span style="background-color:#afffff">00 01 02</span> <span style="background-color:#afafff">10 11</span> <span style="background-color:#ffffaf">49 f0</span>]

Then slave 1 responds a single 0x10 to the host:  
[<span style="background-color:#afffff">01 00 01</span> <span style="background-color:#afafff">10</span> <span style="background-color:#ffffaf">04 b8</span>]

<small>Note: Address 255 in CDBUS is a broadcast address; the length of the bus user data is usually limited to 253 bytes, which is convenient for hardware controllers and serial port forwarding data; CDBUS hardware controllers can avoid data conflicts if the addresses do not conflict.</small>

<br>
However, CDBUS is only the lowest-level protocol. Next we need to define the format of the above user data. The simplest and most commonly used method is to use the first byte as the command number followed by optional command parameters;
The first byte of the reply data is usually the status, then the returned data.

After this method was improved, there was also a name called CDNET.
In addition to the most basic forms mentioned above, it also supports computer-like network port forms, support for multiple networks, ensuring data integrity, and big data unpacking.
If you are interested, you can visit: https://github.com/dukelec/cdnet

This article only covers the most basic part of CDNET. For example, the definition of the command 0x01 is to query the device information:  
[<span style="background-color:#afffff">00 01 01</span> <span style="background-color:#afafff">01</span> <span style="background-color:#ffffaf">91 b4</span>]

Returns the string of device information:  
[<span style="background-color:#afffff">01 00 0f</span> <span style="background-color:#afafff">40 4d 3a 20 ... 34</span> <span style="background-color:#ffffaf">crc_l crc_h</span>]
 - 40 indicates that the current packet is a reply (to distinguish the request, see CDNET definition);
 - The string corresponding to 4d to 34 is "M: c1; S: 1234" (M is followed by the device model, and S is followed by the device serial number, which is the unique code). It is convenient to use a string, and all information can be returned at one time. It is also easy to expand, for example, increase the version number, device-side implementation is also very simple.

<br>
Next, to get into the topic, we need to define two commands, one to query the device information and one to set the device address.

The 0x01 command to query the device information has already said half, that is, without the parameters, the device information is returned directly.
It can also cooperate with the following four parameters to automatically assign addresses:  
`[max_time, mac_start, mac_end, "filter string"]`
 - max_time is two bytes, in milliseconds, the device generates a random number no greater than this number, waiting for a corresponding random time to reply;
 - mac_start and mac_end: device can reply only if the current device address is between these two numbers;
 - "filter string" is required to reply if the current device information contains this string (convenient for querying the current address of a specific device).

Both arguments and no arguments command return device information strings of the same format.  


Another command is to set the address, the command number is 0x03, it has 3 parameters, the third is optional:  
`[0x00, new_mac, "filter string"]`
 - 0x00 is the mac address setting, because CDNET can cross network, so there are other values for setting the network number;
 - new_mac is the new address；
 - "filter string": the command can only be executed if the current device information contains this string, otherwise it is ignored and does not return.

Returning null means success (still there will be 40 to indicate that the current packet is a reply; the address is changed after return).

<br>
The specific automatic address allocation process is:

1. First use the 0x01 command with parameters to query which devices are on the bus, the filter string can be empty, and the address range can default to 1 ~ 254. If there are too many devices, you need to specify a relatively large waiting time range to reduce the possibility of conflict, because each node will ensure that the bus is idle before sending data in normal communication, so the probability of collision is relatively low (and the use of CDBUS's hardware controller CDCTL can further reduce idle detection dead time). If the bus is detected to be busy before sending, it will wait for the idle to be sent immediately. Although regenerating a new waiting time can reduce the collision probability, it will increase the complexity of the process and is unnecessary.
3. The scanned device information will contain a unique code. If the target device's unique code string is used as the third filter parameter to set the address, the target device's address can be successfully modified even if the current address is occupied by multiple devices. (The host does not modify the address immediately after receiving the reply, but waits until the maximum waiting time has expired. After ensuring that everyone has finished replying, it will gradually sort out the information and assign the address.)
2. Specifying the address range not only reduces the conflict, but also can be used to ignore devices that have already been assigned addresses. For example, addresses 1~9 have already been assigned, and then only the address range after 10 is scanned.
4. Finally, remember to change the host address to an address other than 0x00, and in turn test if there are other devices occupying the 0x00 address. Of course, if your code specifies that the device address is never 0x00, this step can be ignored.

The scanning process usually takes several more scans to ensure that some responses are not missed due to factors such as conflicts. Usually the same results are obtained by scanning three times in succession.

<br>
The specific definition of the above command can be found in the CDNET link above;  
The specific implementation code can refer to the firmware of CDBUS Bridge: https://github.com/dukelec/cdbus_bridge  
(The relevant code is `fw/usr/common_services.c`)

<hr>
There are many friends who ask questions related to unique codes, so add some additional content:

Usually the unique code is obtained by taking the CPU ID information, and each CPU is different.

If the MCU does not have a CPU ID unique code, peripheral devices such as the Bluetooth and WiFi's MAC address can also be taken.

If none of these are available, you can put a specific piece of data in the code. The burning tool dynamically searches for and replaces the corresponding data in the BIN file each time the program is burned. In this way, the data acquired during program execution is different. It is also possible to write FLASH, write EEPROM, write the OTP area, etc. separately using the burning tool. (usually a burning tool with a bar code scanner to enter the unique code.)

There is also a practice that does not require a unique code, that is, every time during boot randomly generates a sequence code, such as 6 or 8 bytes, then the possibility of repetition is also very small.
Even if the sequence code is duplicated, we still have a mechanism to wait for a random time to reply. We can also detect duplicates by scanning several times. In case this happens, we issue a reboot command to allow some or all of the devices to regenerate the sequence code.

You know, the unique code is not only used for address allocation, but also can achieve the needs of product after-sales management, can also be used to do some anti-copy protection, but also make your product look more professional.

<br>
<a rel="license" href="http://creativecommons.org/licenses/by/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>.
