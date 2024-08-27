
/**
 * We provide custom logging interface instead of using existing one, like Winston.
 * The reason is we need to collect more information, e.g. transactions, source.
 * In addition we may send the logs to backend as well.
 *
 * This must be the only interface used for logging!
 */
interface Logger {

  render(component: string, ...optionalParams: any[]): void;

  error(message?: any, ...optionalParams: any[]): void;

  missingTranslation(name: string): void;

}

/**
 * Usage `const logger = createLogger(import.meta.url);`
 * @param url
 */
export const createLogger = (url: string | undefined): Logger => {

  const looger: Logger = {
    render: (component) => {
      console.info(`[${url}:${component}] Rendering`)
    },
    error: (message, optionalParams) => {
      console.error(`[${url}]`,message, optionalParams);
    },
    missingTranslation: (name: string) => {
      console.error(`[${url}] Missing translation for "${name}"`);
    }
  }
  return looger;
};
