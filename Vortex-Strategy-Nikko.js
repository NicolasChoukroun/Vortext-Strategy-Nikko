//@version=6
// 2025- by Nikko
// CryptoNikkoid Alerts script may be freely distributed under the terms of the GPL-3.0 license.

strategy("Nikko William Strategy", overlay=false, initial_capital=10000, default_qty_value=20, pyramiding=5, default_qty_type=strategy.percent_of_equity, commission_value=0.06)

//-------------------------------------------------------------
// Williams %R Strategy Settings

// Indicator states for buy and sell
bool isWilliamsSellSignal = false
bool isWilliamsBuySignal = false

// Input parameters for Williams %R strategy
int williamsBarMultiple = input.int(title="Bar Multiple", defval=3, group="Williams Settings") // Determine every how many bars a signal is generated
bool closeAllOnBearish = input.bool(title="Close All when Bearish?", defval=false, group="Williams Settings") // Option to close all positions on bearish signal

// Williams %R Length and limits
int williamsLength = input.int(title="Williams Length", defval=56, group="Williams Settings") // Period for Williams %R calculation
float williamsLimitUp = input.float(title="Williams % Limit Up", defval=-1, group="Williams Settings") // Upper limit for sell signal
float williamsLimitDown = input.float(title="Williams % Limit Down", defval=-99, group="Williams Settings") // Lower limit for buy signal
williamsSource = input(close, "Williams Source", group="Williams Settings") // The price source for Williams %R calculation

// Simple Moving Average (SMA) for condition check
sma = ta.sma(close, 20) // 20-period SMA for market direction
everyXBars = bar_index % williamsBarMultiple == 0 // Condition to buy/sell every 'x' bars
barBuyCondition = close > sma // Condition to check if the close is above SMA

// Williams %R calculation function
calculateWilliamsPercentR(length) =>
    highestHigh = ta.highest(williamsSource, length) // Highest price in the window
    lowestLow = ta.lowest(williamsSource, length) // Lowest price in the window
    100 * (williamsSource - highestHigh) / (highestHigh - lowestLow) // Williams %R formula

williamsPercentR = calculateWilliamsPercentR(williamsLength) // Calculate Williams %R

// Signal conditions
if williamsPercentR > williamsLimitUp 
    isWilliamsSellSignal := true // Generate sell signal if above upper limit

if williamsPercentR < williamsLimitDown
    isWilliamsBuySignal := true // Generate buy signal if below lower limit

//=================================================================
// Variables to hold buy and sell signals
bool buySignal = false
bool sellSignal = false

//+++++++++++++++++ BUY CONDITION +++++++++++++++++++++
if isWilliamsBuySignal and everyXBars // If it's time to check and Williams %R is below the limit
    buySignal := true // Set buy signal

//+++++++++++++++++ SELL CONDITION  +++++++++++++++++++++
if isWilliamsSellSignal and everyXBars // If it's time to check and Williams %R is above the limit
    sellSignal := true // Set sell signal

// Plot the possible signals so you can evaluate the strategy performance
// Uncomment these lines to plot buy and sell shapes on the chart for evaluation
//plotshape(buySignal ? close : na, title="Buy Signal", location=location.absolute, style=shape.circle, size=size.tiny, color=color.green, textcolor=color.white)
//plotshape(sellSignal ? open : na, title="Sell Signal", location=location.absolute, style=shape.circle, size=size.tiny, color=color.red, textcolor=color.white)

// Display strategy entries based on signals
if buySignal 
    strategy.entry("Buy Long", strategy.long) // Execute buy strategy

if sellSignal
    if closeAllOnBearish // If close all positions option is enabled
        strategy.close_all() // Close all positions
    else
        strategy.entry("Sell Short", strategy.short) // Execute short strategy

// Percentage debug to help with tuning the strategy
//plot(buySignal ? close : na, "Buy", color.orange)
//plot(sellSignal ? close : na, "Sell", color.green)

// === Heatmap Display for Williams %R ===
x = williamsPercentR // Williams %R value

// Normalize the value between 0 and 1 (inverted, because higher values are worse for buying)
normalizedX = (-x) / 100 // Normalized value (0 = bad, 1 = good)

// Scale the value to height, with 0 being the bottom and 1 being the top
scaledHeight = normalizedX * 100 

// Color scale for the heatmap: red for bad, green for good
r = (1 - normalizedX) * 255 // Red value
g = normalizedX * 255 // Green value
barColor = color.rgb(int(r), int(g), 0) // Color bar based on normalized value

// Plot the heatmap bar on the chart
plot(scaledHeight, title="Reversed Heatmap Bar", style=plot.style_columns, color=barColor, linewidth=6)

// Visual reference lines for the Williams %R range (optional)
//hline(0, "Bottom", color=color.gray, linestyle=hline.style_dotted)
//hline(100, "Top", color=color.gray, linestyle=hline.style_dotted)
