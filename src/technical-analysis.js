import PropTypes from "prop-types";
import React, { PureComponent } from "react";
import { IntervalTypes, Themes } from "./types";

const SCRIPT_ID = "tradingview-technical-analysis-widget-script";
const CONTAINER_ID = "tradingview-technical-analysis-widget";

export class TradingViewTechnicalAnalysis extends PureComponent {
  static propTypes = {
    autosize: PropTypes.bool,
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
    widgetType: PropTypes.string,
  };

  static defaultProps = {
    autosize: true,
    width: "100%",
    height: "100%",
    interval: 60,
    locale: "en",
    symbol: "BINANCE:BTCUSDT",
    colorTheme: Themes.LIGHT,
    isTransparent: true,
    showIntervalTabs: true,
    widgetType: "widget",
  };

  containerId = `${CONTAINER_ID}-${Math.random()}`;

  componentDidMount = () => this.appendScript(this.initWidget);

  componentDidUpdate = () => {
    this.cleanWidget();
    this.initWidget();
  };

  canUseDOM = () =>
    !!(
      typeof window !== "undefined" &&
      window.document &&
      window.document.createElement
    );

  appendScript = (onload) => {
    if (!this.canUseDOM()) {
      onload();
      return;
    }

    if (this.scriptExists()) {
      /* global TradingView */
      if (typeof TradingView === "undefined") {
        this.updateOnloadListener(onload);
        return;
      }
      onload();
      return;
    }
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.type = "text/javascript";
    script.async = true;
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";

    script.onload = onload;
    document.getElementsByTagName("head")[0].appendChild(script);
  };

  getScriptElement = () => document.getElementById(SCRIPT_ID);

  scriptExists = () => this.getScriptElement() !== null;

  updateOnloadListener = (onload) => {
    const script = this.getScriptElement();
    const oldOnload = script.onload;
    return (script.onload = () => {
      oldOnload();
      onload();
    });
  };

  initWidget = () => {
    if (
      typeof TradingView === "undefined" ||
      !document.getElementById(this.containerId)
    )
      return;

    const { widgetType, ...widgetConfig } = this.props;
    const config = { ...widgetConfig, container_id: this.containerId };

    if (config.autosize) {
      delete config.width;
      delete config.height;
    }

    if (typeof config.interval === "number") {
      config.interval = config.interval.toString();
    }

    if (config.popup_width && typeof config.popup_width === "number") {
      config.popup_width = config.popup_width.toString();
    }

    if (config.popup_height && typeof config.popup_height === "number") {
      config.popup_height = config.popup_height.toString();
    }

    new TradingView[widgetType](config);
  };

  cleanWidget = () => {
    if (!this.canUseDOM()) return;
    document.getElementById(this.containerId).innerHTML = "";
  };

  getStyle = () => {
    if (!this.props.autosize) return {};
    return {
      width: "100%",
      height: "100%",
    };
  };

  render = () => <article id={this.containerId} style={this.getStyle()} />;
}
