# pricer.py

import math
from bs_core import norm_cdf, compute_d1, compute_d2


def bs_call(S: float, K: float, T: float, r: float, sigma: float) -> float:
    d1 = compute_d1(S, K, T, r, sigma)
    d2 = compute_d2(S, K, T, r, sigma)
    return S * norm_cdf(d1) - K * math.exp(-r * T) * norm_cdf(d2)


def bs_put(S: float, K: float, T: float, r: float, sigma: float) -> float:
    d1 = compute_d1(S, K, T, r, sigma)
    d2 = compute_d2(S, K, T, r, sigma)
    return K * math.exp(-r * T) * norm_cdf(-d2) - S * norm_cdf(-d1)
