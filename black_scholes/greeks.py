# greeks.py

import math
from bs_core import norm_cdf, norm_pdf, compute_d1, compute_d2


def delta(S: float, K: float, T: float, r: float, sigma: float,
          option_type: str = 'call') -> float:
    d1 = compute_d1(S, K, T, r, sigma)
    if option_type == 'call':
        return norm_cdf(d1)
    else:
        return norm_cdf(d1) - 1


def gamma(S: float, K: float, T: float, r: float, sigma: float) -> float:
    d1 = compute_d1(S, K, T, r, sigma)
    return norm_pdf(d1) / (S * sigma * math.sqrt(T))


def vega(S: float, K: float, T: float, r: float, sigma: float) -> float:
    d1 = compute_d1(S, K, T, r, sigma)
    return S * norm_pdf(d1) * math.sqrt(T)


def theta(S: float, K: float, T: float, r: float, sigma: float,
          option_type: str = 'call') -> float:
    d1 = compute_d1(S, K, T, r, sigma)
    d2 = compute_d2(S, K, T, r, sigma)
    term1 = -(S * norm_pdf(d1) * sigma) / (2 * math.sqrt(T))
    if option_type == 'call':
        term2 = -r * K * math.exp(-r * T) * norm_cdf(d2)
        return term1 + term2
    else:
        term2 = r * K * math.exp(-r * T) * norm_cdf(-d2)
        return term1 + term2


def rho(S: float, K: float, T: float, r: float, sigma: float,
        option_type: str = 'call') -> float:
    d2 = compute_d2(S, K, T, r, sigma)
    if option_type == 'call':
        return K * T * math.exp(-r * T) * norm_cdf(d2)
    else:
        return -K * T * math.exp(-r * T) * norm_cdf(-d2)
