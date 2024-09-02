/**
 * This configuration is not provided via the React context as we
 * do not support change witout applicaiton reload.
 *
 * The idea is to restrict use of context for things we do not
 * need to watch for.
 */
export interface Configuration {

    /**
     * Value for reactflow's snap grid - x coordinate
     */
    xSnapGrid: number;
    /**
     * Value for reactflow's snap grid - y coordinate
     */
    ySnapGrid: number;

    /**
     * Specifies the distance after which should the alignment line disappear (should be multiple of xSnapGrid) - x coordinate
     */
    alignmentXSnapGrid: number;
    /**
     * Specifies the distance after which should the alignment line disappear (should be multiple of ySnapGrid) - y coordinate
     */
    alignmentYSnapGrid: number;

  }

  /**
   * Read comment for the Configuration interface above!
   */
  export const configuration = (): Configuration => {
    const xSnapGrid = 10;
    const ySnapGrid = 10;
    const alignmentXSnapGrid = xSnapGrid * 2;
    const alignmentYSnapGrid = ySnapGrid * 2;

    return {
      xSnapGrid,
      ySnapGrid,
      alignmentXSnapGrid,
      alignmentYSnapGrid
    };
  };
