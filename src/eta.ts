import { ensureDirSync } from "jsr:@std/fs@^1.0.5/ensure-dir";
import { Eta, type EtaConfig } from "jsr:@eta-dev/eta@3.5.0";
import { existsSync } from "jsr:@std/fs@^1.0.5/exists";

export { Eta, EtaConfig };

export const makeEta = (
  viewsDirectory: string,
  config?: Partial<EtaConfig>
) => {
  if (!existsSync(viewsDirectory)) {
    throw new Error(`Views directory does not exist: ${viewsDirectory}`);
  }
  const eta = new Eta({ views: viewsDirectory, cache: true, ...config });
  return eta;
};