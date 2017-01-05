import {Component, CSSProperties} from 'react';

export interface InkProperties {
  /**
   * When true, pressing the ink will cause the background to fill with the current color
   * Default: true
   */
  background?: boolean;
  /**
   * Duration of the full animation completion
   * Default: 1000
   */
  duration?: number;
  /**
   * The opacity of the ink blob
   * Default: 0.25
   */
  opacity?: number;
  /**
   * The size of the effect, will not exceed bounds of containing element
   * Default: 150
   */
  radius?: number;
  /**
   * When true, recenter will pull ink towards the center of the containing element
   * Default: true
   */
  recenter?: boolean;
  /**
   * See src/style.js. Any rules set here will extend these values
   */
  style?: CSSProperties;
  /**
   * Override internal hasTouch detection
   */
  hasTouch?: boolean;
}

declare class Ink extends Component<InkProperties, any> {}

export default Ink;
