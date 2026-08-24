import "styled-components";
import type { AppTheme } from "./theme";

declare module "styled-components" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- required for declaration merging
  export interface DefaultTheme extends AppTheme {}
}
