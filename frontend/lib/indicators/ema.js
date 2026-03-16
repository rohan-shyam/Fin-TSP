export function CalculateEMA(Data, length) {
    const emaData = [];
    let multiplier = 2 / (length + 1);
    let emaPrev = Data[0].close; // Starting point for EMA

    for (let i = 0; i < Data.length; i++) {
        if (i < length - 1) {
            // Provide whitespace data points until the EMA can be calculated
            emaData.push({ time: Data[i].time });
        } else if (i === length - 1) {
            // Calculate the initial SMA for the first EMA value
            let sum = 0;
            for (let j = 0; j < length; j++) {
                sum += Data[i - j].close;
            }
            emaPrev = sum / length;
            emaData.push({ time: Data[i].time, value: emaPrev });
        } else {
            // Calculate the EMA using the previous EMA value
            const emaCurrent = (Data[i].close   - emaPrev) * multiplier + emaPrev; 
            emaData.push({ time: Data[i].time, value: emaCurrent });
            emaPrev = emaCurrent; // Update for the next iteration
        }
    }
    return emaData;
}