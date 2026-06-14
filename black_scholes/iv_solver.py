"""
iv_solver.py
------------
Implied volatility solver using Newton-Raphson (primary) and bisection (fallback).

  - newton_raphson_iv : fast, uses Vega as the derivative; may fail near zero vega
  - bisection_iv      : slow but guaranteed; brackets the solution and halves each step
  - implied_volatility: master function — tries NR first, falls back to bisection

Usage:
    from iv_solver import implied_volatility
    iv = implied_volatility(market_price=10.5, S=100, K=100, T=0.5, r=0.05)
"""

import math
from pricer import bs_call, bs_put
from greeks import vega


def _bs_price(S: float, K: float, T: float, r: float, sigma: float,
              option_type: str) -> float:
    """Helper: route to the correct pricer based on option_type."""
    if option_type == 'call':
        return bs_call(S, K, T, r, sigma)
    else:
        return bs_put(S, K, T, r, sigma)


def newton_raphson_iv(market_price: float, S: float, K: float, T: float, r: float,
                      option_type: str = 'call', sigma0: float = 0.2,
                      tol: float = 1e-6, max_iter: int = 100) -> float:
    """
    Find implied volatility using Newton-Raphson iteration.

    Update rule:
        sigma_new = sigma_old - (BS_price(sigma_old) - market_price) / Vega(sigma_old)

    Raises ValueError if Vega is too small or convergence fails.

    Args:
        market_price : observed option price in the market
        S, K, T, r   : standard BS inputs
        option_type  : 'call' or 'put'
        sigma0       : initial volatility guess (default 20%)
        tol          : convergence tolerance on price error
        max_iter     : maximum number of iterations before giving up
    """
    sigma = sigma0

    for i in range(max_iter):
        price = _bs_price(S, K, T, r, sigma, option_type)
        v = vega(S, K, T, r, sigma)

        if abs(v) < 1e-10:
            raise ValueError("Vega too small — Newton-Raphson unstable. Falling back to bisection.")

        diff = price - market_price
        sigma = sigma - diff / v
        sigma = max(sigma, 1e-8)  # vol must be positive

        if abs(diff) < tol:
            return sigma

    raise ValueError(f"Newton-Raphson did not converge after {max_iter} iterations.")


def bisection_iv(market_price: float, S: float, K: float, T: float, r: float,
                 option_type: str = 'call', sigma_low: float = 1e-6,
                 sigma_high: float = 5.0, tol: float = 1e-6,
                 max_iter: int = 200) -> float:
    """
    Find implied volatility using bisection search.

    Maintains a bracket [sigma_low, sigma_high] and halves it each iteration.
    Slower than Newton-Raphson but guaranteed to converge.

    Args:
        market_price        : observed option price in the market
        S, K, T, r          : standard BS inputs
        option_type         : 'call' or 'put'
        sigma_low/sigma_high: initial bracket bounds (default: near-zero to 500%)
        tol                 : convergence tolerance on price error
        max_iter            : maximum iterations
    """
    price_low = _bs_price(S, K, T, r, sigma_low, option_type)
    price_high = _bs_price(S, K, T, r, sigma_high, option_type)

    if price_low > market_price:
        raise ValueError("Market price below minimum BS can produce. Check inputs.")
    if price_high < market_price:
        raise ValueError("Market price above maximum BS can produce. Check inputs.")

    for i in range(max_iter):
        sigma_mid = (sigma_low + sigma_high) / 2.0
        price_mid = _bs_price(S, K, T, r, sigma_mid, option_type)
        diff = price_mid - market_price

        if abs(diff) < tol:
            return sigma_mid

        if diff > 0:
            sigma_high = sigma_mid  # true sigma in left half
        else:
            sigma_low = sigma_mid   # true sigma in right half

    return (sigma_low + sigma_high) / 2.0  # best estimate


def implied_volatility(market_price: float, S: float, K: float, T: float, r: float,
                       option_type: str = 'call') -> float:
    """
    Master IV solver: tries Newton-Raphson first, falls back to bisection.

    This is the function all external code should call.

    Args:
        market_price : observed option price
        S, K, T, r   : standard BS inputs
        option_type  : 'call' or 'put'

    Returns:
        Implied volatility as a decimal (e.g. 0.25 means 25%).
    """
    try:
        return newton_raphson_iv(market_price, S, K, T, r, option_type)
    except ValueError:
        return bisection_iv(market_price, S, K, T, r, option_type)
