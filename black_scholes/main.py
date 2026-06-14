"""
main.py
-------
Wires together the Black-Scholes pricer, Greeks, and IV solver.
Fetches a real options chain via yfinance and verifies outputs.

Run from the black_scholes/ directory:
    python main.py
"""

import math
import datetime
import yfinance as yf

from pricer import bs_call, bs_put
from greeks import delta, gamma, vega, theta, rho
from iv_solver import implied_volatility


# ─────────────────────────────────────────────
# SECTION 1: Fetch real market data
# ─────────────────────────────────────────────

TICKER = "AAPL"
RISK_FREE_RATE = 0.053  # approximate 10-yr US treasury yield

ticker = yf.Ticker(TICKER)

hist = ticker.history(period="1d")
S = hist["Close"].iloc[-1]
print(f"Current {TICKER} price: ${S:.2f}")

expiry_dates = ticker.options
print(f"\nAvailable expiries: {expiry_dates[:5]} ...")

expiry_str  = expiry_dates[1]
expiry_date = datetime.datetime.strptime(expiry_str, "%Y-%m-%d").date()

today          = datetime.date.today()
days_to_expiry = (expiry_date - today).days
T              = days_to_expiry / 365.0
print(f"\nUsing expiry: {expiry_str}  ({days_to_expiry} days, T = {T:.4f} years)")


# ─────────────────────────────────────────────
# SECTION 2: Pull the options chain
# ─────────────────────────────────────────────

chain    = ticker.option_chain(expiry_str)
calls_df = chain.calls
puts_df  = chain.puts

atm_idx  = (calls_df["strike"] - S).abs().idxmin()
atm_call = calls_df.loc[atm_idx]
atm_put  = puts_df.loc[(puts_df["strike"] - S).abs().idxmin()]

K = atm_call["strike"]
print(f"\nATM strike selected: ${K:.2f}")

call_market_price = (atm_call["bid"] + atm_call["ask"]) / 2
put_market_price  = (atm_put["bid"]  + atm_put["ask"])  / 2
print(f"ATM call mid-price: ${call_market_price:.2f}")
print(f"ATM put  mid-price: ${put_market_price:.2f}")


# ─────────────────────────────────────────────
# SECTION 3: Implied volatility
# ─────────────────────────────────────────────

call_iv = implied_volatility(call_market_price, S, K, T, RISK_FREE_RATE, 'call')
put_iv  = implied_volatility(put_market_price,  S, K, T, RISK_FREE_RATE, 'put')

print(f"\nImplied volatility (call): {call_iv * 100:.2f}%")
print(f"Implied volatility (put):  {put_iv  * 100:.2f}%")

sigma = call_iv


# ─────────────────────────────────────────────
# SECTION 4: Theoretical prices
# ─────────────────────────────────────────────

bs_call_price = bs_call(S, K, T, RISK_FREE_RATE, sigma)
bs_put_price  = bs_put(S, K, T, RISK_FREE_RATE, sigma)

print(f"\n── Theoretical Prices ──────────────────")
print(f"BS call price:     ${bs_call_price:.4f}")
print(f"Market call price: ${call_market_price:.4f}")
print(f"BS put  price:     ${bs_put_price:.4f}")
print(f"Market put  price: ${put_market_price:.4f}")


# ─────────────────────────────────────────────
# SECTION 5: Put-call parity check
# ─────────────────────────────────────────────

lhs = bs_call_price - bs_put_price
rhs = S - K * math.exp(-RISK_FREE_RATE * T)

print(f"\n── Put-Call Parity Check ───────────────")
print(f"C - P              = {lhs:.6f}")
print(f"S - K * e^(-rT)    = {rhs:.6f}")
print(f"Difference         = {abs(lhs - rhs):.2e}   (should be near zero)")


# ─────────────────────────────────────────────
# SECTION 6: Greeks
# ─────────────────────────────────────────────

call_delta = delta(S, K, T, RISK_FREE_RATE, sigma, 'call')
put_delta  = delta(S, K, T, RISK_FREE_RATE, sigma, 'put')
g          = gamma(S, K, T, RISK_FREE_RATE, sigma)
v          = vega(S, K, T, RISK_FREE_RATE, sigma)
call_theta = theta(S, K, T, RISK_FREE_RATE, sigma, 'call')
put_theta  = theta(S, K, T, RISK_FREE_RATE, sigma, 'put')
call_rho   = rho(S, K, T, RISK_FREE_RATE, sigma, 'call')
put_rho    = rho(S, K, T, RISK_FREE_RATE, sigma, 'put')

print(f"\n── Greeks ──────────────────────────────")
print(f"Delta  (call):  {call_delta:.4f}")
print(f"Delta  (put):   {put_delta:.4f}")
print(f"Gamma:          {g:.6f}   (per $1 move in stock)")
print(f"Vega:           {v / 100:.4f}  (per 1% move in vol)")
print(f"Theta  (call):  {call_theta / 365:.4f}  (per day)")
print(f"Theta  (put):   {put_theta  / 365:.4f}  (per day)")
print(f"Rho    (call):  {call_rho / 100:.4f}  (per 1% move in rates)")
print(f"Rho    (put):   {put_rho  / 100:.4f}  (per 1% move in rates)")

print(f"\n── Sanity Checks ───────────────────────")
print(f"Call delta + |put delta| = {call_delta + abs(put_delta):.4f}  (should be ≈ 1.0)")
print(f"Theta negative (call)?   {call_theta < 0}")
print(f"Vega positive?           {v > 0}")
