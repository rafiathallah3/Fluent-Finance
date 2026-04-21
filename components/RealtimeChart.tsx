import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from 'react-native';
import { CandlestickChart } from 'react-native-wagmi-charts';
import { useTradingStore } from '../store/useTradingStore';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 48;
const CHART_HEIGHT = 200;

interface OHLCData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export default function RealtimeChart() {
  const [dataPoints, setDataPoints] = useState<OHLCData[]>([]);
  const [loading, setLoading] = useState(true);
  
  const updateMarketPrice = useTradingStore((state) => state.updateMarketPrice);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin/ohlc?vs_currency=usd&days=1');
        const rawData = await response.json();

        if (Array.isArray(rawData) && rawData.length > 0) {
          const formattedData: OHLCData[] = rawData.map((pt: number[]) => ({
            timestamp: pt[0],
            open: pt[1],
            high: pt[2],
            low: pt[3],
            close: pt[4]
          }));

          setDataPoints(formattedData);
          
          const initialCurrentPrice = formattedData[formattedData.length - 1].close;
          updateMarketPrice('BTC', initialCurrentPrice);
        }
      } catch (error) {
        console.error('Failed to fetch historical BTC OHLC data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
    
    // Poll the CoinGecko API every 10 seconds for real-time updates
    const intervalId = setInterval(fetchHistory, 10000);
    
    return () => clearInterval(intervalId);
  }, [updateMarketPrice]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color="#0ea5e9" />
      </View>
    );
  }

  if (dataPoints.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#64748b' }}>No data available</Text>
      </View>
    );
  }

  const maxPrice = Math.max(...dataPoints.map(d => d.high));
  const minPrice = Math.min(...dataPoints.map(d => d.low));
  const currentPrice = dataPoints[dataPoints.length - 1].close;

  const priceRange = maxPrice - minPrice;
  const clampedPrice = Math.min(Math.max(currentPrice, minPrice), maxPrice);
  const priceLineTop = priceRange > 0 ? ((maxPrice - clampedPrice) / priceRange) * CHART_HEIGHT : CHART_HEIGHT / 2;

  const gridLines = Array.from({ length: 4 }).map((_, i) => (
    <View key={i} style={styles.gridLine} />
  ));

  return (
    <View style={styles.container}>
      <CandlestickChart.Provider data={dataPoints}>
        <View style={styles.chartWrapper}>
          {/* Background Grid Layer */}
          <View style={styles.gridContainer} pointerEvents="none">
             {gridLines}
          </View>

          {/* Dotted Price Line Overlay */}
          <View style={[styles.priceOverlayLine, { top: priceLineTop }]} pointerEvents="none">
             <View style={styles.priceOverlayLabelBox}>
               <Text style={styles.priceOverlayLabelText}>
                  ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
               </Text>
             </View>
          </View>

          {/* The Wagmi Candlestick Chart */}
          <CandlestickChart height={CHART_HEIGHT} width={CHART_WIDTH}>
            <CandlestickChart.Candles
              positiveColor="#10b981" // green
              negativeColor="#ef4444" // red
            />
            <CandlestickChart.Crosshair>
              <CandlestickChart.Tooltip
                textStyle={{ color: '#ffffff', fontWeight: '700' }}
                style={{ backgroundColor: '#1e2f47', borderRadius: 8, padding: 4 }}
              />
            </CandlestickChart.Crosshair>
          </CandlestickChart>
        </View>

        {/* Dynamic updating price label below the chart */}
        <View style={styles.interactiveDataBox}>
          <CandlestickChart.PriceText
            format={({ value }) => {
              'worklet';
              return `$${value}`;
            }}
            style={styles.scrubberPrice}
          />
          <CandlestickChart.DatetimeText
            style={styles.scrubberDate}
          />
        </View>
      </CandlestickChart.Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 16,
    backgroundColor: '#0d1729ff', 
    paddingVertical: 10,
    borderRadius: 8,
  },
  chartWrapper: {
    position: 'relative',
    height: CHART_HEIGHT,
  },
  gridContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    zIndex: -1, 
  },
  gridLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#1e2f47',
    opacity: 0.6,
  },
  priceOverlayLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#10b981',
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  priceOverlayLabelBox: {
    backgroundColor: '#10b981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    transform: [{ translateY: -10 }]
  },
  priceOverlayLabelText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  interactiveDataBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 8,
  },
  scrubberPrice: {
    color: '#0ea5e9',
    fontSize: 16,
    fontWeight: '700',
  },
  scrubberDate: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
  }
});
