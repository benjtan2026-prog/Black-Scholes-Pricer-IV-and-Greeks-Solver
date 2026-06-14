"""
bs_core.py
----------
Pure mathematical foundations for the Black-Scholes model.

Contains:
  - norm_cdf : cumulative distribution function of the standard normal
  - norm_pdf : probability density function of the standard normal
  - compute_d1 : the d1 intermediate value
  - compute_d2 : the d2 intermediate value

No pricing or Greeks logic lives here — this file is just math helpers
that every other module will import.
"""

import math


def norm_cdf(x: float) -> float:
    """
    Cumulative distribution function (CDF) of the standard normal distribution.

    This answers: "what is the probability that a standard normal random
    variable takes a value less than or equal to x?"

    N(0)   = 0.5   (50% of the distribution is below the mean)
    N(1.96) ≈ 0.975 (the classic 95% confidence interval boundary)
    N(-x)  = 1 - N(x) by symmetry

    We use math.erf (the error function) because the normal CDF has no
    simple closed form — erf is the standard way to compute it numerically.

    The relationship is:
        N(x) = 0.5 * (1 + erf(x / sqrt(2)))

    Args:
        x: The value at which to evaluate the CDF.

    Returns:
        Probability P(Z <= x) where Z ~ N(0, 1).
    """
    return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))


def norm_pdf(x: float) -> float:
    """
    Probability density function (PDF) of the standard normal distribution.

    This is the familiar bell curve: phi(x) = (1 / sqrt(2*pi)) * exp(-x^2 / 2)

    We need this for the Greeks — specifically Gamma, Vega, and Theta all
    involve N'(d1), which is just norm_pdf(d1).

    Note: the PDF is the *derivative* of the CDF. So norm_pdf is the rate
    at which norm_cdf is changing at any given point x.

    Args:
        x: The value at which to evaluate the PDF.

    Returns:
        The height of the bell curve at x.
    """
    return math.exp(-0.5 * x * x) / math.sqrt(2.0 * math.pi)


def compute_d1(S: float, K: float, T: float, r: float, sigma: float) -> float:
    """
    Compute d1 — the first intermediate value in the Black-Scholes formula.

    Formula:
        d1 = [ln(S/K) + (r + sigma^2/2) * T] / (sigma * sqrt(T))

    Breaking it down term by term:
      - ln(S/K)       : log-moneyness — how far the stock is from the strike
                        in log space. Positive means in-the-money (S > K).
      - (r + sigma^2/2) * T : the expected drift of the log price over time T.
                        r is the risk-free rate. The sigma^2/2 term is a
                        correction from Ito's lemma (a result from stochastic
                        calculus that adjusts for the fact that we're working
                        in log space).
      - sigma * sqrt(T) : total volatility over the life of the option —
                        we scale by sqrt(T) because volatility scales with
                        the square root of time (a property of random walks).

    Financial interpretation:
        N(d1) is the option's Delta — the hedge ratio. It tells you how many
        shares to hold to perfectly hedge one option.

    Args:
        S     : Current stock price
        K     : Strike price
        T     : Time to expiry in years (e.g. 0.5 for 6 months)
        r     : Risk-free interest rate (annualised, continuously compounded)
        sigma : Volatility of the underlying (annualised)

    Returns:
        The scalar value d1.
    """
    return (math.log(S / K) + (r + 0.5 * sigma ** 2) * T) / (sigma * math.sqrt(T))


def compute_d2(S: float, K: float, T: float, r: float, sigma: float) -> float:
    """
    Compute d2 — the second intermediate value in the Black-Scholes formula.

    Formula:
        d2 = d1 - sigma * sqrt(T)

    Or equivalently:
        d2 = [ln(S/K) + (r - sigma^2/2) * T] / (sigma * sqrt(T))

    The only difference from d1 is the sign on sigma^2/2 in the numerator.
    d2 is always <= d1.

    Financial interpretation:
        N(d2) is the risk-neutral probability that the option expires
        in-the-money — i.e. that S > K at expiry. This is the probability
        you actually end up paying (or receiving) the strike price.

    Args:
        S     : Current stock price
        K     : Strike price
        T     : Time to expiry in years
        r     : Risk-free interest rate (annualised, continuously compounded)
        sigma : Volatility of the underlying (annualised)

    Returns:
        The scalar value d2.
    """
    d1 = compute_d1(S, K, T, r, sigma)
    return d1 - sigma * math.sqrt(T)
