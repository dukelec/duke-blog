#!/usr/bin/env python3
#
# Software License Agreement (MIT License)
#
# Author: Duke Fong <d@d-l.io>

import math
#import numpy as np
import matplotlib.pyplot as plt


def get_voltage(angle):
    v_sd = 0
    v_sq = 100 * 1.15 # deliver 15% more power by svpwm
    v_alpha = v_sd * math.cos(angle) - v_sq * math.sin(angle)
    v_beta =  v_sd * math.sin(angle) + v_sq * math.cos(angle)
    out_u = v_alpha;
    out_v = -v_alpha / 2 + v_beta * 0.866025404 # (√3÷2)
    out_w = -out_u - out_v;
    return out_u, out_v, out_w


dat_a = []
dat_u = []
dat_v = []
dat_w = []
dat_u_s = []
dat_v_s = []
dat_w_s = []

angle = 0
for i in range(1000):
    out_u, out_v, out_w = get_voltage(angle)
    
    out_min = min(out_u, min(out_v, out_w));
    out_max = max(out_u, max(out_v, out_w));
    out_mid = (out_max + out_min) / 2;
    
    dat_a.append(angle / math.pi * 180)
    dat_u.append(out_u)
    dat_v.append(out_v)
    dat_w.append(out_w)
    dat_u_s.append(out_u - out_mid)
    dat_v_s.append(out_v - out_mid)
    dat_w_s.append(out_w - out_mid)
    angle += 0.01


plt.figure()
#plt.subplot(211)
plt.setp(plt.plot(dat_a, dat_u, 'b.-'), alpha=0.05)
plt.setp(plt.plot(dat_a, dat_v, 'y.-'), alpha=0.05)
plt.setp(plt.plot(dat_a, dat_w, 'g.-'), alpha=0.05)
#plt.tight_layout()
#plt.grid()

#plt.subplot(212)
plt.setp(plt.plot(dat_a, dat_u_s, 'b.-'), alpha=0.2)
plt.setp(plt.plot(dat_a, dat_v_s, 'y.-'), alpha=0.2)
plt.setp(plt.plot(dat_a, dat_w_s, 'g.-'), alpha=0.2)
plt.tight_layout()
plt.grid()

plt.show()

