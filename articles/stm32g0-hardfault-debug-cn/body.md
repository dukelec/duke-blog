## 问题描述

使用 CDPNP 贴片机的时候 CDBUS Bridge 会非常小概率死机，如果每次使用贴片机 4 小时，平均贴片 5 次会遇到 1 次死机。
如果每个礼拜贴片 2 次，相当于半个多月会遇到 1 次死机。（Windows 下概率据说要高一点点。）

怀疑是 USB HAL 部分的代码 bug 导致。
因为 STM32 的 HAL 有很多 bug，譬如 SPI DMA 传输结束偶尔会丢 callback.


## 历史经验

我以前在 Ingenic 工作的时候，经常要解决嵌入式 Linux 小概率死机的问题，
譬如 Android 平板的 USB 插拔几千次会死机 1 次，又譬如 Hi-Fi 音频播放器连续播放几天会死机一次。

解决这些问题得到的经验是：

1. 想一切办法尽量提高死机或 bug 复现概率。
2. 加调试打印，死机或判断出问题的时候要打印出函数调用关系（backtrace）。


如果不提高 bug 复现概率，会很难抓到 bug 的相关打印，
而且还要根据 bug 当前触发的打印，进一步定位和增加打印内容，要重复很多次，耗时会很久。
而且，即便找到和解决了问题，也很难通过测试来确认问题真的被修复。
与之相反的做法是：稍微改变一下无关代码，让 bug 出现概率更低、甚至消失，从而不去解决问题，
这样日后再次遇到问题，就会 N 多问题混在一起，更加没有可能去解决。

打印函数调用关系，是为了通过极少次数的 bug 复现的打印，来推断问题出自何处。
经常一次死机的 log 就可以定位到问题点。

## 准备调试工具

之所以拖了很久没有解决 CDBUS Bridge 死机的 bug，有一个原因是它使用的是 Cortex M0+ 的芯片，和 M3 不同的是，
进入异常的时候，无法自动打印出函数调用关系，因为 M0+ 内核为了节约成本，有些调试相关的寄存器 CPU 自身无法读取，
只能通过 JTAG/SWD 读取。

之前抓到一次 log，显示进入了 hardfault 异常，没有其它多余信息，所以很难定位问题。
由于事情太多，又不熟 STM32 的 USB 代码，所以当时没有第一时间解决，但一直放在较高优先级的计划安排中。
（早期 CDBUS Bridge 使用 STM32F1 的时候，死机时会自动打印函数调用关系，使用 gcc 自带的 backtrace.）

由于我从事嵌入式 Linux 开发之后，就告别了 JTAG 调试，因为单步调试在很多场景都会受到限制（譬如 halt 的时候，电机驱动不再换相直接烧毁电机线圈），
而且断点信息很难保存下来和代码一起分享给其它参与者。而 log 打印则非常灵活和高效，是终极调试方案。

但是由于 M0+ 的硬件限制，只能借助 JTAG 来显示函数调用关系。


### JTAG/SWD

由于我平时使用 Linux 桌面系统，所以代码是 STM32CubeMX 生成的 Makefile 工程，直接敲一下 `make` 就能得到 hex 固件，非常方便和适合开源项目。
编辑代码我习惯使用 eclipse，仅用来编辑和阅读代码，不负责编译和调试。

下载程序使用命令行的开源工具 st-flash（IAP 更新代码则可以用 CDBUS GUI 工具）。

这个开源工具其实名为 stlink ( https://github.com/texane/stlink ), 这两天又想起来，它自带了 jtag server 工具：st-util.

启动 gdb server（和烧录代码一样使用 ST-LINK v2 硬件、SWD 接口）：  
`$ st-util`

连接 gdb：  
`$ arm-none-eabi-gdb -ex "target remote localhost:4242" /path/to/xxx.elf`

输入 `continue` 或 `c` 恢复运行程序，首次执行设备会重启。

`Ctrl + C` 可以挂起 MCU.

MCU 挂起后，输入 `where` 可以打印 backtrace, 查看函数调用关系。

`info locals` 可以查看所有局部变量。

`p xxx` 可以查看指定的全局变量，可显示结构体内部数据。

还有其它很多命令，譬如读写指定内存地址的数据，gdb 还自带了命令行版本的图形界面 TUI，有兴趣可以自己查一下。

首次打印 backtrace，显示的函数关系不全，提示 "Backtrace stopped: Cannot access memory at address 0x20023fdc".
从代码安装最新 git 版本的 stlink 就解决了（因为 stm32g0b1 比较新）。

已经想不起来十多年前我刚在 Linux 下开发 stm32 的时候为何要使用 openocd 了。


## 提高死机复现概率

提高复现概率也尝试了很多方法，第一次有效果是：

借用 Windows 电脑，在 CDPNP 网页界面中，首先打开摄像头，拍摄画面内容比较丰富的电路板（让传输的 jpg 图片大一些），
然后在网页调试终端，用定时器每 0.1 秒移动一下 X 轴（移动速度预先设置为 2 档，步进 0.1mm）。

等吸嘴快移动到最右边，我再用键盘长按左键抢控制权，把吸嘴移动到最左边（大概每左移两三次，会右移一次）。

移动的比较慢，左右来回两次差不多就会死机一次。

半个小时不到，抓到两次死机：

<img src="1.avif" style="max-width:100%" alt="Your browser may not support avif images!">

<img src="2.avif" style="max-width:100%">

由于两次死机都是访问链表的时候死掉，怀疑是 USB 接收电脑数据的时候，偶尔越界写 rx buffer 窜改了其它数据，导致内存数据错乱。
（`APP_RX_DATA_SIZE` 定义的是 2K 大小，而我提供的 rx buffer 只有 512 字节，虽然以前大概查过 `APP_RX_DATA_SIZE` 定义这么大没什么用。）


第二种效果非常好的方法是：

回到 Linux 电脑，改用 CDBUS GUI 工具，同时打开 CDPNP 机器的两个摄像头，且都拍摄比较复杂的图案。
此时，构建一个 CDBUS 数据帧（使用 echo 命令），带 CRC 共 10 bytes，发送目标是不存在的设备地址，数据重复很多次（使用 cat 命令），生成一个 5MBytes 左右的文件。
然后用 dd 命令把这个数据传输到 CDBUS Bridge 的串口节点。（串口节点同时被 CDBUS GUI 和 dd 程序打开和读写。）  
（由于数据量太大，CPU 比较慢，来不及处理，会打印很多 rx_lost 错误，临时屏蔽掉该行打印。由 rx_lost 导致的 crc error 打印相对较少则没有屏蔽。）

基本上十来秒就会死机一次：

<img src="3. increse bug times.avif" style="max-width:100%">

## 问题分析

由于第 3 次依然是链表出错，于是打开链表检查和打印，打开 `LIST_DEBUG` 定义即可（这就是打印调试的便捷之处）。  
（会顺便打开 gcc 自带的 backtrace，需要增加一些编译参数，否则编译不过，临时屏蔽掉 unwind 相关代码即可。）  

<img src="4. enable list check.avif" style="max-width:100%">

第 4 次果然链表检查提示出错，链表 `len` 成员和实际 `nodes` 数量不符。

由于很多次提示 `cdbus_uart.c` 和 `frame_free_head` 链表出错，以及提示的链表操作函数是 `list_get`, 而非 `list_get_it`, 引起了我的注意。
我打开 `cdbus_uart.c` 文件，找到出错的 169 行：

<img src="5.avif" style="max-width:100%">
<img src="6.avif" style="max-width:100%">
<img src="7.avif" style="max-width:100%">

`list_get_it` 最终也是通过 inline function 调用 `list_get` 函数，所以 backtrace 显示 `list_get` 函数也是正常的，
不能说明我没有使用 `list_get_it` 中断安全的版本。
（很多时候，backtrace 显示的内容会比较精减，要进一步查看出错位置的汇编，也很难和 c 文件对应的很好，是因为编译器优化导致，可以考虑临时设置成不优化或小优化等级，或仅部分函数或文件改优化等级。查看出错汇编和 c 程序对应关系，使用命令：`arm-none-eabi-objdump -S xxx.elf`.）

不过，以上还是引起了我的注意，毕竟是在找 bug，任何有可能出错的地方都要再三检查一下，不想一检查，真的发现我没有定义 `CDUART_IRQ_SAFE`.
因为我用 `cdbus_uart` 生成的两个虚拟设备，都是用于数据中转，仅在 main 循环中调用，没有涉及中断调用，所以没有开 `CDUART_IRQ_SAFE`.
然而，我漏掉一件事情：`cdbus_uart` 和 `cdctl_fast` 代码共用同一个 `frame_free_head` 链表，`cdctl_fast` 会在中断里面操作 `frame_free_head` 链表。
如果 `cdbus_uart` 在主循环中正在操作 `frame_free_head` 链表，`cdctl_fast` 来了中断也操作了同一个链表，那么链表肯定就会错乱，至此破案。

同样的方法，又找到另外一处最近新写的代码没有以 irq safe 方式访问 `frame_free_head` 链表：  
（`local_irq_save` 和 `_restore` 分别是关闭和打开全局中断使能。）

<img src="8.avif" style="max-width:100%">

看来各种 `free_head` 很容易被忽视，全面检查了一遍其它各种 `free_head`，没有问题，多次使用同样的测试方法，长时间不再死机。

看来这次是错怪 STM HAL 代码了，复盘想了一下，CDPNP 用户复现概率高也不是因为 Windows 操作系统，
而是用户的贴片机配置的是高帧率的新版本摄像头，而我自己暂时用的还是老版本摄像头，数据量不同，相当于我同时打开两个老摄像头。
（我之所以还没用上新版本摄像头，是因为新摄像头要做 CDPNP 升级包赠送老客户，因为事情多，拖了比较久，已经联络了部分老客户，打算一个月内全部通知到位。）


