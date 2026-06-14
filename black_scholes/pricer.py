"""
pricer.py
---------
Black-Scholes pricing formulas for European calls and puts.

Imports the math helpers from bs_core.py and implements:
  - bs_call : price a European call option
  - bs_put  : price a European put option

Put-call parity check: bs_call(...) - bs_put(...) should always equal
S - K * exp(-r * T). Use this as a sanity check.
"""

import math
from bs_core import norm_cdf, compute_d1, compute_d2


def bs_call(S: float, K: float, T: float, r: float, sigma: float) -> float:
    """
    Price a European call option using the Black-Scholes formula.

    C = S * N(d1) - K * e^(-rT) * N(d2)

    Term 1: S * N(d1)
        What you receive — the asset weighted by delta (N(d1)).
    Term 2: K * e^(-rT) * N(d2)
        What you pay — the strike discounted to present value, weighted
        by the risk-neutral probability of expiring in-the-money (N(d2)).

    Args:
        S     : Current stock price
        K     : Strike price
        T     : Time to expiry in years
        r     : Risk-free rate (annualised, continuously compounded)
        sigma : Volatility (annualised)

    Returns:
        Theoretical call price.
    """
    d1 = compute_d1(S, K, T, r, sigma)
    d2 = compute_d2(S, K, T, r, sigma)

    return S * norm_cdf(d1) - K * math.exp(-r * T) * norm_cdf(d2)


def bs_put(S: float, K: float, T: float, r: float, sigma: float) -> float:
    """
    Price a European put option using the Black-Scholes formula.

    P = K * e^(-rT) * N(-d2) - S * N(-d1)

    Term 1: K * e^(-rT) * N(-d2)
        What you receive — the strike (discounted), weighted by the
        probability the stock finishes below the strike (N(-d2)).
    Term 2: S * N(-d1)
        What you give up — the asset, weighted by the put's delta (N(-d1)).

    Note: N(-x) = 1 - N(x) by symmetry of the normal distribution.

    Args:
        S     : Current stock price
        K     : Strike price
        T     : Time to expiry in years
        r     : Risk-free rate (annualised, continuously compounded)
        sigma : Volatility (annualised)

    Returns:
        Theoretical put price.
    """
    d1 = compute_d1(S, K, T, r, sigma)
    d2 = compute_d2(S, K, T, r, sigma)

    return K * math.exp(-r * T) * norm_cdf(-d2) - S * norm_cdf(-d1)
