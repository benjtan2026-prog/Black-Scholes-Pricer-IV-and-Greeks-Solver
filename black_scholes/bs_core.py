# bs_core.py

import math


def norm_cdf(x: float) -> float:
    return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))


def norm_pdf(x: float) -> float:
    return math.exp(-0.5 * x * x) / math.sqrt(2.0 * math.pi)


def compute_d1(S: float, K: float, T: float, r: float, sigma: float) -> float:
    return (math.log(S / K) + (r + 0.5 * sigma ** 2) * T) / (sigma * math.sqrt(T))


def compute_d2(S: float, K: float, T: float, r: float, sigma: float) -> float:
    d1 = compute_d1(S, K, T, r, sigma)
    return d1 - sigma * math.sqrt(T)
