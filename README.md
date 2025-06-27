# Nikko William Strategy

This script is a trading strategy based on **Williams %R**, a momentum oscillator that helps identify overbought and oversold conditions in the market. It utilizes **Pine Script v6** on **TradingView** for algorithmic trading and assists traders in making buy and sell decisions based on certain criteria and conditions.

---

## General Overview

The **Nikko William Strategy** uses the **Williams %R** indicator to determine when to initiate buy or sell positions in the market. It operates in a **non-overlay** mode (i.e., the strategy doesn't draw on the price chart), with **strategy.entry** used for opening positions and **strategy.close** or **strategy.close_all** for closing them. The strategy involves an option to close all positions when a bearish signal is detected or simply enter short positions.

The script allows users to customize various parameters related to **Williams %R** and other settings, such as the **Simple Moving Average (SMA)** period and **bar multiples** for triggering trades. Additionally, it features a **heatmap** that visually represents the Williams %R value and its relation to overbought/oversold conditions.

---

## Key Features and Components

### Inputs (User Configurations)
1. **Williams %R Settings**: 
    - **Bar Multiple**: This input defines how often the strategy will trigger a buy or sell condition. For example, if the value is 3, the strategy will only look for buy or sell signals every 3rd bar on the chart.
    - **Williams Length**: The length or period used in the Williams %R calculation, typically between 10 and 100, which defines the range of bars to consider when calculating the highest high and lowest low.
    - **Williams % Limit Up/Down**: These values represent the upper and lower thresholds for Williams %R. A sell signal is triggered if the value exceeds the upper limit, while a buy signal occurs if the value drops below the lower limit.
    - **Source**: Defines the price used for the calculation of Williams %R. The default value is the close price.
    - **Close All on Bearish Signal**: This boolean input allows you to specify whether all positions should be closed if a bearish signal is triggered.

2. **Simple Moving Average (SMA)**:
    - The strategy calculates a 20-period **SMA** to evaluate market direction. The strategy buys only if the price is above the SMA, indicating an uptrend.

### Signal Logic
- The strategy looks for signals based on the **Williams %R** oscillator.
- **Buy Signal**: A **buy signal** is generated when:
    - **Williams %R** is below the lower threshold (i.e., **Williams % Limit Down**).
    - The bar index is divisible by the specified **bar multiple** (for periodic checks).
    - The close price is above the 20-period SMA (confirming an uptrend).
- **Sell Signal**: A **sell signal** is triggered when:
    - **Williams %R** rises above the upper threshold (i.e., **Williams % Limit Up**).
    - Similarly, the strategy checks for **bar multiples** and the 20-period SMA for confirmation.

### Trade Execution
- **Buy Entry**: When a buy signal is detected, the strategy opens a **long position** (buy) using `strategy.entry("Buy Long", strategy.long)`.
- **Sell Entry**: When a sell signal is detected, the strategy either enters a **short position** (sell) using `strategy.entry("Sell Short", strategy.short)`. If the **Close All on Bearish** option is enabled, all positions are closed instead of initiating a short trade.

### Heatmap Visualization
- The script plots a **heatmap** representing the normalized value of Williams %R. The heatmap scales the value from 0 to 100, with red representing lower values (overbought) and green indicating higher values (oversold). This provides a quick visual reference for traders on market conditions.
- **Heatmap Calculation**: The script normalizes the **Williams %R** value (ranging from -100 to 0), where values closer to 0 represent a stronger sell condition, and values closer to -100 indicate a stronger buy condition. The heatmap adjusts its color intensity accordingly.

---

## Logic Flow

1. **Williams %R Calculation**:  
   The script first calculates the **Williams %R** using the highest high and lowest low over the defined **Williams Length** period. The formula used is:

   \[
   \text{Williams %R} = 100 \times \frac{(\text{Current Price} - \text{Highest High in Period})}{(\text{Highest High in Period} - \text{Lowest Low in Period})}
   \]

2. **Signal Generation**:
   - **Buy Signal**: Triggered when **Williams %R** falls below the lower threshold and the price is above the SMA.
   - **Sell Signal**: Triggered when **Williams %R** rises above the upper threshold.

3. **Trade Execution**:
   - When a buy signal is detected, the strategy opens a long position. When a sell signal is detected, the strategy either enters a short position or closes all positions (depending on settings).

4. **Heatmap Visualization**:
   - The script displays a **colored heatmap** that represents the strength of the buy/sell signal, helping traders visually evaluate the market conditions.

---

## Advantages of the Strategy

- **Dynamic Entry and Exit**: The strategy dynamically enters and exits positions based on the **Williams %R** oscillator, allowing it to capture potential reversals or continuation moves in the market.
- **Customizability**: Users can adjust the parameters such as the **Williams Length**, **Bar Multiple**, and the **SMA period** to tailor the strategy to their preferred trading style.
- **Visual Feedback**: The heatmap provides a quick, visual way to understand market conditions and the current state of Williams %R.
- **Periodic Signal Checking**: The strategy only checks for signals every "x" bars, preventing unnecessary signals and reducing market noise.

---

## Possible Limitations

- **Overfitting**: The strategy might be sensitive to certain parameters, meaning it could overfit to historical data. Proper backtesting on multiple timeframes and assets is recommended.
- **Market Conditions**: As with all technical indicators, the **Williams %R** works best in certain market conditions, such as trending markets, and might be less effective in choppy or sideways markets.
- **No Risk Management**: This script does not incorporate advanced risk management features like stop-loss or take-profit levels, so users should implement their own risk control mechanisms.

---

## Conclusion

The **Nikko William Strategy** is a trend-following and momentum-based trading strategy designed to trigger buy and sell signals based on the **Williams %R** oscillator. It allows for flexibility through adjustable parameters and provides a visual heatmap for market conditions. While effective in trending markets, traders should ensure that proper backtesting and risk management practices are in place before deploying the strategy in live trading.
