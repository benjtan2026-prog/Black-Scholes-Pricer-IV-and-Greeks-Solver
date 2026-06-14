"""
greeks.py
---------
All five Black-Scholes Greeks for European options.

  - delta  : sensitivity to stock price (dC/dS)
  - gamma  : rate of change of delta (d²C/dS²)
  - vega   : sensitivity to volatility (dC/dsigma)
  - theta  : time decay (dC/dT) — returned as annual figure, divide by 365 for daily
  - rho    : sensitivity to interest rates (dC/dr)

Gamma and Vega are identical for calls and puts.
Delta, Theta, and Rho differ — pass option_type='call' or 'put'.
"""

import math
from bs_core import norm_cdf, norm_pdf, compute_d1, compute_d2


def delta(S: float, K: float, T: float, r: float, sigma: float,
          option_type: str = 'call') -> float:
    """
    Delta = dC/dS

    How much the option price moves per $1 move in the stock.
    Call delta: N(d1), range [0, 1]
    Put delta:  N(d1) - 1, range [-1, 0]
    """
    d1 = compute_d1(S, K, T, r, sigma)

    if option_type == 'call':
        return norm_cdf(d1)
    else:
        return norm_cdf(d1) - 1


def gamma(S: float, K: float, T: float, r: float, sigma: float) -> float:
    """
    Gamma = d²C/dS²

    Rate of change of delta w.r.t. stock price. Same for calls and puts.
    Always positive. Highest when ATM and near expiry.
    """
    d1 = compute_d1(S, K, T, r, sigma)

    return norm_pdf(d1) / (S * sigma * math.sqrt(T))


def vega(S: float, K: float, T: float, r: float, sigma: float) -> float:
    """
    Vega = dC/dsigma

    How much the option price changes per 1-unit move in volatility.
    Same for calls and puts. Always positive.
    Divide by 100 to express per 1% move in vol.
    """
    d1 = compute_d1(S, K, T, r, sigma)

    return S * norm_pdf(d1) * math.sqrt(T)


def theta(S: float, K: float, T: float, r: float, sigma: float,
          option_type: str = 'call') -> float:
    """
    Theta = dC/dT

    How much value the option loses per year from time passing.
    Almost always negative. Divide by 365 for daily theta decay.

    Two terms:
      Term 1: time decay of optionality (same for calls and puts)
      Term 2: interest rate effect on discounted strike (differs by type)
    """
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
    """
    Rho = dC/dr

    Sensitivity to interest rates. Least impactful Greek in practice.
    Call rho positive (higher rates → calls more valuable).
    Put rho negative (higher rates → puts less valuable).
    """
    d2 = compute_d2(S, K, T, r, sigma)

    if option_type == 'call':
        return K * T * math.exp(-r * T) * norm_cdf(d2)
    else:
        return -K * T * math.exp(-r * T) * norm_cdf(-d2)
