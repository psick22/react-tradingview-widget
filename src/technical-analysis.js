import PropTypes from "prop-types";
import React, { PureComponent } from "react";
import { IntervalTypes, Themes } from "./types";

const SCRIPT_ID = "tradingview-technical-analysis-widget-script";
const CONTAINER_ID = "tradingview-technical-analysis-widget";

export class TradingViewTechnicalAnalysis extends PureComponent {
  static propTypes = {
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    interval: PropTypes.oneOf([
      1,
      3,
      5,
      15,
      30,
      60,
      120,
      180,
      "1",
      "3",
      "5",
      "15",
      "30",
      "60",
      "120",
      "180",
      IntervalTypes.D,
      IntervalTypes.W,
    ]),
    locale: PropTypes.string,
    symbol: PropTypes.string.isRequired,
    colorTheme: PropTypes.oneOf([Themes.LIGHT, Themes.DARK]),
    isTransparent: PropTypes.bool,
    showIntervalTabs: PropTypes.bool,
  };

  static defaultProps = {
    width: "100%",
    height: "100%",
    interval: 60,
    locale: "en",
    symbol: "BINANCE:BTCUSDT",
    colorTheme: Themes.LIGHT,
    isTransparent: true,
    showIntervalTabs: true,
  };

  containerId = `${CONTAINER_ID}-${Math.random()}`;

  componentDidMount = () => setTimeout(this.appendScript, 100);

  appendScript = () => {
    const script = document.createElement("script");

    script.id = SCRIPT_ID;
    script.type = "text/javascript";
    script.async = true;
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    script.onload = onload;
    script.innerHTML = JSON.stringify({
      ...TradingViewTechnicalAnalysis.defaultProps,
      ...this.props,
    });

    document.getElementById(this.containerId).appendChild(script);
  };

  render = () => <article id={this.containerId}></article>;
}
