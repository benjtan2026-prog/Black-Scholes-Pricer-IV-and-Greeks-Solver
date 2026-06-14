# iv_solver.py

from pricer import bs_call, bs_put
from greeks import vega


def _bs_price(S, K, T, r, sigma, option_type):
    if option_type == 'call':
        return bs_call(S, K, T, r, sigma)
    else:
        return bs_put(S, K, T, r, sigma)


def newton_raphson_iv(market_price, S, K, T, r, option_type='call',
                      sigma0=0.2, tol=1e-6, max_iter=100):
    sigma = sigma0
    for i in range(max_iter):
        price = _bs_price(S, K, T, r, sigma, option_type)
        v = vega(S, K, T, r, sigma)
        if abs(v) < 1e-10:
            raise ValueError("Vega too small — Newton-Raphson unstable. Falling back to bisection.")
        diff = price - market_price
        sigma = sigma - diff / v
        sigma = max(sigma, 1e-8)
        if abs(diff) < tol:
            return sigma
    raise ValueError(f"Newton-Raphson did not converge after {max_iter} iterations.")


def bisection_iv(market_price, S, K, T, r, option_type='call',
                 sigma_low=1e-6, sigma_high=5.0, tol=1e-6, max_iter=200):
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
            sigma_high = sigma_mid
        else:
            sigma_low = sigma_mid
    return (sigma_low + sigma_high) / 2.0


def implied_volatility(market_price, S, K, T, r, option_type='call'):
    try:
        return newton_raphson_iv(market_price, S, K, T, r, option_type)
    except ValueError:
        return bisection_iv(market_price, S, K, T, r, option_type)
