export async function getHotMarkets() {
  try {
    const response = await fetch('https://gamma-api.polymarket.com/events?limit=50&closed=false', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Polymarket API failed with status:', response.status);
      return [];
    }

    const data = await response.json();
    
    console.log('API returned:', data.length || 0, 'events');
    
    if (!Array.isArray(data) || data.length === 0) {
      console.log('No events found');
      return [];
    }

    const markets = [];
    
    for (const event of data) {
      if (!event.markets || event.markets.length === 0) continue;
      
      for (const market of event.markets) {
        if (market.closed || !market.active) continue;
        
        let prices;
        try {
          prices = typeof market.outcomePrices === 'string' 
            ? JSON.parse(market.outcomePrices) 
            : market.outcomePrices;
        } catch (e) {
          continue;
        }
        
        if (!Array.isArray(prices) || prices.length !== 2) continue;
        if (parseFloat(prices[0]) === 0 && parseFloat(prices[1]) === 0) continue;
        
        // Get token IDs for trading
        const tokens = market.tokens || [market.clobTokenIds?.[0], market.clobTokenIds?.[1]];
        
        markets.push({
          id: market.id || market.conditionId || Math.random().toString(),
          question: market.question || event.title,
          description: market.description || event.description || '',
          image: market.image || event.image || market.icon || event.icon || '',
          volume: parseFloat(market.volume || market.volumeNum || 0),
          category: event.category || 'Other',
          outcomes: ['Yes', 'No'],
          outcomePrices: [
            parseFloat(prices[0]).toFixed(4),
            parseFloat(prices[1]).toFixed(4)
          ],
          tokens: tokens, // IMPORTANT: Token IDs for trading
          conditionId: market.conditionId,
        });
        
        if (markets.length >= 10) break;
      }
      
      if (markets.length >= 10) break;
    }

    console.log('Valid markets found:', markets.length);
    return markets;
    
  } catch (error) {
    console.error('Error fetching Polymarket data:', error);
    return [];
  }
}