/**
 * Climate Data Analyzer
 * By: [Your Name]
 * AP Computer Science Principles - 2025
 * 
 * This program analyzes global temperature data to identify climate trends.
 * The program demonstrates:
 *   - File input (simulated with arrays)
 *   - Data collection manipulation
 *   - Custom procedures with parameters
 *   - Complex algorithms with sequence, selection, and iteration
 *   - Visual and textual output
 */

// Global variables
let temperatureData = [];
let years = [];
let predictions = [];

// Event listener for when the DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set up event listeners for buttons
    document.getElementById('loadData').addEventListener('click', loadClimateData);
    document.getElementById('analyzeData').addEventListener('click', function() {
        const results = analyzeTemperatureData(temperatureData, years);
        displayResults(results);
    });
    document.getElementById('predictFuture').addEventListener('click', function() {
        predictions = predictFutureTemperatures(temperatureData, years, 10);
        displayPredictions(predictions);
    });
});

/**
 * Simulates loading climate data from a file or API
 * In a real implementation, this would use fetch() to get data from a file/API
 */
function loadClimateData() {
    // Simulating data loading from a file with sample data
    console.log("Loading climate data...");
    
    // Clear previous data
    temperatureData = [];
    years = [];
    
    // Get starting year and temperature from user input
    const startYear = parseInt(document.getElementById('startYear').value) || 1990;
    const startTemp = parseFloat(document.getElementById('startTemp').value) || 14.0;
    
    // Generate sample data
    let currentTemp = startTemp;
    for (let i = 0; i < 30; i++) {
        years.push(startYear + i);
        // Add some randomness to make data more realistic
        currentTemp += (Math.random() * 0.2 - 0.05);
        temperatureData.push(parseFloat(currentTemp.toFixed(2)));
    }
    
    // Display the loaded data
    const dataContainer = document.getElementById('dataContainer');
    dataContainer.innerHTML = '<h3>Loaded Climate Data:</h3>';
    
    const dataTable = document.createElement('table');
    dataTable.innerHTML = `
        <tr>
            <th>Year</th>
            <th>Temperature (°C)</th>
        </tr>
    `;
    
    for (let i = 0; i < years.length; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${years[i]}</td>
            <td>${temperatureData[i]}</td>
        `;
        dataTable.appendChild(row);
    }
    
    dataContainer.appendChild(dataTable);
    console.log("Data loaded successfully!");
}

/**
 * Analyzes temperature data to identify trends and statistics
 * 
 * @param {Array} tempData - Array of temperature values
 * @param {Array} yearData - Array of corresponding years
 * @return {Object} Object containing analysis results
 */
function analyzeTemperatureData(tempData, yearData) {
    // Check if we have valid data
    if (tempData.length === 0 || yearData.length === 0) {
        return {
            error: "No data to analyze"
        };
    }
    
    // Initialize result object
    const results = {
        averageTemp: 0,
        minTemp: tempData[0],
        maxTemp: tempData[0],
        minYear: yearData[0],
        maxYear: yearData[0],
        overallTrend: "",
        warmingRate: 0,
        anomalies: []
    };
    
    // Calculate average temperature
    let sum = 0;
    for (let i = 0; i < tempData.length; i++) {
        sum += tempData[i];
        
        // Find minimum and maximum temperatures
        if (tempData[i] < results.minTemp) {
            results.minTemp = tempData[i];
            results.minYear = yearData[i];
        }
        if (tempData[i] > results.maxTemp) {
            results.maxTemp = tempData[i];
            results.maxYear = yearData[i];
        }
    }
    results.averageTemp = parseFloat((sum / tempData.length).toFixed(2));
    
    // Calculate warming rate (temperature change per year)
    if (tempData.length > 1) {
        const firstTemp = tempData[0];
        const lastTemp = tempData[tempData.length - 1];
        const firstYear = yearData[0];
        const lastYear = yearData[yearData.length - 1];
        
        results.warmingRate = parseFloat(((lastTemp - firstTemp) / (lastYear - firstYear)).toFixed(3));
        
        if (results.warmingRate > 0.01) {
            results.overallTrend = "Significant warming";
        } else if (results.warmingRate > 0) {
            results.overallTrend = "Slight warming";
        } else if (results.warmingRate < -0.01) {
            results.overallTrend = "Significant cooling";
        } else if (results.warmingRate < 0) {
            results.overallTrend = "Slight cooling";
        } else {
            results.overallTrend = "No significant change";
        }
    }
    
    // Find temperature anomalies (values that are significantly different from neighbors)
    for (let i = 1; i < tempData.length - 1; i++) {
        const prev = tempData[i-1];
        const current = tempData[i];
        const next = tempData[i+1];
        
        // If a temperature differs from both neighbors by more than 0.5°C
        if ((Math.abs(current - prev) > 0.5) && (Math.abs(current - next) > 0.5)) {
            results.anomalies.push({
                year: yearData[i],
                temperature: current,
                difference: parseFloat(((current - (prev + next) / 2)).toFixed(2))
            });
        }
    }
    
    return results;
}

/**
 * Predicts future temperatures based on historical data
 * 
 * @param {Array} tempData - Historical temperature data
 * @param {Array} yearData - Corresponding years
 * @param {Number} years - Number of years to predict
 * @return {Array} Array of prediction objects with year and predicted temperature
 */
function predictFutureTemperatures(tempData, yearData, years) {
    // We need at least 2 data points to make a prediction
    if (tempData.length < 2) {
        return [];
    }
    
    const predictions = [];
    
    // Calculate the average annual change
    let totalChange = 0;
    for (let i = 1; i < tempData.length; i++) {
        totalChange += (tempData[i] - tempData[i-1]);
    }
    const avgAnnualChange = totalChange / (tempData.length - 1);
    
    // Make predictions for future years
    const lastYear = yearData[yearData.length - 1];
    const lastTemp = tempData[tempData.length - 1];
    
    for (let i = 1; i <= years; i++) {
        const predictedYear = lastYear + i;
        const predictedTemp = parseFloat((lastTemp + (avgAnnualChange * i)).toFixed(2));
        
        predictions.push({
            year: predictedYear,
            temperature: predictedTemp
        });
    }
    
    return predictions;
}

/**
 * Displays analysis results in the UI
 * 
 * @param {Object} results - Analysis results from analyzeTemperatureData
 */
function displayResults(results) {
    const resultsContainer = document.getElementById('resultsContainer');
    
    if (results.error) {
        resultsContainer.innerHTML = `<p class="error">${results.error}</p>`;
        return;
    }
    
    resultsContainer.innerHTML = `
        <h3>Climate Analysis Results:</h3>
        <p><strong>Average Temperature:</strong> ${results.averageTemp}°C</p>
        <p><strong>Temperature Range:</strong> ${results.minTemp}°C (${results.minYear}) to ${results.maxTemp}°C (${results.maxYear})</p>
        <p><strong>Overall Trend:</strong> ${results.overallTrend}</p>
        <p><strong>Warming Rate:</strong> ${results.warmingRate}°C per year</p>
    `;
    
    if (results.anomalies.length > 0) {
        const anomaliesList = document.createElement('div');
        anomaliesList.innerHTML = '<h4>Temperature Anomalies:</h4>';
        
        const anomaliesUl = document.createElement('ul');
        results.anomalies.forEach(anomaly => {
            const li = document.createElement('li');
            li.textContent = `${anomaly.year}: ${anomaly.temperature}°C (${anomaly.difference > 0 ? '+' : ''}${anomaly.difference}°C anomaly)`;
            anomaliesUl.appendChild(li);
        });
        
        anomaliesList.appendChild(anomaliesUl);
        resultsContainer.appendChild(anomaliesList);
    }
    
    // Create a simple ASCII visualization of the temperature trend
    const visualization = document.createElement('div');
    visualization.innerHTML = '<h4>Temperature Trend Visualization:</h4>';
    const visualDiv = document.createElement('pre');
    visualDiv.classList.add('visualization');
    
    // Get min and max for scaling
    const min = Math.min(...temperatureData);
    const max = Math.max(...temperatureData);
    const range = max - min;
    const height = 10; // Height of visualization
    
    let visualText = '';
    for (let row = 0; row < height; row++) {
        const tempLine = height - row - 1;
        const tempValue = min + (range * (tempLine / (height - 1)));
        
        // Add y-axis label
        visualText += `${tempValue.toFixed(1)}° |`;
        
        // Add data points
        for (let i = 0; i < temperatureData.length; i++) {
            const temp = temperatureData[i];
            const tempPosition = Math.round((temp - min) / range * (height - 1));
            
            if (tempPosition === tempLine) {
                visualText += '*';
            } else if (i > 0 && 
                       ((temperatureData[i-1] - min) / range * (height - 1) < tempLine) && 
                       ((temp - min) / range * (height - 1) > tempLine)) {
                visualText += '|'; // Line connecting points
            } else {
                visualText += ' ';
            }
        }
        visualText += '\n';
    }
    
    // Add x-axis
    visualText += '     +';
    for (let i = 0; i < temperatureData.length; i++) {
        visualText += '-';
    }
    visualText += '\n      ';
    
    // Add year labels (just a few to avoid clutter)
    const step = Math.ceil(years.length / 5);
    for (let i = 0; i < years.length; i += step) {
        const yearLabel = years[i].toString();
        visualText += yearLabel + ' '.repeat(step - yearLabel.length);
    }
    
    visualDiv.textContent = visualText;
    visualization.appendChild(visualDiv);
    resultsContainer.appendChild(visualization);
}

/**
 * Displays future temperature predictions
 * 
 * @param {Array} predictions - Array of prediction objects
 */
function displayPredictions(predictions) {
    const predictionsContainer = document.getElementById('predictionsContainer');
    
    if (predictions.length === 0) {
        predictionsContainer.innerHTML = '<p class="error">Not enough data to make predictions</p>';
        return;
    }
    
    predictionsContainer.innerHTML = '<h3>Future Temperature Predictions:</h3>';
    
    const table = document.createElement('table');
    table.innerHTML = `
        <tr>
            <th>Year</th>
            <th>Predicted Temperature (°C)</th>
        </tr>
    `;
    
    predictions.forEach(prediction => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${prediction.year}</td>
            <td>${prediction.temperature}</td>
        `;
        table.appendChild(row);
    });
    
    predictionsContainer.appendChild(table);
    
    // Add warning about predictions
    const warning = document.createElement('p');
    warning.classList.add('warning');
    warning.textContent = 'Note: These predictions are based on a simple linear model and don\'t account for complex climate factors or potential policy changes.';
    predictionsContainer.appendChild(warning);
}
