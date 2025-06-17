const apiKey = process.env.REACT_APP_API_KEY;
const basePath = "https://finnhub.io/api/v1";

export const searchSymbols = async (query) => {
    const url = `${basePath}/search?q=${query}&token=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
        const message = `An error occured: ${response.status}`;
        throw new Error(message);
    }

    return await response.json();
};

export const fetchStockSymbols = async (stockSymbol) => {
    const url = `${basePath}/stock/profile2?symbol=${stockSymbol}&token=${apiKey}`;
    console.log(url);
    const response = await fetch(url);

    if (!response.ok) {
        const message = `An error occured: ${response.status}`;
        throw new Error(message);
    }
    return await response.json();
};

export const fetchQuote = async (stockSymbol) => {
    const url = `${basePath}/quote?symbol=${stockSymbol}&token=${apiKey}`;
    console.log(url);
    const response = await fetch(url);

    if (!response.ok) {
        const message = `An error occured: ${response.status}`;
        throw new Error(message);
    }

   return await response.json();
}

export const fetchHistoricalData = async (stockSymbol, resolution, from, to) => {
    const url = `${basePath}/stock/candle?symbol=${stockSymbol}&resolution=${resolution}&from=${from}&to=${to}&token=${apiKey}`;
    console.log(url);
    const response = await fetch(url);

    if (!response.ok) {
        const message = `An error occured: ${response.status}`;
        throw new Error(message);
    }

    return await response.json();

}